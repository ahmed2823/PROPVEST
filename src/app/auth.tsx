import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../components/ui';
import { AuthApiError } from '../lib/authApi';
import { useAuth } from '../context/AuthContext';

export default function AuthScreen() {
  const { mode } = useLocalSearchParams<{ mode?: string }>();
  const [isSignup, setIsSignup] = useState(mode !== 'signin');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { signIn, signUp } = useAuth();

  const submit = async () => {
    setError('');
    setIsSubmitting(true);
    try {
      if (isSignup) {
        await signUp(name.trim(), email.trim(), password);
      } else {
        await signIn(email.trim(), password);
      }
      router.replace('/(tabs)/profile');
    } catch (submitError) {
      setError(
        submitError instanceof AuthApiError
          ? submitError.message
          : 'Could not connect to PropVest. Check that the API is running and try again.',
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const switchMode = () => {
    setIsSignup((current) => !current);
    setError('');
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <StatusBar style="dark" />
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <Pressable onPress={() => router.back()} style={styles.backButton} accessibilityLabel="Go back">
          <Ionicons name="arrow-back" size={20} color={colors.ink} />
        </Pressable>
        <View style={styles.brandMark}><Ionicons name="business-outline" size={24} color={colors.green} /></View>
        <Text style={styles.eyebrow}>PROPVEST · INDIA</Text>
        <Text style={styles.title}>{isSignup ? 'Create your account' : 'Welcome back'}</Text>
        <Text style={styles.subtitle}>
          {isSignup ? 'Sign up to start building your property portfolio.' : 'Sign in to continue to your portfolio.'}
        </Text>

        <View style={styles.form}>
          {isSignup ? (
            <View style={styles.field}>
              <Text style={styles.label}>FULL NAME</Text>
              <TextInput
                autoCapitalize="words"
                autoComplete="name"
                value={name}
                onChangeText={setName}
                placeholder="Your name"
                placeholderTextColor="#9AA49E"
                style={styles.input}
                returnKeyType="next"
                accessibilityLabel="Full name"
              />
            </View>
          ) : null}
          <View style={styles.field}>
            <Text style={styles.label}>EMAIL ADDRESS</Text>
            <TextInput
              autoCapitalize="none"
              autoComplete="email"
              keyboardType="email-address"
              value={email}
              onChangeText={setEmail}
              placeholder="you@example.in"
              placeholderTextColor="#9AA49E"
              style={styles.input}
              returnKeyType="next"
              accessibilityLabel="Email address"
            />
          </View>
          <View style={styles.field}>
            <Text style={styles.label}>PASSWORD</Text>
            <TextInput
              autoCapitalize="none"
              autoComplete={isSignup ? 'new-password' : 'current-password'}
              secureTextEntry
              value={password}
              onChangeText={setPassword}
              placeholder="At least 8 characters"
              placeholderTextColor="#9AA49E"
              style={styles.input}
              returnKeyType="go"
              onSubmitEditing={() => { void submit(); }}
              accessibilityLabel="Password"
            />
          </View>

          {error ? (
            <View style={styles.errorBox}>
              <Ionicons name="alert-circle-outline" size={17} color="#A3453D" />
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : null}

          <Pressable
            style={[styles.submitButton, isSubmitting && styles.disabledButton]}
            onPress={() => { void submit(); }}
            disabled={isSubmitting}
          >
            <Text style={styles.submitText}>
              {isSubmitting ? 'Please wait…' : isSignup ? 'Create account' : 'Sign in'}
            </Text>
            {!isSubmitting ? <Ionicons name="arrow-forward" size={17} color="#FFFFFF" /> : null}
          </Pressable>
          <Text style={styles.privacyNote}>Your password is encrypted and never stored in plain text.</Text>
        </View>

        <View style={styles.switchRow}>
          <Text style={styles.switchCopy}>{isSignup ? 'Already have an account?' : 'New to PropVest?'}</Text>
          <Pressable onPress={switchMode} hitSlop={8}>
            <Text style={styles.switchAction}>{isSignup ? 'Sign in' : 'Create account'}</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.canvas },
  content: { flexGrow: 1, paddingHorizontal: 24, paddingTop: 12, paddingBottom: 28, maxWidth: 560, width: '100%', alignSelf: 'center' },
  backButton: { width: 40, height: 40, borderRadius: 14, backgroundColor: colors.white, alignItems: 'center', justifyContent: 'center' },
  brandMark: { width: 50, height: 50, borderRadius: 17, backgroundColor: colors.paleGreen, alignItems: 'center', justifyContent: 'center', marginTop: 36 },
  eyebrow: { color: colors.green, fontSize: 9, fontWeight: '800', letterSpacing: 1.5, marginTop: 22 },
  title: { color: colors.ink, fontSize: 28, fontWeight: '700', letterSpacing: -0.5, marginTop: 8 },
  subtitle: { color: colors.muted, fontSize: 12, lineHeight: 19, marginTop: 7 },
  form: { gap: 16, marginTop: 30 },
  field: { gap: 7 },
  label: { color: colors.muted, fontSize: 9, fontWeight: '700', letterSpacing: 0.8 },
  input: { height: 51, borderWidth: 1, borderColor: colors.line, borderRadius: 14, backgroundColor: colors.white, paddingHorizontal: 14, color: colors.ink, fontSize: 13 },
  errorBox: { flexDirection: 'row', alignItems: 'flex-start', gap: 8, backgroundColor: '#FCEDEA', borderRadius: 12, padding: 11 },
  errorText: { flex: 1, color: '#A3453D', fontSize: 11, lineHeight: 16 },
  submitButton: { height: 51, borderRadius: 15, backgroundColor: colors.deepGreen, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 9, marginTop: 3 },
  disabledButton: { opacity: 0.65 },
  submitText: { color: colors.white, fontSize: 12, fontWeight: '700' },
  privacyNote: { color: colors.muted, fontSize: 9, textAlign: 'center', lineHeight: 14 },
  switchRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 5, marginTop: 27 },
  switchCopy: { color: colors.muted, fontSize: 11 },
  switchAction: { color: colors.green, fontSize: 11, fontWeight: '700' },
});
