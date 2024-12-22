import { View } from "react-native";
import { router } from "expo-router";

import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { H1, Muted } from "@/components/ui/typography";
import { useSupabase } from "@/context/supabase-provider";

export default function LogoutScreen() {
	const { signOut } = useSupabase();

	const handleLogout = async () => {
		await signOut();
	};

	return (
		<View className="flex-1 items-center justify-center bg-background p-4 gap-y-4">
			<H1 className="text-center">Sign Out</H1>
			<Muted className="text-center">
				Are you sure you want to sign out and return to the welcome screen?
			</Muted>
			<View className="w-full gap-y-4">
				<Button
					className="w-full"
					size="default"
					variant="destructive"
					onPress={handleLogout}
				>
					<Text>Yes, Sign Out</Text>
				</Button>
				<Button
					className="w-full"
					size="default"
					variant="outline"
					onPress={() => router.back()}
				>
					<Text>Cancel</Text>
				</Button>
			</View>
		</View>
	);
} 