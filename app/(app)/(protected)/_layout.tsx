import { Tabs, usePathname } from "expo-router";
import { Platform, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors } from "@/constants/colors";
import { useColorScheme } from "@/lib/useColorScheme";

export default function ProtectedLayout() {
	const { colorScheme } = useColorScheme();
	const pathname = usePathname();
	const insets = useSafeAreaInsets();
	const isOnboarding = pathname === "/(app)/(protected)/onboarding";

	return (
		<Tabs
			screenOptions={{
				headerShown: false,
				tabBarStyle: {
					display: isOnboarding ? 'none' : 'flex',
					backgroundColor: colors.light.background,
					borderTopWidth: 2,
					borderTopColor: colors.light.foreground,
					height: 60 + insets.bottom,
					paddingBottom: insets.bottom,
					paddingTop: 0,
					paddingHorizontal: 8,
					elevation: 0,
					shadowOpacity: 0,
					position: 'absolute',
					bottom: 0,
					left: 0,
					right: 0,
				},
				tabBarItemStyle: {
					backgroundColor: 'transparent',
					margin: 4,
					borderRadius: 8,
					borderWidth: 2,
					borderColor: colors.light.foreground,
					height: 44,
					overflow: Platform.select({
						ios: 'hidden',
						android: 'visible'
					}),
				},
				tabBarShowLabel: false,
				tabBarIconStyle: {
					marginTop: 0,
				},
				tabBarActiveTintColor: colors.light.foreground,
				tabBarInactiveTintColor: colors.light.foreground,
				tabBarActiveBackgroundColor: colors.light.accent,
			}}
		>
			<Tabs.Screen 
				name="index" 
				options={{
					tabBarIcon: ({ color }) => (
						<Ionicons name="today-outline" size={24} color={color} />
					),
				}}
			/>
			<Tabs.Screen 
				name="exercise-selection" 
				options={{
					tabBarIcon: ({ color }) => (
						<Ionicons name="barbell-outline" size={24} color={color} />
					),
				}}
			/>
			<Tabs.Screen 
				name="progress" 
				options={{
					tabBarIcon: ({ color }) => (
						<Ionicons name="stats-chart-outline" size={24} color={color} />
					),
				}}
			/>
			<Tabs.Screen 
				name="settings" 
				options={{
					tabBarIcon: ({ color }) => (
						<Ionicons name="settings-outline" size={24} color={color} />
					),
				}}
			/>
			<Tabs.Screen 
				name="onboarding" 
				options={{
					href: null,
					headerShown: false,
					tabBarStyle: { display: 'none' },
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
				}}
			/>
		</Tabs>
	);
}
