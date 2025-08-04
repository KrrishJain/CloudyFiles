'use client';

import { useState, useEffect } from 'react';
import { X, Download, ExternalLink, Trash2 } from 'lucide-react';

interface FileViewerProps {
  isOpen: boolean;
  onClose: () => void;
  fileUrl: string;
  fileName: string;
  fileType: string;
  fullPath?: string;
  onDelete?: () => void;
}

export default function FileViewer({ isOpen, onClose, fileUrl, fileName, fileType, fullPath, onDelete }: FileViewerProps) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen) {
      setLoading(true);
      // Reset loading state when opening new file
      const timer = setTimeout(() => setLoading(false), 1000);
      return () => clearTimeout(timer);
    }
  }, [isOpen, fileUrl]);

  if (!isOpen) return null;

  const renderFileContent = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center h-full">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      );
    }

    switch (fileType) {
      case 'image':
        return (
          <div className="flex items-center justify-center h-full p-4">
            <img
              src={fileUrl}
              alt={fileName}
              className="max-w-full max-h-full object-contain rounded-lg"
              onLoad={() => setLoading(false)}
            />
          </div>
        );
      
      case 'pdf':
        return (
          <iframe
            src={fileUrl}
            className="w-full h-full border-0"
            title={fileName}
            onLoad={() => setLoading(false)}
          />
        );
      
      case 'video':
        return (
          <div className="flex items-center justify-center h-full p-4">
            <video
              src={fileUrl}
              controls
              className="max-w-full max-h-full rounded-lg"
              onLoadedData={() => setLoading(false)}
            >
              Your browser does not support the video tag.
            </video>
          </div>
        );
      
      case 'audio':
        return (
          <div className="flex items-center justify-center h-full p-4">
            <div className="text-center">
              <div className="mb-4">
                <div className="w-32 h-32 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-16 h-16 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM15.657 6.343a1 1 0 011.414 0A9.972 9.972 0 0119 12a9.972 9.972 0 01-1.929 5.657 1 1 0 11-1.414-1.414A7.971 7.971 0 0017 12a7.971 7.971 0 00-1.343-4.243 1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </div>
                <h3 className="text-white text-lg font-medium mb-2">{fileName}</h3>
              </div>
              <audio
                src={fileUrl}
                controls
                className="w-full max-w-md"
                onLoadedData={() => setLoading(false)}
              >
                Your browser does not support the audio tag.
              </audio>
            </div>
          </div>
        );
      
      case 'document':
      case 'excel':
      case 'presentation':
        return (
          <div className="flex items-center justify-center h-full p-8">
            <div className="text-center">
              <div className="w-24 h-24 bg-gray-700 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg className="w-12 h-12 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-white text-lg font-medium mb-2">{fileName}</h3>
              <p className="text-gray-400 mb-4">This file type cannot be previewed</p>
              <button
                onClick={() => window.open(fileUrl, '_blank')}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors mx-auto"
              >
                <ExternalLink className="w-4 h-4" />
                Open in New Tab
              </button>
            </div>
          </div>
        );
      
      default:
        return (
          <div className="flex items-center justify-center h-full p-8">
            <div className="text-center">
              <div className="w-24 h-24 bg-gray-700 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg className="w-12 h-12 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-white text-lg font-medium mb-2">{fileName}</h3>
              <p className="text-gray-400 mb-4">Preview not available for this file type</p>
              <button
                onClick={() => window.open(fileUrl, '_blank')}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors mx-auto"
              >
                <ExternalLink className="w-4 h-4" />
                Open in New Tab
              </button>
            </div>
          </div>
        );
    }
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = fileUrl;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDelete = async () => {
    if (!fullPath) return;
    
    const confirmDelete = window.confirm(`Are you sure you want to delete "${fileName}"?`);
    if (!confirmDelete) return;
    
    try {
      const response = await fetch(`/api/objects?key=${encodeURIComponent(fullPath)}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        console.log(`${fileName} deleted successfully`);
        if (onDelete) {
          onDelete();
        }
        onClose(); // Close the viewer after successful deletion
      } else {
        const errorData = await response.json();
        console.error('Failed to delete file:', errorData.error);
        alert('Failed to delete file. Please try again.');
      }
    } catch (error) {
      console.error('Error deleting file:', error);
      alert('Error deleting file. Please try again.');
    }
  };

  return (
    <div className="fixed inset-0 bg-[#00000096] bg-opacity-80 z-50 flex items-center justify-center">
      <div className="bg-gray-900 rounded-lg w-[95vw] h-[95vh] max-w-7xl max-h-[95vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <h2 className="text-white text-lg font-medium truncate flex-1 pr-4">{fileName}</h2>
          <div className="flex items-center gap-2">
            {fullPath && (
              <button
                onClick={handleDelete}
                className="p-2 text-gray-400 hover:text-red-400 hover:bg-gray-700 rounded-lg transition-colors"
                title="Delete"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            )}
            <button
              onClick={handleDownload}
              className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
              title="Download"
            >
              <Download className="w-5 h-5" />
            </button>
            
            <button
              onClick={() => window.open(fileUrl, '_blank')}
              className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
              title="Open in new tab"
            >
              <ExternalLink className="w-5 h-5" />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
              title="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
        
        {/* Content */}
        <div className="flex-1 overflow-hidden">
          {renderFileContent()}
        </div>
      </div>
    </div>
  );
}
