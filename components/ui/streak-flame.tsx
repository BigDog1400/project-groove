import { View } from "react-native";
import { Text } from "./text";
import { cn } from "@/lib/utils";
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface StreakFlameProps {
  count: number;
  className?: string;
}

export function StreakFlame({ count, className }: StreakFlameProps) {
  return (
    <View className={cn("flex-row items-center gap-x-1.5", className)}>
      <MaterialCommunityIcons 
        name="fire" 
        size={24} 
        color={count > 0 ? "#FF9600" : "#9CA3AF"}
      />
      <Text className="text-lg font-bold">
        {count}
      </Text>
    </View>
  );
}
