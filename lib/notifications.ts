import * as Notifications from 'expo-notifications';

// Configure notification behavior
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export async function scheduleReminders(intervalHours: number) {
  // Cancel any existing notifications
  await Notifications.cancelAllScheduledNotificationsAsync();

  // Schedule new notifications
  const trigger: Notifications.TimeIntervalTriggerInput = {
    type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
    seconds: intervalHours * 60 * 60,
    repeats: true,
  };

  await Notifications.scheduleNotificationAsync({
    content: {
      title: "Time for your GTG sets! 💪",
      body: "Don't forget to practice your exercise for today.",
      data: { type: 'reminder' },
    },
    trigger,
  });
} 