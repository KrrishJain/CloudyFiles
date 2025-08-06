'use client';

import DashboardLayout from '@/components/DashboardLayout';
import FileCard from '@/components/FileCard';
import { useState, useEffect } from 'react';

// Define interfaces for better type safety
interface S3File {
  Key: string;
  Size?: number;
  LastModified?: string;
  url?: string;
}

interface ApiResponse {
  files?: S3File[];
  folders?: string[];
}

// Import the file service
const fileService = {
  async fetchObjects(prefix = ''): Promise<ApiResponse> {
    const url = prefix 
      ? `/api/objects?prefix=${encodeURIComponent(prefix)}`
      : '/api/objects';
    
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Failed to fetch files');
    }
    
    return response.json();
  }
};

// Helper function to determine file type from filename
const getFileType = (filename: string): string => {
  const extension = filename.split('.').pop()?.toLowerCase();
  
  switch (extension) {
    case 'pdf':
      return 'pdf';
    case 'doc':
    case 'docx':
      return 'document';
    case 'mp4':
    case 'avi':
    case 'mov':
    case 'wmv':
      return 'video';
    case 'mp3':
    case 'wav':
    case 'flac':
    case 'aac':
      return 'audio';
    case 'jpg':
    case 'jpeg':
    case 'png':
    case 'gif':
    case 'webp':
      return 'image';
    case 'xls':
    case 'xlsx':
      return 'excel';
    case 'ppt':
    case 'pptx':
      return 'presentation';
    case 'js':
    case 'ts':
    case 'jsx':
    case 'tsx':
    case 'py':
    case 'java':
    case 'cpp':
    case 'c':
    case 'html':
    case 'css':
      return 'code';
    default:
      return 'other';
  }
};

interface FileItem {
  id: number;
  name: string;
  type: string;
  url?: string;
  size?: number;
  fullPath?: string;
}

export default function HomePage() {
  const [items, setItems] = useState<FileItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPath, setCurrentPath] = useState<string>('');
  const [breadcrumbs, setBreadcrumbs] = useState<string[]>([]);
  const [selectedFilter, setSelectedFilter] = useState<string>('all');

  const fetchData = async (prefix: string = '') => {
    try {
      setLoading(true);
      const data = await fileService.fetchObjects(prefix);
      
      // Convert API data to our format
      const formattedItems: FileItem[] = [];
      
      // Add folders
      data.folders?.forEach((folder: string, index: number) => {
        const folderName = folder.replace(/\/$/, '').split('/').pop(); // Get only the folder name
        formattedItems.push({
          id: index + 1000, // Ensure unique IDs
          name: folderName || folder.replace(/\/$/, ''),
          type: 'folder',
          fullPath: folder, // Store full path for navigation
        });
      });
      
      // Add files
      data.files?.forEach((file: S3File, index: number) => {
        const filename = file.Key?.split('/').pop() || file.Key;
        const fileType = getFileType(filename);
        
        formattedItems.push({
          id: index,
          name: filename,
          type: fileType,
          url: file.url, // Include URL for all files
          size: file.Size,
          fullPath: file.Key, // Store full path
        });
      });
      
      setItems(formattedItems);
      setError(null);
    } catch (err) {
      console.error('Error fetching files:', err);
      setError('Failed to load files');
    } finally {
      setLoading(false);
    }
  };

  const handleFolderClick = (folderPath: string) => {
    setCurrentPath(folderPath);
    const newBreadcrumbs = folderPath === '' ? [] : folderPath.split('/').filter(Boolean);
    setBreadcrumbs(newBreadcrumbs);
    fetchData(folderPath);
  };

  const handleBreadcrumbClick = (index: number) => {
    const newPath = breadcrumbs.slice(0, index + 1).join('/') + (index >= 0 ? '/' : '');
    setCurrentPath(newPath);
    setBreadcrumbs(breadcrumbs.slice(0, index + 1));
    fetchData(newPath);
  };

  const goToRoot = () => {
    setCurrentPath('');
    setBreadcrumbs([]);
    fetchData('');
  };

  const handleFilterChange = (filter: string) => {
    setSelectedFilter(filter);
  };

  // Filter items based on selected filter
  const filteredItems = items.filter((item) => {
    if (selectedFilter === 'all') return true;
    if (selectedFilter === 'folder') return item.type === 'folder';
    if (selectedFilter === 'image') return item.type === 'image';
    if (selectedFilter === 'video') return item.type === 'video';
    if (selectedFilter === 'audio') return item.type === 'audio';
    if (selectedFilter === 'document') return ['document', 'pdf', 'excel', 'presentation'].includes(item.type);
    return false;
  });

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return (
      <DashboardLayout 
        currentPath={currentPath} 
        onRefresh={() => fetchData(currentPath)}
        selectedFilter={selectedFilter}
        onFilterChange={handleFilterChange}
      >
        <div className="w-full flex items-center justify-center h-64">
          <div className="text-white text-lg">Loading files...</div>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout 
        currentPath={currentPath} 
        onRefresh={() => fetchData(currentPath)}
        selectedFilter={selectedFilter}
        onFilterChange={handleFilterChange}
      >
        <div className="w-full flex items-center justify-center h-64">
          <div className="text-red-400 text-lg">{error}</div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout 
      currentPath={currentPath} 
      onRefresh={() => fetchData(currentPath)}
      selectedFilter={selectedFilter}
      onFilterChange={handleFilterChange}
    >
      <div className="">
        <h1 className="text-2xl font-bold text-white mb-6">My Files</h1>
        
        {/* Breadcrumb Navigation */}
        <div className="mb-6 flex items-center gap-2 text-sm bg-gray-800 p-3 rounded-lg border border-gray-700">
          <button
            onClick={goToRoot}
            className="text-blue-400 hover:text-blue-300 transition-colors font-medium"
          >
            Home
          </button>
          {breadcrumbs.map((crumb, index) => (
            <div key={index} className="flex items-center gap-2">
              <span className="text-gray-400">/</span>
              <button
                onClick={() => handleBreadcrumbClick(index)}
                className="text-blue-400 hover:text-blue-300 transition-colors font-medium"
              >
                {crumb}
              </button>
            </div>
          ))}
        </div>
        
        {/* Grid Layout */}
        <div className="grid gap-6 w-full grid-cols-2 md:grid-cols-4 lg:grid-cols-8 grid-responsive-425">
          {filteredItems.map((item) => (
            <FileCard 
              key={item.id} 
              item={item} 
              onFolderClick={item.type === 'folder' ? () => handleFolderClick(item.fullPath || '') : undefined}
              onRefresh={() => fetchData(currentPath)}
            />
          ))}
        </div>
        
        {filteredItems.length === 0 && !loading && (
          <div className="text-center text-gray-400 mt-12">
            <p>{selectedFilter === 'all' ? 'No files found' : `No ${selectedFilter === 'folder' ? 'folders' : selectedFilter + ' files'} found`}</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}