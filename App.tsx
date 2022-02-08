/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from 'react-native';
import { Colors, Header } from 'react-native/Libraries/NewAppScreen';
import Clipboard from '@react-native-clipboard/clipboard';
import messaging from '@react-native-firebase/messaging';

import { useFCM } from './hooks/useFCM';

const Button: React.FC<{
  title: string;
  onPress: () => void;
}> = ({ onPress, title }) => {
  const isDarkMode = useColorScheme() === 'dark';
  return (
    <TouchableOpacity
      style={[
        styles.buttonContainer,
        {
          backgroundColor: isDarkMode ? Colors.light : Colors.dark,
        },
      ]}
      onPress={() => onPress()}
    >
      <Text
        style={[
          styles.buttonTitle,
          {
            color: isDarkMode ? Colors.dark : Colors.light,
          },
        ]}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
};

const Section: React.FC<{
  title: string;
}> = ({ children, title }) => {
  const isDarkMode = useColorScheme() === 'dark';
  return (
    <View style={styles.sectionContainer}>
      <Text
        style={[
          styles.sectionTitle,
          {
            color: isDarkMode ? Colors.white : Colors.black,
          },
        ]}
      >
        {title}
      </Text>
      <Text
        style={[
          styles.sectionDescription,
          {
            color: isDarkMode ? Colors.light : Colors.dark,
          },
        ]}
      >
        {children}
      </Text>
    </View>
  );
};

const App = () => {
  const isDarkMode = useColorScheme() === 'dark';
  const messagingDetails = useFCM();

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  const canAskPermission =
    messagingDetails.permission ===
    messaging.AuthorizationStatus.NOT_DETERMINED;

  const permissionDescription: Record<messaging.AuthorizationStatus, string> = {
    [messaging.AuthorizationStatus.NOT_DETERMINED]: 'Undetermined',
    [messaging.AuthorizationStatus.PROVISIONAL]: 'Provisional',
    [messaging.AuthorizationStatus.AUTHORIZED]: 'Authorized',
    [messaging.AuthorizationStatus.DENIED]: 'Denied',
  };

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={backgroundStyle}
      >
        <Header />
        <View
          style={{
            backgroundColor: isDarkMode ? Colors.black : Colors.white,
          }}
        >
          <Section title="Permission status">
            The current permission status is{' '}
            <Text style={styles.highlight}>
              {permissionDescription[messagingDetails.permission]}
            </Text>
            .
          </Section>
          {canAskPermission && (
            <Section title="Request permission">
              <Button
                title="Request"
                onPress={() => messaging().requestPermission()}
              />
            </Section>
          )}
          {messagingDetails.deviceToken && (
            <Section title="Your FCM Token">
              <Text style={styles.highlight}>
                {messagingDetails.deviceToken}
              </Text>{' '}
              <Button
                title="Copy"
                onPress={() =>
                  Clipboard.setString(messagingDetails.deviceToken)
                }
              />
            </Section>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonTitle: {
    fontSize: 18,
    fontWeight: '400',
    paddingHorizontal: 24,
    paddingVertical: 8,
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;
