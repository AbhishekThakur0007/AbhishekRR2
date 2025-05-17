import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import InteractiveAvatarTextInput from './InteractiveAvatarTextInput';

interface ChatControlsProps {
  chatMode: string;
  onChangeChatMode: (value: string) => Promise<void>;
  text: string;
  setText: (value: string) => void;
  onSubmit: () => Promise<void>;
  isLoadingRepeat: boolean;
  isUserTalking: boolean;
  debug?: string;
}

export function ChatControls({
  chatMode,
  onChangeChatMode,
  text,
  setText,
  onSubmit,
  isLoadingRepeat,
  isUserTalking,
  debug,
}: ChatControlsProps) {
  return (
    <>
      <Tabs
        value={chatMode}
        onValueChange={onChangeChatMode}
        className="w-full"
      >
        <TabsList className="w-full h-8">
          <TabsTrigger value="text_mode" className="flex-1">
            Text
          </TabsTrigger>
          <TabsTrigger value="voice_mode" className="flex-1">
            Voice
          </TabsTrigger>
        </TabsList>
        <TabsContent value="text_mode" className="mt-2">
          <div className="w-full flex relative">
            <InteractiveAvatarTextInput
              disabled={false}
              input={text}
              label="Chat"
              loading={isLoadingRepeat}
              placeholder="Type something to start the conversation"
              setInput={setText}
              onSubmit={onSubmit}
            />
          </div>
        </TabsContent>
        <TabsContent value="voice_mode" className="mt-2">
          <div className="w-full text-center">
            <Button
              disabled={!isUserTalking}
              variant="default"
              className="w-full h-8"
            >
              {isUserTalking ? "Listening" : "Voice chat"}
            </Button>
          </div>
        </TabsContent>
      </Tabs>
      {debug && (
        <p className="text-xs font-mono text-muted-foreground">
          {debug}
        </p>
      )}
    </>
  );
}