import { View, Text, ScrollView } from 'react-native';
import { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { supabase } from '@/config/supabase';

type ProgressMetrics = {
  currentStreak: number;
  dailyCompletion: number;
};

export default function ProgressScreen() {
  const [metrics, setMetrics] = useState<ProgressMetrics>({
    currentStreak: 0,
    dailyCompletion: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProgressMetrics();
  }, []);

  const fetchProgressMetrics = async () => {
    try {
      setLoading(true);
      
      // Fetch sets for the current user
      const { data: sets, error } = await supabase
        .from('sets')
        .select(`
          *,
          user_exercises(*),
          daily_assignment_id
        `)
        .order('timestamp', { ascending: false });

      if (error) throw error;

      // Calculate metrics
      const today = new Date().toISOString().split('T')[0];
      const metrics = calculateMetrics(sets, today);
      
      setMetrics(metrics);
    } catch (error) {
      console.error('Error fetching progress metrics:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateMetrics = (sets: any[], today: string) => {
    // Calculate current streak
    let currentStreak = 0;
    let previousDate = today;
    
    const setsByDate = sets.reduce((acc: any, set: any) => {
      const date = new Date(set.timestamp).toISOString().split('T')[0];
      if (!acc[date]) acc[date] = [];
      acc[date].push(set);
      return acc;
    }, {});

    // Simple streak calculation
    while (setsByDate[previousDate]?.length > 0) {
      currentStreak++;
      const prevDate = new Date(previousDate);
      prevDate.setDate(prevDate.getDate() - 1);
      previousDate = prevDate.toISOString().split('T')[0];
    }

    // Calculate daily completion
    const todaySets = setsByDate[today] || [];
    const dailyCompletion = todaySets.length > 0 ? 
      (todaySets.length / (todaySets[0]?.user_exercises?.target_sets || 1)) * 100 : 0;

    return {
      currentStreak,
      dailyCompletion: Math.min(100, dailyCompletion),
    };
  };

  return (
    <View className="flex-1 bg-background">
      <ScrollView className="flex-1">
        <View className="p-4 space-y-6">
          {loading ? (
            <View className="flex-1 justify-center items-center">
              <Text>Loading metrics...</Text>
            </View>
          ) : (
            <>
              {/* Streak Card */}
              <View className="bg-card p-4 rounded-lg">
                <Text className="text-lg font-semibold mb-2">Current Streak</Text>
                <Text className="text-3xl font-bold">{metrics.currentStreak} days</Text>
              </View>

              {/* Daily Completion Card */}
              <View className="bg-card p-4 rounded-lg">
                <Text className="text-lg font-semibold mb-2">Today's Progress</Text>
                <View className="h-4 bg-muted rounded-full overflow-hidden">
                  <View 
                    className="h-full bg-primary rounded-full"
                    style={{ width: `${metrics.dailyCompletion}%` }}
                  />
                </View>
                <Text className="mt-2">{Math.round(metrics.dailyCompletion)}% Complete</Text>
              </View>
            </>
          )}
        </View>
      </ScrollView>
    </View>
  );
} 