import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LoginForm } from '@/components/auth/LoginForm';
import { SignupForm } from '@/components/auth/SignupForm';

export function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();

  const handleSuccess = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-ink-950 via-ink-900 to-ink-950 flex items-center justify-center px-4">
      {/* Background accent */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gold-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-crimson-500/5 rounded-full blur-3xl" />
      </div>

      {/* Main container */}
      <div className="relative w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gold-400 mb-2 font-heading">
            {isLogin ? 'Welcome Back' : 'Create Account'}
          </h1>
          <p className="text-ink-400">
            {isLogin ? 'Sign in to manage your investments' : 'Join us to get started'}
          </p>
        </div>

        {/* Card */}
        <div className="bg-ink-900/80 backdrop-blur-xl border border-ink-700/50 rounded-2xl p-8 shadow-2xl">
          {isLogin ? (
            <LoginForm onSuccess={handleSuccess} />
          ) : (
            <SignupForm onSuccess={handleSuccess} />
          )}

          {/* Toggle */}
          <div className="mt-6 text-center">
            <p className="text-sm text-ink-400">
              {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="text-gold-400 hover:text-gold-300 font-semibold transition-colors"
              >
                {isLogin ? 'Sign up' : 'Sign in'}
              </button>
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-xs text-ink-500">
          <p>Financial Dashboard © 2026</p>
        </div>
      </div>
    </div>
  );
}
