import { useSupabase } from "@/context/supabase-provider";

export function useAuth() {
  const { user, session, signOut } = useSupabase();
  return { user, session, signOut };
}
