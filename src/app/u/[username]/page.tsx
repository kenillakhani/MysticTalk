'use client';

import React, { useState } from 'react';
import axios, { AxiosError } from 'axios';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { CardHeader, CardContent, Card } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/components/ui/use-toast';
import * as z from 'zod';
import { ApiResponse } from '@/types/ApiResponse';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { messageSchema } from '@/schemas/messageSchema';

const specialChar = '||';

const parseStringMessages = (messageString: string): string[] => {
  return messageString.split(specialChar);
};

export default function SendMessage() {
  const params = useParams<{ username: string }>();
  const username = params.username;

  const form = useForm<z.infer<typeof messageSchema>>({
    resolver: zodResolver(messageSchema),
  });

  const [suggestedMessages, setSuggestedMessages] = useState<string[]>([]);
  const [isSuggestLoading, setIsSuggestLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const messageContent = form.watch('content');

  const handleMessageClick = (message: string) => {
    form.setValue('content', message);
  };

  const onSubmit = async (data: z.infer<typeof messageSchema>) => {
    setIsLoading(true);
    try {
      const response = await axios.post<ApiResponse>('/api/send-message', {
        ...data,
        username,
      });

      toast({
        title: response.data.message,
        variant: 'default',
      });
      form.reset({ ...form.getValues(), content: '' });
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: 'Error',
        description:
          axiosError.response?.data.message ?? 'Failed to send message',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchSuggestedMessages = async () => {
    setIsSuggestLoading(true);
    setSuggestedMessages([]);
  
    try {
      const response = await fetch('/api/suggest-messages', {
        method: 'POST',
      });
  
      if (!response.ok) {
        throw new Error('Failed to fetch suggested messages');
      }
  
      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let result = '';
  
      while (true) {
        const { done, value } = await reader!.read();
        if (done) break;
        result += decoder.decode(value, { stream: true });
      }
  
      // Split and clean suggested messages
      const messages = result.split('||').map((msg) => {
        return msg.replace(/^\{"output":"/, '').replace(/"}$/, '').trim();
      });
      
      setSuggestedMessages(messages);
    } catch (error) {
      console.error('Error fetching suggested messages:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch suggested messages',
        variant: 'destructive',
      });
    } finally {
      setIsSuggestLoading(false);
    }
  };

  return (
    <div className="container mx-auto my-8 p-6 bg-white rounded max-w-4xl">
      <h1 className="text-4xl font-bold mb-6 text-center">
        Public Profile Link
      </h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Send Anonymous Message to @{username}</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Write your anonymous message here"
                    className="resize-none"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex justify-center">
            {isLoading ? (
              <Button disabled>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Please wait
              </Button>
            ) : (
              <Button type="submit" disabled={isLoading || !messageContent}>
                Send It
              </Button>
            )}
          </div>
        </form>
      </Form>

      <div className="space-y-4 my-8">
        <div className="space-y-2">
        <Button
        className="mt-4"
        variant="default"
        onClick={fetchSuggestedMessages}
        disabled={isSuggestLoading}
      >
        {isSuggestLoading ? 'Suggesting...' : 'Suggest Messages'}
      </Button>
          <p>Click on any message below to select it.</p>
        </div>

        {/* Conditionally Render Card Component */}
        {suggestedMessages.length > 0 && (
          <Card>
            <CardHeader>
              <h3 className="text-2xl font-semibold mb-4 text-center">
                Suggested Messages
              </h3>
            </CardHeader>
            <CardContent className="flex flex-col space-y-4">
              <div className="suggested-messages mt-2">
                <div className="grid grid-cols-1 gap-4">
                  {suggestedMessages.map((message, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      className="text-base border rounded-lg p-4 shadow hover:shadow-md duration-300 text-center"
                      onClick={() => handleMessageClick(message)}
                    >
                      {message.trim()}
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
      <Separator className="my-6" />
      <div className="text-center">
        <div className="mb-4">Get Your Message Board</div>
        <Link href={'/sign-up'}>
          <Button>Create Your Account</Button>
        </Link>
      </div>
    </div>
  );
}