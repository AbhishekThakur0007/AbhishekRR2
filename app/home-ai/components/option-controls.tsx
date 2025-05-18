'use client';

import { useState, useEffect } from 'react';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { RadioGroup, RadioGroupItem } from '@/app/home-ai/components/ui/radio-group';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { motion, AnimatePresence } from 'framer-motion';
import { Palette, Crown, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { roomTypesV2, roomstyles } from '@/lib/constants';
import { fetchVstagePremiumData } from '@/utils/helper';

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
  tableTops?: 'Clear' | 'Decorative';
  removeFurniture?: 'Yes' | 'No';
  tvInLivingRoom?: 'Yes' | 'No';
  tvInBedRoom?: 'Yes' | 'No';
  lampLightsMode?: 'Yes' | 'No';
  curtains?: 'Yes' | 'No';
  plants?: 'None' | 'Few' | 'Plenty';
}

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

interface OptionControlsProps {
  isPremiumSelected?: boolean;
  roomTypes?: RoomStyle[];
  updateSelectedImage: (id: string, data: Partial<ImageItem>) => void;
  selectedImages: ImageItem[];
  roomStyles: RoomStyle[];
  setRoomStyles: (styles: RoomStyle[]) => void;
  roomBundles: RoomBundle[];
  setRoomBundles: (bundles: RoomBundle[]) => void;
}

export default function OptionControls({
  isPremiumSelected = false,
  roomTypes,
  updateSelectedImage,
  selectedImages,
  roomStyles,
  setRoomStyles,
  roomBundles,
  setRoomBundles,
}: OptionControlsProps) {
  const [isPremiumFlow, setIsPremiumFlow] = useState(false);
  const [isPremiumExpanded, setIsPremiumExpanded] = useState(false);
  const [selectedRoomType, setSelectedRoomType] = useState<string>(
    selectedImages?.length > 0 ? selectedImages[0]?.roomType?.Id || '' : '',
  );
  const [selectionModel, setSelectionModel] = useState(false);

  const fetchRoomData = async (roomArgs: string, setFunction: (data: any[]) => void, roomTypeID = '') => {
    const data = await fetchVstagePremiumData(roomArgs, roomTypeID);
    if (data.length) {
      const roomData = data.map((item: any) => {
        const regularStyles = roomstyles.filter((item2: any) => item2.label.trim() === item.Name.trim());
        return {
          label: item.Name.trim(),
          Id: item.ID || item.Id,
          ...(item.ThumbnailURL && { img: item.ThumbnailURL }),
          ...(roomArgs === 'room-styles' && regularStyles.length > 0
            ? { type: 'both', value: regularStyles[0].value }
            : { type: 'premium', value: item.Name.trim() }),
        };
      });
      setFunction(roomData);
    }
  };

  const handleRoomTypeChange = (value: string) => {
    setSelectedRoomType(value);
  };

  const handleApplyRoomType = async () => {
    if (!selectedRoomType || selectedImages.length === 0) return;

    const options: any = roomTypes?.length ? roomTypes : roomTypesV2;
    const selectedOption = options.find((option: any) => option.value === selectedRoomType);

    if (!selectedOption) return;

    const isPremium = selectedOption.type === 'premium';
    setIsPremiumFlow(isPremium);

    updateSelectedImage(selectedImages[0].id, {
      roomType: {
        Id: selectedOption.value,
        value:
          selectedOption.type === 'premium'
            ? selectedOption.label
            : roomTypesV2.find((item) => item.label === selectedOption.label)?.value ||
              selectedOption.value,
        type: selectedOption.type || 'regular',
      },
      roomStyle: [],
      roomBundle: [],
    });

    await Promise.all([
      fetchRoomData('room-styles', setRoomStyles, selectedOption.value),
      fetchRoomData('room-bundles', setRoomBundles, selectedOption.value),
    ]);

    const roomStyleSection = document.getElementById('room-style-section');
    if (roomStyleSection) {
      roomStyleSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handlePremiumOptionChange = (key: string, value: string) => {
    if (!isPremiumSelected || selectedImages.length === 0) return;
    updateSelectedImage(selectedImages[0].id, {
      [key]: value,
    });
  };

  const handleGenerate = () => {
    if (isPremiumExpanded) {
      // finalActionHandler(true, selectedImages[0]);
    } else {
      if (selectedImages.length > 0 && selectedImages[0].roomStyle?.length && selectedImages[0].roomStyle[0].Id) {
        setSelectionModel(true);
      } else {
        // finalActionHandler(false, selectedImages[0]);
      }
    }
  };

  const options: any = roomTypes?.length ? roomTypes : roomTypesV2;

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <Label htmlFor="roomType">Room Type</Label>
        <Select onValueChange={handleRoomTypeChange} value={selectedRoomType}>
          <SelectTrigger className="bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm border-slate-200/70 dark:border-slate-800/50">
            <SelectValue placeholder="Select room type" />
          </SelectTrigger>
          <SelectContent className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-md">
            {options.map((option: any) => (
              <SelectItem key={option.value} value={option.value}>
                <div className="flex justify-between items-center w-full">
                  <span className="text-base font-bold">{option.label}</span>
                  {option.type === 'premium' && (
                    <Crown className="h-4 w-4 text-purple-600 ml-2" />
                  )}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Colors Section */}
      <div className="space-y-4 pt-4 border-t">
        <div className="flex items-center gap-2">
          <Palette className="h-5 w-5 text-purple-600" />
          <h3 className="font-medium">Colors</h3>
        </div>
        <div className="space-y-3">
          <Label>Color Scheme</Label>
          <Select>
            <SelectTrigger className="bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm border-slate-200/70 dark:border-slate-800/50">
              <SelectValue placeholder="Select color scheme" />
            </SelectTrigger>
            <SelectContent className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-md">
              {options.map((option: any) => (
                <SelectItem key={option.value} value={option.value}>
                  <div className="flex justify-between items-center w-full">
                    <span className="text-base font-bold">{option.label}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="grid grid-cols-5 gap-2 mt-4">
            {['#F9FAFB', '#E5E7EB', '#D1D5DB', '#9CA3AF', '#6B7280'].map((color) => (
              <div
                key={color}
                className="w-full aspect-square rounded-full border cursor-pointer hover:scale-110 transition-transform shadow-sm"
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Premium Options Section */}
      {isPremiumSelected && (
        <div className="mt-6">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="rounded-xl overflow-hidden border border-purple-300/50 dark:border-purple-800/30"
          >
            <button
              onClick={() => setIsPremiumExpanded(!isPremiumExpanded)}
              className={cn(
                'w-full bg-gradient-to-r from-purple-600 to-red-600 backdrop-blur-md p-3 hedge flex items-center justify-between border-b border-purple-500/30',
                !isPremiumExpanded && 'border-b-0',
              )}
            >
              <div className="flex items-center">
                <Crown className="h-5 w-5 text-white mr-2" />
                <h3 className="font-semibold text-white">Premium Options</h3>
              </div>
              {isPremiumExpanded ? (
                <ChevronUp className="h-5 w-5 text-white" />
              ) : (
                <ChevronDown className="h-5 w-5 text-white" />
              )}
            </button>

            <AnimatePresence>
              {isPremiumExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="bg-purple-50/80 dark:bg-purple-950/30 backdrop-blur-sm p-4 space-y-6"
                >
                  {/* Basic Elements */}
                  <div>
                    <h4 className="font-medium text-purple-800 dark:text-purple-400 mb-3">Basic Elements</h4>
                    <div className="space-y-3">
                      <motion.div
                        className="flex items-center justify-between p-3 rounded-lg bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm border border-white/20 dark:border-slate-800/50"
                        whileHover={{ y: -2 }}
                        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                      >
                        <Label htmlFor="removeFurniture" className="cursor-pointer">
                          Remove Furniture
                        </Label>
                        <Switch
                          id="removeFurniture"
                          checked={selectedImages[0]?.removeFurniture === 'Yes'}
                          onCheckedChange={(checked) =>
                            handlePremiumOptionChange('removeFurniture', checked ? 'Yes' : 'No')
                          }
                          disabled={!isPremiumSelected}
                        />
                      </motion.div>
                      <motion.div
                        className="flex items-center justify-between p-3 rounded-lg bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm border border-white/20 dark:border-slate-800/50"
                        whileHover={{ y: -2 }}
                        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                      >
                        <Label htmlFor="tvInLivingRoom" className="cursor-pointer">
                          TV in Living Room
                        </Label>
                        <Switch
                          id="tvInLivingRoom"
                          checked={selectedImages[0]?.tvInLivingRoom === 'Yes'}
                          onCheckedChange={(checked) =>
                            handlePremiumOptionChange('tvInLivingRoom', checked ? 'Yes' : 'No')
                          }
                          disabled={!isPremiumSelected}
                        />
                      </motion.div>
                      <motion.div
                        className="flex items-center justify-between p-3 rounded-lg bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm border border-white/20 dark:border-slate-800/50"
                        whileHover={{ y: -2 }}
                        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                      >
                        <Label htmlFor="tvInBedRoom" className="cursor-pointer">
                          TV in Bedroom
                        </Label>
                        <Switch
                          id="tvInBedRoom"
                          checked={selectedImages[0]?.tvInBedRoom === 'Yes'}
                          onCheckedChange={(checked) =>
                            handlePremiumOptionChange('tvInBedRoom', checked ? 'Yes' : 'No')
                          }
                          disabled={!isPremiumSelected}
                        />
                      </motion.div>
                      <motion.div
                        className="flex items-center justify-between p-3 rounded-lg bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm border border-white/20 dark:border-slate-800/50"
                        whileHover={{ y: -2 }}
                        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                      >
                        <Label htmlFor="lampLightsMode" className="cursor-pointer">
                          Lamp Lights Mode
                        </Label>
                        <Switch
                          id="lampLightsMode"
                          checked={selectedImages[0]?.lampLightsMode === 'Yes'}
                          onCheckedChange={(checked) =>
                            handlePremiumOptionChange('lampLightsMode', checked ? 'Yes' : 'No')
                          }
                          disabled={!isPremiumSelected}
                        />
                      </motion.div>
                      <motion.div
                        className="flex items-center justify-between p-3 rounded-lg bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm border border-white/20 dark:border-slate-800/50"
                        whileHover={{ y: -2 }}
                        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                      >
                        <Label htmlFor="curtains" className="cursor-pointer">
                          Curtains
                        </Label>
                        <Switch
                          id="curtains"
                          checked={selectedImages[0]?.curtains === 'Yes'}
                          onCheckedChange={(checked) =>
                            handlePremiumOptionChange('curtains', checked ? 'Yes' : 'No')
                          }
                          disabled={!isPremiumSelected}
                        />
                      </motion.div>
                    </div>
                  </div>

                  {/* Accessories */}
                  <div>
                    <h4 className="font-medium text-purple-800 dark:text-purple-400 mb-3">Accessories</h4>
                    <div className="space-y-3">
                      <div className="space-y-3">
                        <Label>Table Tops</Label>
                        <RadioGroup
                          value={selectedImages[0]?.tableTops || 'Decorative'}
                          onValueChange={(value) => handlePremiumOptionChange('tableTops', value)}
                          className="flex flex-wrap gap-2"
                          disabled={!isPremiumSelected}
                        >
                          {['Clear', 'Decorative'].map((option) => (
                            <motion.div
                              key={option}
                              className="flex items-center space-x-2 border border-white/20 dark:border-slate-800/50 rounded-md px-3 py-2 flex-1 min-w-[80px] bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm"
                              whileHover={{ y: -2 }}
                              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                            >
                              <RadioGroupItem value={option} id={option.toLowerCase()} />
                              <Label htmlFor={option.toLowerCase()} className="cursor-pointer">
                                {option}
                              </Label>
                            </motion.div>
                          ))}
                        </RadioGroup>
                      </div>
                      <div className="space-y-3">
                        <Label>Plants</Label>
                        <RadioGroup
                          value={selectedImages[0]?.plants || 'Few'}
                          onValueChange={(value) => handlePremiumOptionChange('plants', value)}
                          className="flex flex-wrap gap-2"
                          disabled={!isPremiumSelected}
                        >
                          {['None', 'Few', 'Plenty'].map((option) => (
                            <motion.div
                              key={option}
                              className="flex items-center space-x-2 border border-white/20 dark:border-slate-800/50 rounded-md px-3 py-2 flex-1 min-w-[80px] bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm"
                              whileHover={{ y: -2 }}
                              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                            >
                              <RadioGroupItem value={option} id={option.toLowerCase()} />
                              <Label htmlFor={option.toLowerCase()} className="cursor-pointer">
                                {option}
                              </Label>
                            </motion.div>
                          ))}
                        </RadioGroup>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      )}

      <Button
        className="w-full mt-8 bg-gradient-to-r from-purple-600 to-red-600 hover:from-purple-700 hover:to-red-700 text-white border-none"
        size="lg"
        onClick={handleApplyRoomType}
      >
        Select Styles
      </Button>

      <Button
        onClick={handleGenerate}
        className="w-full mt-4 bg-black hover:bg-black/90 text-white"
        size="lg"
      >
        Generate Design
      </Button>
    </div>
  );
}
