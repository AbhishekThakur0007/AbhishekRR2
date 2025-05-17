"use client";

import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { useMemoizedFn, usePrevious } from "ahooks";
import { useAvatarSession } from "./hooks/useAvatarSession";
import { AvatarVideo } from "./AvatarVideo";
import { ChatControls } from "./ChatControls";
import { AVATARS } from "@/lib/constants";

export function AIChat() {
  const [isMinimized, setIsMinimized] = useState(true);
  const [avatarId] = useState<string>("Ann_Therapist_public");
  const [text, setText] = useState<string>("");
  const [chatMode, setChatMode] = useState("text_mode");
  const [hasGreeted, setHasGreeted] = useState(false);

  // Use the custom hook for avatar session management
  const {
    stream,
    isLoadingSession,
    isLoadingRepeat,
    isUserTalking,
    debug,
    startSession,
    endSession,
    handleSpeak,
    handleInterrupt,
    startVoiceChat,
    closeVoiceChat,
    startListening,
    stopListening,
  } = useAvatarSession({
    avatarId,
    language: "en",
  });

  const handleChangeChatMode = useMemoizedFn(async (v) => {
    if (v === chatMode) {
      return;
    }
    if (v === "text_mode") {
      closeVoiceChat();
    } else {
      await startVoiceChat();
    }
    setChatMode(v);
  });

  // Handle text input changes for listening
  const previousText = usePrevious(text);
  useEffect(() => {
    if (!previousText && text) {
      startListening();
    } else if (previousText && !text) {
      stopListening();
    }
  }, [text, previousText, startListening, stopListening]);

  // Auto-start session when sidebar is opened
  useEffect(() => {
    if (!isMinimized && !stream && !isLoadingSession && text) {
      startSession();
    }
  }, [isMinimized, stream, isLoadingSession, text, startSession]);

  // Handle stream when minimizing/maximizing
  useEffect(() => {
    if (isMinimized && stream) {
      endSession();
    }
  }, [isMinimized, stream, endSession]);

  // Greet user when session starts
  useEffect(() => {
    if (stream && !hasGreeted) {
      const greeting =
        "Hello! I'm your real estate assistant. I can help you find your dream home, answer questions about properties, and guide you through the buying process. How can I assist you today?";
      handleSpeak(greeting);
      setHasGreeted(true);
    }
  }, [stream, hasGreeted, handleSpeak]);

  // Reset greeting state when session ends
  useEffect(() => {
    if (!stream) {
      setHasGreeted(false);
    }
  }, [stream]);

  return (
    <div
      className={`fixed right-0 top-20 bottom-24 w-80 bg-background border-l shadow-lg transition-transform duration-300 ${
        isMinimized ? "translate-x-[calc(100%-40px)]" : ""
      }`}
    >
      {/* Minimize/Maximize Button */}
      <button
        onClick={() => setIsMinimized(!isMinimized)}
        className="absolute left-0 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-background border rounded-full p-2 shadow-md hover:bg-accent"
      >
        {isMinimized ? (
          <ChevronLeft className="h-4 w-4" />
        ) : (
          <ChevronRight className="h-4 w-4" />
        )}
      </button>

      {!isMinimized && (
        <div className="h-full w-full p-2">
          <Card className="h-full">
            <CardContent className="h-[calc(100%-120px)] flex flex-col justify-center items-center p-2">
              {stream ? (
                <AvatarVideo 
                  stream={stream} 
                  onInterrupt={handleInterrupt} 
                  onEnd={endSession} 
                />
              ) : (
                <div className="text-center text-muted-foreground text-sm">
                  Type something to start the conversation
                </div>
              )}
            </CardContent>
            <CardFooter className="h-[120px] flex flex-col gap-2 p-2">
              <ChatControls
                chatMode={chatMode}
                onChangeChatMode={handleChangeChatMode}
                text={text}
                setText={setText}
                onSubmit={() => handleSpeak(text)}
                isLoadingRepeat={isLoadingRepeat}
                isUserTalking={isUserTalking}
                debug={debug}
              />
            </CardFooter>
          </Card>
        </div>
      )}
    </div>
  );
}
