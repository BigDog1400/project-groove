import React, { useEffect, useState } from 'react';
import { View, Text, Switch, Alert } from 'react-native';
import * as Notifications from 'expo-notifications';
import { Picker } from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { scheduleReminders } from '@/lib/notifications';

const REMINDER_INTERVALS = [
  { label: 'Every 2 hours', value: 2 },
  { label: 'Every 3 hours', value: 3 },
  { label: 'Every 4 hours', value: 4 },
  { label: 'Every 6 hours', value: 6 },
];

const REMINDER_STORAGE_KEY = '@gtg_reminder_settings';

export default function ReminderSettingsScreen() {
  const [enabled, setEnabled] = useState(false);
  const [interval, setInterval] = useState(2); // interval is in hours
  
  useEffect(() => {
    loadSettings();
    checkNotificationPermissions();
  }, []);

  const loadSettings = async () => {
    try {
      const settings = await AsyncStorage.getItem(REMINDER_STORAGE_KEY);
      if (settings) {
        const { enabled: savedEnabled, interval: savedInterval } = JSON.parse(settings);
        setEnabled(savedEnabled);
        setInterval(savedInterval);
      }
    } catch (error) {
      console.error('Error loading reminder settings:', error);
    }
  };

  const saveSettings = async (newEnabled: boolean, newInterval: number) => {
    try {
      await AsyncStorage.setItem(
        REMINDER_STORAGE_KEY,
        JSON.stringify({ enabled: newEnabled, interval: newInterval })
      );
    } catch (error) {
      console.error('Error saving reminder settings:', error);
    }
  };

  const checkNotificationPermissions = async () => {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Permission Required',
          'Please enable notifications to use the reminder feature'
        );
        setEnabled(false);
        return false;
      }
    }
    return true;
  };

  const handleToggleReminders = async (value: boolean) => {
    if (value && !(await checkNotificationPermissions())) {
      return;
    }

    setEnabled(value);
    saveSettings(value, interval);
    
    if (value) {
      scheduleReminders(interval);
    } else {
      await Notifications.cancelAllScheduledNotificationsAsync();
    }
  };

  const handleIntervalChange = (value: number) => {
    setInterval(value);
    saveSettings(enabled, value);
    if (enabled) {
      scheduleReminders(value);
    }
  };

  return (
    <View className="flex-1 p-4">
      <View className="bg-white rounded-lg p-4 mb-4">
        <View className="flex-row justify-between items-center mb-4">
          <Text className="text-lg font-medium">Enable Reminders</Text>
          <Switch
            value={enabled}
            onValueChange={handleToggleReminders}
          />
        </View>
        
        <Text className="text-lg font-medium mb-2">Reminder Interval</Text>
        <Picker
          selectedValue={interval}
          onValueChange={handleIntervalChange}
          enabled={enabled}
        >
          {REMINDER_INTERVALS.map((item) => (
            <Picker.Item
              key={item.value}
              label={item.label}
              value={item.value}
            />
          ))}
        </Picker>
      </View>
    </View>
  );
} 