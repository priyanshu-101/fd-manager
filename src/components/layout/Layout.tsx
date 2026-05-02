import { ReactNode, useState } from 'react';
import { Menu, X } from 'lucide-react';
import { Sidebar } from './Sidebar';
import { Button } from '@/components/ui/Button';
import { Spinner } from '@/components/ui/Spinner';
import { useStore } from '@/store';

export function Layout({ children }: { children: ReactNode }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { hydrationStatus, hydrateError, hydrate } = useStore((s) => ({
    hydrationStatus: s.hydrationStatus,
    hydrateError: s.hydrateError,
    hydrate: s.hydrate,
  }));

  return (
    <div className="min-h-screen bg-ink-950 font-body">
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="bg-ink-800/80 border border-ink-600/30"
        >
          {mobileMenuOpen ? <X size={16} /> : <Menu size={16} />}
        </Button>
      </div>

      {/* Sidebar */}
      <Sidebar isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />

      {/* Overlay for mobile */}
      {mobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-20"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      <main className="lg:ml-64 min-h-screen">
        <div className="max-w-6xl mx-auto px-4 sm:px-8 py-10 pt-16 lg:pt-10">
          {hydrationStatus === 'loading' && (
            <div className="mb-6 rounded-2xl border border-ink-700/50 bg-ink-900/70 p-4">
              <div className="flex items-center gap-3 text-ink-200">
                <Spinner className="text-gold-400" />
                <p className="text-sm font-medium">Syncing your portfolio data...</p>
              </div>
              <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-ink-800">
                <div className="h-full w-1/3 animate-pulse rounded-full bg-gradient-to-r from-gold-500 via-gold-400 to-transparent" />
              </div>
            </div>
          )}
          {hydrationStatus === 'error' && hydrateError && (
            <div
              role="alert"
              className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 rounded-xl border border-crimson-700/40 bg-crimson-900/20 px-4 py-3 text-sm text-crimson-200"
            >
              <span>Could not load data ({hydrateError}). Is the API running?</span>
              <Button variant="ghost" size="sm" onClick={() => void hydrate()} className="shrink-0 text-crimson-100 border border-crimson-600/40">
                Retry
              </Button>
            </div>
          )}
          {children}
        </div>
      </main>
    </div>
  );
}
