'use client';

import { useState } from 'react';
import { AlertTriangle, X } from 'lucide-react';

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  fileName: string;
  fileType: string;
}

export default function DeleteConfirmationModal({ 
  isOpen, 
  onClose, 
  onConfirm, 
  fileName, 
  fileType 
}: DeleteConfirmationModalProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  if (!isOpen) return null;

  const handleConfirm = async () => {
    setIsDeleting(true);
    await onConfirm();
    setIsDeleting(false);
    onClose();
  };

  const getFileTypeText = (type: string) => {
    switch (type) {
      case 'folder':
        return 'folder';
      case 'image':
        return 'image';
      case 'video':
        return 'video';
      case 'audio':
        return 'audio file';
      case 'pdf':
        return 'PDF document';
      case 'document':
        return 'document';
      case 'excel':
        return 'Excel file';
      case 'presentation':
        return 'presentation';
      case 'code':
        return 'code file';
      default:
        return 'file';
    }
  };

  return (
    <div className="fixed inset-0 bg-[#00000070] bg-opacity-10 z-50 flex items-center justify-center p-4">
      <div className="bg-gray-800 rounded-lg max-w-[40vw] w-full mx-4 border border-gray-700">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-500 bg-opacity-20 rounded-full flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-lg font-semibold text-white">Delete {getFileTypeText(fileType)}</h2>
          </div>
          <button
            onClick={onClose}
            disabled={isDeleting}
            className="p-1 text-gray-400 hover:text-white hover:bg-gray-700 rounded transition-colors disabled:opacity-50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <p className="text-gray-300 mb-2">
            Are you sure you want to delete this {getFileTypeText(fileType)}?
          </p>
          <div className="bg-gray-900 rounded-lg p-3 mb-4">
            <p className="text-white font-medium truncate" title={fileName}>
              {fileName}
            </p>
          </div>
          <p className="text-sm text-red-400">
            This action cannot be undone. The {getFileTypeText(fileType)} will be permanently removed.
          </p>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-700">
          <button
            onClick={onClose}
            disabled={isDeleting}
            className="px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-700 rounded-lg transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={isDeleting}
            className="px-4 py-2 bg-red-600 text-white hover:bg-red-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 min-w-[80px]"
          >
            {isDeleting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Deleting...</span>
              </>
            ) : (
              'Delete'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
