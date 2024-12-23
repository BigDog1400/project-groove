import { router, Stack, usePathname } from "expo-router";

import { colors } from "@/constants/colors";
import { useOnboarding } from "@/lib/hooks/use-onboarding";
import { useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";

export const unstable_settings = {
	initialRouteName: "(root)",
};

export default function AppLayout() {
	const { isComplete } = useOnboarding();
	const { user } = useAuth();
	const pathname = usePathname();

	useEffect(() => {
		if (!isComplete && pathname !== "/(app)/(protected)/onboarding" && user) {
			router.replace('/(app)/(protected)/onboarding');
		}
	}, [isComplete, pathname, user]);

	return (
		<Stack screenOptions={{ headerShown: false, gestureEnabled: false }}>
			<Stack.Screen name="(protected)" />
			<Stack.Screen name="welcome" />
			<Stack.Screen
				name="sign-up"
				options={{
					presentation: "modal",
					headerShown: true,
					headerTitle: "Sign Up",
					headerStyle: {
						backgroundColor: colors.light.background,
					},
					headerTintColor: colors.light.foreground,
					gestureEnabled: true,
				}}
			/>
			<Stack.Screen
				name="sign-in"
				options={{
					presentation: "modal",
					headerShown: true,
					headerTitle: "Sign In",
					headerStyle: {
						backgroundColor: colors.light.background,
					},
					headerTintColor: colors.light.foreground,
					gestureEnabled: true,
				}}
			/>
			<Stack.Screen
				name="modal"
				options={{
					presentation: "modal",
					headerShown: true,
					headerTitle: "Modal",
					headerStyle: {
						backgroundColor: colors.light.background,
					},
					headerTintColor: colors.light.foreground,
					gestureEnabled: true,
				}}
			/>
		</Stack>
	);
}
