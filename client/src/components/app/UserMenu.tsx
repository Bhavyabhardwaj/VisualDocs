import { useState } from 'react';
import { 
  User, 
  CreditCard, 
  Keyboard, 
  HelpCircle, 
  LogOut,
  ChevronDown,
  Users as TeamIcon,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { KeyboardShortcutsModal } from './KeyboardShortcutsModal';

export const UserMenu = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [shortcutsModalOpen, setShortcutsModalOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <>
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-zinc-50 transition-colors">
          {/* User Avatar */}
          <div className="w-8 h-8 rounded-full bg-zinc-900 text-white flex items-center justify-center text-xs font-semibold">
            {user?.avatar ? (
              <img 
                src={user.avatar} 
                alt={user.name} 
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              getInitials(user?.name || 'User')
            )}
          </div>
          
          {/* User Name (hidden on mobile) */}
          <span className="hidden md:block text-sm font-medium text-zinc-900">
            {user?.name || 'User'}
          </span>
          
          {/* Dropdown Icon */}
          <ChevronDown className={`w-4 h-4 text-zinc-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-64 p-2 bg-white border-zinc-200">
        {/* User Info Section */}
        <div className="px-3 py-2 mb-2 bg-white">
          <p className="text-sm font-semibold text-zinc-900">{user?.name || 'User'}</p>
          <p className="text-xs text-zinc-500 truncate">{user?.email || 'user@example.com'}</p>
        </div>

        <DropdownMenuSeparator className="bg-zinc-200" />

        {/* Profile */}
        <DropdownMenuItem 
          onClick={() => navigate('/app/settings')}
          className="flex items-center gap-3 px-3 py-2 cursor-pointer rounded-md hover:bg-zinc-100 focus:bg-zinc-100 text-zinc-900 bg-white"
        >
          <User className="w-4 h-4 text-zinc-600" />
          <span className="text-sm text-zinc-900">Profile Settings</span>
        </DropdownMenuItem>

        {/* Team Settings */}
        <DropdownMenuItem 
          onClick={() => navigate('/app/team')}
          className="flex items-center gap-3 px-3 py-2 cursor-pointer rounded-md hover:bg-zinc-100 focus:bg-zinc-100 text-zinc-900 bg-white"
        >
          <TeamIcon className="w-4 h-4 text-zinc-600" />
          <span className="text-sm text-zinc-900">Team Settings</span>
        </DropdownMenuItem>

        {/* Billing */}
        <DropdownMenuItem 
          onClick={() => navigate('/app/settings')}
          className="flex items-center gap-3 px-3 py-2 cursor-pointer rounded-md hover:bg-zinc-100 focus:bg-zinc-100 text-zinc-900 bg-white"
        >
          <CreditCard className="w-4 h-4 text-zinc-600" />
          <span className="text-sm text-zinc-900">Billing</span>
        </DropdownMenuItem>

        <DropdownMenuSeparator className="bg-zinc-200" />

        {/* Keyboard Shortcuts */}
        <DropdownMenuItem 
          onClick={() => {
            setIsOpen(false);
            setShortcutsModalOpen(true);
          }}
          className="flex items-center gap-3 px-3 py-2 cursor-pointer rounded-md hover:bg-zinc-100 focus:bg-zinc-100 text-zinc-900 bg-white"
        >
          <Keyboard className="w-4 h-4 text-zinc-600" />
          <span className="text-sm text-zinc-900">Keyboard Shortcuts</span>
          <kbd className="ml-auto text-xs text-zinc-500 font-mono">⌘/</kbd>
        </DropdownMenuItem>

        {/* Help & Support */}
        <DropdownMenuItem 
          onClick={() => navigate('/help')}
          className="flex items-center gap-3 px-3 py-2 cursor-pointer rounded-md hover:bg-zinc-100 focus:bg-zinc-100 text-zinc-900 bg-white"
        >
          <HelpCircle className="w-4 h-4 text-zinc-600" />
          <span className="text-sm text-zinc-900">Help & Support</span>
        </DropdownMenuItem>

        <DropdownMenuSeparator className="bg-zinc-200" />

        {/* Log Out */}
        <DropdownMenuItem 
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2 cursor-pointer rounded-md hover:bg-red-50 focus:bg-red-50 bg-white"
        >
          <LogOut className="w-4 h-4 text-red-600" />
          <span className="text-sm text-red-600 font-medium">Log Out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
    
    {/* Keyboard Shortcuts Modal */}
    <KeyboardShortcutsModal open={shortcutsModalOpen} onOpenChange={setShortcutsModalOpen} />
    </>
  );
};
