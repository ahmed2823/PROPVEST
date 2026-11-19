import { Stack } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { DemoProvider } from '../context/DemoContext';
import { AuthProvider } from '../context/AuthContext';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <DemoProvider>
          <Stack screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="property/[id]" />
            <Stack.Screen name="invest/[id]" />
            <Stack.Screen name="auth" />
          </Stack>
        </DemoProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}
