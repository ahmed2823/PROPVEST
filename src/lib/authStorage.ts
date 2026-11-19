import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';

const SESSION_KEY = 'propvest.auth.session';

export async function readAuthSession() {
  if (Platform.OS === 'web') {
    return globalThis.localStorage.getItem(SESSION_KEY);
  }
  return SecureStore.getItemAsync(SESSION_KEY);
}

export async function writeAuthSession(value: string) {
  if (Platform.OS === 'web') {
    globalThis.localStorage.setItem(SESSION_KEY, value);
    return;
  }
  await SecureStore.setItemAsync(SESSION_KEY, value);
}

export async function removeAuthSession() {
  if (Platform.OS === 'web') {
    globalThis.localStorage.removeItem(SESSION_KEY);
    return;
  }
  await SecureStore.deleteItemAsync(SESSION_KEY);
}
