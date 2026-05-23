import { ChevronDown, LogOut, Settings, User } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

interface ProfileHeaderProps {
  userName: string;
  userEmail: string;
  avatarUrl?: string;
  isDark?: boolean;
}

export function ProfileHeader({ userName, userEmail, avatarUrl, isDark = true }: ProfileHeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        className={`flex items-center gap-3 p-2 rounded-lg transition-colors cursor-pointer ${
          isDark ? 'hover:bg-[#243040]' : 'hover:bg-neutral-100'
        }`}
      >
        <div className="w-8 h-8 rounded-full flex items-center justify-center text-white font-medium bg-[#0A856C] text-xs">
          {avatarUrl ? (
            <img src={avatarUrl} alt={userName} className="w-full h-full rounded-full object-cover" />
          ) : (
            userName.split(' ').map(n => n.charAt(0)).join('').toUpperCase()
          )}
        </div>
        <div className="flex-1 text-left">
          <p className={`text-sm font-medium ${isDark ? 'text-neutral-100' : 'text-neutral-900'}`}>{userName}</p>
          <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-neutral-600'}`}>{userEmail}</p>
        </div>
        <ChevronDown className={`w-4 h-4 transition-transform ${isMenuOpen ? 'rotate-180' : ''} ${isDark ? 'text-slate-400' : 'text-neutral-600'}`} />
      </button>

      {isMenuOpen && (
        <div className={`absolute top-full right-0 mt-2 w-56 rounded-lg shadow-lg border py-1 z-50 ${
          isDark
            ? 'bg-[#1e2632] border-[#2a3544]'
            : 'bg-white border-neutral-200'
        }`}>
          <button className={`w-full flex items-center gap-3 px-4 py-2 text-sm transition-colors cursor-pointer ${
            isDark
              ? 'text-slate-200 hover:bg-[#243040]'
              : 'text-neutral-700 hover:bg-neutral-100'
          }`}>
            <User className="w-4 h-4" />
            Profile
          </button>
          <button className={`w-full flex items-center gap-3 px-4 py-2 text-sm transition-colors cursor-pointer ${
            isDark
              ? 'text-slate-200 hover:bg-[#243040]'
              : 'text-neutral-700 hover:bg-neutral-100'
          }`}>
            <Settings className="w-4 h-4" />
            Settings
          </button>
          <div className={`border-t my-1 ${isDark ? 'border-[#2a3544]' : 'border-neutral-200'}`} />
          <button className={`w-full flex items-center gap-3 px-4 py-2 text-sm transition-colors cursor-pointer ${
            isDark
              ? 'text-red-400 hover:bg-[#243040]'
              : 'text-red-600 hover:bg-red-50'
          }`}>
            <LogOut className="w-4 h-4" />
            Log out
          </button>
        </div>
      )}
    </div>
  );
}
