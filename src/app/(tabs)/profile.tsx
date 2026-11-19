import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { router } from 'expo-router';
import { useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../../components/ui';
import { useAuth } from '../../context/AuthContext';

const settings = [
  { icon: 'person-outline', title: 'Personal information', subtitle: 'Your details and contact info' },
  { icon: 'shield-checkmark-outline', title: 'Verification', subtitle: 'Complete identity checks before investing', trailing: 'Pending' },
  { icon: 'card-outline', title: 'Payment methods', subtitle: 'Manage your cards and bank accounts' },
  { icon: 'document-text-outline', title: 'Documents', subtitle: 'Statements, agreements and reports' },
  { icon: 'help-circle-outline', title: 'Help & support', subtitle: 'We’re here to help' },
];

export default function ProfileScreen() {
  const { user, isLoading, sessionError, signOut } = useAuth();
  const [signOutError, setSignOutError] = useState('');
  const memberSince = user
    ? new Date(user.createdAt).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })
    : '';

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <StatusBar style="dark" />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Profile</Text>
        <View style={styles.profileCard}>
          <View style={styles.avatar}><Text style={styles.avatarText}>{user?.name.charAt(0).toUpperCase() ?? '?'}</Text></View>
          <View style={{ flex: 1 }}>
            <Text style={styles.name}>{isLoading ? 'Loading account…' : user?.name ?? 'Welcome to PropVest'}</Text>
            <Text style={styles.email}>{user?.email ?? (isLoading ? ' ' : 'Sign in or create an account to continue')}</Text>
            {user ? (
              <View style={styles.verified}><Ionicons name="checkmark-circle" size={13} color={colors.green} /><Text style={styles.verifiedText}>Account created</Text></View>
            ) : null}
          </View>
          {user ? (
            <Pressable onPress={() => Alert.alert('Edit profile', 'Profile editing is not available yet.')} accessibilityLabel="Edit profile">
              <Ionicons name="create-outline" size={19} color={colors.green} />
            </Pressable>
          ) : null}
        </View>

        {sessionError ? <Text style={styles.sessionError}>{sessionError}</Text> : null}

        {!isLoading && !user ? (
          <View style={styles.authCard}>
            <Text style={styles.authTitle}>Your property journey starts here</Text>
            <Text style={styles.authCopy}>Sign in to your account or create one to get started.</Text>
            <Pressable style={styles.primaryAuthButton} onPress={() => router.push('/auth?mode=signin')}>
              <Text style={styles.primaryAuthText}>Sign in</Text>
              <Ionicons name="arrow-forward" size={16} color="#FFFFFF" />
            </Pressable>
            <Pressable style={styles.secondaryAuthButton} onPress={() => router.push('/auth?mode=signup')}>
              <Text style={styles.secondaryAuthText}>Create account</Text>
            </Pressable>
          </View>
        ) : null}

        {user ? <View style={styles.accountCard}>
          <View style={styles.accountHeader}>
            <View style={styles.accountIcon}><Ionicons name="wallet-outline" size={19} color={colors.green} /></View>
            <View style={{ flex: 1 }}><Text style={styles.accountTitle}>Your account</Text><Text style={styles.accountCaption}>Investor account · India</Text></View>
            <View style={styles.accountStatus}><View style={styles.statusDot} /><Text style={styles.statusText}>ACTIVE</Text></View>
          </View>
          <View style={styles.accountDivider} />
          <View style={styles.accountNumbers}>
            <View><Text style={styles.numberLabel}>ACCOUNT ID</Text><Text style={styles.numberValue}>PB-{user.id.slice(-8).toUpperCase()}</Text></View>
            <View><Text style={styles.numberLabel}>MEMBER SINCE</Text><Text style={styles.numberValue}>{memberSince}</Text></View>
          </View>
        </View> : null}

        <Text style={styles.section}>ACCOUNT & PREFERENCES</Text>
        <View style={styles.menu}>
          {settings.map((item, index) => (
            <Pressable
              key={item.title}
              style={[styles.menuItem, index === settings.length - 1 && styles.lastMenuItem]}
              onPress={() => Alert.alert(item.title, `${item.title} details will be available in the complete app.`)}
            >
              <View style={styles.menuIcon}><Ionicons name={item.icon as keyof typeof Ionicons.glyphMap} size={19} color={colors.green} /></View>
              <View style={{ flex: 1 }}><Text style={styles.menuTitle}>{item.title}</Text><Text style={styles.menuSubtitle}>{item.subtitle}</Text></View>
              {item.trailing ? <Text style={styles.verifiedLabel}>{item.trailing}</Text> : null}
              <Ionicons name="chevron-forward" size={16} color="#AAB3AD" />
            </Pressable>
          ))}
        </View>

        <View style={styles.helpBanner}>
          <View style={styles.helpIcon}><Ionicons name="chatbubble-ellipses-outline" size={20} color={colors.green} /></View>
          <View style={{ flex: 1 }}><Text style={styles.helpTitle}>Need a hand?</Text><Text style={styles.helpCopy}>Our team is one message away.</Text></View>
          <Pressable onPress={() => Alert.alert('Contact support', 'Our investor care team is available from 9am–6pm, Monday to Friday.')}>
            <Ionicons name="arrow-forward" size={18} color={colors.green} />
          </Pressable>
        </View>
        {signOutError ? <Text style={styles.sessionError}>{signOutError}</Text> : null}
        {user ? (
          <Pressable
            style={styles.signOut}
            onPress={() => Alert.alert('Sign out', 'Sign out of your PropVest account?', [
              { text: 'Cancel', style: 'cancel' },
              {
                text: 'Sign out',
                style: 'destructive',
                onPress: () => {
                  void signOut().catch((error: unknown) => {
                    setSignOutError(error instanceof Error ? error.message : 'Could not sign out. Please try again.');
                  });
                },
              },
            ])}
          >
            <Ionicons name="log-out-outline" size={17} color="#A65E52" /><Text style={styles.signOutText}>Sign out</Text>
          </Pressable>
        ) : null}
        <Text style={styles.version}>PROPVEST · VERSION 1.0.0</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.canvas },
  content: { paddingHorizontal: 22, paddingTop: 18, paddingBottom: 30, maxWidth: 560, width: '100%', alignSelf: 'center' },
  title: { color: colors.ink, fontSize: 27, fontWeight: '700', marginBottom: 20 },
  profileCard: { flexDirection: 'row', alignItems: 'center', gap: 13, backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: colors.line, borderRadius: 18, padding: 15 },
  avatar: { width: 54, height: 54, borderRadius: 19, backgroundColor: '#E4ECE5', alignItems: 'center', justifyContent: 'center' },
  avatarText: { color: colors.green, fontSize: 20, fontWeight: '700' },
  name: { color: colors.ink, fontSize: 14, fontWeight: '700' },
  email: { color: colors.muted, fontSize: 10, marginTop: 4 },
  verified: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 6 },
  verifiedText: { color: colors.green, fontSize: 9, fontWeight: '600' },
  sessionError: { color: '#A3453D', fontSize: 10, lineHeight: 15, marginTop: 12 },
  authCard: { backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: colors.line, borderRadius: 17, padding: 16, marginTop: 15 },
  authTitle: { color: colors.ink, fontSize: 13, fontWeight: '700' },
  authCopy: { color: colors.muted, fontSize: 10, lineHeight: 15, marginTop: 6 },
  primaryAuthButton: { height: 44, borderRadius: 13, backgroundColor: colors.deepGreen, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 14 },
  primaryAuthText: { color: '#FFFFFF', fontSize: 11, fontWeight: '700' },
  secondaryAuthButton: { alignItems: 'center', paddingVertical: 12 },
  secondaryAuthText: { color: colors.green, fontSize: 11, fontWeight: '700' },
  accountCard: { backgroundColor: '#E8F1EB', borderRadius: 17, padding: 16, marginTop: 15 },
  accountHeader: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  accountIcon: { width: 39, height: 39, borderRadius: 13, backgroundColor: '#FFFFFF', justifyContent: 'center', alignItems: 'center' },
  accountTitle: { color: colors.ink, fontSize: 12, fontWeight: '700' },
  accountCaption: { color: colors.muted, fontSize: 9, marginTop: 4 },
  accountStatus: { flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: '#D8E9DB', borderRadius: 10, paddingHorizontal: 8, paddingVertical: 5 },
  statusDot: { width: 5, height: 5, borderRadius: 3, backgroundColor: colors.green },
  statusText: { color: colors.green, fontSize: 8, fontWeight: '800', letterSpacing: 0.6 },
  accountDivider: { height: 1, backgroundColor: '#D8E2DA', marginVertical: 13 },
  accountNumbers: { flexDirection: 'row', gap: 40 },
  numberLabel: { color: colors.muted, fontSize: 8, letterSpacing: 0.7, fontWeight: '700' },
  numberValue: { color: colors.ink, fontSize: 10, fontWeight: '600', marginTop: 5 },
  section: { color: colors.muted, fontSize: 9, fontWeight: '700', letterSpacing: 1.1, marginTop: 25, marginBottom: 10 },
  menu: { backgroundColor: '#FFFFFF', borderRadius: 17, borderWidth: 1, borderColor: colors.line, paddingHorizontal: 13 },
  menuItem: { flexDirection: 'row', alignItems: 'center', gap: 10, minHeight: 66, borderBottomWidth: 1, borderBottomColor: '#F0F2EF' },
  lastMenuItem: { borderBottomWidth: 0 },
  menuIcon: { width: 35, height: 35, borderRadius: 12, backgroundColor: colors.paleGreen, alignItems: 'center', justifyContent: 'center' },
  menuTitle: { color: colors.ink, fontSize: 11, fontWeight: '700' },
  menuSubtitle: { color: colors.muted, fontSize: 9, marginTop: 4 },
  verifiedLabel: { color: colors.green, fontSize: 9, fontWeight: '700', marginRight: 2 },
  helpBanner: { backgroundColor: '#FFFFFF', borderRadius: 16, borderWidth: 1, borderColor: colors.line, flexDirection: 'row', alignItems: 'center', gap: 11, padding: 14, marginTop: 16 },
  helpIcon: { width: 40, height: 40, borderRadius: 13, backgroundColor: colors.paleGreen, alignItems: 'center', justifyContent: 'center' },
  helpTitle: { color: colors.ink, fontSize: 11, fontWeight: '700' },
  helpCopy: { color: colors.muted, fontSize: 9, marginTop: 4 },
  signOut: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 7, marginTop: 22, paddingVertical: 10 },
  signOutText: { color: '#A65E52', fontSize: 11, fontWeight: '700' },
  version: { color: '#AAB3AD', fontSize: 8, textAlign: 'center', letterSpacing: 0.8, marginTop: 12 },
});
