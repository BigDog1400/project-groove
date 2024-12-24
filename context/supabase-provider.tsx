import { AuthTokenResponsePassword, Session, User } from "@supabase/supabase-js";
import { useRouter, useSegments, SplashScreen } from "expo-router";
import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/config/supabase";

SplashScreen.preventAutoHideAsync();

type SupabaseContextProps = {
	user: User | null;
	session: Session | null;
	initialized?: boolean;
	signUp: (email: string, password: string) => Promise<void>;
	signInWithPassword?: (email: string, password: string) => Promise<AuthTokenResponsePassword>;
	signOut: () => Promise<void>;
	hasCompletedOnboarding: boolean;
};

type SupabaseProviderProps = {
	children: React.ReactNode;
};

export const SupabaseContext = createContext<SupabaseContextProps>({
	user: null,
	session: null,
	initialized: false,
	signUp: async () => {},
	signOut: async () => {},
	hasCompletedOnboarding: false,
});

export const useSupabase = () => useContext(SupabaseContext);

export const SupabaseProvider = ({ children }: SupabaseProviderProps) => {
	const router = useRouter();
	const segments = useSegments();
	const [user, setUser] = useState<User | null>(null);
	const [session, setSession] = useState<Session | null>(null);
	const [initialized, setInitialized] = useState<boolean>(false);
	const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState<boolean>(false);

	const checkOnboardingStatus = async (userId: string) => {
		try {
			const { data, error } = await supabase
				.from('users')
				.select('onboarding_completed')
				.eq('id', userId)
				.single();

			if (error) throw error;
			console.log('onboarding_completed', data?.onboarding_completed);
			setHasCompletedOnboarding(data?.onboarding_completed ?? false);
		} catch (error) {
			console.error('Error checking onboarding status:', error);
			setHasCompletedOnboarding(false);
		}
	};

	const signUp = async (email: string, password: string) => {
		const { error } = await supabase.auth.signUp({
			email,
			
			password,
		});
		if (error) {
			throw error;
		}
	};

	const signInWithPassword = async (email: string, password: string) => {
		const result = await supabase.auth.signInWithPassword({
			email,
			password,
		});
		if (result.error) {
			throw result.error;
		}
		return result;
	};

	const signOut = async () => {
		const { error } = await supabase.auth.signOut();
		if (error) {
			throw error;
		}
	};

	useEffect(() => {
		supabase.auth.getSession().then(({ data: { session } }) => {
			setSession(session);
			setUser(session ? session.user : null);
			if (session?.user) {
				checkOnboardingStatus(session.user.id);
			}
			setInitialized(true);
		});

		supabase.auth.onAuthStateChange((_event, session) => {
			setSession(session);
			setUser(session ? session.user : null);
			if (session?.user) {
				checkOnboardingStatus(session.user.id);
			}
		});
	}, []);

	useEffect(() => {
		if (!initialized) return;

		const inProtectedGroup = segments[1] === "(protected)";
		const inOnboardingRoute = segments[2] === "onboarding";
		const isLoginRoute = segments[1] === "sign-in" || segments[1] === "sign-up" || segments[1] === "welcome";

		if (session) {
			if (!hasCompletedOnboarding && !inOnboardingRoute) {
				console.log('hasCompletedOnboarding', hasCompletedOnboarding);
				// router.replace("/(app)/(protected)/onboarding");
			} else if (hasCompletedOnboarding && !inProtectedGroup) {
				console.log('hasCompletedOnboarding', hasCompletedOnboarding);
				// router.replace("/(app)/(protected)");
			}
		} else if (!isLoginRoute) {
			console.log('Redirecting to welcome');
			router.replace("/(app)/welcome");
		}

		setTimeout(() => {
			SplashScreen.hideAsync();
		}, 500);
	}, [initialized, session, hasCompletedOnboarding, segments]);

	return (
		<SupabaseContext.Provider
			value={{
				user,
				session,
				initialized,
				signUp,
				signInWithPassword,
				signOut,
				hasCompletedOnboarding,
			}}
		>
			{children}
		</SupabaseContext.Provider>
	);
};
