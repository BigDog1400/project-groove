import "../global.css";

import { Stack } from "expo-router";
import { useEffect } from "react";
import { useColorScheme } from "@/lib/useColorScheme";
import { useAuth } from "@/hooks/use-auth";
import { useOnboarding } from "@/lib/hooks/use-onboarding";
import { router } from "expo-router";
import { SupabaseProvider } from "@/context/supabase-provider";
import { QueryProvider } from "@/context/query-provider";

export const unstable_settings = {
	initialRouteName: "(app)",
};

function RootLayoutNav() {
	const { colorScheme } = useColorScheme();
	const { user } = useAuth();
	const { isComplete } = useOnboarding();

	useEffect(() => {
		if (user && isComplete === false) {
			router.push('/(app)/(protected)/onboarding');
		}
	}, [user, isComplete]);

	return (
		<Stack screenOptions={{ headerShown: false }}>
			<Stack.Screen name="(app)" />
		</Stack>
	);
}

export default function RootLayout() {
	return (
		<SupabaseProvider>
			<QueryProvider>
				<RootLayoutNav />
			</QueryProvider>
		</SupabaseProvider>
	);
}
