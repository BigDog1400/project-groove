import { TouchableOpacity, TouchableOpacityProps } from "react-native";
import { Text } from "./text";
import { cn } from "@/lib/utils";

interface FabProps extends TouchableOpacityProps {
  label?: string;
}

export function Fab({ label, className, ...props }: FabProps) {
  return (
    <TouchableOpacity
      className={cn(
        "absolute bottom-6 right-6 bg-primary rounded-full w-14 h-14 items-center justify-center shadow-lg",
        className
      )}
      {...props}
    >
      {label ? (
        <Text className="text-primary-foreground">{label}</Text>
      ) : (
        <Text className="text-2xl text-primary-foreground">+</Text>
      )}
    </TouchableOpacity>
  );
}
