import { useMutation } from "@tanstack/react-query";
import { captureRef } from "react-native-view-shot";
import { Share, Platform } from "react-native";
import * as Sharing from 'expo-sharing';

interface ShareImageParams {
  viewRef: React.RefObject<any>;
  streak: number;
  dailyCompletion: number;
}

export function useSocialShare() {
  return useMutation({
    mutationFn: async ({ viewRef, streak }: ShareImageParams) => {
      try {
        // Capture the view as an image
        const uri = await captureRef(viewRef, {
          format: 'png',
          quality: 1,
          result: 'tmpfile'
        });

        const message = `I'm on a ${streak} day streak! 🔥`;

        if (Platform.OS === 'android') {
          // On Android, we need to share the file directly
          const shareResult = await Sharing.shareAsync(uri, {
            dialogTitle: 'Share Your Streak',
            mimeType: 'image/png',
            UTI: 'public.png'
          });
          return { success: shareResult };
        } else {
          // On iOS, we can use the Share API
          await Share.share({
            url: uri,
            message,
            title: 'Project Groove Streak',
          }, {
            dialogTitle: 'Share Your Streak',
            subject: 'Project Groove Streak',
          });
          return { success: true };
        }
      } catch (error) {
        console.error('Error sharing:', error);
        throw error;
      }
    },
  });
} 