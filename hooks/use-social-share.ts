import { useMutation } from "@tanstack/react-query";
import { supabase } from "@/config/supabase";
import { Share } from "react-native";
import * as FileSystem from 'expo-file-system';

interface ShareImageParams {
  userId: string;
  streak: number;
  dailyCompletion: number;
}

export function useSocialShare() {
  return useMutation({
    mutationFn: async ({ userId, streak, dailyCompletion }: ShareImageParams) => {
      try {
        console.log('Calling edge function with:', { userId, streak, dailyCompletion });
        
        // Call the edge function to generate the image
        const { data, error } = await supabase.functions.invoke<{ url: string; error?: string; details?: string }>(
          'generate-share-image',
          {
            body: {
              userId,
              streak,
              dailyCompletion
            },
          }
        );

        console.log('Edge function response:', { data, error });

        if (error) {
          console.error('Edge function error:', error);
          throw error;
        }

        if (data?.error) {
          console.error('Edge function returned error:', data.error, data.details);
          throw new Error(data.error);
        }

        if (!data?.url) {
          console.error('No image URL returned');
          throw new Error('No image URL returned');
        }

        console.log('Downloading image from URL:', data.url);

        // Download the image
        const localUri = FileSystem.cacheDirectory + 'share.png';
        await FileSystem.downloadAsync(data.url, localUri);

        console.log('Image downloaded to:', localUri);

        // Share the local image file
        await Share.share({
          url: localUri,
          title: 'Project Groove Streak',
        }, {
          dialogTitle: 'Share Your Streak',
          subject: 'Project Groove Streak',
        });

        return data;
      } catch (error) {
        console.error('Detailed sharing error:', error);
        throw error;
      }
    },
  });
} 