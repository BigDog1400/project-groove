import { Redirect, Stack } from 'expo-router';
import { useSupabase } from '@/context/supabase-provider';

export default function AppLayout() {
	const { user } = useSupabase();

	// // If no user, redirect to sign in
	// if (!user) {
	// 	return <Redirect href="/sign-in" />;
	// }

	return (
		<Stack
			screenOptions={{
				headerShown: false,
			}}
		>
			<Stack.Screen name="(protected)" />
			<Stack.Screen name="welcome" />
			<Stack.Screen
				name="sign-up"
				options={{
					presentation: "modal",
					headerShown: true,
					headerTitle: "Sign Up",
					gestureEnabled: true,
				}}
			/>
			<Stack.Screen
				name="sign-in"
				options={{
					presentation: "modal",
					headerShown: true,
					headerTitle: "Sign In",
					gestureEnabled: true,
				}}
			/>
		</Stack>
	);
}
