import { useState, useRef, useEffect } from 'react';
import type { StartAvatarResponse } from '@heygen/streaming-avatar';
import StreamingAvatar, {
  AvatarQuality,
  StreamingEvents,
  TaskMode,
  TaskType,
  VoiceEmotion,
} from '@heygen/streaming-avatar';

interface UseAvatarSessionProps {
  avatarId: string;
  knowledgeId?: string;
  language?: string;
}

interface UseAvatarSessionReturn {
  stream: MediaStream | undefined;
  data: StartAvatarResponse | undefined;
  isLoadingSession: boolean;
  isLoadingRepeat: boolean;
  isUserTalking: boolean;
  debug: string | undefined;
  startSession: () => Promise<void>;
  endSession: () => Promise<void>;
  handleSpeak: (textToSpeak: string) => Promise<void>;
  handleInterrupt: () => Promise<void>;
  startVoiceChat: () => Promise<void>;
  closeVoiceChat: () => void;
  startListening: () => void;
  stopListening: () => void;
}

export function useAvatarSession({
  avatarId,
  knowledgeId = '',
  language = 'en',
}: UseAvatarSessionProps): UseAvatarSessionReturn {
  const [isLoadingSession, setIsLoadingSession] = useState(false);
  const [isLoadingRepeat, setIsLoadingRepeat] = useState(false);
  const [stream, setStream] = useState<MediaStream>();
  const [debug, setDebug] = useState<string>();
  const [data, setData] = useState<StartAvatarResponse>();
  const [isUserTalking, setIsUserTalking] = useState(false);
  const avatar = useRef<StreamingAvatar | null>(null);

  function baseApiUrl() {
    return process.env.NEXT_PUBLIC_BASE_API_URL;
  }

  async function fetchAccessToken() {
    try {
      const response = await fetch('/api/get-access-token', {
        method: 'POST',
      });
      const token = await response.text();
      return token;
    } catch (error) {
      console.error('Error fetching access token:', error);
    }
    return '';
  }

  async function startSession() {
    if (isLoadingSession) return;

    setIsLoadingSession(true);
    const newToken = await fetchAccessToken();

    avatar.current = new StreamingAvatar({
      token: newToken,
      basePath: baseApiUrl(),
    });
    
    // Set up event listeners
    setupEventListeners();
    
    try {
      const res = await avatar.current.createStartAvatar({
        quality: AvatarQuality.Low,
        avatarName: avatarId,
        knowledgeId: knowledgeId,
        voice: {
          rate: 1.5,
          emotion: VoiceEmotion.EXCITED,
        },
        language: language,
        disableIdleTimeout: true,
      });

      setData(res);
      await avatar.current?.startVoiceChat({
        useSilencePrompt: false,
      });
    } catch (error) {
      console.error('Error starting avatar session:', error);
    } finally {
      setIsLoadingSession(false);
    }
  }

  function setupEventListeners() {
    if (!avatar.current) return;
    
    avatar.current.on(StreamingEvents.AVATAR_START_TALKING, (e) => {
      console.log('Avatar started talking', e);
    });
    
    avatar.current.on(StreamingEvents.AVATAR_STOP_TALKING, (e) => {
      console.log('Avatar stopped talking', e);
    });
    
    avatar.current.on(StreamingEvents.STREAM_DISCONNECTED, () => {
      console.log('Stream disconnected');
      endSession();
    });
    
    avatar.current.on(StreamingEvents.STREAM_READY, (event) => {
      console.log('>>>>> Stream ready:', event.detail);
      setStream(event.detail);
    });
    
    avatar.current.on(StreamingEvents.USER_START, (event) => {
      console.log('>>>>> User started talking:', event);
      setIsUserTalking(true);
    });
    
    avatar.current.on(StreamingEvents.USER_STOP, (event) => {
      console.log('>>>>> User stopped talking:', event);
      setIsUserTalking(false);
    });
  }

  async function handleSpeak(textToSpeak: string) {
    setIsLoadingRepeat(true);
    if (!avatar.current) {
      setDebug('Avatar API not initialized');
      return;
    }
    
    await avatar.current
      .speak({
        text: textToSpeak,
        taskType: TaskType.REPEAT,
        taskMode: TaskMode.SYNC,
      })
      .catch((e) => {
        setDebug(e.message);
      });
      
    setIsLoadingRepeat(false);
  }

  async function handleInterrupt() {
    if (!avatar.current) {
      setDebug('Avatar API not initialized');
      return;
    }
    
    await avatar.current.interrupt().catch((e) => {
      setDebug(e.message);
    });
  }

  async function endSession() {
    await avatar.current?.stopAvatar();
    setStream(undefined);
  }

  async function startVoiceChat() {
    await avatar.current?.startVoiceChat();
  }

  function closeVoiceChat() {
    avatar.current?.closeVoiceChat();
  }

  function startListening() {
    avatar.current?.startListening();
  }

  function stopListening() {
    avatar.current?.stopListening();
  }

  // Clean up on unmount
  useEffect(() => {
    return () => {
      endSession();
    };
  }, []);

  return {
    stream,
    data,
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
  };
}