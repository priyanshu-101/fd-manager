import { ReactNode, useState } from 'react';
import { Menu, X } from 'lucide-react';
import { Sidebar } from './Sidebar';
import { Button } from '@/components/ui/Button';
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
            <p className="text-sm text-ink-500 mb-6 animate-pulse">Loading portfolio…</p>
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
