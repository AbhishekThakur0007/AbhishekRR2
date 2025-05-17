'use client';

import { useState, useEffect } from 'react';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { RadioGroup, RadioGroupItem } from '@/app/home-ai/components/ui/radio-group';
import { Slider } from '@/components/ui/slider';
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
import { roomTypesV2 } from '@/lib/constants';

interface OptionControlsProps {
  isPremiumSelected?: boolean;
  roomTypes?: any
}

export default function OptionControls( { isPremiumSelected = false,roomTypes, }: OptionControlsProps,) {
  // const [options, setOptions] = useState({
  //   roomType: 'living',
  //   removeFurniture: true,
  //   tvInRoom: false,
  //   lightingMode: 'natural',
  //   curtains: true,
  //   plants: 'few',
  //   colorScheme: 'neutral',
  //   budget: 50,
  // });

  const [isPremiumExpanded, setIsPremiumExpanded] = useState(false);

  // Auto-expand premium section when premium style is selected
  useEffect(() => {
    if (isPremiumSelected) {
      setIsPremiumExpanded(true);
    }
  }, [isPremiumSelected]);

  const handleSwitchChange = (id: string) => {
    // setOptions((prev) => ({
    //   ...prev,
    //   [id]: !prev[id as keyof typeof prev],
    // }));
  };

  const handleSelectChange = (id: string, value: string) => {
     return
  };
 
    const options:any = roomTypes.length ? roomTypes : roomTypesV2;
  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <Label htmlFor="roomType">Room Type</Label>
        <Select
          value={options.roomType}
          onValueChange={(value) => handleSelectChange('roomType', value)}
        >
          <SelectTrigger className="bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm border-slate-200/70 dark:border-slate-800/50">
            <SelectValue placeholder="Select room type" />
          </SelectTrigger>
          <SelectContent className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-md">
            <SelectItem value="living">Living Room</SelectItem>
            <SelectItem value="bedroom">Bedroom</SelectItem>
            <SelectItem value="kitchen">Kitchen</SelectItem>
            <SelectItem value="bathroom">Bathroom</SelectItem>
            <SelectItem value="office">Home Office</SelectItem>
            <SelectItem value="dining">Dining Room</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Colors Section - Always visible */}
      <div className="space-y-4 pt-4 border-t">
        <div className="flex items-center gap-2">
          <Palette className="h-5 w-5 text-purple-600" />
          <h3 className="font-medium">Colors</h3>
        </div>

        <div className="space-y-3">
          <Label>Color Scheme</Label>
          <Select>
            <SelectTrigger className="bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm border-slate-200/70 dark:border-slate-800/50">
              <SelectValue placeholder="Select room type" />
            </SelectTrigger>
            <SelectContent className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-md">
              {options.map((option:any) => (
                <SelectItem key={option.value} value={option.value}>
                  <div className="flex justify-between items-center w-full">
                    <span className="text-base font-bold">{option.label}</span>
                    {/* {option.type === 'premium' && <GrDiamond className="text-lg text-black ml-2" />} */}
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

      {/* Premium Options Section - Only visible when premium style is selected */}
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
                'w-full bg-gradient-to-r from-purple-600 to-red-600 backdrop-blur-md p-3 flex items-center justify-between border-b border-purple-500/30',
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
                  className="bg-purple-50/80 dark:bg-purple-950/30 backdrop-blur-sm p-4"
                >
                  {/* Basics Section */}
                  <div className="mb-6">
                    <h4 className="font-medium text-purple-800 dark:text-purple-400 mb-3">
                      Basic Elements
                    </h4>
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
                          checked={options.removeFurniture}
                          onCheckedChange={() => handleSwitchChange('removeFurniture')}
                        />
                      </motion.div>

                      <motion.div
                        className="flex items-center justify-between p-3 rounded-lg bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm border border-white/20 dark:border-slate-800/50"
                        whileHover={{ y: -2 }}
                        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                      >
                        <Label htmlFor="tvInRoom" className="cursor-pointer">
                          TV in Room
                        </Label>
                        <Switch
                          id="tvInRoom"
                          checked={options.tvInRoom}
                          onCheckedChange={() => handleSwitchChange('tvInRoom')}
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
                          checked={options.curtains}
                          onCheckedChange={() => handleSwitchChange('curtains')}
                        />
                      </motion.div>
                    </div>
                  </div>

                  {/* Lighting Section */}
                  <div className="mb-6">
                    <h4 className="font-medium text-purple-800 dark:text-purple-400 mb-3">
                      Premium Lighting
                    </h4>
                    <div className="space-y-3">
                      <Label>Lighting Mode</Label>
                      <RadioGroup
                        value={options.lightingMode}
                        onValueChange={(value: string) => handleSelectChange('lightingMode', value)}
                        className="flex flex-wrap gap-2"
                      >
                        <motion.div
                          className="flex items-center space-x-2 border border-white/20 dark:border-slate-800/50 rounded-md px-3 py-2 flex-1 min-w-[80px] bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm"
                          whileHover={{ y: -2 }}
                          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                        >
                          <RadioGroupItem value="natural" id="natural" />
                          <Label htmlFor="natural" className="cursor-pointer">
                            Natural
                          </Label>
                        </motion.div>
                        <motion.div
                          className="flex items-center space-x-2 border border-white/20 dark:border-slate-800/50 rounded-md px-3 py-2 flex-1 min-w-[80px] bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm"
                          whileHover={{ y: -2 }}
                          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                        >
                          <RadioGroupItem value="ambient" id="ambient" />
                          <Label htmlFor="ambient" className="cursor-pointer">
                            Ambient
                          </Label>
                        </motion.div>
                        <motion.div
                          className="flex items-center space-x-2 border border-white/20 dark:border-slate-800/50 rounded-md px-3 py-2 flex-1 min-w-[80px] bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm"
                          whileHover={{ y: -2 }}
                          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                        >
                          <RadioGroupItem value="bright" id="bright" />
                          <Label htmlFor="bright" className="cursor-pointer">
                            Bright
                          </Label>
                        </motion.div>
                      </RadioGroup>
                    </div>
                  </div>

                  {/* Size/Plants Section */}
                  <div>
                    <h4 className="font-medium text-purple-800 dark:text-purple-400 mb-3">
                      Premium Accessories
                    </h4>
                    <div className="space-y-3">
                      <div className="space-y-3">
                        <Label>Plants</Label>
                        <RadioGroup
                          value={options.plants}
                          onValueChange={(value: string) => handleSelectChange('plants', value)}
                          className="flex flex-wrap gap-2"
                        >
                          <motion.div
                            className="flex items-center space-x-2 border border-white/20 dark:border-slate-800/50 rounded-md px-3 py-2 flex-1 min-w-[80px] bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm"
                            whileHover={{ y: -2 }}
                            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                          >
                            <RadioGroupItem value="none" id="none" />
                            <Label htmlFor="none" className="cursor-pointer">
                              None
                            </Label>
                          </motion.div>
                          <motion.div
                            className="flex items-center space-x-2 border border-white/20 dark:border-slate-800/50 rounded-md px-3 py-2 flex-1 min-w-[80px] bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm"
                            whileHover={{ y: -2 }}
                            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                          >
                            <RadioGroupItem value="few" id="few" />
                            <Label htmlFor="few" className="cursor-pointer">
                              Few
                            </Label>
                          </motion.div>
                          <motion.div
                            className="flex items-center space-x-2 border border-white/20 dark:border-slate-800/50 rounded-md px-3 py-2 flex-1 min-w-[80px] bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm"
                            whileHover={{ y: -2 }}
                            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                          >
                            <RadioGroupItem value="plenty" id="plenty" />
                            <Label htmlFor="plenty" className="cursor-pointer">
                              Plenty
                            </Label>
                          </motion.div>
                        </RadioGroup>
                      </div>

                      <div className="space-y-3 p-3 rounded-lg bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm border border-white/20 dark:border-slate-800/50 mt-4">
                        <div className="flex justify-between">
                          <Label>Budget Level</Label>
                          <span className="text-sm font-medium">
                            {options.budget < 33
                              ? 'Budget'
                              : options.budget < 66
                                ? 'Mid-range'
                                : 'Luxury'}
                          </span>
                        </div>
                        <Slider
                          value={[options.budget]}
                          min={0}
                          max={100}
                          step={1}
                          onValueChange={(value) =>
                            handleSelectChange('budget', value[0].toString())
                          }
                          className="py-2"
                        />
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>Budget</span>
                          <span>Mid-range</span>
                          <span>Luxury</span>
                        </div>
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
        className="w-full mt-8 bg-gradient-to-r from-purple-600 to-red-600 hover:from-purple-700 to-red-600 text-white border-none"
        size="lg"
        onClick={() => {
          const roomStyleSection = document.getElementById('room-style-section');
          if (roomStyleSection) {
            roomStyleSection.scrollIntoView({ behavior: 'smooth' });
          }
        }}
      >
        Select Styles
      </Button>

      <Button className="w-full mt-4 bg-black hover:bg-black/90 text-white" size="lg">
        Generate Design
      </Button>
    </div>
  );
}
