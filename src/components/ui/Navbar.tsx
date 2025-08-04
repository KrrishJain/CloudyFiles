import { UserButton } from '@clerk/nextjs';
import React from 'react';
import { Menu } from 'lucide-react';

interface NavbarProps {
    showProfileButton?: boolean;
    showMenuButton?: boolean;
    onMenuClick?: () => void;
}

const Navbar = ({ showProfileButton = true, showMenuButton = false, onMenuClick }: NavbarProps) => {
    return (
        <nav className="bg-gray-800 shadow-sm border-b border-gray-700 h-16 hidden">
            <div className="container mx-auto px-4 h-full">
                <div className="flex items-center justify-between h-full">
                    {/* Logo on the left */}
                    <div className="flex items-center">
                        <span className="text-2xl font-bold text-white uppercase">
                            Cloud File
                        </span>
                    </div>

                    {/* Right side - UserButton or Menu Button */}
                    <div className="flex items-center">
                        {showMenuButton && (
                            <button
                                onClick={onMenuClick}
                                className="p-2 text-white hover:bg-gray-700 rounded-md transition-colors"
                            >
                                <Menu className="h-6 w-6" />
                            </button>
                        )}
                        {showProfileButton && <UserButton />}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;