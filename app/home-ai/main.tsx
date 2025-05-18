'use client';

import { Button } from '@/components/ui/button';
import RoomStyleSelector from '@/app/home-ai/components/room-style-selector';
import OptionControls from '@/app/home-ai/components/option-controls';
import ResultsGallery from '@/app/home-ai/components/results-gallery';
import UploadSection from '@/app/home-ai/components/upload-section';
import MobileNav from '@/app/home-ai/components/mobile-nav';
import BeforeAfterSlider from '@/app/home-ai/components/before-after-slider';
import FeaturedPremiumStyles from '@/app/home-ai/components/featured-premium-styles';
import { GlassCard } from '@/app/home-ai/components/ui/glass-card';
import { useEffect, useState } from 'react';
import { Session } from '@supabase/supabase-js';
import { createClient } from '@/lib/supabase/client';
import { NewNavbar, RevaLogo } from '@/components/new-navbar';
import { useTheme } from 'next-themes';
import { LoginModal } from '@/components/login';
import { fetchVstagePremiumData } from '@/utils/helper';

interface NewHomePageClientProps {
  session: Session | null;
}

import { roomTypesV2 } from '@/lib/constants';

const VirtualStaging: React.FC<NewHomePageClientProps> = ({ session: initialSession }) => {
  const supabase = createClient();
  const { theme, setTheme } = useTheme();
  const [roomTypes, setRoomTypes] = useState([]);
  const [isPremiumSelected, setIsPremiumSelected] = useState(false);
  const [beforeImageUrl, setBeforeImageUrl] = useState('');
  const [selectedImages, setSelectedImages] = useState<any>(null);
  const [roomStyles, setRoomStyles] = useState<any[]>([]);
  const [roomBundles, setRoomBundles] = useState<any[]>([]);
  const handlePremiumStyleSelection = (hasPremium: boolean) => {
    setIsPremiumSelected(hasPremium);
  };

  const [session, setSession] = useState<Session | null>(initialSession);
  useEffect(() => {
    //   fetchSelection();
    //   fetchResults();
    //   fetchMyUploads();
    fetchRoomTypes();
  }, []);

  useEffect(() => {
    if (selectedImages?.length > 0) {
      // Use the first image's URL
      setBeforeImageUrl(selectedImages[0].image || selectedImages[0].img || '');
    } else {
      setBeforeImageUrl(''); // Clear if no images
    }
    console.log('roomStyles,in mainsdf', roomStyles);
    console.log('roomBundlesads', roomBundles);
    console.log('selectedImages', selectedImages);
  }, [selectedImages]);

  const fetchRoomTypes = async () => {
    const data = await fetchVstagePremiumData('room-types', '');
    if (data.length) {
      setRoomTypes(
        data.map((item: any) => {
          return {
            label: item.Name,
            value: item.ID || item.Id,
            img: item.ThumbnailURL || '',
            type: roomTypesV2.filter((item2) => item2.label == item.Name).length
              ? 'both'
              : 'premium',
          };
        }),
      );
    }
  };

  // const finalActionHandler = (premium:boolean, selectedImage:any) => {
  //   if (
  //     infer.enablePay.credit_left <
  //     selectedImage.roomStyle.length * (premium ? 20 : 8)
  //   ) {
  //     // saveDataInLocalStorage("selectedImages", selectedImage);
  //     // setPricing(true);
  //   } else {
  //     handleRemove(selectedImage.id);
  //     premium
  //       ? handleGeneratePremium(selectedImage)
  //       : handleGenerateRegular(selectedImage);
  //   }
  // };

  const updateSelectedImage = (id: string, data: any) => {
    setSelectedImages((prev: any) =>
      prev.map((item: any) => (item.id === id ? { ...item, ...data } : item)),
    );
  };

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
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-200 dark:from-slate-950 dark:to-slate-900">
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
        <main className="mt-[4rem] py-8">
          <section className="mb-12">
            <div className="mx-auto max-w-3xl text-center">
              <h1 className="text-3xl md:text-4xl font-bold mb-4">Transform Your Space with AI</h1>
              <p className="text-muted-foreground mb-8">
                Upload a room photo and visualize different interior design styles instantly
              </p>
            </div>

            <UploadSection selectedImages={selectedImages} setSelectedImages={setSelectedImages} session={session}/>
          </section>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <GlassCard className="p-4 sm:p-6 overflow-hidden">
                <div className="mb-6">
                  <BeforeAfterSlider
                    beforeImage={beforeImageUrl || '/placeholder.svg'} // fallback in case it's empty
                    afterImage="/placeholder.svg?height=600&width=800"
                    beforeLabel="Original"
                    afterLabel="Redesigned"
                  />

                  <div className="flex justify-center mt-2">
                    <p className="text-xs text-muted-foreground">
                      Drag slider to compare before and after
                    </p>
                  </div>
                </div>

                {/* Featured Premium Styles - Prominent placement */}
                <div className="mb-8">
                  <FeaturedPremiumStyles />
                </div>

                <div className="space-y-6" id="room-style-section">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold">Room Style</h2>
                    <span className="text-xs text-muted-foreground bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm px-2 py-1 rounded-full">
                    Select multiple styles or bundles to combine
                    </span>
                  </div>
                  <RoomStyleSelector
                   roomStyles={roomStyles}
                   roomBundles={roomBundles}
                   onPremiumStyleSelection={handlePremiumStyleSelection}
                   updateSelectedImage={updateSelectedImage}
                   selectedImages={selectedImages}
                   />
                </div>
              </GlassCard>

              <GlassCard className="p-4 sm:p-6">
                <h2 className="text-xl font-semibold mb-6">My Results</h2>
                <ResultsGallery />
              </GlassCard>
            </div>

            <div className="lg:col-span-1">
              <GlassCard className="p-4 sm:p-6 lg:sticky lg:top-24">
                <h2 className="text-xl font-semibold mb-6">Customize Your Space</h2>
                <OptionControls
                  roomTypes={roomTypes}
                  isPremiumSelected={isPremiumSelected}
                  updateSelectedImage={updateSelectedImage}
                  selectedImages={selectedImages}
                  roomStyles={roomStyles}
                  setRoomStyles={setRoomStyles}
                  roomBundles={roomBundles}
                  setRoomBundles={setRoomBundles}
                />
              </GlassCard>
            </div>
          </div>
        </main>
      )}
    </div>
  );
};

export default VirtualStaging;
