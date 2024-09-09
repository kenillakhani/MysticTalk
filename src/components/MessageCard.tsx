// 'use client'

// import {
//     Card,
//     CardContent,
//     CardDescription,
//     CardHeader,
//     CardTitle,
//   } from "@/components/ui/card"
//   import {
//     AlertDialog,
//     AlertDialogAction,
//     AlertDialogCancel,
//     AlertDialogContent,
//     AlertDialogDescription,
//     AlertDialogFooter,
//     AlertDialogHeader,
//     AlertDialogTitle,
//     AlertDialogTrigger,
//   } from "@/components/ui/alert-dialog"
// import { Button } from "./ui/button"
// import { X } from "lucide-react"
// import { useToast } from "./ui/use-toast"
// import axios, { AxiosError } from "axios"
// import { ApiResponse } from "@/types/ApiResponse"
// import { Message } from "@/model/User"
  
// type MessageCardProps = {
//     message: Message;
//     onMessageDelete: (messageId: string) => void;
// };
  

// const MessageCard = ({ message, onMessageDelete }: MessageCardProps) => {
//     const { toast } = useToast()
//     const handleDeleteConfirm = async () => {
//         const response = await axios.delete<ApiResponse>(`/api/delete-message/${message._id}`)
//         toast({
//             title: response.data.message,
//         })
//         onMessageDelete(message._id as string);
//     }
//   return (
//     <Card>
//   <CardHeader>
//     <CardTitle>Card Title</CardTitle>
//     <AlertDialog>
//       <AlertDialogTrigger asChild>
//         <Button variant="destructive"><X className="w-5 h-5"/></Button>
//       </AlertDialogTrigger>
//       <AlertDialogContent>
//         <AlertDialogHeader>
//           <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
//           <AlertDialogDescription>
//             This action cannot be undone. This will permanently delete your
//             account and remove your data from our servers.
//           </AlertDialogDescription>
//         </AlertDialogHeader>
//         <AlertDialogFooter>
//           <AlertDialogCancel>Cancel</AlertDialogCancel>
//           <AlertDialogAction onClick={handleDeleteConfirm}>Continue</AlertDialogAction>
//         </AlertDialogFooter>
//       </AlertDialogContent>
//     </AlertDialog>
//     <CardDescription>Card Description</CardDescription>
//   </CardHeader>
//   <CardContent>
//   </CardContent>
// </Card>

//   )
// }

// export default MessageCard

'use client'

import React, { useState } from 'react';
import axios, { AxiosError } from 'axios';
import dayjs from 'dayjs';
import { X } from 'lucide-react';
import { Message } from '@/model/User';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from './ui/button';
import { useToast } from '@/components/ui/use-toast';
import { ApiResponse } from '@/types/ApiResponse';

type MessageCardProps = {
  message: Message;
  onMessageDelete: (messageId: string) => void;
};

export function MessageCard({ message, onMessageDelete }: MessageCardProps) {
  const { toast } = useToast();

  const handleDeleteConfirm = async () => {
    try {
      const response = await axios.delete<ApiResponse>(
        `/api/delete-message/${message._id}`
      );
      toast({
        title: response.data.message,
      });
      onMessageDelete(message._id as string);

    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: 'Error',
        description:
          axiosError.response?.data.message ?? 'Failed to delete message',
        variant: 'destructive',
      });
    } 
  };

  return (
    <Card className="card-bordered">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className='text-lg'>{message.content}</CardTitle>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant='destructive' className='mx-3'>
                <X className="w-5 h-5" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete
                  this message.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction onClick={handleDeleteConfirm}>
                  Continue
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
        <div className="text-sm">
          {dayjs(message.createdAt).format('MMM D, YYYY h:mm A')}
        </div>
      </CardHeader>
      <CardContent></CardContent>
    </Card>
  );
}