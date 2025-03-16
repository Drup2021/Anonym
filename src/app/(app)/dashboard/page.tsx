"use client";
import React, { useCallback, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/components/ui/use-toast';
import { Loader2, RefreshCcw } from 'lucide-react';
import axios, { AxiosError } from 'axios';
import { useSession } from 'next-auth/react';
import { Message } from '@/model/User';
import { ApiResponse } from '@/types/ApiResponse';
import { AcceptMessageSchema } from '@/schemas/acceptMessageSchema';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { MessageCard } from '@/components/MessageCard';
import { Separator } from '@/components/ui/separator';
import { z } from 'zod';

// Extend the schema to include safe mode
const UserSettingsSchema = AcceptMessageSchema.extend({
  safeMode: z.boolean(),
});

function UserDashboard() {
  const { toast } = useToast();
  const { data: session } = useSession();
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSwitchLoading, setIsSwitchLoading] = useState(false);

  const form = useForm<z.infer<typeof UserSettingsSchema>>({
    resolver: zodResolver(UserSettingsSchema),
    defaultValues: {
      isAcceptingMessages: false,
      safeMode: false,
    },
  });

  const { watch, setValue } = form;
  const isAcceptingMessages = watch('isAcceptingMessages');
  const safeMode = watch('safeMode');

  const fetchUserSettings = useCallback(async () => {
    setIsSwitchLoading(true);
    try {
      const [acceptRes, safeModeRes] = await Promise.all([
        axios.get<ApiResponse>('/api/accept-messages'),
        axios.get<ApiResponse>('/api/safe-mode'),
      ]);
      //@ts-ignore
      setValue('isAcceptingMessages', acceptRes.data.isAcceptingMessages);
      setValue('safeMode', safeModeRes.data.safeMode || false);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: 'Error',
        description:
          axiosError.response?.data.message ?? 'Failed to fetch settings',
        variant: 'destructive',
      });
    } finally {
      setIsSwitchLoading(false);
    }
  }, [setValue, toast]);

  const fetchMessages = useCallback(async (refresh: boolean = false) => {
    setIsLoading(true);
    try {
      const response = await axios.get<ApiResponse>('/api/get-messages');
      setMessages(response.data.messages || []);
      if (refresh) {
        toast({
          title: 'Refreshed Messages',
          description: 'Showing latest messages',
        });
      }
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: 'Error',
        description:
          axiosError.response?.data.message ?? 'Failed to fetch messages',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  const handleSwitchChange = async (type: 'isAcceptingMessages' | 'safeMode') => {
    try {
      const value = !form.getValues(type);
      const endpoint = type === 'isAcceptingMessages'
        ? '/api/accept-messages'
        : '/api/safe-mode';

      const response = await axios.post<ApiResponse>(endpoint, {
        [type === 'isAcceptingMessages' ? 'acceptMessages' : 'safeMode']: value,
      });

      setValue(type, value);
      toast({
        title: response.data.message,
        variant: 'default',
      });
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: 'Error',
        description:
          axiosError.response?.data.message ?? 'Failed to update setting',
        variant: 'destructive',
      });
    }
  };

  const handleDeleteMessage = (messageId: string) => {
    setMessages(messages.filter((message) => message._id !== messageId));
  };

  useEffect(() => {
    if (!session?.user) return;
    fetchMessages();
    fetchUserSettings();
  }, [session, fetchMessages, fetchUserSettings]);

  if (!session?.user) {
    return <div className="flex justify-center p-8">Loading user session...</div>;
  }

  const { username } = session.user;
  const profileUrl = `${window.location.origin}/u/${username}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(profileUrl);
    toast({
      title: 'URL Copied!',
      description: 'Profile URL has been copied to clipboard',
    });
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen p-4 gap-4">
      {/* Settings Panel */}
      <div className="md:w-1/3 bg-white rounded-xl p-6 shadow-lg">
        <h1 className="text-3xl font-bold text-center mb-8">Dashboard</h1>

        {/* Profile URL */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-2">Your Profile Link</h2>
          <div className="flex gap-2">
            <input
              value={profileUrl}
              readOnly
              className="flex-1 p-2 border rounded-lg bg-gray-50"
              placeholder="https://example.com/profile/username"
            />
            <Button
              onClick={copyToClipboard}
              className="bg-blue-600 text-white hover:bg-blue-700"
            >
              Copy
            </Button>
          </div>
        </div>

        {/* Settings Switches */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <label className="text-sm font-medium">Accept Messages</label>
              <p className="text-sm text-gray-500">
                Allow users to send you messages
              </p>
            </div>
            <Switch
              checked={isAcceptingMessages}
              onCheckedChange={() => handleSwitchChange('isAcceptingMessages')}
              disabled={isSwitchLoading}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <label className="text-sm font-medium">Safe Mode</label>
              <p className="text-sm text-gray-500">
                Block potentially harmful messages
              </p>
            </div>
            <Switch
              checked={safeMode}
              onCheckedChange={() => handleSwitchChange('safeMode')}
              disabled={isSwitchLoading}
            />
          </div>
        </div>

        <Separator className="my-8" />

        {/* Refresh Button */}
        <Button
          className="w-full"
          variant="outline"
          onClick={() => fetchMessages(true)}
          disabled={isLoading}
        >
          {isLoading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <RefreshCcw className="mr-2 h-4 w-4" />
          )}
          Refresh Messages
        </Button>
      </div>

      {/* Messages Panel */}
      <div className="md:w-2/3 bg-white rounded-xl p-6 shadow-lg">
        <h2 className="text-2xl font-bold mb-6">Your Messages</h2>
        <div className="space-y-4">
          {messages.length === 0 ? (
            <div className="text-center text-gray-500">
              No messages found
            </div>
          ) : (
            messages.map((message) => (
              <MessageCard
                key={message._id as string}
                message={message}
                onMessageDelete={handleDeleteMessage}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default UserDashboard;