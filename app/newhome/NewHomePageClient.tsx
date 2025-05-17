'use client';

import { NewNavbar } from '@/components/new-navbar';
import { RevaLogo } from '@/components/reva-logo-dark';
import React, { useState, useEffect, Suspense } from 'react';
import { useTheme } from 'next-themes';
import { createClient } from '@/lib/supabase/client';
import { Session } from '@supabase/supabase-js';
import { LoginModal } from '@/components/login';
import { Search } from '@/components/search'; // Import Search component
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';

const Globe = dynamic(() => import('@/components/Globe'), { ssr: false });

interface NewHomePageClientProps {
  session: Session | null;
}

export const NewHomePageClient: React.FC<NewHomePageClientProps> = ({
  session: initialSession,
}) => {
  const [showRealEstateSearch, setShowRealEstateSearch] = useState(false);
  const router = useRouter();
  const supabase = createClient();
  const { theme, setTheme } = useTheme();
  // Use state to manage session changes triggered by client-side actions (login/logout)
  const [session, setSession] = useState<Session | null>(initialSession);

  // Update session state if initialSession changes or upon client-side auth events
  useEffect(() => {
    setSession(initialSession);

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
    });

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, [initialSession, supabase]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setSession(null); // Clear session state immediately
  };

  const handleEmailLogin = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      console.error('Email login error:', error.message);
      // Handle error display to user
      return;
    }
    if (data.session) {
      setSession(data.session);
    }
  };

  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    if (error) {
      console.error('Google login error:', error.message);
      // Handle error display to user
    }
  };

  const navUser = session?.user
    ? {
        name: session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || '',
        email: session.user.email || '',
        initials: session.user.user_metadata?.full_name
          ? session.user.user_metadata.full_name
              .split(' ')
              .map((n: string) => n[0])
              .join('')
              .toUpperCase()
          : session.user.email?.charAt(0).toUpperCase() || '',
      }
    : undefined;

  return (
    <div className="flex overflow-hidden relative flex-col min-h-screen bg-black">
      <NewNavbar
        showSearch={false} // Search is handled within the page content now
        showThemeToggle={true}
        showLanguageSelector={true}
        showUserMenu={!!session}
        showBalance={!!session}
        showCreateButton={false}
        isSidebarVisible={false}
        balance={1547.4} // Replace with actual balance logic
        user={navUser}
        className="fixed top-0 left-0 z-50 w-full" // Navbar has high z-index
        isDark={theme === 'dark'}
        onThemeToggle={(newTheme) => setTheme(newTheme || 'system')}
        logo={<RevaLogo />}
        onLogout={handleLogout}
      />

      {/* Render Globe first, with its fixed position and lower z-index */}
      <Suspense fallback={null}>
        {/* Optional: Hide fallback for background element */}
        <Globe />
      </Suspense>

      {/* Main content area - make it ignore pointer events, fill space, and center its content */}
      <main className="flex relative z-10 flex-grow justify-center items-center pointer-events-none">
        {!session ? (
          // LoginModal container needs pointer-events-auto
          <div className="pointer-events-auto">
            <LoginModal
              showLoginModal
              onEmailLogin={handleEmailLogin}
              onGoogleLogin={handleGoogleLogin}
            />
          </div>
        ) : (
          // Logged-in content container needs pointer-events-auto
          // Centering is handled by the parent `main` element now
          <div className="container flex flex-col items-center px-4 py-8 mx-auto text-white pointer-events-auto">
            <div className="mt-8 sm:mt-12">
              <img src="/logo-dark.svg" alt="reVA Logo" className="w-auto h-8 sm:h-10" />
            </div>
            <div className="mt-6 text-2xl text-center sm:text-4xl md:text-6xl sm:mt-8">
              Smarter, Better Property Search
            </div>

            <div className="flex-col space-y-4 mt-4 w-full max-w-[800px]">
              <Search placeholder="Search for properties, agents, or locations..." />
              <div className="flex flex-wrap gap-2 justify-center mt-3">
                <button
                  onClick={() => setShowRealEstateSearch(true)}
                  className={`px-3 sm:px-4 py-2 text-sm sm:text-base rounded-md transition-colors pointer-events-auto ${
                    // Ensure buttons are interactive
                    showRealEstateSearch
                      ? 'text-white bg-blue-500 dark:bg-blue-600'
                      : 'bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600'
                  }`}
                >
                  Advanced Search
                </button>
                <button
                  onClick={() => router.push('/search')}
                  className="flex items-center px-3 py-2 text-sm text-white bg-indigo-600 rounded-md transition-colors pointer-events-auto sm:px-4 sm:text-base hover:bg-indigo-700" // Ensure buttons are interactive
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="mr-1 w-3 h-3 sm:h-4 sm:w-4"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                  </svg>
                  Property Search
                </button>
                <button
                  onClick={() => router.push('/maps-search')}
                  className="flex items-center px-3 py-2 text-sm text-white bg-emerald-600 rounded-md transition-colors pointer-events-auto sm:px-4 sm:text-base hover:bg-emerald-700" // Ensure buttons are interactive
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="mr-1 w-3 h-3 sm:h-4 sm:w-4"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Map Search
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
