"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Avatar {
  avatar_id: string;
  avatar_name: string;
  gender: string;
  preview_image_url: string;
  preview_video_url: string;
  premium: boolean;
}

interface Voice {
  voice_id: string;
  name: string;
  language: string;
  gender: string;
  preview_audio: string;
}

interface HeygenAvatarResponse {
  avatars: Avatar[];
  error?: string;
}

interface HeygenVoiceResponse {
  voices: Voice[];
  error?: string;
}

interface HeygenVideoResponse {
  videoUrl?: string;
  error?: string;
  details?: unknown;
}

export default function TestAvatarsPage() {
  const [avatars, setAvatars] = useState<Avatar[]>([]);
  const [voices, setVoices] = useState<Voice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedAvatar, setSelectedAvatar] = useState<string | null>(null);
  const [selectedVoice, setSelectedVoice] = useState<string | null>("en-US-1");
  const [generatingVideo, setGeneratingVideo] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([fetchAvatars(), fetchVoices()]);
  }, []);

  const fetchAvatars = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch("/api/heygen");
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `Failed to fetch avatars: ${response.status} ${errorText}`
        );
      }

      const data = (await response.json()) as HeygenAvatarResponse;
      if (data.avatars && Array.isArray(data.avatars)) {
        setAvatars(data.avatars);
        // Auto-select the first non-premium avatar
        const nonPremiumAvatar = data.avatars.find(
          (avatar: Avatar) => !avatar.premium
        );
        if (nonPremiumAvatar) {
          setSelectedAvatar(nonPremiumAvatar.avatar_id);
        }
      } else {
        setAvatars([]);
        setError("No avatars found in response");
      }
    } catch (err) {
      console.error("Error fetching avatars:", err);
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  };

  const fetchVoices = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch("/api/heygen/voices");
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `Failed to fetch voices: ${response.status} ${errorText}`
        );
      }

      const data = (await response.json()) as HeygenVoiceResponse;
      if (data.voices && Array.isArray(data.voices)) {
        setVoices(data.voices);
        // Auto-select the first English voice
        const englishVoice = data.voices.find(
          (voice: Voice) =>
            voice.language.toLowerCase().includes("en") ||
            voice.name.toLowerCase().includes("english")
        );

        if (englishVoice) {
          setSelectedVoice(englishVoice.voice_id);
        } else if (data.voices.length > 0) {
          setSelectedVoice(data.voices[0].voice_id);
        }
      } else {
        setVoices([]);
        console.warn("No voices found in response");
      }
    } catch (err) {
      console.error("Error fetching voices:", err);
    }
  };

  const generateVideo = async () => {
    if (!selectedAvatar) {
      setError("Please select an avatar first");
      return;
    }

    if (!selectedVoice) {
      setError("Please select a voice first");
      return;
    }

    try {
      setGeneratingVideo(true);
      setVideoUrl(null);
      setError(null);

      const response = await fetch("/api/heygen", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: "Hello! I am a real estate assistant. I can help you find your dream home today!",
          avatarId: selectedAvatar,
          voiceId: selectedVoice,
        }),
      });

      const data = (await response.json()) as HeygenVideoResponse;

      if (data.error) {
        throw new Error(
          `API Error: ${data.error}${
            data.details ? " - " + JSON.stringify(data.details) : ""
          }`
        );
      }

      if (data.videoUrl) {
        setVideoUrl(data.videoUrl);
      } else {
        throw new Error("No video URL received");
      }
    } catch (err) {
      console.error("Error generating video:", err);
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setGeneratingVideo(false);
    }
  };

  const playPreviewAudio = (previewUrl: string) => {
    const audio = new Audio(previewUrl);
    audio.play();
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Heygen API Test</h1>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <Button onClick={fetchAvatars} disabled={loading} className="mb-6">
          {loading ? "Loading Avatars..." : "Refresh Avatars"}
        </Button>

        <Button onClick={fetchVoices} disabled={loading} className="mb-6">
          Refresh Voices
        </Button>
      </div>

      <Tabs defaultValue="config">
        <TabsList className="mb-4">
          <TabsTrigger value="config">Configuration</TabsTrigger>
          <TabsTrigger value="avatars">Avatars ({avatars.length})</TabsTrigger>
          <TabsTrigger value="voices">Voices ({voices.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="config" className="mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Generate Test Video</CardTitle>
              <CardDescription>
                Select an avatar and voice to generate a test video
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Avatar
                  </label>
                  <Select
                    value={selectedAvatar || ""}
                    onValueChange={setSelectedAvatar}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select an avatar" />
                    </SelectTrigger>
                    <SelectContent>
                      {avatars.map((avatar) => (
                        <SelectItem
                          key={avatar.avatar_id}
                          value={avatar.avatar_id}
                        >
                          {avatar.avatar_name}{" "}
                          {avatar.premium ? "(Premium)" : ""}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Voice
                  </label>
                  <Select
                    value={selectedVoice || ""}
                    onValueChange={setSelectedVoice}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a voice" />
                    </SelectTrigger>
                    <SelectContent>
                      {voices.map((voice) => (
                        <SelectItem key={voice.voice_id} value={voice.voice_id}>
                          {voice.name} ({voice.language})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button
                onClick={generateVideo}
                disabled={generatingVideo || !selectedAvatar || !selectedVoice}
                className="w-full"
              >
                {generatingVideo ? "Generating..." : "Generate Test Video"}
              </Button>
            </CardContent>
            <CardFooter>
              {videoUrl && (
                <div className="mt-4 w-full">
                  <h3 className="text-lg font-medium mb-2">Generated Video:</h3>
                  <video
                    src={videoUrl}
                    controls
                    autoPlay
                    className="w-full rounded-lg border"
                  />
                </div>
              )}
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="avatars">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {avatars.map((avatar) => (
              <Card
                key={avatar.avatar_id}
                className={`overflow-hidden cursor-pointer transition-all ${
                  selectedAvatar === avatar.avatar_id
                    ? "ring-2 ring-blue-500"
                    : ""
                }`}
                onClick={() => setSelectedAvatar(avatar.avatar_id)}
              >
                <CardHeader className="p-4">
                  <CardTitle className="text-lg">
                    {avatar.avatar_name}
                  </CardTitle>
                  <CardDescription>
                    ID: {avatar.avatar_id}
                    {avatar.premium && (
                      <span className="ml-2 text-amber-500">(Premium)</span>
                    )}
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  {avatar.preview_image_url && (
                    <img
                      src={avatar.preview_image_url}
                      alt={avatar.avatar_name}
                      className="w-full h-48 object-cover"
                    />
                  )}
                </CardContent>
                <CardFooter className="flex justify-between p-4">
                  <div className="text-sm">
                    Gender: {avatar.gender || "Unknown"}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedAvatar(avatar.avatar_id);
                      generateVideo();
                    }}
                    disabled={generatingVideo}
                  >
                    Test
                  </Button>
                </CardFooter>
              </Card>
            ))}

            {!loading && avatars.length === 0 && !error && (
              <div className="col-span-full text-center py-8 text-gray-500">
                No avatars found. Make sure your Heygen API key is configured
                correctly.
              </div>
            )}

            {loading && (
              <div className="col-span-full text-center py-8 text-gray-500">
                Loading avatars...
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="voices">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {voices.map((voice) => (
              <Card
                key={voice.voice_id}
                className={`overflow-hidden transition-all ${
                  selectedVoice === voice.voice_id ? "ring-2 ring-blue-500" : ""
                }`}
                onClick={() => setSelectedVoice(voice.voice_id)}
              >
                <CardHeader className="p-4">
                  <CardTitle className="text-lg">{voice.name}</CardTitle>
                  <CardDescription>Language: {voice.language}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-sm mb-2">ID: {voice.voice_id}</div>
                  <div className="text-sm">
                    Gender: {voice.gender || "Unknown"}
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between p-4">
                  {voice.preview_audio && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        playPreviewAudio(voice.preview_audio);
                      }}
                    >
                      Play Sample
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedVoice(voice.voice_id);
                      generateVideo();
                    }}
                    disabled={generatingVideo}
                  >
                    Test
                  </Button>
                </CardFooter>
              </Card>
            ))}

            {voices.length === 0 && (
              <div className="col-span-full text-center py-8 text-gray-500">
                No voices found. Make sure your Heygen API key is configured
                correctly.
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
