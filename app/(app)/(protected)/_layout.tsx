import { Tabs, usePathname } from "expo-router";
import { Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { colors } from "@/constants/colors";
import { useColorScheme } from "@/lib/useColorScheme";

export default function ProtectedLayout() {
	const { colorScheme } = useColorScheme();
	const pathname = usePathname();
	const isOnboarding = pathname === "/(app)/(protected)/onboarding";

	return (
		<Tabs
			screenOptions={({ navigation }) => ({
				headerShown: !isOnboarding,
				headerRight: !isOnboarding ? () => (
					<Pressable 
						onPress={() => navigation.navigate("settings")}
						className="mr-4"
					>
						<Ionicons 
							name="settings-outline" 
							size={24} 
							color={colorScheme === "dark" ? colors.dark.foreground : colors.light.foreground}
						/>
					</Pressable>
				) : undefined,
				tabBarStyle: {
					backgroundColor:
						colorScheme === "dark"
							? colors.dark.background
							: colors.light.background,
					display: isOnboarding ? 'none' : 'flex',
				},
				tabBarActiveTintColor:
					colorScheme === "dark"
						? colors.dark.foreground
						: colors.light.foreground,
			})}
		>
			<Tabs.Screen 
				name="index" 
				options={{
					title: "Today",
					tabBarIcon: ({ color }) => (
						<Ionicons name="today-outline" size={24} color={color} />
					),
				}}
			/>
			<Tabs.Screen 
				name="exercise-selection" 
				options={{
					title: "Exercises",
					tabBarIcon: ({ color }) => (
						<Ionicons name="barbell-outline" size={24} color={color} />
					),
				}}
			/>
			<Tabs.Screen 
				name="progress" 
				options={{
					title: "Progress",
					tabBarIcon: ({ color }) => (
						<Ionicons name="stats-chart-outline" size={24} color={color} />
					),
				}}
			/>
			<Tabs.Screen 
				name="settings" 
				options={{
					href: null, // Hide from tab bar but keep accessible
				}}
			/>
			<Tabs.Screen 
				name="onboarding" 
				options={{
					href: null, // Hide from tab bar
					headerShown: false,
				}}
			/>
			<Tabs.Screen
				name="reminder"
				options={{
					href: null, 
				}}
			/>
			<Tabs.Screen
				name="logout"
				options={{
					href: null,
					title: "Sign Out",
				}}
			/>
		</Tabs>
	);
}
