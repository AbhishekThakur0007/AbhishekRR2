'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import RoomElements from '@/app/home-ai/components/room-elements';
import StylePreviewCard from '@/app/home-ai/components/style-preview-card';
import { Badge } from '@/components/ui/badge';
import { Crown, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface RoomStyle {
  label: string;
  Id: number;
  img: string;
  type: 'both' | 'premium';
  value: string;
}

interface RoomBundle {
  label: string;
  Id: number;
  img: string;
  type: 'both' | 'premium';
  value: string;
}

interface BundleItem {
  Id: number;
  value: string;
  type: 'premium' | 'regular';
}

interface ImageItem {
  id: string;
  img?: string;
  image?: string;
  name?: string;
  img_id?: string;
  roomType?: {
    Id: string;
    value: string;
    type: string;
  };
  roomStyle?: BundleItem[];
  roomBundle?: BundleItem[];
}

interface RoomStyleSelectorProps {
  roomStyles: RoomStyle[];
  roomBundles: RoomBundle[];
  onPremiumStyleSelection?: (hasPremium: boolean) => void;
  updateSelectedImage: (id: string, data: Partial<ImageItem>) => void;
  selectedImages: ImageItem[];
}

export default function RoomStyleSelector({
  roomStyles,
  roomBundles,
  onPremiumStyleSelection,
  updateSelectedImage,
  selectedImages,
}: RoomStyleSelectorProps) {
  const [selectedStyleIds, setSelectedStyleIds] = useState<string[]>([]);
  const [selectedBundleIds, setSelectedBundleIds] = useState<string[]>([]);
  const [styleFilter, setStyleFilter] = useState<string | null>(null);
  const [bundleFilter, setBundleFilter] = useState<string | null>(null);
  const [showAllStyles, setShowAllStyles] = useState(false);
  const [showAllBundles, setShowAllBundles] = useState(false);

  // Map roomStyles to StylePreviewCard format
  const allStyles = useMemo(
    () =>
      roomStyles.map((style) => ({
        id: style.Id.toString(),
        name: style.label,
        image: style.img || '/placeholder.svg?height=200&width=300',
        isPremium: style.type === 'premium',
        category: style.type === 'premium' ? 'premium' : 'popular',
      })),
    [roomStyles],
  );

  // Map roomBundles to StylePreviewCard format
  const allBundles = useMemo(
    () =>
      roomBundles.map((bundle) => ({
        id: bundle.Id.toString(),
        name: bundle.label,
        image: bundle.img || '/placeholder.svg?height=200&width=300',
        isPremium: bundle.type === 'premium',
        category: bundle.type === 'premium' ? 'premium' : 'popular',
      })),
    [roomBundles],
  );

  // Style filtering
  const filteredStyles = styleFilter ? allStyles.filter((style) => style.category === styleFilter) : allStyles;
  const displayedStyles = showAllStyles ? filteredStyles : filteredStyles.slice(0, 8);
  const hasMoreStyles = filteredStyles.length > displayedStyles.length;

  // Bundle filtering
  const filteredBundles = bundleFilter ? allBundles.filter((bundle) => bundle.category === bundleFilter) : allBundles;
  const displayedBundles = showAllBundles ? filteredBundles : filteredBundles.slice(0, 8);
  const hasMoreBundles = filteredBundles.length > displayedBundles.length;

  // Sync selected styles with selectedImages.roomStyle
  useEffect(() => {
    if (selectedImages?.length > 0 && Array.isArray(selectedImages[0]?.roomStyle)) {
      const currentStyleIds = selectedImages[0].roomStyle.map((style: BundleItem) => style.Id.toString());
      setSelectedStyleIds(currentStyleIds);
    } else {
      setSelectedStyleIds([]);
    }
  }, [selectedImages]);

  // Sync selected bundles with selectedImages.roomBundle
  useEffect(() => {
    if (selectedImages?.length > 0 && Array.isArray(selectedImages[0]?.roomBundle)) {
      const currentBundleIds = selectedImages[0].roomBundle.map((bundle: BundleItem) => bundle.Id.toString());
      setSelectedBundleIds(currentBundleIds);
    } else {
      setSelectedBundleIds([]);
    }
  }, [selectedImages]);

  // Check if any selected style is premium
  const selectedStylesData = allStyles.filter((style) => selectedStyleIds.includes(style.id));
  const isPremiumStyleSelected = selectedStylesData.some((style) => style.isPremium);

  // Check if any selected style or bundle is premium for RoomElements
  const selectedBundlesData = allBundles.filter((bundle) => selectedBundleIds.includes(bundle.id));
  const isPremiumSelected =
    selectedStylesData.some((style) => style.isPremium) || selectedBundlesData.some((bundle) => bundle.isPremium);

  // Notify parent component when premium selection changes
  useEffect(() => {
    if (onPremiumStyleSelection) {
      onPremiumStyleSelection(isPremiumSelected);
    }
  }, [isPremiumSelected, onPremiumStyleSelection]);

  // Update selectedImages.roomStyle
  const updateRoomStyles = (newStyleIds: string[]) => {
    if (selectedImages.length === 0) return;

    const newRoomStyles = newStyleIds
      .map((id) => {
        const style = allStyles.find((s) => s.id === id);
        return style
          ? {
              Id: parseInt(style.id),
              value: style.name,
              type: style.isPremium ? 'premium' : 'regular',
            }
          : null;
      })
      .filter((s) => s !== null) as BundleItem[];

    updateSelectedImage(selectedImages[0].id, {
      roomStyle: newRoomStyles,
    });
  };

  // Update selectedImages.roomBundle
  const updateRoomBundles = (newBundleIds: string[]) => {
    if (selectedImages.length === 0) return;

    const newRoomBundles = newBundleIds
      .map((id) => {
        const bundle = allBundles.find((b) => b.id === id);
        return bundle
          ? {
              Id: parseInt(bundle.id),
              value: bundle.name,
              type: bundle.isPremium ? 'premium' : 'regular',
            }
          : null;
      })
      .filter((b) => b !== null) as BundleItem[];

    updateSelectedImage(selectedImages[0].id, {
      roomBundle: newRoomBundles,
    });
  };

  // Handle style selection
  const handleStyleSelect = (styleId: string) => {
    let newStyleIds: string[];
    if (selectedStyleIds.includes(styleId)) {
      newStyleIds = selectedStyleIds.filter((id) => id !== styleId);
    } else {
      newStyleIds = [...selectedStyleIds, styleId];
    }
    setSelectedStyleIds(newStyleIds);
    updateRoomStyles(newStyleIds);
  };

  // Handle bundle selection (only if premium style is selected)
  const handleBundleSelect = (bundleId: string) => {
    if (!isPremiumStyleSelected) return; // Prevent selection if no premium style

    let newBundleIds: string[];
    if (selectedBundleIds.includes(bundleId)) {
      newBundleIds = selectedBundleIds.filter((id) => id !== bundleId);
    } else {
      newBundleIds = [...selectedBundleIds, bundleId];
    }
    setSelectedBundleIds(newBundleIds);
    updateRoomBundles(newBundleIds);
  };

  // Ensure premium styles are visible in the initial view
  const initialDisplayStyles = () => {
    if (styleFilter) return displayedStyles;
    const nonPremiumStyles = displayedStyles.filter((style) => !style.isPremium);
    const premiumStylesToShow = allStyles.filter((style) => style.isPremium).slice(0, 2);
    if (!showAllStyles) {
      return [...nonPremiumStyles.slice(0, 6), ...premiumStylesToShow];
    }
    return displayedStyles;
  };

  // Ensure premium bundles are visible in the initial view
  const initialDisplayBundles = () => {
    if (bundleFilter) return displayedBundles;
    const nonPremiumBundles = displayedBundles.filter((bundle) => !bundle.isPremium);
    const premiumBundlesToShow = allBundles.filter((bundle) => bundle.isPremium).slice(0, 2);
    if (!showAllBundles) {
      return [...nonPremiumBundles.slice(0, 6), ...premiumBundlesToShow];
    }
    return displayedBundles;
  };

  const visibleStyles = styleFilter === 'premium' ? displayedStyles : initialDisplayStyles();
  const visibleBundles = bundleFilter === 'premium' ? displayedBundles : initialDisplayBundles();

  return (
    <div className="space-y-12">
      {/* Room Styles Section */}
      <div className="space-y-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            <Badge
              variant={styleFilter === null ? 'default' : 'outline'}
              className="cursor-pointer backdrop-blur-sm"
              onClick={() => setStyleFilter(null)}
            >
              All Styles
            </Badge>
            <Badge
              variant={styleFilter === 'popular' ? 'default' : 'outline'}
              className="cursor-pointer backdrop-blur-sm"
              onClick={() => setStyleFilter('popular')}
            >
              Popular
            </Badge>
            <Badge
              variant={styleFilter === 'premium' ? 'default' : 'outline'}
              className="cursor-pointer bg-gradient-to-r from-purple-600 to-red-600 hover:from-purple-700 hover:to-red-700 text-white backdrop-blur-sm"
              onClick={() => setStyleFilter('premium')}
            >
              <Crown className="h-3 w-3 mr-1" /> Premium
            </Badge>
          </div>
        </div>

        {selectedStyleIds.length > 0 && (
          <div className="flex items-center justify-between mb-4 p-3 bg-white/60 dark:bg-slate-900/60 backdrop-blur-sm rounded-lg border border-white/20 dark:border-slate-800/50">
            <div className="flex items-center gap-2">
              <div className="bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-400 w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium">
                {selectedStyleIds.length}
              </div>
              <span className="text-sm font-medium">
                {selectedStyleIds.length === 1 ? 'Style' : 'Styles'} selected
              </span>
            </div>
            <button
              onClick={() => {
                setSelectedStyleIds([]);
                updateRoomStyles([]);
              }}
              className="text-xs text-muted-foreground hover:text-foreground bg-slate-100/50 dark:bg-slate-800/50 px-2 py-1 rounded-md"
            >
              Clear all
            </button>
          </div>
        )}

        {(styleFilter === null || styleFilter === 'premium') && (
          <div className="bg-gradient-to-r from-purple-50/80 to-red-50/80 dark:from-purple-950/30 dark:to-red-950/20 backdrop-blur-sm rounded-lg p-4 mb-6 border border-purple-200/50 dark:border-purple-800/30">
            <div className="flex items-center gap-2 mb-2">
              <Crown className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              <h3 className="font-semibold text-purple-800 dark:text-purple-400">Premium Styles</h3>
            </div>
            <p className="text-sm text-purple-700 dark:text-purple-300">
              Unlock premium styles for stunning, professional-quality room transformations with exclusive design
              elements.
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-4 gap-4">
          {visibleStyles.map((style) => (
            <StylePreviewCard
              key={style.id}
              style={style}
              isSelected={selectedStyleIds.includes(style.id)}
              onSelect={() => handleStyleSelect(style.id)}
            />
          ))}
        </div>

        {hasMoreStyles || showAllStyles ? (
          <div className="flex justify-center mt-6">
            <Button
              variant="outline"
              onClick={() => setShowAllStyles(!showAllStyles)}
              className="group bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm"
            >
              {showAllStyles ? (
                <>
                  Show Less
                  <ChevronUp className="ml-2 h-4 w-4 group-hover:-translate-y-0.5 transition-transform" />
                </>
              ) : (
                <>
                  Show More Styles
                  <ChevronDown className="ml-2 h-4 w-4 group-hover:translate-y-0.5 transition-transform" />
                </>
              )}
            </Button>
          </div>
        ) : null}
      </div>

      {/* Room Bundles Section */}
      <div className="space-y-8 border-t pt-8">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Room Bundles</h2>
          {!isPremiumStyleSelected && (
            <span className="text-xs text-muted-foreground bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm px-2 py-1 rounded-full">
              Select a premium style to enable bundles
            </span>
          )}
        </div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            <Badge
              variant={bundleFilter === null ? 'default' : 'outline'}
              className={`cursor-pointer backdrop-blur-sm ${!isPremiumStyleSelected ? 'opacity-50 cursor-not-allowed' : ''}`}
              onClick={() => isPremiumStyleSelected && setBundleFilter(null)}
            >
              All Bundles
            </Badge>
            <Badge
              variant={bundleFilter === 'popular' ? 'default' : 'outline'}
              className={`cursor-pointer backdrop-blur-sm ${!isPremiumStyleSelected ? 'opacity-50 cursor-not-allowed' : ''}`}
              onClick={() => isPremiumStyleSelected && setBundleFilter('popular')}
            >
              Popular
            </Badge>
            <Badge
              variant={bundleFilter === 'premium' ? 'default' : 'outline'}
              className={`cursor-pointer bg-gradient-to-r from-purple-600 to-red-600 hover:from-purple-700 hover:to-red-700 text-white backdrop-blur-sm ${!isPremiumStyleSelected ? 'opacity-50 cursor-not-allowed' : ''}`}
              onClick={() => isPremiumStyleSelected && setBundleFilter('premium')}
            >
              <Crown className="h-3 w-3 mr-1" /> Premium
            </Badge>
          </div>
        </div>

        {selectedBundleIds.length > 0 && (
          <div className="flex items-center justify-between mb-4 p-3 bg-white/60 dark:bg-slate-900/60 backdrop-blur-sm rounded-lg border border-white/20 dark:border-slate-800/50">
            <div className="flex items-center gap-2">
              <div className="bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-400 w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium">
                {selectedBundleIds.length}
              </div>
              <span className="text-sm font-medium">
                {selectedBundleIds.length === 1 ? 'Bundle' : 'Bundles'} selected
              </span>
            </div>
            <button
              onClick={() => {
                setSelectedBundleIds([]);
                updateRoomBundles([]);
              }}
              className="text-xs text-muted-foreground hover:text-foreground bg-slate-100/50 dark:bg-slate-800/50 px-2 py-1 rounded-md"
            >
              Clear all
            </button>
          </div>
        )}

        {(bundleFilter === null || bundleFilter === 'premium') && (
          <div className="bg-gradient-to-r from-purple-50/80 to-red-50/80 dark:from-purple-950/30 dark:to-red-950/20 backdrop-blur-sm rounded-lg p-4 mb-6 border border-purple-200/50 dark:border-purple-800/30">
            <div className="flex items-center gap-2 mb-2">
              <Crown className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              <h3 className="font-semibold text-purple-800 dark:text-purple-400">Premium Bundles</h3>
            </div>
            <p className="text-sm text-purple-700 dark:text-purple-300">
              Unlock premium bundles for curated collections of furniture and decor to transform your space.
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-4 gap-4">
          {visibleBundles.map((bundle) => (
            <TooltipProvider key={bundle.id}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className={`${!isPremiumStyleSelected ? 'opacity-50 cursor-not-allowed' : ''}`}>
                    <StylePreviewCard
                      style={bundle}
                      isSelected={selectedBundleIds.includes(bundle.id)}
                      onSelect={() => handleBundleSelect(bundle.id)}
                      disabled={!isPremiumStyleSelected}
                    />
                  </div>
                </TooltipTrigger>
                {!isPremiumStyleSelected && (
                  <TooltipContent>
                    <p>Select a premium style to enable bundle selection</p>
                  </TooltipContent>
                )}
              </Tooltip>
            </TooltipProvider>
          ))}
        </div>

        {hasMoreBundles || showAllBundles ? (
          <div className="flex justify-center mt-6">
            <Button
              variant="outline"
              onClick={() => isPremiumStyleSelected && setShowAllBundles(!showAllBundles)}
              className={`group bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm ${!isPremiumStyleSelected ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={!isPremiumStyleSelected}
            >
              {showAllBundles ? (
                <>
                  Show Less
                  <ChevronUp className="ml-2 h-4 w-4 group-hover:-translate-y-0.5 transition-transform" />
                </>
              ) : (
                <>
                  Show More Bundles
                  <ChevronDown className="ml-2 h-4 w-4 group-hover:translate-y-0.5 transition-transform" />
                </>
              )}
            </Button>
          </div>
        ) : null}
      </div>

      {/* Room Elements for Premium Selection */}
      <AnimatePresence>
        {isPremiumSelected && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
            className="border-t pt-8 mt-8"
          >
            <RoomElements
              styleName={selectedStylesData[0]?.name || selectedBundlesData[0]?.name || ''}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
