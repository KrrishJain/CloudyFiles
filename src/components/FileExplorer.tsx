'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { 
  Folder, 
  File, 
  FolderOpen, 
  FileText, 
  Image, 
  FileVideo, 
  FileAudio,
  Archive,
  Download,
  Home,
  ChevronRight,
  Upload,
  Plus,
  Eye,
  X,
  Trash2
} from 'lucide-react';
import { fileService, type ApiResponse, type UploadResult, formatFileSize, getFileName, getFolderName, getFileExtension, triggerFileSelect } from '@/services';

interface FolderItem {
  name: string;
  prefix: string;
  size: number;
}

// Helper function to get file icon based on extension
const getFileIcon = (fileName: string) => {
  const extension = getFileExtension(fileName);
  
  switch (extension) {
    case 'jpg':
    case 'jpeg':
    case 'png':
    case 'gif':
    case 'webp':
    case 'svg':
      return <Image className="w-4 h-4 text-blue-400" />;
    case 'mp4':
    case 'avi':
    case 'mov':
    case 'wmv':
    case 'webm':
      return <FileVideo className="w-4 h-4 text-purple-400" />;
    case 'mp3':
    case 'wav':
    case 'flac':
    case 'aac':
      return <FileAudio className="w-4 h-4 text-green-400" />;
    case 'zip':
    case 'rar':
    case '7z':
    case 'tar':
    case 'gz':
      return <Archive className="w-4 h-4 text-orange-400" />;
    case 'pdf':
    case 'doc':
    case 'docx':
    case 'txt':
    case 'md':
      return <FileText className="w-4 h-4 text-red-400" />;
    default:
      return <File className="w-4 h-4 text-gray-400" />;
  }
};

export default function FileExplorer() {
  const [data, setData] = useState<ApiResponse>({ files: [], folders: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPrefix, setCurrentPrefix] = useState<string>('');
  const [breadcrumbs, setBreadcrumbs] = useState<string[]>([]);
  const [folderSizes, setFolderSizes] = useState<{ [key: string]: number }>({});
  const [calculatingFolders, setCalculatingFolders] = useState<Set<string>>(new Set());
  const [sizeCache, setSizeCache] = useState<{ [key: string]: number }>({});
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<{
    completed: number;
    total: number;
  } | null>(null);
  const [notification, setNotification] = useState<{
    message: string;
    type: 'success' | 'error';
  } | null>(null);
  const [viewModal, setViewModal] = useState<{
    isOpen: boolean;
    fileKey: string;
    fileUrl: string;
    fileName: string;
  } | null>(null);

  // Show notification
  const showNotification = (message: string, type: 'success' | 'error') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 5000);
  };

  // Drag and drop handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileUpload(files, currentPrefix);
    }
  };

  // Function to handle file upload
  const handleFileUpload = async (files: FileList | null, targetPrefix: string = '') => {
    if (!files || files.length === 0) return;

    setUploading(true);
    setUploadProgress({ completed: 0, total: files.length });

    try {
      const uploadResults = await fileService.uploadFiles(
        files, 
        targetPrefix,
        (completed, total) => {
          setUploadProgress({ completed, total });
        }
      );
      
      console.log(uploadResults);
      
      // Refresh the current directory to show uploaded files
      await fetchData(currentPrefix);
      
      // Clear size cache since new files were added
      setSizeCache({});
      
      showNotification(`Successfully uploaded ${files.length} file(s)!`, 'success');
    } catch (error) {
      showNotification(`Upload failed: ${error instanceof Error ? error.message : 'Unknown error'}`, 'error');
    } finally {
      setUploading(false);
      setUploadProgress(null);
    }
  };

  // Function to trigger file input
  const triggerFileInput = (targetPrefix: string = '') => {
    triggerFileSelect(true, undefined, (files) => {
      handleFileUpload(files, targetPrefix);
    });
  };

  // Function to calculate folder size by fetching all files recursively
  const calculateFolderSize = async (folderPrefix: string): Promise<number> => {
    return fileService.calculateFolderSize(
      folderPrefix, 
      sizeCache, 
      (newCache) => setSizeCache(newCache)
    );
  };

  const fetchData = async (prefix: string = '') => {
    try {
      setLoading(true);
      
      const result = await fileService.fetchObjects(prefix);
      setData(result);
      
      // Set calculating state for all folders
      setCalculatingFolders(new Set(result.folders));
      
      // Calculate sizes for all folders
      const newFolderSizes: { [key: string]: number } = {};
      const sizePromises = result.folders.map(async (folder) => {
        const size = await calculateFolderSize(folder);
        newFolderSizes[folder] = size;
        
        // Remove from calculating set as we complete each folder
        setCalculatingFolders(prev => {
          const newSet = new Set(prev);
          newSet.delete(folder);
          return newSet;
        });
      });
      
      await Promise.all(sizePromises);
      setFolderSizes(newFolderSizes);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setCalculatingFolders(new Set()); // Clear calculating state on error
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(currentPrefix);
  }, [currentPrefix]);

  // Handle escape key to close modal
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && viewModal) {
        closeViewModal();
      }
    };

    if (viewModal) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [viewModal]);

  const handleFolderClick = (folderPrefix: string) => {
    setCurrentPrefix(folderPrefix);
    const parts = folderPrefix.split('/').filter(Boolean);
    setBreadcrumbs(parts);
  };

  const handleBreadcrumbClick = (index: number) => {
    if (index === -1) {
      // Root folder
      setCurrentPrefix('');
      setBreadcrumbs([]);
    } else {
      const newPrefix = breadcrumbs.slice(0, index + 1).join('/') + '/';
      setCurrentPrefix(newPrefix);
      setBreadcrumbs(breadcrumbs.slice(0, index + 1));
    }
  };

  const handleDownload = (fileKey: string, fileUrl: string) => {
    const fileName = getFileName(fileKey);
    fileService.downloadFile(fileUrl, fileName);
  };

  const handleDeleteFile = async (fileKey: string, fileName: string) => {
    if (!confirm(`Are you sure you want to delete "${fileName}"? This action cannot be undone.`)) {
      return;
    }

    try {
      await fileService.deleteFile(fileKey);
      
      // Close modal if it's open for this file
      if (viewModal && viewModal.fileKey === fileKey) {
        closeViewModal();
      }
      
      // Refresh the current directory to remove deleted file from view
      await fetchData(currentPrefix);
      
      // Clear size cache since files were removed
      setSizeCache({});
      
      showNotification(`Successfully deleted "${fileName}"!`, 'success');
    } catch (error) {
      showNotification(`Failed to delete "${fileName}": ${error instanceof Error ? error.message : 'Unknown error'}`, 'error');
    }
  };

  const handleViewFile = (fileKey: string, fileUrl: string) => {
    const fileName = getFileName(fileKey);
    setViewModal({
      isOpen: true,
      fileKey,
      fileUrl,
      fileName
    });
  };

  const closeViewModal = () => {
    setViewModal(null);
  };

  const renderFileContent = (fileKey: string, fileUrl: string, fileName: string) => {
    const extension = getFileExtension(fileName).toLowerCase();
    
    // Image files
    if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(extension)) {
      return (
        <div className="flex justify-center items-center max-h-[60vh]">
          <img 
            src={fileUrl} 
            alt={fileName}
            className="max-w-full max-h-full object-contain rounded-lg"
          />
        </div>
      );
    }
    
    // Video files
    if (['mp4', 'avi', 'mov', 'wmv', 'webm'].includes(extension)) {
      return (
        <div className="flex justify-center">
          <video 
            controls 
            className="max-w-full max-h-[60vh] rounded-lg"
            preload="metadata"
          >
            <source src={fileUrl} type={`video/${extension === 'mov' ? 'quicktime' : extension}`} />
            Your browser does not support the video tag.
          </video>
        </div>
      );
    }
    
    // Audio files
    if (['mp3', 'wav', 'flac', 'aac'].includes(extension)) {
      return (
        <div className="flex justify-center">
          <audio controls className="w-full max-w-md">
            <source src={fileUrl} type={`audio/${extension}`} />
            Your browser does not support the audio tag.
          </audio>
        </div>
      );
    }
    
    // PDF files
    if (extension === 'pdf') {
      return (
        <div className="w-full h-[60vh]">
          <iframe 
            src={fileUrl} 
            className="w-full h-full rounded-lg border border-gray-600"
            title={fileName}
          />
        </div>
      );
    }
    
    // Text files
    if (['txt', 'md', 'json', 'js', 'ts', 'css', 'html', 'xml', 'csv'].includes(extension)) {
      return (
        <div className="bg-gray-800 rounded-lg p-4 h-[60vh]">
          <iframe 
            src={fileUrl} 
            className="w-full h-full bg-white rounded border border-gray-600"
            title={fileName}
          />
        </div>
      );
    }
    
    // Default fallback
    return (
      <div className="text-center py-8">
        <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-300 mb-4">Preview not available for this file type</p>
        <Button
          onClick={() => fileService.downloadFile(fileUrl, fileName)}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          <Download className="w-4 h-4 mr-2" />
          Download File
        </Button>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-red-500">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-6 relative">
      {/* Notification */}
      {notification && (
        <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg transition-all ${
          notification.type === 'success' 
            ? 'bg-green-500 text-white' 
            : 'bg-red-500 text-white'
        }`}>
          <div className="flex items-center space-x-2">
            {notification.type === 'success' ? (
              <div className="w-5 h-5 rounded-full bg-white bg-opacity-30 flex items-center justify-center">
                <div className="w-2 h-2 bg-white rounded-full"></div>
              </div>
            ) : (
              <div className="w-5 h-5 rounded-full bg-white bg-opacity-30 flex items-center justify-center">
                <div className="w-3 h-0.5 bg-white"></div>
              </div>
            )}
            <span>{notification.message}</span>
          </div>
        </div>
      )}
      
      <div 
        className={`bg-gray-900 rounded-lg shadow-lg transition-all relative ${
          dragOver ? 'ring-2 ring-blue-400 ring-opacity-50 bg-gray-800' : ''
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {dragOver && (
          <div className="absolute inset-0 bg-gray-800 bg-opacity-90 flex items-center justify-center z-10 rounded-lg">
            <div className="text-center">
              <Upload className="w-12 h-12 text-blue-400 mx-auto mb-4" />
              <p className="text-lg font-semibold text-blue-300">Drop files here to upload</p>
              <p className="text-sm text-blue-400">
                Files will be uploaded to {currentPrefix || 'root directory'}
              </p>
            </div>
          </div>
        )}
        {/* Header */}
        <div className="border-b border-gray-700 px-6 py-4 flex justify-between items-center bg-gray-800 rounded-t-lg">
          <h2 className="text-xl font-semibold text-gray-100">File Explorer</h2>
          <Button
            onClick={() => triggerFileInput(currentPrefix)}
            disabled={uploading}
            className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white"
          >
            {uploading ? (
              uploadProgress ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Uploading {uploadProgress.completed}/{uploadProgress.total}</span>
                </>
              ) : (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Uploading...</span>
                </>
              )
            ) : (
              <>
                <Upload className="w-4 h-4" />
                <span>Upload Files</span>
              </>
            )}
          </Button>
        </div>

        {/* Breadcrumbs */}
        <div className="px-6 py-3 bg-gray-800 border-b border-gray-700">
          <nav className="flex items-center space-x-2 text-sm">
            <button
              onClick={() => handleBreadcrumbClick(-1)}
              className="flex items-center text-blue-400 hover:text-blue-300 transition-colors"
            >
              <Home className="w-4 h-4 mr-1" />
              Root
            </button>
            {breadcrumbs.map((crumb, index) => (
              <div key={index} className="flex items-center">
                <ChevronRight className="w-4 h-4 text-gray-500 mx-1" />
                <button
                  onClick={() => handleBreadcrumbClick(index)}
                  className="text-blue-400 hover:text-blue-300 transition-colors"
                >
                  {crumb}
                </button>
              </div>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="p-6 bg-gray-900">
          {data.folders.length === 0 && data.files.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <Folder className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p className="mb-4">No files or folders found</p>
              <Button
                onClick={() => triggerFileInput(currentPrefix)}
                disabled={uploading}
                variant="outline"
                className="flex items-center space-x-2 border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white"
              >
                <Plus className="w-4 h-4" />
                <span>Upload your first files</span>
              </Button>
            </div>
          ) : (
            <div className="space-y-2">
              {/* Folders */}
              {data.folders.map((folder) => (
                <div
                  key={folder}
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-800 transition-colors group"
                >
                  <div 
                    className="flex items-center space-x-3 flex-1 min-w-0 cursor-pointer"
                    onClick={() => handleFolderClick(folder)}
                  >
                    <FolderOpen className="w-5 h-5 text-blue-400" />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-200 truncate">
                        {getFolderName(folder)}
                      </p>
                      <p className="text-sm text-gray-400 flex items-center">
                        {calculatingFolders.has(folder) ? (
                          <>
                            <div className="animate-spin rounded-full h-3 w-3 border-b border-gray-400 mr-2"></div>
                            Calculating...
                          </>
                        ) : (
                          formatFileSize(folderSizes[folder] || 0)
                        )}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        triggerFileInput(folder);
                      }}
                      disabled={uploading}
                      className="opacity-0 group-hover:opacity-100 transition-opacity hover:bg-gray-700 text-gray-300"
                      title={`Upload files to ${getFolderName(folder)}`}
                    >
                      <Upload className="w-4 h-4" />
                    </Button>
                    <ChevronRight className="w-4 h-4 text-gray-500 group-hover:text-gray-400 transition-colors" />
                  </div>
                </div>
              ))}

              {/* Files */}
              {data.files.map((file) => (
                <div
                  key={file.Key}
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-800 transition-colors group cursor-pointer"
                  onClick={() => handleViewFile(file.Key, file.url)}
                >
                  <div className="flex items-center space-x-3 flex-1 min-w-0">
                    {getFileIcon(file.Key)}
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-200 truncate">
                        {getFileName(file.Key)}
                      </p>
                      <p className="text-sm text-gray-400">
                        {formatFileSize(file.Size)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteFile(file.Key, getFileName(file.Key));
                      }}
                      className="opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-700 text-red-400 hover:text-white"
                      title="Delete file"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDownload(file.Key, file.url);
                      }}
                      className="opacity-0 group-hover:opacity-100 transition-opacity hover:bg-gray-700 text-gray-300"
                      title="Download file"
                    >
                      <Download className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-700 px-6 py-3 bg-gray-800 rounded-b-lg">
          <div className="flex justify-between items-center text-sm text-gray-400">
            <p>
              {data.folders.length} folders, {data.files.length} files
            </p>
            <p>
              Total: {formatFileSize(
                data.files.reduce((sum, file) => sum + file.Size, 0) +
                Object.values(folderSizes).reduce((sum, size) => sum + size, 0)
              )}
            </p>
          </div>
        </div>
      </div>

      {/* File View Modal */}
      {viewModal && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50"
          onClick={closeViewModal}
        >
          <div 
            className="bg-gray-900 bg-opacity-95 rounded-lg shadow-xl max-w-4xl max-h-[90vh] w-full overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-700">
              <div className="flex items-center space-x-3">
                {getFileIcon(viewModal.fileName)}
                <div>
                  <h3 className="text-lg font-semibold text-gray-100">
                    {viewModal.fileName}
                  </h3>
                  <p className="text-sm text-gray-400">File Preview</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteFile(viewModal.fileKey, viewModal.fileName);
                  }}
                  variant="ghost"
                  className="text-red-400 hover:bg-red-700 hover:text-white"
                  title="Delete file"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
                <Button
                  onClick={() => handleDownload(viewModal.fileKey, viewModal.fileUrl)}
                  variant="ghost"
                  className="text-gray-300 hover:bg-gray-800"
                  title="Download file"
                >
                  <Download className="w-4 h-4" />
                </Button>
                <Button
                  onClick={closeViewModal}
                  variant="ghost"
                  className="text-gray-300 hover:bg-gray-800"
                  title="Close"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
            
            {/* Modal Content */}
            <div className="p-6">
              {renderFileContent(viewModal.fileKey, viewModal.fileUrl, viewModal.fileName)}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
