'use client';

import { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Upload, ArrowRight } from 'lucide-react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { GlassCard } from '@/app/home-ai/components/ui/glass-card';
import { v4 as uuidv4 } from 'uuid';
import { convertToJPEG, editImage } from '@/utils/helper';
import { uploadImageHandler } from '../lib/utils';
import { Console } from 'console';
import { toast } from './ui/use-toast';
// import { convertToJPEG, uploadCollection } from '@/lib/helpers';
// import useLoading from '@/hooks/useLoading';

export default function UploadSection({
  selectedImages,
  setSelectedImages,
  session
}:any) {
  const [activeTab, setActiveTab] = useState<'url' | 'upload'>('url');
  const [selectedExample, setSelectedExample] = useState<string | null>(null);
  const [urlInput, setUrlInput] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  // const { setloading } = useLoading();

  const examples = [
  {
    image: "https://cdn.mediamagic.dev/media/379127f5-127f-11ef-acb2-2e9f5187ccbb.jpeg",
    name: "Home A",
    id: "cc419ac2-c374-4a85-b5bc-7643469fc5a3",
  },
  {
    image: "https://cdn.mediamagic.dev/media/f6e871e8-50d4-11ef-ab92-30d042e69440.jpg",
    name: "Home B",
    id: "38c0e892-0ef8-4b04-893a-05943841c12c",
  },
  {
    image: "https://cdn.mediamagic.dev/media/9e88032e-5584-11ef-95f8-30d042e69440.jpeg",
    name: "Home C",
    id: "12008f87-18cd-4219-9329-970575fec083",
  },
  {
    image: "https://cdn.mediamagic.dev/media/ba87e8c9-5584-11ef-95f8-30d042e69440.jpeg",
    name: "Home D",
    id: "86f015aa-4ed1-410c-9e3a-edf8449531a1",
  },
];

  const handleFileUpload = async (files: FileList) => {
    // setloading(true);
    const multiItems:any = [];
    const filesArray = Array.from(files); 
    for (const file of filesArray) {
      const id = uuidv4();
      const convertedFile = await convertToJPEG(file) as File;
     
       const fileUrl = await uploadImageHandler(convertedFile);
       console.log('===========fileUrl 63',fileUrl.media.url);
      // const data = await uploadCollection(fileUrl);
      // multiItems.push({ img: fileUrl, img_id: data.data.id, id });
    }

    // setSelectedImages((prev:any) => [...prev, ...multiItems]);
    // setloading(false);
  };

  const handleAdd = (item: any) => {
    const id = uuidv4();
    const newImage = { ...item, id };
    setSelectedImages([newImage]); // Replace previous images with new one
    setSelectedExample(item.id); 
    localStorage.setItem('selectedImage', JSON.stringify(selectedImages));
  };

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileUpload(files);
    }
  };

  const handleZillow = async (zillowUrl:any) => {
    // setloading(true);
    alert('ooooooooo')
    const response = await editImage({ tool: "zillow-helper", url: zillowUrl },session);
    console.log('===========response', response)
    // setloading(false);
    // if (response.error || !response.success) {
    //   return toast.error(response.message);
    // } else {
    //   setZillowOptions(response.file);
    //   setZillowUploadModel(true);
    // }
    // setZillowUrl("");
  };

  return (
    <div className="mx-auto max-w-3xl">
      <GlassCard className="overflow-hidden">
        <div className="flex border-b border-white/20 dark:border-slate-800/50">
          <button
            onClick={() => setActiveTab('url')}
            className={cn(
              'flex-1 py-3 text-sm font-medium text-center transition-colors',
              activeTab === 'url'
                ? 'border-b-2 border-black text-black dark:text-white'
                : 'text-muted-foreground hover:text-foreground',
            )}
          >
            Enter URL
          </button>
          <button
            onClick={() => setActiveTab('upload')}
            className={cn(
              'flex-1 py-3 text-sm font-medium text-center transition-colors',
              activeTab === 'upload'
                ? 'border-b-2 border-black text-black dark:text-white'
                : 'text-muted-foreground hover:text-foreground',
            )}
          >
            Upload Image
          </button>
        </div>

        <div className="p-6">
          {activeTab === 'url' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row gap-2">
                <Input
                  placeholder="Enter Zillow URL or any room image URL"
                  className="flex-1 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                />
                <Button onClick={() => handleZillow(urlInput)}className="sm:w-auto w-full group bg-black hover:bg-black/90 text-white">
                  <span>Go</span>
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </div>

              <div className="space-y-3">
                <p className="text-sm text-center text-muted-foreground">Or try with an example</p>
                <div className="grid grid-cols-4 gap-2">
                  {examples.map((example) => (
                    <motion.div
                      key={example.id}
                      className={cn(
                        'relative aspect-square rounded-lg overflow-hidden cursor-pointer transition-all border-2',
                        selectedExample === example.id
                          ? 'border-black ring-2 ring-black/20'
                          : 'border-transparent hover:border-black/50',
                      )}
                      onClick={() => handleAdd(example)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Image
                        src={example.image || '/placeholder.svg'}
                        alt={example.name}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-black/30 backdrop-blur-[1px] flex items-end">
                        <div className="w-full p-1 text-white text-xs font-medium text-center">
                          {example.name}
                        </div>
                      </div>

                      {selectedExample === example.id && (
                        <motion.div
                          className="absolute top-1 right-1 w-4 h-4 bg-black rounded-full flex items-center justify-center"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="10"
                            height="10"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="3"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="text-white"
                          >
                            <polyline points="20 6 9 17 4 12"></polyline>
                          </svg>
                        </motion.div>
                      )}
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'upload' && (
            <div>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                onChange={(e) => e.target.files && handleFileUpload(e.target.files)}
                accept="image/*"
                className="hidden"
              />
              <div
                className={cn(
                  'border-2 border-dashed rounded-lg p-8 text-center transition-all',
                  isDragging ? 'bg-slate-200/50 dark:bg-slate-800/50 border-black' : 'bg-slate-50/50 dark:bg-slate-900/30',
                  'hover:bg-slate-100/50 dark:hover:bg-slate-900/40'
                )}
                onDragEnter={handleDragEnter}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <div className="mx-auto w-12 h-12 rounded-full bg-black/10 dark:bg-black/20 backdrop-blur-sm flex items-center justify-center mb-4">
                  <Upload className="w-6 h-6 text-black dark:text-white" />
                </div>
                <h3 className="text-lg font-medium Preserve your original phrasing and tone as much as possible. Do not add or remove significant details unless explicitly requested by the user.mb-2">Upload your room photo</h3>
                <p className="text-sm text-muted-foreground mb-4">Drag and drop or click to browse</p>
                <Button
                  variant="outline"
                  className="bg-white/80 dark:bg-slate-950/80 backdrop-blur-sm"
                  onClick={() => fileInputRef.current?.click()}
                >
                  Choose File
                </Button>
              </div>
              {selectedImages?.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-lg font-medium mb-4">Selected Images</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {selectedImages.map((item:any) => (
                      <div key={item.id} className="relative aspect-square rounded-lg overflow-hidden">
                        <Image
                          src={item.img}
                          alt="Uploaded image"
                          fill
                          className="object-cover"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </GlassCard>
    </div>
  );
}
