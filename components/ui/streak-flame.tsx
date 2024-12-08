import { View } from "react-native";
import { Text } from "./text";
import { cn } from "@/lib/utils";
import { Feather } from "@expo/vector-icons";

interface StreakFlameProps {
  count: number;
  className?: string;
}

export function StreakFlame({ count, className }: StreakFlameProps) {
  // Calculate size and color based on count
  const getFlameStyle = (count: number) => {
    if (count === 0) return {
      size: 24,
      color: "#9CA3AF", // Gray
      intensity: "text-muted-foreground",
      label: "Start your streak!"
    };
    if (count <= 2) return {
      size: 28,
      color: "#F59E0B", // Amber
      intensity: "text-amber-500",
      label: "Getting warmed up!"
    };
    if (count <= 4) return {
      size: 32,
      color: "#F97316", // Orange
      intensity: "text-orange-500",
      label: "On fire!"
    };
    if (count <= 6) return {
      size: 36,
      color: "#EF4444", // Red
      intensity: "text-red-500",
      label: "Blazing!"
    };
    return {
      size: 40,
      color: "#7C3AED", // Purple
      intensity: "text-purple-500",
      label: "Unstoppable! 🔥"
    };
  };

  const style = getFlameStyle(count);

  return (
    <View className={cn("items-center", className)}>
      <View className="relative">
        <Feather 
          name="zap" 
          size={style.size} 
          color={style.color}
          style={{ 
            transform: [{ rotate: '12deg' }],
            textShadowColor: style.color,
            textShadowOffset: { width: 0, height: 0 },
            textShadowRadius: count > 0 ? 6 : 0,
          }}
        />
        <View className="absolute -right-2 -top-2 bg-card rounded-full w-6 h-6 items-center justify-center border border-border">
          <Text className="text-xs font-bold">{count}</Text>
        </View>
      </View>
      <Text className={cn("mt-2 text-sm font-medium", style.intensity)}>
        {style.label}
      </Text>
    </View>
  );
}
