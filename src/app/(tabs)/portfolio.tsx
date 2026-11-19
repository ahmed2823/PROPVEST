import { Link } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { Alert, Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SectionHeading, colors, formatINR } from '../../components/ui';
import { useDemo } from '../../context/DemoContext';
import { properties } from '../../data/properties';

const holdings = [
  { propertyId: 'marina', invested: 5000, value: 5420, income: 342 },
  { propertyId: 'jvc', invested: 4000, value: 4250, income: 280 },
  { propertyId: 'business-bay', invested: 2500, value: 2780, income: 190 },
];

export default function PortfolioScreen() {
  const { investments, additionalInvested } = useDemo();
  const totalInvested = holdings.reduce((sum, item) => sum + item.invested, 0) + additionalInvested;
  const totalValue = holdings.reduce((sum, item) => sum + item.value, 0) + additionalInvested;

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <StatusBar style="dark" />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.heading}>
          <View>
            <Text style={styles.eyebrow}>YOUR INVESTMENTS</Text>
            <Text style={styles.title}>Portfolio</Text>
          </View>
          <Pressable
            style={styles.downloadButton}
            onPress={() => Alert.alert('Portfolio statement', 'Statement downloads will be available in the full app.')}
          >
            <Ionicons name="download-outline" size={18} color={colors.green} />
          </Pressable>
        </View>
        <View style={styles.totalCard}>
          <Text style={styles.totalLabel}>TOTAL PORTFOLIO VALUE</Text>
          <Text style={styles.totalValue}>{formatINR(totalValue)}</Text>
          <View style={styles.growthRow}>
            <View style={styles.growthPill}><Ionicons name="trending-up" size={13} color={colors.green} /><Text style={styles.growthText}>+{formatINR(totalValue - totalInvested)}</Text></View>
            <Text style={styles.growthCaption}>since you started investing</Text>
          </View>
          <View style={styles.breakdown}>
            <View><Text style={styles.breakdownValue}>{formatINR(totalInvested)}</Text><Text style={styles.breakdownLabel}>Invested</Text></View>
            <View style={styles.breakdownLine} />
            <View><Text style={styles.breakdownValue}>{formatINR(812 + investments.reduce((sum, item) => sum + item.amount * 0.036, 0))}</Text><Text style={styles.breakdownLabel}>Rental income</Text></View>
            <View style={styles.breakdownLine} />
            <View><Text style={styles.breakdownValue}>8.4%</Text><Text style={styles.breakdownLabel}>Annual return</Text></View>
          </View>
        </View>

        <View style={styles.allocationCard}>
          <View style={styles.allocationHeader}><Text style={styles.cardTitle}>Your allocation</Text><Text style={styles.period}>BY PROPERTY</Text></View>
          <View style={styles.allocationBar}><View style={[styles.segment, { flex: 44, backgroundColor: '#17634B' }]} /><View style={[styles.segment, { flex: 34, backgroundColor: '#83A990' }]} /><View style={[styles.segment, { flex: 22, backgroundColor: '#D5B985' }]} /></View>
          <View style={styles.legendRow}>
            <View style={styles.legend}><View style={[styles.legendDot, { backgroundColor: '#17634B' }]} /><Text style={styles.legendText}>Marine Heights</Text></View>
            <View style={styles.legend}><View style={[styles.legendDot, { backgroundColor: '#83A990' }]} /><Text style={styles.legendText}>Orchard Residences</Text></View>
            <View style={styles.legend}><View style={[styles.legendDot, { backgroundColor: '#D5B985' }]} /><Text style={styles.legendText}>Canal View</Text></View>
          </View>
        </View>

        <SectionHeading title="Your properties" />
        <View style={styles.holdings}>
          {holdings.map((holding) => {
            const property = properties.find((item) => item.id === holding.propertyId)!;
            return (
              <Link key={property.id} href={`/property/${property.id}`} asChild>
                <Pressable style={styles.holding}>
                  <Image source={{ uri: property.image }} style={styles.holdingImage} />
                  <View style={styles.holdingInfo}>
                    <Text style={styles.holdingName} numberOfLines={1}>{property.name}</Text>
                    <Text style={styles.holdingLocation}>{property.location}</Text>
                    <Text style={styles.holdingShare}>{formatINR(holding.invested)} invested</Text>
                  </View>
                  <View style={styles.holdingRight}>
                    <Text style={styles.holdingValue}>{formatINR(holding.value)}</Text>
                    <Text style={styles.holdingReturn}>+{(((holding.value - holding.invested) / holding.invested) * 100).toFixed(1)}%</Text>
                    <Ionicons name="chevron-forward" size={14} color="#A4ADA7" />
                  </View>
                </Pressable>
              </Link>
            );
          })}
          {investments.map((investment) => {
            const property = properties.find((item) => item.id === investment.propertyId);
            if (!property) return null;
            return (
              <View key={investment.id} style={styles.holding}>
                <Image source={{ uri: property.image }} style={styles.holdingImage} />
                <View style={styles.holdingInfo}>
                  <Text style={styles.holdingName} numberOfLines={1}>{property.name}</Text>
                  <Text style={styles.holdingLocation}>{property.location}</Text>
                  <Text style={styles.holdingShare}>{formatINR(investment.amount)} invested</Text>
                </View>
                <Ionicons name="checkmark-circle" size={19} color={colors.green} />
              </View>
            );
          })}
        </View>

        <View style={styles.incomeCard}>
          <View style={styles.incomeIcon}><Ionicons name="calendar-outline" size={20} color={colors.green} /></View>
          <View style={{ flex: 1 }}><Text style={styles.incomeTitle}>Next rental payout</Text><Text style={styles.incomeSubtitle}>Estimated 28 Nov · Across 3 properties</Text></View>
          <Text style={styles.incomeAmount}>{formatINR(68)}</Text>
        </View>
        <Text style={styles.disclaimer}>Values are illustrative for this demo. Property investments carry risk and projected returns are not guaranteed.</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.canvas },
  content: { paddingHorizontal: 22, paddingTop: 17, paddingBottom: 30, maxWidth: 560, width: '100%', alignSelf: 'center' },
  heading: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  eyebrow: { color: colors.green, fontSize: 10, fontWeight: '700', letterSpacing: 1.4, marginBottom: 6 },
  title: { color: colors.ink, fontSize: 27, fontWeight: '700' },
  downloadButton: { width: 41, height: 41, backgroundColor: '#FFFFFF', borderRadius: 14, borderWidth: 1, borderColor: colors.line, alignItems: 'center', justifyContent: 'center' },
  totalCard: { backgroundColor: colors.deepGreen, borderRadius: 21, padding: 19 },
  totalLabel: { color: '#BED0C6', fontSize: 9, fontWeight: '700', letterSpacing: 1.2 },
  totalValue: { color: '#FFFFFF', fontSize: 28, fontWeight: '700', marginTop: 8, letterSpacing: -0.5 },
  growthRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 9 },
  growthPill: { backgroundColor: '#DDEEE0', borderRadius: 10, flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 7, paddingVertical: 4 },
  growthText: { color: colors.green, fontSize: 10, fontWeight: '700' },
  growthCaption: { color: '#C3D0C8', fontSize: 10 },
  breakdown: { borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.17)', marginTop: 18, paddingTop: 14, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  breakdownValue: { color: '#FFFFFF', fontSize: 11, fontWeight: '700' },
  breakdownLabel: { color: '#B5C9BE', fontSize: 9, marginTop: 4 },
  breakdownLine: { height: 27, width: 1, backgroundColor: 'rgba(255,255,255,0.18)' },
  allocationCard: { backgroundColor: '#FFFFFF', borderRadius: 18, borderWidth: 1, borderColor: colors.line, padding: 16, marginTop: 16 },
  allocationHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  cardTitle: { color: colors.ink, fontSize: 14, fontWeight: '700' },
  period: { color: colors.muted, fontSize: 8, letterSpacing: 1, fontWeight: '700' },
  allocationBar: { flexDirection: 'row', height: 8, borderRadius: 8, overflow: 'hidden', gap: 3, marginTop: 16 },
  segment: { borderRadius: 6 },
  legendRow: { flexDirection: 'row', flexWrap: 'wrap', columnGap: 13, rowGap: 8, marginTop: 13 },
  legend: { flexDirection: 'row', gap: 5, alignItems: 'center' },
  legendDot: { width: 7, height: 7, borderRadius: 4 },
  legendText: { color: colors.muted, fontSize: 9 },
  holdings: { backgroundColor: '#FFFFFF', borderRadius: 18, borderWidth: 1, borderColor: colors.line, overflow: 'hidden' },
  holding: { flexDirection: 'row', alignItems: 'center', padding: 12, borderBottomWidth: 1, borderBottomColor: '#F0F2EF', gap: 10 },
  holdingImage: { width: 53, height: 53, borderRadius: 12, backgroundColor: '#DDE4DE' },
  holdingInfo: { flex: 1 },
  holdingName: { color: colors.ink, fontSize: 12, fontWeight: '700' },
  holdingLocation: { color: colors.muted, fontSize: 9, marginTop: 4 },
  holdingShare: { color: colors.green, fontSize: 9, fontWeight: '600', marginTop: 5 },
  holdingRight: { alignItems: 'flex-end', gap: 3 },
  holdingValue: { color: colors.ink, fontSize: 11, fontWeight: '700' },
  holdingReturn: { color: colors.green, fontSize: 9, fontWeight: '700' },
  incomeCard: { backgroundColor: '#E8F1EB', borderRadius: 16, padding: 13, flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 17 },
  incomeIcon: { width: 40, height: 40, backgroundColor: '#FFFFFF', borderRadius: 13, alignItems: 'center', justifyContent: 'center' },
  incomeTitle: { color: colors.ink, fontSize: 11, fontWeight: '700' },
  incomeSubtitle: { color: colors.muted, fontSize: 9, marginTop: 4 },
  incomeAmount: { color: colors.green, fontSize: 11, fontWeight: '700' },
  disclaimer: { color: colors.muted, fontSize: 9, lineHeight: 14, marginTop: 18, paddingHorizontal: 2 },
});
