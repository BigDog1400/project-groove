import "../global.css";

import { Slot } from "expo-router";
import { SupabaseProvider } from "@/context/supabase-provider";
import { QueryProvider } from "@/context/query-provider";

export default function AppLayout() {
	return (
		<SupabaseProvider>
			<QueryProvider>
				<Slot />
			</QueryProvider>
		</SupabaseProvider>
	);
}
