/* eslint-disable @next/next/no-img-element */
'use client';

import React, { useEffect, useRef, useState, FormEvent } from 'react';
import Blobs from './Blobs';
import Globe from './Globe';
import { useRouter } from 'next/navigation';
import { Session } from '@supabase/supabase-js';
import { createCustomMemory, getSearchResultsFromMemory } from './actions';
import { BingResults } from './types';
import { useChat } from 'ai/react';
import Markdown from 'react-markdown';
import { useSearchParams } from 'next/navigation';
import WebReferences from '@/components/web-references';
// import { OperatorSearch } from '@/components/operator-search';
import { createClient } from '@/lib/supabase/client';
import { useTheme } from 'next-themes';
import { RevaLogo } from '@/components/reva-logo-dark';
import Head from 'next/head';
import { LoginModal } from '@/components/login';
import { NewNavbar } from '@/components/new-navbar';
import { Search } from '@/components/search';

function ChatPage({ user }: { user: Session | null }) {
  const supabase = createClient();
  const { theme, setTheme } = useTheme();
  const [searchResultsData, setSearchResultsData] = useState<BingResults | null>(null);
  const [showRealEstateSearch, setShowRealEstateSearch] = useState(false);
  const [session, setSession] = useState<Session | null>(null);

  const searchParams = useSearchParams();

  const initialQuery = searchParams.get('q') ?? '';

  const { messages, input, handleInputChange, handleSubmit, append, setInput } = useChat();

  const [customUserMemory, setCustomUserMemory] = useState<string | null>(null);

  const [userMemories, setUserMemories] = useState<{ memory: string; id: string }[]>([]);

  const router = useRouter();

  const handleEmailLogin = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw new Error(error.message);
  };

  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}`,
      },
    });

    if (error) throw new Error(error.message);
  };

  // Handling Memory Submit
  const handleMemorySubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!customUserMemory) return;
    try {
      const memory = await createCustomMemory(customUserMemory, user);
      setUserMemories([...userMemories, memory]);
    } catch (error) {
      console.error('Error creating memory:', error);
    }
  };

  const fetchSearch = async (
    query: string,
    e?: React.FormEvent<HTMLElement> | React.KeyboardEvent<HTMLTextAreaElement>,
  ) => {
    e?.preventDefault();
    e?.type === 'keydown' && e.stopPropagation();

    const data = await getSearchResultsFromMemory(query, user);
    if (!data) return;

    setSearchResultsData(data);

    if (!e) {
      append(
        {
          role: 'user',
          content: query,
        },
        {
          body: {
            data,
            input: query,
          },
        },
      );
    }

    handleSubmit(e, { body: { data, input: query } });

    return data;
  };

  const initialRender = useRef(true);

  useEffect(() => {
    if (initialRender.current) {
      initialRender.current = false;
      if (initialQuery) {
        setInput(initialQuery);
        fetchSearch(initialQuery);
      }
    }
  }, [initialQuery]);

  useEffect(() => {
    const checkSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setSession(session);
    };

    checkSession();

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
    });

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Logout error:', error.message);
    }
  };

  return (
    <div className="relative h-screen">
      <Head>
        <title>reVA - Smarter, Better Property Search</title>
        <meta property="og:title" content="reVA - Smarter, Better Property Search" />
        <meta
          property="og:description"
          content="Find your perfect property with reVA's intelligent property search platform."
        />
        <meta property="og:image" content={`${process.env.NEXT_PUBLIC_BASE_URL}/og-image.jpg`} />
        <meta
          property="og:url"
          content={typeof window !== 'undefined' ? window.location.href : ''}
        />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>
      <NewNavbar
        showSearch={true}
        showThemeToggle={true}
        showLanguageSelector={true}
        showUserMenu={true}
        showBalance={true}
        showCreateButton={false}
        isSidebarVisible={false}
        balance={1547.4} // Changed to positive value
        user={{
          name:
            session?.user?.user_metadata?.full_name || session?.user?.email?.split('@')[0] || '',
          email: session?.user?.email || '',
          initials: session?.user?.user_metadata?.full_name
            ? session.user.user_metadata.full_name
                .split(' ')
                .map((n: string) => n[0])
                .join('')
                .toUpperCase()
            : session?.user?.email?.charAt(0).toUpperCase() || '',
        }}
        className="w-full"
        isDark={theme === 'dark'}
        onThemeToggle={(newTheme) => setTheme(newTheme || 'system')}
        logo={<RevaLogo />}
        onLogout={handleLogout}
      />
      {!session ? (
        <LoginModal
          showLoginModal
          onEmailLogin={handleEmailLogin}
          onGoogleLogin={handleGoogleLogin}
        />
      ) : null}
      <div className="flex overflow-hidden absolute justify-center items-center w-full h-full max-h-screen blur-xl -z-10">
        <Blobs />
      </div>
      {!searchResultsData && (
        <div className="flex absolute inset-x-0 top-0 justify-center items-start w-full min-h-screen -z-10">
          <Globe />
        </div>
      )}

      <main className="flex flex-col justify-between items-center p-3 min-h-screen sm:p-4 md:p-12 lg:p-24">
        <div className="z-10 justify-between items-center w-full font-mono text-sm lg:flex">
          <div className="flex flex-col gap-4 w-full lg:flex-row lg:items-center lg:justify-between">
            {searchResultsData && (
              <button
                onClick={() => {
                  router.push('/');
                }}
                className="text-sm font-semibold"
              >
                Home
              </button>
            )}
          </div>
        </div>

        {searchResultsData ? (
          <div className="flex flex-col gap-4 items-start mt-16 w-full max-w-3xl sm:mt-24 md:mt-8">
            {messages.map((message, i) => (
              <div key={`message-${i}`} className="flex flex-col gap-2 w-full max-w-3xl">
                {message.role === 'user' ? (
                  <div className="flex gap-3 sm:gap-4">
                    <img
                      src={user?.user?.user_metadata?.avatar_url ?? '/user-placeholder.svg'}
                      className="w-8 h-8 rounded-full border-2 sm:w-10 sm:h-10 border-primary-foreground"
                      alt="User profile picture"
                    />
                    <span className="text-lg font-bold sm:text-xl md:text-2xl">
                      {message.content}
                    </span>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <WebReferences searchResults={searchResultsData} />
                    <div
                      className="max-w-full prose prose-sm sm:prose lg:prose-xl"
                      key={message.id}
                    >
                      <Markdown>{message.content}</Markdown>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col gap-4 justify-center items-center px-3 w-full sm:px-4">
            <div className="mt-8 sm:mt-12">
              <img src="/logo.svg" alt="reVA Logo" className="w-auto h-8 sm:h-10" />
            </div>
            <div className="mt-6 text-2xl text-center sm:text-4xl md:text-6xl sm:mt-8">
              Smarter, Better Property Search
            </div>

            <div className="flex-col mt-4 space-y-4 w-full">
              <Search />
              <div className="flex flex-wrap gap-2 justify-center mt-3">
                <button
                  onClick={() => setShowRealEstateSearch(true)}
                  className={`px-3 sm:px-4 py-2 text-sm sm:text-base rounded-md transition-colors ${
                    showRealEstateSearch
                      ? 'text-white bg-blue-500 dark:bg-blue-600'
                      : 'bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600'
                  }`}
                >
                  Advanced Search
                </button>
                <button
                  onClick={() => router.push('/search')}
                  className="flex items-center px-3 py-2 text-sm text-white bg-indigo-600 rounded-md transition-colors sm:px-4 sm:text-base hover:bg-indigo-700"
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
                  className="flex items-center px-3 py-2 text-sm text-white bg-emerald-600 rounded-md transition-colors sm:px-4 sm:text-base hover:bg-emerald-700"
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

        <div className="grid mb-8 text-center sm:mb-16 lg:mb-0 lg:max-w-5xl lg:w-full lg:grid-cols-4 lg:text-left"></div>
      </main>
    </div>
  );
}

export default ChatPage;
