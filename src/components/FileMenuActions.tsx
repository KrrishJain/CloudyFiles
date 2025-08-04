'use client';

import { 
  Eye,
  Copy,
  Download,
  Trash2,
  FolderInput,
  Share2,
  Mail,
  MessageCircle,
  Link2
} from 'lucide-react';
import { useState } from 'react';

interface FileItem {
  id: number;
  name: string;
  type: string;
  url?: string;
  fullPath?: string;
}

interface FileMenuActionsProps {
  item: FileItem;
  onView?: () => void;
  onRefresh?: () => void;
  onShowDeleteModal?: () => void;
}

export default function FileMenuActions({ item, onView, onRefresh, onShowDeleteModal }: FileMenuActionsProps) {
  const [showShareMenu, setShowShareMenu] = useState(false);

  const handleView = () => {
    if (onView) {
      onView();
    }
  };

  const handleCopy = async () => {
    if (item.url) {
      try {
        await navigator.clipboard.writeText(item.url);
        // You can add toast notification here
        console.log('URL copied to clipboard');
      } catch (err) {
        console.error('Failed to copy URL:', err);
      }
    }
  };

  const handleDownload = () => {
    if (item.fullPath) {
      // Use the download API endpoint that forces download
      window.open(`/api/download?key=${encodeURIComponent(item.fullPath)}`, '_blank');
    }
  };

  const handleDelete = async () => {
    if (!item.fullPath) return;
    
    try {
      const response = await fetch(`/api/objects?key=${encodeURIComponent(item.fullPath)}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        console.log(`${item.name} deleted successfully`);
        if (onRefresh) {
          onRefresh();
        }
      } else {
        const errorData = await response.json();
        console.error('Failed to delete file:', errorData.error);
        alert('Failed to delete file. Please try again.');
      }
    } catch (err) {
      console.error('Error deleting file:', err);
      alert('Error deleting file. Please try again.');
    }
  };

  const handleDeleteClick = () => {
    if (onShowDeleteModal) {
      onShowDeleteModal();
    }
  };

  const handleMove = () => {
    console.log(`Move ${item.name} to folder`);
    // Add move logic here - you can implement folder selection modal
  };

  const handleShare = (platform: string) => {
    if (!item.url) return;

    const shareText = `Check out this file: ${item.name}`;
    const shareUrl = item.url;

    switch (platform) {
      case 'email':
        const emailSubject = encodeURIComponent(`Shared file: ${item.name}`);
        const emailBody = encodeURIComponent(`${shareText}\n\n${shareUrl}`);
        window.open(`mailto:?subject=${emailSubject}&body=${emailBody}`);
        break;
      
      case 'whatsapp':
        const whatsappText = encodeURIComponent(`${shareText} ${shareUrl}`);
        window.open(`https://wa.me/?text=${whatsappText}`);
        break;
      
      case 'copy-link':
        navigator.clipboard.writeText(shareUrl).then(() => {
          console.log('Share link copied to clipboard');
          // Add toast notification
        }).catch(err => {
          console.error('Failed to copy share link:', err);
        });
        break;
      
      case 'native':
        if (navigator.share) {
          navigator.share({
            title: item.name,
            text: shareText,
            url: shareUrl,
          }).catch(err => console.log('Error sharing:', err));
        } else {
          // Fallback to copy link
          navigator.clipboard.writeText(shareUrl);
          console.log('Link copied to clipboard (native share not supported)');
        }
        break;
      
      default:
        console.log(`Share via ${platform} not implemented`);
    }
    
    setShowShareMenu(false);
  };

  return {
    handleView,
    handleCopy,
    handleDownload,
    handleDelete,
    handleDeleteClick,
    handleMove,
    handleShare,
    showShareMenu,
    setShowShareMenu,
    ShareMenuComponent: () => (
      showShareMenu && (
        <div className="absolute top-0 left-[-110px] bg-gray-800 rounded-md shadow-lg z-30 w-[100px] border border-gray-700 overflow-hidden">
          <div className="py-1">
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleShare('email');
              }}
              className="flex items-center gap-2 w-full px-2 py-2 text-xs text-gray-300 hover:bg-gray-700"
            >
              <Mail className="w-3 h-3" />
              Email
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleShare('whatsapp');
              }}
              className="flex items-center gap-2 w-full px-2 py-2 text-xs text-gray-300 hover:bg-gray-700"
            >
              <MessageCircle className="w-3 h-3" />
              WhatsApp
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleShare('copy-link');
              }}
              className="flex items-center gap-2 w-full px-2 py-2 text-xs text-gray-300 hover:bg-gray-700"
            >
              <Link2 className="w-3 h-3" />
              Copy Link
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleShare('native');
              }}
              className="flex items-center gap-2 w-full px-2 py-2 text-xs text-gray-300 hover:bg-gray-700"
            >
              <Share2 className="w-3 h-3" />
              More
            </button>
          </div>
        </div>
      )
    )
  };
}
