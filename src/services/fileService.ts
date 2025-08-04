interface FileItem {
  Key: string;
  Size: number;
  url: string;
}

interface ApiResponse {
  files: FileItem[];
  folders: string[];
}

interface UploadResult {
  fileName: string;
  status: 'success' | 'error';
  error?: string;
  uploadTime?: number;
}

class FileService {
  /**
   * Fetch files and folders from a specific prefix/directory
   */
  async fetchObjects(prefix: string = ''): Promise<ApiResponse> {
    const url = prefix 
      ? `/api/objects?prefix=${encodeURIComponent(prefix)}`
      : '/api/objects';
    
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Failed to fetch files');
    }
    
    return response.json();
  }

  /**
   * Get signed URL for file upload
   */
  async getUploadUrl(key: string): Promise<{ url: string }> {
    console.log('🔗 Getting upload URL for key:', key);
    
    const response = await fetch(`/api/upload?key=${encodeURIComponent(key)}`, {
      method: 'PUT'
    });
    
    console.log('📡 Upload URL response status:', response.status);
    
    if (!response.ok) {
      console.error('❌ Failed to get upload URL, response:', {
        status: response.status,
        statusText: response.statusText
      });
      throw new Error(`Failed to get upload URL for ${key}`);
    }
    
    const result = await response.json();
    console.log('✅ Upload URL received:', { key, hasUrl: !!result.url });
    return result;
  }

  /**
   * Upload file to S3 using signed URL
   */
  async uploadFileToS3(url: string, file: File): Promise<void> {
    console.log('🔗 Uploading to S3:', { fileName: file.name, fileSize: file.size, contentType: file.type });
    console.log('📡 Upload URL (first 50 chars):', url.substring(0, 50) + '...');
    
    const response = await fetch(url, {
      method: 'PUT',
      body: file,
      headers: {
        'Content-Type': file.type,
      },
    });
    
    console.log('📡 S3 upload response:', { 
      status: response.status, 
      statusText: response.statusText,
      ok: response.ok 
    });
    
    if (!response.ok) {
      console.error('❌ S3 upload failed:', {
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries())
      });
      throw new Error(`Failed to upload ${file.name} - Status: ${response.status}`);
    }
    
    console.log('✅ S3 upload successful for:', file.name);
  }

  /**
   * Upload multiple files with progress tracking
   */
  async uploadFiles(
    files: FileList | File[], 
    targetPrefix: string = '',
    onProgress?: (completed: number, total: number) => void
  ): Promise<UploadResult[]> {
    const fileArray = Array.from(files);
    console.log('📤 Starting sequential upload of', fileArray.length, 'files');
    console.log('📂 Target prefix:', targetPrefix);
    console.log('📄 Files to upload:', fileArray.map(f => ({ name: f.name, size: f.size })));
    
    const uploadResults: UploadResult[] = [];
    let completed = 0;

    // Process files one by one to avoid overwhelming the server
    for (const file of fileArray) {
      const startTime = Date.now();
      console.log(`🔄 Processing file ${completed + 1}/${fileArray.length}: ${file.name}`);

      try {
        // Create the full key for the file
        const key = targetPrefix ? `${targetPrefix}${file.name}` : file.name;
        console.log('🔑 Generated key:', key);
        
        // Get signed URL for upload
        console.log('📡 Getting signed URL...');
        const { url } = await this.getUploadUrl(key);
        
        // Upload file to S3 using signed URL
        console.log('⬆️ Uploading to S3...');
        await this.uploadFileToS3(url, file);
        
        const uploadTime = Date.now() - startTime;
        console.log(`✅ File ${file.name} uploaded successfully in ${uploadTime}ms`);

        const result: UploadResult = {
          fileName: file.name,
          status: 'success',
          uploadTime
        };

        uploadResults.push(result);
        completed++;
        
        // Call progress callback if provided
        if (onProgress) {
          console.log(`📊 Progress callback: ${completed}/${fileArray.length}`);
          onProgress(completed, fileArray.length);
        }
        
      } catch (error) {
        const uploadTime = Date.now() - startTime;
        console.error(`❌ Failed to upload ${file.name}:`, error);
        console.error('Error details:', {
          message: (error as Error)?.message || 'Unknown error',
          stack: (error as Error)?.stack || 'No stack trace'
        });
        
        const result: UploadResult = {
          fileName: file.name,
          status: 'error',
          error: error instanceof Error ? error.message : 'Unknown error',
          uploadTime
        };

        uploadResults.push(result);
        completed++;
        
        // Call progress callback if provided
        if (onProgress) {
          console.log(`📊 Progress callback (with error): ${completed}/${fileArray.length}`);
          onProgress(completed, fileArray.length);
        }
      }
    }

    console.log('🏁 Upload process completed. Results summary:');
    console.log('  - Total files:', uploadResults.length);
    console.log('  - Successful:', uploadResults.filter(r => r.status === 'success').length);
    console.log('  - Failed:', uploadResults.filter(r => r.status === 'error').length);
    console.log('  - Results:', uploadResults);

    return uploadResults;
  }

  /**
   * Upload multiple files concurrently with progress tracking
   * Use this for better performance when uploading many small files
   */
  async uploadFilesConcurrent(
    files: FileList | File[], 
    targetPrefix: string = '',
    onProgress?: (completed: number, total: number) => void,
    maxConcurrent: number = 3
  ): Promise<UploadResult[]> {
    const fileArray = Array.from(files);
    const uploadResults: UploadResult[] = [];
    let completed = 0;

    // Function to upload a single file
    const uploadSingleFile = async (file: File): Promise<UploadResult> => {
      const startTime = Date.now();

      try {
        // Create the full key for the file
        const key = targetPrefix ? `${targetPrefix}${file.name}` : file.name;
        
        // Get signed URL for upload
        const { url } = await this.getUploadUrl(key);
        
        // Upload file to S3 using signed URL
        await this.uploadFileToS3(url, file);
        
        const uploadTime = Date.now() - startTime;

        const result: UploadResult = {
          fileName: file.name,
          status: 'success',
          uploadTime
        };

        completed++;
        if (onProgress) {
          onProgress(completed, fileArray.length);
        }

        return result;
      } catch (error) {
        const uploadTime = Date.now() - startTime;
        
        const result: UploadResult = {
          fileName: file.name,
          status: 'error',
          error: error instanceof Error ? error.message : 'Unknown error',
          uploadTime
        };

        completed++;
        if (onProgress) {
          onProgress(completed, fileArray.length);
        }

        return result;
      }
    };

    // Process files in batches
    for (let i = 0; i < fileArray.length; i += maxConcurrent) {
      const batch = fileArray.slice(i, i + maxConcurrent);
      const batchPromises = batch.map(uploadSingleFile);
      
      try {
        const batchResults = await Promise.allSettled(batchPromises);
        const results = batchResults.map(result => 
          result.status === 'fulfilled' ? result.value : {
            fileName: 'unknown',
            status: 'error' as const,
            error: 'Upload failed',
            uploadTime: 0
          }
        );
        uploadResults.push(...results);
      } catch (error) {
        console.error('Batch upload error:', error);
      }
    }

    return uploadResults;
  }  /**
   * Calculate folder size recursively
   */
  async calculateFolderSize(
    folderPrefix: string, 
    cache: { [key: string]: number } = {},
    updateCache?: (newCache: { [key: string]: number }) => void
  ): Promise<number> {
    // Check cache first
    if (cache[folderPrefix] !== undefined) {
      return cache[folderPrefix];
    }

    try {
      const result = await this.fetchObjects(folderPrefix);
      let totalSize = 0;
      
      // Add size of all files in this folder
      totalSize += result.files.reduce((sum, file) => sum + file.Size, 0);
      
      // Recursively calculate size of subfolders
      for (const subfolder of result.folders) {
        totalSize += await this.calculateFolderSize(subfolder, cache, updateCache);
      }
      
      // Cache the result
      cache[folderPrefix] = totalSize;
      
      // Update React state cache if callback provided
      if (updateCache) {
        updateCache(cache);
      }
      
      return totalSize;
    } catch (error) {
      return 0;
    }
  }

  /**
   * Open file in a new tab/window for viewing
   */
  viewFile(url: string, fileName?: string): void {
    const link = document.createElement('a');
    link.href = url;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    
    // Set download attribute for better UX
    if (fileName) {
      link.download = fileName;
    }
    
    // Trigger the link
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  /**
   * Download file using the signed URL
   */
  downloadFile(url: string, fileName: string): void {
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    
    // Trigger download
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  /**
   * Delete file from S3
   */
  async deleteFile(key: string): Promise<void> {
    const response = await fetch(`/api/delete-file?key=${encodeURIComponent(key)}`, {
      method: 'DELETE'
    });
    
    if (!response.ok) {
      throw new Error(`Failed to delete ${key}`);
    }
  }

  /**
   * Create a new folder in S3
   */
  async createFolder(folderName: string, parentPath: string = ''): Promise<void> {
    const response = await fetch('/api/folder', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        folderName,
        parentPath
      })
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to create folder');
    }
  }

  /**
   * Check if file type is viewable in browser
   */
  isViewableFile(fileName: string): boolean {
    const extension = fileName.split('.').pop()?.toLowerCase();
    const viewableExtensions = [
      // Images
      'jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'bmp',
      // Documents
      'pdf', 'txt', 'md',
      // Videos (some browsers)
      'mp4', 'webm', 'ogg',
      // Audio
      'mp3', 'wav', 'ogg', 'aac',
      // Web files
      'html', 'htm', 'css', 'js', 'json', 'xml'
    ];
    
    return viewableExtensions.includes(extension || '');
  }
}

// Export singleton instance
export const fileService = new FileService();
export default fileService;
export type { FileItem, ApiResponse, UploadResult };
