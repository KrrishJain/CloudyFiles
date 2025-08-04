'use client';

import { useState } from 'react';
import { Folder, X } from 'lucide-react';
import { fileService } from '../services/fileService';

interface CreateFolderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onFolderCreated: () => void;
  currentPath: string;
}

export default function CreateFolderModal({ 
  isOpen, 
  onClose, 
  onFolderCreated, 
  currentPath 
}: CreateFolderModalProps) {
  const [folderName, setFolderName] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const validateFolderName = (name: string) => {
    if (!name.trim()) return 'Folder name is required';
    if (name.length > 50) return 'Folder name must be less than 50 characters';
    if (!/^[a-zA-Z0-9._-\s]+$/.test(name)) return 'Folder name contains invalid characters';
    if (name.includes('..')) return 'Folder name cannot contain ".."';
    return '';
  };

  const handleCreate = async () => {
    const validationError = validateFolderName(folderName);
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsCreating(true);
    setError('');

    try {
      await fileService.createFolder(folderName.trim(), currentPath);
      onFolderCreated();
      handleClose();
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to create folder');
    } finally {
      setIsCreating(false);
    }
  };

  const handleClose = () => {
    if (!isCreating) {
      setFolderName('');
      setError('');
      onClose();
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !isCreating) {
      handleCreate();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-gray-800 rounded-lg max-w-md w-full mx-4 border border-gray-700">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-500 bg-opacity-20 rounded-full flex items-center justify-center">
              <Folder className="w-5 h-5 text-blue-400" />
            </div>
            <h2 className="text-lg font-semibold text-white">Create New Folder</h2>
          </div>
          <button
            onClick={handleClose}
            disabled={isCreating}
            className="p-1 text-gray-400 hover:text-white hover:bg-gray-700 rounded transition-colors disabled:opacity-50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="mb-4">
            <label htmlFor="folderName" className="block text-sm font-medium text-gray-300 mb-2">
              Folder Name
            </label>
            <input
              id="folderName"
              type="text"
              value={folderName}
              onChange={(e) => {
                setFolderName(e.target.value);
                if (error) setError('');
              }}
              onKeyPress={handleKeyPress}
              placeholder="Enter folder name"
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={isCreating}
              autoFocus
            />
            {error && (
              <p className="mt-2 text-sm text-red-400">{error}</p>
            )}
          </div>

          <div className="bg-gray-900 rounded-lg p-3 mb-4">
            <p className="text-sm text-gray-400">
              Creating in: <span className="text-white">{currentPath || 'Root folder'}</span>
            </p>
          </div>

          <div className="text-xs text-gray-500">
            <p>• Folder names can contain letters, numbers, spaces, dots, dashes, and underscores</p>
            <p>• Maximum 50 characters</p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-700">
          <button
            onClick={handleClose}
            disabled={isCreating}
            className="px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-700 rounded-lg transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleCreate}
            disabled={!folderName.trim() || isCreating}
            className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 min-w-[100px]"
          >
            {isCreating ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Creating...</span>
              </>
            ) : (
              <>
                <Folder className="w-4 h-4" />
                <span>Create</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
