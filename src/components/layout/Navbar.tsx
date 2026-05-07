import { useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import { User, LogOut, Settings, ChevronDown, Lock } from 'lucide-react';
import { EditProfileModal } from '@/components/auth/EditProfileModal';
import { ChangePasswordModal } from '@/components/auth/ChangePasswordModal';

export function Navbar() {
  const { user, logout, isLoading } = useAuthStore();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);

  const handleLogout = async () => {
    setIsMenuOpen(false);
    try {
      await logout();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <div className="flex items-center justify-end px-6 py-4 bg-ink-900/50 backdrop-blur-sm border-b border-ink-700/30">
      <div className="relative">
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="flex items-center gap-3 hover:bg-ink-800/50 p-2 rounded-xl transition-colors"
        >
          {user?.avatar ? (
            <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full border border-ink-700" />
          ) : (
            <div className="w-8 h-8 rounded-full bg-ink-800 flex items-center justify-center border border-ink-700">
              <User size={16} className="text-ink-400" />
            </div>
          )}
          <div className="text-left hidden sm:block">
            <p className="text-sm font-medium text-ink-100">{user?.name}</p>
            <p className="text-xs text-ink-400">{user?.email}</p>
          </div>
          <ChevronDown size={14} className={`text-ink-500 transition-transform ${isMenuOpen ? 'rotate-180' : ''}`} />
        </button>

        {isMenuOpen && (
          <>
            <div 
              className="fixed inset-0 z-10" 
              onClick={() => setIsMenuOpen(false)}
            />
            <div className="absolute right-0 mt-2 w-48 bg-ink-900 border border-ink-700/50 rounded-xl shadow-2xl z-20 overflow-hidden py-1">
              <button
                onClick={() => {
                  setIsMenuOpen(false);
                  setIsEditProfileOpen(true);
                }}
                className="w-full flex items-center gap-3 px-4 py-2 text-sm text-ink-300 hover:bg-ink-800 hover:text-ink-100 transition-colors"
              >
                <Settings size={16} />
                Edit Profile
              </button>
              <button
                onClick={() => {
                  setIsMenuOpen(false);
                  setIsChangePasswordOpen(true);
                }}
                className="w-full flex items-center gap-3 px-4 py-2 text-sm text-ink-300 hover:bg-ink-800 hover:text-ink-100 transition-colors"
              >
                <Lock size={16} />
                Change Password
              </button>
              <button
                onClick={handleLogout}
                disabled={isLoading}
                className="w-full flex items-center gap-3 px-4 py-2 text-sm text-crimson-400 hover:bg-crimson-500/10 transition-colors"
              >
                <LogOut size={16} />
                {isLoading ? 'Logging out...' : 'Logout'}
              </button>
            </div>
          </>
        )}
      </div>

      <EditProfileModal 
        open={isEditProfileOpen} 
        onClose={() => setIsEditProfileOpen(false)} 
      />
      <ChangePasswordModal 
        open={isChangePasswordOpen} 
        onClose={() => setIsChangePasswordOpen(false)} 
      />
    </div>
  );
}
