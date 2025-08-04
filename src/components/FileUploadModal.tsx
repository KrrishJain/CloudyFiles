'use client';

import { useState, useRef } from 'react';
import { Upload, X, FileIcon, Trash2, CheckCircle, AlertCircle } from 'lucide-react';
import { fileService, UploadResult } from '../services/fileService';

interface FileUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUploadComplete: () => void;
  currentPath: string;
}

export default function FileUploadModal({ 
  isOpen, 
  onClose, 
  onUploadComplete, 
  currentPath 
}: FileUploadModalProps) {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadResults, setUploadResults] = useState<UploadResult[]>([]);
  const [uploadProgress, setUploadProgress] = useState({ completed: 0, total: 0 });
  const [isDragOver, setIsDragOver] = useState(false);
  const [useConcurrentUpload, setUseConcurrentUpload] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileSelect = (files: FileList | null) => {
    console.log('📁 File selection triggered');
    console.log('📄 Received files:', files ? Array.from(files).map(f => ({ name: f.name, size: f.size })) : 'null');
    
    if (files) {
      const fileArray = Array.from(files);
      console.log('🔍 Processing', fileArray.length, 'files');
      
      // Filter out files that are too large (100MB limit)
      const maxSizeBytes = 100 * 1024 * 1024; // 100MB
      const validFiles = fileArray.filter(file => {
        if (file.size > maxSizeBytes) {
          console.warn(`⚠️ File ${file.name} is too large (${formatFileSize(file.size)}). Maximum size is 100MB.`);
          return false;
        }
        return true;
      });
      
      console.log('✅ Valid files (under 100MB):', validFiles.length);
      
      // Filter out duplicate files based on name and size
      const newFiles = validFiles.filter(newFile => 
        !selectedFiles.some(existingFile => 
          existingFile.name === newFile.name && existingFile.size === newFile.size
        )
      );
      
      console.log('🆕 New files (no duplicates):', newFiles.length);
      console.log('📋 Current selected files before adding:', selectedFiles.length);
      
      if (newFiles.length !== fileArray.length) {
        const skipped = fileArray.length - newFiles.length;
        console.log(`⏭️ ${skipped} files were skipped (duplicates or too large)`);
      }
      
      setSelectedFiles(prev => {
        const updated = [...prev, ...newFiles];
        console.log('📋 Total selected files after update:', updated.length);
        return updated;
      });
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    handleFileSelect(e.dataTransfer.files);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getTotalSize = () => {
    return selectedFiles.reduce((total, file) => total + file.size, 0);
  };

  const handleUpload = async () => {
    console.log('🚀 handleUpload called');
    console.log('📁 Selected files:', selectedFiles.map(f => ({ name: f.name, size: f.size })));
    console.log('📂 Current path:', currentPath);
    console.log('⚡ Use concurrent upload:', useConcurrentUpload);
    
    if (selectedFiles.length === 0) {
      console.log('❌ No files selected, aborting upload');
      return;
    }

    setIsUploading(true);
    setUploadResults([]);
    setUploadProgress({ completed: 0, total: selectedFiles.length });

    try {
      const uploadMethod = useConcurrentUpload 
        ? fileService.uploadFilesConcurrent 
        : fileService.uploadFiles;

      console.log('📤 Starting upload with method:', useConcurrentUpload ? 'concurrent' : 'sequential');

      const results = await uploadMethod.call(
        fileService,
        selectedFiles,
        currentPath,
        (completed, total) => {
          console.log(`📊 Upload progress: ${completed}/${total}`);
          setUploadProgress({ completed, total });
        },
        // Only used for concurrent uploads
        useConcurrentUpload ? 3 : undefined
      );

      console.log('✅ Upload completed, results:', results);
      setUploadResults(results);
      
      // Check if all uploads were successful
      const allSuccessful = results.every(result => result.status === 'success');
      const someSuccessful = results.some(result => result.status === 'success');
      
      console.log('📈 Upload summary:');
      console.log('  - All successful:', allSuccessful);
      console.log('  - Some successful:', someSuccessful);
      console.log('  - Success count:', results.filter(r => r.status === 'success').length);
      console.log('  - Error count:', results.filter(r => r.status === 'error').length);
      
      if (allSuccessful) {
        console.log('🎉 All uploads successful, closing modal in 1.5s');
        setTimeout(() => {
          onUploadComplete();
          onClose();
          resetModal();
        }, 1500);
      } else if (someSuccessful) {
        console.log('⚠️ Some uploads successful, refreshing list in 1s');
        // Some files uploaded successfully, refresh the list
        setTimeout(() => {
          onUploadComplete();
        }, 1000);
      }
    } catch (error) {
      console.error('💥 Upload error (outer catch):', error);
      console.error('Error details:', {
        message: (error as Error)?.message || 'Unknown error',
        stack: (error as Error)?.stack || 'No stack trace',
        name: (error as Error)?.name || 'Unknown error type'
      });
    } finally {
      console.log('🔄 Upload process finished, setting isUploading to false');
      setIsUploading(false);
    }
  };

  const resetModal = () => {
    setSelectedFiles([]);
    setUploadResults([]);
    setUploadProgress({ completed: 0, total: 0 });
    setUseConcurrentUpload(false);
    setIsUploading(false);
  };

  const handleClose = () => {
    if (!isUploading) {
      resetModal();
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-[#00000062] bg-opacity-50 z-50 flex items-center justify-center p-4 md:p-4 w-screen h-screen">
      <div className="bg-gray-800 rounded-lg  mx-4 border border-gray-700 w-full h-full overflow-hidden md:max-h-[80vh] md:w-full md:max-w-2xl sm:w-screen sm:h-screen sm:max-w-none sm:max-h-none sm:rounded-none ">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700 sm:p-4 sm:flex-shrink-0">
          <h2 className="text-lg font-semibold text-white sm:text-xl">Upload Files</h2>
          <button
            onClick={handleClose}
            disabled={isUploading}
            className="p-1 text-gray-400 hover:text-white hover:bg-gray-700 rounded transition-colors disabled:opacity-50 sm:p-2"
          >
            <X className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh] sm:p-4 sm:flex-1 sm:max-h-none sm:overflow-y-auto">
          {/* File Drop Area */}
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              isDragOver
                ? 'border-blue-400 bg-blue-400/10'
                : 'border-gray-600 hover:border-gray-500'
            }`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
          >
            <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-300 mb-2">
              Drag and drop files here, or{' '}
              <button
                onClick={() => fileInputRef.current?.click()}
                className="text-blue-400 hover:text-blue-300 underline"
                disabled={isUploading}
              >
                browse files
              </button>
            </p>
            <p className="text-sm text-gray-500">
              Upload to: {currentPath || 'Root folder'} • Max file size: 100MB each
            </p>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            multiple
            className="hidden"
            onChange={(e) => handleFileSelect(e.target.files)}
            disabled={isUploading}
            accept="*/*"
          />

          {/* Selected Files */}
          {selectedFiles.length > 0 && (
            <div className="mt-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-white font-medium">
                  Selected Files ({selectedFiles.length})
                  <span className="text-gray-400 text-sm font-normal ml-2">
                    • Total: {formatFileSize(getTotalSize())}
                  </span>
                </h3>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="concurrentUpload"
                      checked={useConcurrentUpload}
                      onChange={(e) => setUseConcurrentUpload(e.target.checked)}
                      disabled={isUploading}
                      className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
                    />
                    <label htmlFor="concurrentUpload" className="text-sm text-gray-300">
                      Fast upload
                    </label>
                  </div>
                  {!isUploading && (
                    <button
                      onClick={() => setSelectedFiles([])}
                      className="text-sm text-red-400 hover:text-red-300 transition-colors"
                    >
                      Clear all
                    </button>
                  )}
                </div>
              </div>
              
              {/* Progress Bar */}
              {isUploading && (
                <div className="mb-4">
                  <div className="flex justify-between text-sm text-gray-300 mb-1">
                    <span>Uploading files...</span>
                    <span>{uploadProgress.completed}/{uploadProgress.total} files</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                      style={{ 
                        width: `${uploadProgress.total > 0 ? (uploadProgress.completed / uploadProgress.total) * 100 : 0}%` 
                      }}
                    ></div>
                  </div>
                  <div className="text-xs text-gray-400 mt-1">
                    {uploadProgress.total > 0 ? Math.round((uploadProgress.completed / uploadProgress.total) * 100) : 0}% complete
                  </div>
                </div>
              )}

              {/* File List */}
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {selectedFiles.map((file, index) => (
                  <div key={index} className="flex items-center justify-between bg-gray-700 rounded-lg p-3">
                    <div className="flex items-center gap-3">
                      <FileIcon className="w-4 h-4 text-gray-400" />
                      <div>
                        <p className="text-white text-sm truncate max-w-xs" title={file.name}>
                          {file.name}
                        </p>
                        <p className="text-gray-400 text-xs">{formatFileSize(file.size)}</p>
                      </div>
                    </div>
                    {!isUploading && (
                      <button
                        onClick={() => removeFile(index)}
                        className="p-1 text-gray-400 hover:text-red-400 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Upload Results */}
          {uploadResults.length > 0 && (
            <div className="mt-6">
              <h3 className="text-white font-medium mb-3">Upload Results</h3>
              <div className="space-y-2">
                {uploadResults.map((result, index) => (
                  <div key={index} className="flex items-center gap-3 bg-gray-700 rounded-lg p-3">
                    {result.status === 'success' ? (
                      <CheckCircle className="w-4 h-4 text-green-400" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-red-400" />
                    )}
                    <div className="flex-1">
                      <p className="text-white text-sm">{result.fileName}</p>
                      {result.error && (
                        <p className="text-red-400 text-xs">{result.error}</p>
                      )}
                    </div>
                    {result.uploadTime && (
                      <span className="text-gray-400 text-xs">
                        {(result.uploadTime / 1000).toFixed(1)}s
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex flex-col items-center justify-end gap-3 p-6 border-t border-gray-700  sm:p-4 sm:gap-3 sm:flex-shrink-0">
          <button
            onClick={handleClose}
            disabled={isUploading}
            className="px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-700 rounded-lg transition-colors disabled:opacity-50 sm:w-full sm:order-2 sm:py-3"
          >
            {uploadResults.length > 0 ? 'Close' : 'Cancel'}
          </button>
          <button
            onClick={handleUpload}
            disabled={selectedFiles.length === 0 || isUploading}
            className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 min-w-[100px] sm:w-full sm:order-1 sm:justify-center sm:py-3"
          >
            {isUploading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Uploading...</span>
              </>
            ) : (
              <>
                <Upload className="w-4 h-4" />
                <span>Upload {selectedFiles.length} file{selectedFiles.length !== 1 ? 's' : ''}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
