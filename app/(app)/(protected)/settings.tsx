import { View } from "react-native";
import { router } from "expo-router";

import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { H1, Muted } from "@/components/ui/typography";

export default function Settings() {
	return (
		<View className="flex-1 bg-background p-4 gap-y-4">
			<H1 className="text-center">Settings</H1>
			
			<View className="bg-card rounded-lg p-4 gap-y-4">
				<Button
					className="w-full"
					size="default"
					variant="outline"
					onPress={() => router.push("/(app)/(protected)/reminder")}
				>
					<Text>⏰ Reminder Settings</Text>
				</Button>

				<Button
					className="w-full"
					size="default"
					variant="destructive"
					onPress={() => router.push("/(app)/(protected)/logout")}
				>
					<Text>Sign Out</Text>
				</Button>
			</View>

			<Muted className="text-center">
				Configure your app settings and preferences here.
			</Muted>
		</View>
	);
}
