import { View, Text } from 'react-native'
import ViewShot from 'react-native-view-shot'
import { forwardRef } from 'react'
import { MaterialCommunityIcons } from '@expo/vector-icons';
interface ShareableStreakProps {
  streak: number
  dailyCompletion: number
}

export const ShareableStreak = forwardRef<ViewShot, ShareableStreakProps>(
  ({ streak, dailyCompletion }, ref) => {
    return (
      <ViewShot
        ref={ref}
        options={{ format: 'png', quality: 1 }}
        style={{ width: 1080, height: 1080 }}
      >
        <View className="w-full h-full bg-white p-12">
          {/* Main content container */}
          <View className="flex-1 justify-center">
            {/* Top section with streak */}
            <View className="flex-row items-center justify-between my-auto">
              {/* Left side text */}
              <View>
                <Text className="text-6xl font-black text-[#FF7171] mb-2">
                  I'm on a
                </Text>
                <Text className="text-[320px] leading-[320px] font-black text-[#FF7171]">
                  {streak}
                </Text>
                <Text className="text-6xl font-black text-[#FF7171] -mt-8">
                  daily training streak!
                </Text>
              </View>

              {/* Flame emoji */}
              <MaterialCommunityIcons
                name="fire" 
                size={400} 
                color={streak > 0 ? "#FF9F45" : "#9CA3AF"}
              />
            </View>

            {/* Bottom section */}
            <View className="mt-auto">
              {/* Today's exercise card */}
              <View className="bg-[#FFF5F5] rounded-3xl p-6 border-2 border-[#FF7171] shadow-[4px_4px_0_0_rgba(255,113,113,0.5)] mb-8">
                <Text className="text-3xl font-black text-[#FF7171] mb-2">
                  Today's Exercise
                </Text>
                <Text className="text-5xl font-black text-[#FF7171]">
                  {dailyCompletion} Pull-ups 💪
                </Text>
              </View>

              {/* App name */}
              <Text className="text-4xl font-bold text-black">
                grease the groove
              </Text>
            </View>
          </View>
        </View>
      </ViewShot>
    )
  }
)

ShareableStreak.displayName = 'ShareableStreak' 