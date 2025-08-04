'use client';

import { useState } from 'react';
import { Plus, File, Folder, Image as ImageIcon, Video, Music, FileText, FolderOpen, Menu, X } from 'lucide-react';
import { UserButton } from '@clerk/nextjs';
import Image from 'next/image';
import FileUploadModal from './FileUploadModal';
import CreateFolderModal from './CreateFolderModal';

interface SidebarProps {
  currentPath?: string;
  onRefresh?: () => void;
  selectedFilter?: string;
  onFilterChange?: (filter: string) => void;
  isMobile?: boolean;
  isOpen?: boolean;
  onToggle?: () => void;
}

export default function Sidebar({ currentPath = '', onRefresh, selectedFilter = 'all', onFilterChange, isMobile = false, isOpen = false, onToggle }: SidebarProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showCreateFolderModal, setShowCreateFolderModal] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleFileAdd = () => {
    console.log('📁 Upload button clicked in Sidebar');
    console.log('📂 Current path:', currentPath);
    setShowUploadModal(true);
    setIsDropdownOpen(false);
  };

  const handleFolderAdd = () => {
    setShowCreateFolderModal(true);
    setIsDropdownOpen(false);
  };

  const handleUploadComplete = () => {
    console.log('✅ Upload completed, refreshing file list');
    if (onRefresh) {
      onRefresh();
    }
  };

  const handleFolderCreated = () => {
    if (onRefresh) {
      onRefresh();
    }
  };

  return (
    <div className="w-[70vw] md:w-[15vw] bg-gray-800 shadow-lg flex flex-col border-r border-gray-700 h-screen overflow-x-hidden absolute md:relative z-90">

      <div className="flex-1 px-4 py-6">
        {/* Add Button - Google Drive Style */}
        <div className="relative">
          <button
            onClick={toggleDropdown}
            className="w-full flex items-center justify-center space-x-2 bg-gray-700 hover:bg-gray-600 text-white px-4 py-3 rounded-lg shadow-md transition-colors font-medium border border-gray-600"
          >
            <Plus className="w-5 h-5" />
            <span>New</span>
          </button>

          {/* Dropdown Menu */}
          {isDropdownOpen && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-gray-700 rounded-lg shadow-xl z-10 border border-gray-600">
              <div className="py-2">
                <button
                  onClick={handleFileAdd}
                  className="w-full flex items-center space-x-3 px-4 py-3 text-gray-200 hover:bg-gray-600 hover:text-white transition-colors text-left"
                >
                  <File className="w-4 h-4" />
                  <span>Upload File</span>
                </button>
                <button
                  onClick={handleFolderAdd}
                  className="w-full flex items-center space-x-3 px-4 py-3 text-gray-200 hover:bg-gray-600 hover:text-white transition-colors text-left"
                >
                  <Folder className="w-4 h-4" />
                  <span>New Folder</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Click outside to close dropdown */}
        {isDropdownOpen && (
          <div
            className="fixed inset-0 z-0"
            onClick={() => setIsDropdownOpen(false)}
          />
        )}

        {/* File Type Filters */}
        <div className="mt-8">
          <h3 className="text-gray-400 text-sm font-medium mb-4 px-2">Filter by Type</h3>
          <div className="space-y-1">
            <button
              onClick={() => onFilterChange?.('all')}
              className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                selectedFilter === 'all'
                  ? 'bg-gray-700 text-white'
                  : 'text-gray-300 hover:bg-gray-700 hover:text-white'
              }`}
            >
              <File className="w-4 h-4" />
              <span className="text-sm">All</span>
            </button>
            
            <button
              onClick={() => onFilterChange?.('folder')}
              className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                selectedFilter === 'folder'
                  ? 'bg-gray-700 text-white'
                  : 'text-gray-300 hover:bg-gray-700 hover:text-white'
              }`}
            >
              <FolderOpen className="w-4 h-4" />
              <span className="text-sm">Folders</span>
            </button>
            
            <button
              onClick={() => onFilterChange?.('image')}
              className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                selectedFilter === 'image'
                  ? 'bg-gray-700 text-white'
                  : 'text-gray-300 hover:bg-gray-700 hover:text-white'
              }`}
            >
              <ImageIcon className="w-4 h-4" />
              <span className="text-sm">Images</span>
            </button>
            
            <button
              onClick={() => onFilterChange?.('video')}
              className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                selectedFilter === 'video'
                  ? 'bg-gray-700 text-white'
                  : 'text-gray-300 hover:bg-gray-700 hover:text-white'
              }`}
            >
              <Video className="w-4 h-4" />
              <span className="text-sm">Videos</span>
            </button>
            
            <button
              onClick={() => onFilterChange?.('audio')}
              className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                selectedFilter === 'audio'
                  ? 'bg-gray-700 text-white'
                  : 'text-gray-300 hover:bg-gray-700 hover:text-white'
              }`}
            >
              <Music className="w-4 h-4" />
              <span className="text-sm">Audio</span>
            </button>
            
            <button
              onClick={() => onFilterChange?.('document')}
              className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                selectedFilter === 'document'
                  ? 'bg-gray-700 text-white'
                  : 'text-gray-300 hover:bg-gray-700 hover:text-white'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span className="text-sm">Documents</span>
            </button>
          </div>
        </div>
        <div className="md:hidden w-[70vw] bg-gray-700 text-white gap-3 flex px-3 py-2 fixed bottom-0 left-0">
          <UserButton /> <h1>Profile</h1>
        </div>
      </div>

      {/* Upload Modal */}
      <FileUploadModal
        isOpen={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        onUploadComplete={handleUploadComplete}
        currentPath={currentPath}
      />

      {/* Create Folder Modal */}
      <CreateFolderModal
        isOpen={showCreateFolderModal}
        onClose={() => setShowCreateFolderModal(false)}
        onFolderCreated={handleFolderCreated}
        currentPath={currentPath}
      />
    </div>
  );
}
