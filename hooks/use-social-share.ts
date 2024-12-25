import { useMutation } from "@tanstack/react-query";
import { captureRef } from "react-native-view-shot";
import { Share } from "react-native";

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

        // Share the image
        await Share.share({
          url: `file://${uri}`,
          message: `I'm on a ${streak} day streak! 🔥`,
          title: 'Project Groove Streak',
        }, {
          dialogTitle: 'Share Your Streak',
          subject: 'Project Groove Streak',
        });

        return { success: true };
      } catch (error) {
        console.error('Error sharing:', error);
        throw error;
      }
    },
  });
} 