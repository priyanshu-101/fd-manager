import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/ui/Button';

export function Navbar() {
  const { user, logout, isLoading } = useAuthStore();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <div className="flex items-center justify-between px-6 py-4 bg-ink-900/50 backdrop-blur-sm border-b border-ink-700/30">
      <div className="flex items-center gap-3">
        {user?.avatar && (
          <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full" />
        )}
        <div>
          <p className="text-sm font-medium text-ink-100">{user?.name}</p>
          <p className="text-xs text-ink-400">{user?.email}</p>
        </div>
      </div>

      <Button
        onClick={handleLogout}
        disabled={isLoading}
        variant="ghost"
        size="sm"
      >
        {isLoading ? 'Logging out...' : 'Logout'}
      </Button>
    </div>
  );
}
