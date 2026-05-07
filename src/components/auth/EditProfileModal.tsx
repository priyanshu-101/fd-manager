import { useState, useEffect } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useAuthStore } from '@/store/authStore';
import { User as UserIcon, Mail } from 'lucide-react';

interface EditProfileModalProps {
  open: boolean;
  onClose: () => void;
}

export function EditProfileModal({ open, onClose }: EditProfileModalProps) {
  const { user, updateProfile, isLoading, error, clearError } = useAuthStore();
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');

  useEffect(() => {
    if (open) {
      setName(user?.name || '');
      setEmail(user?.email || '');
      clearError();
    }
  }, [open, user, clearError]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateProfile({ name, email });
      onClose();
    } catch (err) {
      // Error is handled by store
    }
  };

  return (
    <Modal open={open} onClose={onClose} title="Edit Profile">
      <div className="flex flex-col items-center mb-8">
        <div className="relative group">
          <div className="w-24 h-24 rounded-full border-2 border-gold-500/30 p-1 group-hover:border-gold-500/60 transition-colors">
            {user?.avatar ? (
              <img src={user.avatar} alt={user.name} className="w-full h-full rounded-full object-cover bg-ink-800" />
            ) : (
              <div className="w-full h-full rounded-full bg-ink-800 flex items-center justify-center">
                <UserIcon size={40} className="text-ink-400" />
              </div>
            )}
          </div>
        </div>
        <p className="mt-3 text-xs text-ink-400 font-medium uppercase tracking-widest">Profile Avatar</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <div className="relative">
            <UserIcon size={18} className="absolute left-4 top-10 text-ink-500" />
            <Input
              label="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              required
              disabled={isLoading}
              className="pl-11"
            />
          </div>
          
          <div className="relative">
            <Mail size={18} className="absolute left-4 top-10 text-ink-500" />
            <Input
              label="Email Address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              disabled={isLoading}
              className="pl-11"
            />
          </div>
        </div>

        {error && (
          <div className="p-4 bg-crimson-500/10 border border-crimson-500/20 rounded-xl text-crimson-400 text-sm flex items-start gap-3 animate-shake">
            <div className="w-1.5 h-1.5 rounded-full bg-crimson-500 mt-1.5 shrink-0" />
            {error}
          </div>
        )}

        <div className="flex items-center gap-3 pt-4">
          <Button 
            type="button" 
            variant="ghost" 
            onClick={onClose} 
            disabled={isLoading}
            className="flex-1 justify-center"
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            variant="primary" 
            disabled={isLoading}
            className="flex-[2] justify-center shadow-lg"
          >
            {isLoading ? 'Saving Changes...' : 'Save Profile'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
