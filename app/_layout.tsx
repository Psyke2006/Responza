import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="onboarding" />
        <Stack.Screen name="login" />
        <Stack.Screen name="signup" />
        <Stack.Screen name="forgot-password" />
        <Stack.Screen name="permissions" />
        <Stack.Screen name="home" />
        <Stack.Screen name="contacts" />
        <Stack.Screen name="add-contact" />
        <Stack.Screen name="profile" />
        <Stack.Screen name="phone" />
        <Stack.Screen name="medical-info" />
        <Stack.Screen name="emergency-note" />
        <Stack.Screen name="cancel-codes" />
        <Stack.Screen name="countdown" />
        <Stack.Screen name="pin-cancel" />
        <Stack.Screen name="cancelled-feedback" />
        <Stack.Screen name="cancelled-success" />
        <Stack.Screen name="active-alert" />
        <Stack.Screen name="history" />
      </Stack>
      <StatusBar style="dark" />
    </SafeAreaProvider>
  );
}
