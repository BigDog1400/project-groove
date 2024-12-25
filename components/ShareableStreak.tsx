import { View, Text } from 'react-native'
import ViewShot from 'react-native-view-shot'
import { forwardRef } from 'react'
import Svg, { Line, G, Path } from 'react-native-svg'

interface ShareableStreakProps {
  streak: number
  dailyCompletion: number
}

const TallyGroup = ({ count, index }: { count: number; index: number }) => {
  // Slight variations for organic look
  const getRandomOffset = () => (Math.random() - 0.5) * 3
  
  return (
    <Svg width={120} height={60} viewBox="0 0 120 60">
      {/* Black background with slight tilt */}
      <G transform="rotate(8, 60, 30)">
        {/* Background patch */}
        <Path
          d="M10,5 L110,5 L110,55 L10,55 Z"
          fill="black"
          stroke="black"
          strokeWidth="2"
        />
        
        {/* Vertical lines */}
        {Array(Math.min(count, 4)).fill(null).map((_, i) => (
          <Line
            key={i}
            x1={30 + i * 20 + getRandomOffset()}
            y1={15}
            x2={30 + i * 20 + getRandomOffset()}
            y2={45}
            stroke="white"
            strokeWidth="6"
            strokeLinecap="round"
          />
        ))}
        
        {/* Diagonal strike for groups of 5 */}
        {count === 5 && (
          <Line
            x1={15}
            y1={30}
            x2={105}
            y2={30}
            stroke="white"
            strokeWidth="6"
            strokeLinecap="round"
            transform={`rotate(-35, 60, 30)`}
          />
        )}
      </G>
    </Svg>
  )
}

const TallyMarks = ({ count }: { count: number }) => {
  const fullGroups = Math.floor(count / 5)
  const remainder = count % 5

  return (
    <View className="flex-row flex-wrap items-center py-4 pl-2" style={{ gap: 16 }}>
      {/* Full groups of 5 */}
      {Array(fullGroups).fill(null).map((_, i) => (
        <TallyGroup key={i} count={5} index={i} />
      ))}
      {/* Remaining marks */}
      {remainder > 0 && <TallyGroup count={remainder} index={fullGroups} />}
    </View>
  )
}

export const ShareableStreak = forwardRef<ViewShot, ShareableStreakProps>(
  ({ streak, dailyCompletion }, ref) => {
    return (
      <ViewShot
        ref={ref}
        options={{ format: 'png', quality: 1 }}
        style={{ width: 1200, height: 630 }}
      >
        <View className="w-full h-full bg-white p-6">
          {/* Main Card */}
          <View className="w-full h-full border-4 border-black p-6">
            <View className="flex-1 justify-between">
              {/* Header */}
              <Text className="text-4xl font-bold mb-4 text-black">
                Epic Streak!
              </Text>
              <Text className="text-xl mb-6 text-black">
                Crushing it every day!
              </Text>

              {/* Center Display */}
              <View className="bg-black p-4">
                <View className="h-40 w-full bg-white">
                  <View className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                    <View className="bg-[#FF6B6B] rounded-full w-32 h-32 items-center justify-center">
                      <Text className="text-white text-6xl font-bold">×</Text>
                    </View>
                  </View>
                </View>
              </View>

              {/* Tally Marks */}
              <TallyMarks count={streak} />

              {/* Streak Count */}
              <Text className="text-lg text-black">
                {streak} days on fire 🔥
              </Text>

              {/* Footer */}
              <View className="mt-4 flex-row items-center justify-between">
                <View className="w-8 h-8 bg-black" />
                <Text className="text-lg text-black">
                  Grease the groove
                </Text>
              </View>
            </View>
          </View>
        </View>
      </ViewShot>
    )
  }
)

ShareableStreak.displayName = 'ShareableStreak' 