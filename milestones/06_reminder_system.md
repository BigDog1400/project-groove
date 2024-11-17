**--- `milestones/06_reminder_system.md` ---**

## Milestone 6: Reminder System

**Objective:** Implement a system for reminding users to perform their GtG sets throughout the day.

**Technical Context:**

* This will utilize Expo's local notification API.
* Users should be able to configure reminder intervals.

**Requirements:**

1. **Add a "Settings" or "Reminders" screen/section (`ReminderSettingsScreen.tsx` in `src/screens/`).**  This could be integrated into the planned `Settings/Profile` screen.
2. **Allow users to set a reminder interval (e.g., every 2 hours, every 3 hours).**
3. **Store the reminder interval in user preferences (either locally or in Supabase).**
4. **Use Expo's `Notifications` API to schedule local notifications based on the chosen interval.**
   * Notifications should include a message reminding the user to perform their GtG sets.
5. **Handle notification permissions and prompt the user if necessary.**

**Instructions for LLM:**

* Generate the code for reminder settings and notification scheduling.
* Use `expo-notifications` for local notifications. Ensure proper handling of notification permissions.
* Design a user-friendly interface for setting reminder intervals.
