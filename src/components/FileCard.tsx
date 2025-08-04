'use client';

import { 
  Folder, 
  FileType,
  Play,
  Music, 
  Image as ImageIcon,
  Code2,
  FileText,
  MoreVertical,
  Eye,
  Copy,
  Download,
  Trash2,
  FolderInput,
  Share2
} from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import FileViewer from './FileViewer';
import FileMenuActions from './FileMenuActions';
import DeleteConfirmationModal from './DeleteConfirmationModal';

interface FileItem {
  id: number;
  name: string;
  type: string;
  url?: string;
  fullPath?: string;
}

interface FileCardProps {
  item: FileItem;
  onFolderClick?: () => void;
  onRefresh?: () => void;
}

const getFileIcon = (type: string) => {
  switch (type) {
    case 'folder':
      return <Folder className="w-12 h-12 sm:w-14 sm:h-14 text-blue-400 fill-current" />;
    case 'pdf':
      return (
        <div className="relative">
          <FileType className="w-12 h-12 sm:w-14 sm:h-14 text-red-500 fill-current" />
          <span className="absolute inset-0 flex items-center justify-center text-white text-xs font-bold">PDF</span>
        </div>
      );
    case 'document':
      return (
        <div className="relative">
          <FileText className="w-12 h-12 sm:w-14 sm:h-14 text-blue-500 fill-current" />
          <span className="absolute inset-0 flex items-center justify-center text-white text-xs font-bold">DOC</span>
        </div>
      );
    case 'video':
      return <Play className="w-12 h-12 sm:w-14 sm:h-14 text-purple-400 fill-current" />;
    case 'audio':
      return (
        <div className="relative">
          <FileType className="w-12 h-12 sm:w-14 sm:h-14 text-gray-400 fill-current" />
          <Music className="absolute inset-0 w-6 h-6 sm:w-7 sm:h-7 text-gray-600 m-auto" />
        </div>
      );
    case 'image':
      return <ImageIcon className="w-12 h-12 sm:w-14 sm:h-14 text-pink-400 fill-current" />;
    case 'excel':
      return (
        <div className="relative">
          <FileType className="w-12 h-12 sm:w-14 sm:h-14 text-green-600 fill-current" />
          <span className="absolute inset-0 flex items-center justify-center text-white text-xs font-bold">XLS</span>
        </div>
      );
    case 'presentation':
      return (
        <div className="relative">
          <FileType className="w-12 h-12 sm:w-14 sm:h-14 text-orange-500 fill-current" />
          <span className="absolute inset-0 flex items-center justify-center text-white text-xs font-bold">PPT</span>
        </div>
      );
    case 'code':
      return <Code2 className="w-12 h-12 sm:w-14 sm:h-14 text-orange-400 fill-current" />;
    default:
      return (
        <div className="relative">
          <FileText className="w-12 h-12 sm:w-14 sm:h-14 text-gray-500 fill-current" />
          <span className="absolute inset-0 flex items-center justify-center text-white text-xs font-bold">TXT</span>
        </div>
      );
  }
};

export default function FileCard({ item, onFolderClick, onRefresh }: FileCardProps) {
  const [showMenu, setShowMenu] = useState(false);
  const [showFileViewer, setShowFileViewer] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const menuActions = FileMenuActions({ 
    item, 
    onView: () => setShowFileViewer(true),
    onRefresh,
    onShowDeleteModal: () => setShowDeleteModal(true)
  });

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
        menuActions.setShowShareMenu(false);
      }
    };

    if (showMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showMenu, menuActions]);

  const handleMenuAction = async (action: string) => {
    setShowMenu(false);
    
    switch (action) {
      case 'view':
        menuActions.handleView();
        break;
      case 'copy':
        menuActions.handleCopy();
        break;
      case 'download':
        menuActions.handleDownload();
        break;
      case 'move':
        menuActions.handleMove();
        break;
      case 'delete':
        menuActions.handleDeleteClick();
        break;
      case 'share':
        menuActions.setShowShareMenu(!menuActions.showShareMenu);
        return; // Don't close menu for share
      default:
        console.log(`${action} clicked for ${item.name}`);
    }
  };

  const handleCardClick = () => {
    if (item.type === 'folder' && onFolderClick) {
      onFolderClick();
    } else if (item.type !== 'folder') {
      // For files, open in file viewer
      setShowFileViewer(true);
    }
  };

  return (
    <div className=" group">
      <div
        className="rounded-lg  hover:bg-gray-800 hover:bg-opacity-30 transition-colors cursor-pointer  relative"
        style={{ width: '110px', height: '120px' }}
        onClick={handleCardClick}
      >
        {/* 3-dot menu */}
        <div className="absolute top-1 right-0" ref={menuRef}>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowMenu(!showMenu);
            }}
            className="p-1 rounded-full  hover:bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <MoreVertical className="w-4 h-4 text-gray-400" />
          </button>
          
          {/* Dropdown menu */}
          {showMenu && (
            <div className="absolute top-8 right-2 bg-gray-800 rounded-md shadow-lg z-20 w-[100px] border border-gray-700 overflow-hidden">
              <div className="py-1">
                {item.type !== 'folder' && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleMenuAction('view');
                    }}
                    className="flex items-center gap-2 w-full px-2 py-2 text-xs text-gray-300 hover:bg-gray-700"
                  >
                    <Eye className="w-3 h-3" />
                    View
                  </button>
                )}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleMenuAction('copy');
                  }}
                  className="flex items-center gap-2 w-full px-2 py-2 text-xs text-gray-300 hover:bg-gray-700"
                >
                  <Copy className="w-3 h-3" />
                  Copy URL
                </button>
                {item.type !== 'folder' && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleMenuAction('download');
                    }}
                    className="flex items-center gap-2 w-full px-2 py-2 text-xs text-gray-300 hover:bg-gray-700"
                  >
                    <Download className="w-3 h-3" />
                    Download
                  </button>
                )}
                <div className="relative">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleMenuAction('share');
                    }}
                    className="flex items-center gap-2 w-full px-2 py-2 text-xs text-gray-300 hover:bg-gray-700"
                  >
                    <Share2 className="w-3 h-3" />
                    Share
                  </button>
                  <div onClick={(e) => e.stopPropagation()}>
                    <menuActions.ShareMenuComponent />
                  </div>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleMenuAction('move');
                  }}
                  className="flex items-center gap-2 w-full px-2 py-2 text-xs text-gray-300 hover:bg-gray-700"
                >
                  <FolderInput className="w-3 h-3" />
                  Move
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleMenuAction('delete');
                  }}
                  className="flex items-center gap-2 w-full px-2 py-2 text-xs text-red-400 hover:bg-gray-700"
                >
                  <Trash2 className="w-3 h-3" />
                  Delete
                </button>
              </div>
            </div>
          )}
        </div>

        <div className='flex flex-col items-center justify-center w-full h-full'>
          {/* File/Folder Icon or Image */}
        <div className="mb-1 flex items-center justify-center">
          {item.type === 'image' && item.url ? (
            <img
              src={item.url}
              alt={item.name}
              className="w-12 h-12 sm:w-14 sm:h-14 object-cover object-center rounded-md"
              style={{ objectPosition: 'center' }}
            />
          ) : (
            getFileIcon(item.type)
          )}
        </div>
        
        {/* File/Folder Name */}
        <div className="text-center w-full px-1">
          <p className="text-white text-xs font-thin truncate w-full" title={item.name}>
            {item.name}
          </p>
        </div>
        </div>
      </div>

      {/* File Viewer Modal */}
      {showFileViewer && item.url && (
        <FileViewer
          isOpen={showFileViewer}
          onClose={() => setShowFileViewer(false)}
          fileUrl={item.url}
          fileName={item.name}
          fileType={item.type}
          fullPath={item.fullPath}
          onDelete={onRefresh}
        />
      )}

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={menuActions.handleDelete}
        fileName={item.name}
        fileType={item.type}
      />
    </div>
  );
}
