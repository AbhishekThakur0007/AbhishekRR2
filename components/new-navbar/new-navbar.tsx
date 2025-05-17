'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import {
  Camera,
  ChevronDown,
  LogOut,
  Menu,
  MessageSquare,
  Moon,
  PenLine,
  Phone,
  Search,
  Settings,
  Sofa,
  Sun,
  User,
  Wallet,
  Glasses,
  TrendingUp,
  CircleDollarSign,
} from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { RevaLogo } from './reva-logo-dark';
import { PopularPromptsModal } from './popular-promts-modal';
import { AnimatedSearch } from './animated-search';
import { ActivityPopover } from './activity-popover';
import { SidebarTrigger, useSidebar } from '@/components/ui/sidebar';
import { PricingModal } from '../ui/pricing-modal';
import Image from 'next/image';
import { MLSListing, PropertyDetailResponse } from '@/app/types/real-estate';

interface NavItem {
  title: string;
  href?: string;
  disabled?: boolean;
  external?: boolean;
  icon?: React.ReactNode;
  label?: string;
  description?: string;
  children?: NavItem[];
  onClick?: () => void;
}

interface NavbarProps {
  logo?: React.ReactNode;
  items?: NavItem[];
  showSearch?: boolean;
  showThemeToggle?: boolean;
  showLanguageSelector?: boolean;
  showUserMenu?: boolean;
  showBalance?: boolean;
  isLogoVisible?: boolean;
  isSidebarVisible?: boolean;
  showCreateButton?: boolean;
  showNotifications?: boolean;
  showMessages?: boolean;
  balance?: number;
  user?: {
    name?: string;
    email?: string;
    image?: string;
    initials?: string;
  };
  languages?: {
    current: string;
    options: { label: string; value: string }[];
  };
  onThemeToggle?: (theme?: string) => void;
  onLanguageChange?: (language: string) => void;
  onLogout?: () => void;
  onSearch?: (query: string) => void;
  className?: string;
  isDark?: boolean;
  propertyData?: PropertyDetailResponse | null;
  mlsData?: MLSListing | null;
}

// Sample notifications data
const sampleNotifications = [
  {
    id: '1',
    title: 'New message from John',
    description: "Hey, how's it going? I wanted to ask about...",
    time: '2 min ago',
    read: false,
    type: 'info' as const,
  },
  {
    id: '2',
    title: 'Payment successful',
    description: 'Your payment of $49.99 has been processed successfully.',
    time: '1 hour ago',
    read: false,
    type: 'success' as const,
  },
  {
    id: '3',
    title: 'Meeting reminder',
    description: 'Your meeting with the design team starts in 30 minutes.',
    time: '3 hours ago',
    read: false,
    type: 'warning' as const,
  },
  {
    id: '4',
    title: 'System update required',
    description: 'Please update your system to the latest version for security improvements.',
    time: 'Yesterday',
    read: true,
    type: 'error' as const,
  },
  {
    id: '5',
    title: 'New feature available',
    description: 'Check out our new AI-powered search feature!',
    time: '2 days ago',
    read: true,
    type: 'info' as const,
  },
];

// Sample icon notifications data
const iconNotifications = {
  camera: 2,
  sofa: 5,
  phone: 1,
  pen: 3,
};

// Define defaultNavItems outside the component
const createDefaultNavItems = (openPricingModal: () => void): NavItem[] => [
  {
    title: 'About',
    href: '/about',
  },
  {
    title: 'Pricing',
    href: '',
    onClick: openPricingModal,
  },
  {
    title: 'Help', // Changed from "Contact" to "Help"
    href: '/help',
  },
];

// Rename the original component
function NavbarBase({
  logo,
  items,
  showSearch = false,
  showThemeToggle = true,
  showLanguageSelector = false,
  showUserMenu = true,
  showBalance = false,
  isLogoVisible = true,
  isSidebarVisible = true,
  showCreateButton = false,
  showNotifications = false,
  showMessages = false,
  balance = 0,
  user,
  languages = {
    current: 'Eng',
    options: [
      { label: 'English', value: 'en' },
      { label: 'Français', value: 'fr' },
      { label: 'Español', value: 'es' },
    ],
  },
  onThemeToggle,
  onLanguageChange,
  onLogout,
  onSearch,
  className,
  isDark = false,
  propertyData,
  mlsData,
}: NavbarProps) {
  const pathname = usePathname();
  const [isSearchOpen, setIsSearchOpen] = React.useState(false);
  const [isPromptsModalOpen, setIsPromptsModalOpen] = React.useState(false);
  const [isPricingModalOpen, setIsPricingModalOpen] = React.useState(false);
  const [notifications, setNotifications] = React.useState(sampleNotifications);

  const router = useRouter();

  // Helper to safely use sidebar context
  const useSidebarSafely = () => {
    try {
      return useSidebar();
    } catch (e) {
      // SidebarProvider not found or not used on this page
      return null;
    }
  };

  const sidebar = useSidebarSafely();
  const sidebarCollapsedAndDesktop = sidebar && sidebar.state === 'collapsed' && !sidebar.isMobile;

  const navItems = items || createDefaultNavItems(() => setIsPricingModalOpen(true));

  const handleSearch = (query: string) => {
    if (onSearch) {
      onSearch(query);
    }
    setIsSearchOpen(false);
  };

  const handleMarkAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((notification) =>
        notification.id === id ? { ...notification, read: true } : notification,
      ),
    );
  };

  const handleMarkAllAsRead = () => {
    setNotifications((prev) => prev.map((notification) => ({ ...notification, read: true })));
  };

  const handleDismissNotification = (id: string) => {
    setNotifications((prev) => prev.filter((notification) => notification.id !== id));
  };

  // Check if it's a search page (adjust path as needed)
  // const isSearchPage = pathname?.startsWith('/search/') || pathname?.startsWith('/maps-search/');

  return (
    <header
      className={cn(
        'sticky top-0 z-50 w-full bg-white border-b backdrop-blur dark:bg-background/95 supports-[backdrop-filter]:bg-white dark:supports-[backdrop-filter]:bg-background/60 navbar-glass',
        className,
      )}
    >
      <div className="container flex items-center h-16">
        {/* Modified main logo conditional rendering: */}
        {(isLogoVisible || sidebarCollapsedAndDesktop) && (
          <div className="hidden mx-8 md:flex">
            <Link href="/">
              <Image src="/logo.svg" alt="Logo" width={120} height={40} className="dark:hidden" />
              <Image
                src="/logo-dark.svg"
                alt="Logo"
                width={120}
                height={40}
                className="hidden dark:block"
              />
            </Link>
          </div>
        )}

        {isSidebarVisible && <SidebarTrigger />}
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="mr-2 md:hidden">
              <Menu className="w-5 h-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="pr-0">
            <div className="px-7">{logo || <RevaLogo />}</div>
            <div className="flex flex-col gap-4 mt-8">
              {navItems.map((item, index) => (
                <MobileNavItem key={index} item={item} pathname={pathname} />
              ))}
            </div>
          </SheetContent>
        </Sheet>

        <div className="hidden md:flex">
          <NavigationMenu>
            <NavigationMenuList>
              {navItems.map((item, index) => (
                <NavbarItem key={index} item={item} pathname={pathname} />
              ))}
            </NavigationMenuList>
          </NavigationMenu>
          {/* Property Price and Status - only on search page with data */}
          {propertyData && mlsData && (
            <div className="hidden gap-4 items-center mr-4 md:flex">
              <div className="flex gap-2 items-center">
                <Badge
                  variant="secondary"
                  className={`${
                    mlsData?.standardStatus || mlsData?.customStatus ? 'bg-green-500' : 'bg-red-500'
                  }`}
                >
                  {mlsData?.standardStatus || mlsData?.customStatus || 'Not Listed'}
                </Badge>
                {(mlsData?.standardStatus || mlsData?.customStatus) && (
                  <span className="font-medium">
                    {new Intl.NumberFormat('en-US', {
                      style: 'currency',
                      currency: 'USD',
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 0,
                    }).format(mlsData?.listPrice ?? propertyData?.data?.mlsListingPrice ?? 0)}
                  </span>
                )}
                {/* Display Office Name */}
                {mlsData?.listingOffice?.name && (
                  <>
                    <span className="mx-1 text-muted-foreground">•</span> {/* Separator */}
                    <span
                      className="text-sm text-muted-foreground truncate max-w-[150px]"
                      title={mlsData.listingOffice.name}
                    >
                      {mlsData.listingOffice.name}
                    </span>
                  </>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="flex flex-1 gap-2 justify-end items-center">
          {/* Search button */}
          {showSearch && (
            <div className="hidden relative mr-2 md:flex">
              <Button variant="ghost" size="icon" onClick={() => setIsSearchOpen(true)}>
                <Search className="w-5 h-5" />
                <span className="sr-only">Search</span>
              </Button>
            </div>
          )}

          {/* Icon buttons with notifications */}
          <div className="hidden gap-2 items-center mr-2 md:flex">
            <div className="relative mr-2">
              <ActivityPopover
                activities={[
                  {
                    id: '1',
                    title: 'New login detected',
                    description:
                      'Your account was accessed from a new device in San Francisco, CA.',
                    time: 'Just now',
                    type: 'login' as const,
                  },
                  {
                    id: '2',
                    title: 'Message from Sarah',
                    description: 'Sarah sent you a message regarding the project deadline.',
                    time: '5 min ago',
                    type: 'message' as const,
                  },
                  {
                    id: '3',
                    title: 'File shared with you',
                    description: "Michael shared 'Q3 Marketing Plan.pdf' with you.",
                    time: '30 min ago',
                    type: 'file' as const,
                  },
                  {
                    id: '4',
                    title: 'Settings updated',
                    description: 'Your account settings were updated successfully.',
                    time: '1 hour ago',
                    type: 'settings' as const,
                  },
                  {
                    id: '5',
                    title: 'Security alert',
                    description: 'Unusual activity detected on your account. Please verify.',
                    time: '2 hours ago',
                    type: 'alert' as const,
                  },
                ]}
                onViewAll={() => console.log('View all activities')}
              />
            </div>

            <div className="relative" onClick={() => router.push('https://photo.reva.now')}>
              <Button size="icon" className="text-white bg-black hover:bg-black/90">
                <Camera className="w-5 h-5" />
                <span className="sr-only">Camera</span>
              </Button>
              <Badge className="flex absolute -top-1 -right-1 justify-center items-center p-0 w-5 h-5 bg-red-500 rounded-full">
                {iconNotifications.camera}
              </Badge>
            </div>

            <div className="relative" onClick={() => router.push('https://stage.reva.now')}>
              <Button size="icon" className="text-white bg-black hover:bg-black/90">
                <Sofa className="w-5 h-5" />
                <span className="sr-only">Room</span>
              </Button>
              <Badge className="flex absolute -top-1 -right-1 justify-center items-center p-0 w-5 h-5 bg-red-500 rounded-full">
                {iconNotifications.sofa}
              </Badge>
            </div>

            <div className="relative" onClick={() => router.push('/calling')}>
              <Button size="icon" className="text-white bg-black hover:bg-black/90">
                <Phone className="w-5 h-5" />
                <span className="sr-only">Phone</span>
              </Button>
              <Badge className="flex absolute -top-1 -right-1 justify-center items-center p-0 w-5 h-5 bg-red-500 rounded-full">
                {iconNotifications.phone}
              </Badge>
            </div>

            <div className="relative">
              <Button
                size="icon"
                className="text-white bg-black hover:bg-black/90"
                onClick={() => setIsPromptsModalOpen(true)}
              >
                <PenLine className="w-5 h-5" />
                <span className="sr-only">Prompts</span>
              </Button>
              <Badge className="flex absolute -top-1 -right-1 justify-center items-center p-0 w-5 h-5 bg-red-500 rounded-full">
                {iconNotifications.pen}
              </Badge>
            </div>
          </div>

          {showLanguageSelector && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="gap-1 text-sm font-medium">
                  {languages.current}
                  <ChevronDown className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {languages.options.map((language) => (
                  <DropdownMenuItem
                    key={language.value}
                    onClick={() => onLanguageChange?.(language.value)}
                  >
                    {language.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          {showBalance && (
            <>
              <div className="hidden gap-2 items-center md:flex">
                <Wallet className="w-4 h-4" />
                <span className="text-sm font-medium text-green-600 positive">
                  +{balance.toLocaleString()}
                </span>
              </div>
            </>
          )}

          {showMessages && (
            <Button variant="ghost" size="icon" className="relative">
              <MessageSquare className="w-5 h-5" />
              <Badge className="flex absolute -top-1 -right-1 justify-center items-center p-0 w-5 h-5 rounded-full">
                3
              </Badge>
              <span className="sr-only">Messages</span>
            </Button>
          )}

          {showUserMenu && user && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={user.image} alt={user.name || 'User'} />
                    <AvatarFallback>{user.initials || 'U'}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>
                  {user.name && <p>{user.name}</p>}
                  {user.email && <p className="text-xs text-muted-foreground">{user.email}</p>}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <User className="mr-2 w-4 h-4" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="mr-2 w-4 h-4" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={onLogout}>
                  <LogOut className="mr-2 w-4 h-4" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          {showThemeToggle && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                  <span className="sr-only">Toggle theme</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onThemeToggle?.('light')}>
                  <Sun className="mr-2 w-4 h-4" />
                  Light
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onThemeToggle?.('dark')}>
                  <Moon className="mr-2 w-4 h-4" />
                  Dark
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onThemeToggle?.('robinhood')}>
                  <TrendingUp className="mr-2 w-4 h-4" />
                  Robinhood
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onThemeToggle?.('glass')}>
                  <Glasses className="mr-2 w-4 h-4" />
                  Glass
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onThemeToggle?.('system')}>
                  <Settings className="mr-2 w-4 h-4" />
                  System
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          {/* Logout button */}
          <Button variant="ghost" size="icon" className="ml-2" onClick={onLogout}>
            <LogOut className="w-5 h-5" />
            <span className="sr-only">Logout</span>
          </Button>
        </div>
      </div>

      {/* Prompts Modal */}
      <PopularPromptsModal open={isPromptsModalOpen} onOpenChange={setIsPromptsModalOpen} />
      <PricingModal open={isPricingModalOpen} onOpenChange={setIsPricingModalOpen} />

      {/* Animated Search */}
      <AnimatedSearch
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSearch={handleSearch}
      />
    </header>
  );
}

function NavbarItem({ item, pathname }: { item: NavItem; pathname: string | null }) {
  if (item.children) {
    return (
      <NavigationMenuItem>
        <NavigationMenuTrigger>{item.title}</NavigationMenuTrigger>
        <NavigationMenuContent>
          <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
            {item.children.map((child) => (
              <li key={child.title} className="row-span-3">
                <NavigationMenuLink asChild>
                  <Link
                    href={child.href || '#'}
                    className="flex flex-col justify-end p-6 w-full h-full no-underline bg-gradient-to-b rounded-md outline-none select-none from-muted/50 to-muted focus:shadow-md"
                  >
                    {child.icon}
                    <div className="mt-4 mb-2 text-lg font-medium">{child.title}</div>
                    <p className="text-sm leading-tight text-muted-foreground">
                      {child.description}
                    </p>
                  </Link>
                </NavigationMenuLink>
              </li>
            ))}
          </ul>
        </NavigationMenuContent>
      </NavigationMenuItem>
    );
  }

  return (
    <NavigationMenuItem>
      <Link href={item.href || '#'} legacyBehavior passHref>
        <NavigationMenuLink
          className={cn(
            navigationMenuTriggerStyle(),
            pathname === item.href && 'bg-accent text-accent-foreground',
            item.disabled && 'cursor-not-allowed opacity-60',
          )}
          onClick={item.onClick}
        >
          {item.title}
        </NavigationMenuLink>
      </Link>
    </NavigationMenuItem>
  );
}

function MobileNavItem({ item, pathname }: { item: NavItem; pathname: string | null }) {
  const [isOpen, setIsOpen] = React.useState(false);

  if (item.children) {
    return (
      <div className="flex flex-col">
        <button
          className="flex justify-between items-center py-2 text-base font-medium"
          onClick={() => setIsOpen(!isOpen)}
        >
          {item.title}
          <ChevronDown className={cn('h-4 w-4 transition-transform', isOpen && 'rotate-180')} />
        </button>
        {isOpen && (
          <div className="flex flex-col gap-2 mt-2 ml-4">
            {item.children.map((child) => (
              <Link
                key={child.title}
                href={child.href || '#'}
                className={cn(
                  'py-2 text-sm',
                  pathname === child.href && 'font-medium text-primary',
                  child.disabled && 'cursor-not-allowed opacity-60',
                )}
              >
                {child.title}
              </Link>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <Link
      href={item.href || '#'}
      className={cn(
        'py-2 text-base font-medium',
        pathname === item.href && 'text-primary',
        item.disabled && 'cursor-not-allowed opacity-60',
      )}
      onClick={item.onClick}
    >
      {item.title}
    </Link>
  );
}

// Wrap the base component in a client-only component
const NewNavbar = dynamic(() => Promise.resolve(NavbarBase), {
  ssr: false,
});

export { NewNavbar };
