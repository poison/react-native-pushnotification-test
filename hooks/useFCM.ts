import { useEffect, useState } from 'react';
import messaging from '@react-native-firebase/messaging';
import { useAppState } from './useAppState';

export interface MessagingDetails {
  deviceToken: string | null;
  initialized: boolean;
  permission: messaging.AuthorizationStatus;
}

export const useFCM = () => {
  const [messagingDetails, setMessagingDetails] = useState<MessagingDetails>({
    deviceToken: null,
    initialized: false,
    permission: messaging.AuthorizationStatus.NOT_DETERMINED,
  });

  // Each time we foreground the app, the permissions (or token) might have changed, fetch them
  useAppState({
    onForeground: async () => {
      const permission = await messaging().hasPermission();
      let deviceToken = messagingDetails.deviceToken;

      if (permission === messaging.AuthorizationStatus.AUTHORIZED) {
        deviceToken = await messaging().getToken();
      }

      console.log('---> SETDETAILS', { deviceToken, permission });
      setMessagingDetails({ deviceToken, initialized: true, permission });
    },
  });

  // Register the callback on messaging.onTokenRefresh
  useEffect(() => {
    messaging().onTokenRefresh((deviceToken) =>
      setMessagingDetails({ ...messagingDetails, deviceToken }),
    );
  }, []);

  return messagingDetails;
};
