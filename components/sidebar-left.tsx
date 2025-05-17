'use client';

import * as React from 'react';
import {
  AudioWaveform,
  Blocks,
  Calendar,
  Command,
  Home,
  Image as ImageIcon,
  Inbox,
  Mail,
  MessageCircleQuestion,
  MonitorPlay,
  Search,
  Settings2,
  Shell,
  Sparkles,
  Trash2,
  Building,
  MapPin,
} from 'lucide-react';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { getSearchHistory, SearchHistoryItem, deleteSearchHistoryItem } from '@/lib/search-history';
import { formatDistanceToNow } from 'date-fns';
import { Button } from './ui/button';
import { useRouter, usePathname } from 'next/navigation';

import { NavMain } from '@/components/nav-main';
import { NavSecondary } from '@/components/nav-secondary';
import { Sidebar, SidebarContent, SidebarHeader, SidebarRail } from '@/components/ui/sidebar';
import { CalendarIcon, MagnifyingGlassIcon } from '@radix-ui/react-icons';
import { NavHistory } from '@/components/nav-history';
import { NavListings } from '@/components/nav-listings';
import Link from 'next/link';

// This is sample data.
const data = {
  navMain: [
    {
      title: 'Search',
      url: 'https://reva.now/',
      icon: Search,
    },
    {
      title: 'Ask AI',
      url: '#',
      icon: Sparkles,
    },
    {
      title: 'AI Diallers',
      url: 'https://call.reva.now/',
      icon: Sparkles,
      isActive: true,
    },
    {
      title: 'Pipeline',
      url: '#',
      icon: Shell,
      badge: '10',
    },
    {
      title: 'Photo AI',
      url: 'https://photo.reva.now/',
      icon: ImageIcon,
      badge: '10',
    },
    {
      title: 'Virtual Staging',
      url: 'https://stage.reva.now/',
      icon: MonitorPlay,
      badge: '10',
    },
  ],
  navSecondary: [
    {
      title: 'Calendar',
      url: '#',
      icon: Calendar,
    },
    {
      title: 'Mail',
      url: '#',
      icon: Mail,
    },
    {
      title: 'Settings',
      url: '#',
      icon: Settings2,
    },
    {
      title: 'Help',
      url: '#',
      icon: MessageCircleQuestion,
    },
  ],
  listings: [
    {
      name: 'Residential Properties',
      icon: <Home className="mr-2 w-4 h-4 text-muted-foreground" />,
      properties: [
        {
          name: 'Single Family Homes',
          url: '#',
        },
        {
          name: 'Condos & Townhouses',
          url: '#',
        },
        {
          name: 'Luxury Estates',
          url: '#',
        },
      ],
    },
    {
      name: 'Commercial Properties',
      icon: <Building className="mr-2 w-4 h-4 text-muted-foreground" />,
      properties: [
        {
          name: 'Office Spaces',
          url: '#',
        },
        {
          name: 'Retail Locations',
          url: '#',
        },
        {
          name: 'Industrial Buildings',
          url: '#',
        },
      ],
    },
    {
      name: 'Locations',
      icon: <MapPin className="mr-2 w-4 h-4 text-muted-foreground" />,
      properties: [
        {
          name: 'Coastal Properties',
          url: '#',
        },
        {
          name: 'Urban Properties',
          url: '#',
        },
        {
          name: 'Rural Properties',
          url: '#',
        },
      ],
    },
  ],
};

export function SidebarLeft({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const [searchHistory, setSearchHistory] = useState<SearchHistoryItem[]>([]);
  const router = useRouter();
  const pathname = usePathname();
  const [numDisplayedHistory, setNumDisplayedHistory] = useState(3);

  useEffect(() => {
    loadSearchHistory();
  }, [pathname]);

  const loadSearchHistory = async () => {
    try {
      const history = await getSearchHistory();
      setSearchHistory(history);
    } catch (error) {
      console.error('Error loading search history:', error);
    }
  };

  const handleDeleteHistory = async (id: string) => {
    try {
      await deleteSearchHistoryItem(id);
      setSearchHistory((prev) => prev.filter((item) => item.id !== id));
    } catch (error) {
      console.error('Error deleting search history:', error);
    }
  };

  return (
    <Sidebar className="w-64 border-r-0" {...props}>
      <SidebarHeader className="py-2 h-auto">
        <div className="m-2">
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
        <NavMain items={data.navMain} maxItems={6} />
      </SidebarHeader>
      <SidebarContent className="overflow-y-auto">
        <div className="px-4 py-2">
          <h3 className="mb-2 text-sm font-semibold">Recent Searches</h3>
          <div className="space-y-2">
            {searchHistory.slice(0, numDisplayedHistory).map((item) => (
              <div
                key={item.id}
                className="flex justify-between items-center p-2 rounded-md cursor-pointer group hover:bg-accent"
                onClick={() => {
                  // Use the stored route directly
                  router.push(item.route);
                }}
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm truncate">{item.search_query}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(item.created_at), { addSuffix: true })}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="opacity-0 group-hover:opacity-100"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteHistory(item.id);
                  }}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
            {searchHistory.length === 0 && (
              <p className="py-2 text-sm text-center text-muted-foreground">No recent searches</p>
            )}
            {searchHistory.length > numDisplayedHistory && (
              <Button
                variant="link"
                className="w-full text-sm text-center text-muted-foreground"
                onClick={() => setNumDisplayedHistory(searchHistory.length)}
              >
                Show more
              </Button>
            )}
            {searchHistory.length > 3 && numDisplayedHistory === searchHistory.length && (
              <Button
                variant="link"
                className="w-full text-sm text-center text-muted-foreground"
                onClick={() => setNumDisplayedHistory(3)}
              >
                Show less
              </Button>
            )}
          </div>
        </div>
        {/* <NavHistory history={data.history} maxItems={4} /> */}
        <NavListings listings={data.listings} maxCategories={3} maxPropertiesPerCategory={2} />
        <NavSecondary items={data.navSecondary} maxItems={4} className="mt-auto" />
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
