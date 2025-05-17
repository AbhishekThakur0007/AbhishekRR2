import React, { useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';

interface AvatarVideoProps {
  stream: MediaStream | undefined;
  onInterrupt: () => Promise<void>;
  onEnd: () => Promise<void>;
}

export function AvatarVideo({ stream, onInterrupt, onEnd }: AvatarVideoProps) {
  const mediaStream = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (stream && mediaStream.current) {
      mediaStream.current.srcObject = stream;
      mediaStream.current.onloadedmetadata = () => {
        mediaStream.current!.play();
      };
    }
  }, [mediaStream, stream]);

  return (
    <div className="h-full w-full justify-center items-center flex rounded-lg overflow-hidden bg-muted">
      <video
        ref={mediaStream}
        autoPlay
        playsInline
        className="w-full h-full object-contain"
      >
        <track kind="captions" />
      </video>
      <div className="flex flex-col gap-1 absolute bottom-2 right-2">
        <Button
          variant="secondary"
          size="sm"
          onClick={onInterrupt}
          className="bg-background/80 backdrop-blur-sm"
        >
          Interrupt
        </Button>
        <Button
          variant="secondary"
          size="sm"
          onClick={onEnd}
          className="bg-background/80 backdrop-blur-sm"
        >
          End
        </Button>
      </div>
    </div>
  );
}