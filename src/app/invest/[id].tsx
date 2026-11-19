import { useState } from 'react';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, formatINR } from '../../components/ui';
import { useDemo } from '../../context/DemoContext';
import { properties } from '../../data/properties';

export default function InvestScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const property = properties.find((item) => item.id === id);
  const { recordInvestment } = useDemo();
const [amount, setAmount] = useState('10000');
  const [error, setError] = useState('');
  const [complete, setComplete] = useState(false);
  const amountInr = Number(amount.replace(/,/g, ''));
  if (!property) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <Pressable onPress={() => router.back()} style={styles.backButton}><Ionicons name="arrow-back" size={20} color={colors.ink} /></Pressable>
        <View style={styles.center}><Text style={styles.title}>Property not found</Text></View>
      </SafeAreaView>
    );
  }

 const MIN_INVESTMENT_INR = 10000;

const submitInvestment = () => {
  if (!Number.isFinite(amountInr) || amountInr < MIN_INVESTMENT_INR) {
    setError('The minimum investment is ₹10,000.');
    return;
  }

  if (amountInr > 1000000) {
    setError(`For this demo, investments are capped at ${formatINR(1000000)}.`);
    return;
  }

  setError('');
  recordInvestment(property.id, amountInr);
  setComplete(true);
};

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <StatusBar style="dark" />
      <View style={styles.topBar}>
        <Pressable onPress={() => router.back()} style={styles.backButton}><Ionicons name="arrow-back" size={20} color={colors.ink} /></Pressable>
        <Text style={styles.navTitle}>{complete ? 'Investment confirmed' : 'Review investment'}</Text>
        <View style={styles.headerSpace} />
      </View>
      {complete ? (
        <View style={styles.successScreen}>
          <View style={styles.successIcon}><Ionicons name="checkmark" size={35} color="#FFFFFF" /></View>
          <Text style={styles.successEyebrow}>YOU’RE IN</Text>
          <Text style={styles.successTitle}>A little piece of{'\n'}India is yours.</Text>
          <Text style={styles.successCopy}>Your demo investment of {formatINR(amountInr)} in {property.name} has been added to your portfolio.</Text>
          <View style={styles.receipt}>
            <View style={styles.receiptRow}><Text style={styles.receiptLabel}>PROPERTY</Text><Text style={styles.receiptValue}>{property.name}</Text></View>
            <View style={styles.receiptRow}><Text style={styles.receiptLabel}>INVESTMENT</Text><Text style={styles.receiptValue}>{formatINR(amountInr)}</Text></View>
            <View style={styles.receiptRow}><Text style={styles.receiptLabel}>STATUS</Text><Text style={styles.receiptStatus}>Confirmed · Demo</Text></View>
          </View>
          <Pressable style={styles.primaryButton} onPress={() => router.replace('/(tabs)/portfolio')}>
            <Text style={styles.primaryButtonText}>View my portfolio</Text><Ionicons name="arrow-forward" size={16} color="#FFFFFF" />
          </Pressable>
          <Pressable style={styles.secondaryButton} onPress={() => router.replace('/(tabs)')}>
            <Text style={styles.secondaryButtonText}>Back to home</Text>
          </Pressable>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <View style={styles.propertySummary}>
            <View style={styles.propertyIcon}><Ionicons name="business-outline" size={20} color={colors.green} /></View>
            <View style={{ flex: 1 }}><Text style={styles.propertyName}>{property.name}</Text><Text style={styles.propertyLocation}>{property.location}</Text></View>
            <Text style={styles.yield}>{property.yield}%<Text style={styles.yieldLabel}> yield</Text></Text>
          </View>
          <Text style={styles.prompt}>How much would you like to invest?</Text>
          <Text style={styles.promptCopy}>Choose an amount to see your estimated ownership.</Text>
          <View style={styles.amountBox}>
            <Text style={styles.currency}>₹</Text>
            <TextInput
              value={amount}
              onChangeText={(text) => { setAmount(text.replace(/[^\d]/g, '')); setError(''); }}
              keyboardType="number-pad"
              placeholder={Math.round(property.minimum).toLocaleString('en-IN')}
              placeholderTextColor="#AAB3AD"
              style={styles.amountInput}
              accessibilityLabel="Investment amount in Indian rupees"
            />
            <Ionicons name="create-outline" size={17} color="#AAB3AD" />
          </View>
          
          {error ? <View style={styles.errorRow}><Ionicons name="alert-circle-outline" size={16} color="#B8584F" /><Text style={styles.errorText}>{error}</Text></View> : null}
          <View style={styles.ownershipCard}>
            <View style={styles.ownershipRow}><Text style={styles.ownershipLabel}>Estimated ownership</Text><Text style={styles.ownershipValue}>{amountInr > 0 ? `${((amountInr / property.price) * 100).toFixed(2)}%` : '—'}</Text></View>
            <View style={styles.ownershipDivider} />
            <View style={styles.ownershipRow}><Text style={styles.ownershipLabel}>Projected annual rent</Text><Text style={styles.ownershipValue}>{amountInr > 0 ? formatINR((amountInr * property.yield) / 100) : '—'}</Text></View>
            <View style={styles.ownershipRow}><Text style={styles.ownershipLabel}>Projected monthly rent</Text><Text style={styles.ownershipValue}>{amountInr > 0 ? formatINR((amountInr * property.yield) / 1200) : '—'}</Text></View>
          </View>
          <View style={styles.notice}><Ionicons name="information-circle-outline" size={17} color={colors.green} /><Text style={styles.noticeText}>This is a demo. No payment will be taken. Your selection will appear in the in-app portfolio preview.</Text></View>
          <Text style={styles.legal}>Rental projections are illustrative, not guaranteed. Property investments involve risk, including loss of capital.</Text>
          <Pressable style={styles.primaryButton} onPress={submitInvestment}>
            <Text style={styles.primaryButtonText}>Confirm demo investment</Text><Ionicons name="arrow-forward" size={16} color="#FFFFFF" />
          </Pressable>
          <Text style={styles.secureText}><Ionicons name="lock-closed-outline" size={11} color={colors.muted} /> No real transaction will be made</Text>
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.canvas },
  topBar: { height: 52, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, justifyContent: 'space-between' },
  backButton: { width: 36, height: 36, borderRadius: 12, backgroundColor: '#FFFFFF', alignItems: 'center', justifyContent: 'center' },
  navTitle: { color: colors.ink, fontSize: 13, fontWeight: '700' },
  headerSpace: { width: 36 },
  content: { paddingHorizontal: 22, paddingTop: 14, paddingBottom: 30, maxWidth: 560, width: '100%', alignSelf: 'center' },
  propertySummary: { backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: colors.line, borderRadius: 16, padding: 13, flexDirection: 'row', alignItems: 'center', gap: 10 },
  propertyIcon: { width: 41, height: 41, backgroundColor: colors.paleGreen, borderRadius: 13, alignItems: 'center', justifyContent: 'center' },
  propertyName: { color: colors.ink, fontSize: 12, fontWeight: '700' },
  propertyLocation: { color: colors.muted, fontSize: 9, marginTop: 4 },
  yield: { color: colors.green, fontSize: 13, fontWeight: '700' },
  yieldLabel: { color: colors.muted, fontSize: 8, fontWeight: '500' },
  prompt: { color: colors.ink, fontSize: 20, fontWeight: '700', marginTop: 25, letterSpacing: -0.3 },
  promptCopy: { color: colors.muted, fontSize: 11, marginTop: 5 },
  amountBox: { height: 72, backgroundColor: '#FFFFFF', borderWidth: 1.5, borderColor: '#B9CCBE', borderRadius: 17, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 17, marginTop: 18, gap: 9 },
  currency: { color: colors.muted, fontSize: 13, fontWeight: '600' },
  amountInput: { flex: 1, color: colors.ink, fontSize: 25, fontWeight: '700', paddingVertical: 10 },
  quickAmounts: { flexDirection: 'row', gap: 8, marginTop: 11 },
  quickButton: { backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: colors.line, paddingVertical: 9, paddingHorizontal: 12, borderRadius: 11 },
  quickSelected: { backgroundColor: colors.paleGreen, borderColor: '#B8CCBE' },
  quickText: { color: '#69766F', fontSize: 10, fontWeight: '600' },
  quickTextSelected: { color: colors.green },
  errorRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 10 },
  errorText: { color: '#B8584F', fontSize: 10 },
  ownershipCard: { backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: colors.line, borderRadius: 17, padding: 15, marginTop: 18 },
  ownershipRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 7 },
  ownershipLabel: { color: colors.muted, fontSize: 10 },
  ownershipValue: { color: colors.ink, fontSize: 11, fontWeight: '700' },
  ownershipDivider: { height: 1, backgroundColor: colors.line, marginVertical: 3 },
  notice: { backgroundColor: '#E8F1EB', borderRadius: 13, padding: 12, flexDirection: 'row', alignItems: 'flex-start', gap: 8, marginTop: 14 },
  noticeText: { color: '#617268', fontSize: 9, lineHeight: 14, flex: 1 },
  legal: { color: colors.muted, fontSize: 8, lineHeight: 13, marginTop: 13 },
  primaryButton: { height: 49, borderRadius: 15, backgroundColor: colors.deepGreen, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, marginTop: 18 },
  primaryButtonText: { color: '#FFFFFF', fontSize: 12, fontWeight: '700' },
  secureText: { color: colors.muted, fontSize: 9, textAlign: 'center', marginTop: 11 },
  successScreen: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 28, paddingBottom: 30 },
  successIcon: { width: 66, height: 66, borderRadius: 23, backgroundColor: colors.green, alignItems: 'center', justifyContent: 'center' },
  successEyebrow: { color: colors.green, fontSize: 9, fontWeight: '800', letterSpacing: 1.7, marginTop: 19 },
  successTitle: { color: colors.ink, fontSize: 27, lineHeight: 32, textAlign: 'center', fontWeight: '700', letterSpacing: -0.4, marginTop: 8 },
  successCopy: { color: colors.muted, fontSize: 11, lineHeight: 17, textAlign: 'center', marginTop: 10, maxWidth: 310 },
  receipt: { backgroundColor: '#FFFFFF', width: '100%', borderWidth: 1, borderColor: colors.line, borderRadius: 17, paddingHorizontal: 14, paddingVertical: 5, marginTop: 22 },
  receiptRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#F0F2EF' },
  receiptLabel: { color: colors.muted, fontSize: 8, fontWeight: '700', letterSpacing: 0.6 },
  receiptValue: { color: colors.ink, fontSize: 10, fontWeight: '700' },
  receiptStatus: { color: colors.green, fontSize: 10, fontWeight: '700' },
  secondaryButton: { paddingVertical: 13 },
  secondaryButtonText: { color: colors.green, fontSize: 11, fontWeight: '700' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  title: { color: colors.ink, fontSize: 18, fontWeight: '700' },
});
