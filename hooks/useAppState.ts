import { useEffect, useState } from 'react';
import { AppState, AppStateStatus } from 'react-native';

const invoke = (fn?: Function) => {
  if (fn && typeof fn === 'function') {
    fn();
  }
};

export const useAppState = ({
  onChange,
  onForeground,
  onBackground,
}: {
  onChange?: Function;
  onForeground?: Function;
  onBackground?: Function;
} = {}) => {
  const [appState, setAppState] = useState(AppState.currentState);

  useEffect(() => {
    const handleAppState = (next: AppStateStatus) => {
      if (next === 'active') {
        invoke(onForeground);
      } else if (
        appState === 'active' &&
        ['background', 'inactive'].indexOf(next) !== -1
      ) {
        invoke(onBackground);
      }
      setAppState(next);
      invoke(onChange);
    };

    const listener = AppState.addEventListener('change', handleAppState);
    return () => listener.remove();
  }, [onChange, onForeground, onBackground, appState]);

  return { appState };
};
