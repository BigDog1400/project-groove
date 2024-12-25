import { useEffect, useRef } from 'react';
import { GestureResponderEvent } from 'react-native';

interface GestureState {
  pressed: boolean;
  longPressed: boolean;
  pressCount: number;
}

interface LongPressOptions {
  delay?: number;
  interval?: number;
}

export function useGestureCallback(
  callback: (state: GestureState) => void,
  deps: any[]
): (state: GestureState) => void {
  const callbackRef = useRef(callback);
  callbackRef.current = callback;
  
  return (state: GestureState) => {
    callbackRef.current(state);
  };
}

export function useLongPress(
  callback: (state: GestureState) => void,
  options: LongPressOptions = {}
) {
  const { delay = 500, interval = 100 } = options;
  const timeoutRef = useRef<NodeJS.Timeout>();
  const intervalRef = useRef<NodeJS.Timeout>();
  const countRef = useRef(0);
  const stateRef = useRef<GestureState>({
    pressed: false,
    longPressed: false,
    pressCount: 0,
  });

  const clearTimers = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  };

  useEffect(() => {
    return () => {
      clearTimers();
    };
  }, []);

  const handlePressIn = () => {
    stateRef.current = {
      pressed: true,
      longPressed: false,
      pressCount: 0,
    };
    callback(stateRef.current);

    timeoutRef.current = setTimeout(() => {
      stateRef.current.longPressed = true;
      callback(stateRef.current);

      intervalRef.current = setInterval(() => {
        countRef.current += 1;
        stateRef.current.pressCount = countRef.current;
        callback(stateRef.current);
      }, interval);
    }, delay);
  };

  const handlePressOut = () => {
    clearTimers();
    stateRef.current = {
      pressed: false,
      longPressed: false,
      pressCount: 0,
    };
    countRef.current = 0;
    callback(stateRef.current);
  };

  return {
    onPressIn: handlePressIn,
    onPressOut: handlePressOut,
  };
} 