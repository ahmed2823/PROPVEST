import { Link, router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { PropertyCard, SectionHeading, colors, formatINR } from '../../components/ui';
import { properties } from '../../data/properties';
import { useDemo } from '../../context/DemoContext';

export default function HomeScreen() {
  const { additionalInvested } = useDemo();

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <StatusBar style="dark" />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.topBar}>
          <View style={styles.brandLockup}>
            <View style={styles.brandMark}>
              <View style={styles.markTop} />
              <View style={styles.markBottom} />
            </View>
            <Text style={styles.brandText}>PROPVEST</Text>
          </View>
          <Pressable style={styles.notification} onPress={() => router.push('/(tabs)/profile')}>
            <Ionicons name="notifications-outline" size={20} color={colors.ink} />
            <View style={styles.notificationDot} />
          </Pressable>
        </View>

        <View style={styles.welcomeRow}>
          <View>
            <Text style={styles.welcome}>Good morning, Ahmed</Text>
            <Text style={styles.subWelcome}>Your next investment starts here.</Text>
          </View>
          <View style={styles.avatar}><Text style={styles.avatarText}>A</Text></View>
        </View>

        <View style={styles.balanceCard}>
          <View style={styles.balanceTop}>
            <Text style={styles.balanceLabel}>TOTAL PORTFOLIO VALUE</Text>
            <Ionicons name="ellipsis-horizontal" size={21} color="#B5C9BE" />
          </View>
          <Text style={styles.balanceAmount}>{formatINR(12450 + additionalInvested)}</Text>
          <View style={styles.balanceFooter}>
            <View style={styles.returnChip}>
              <Ionicons name="trending-up" size={13} color="#BDE2C5" />
              <Text style={styles.returnText}>8.4%</Text>
            </View>
            <Text style={styles.balanceFootnote}>+ {formatINR(965.4)} this year</Text>
            <View style={styles.chartBars}>
              {[10, 15, 12, 21, 17, 26, 22, 32, 27, 38, 34, 45].map((height, index) => (
                <View key={index} style={[styles.chartBar, { height, opacity: index < 8 ? 0.38 : 0.92 }]} />
              ))}
            </View>
          </View>
          <View style={styles.balanceBottomLine} />
          <View style={styles.balanceMeta}>
            <View><Text style={styles.metaValue}>3</Text><Text style={styles.metaLabel}>Properties</Text></View>
            <View style={styles.metaDivider} />
            <View><Text style={styles.metaValue}>{formatINR(10000)}</Text><Text style={styles.metaLabel}>Starting from</Text></View>
            <View style={styles.metaDivider} />
            <View><Text style={styles.metaValue}>Monthly</Text><Text style={styles.metaLabel}>Rental income</Text></View>
          </View>
        </View>

        <View style={styles.promoCard}>
          <View style={styles.promoCopy}>
            <View style={styles.promoTag}><Text style={styles.promoTagText}>REAL ESTATE, REIMAGINED</Text></View>
            <Text style={styles.promoTitle}>Own a piece of{'\n'}India’s finest.</Text>
            <Text style={styles.promoBody}>Start building your property portfolio from {formatINR(10000)}.</Text>
            <Link href="/(tabs)/discover" asChild>
              <Pressable style={styles.promoButton}>
                <Text style={styles.promoButtonText}>Explore properties</Text>
                <Ionicons name="arrow-forward" size={15} color={colors.deepGreen} />
              </Pressable>
            </Link>
          </View>
          <View style={styles.promoGraphic}>
            <View style={styles.graphicSun} />
            <View style={styles.graphicBuildingBack} />
            <View style={styles.graphicBuildingFront}>
              <View style={styles.buildingWindows}>
                {Array.from({ length: 12 }, (_, i) => <View key={i} style={styles.window} />)}
              </View>
            </View>
          </View>
        </View>

        <SectionHeading title="Featured properties" action="See all" onAction={() => router.push('/(tabs)/discover')} />
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.featuredRow}>
          {properties.slice(0, 3).map((item) => (
            <View key={item.id} style={styles.featuredCard}><PropertyCard item={item} /></View>
          ))}
        </ScrollView>

        <View style={styles.howCard}>
          <View style={styles.howIcon}><Ionicons name="sparkles-outline" size={21} color={colors.green} /></View>
          <View style={{ flex: 1 }}>
            <Text style={styles.howTitle}>Property investing, made simple</Text>
            <Text style={styles.howBody}>Own a fraction. Earn rental income. Grow with India.</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color={colors.muted} />
        </View>
        <View style={styles.disclaimer}>
          <Ionicons name="shield-checkmark-outline" size={15} color={colors.muted} />
          <Text style={styles.disclaimerText}>A smarter way to invest in real estate. Returns are indicative and not guaranteed.</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.canvas },
  content: { paddingHorizontal: 22, paddingTop: 8, paddingBottom: 26, maxWidth: 560, width: '100%', alignSelf: 'center' },
  topBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 22 },
  brandLockup: { flexDirection: 'row', alignItems: 'center', gap: 9 },
  brandMark: { width: 24, height: 24, justifyContent: 'center', gap: 3, transform: [{ rotate: '-30deg' }] },
  markTop: { height: 9, borderTopWidth: 2, borderLeftWidth: 2, borderRightWidth: 2, borderColor: colors.green },
  markBottom: { height: 9, borderBottomWidth: 2, borderLeftWidth: 2, borderRightWidth: 2, borderColor: colors.green },
  brandText: { color: colors.ink, fontSize: 12, fontWeight: '800', letterSpacing: 1.3 },
  brandLight: { fontWeight: '500', color: '#748078' },
  notification: { width: 40, height: 40, borderRadius: 14, backgroundColor: colors.white, alignItems: 'center', justifyContent: 'center' },
  notificationDot: { position: 'absolute', right: 10, top: 9, width: 6, height: 6, borderRadius: 4, backgroundColor: '#D57B61' },
  welcomeRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 19 },
  welcome: { color: colors.ink, fontSize: 21, fontWeight: '700', letterSpacing: -0.4 },
  subWelcome: { color: colors.muted, fontSize: 12, marginTop: 5 },
  avatar: { width: 42, height: 42, borderRadius: 15, backgroundColor: '#E5EBE5', justifyContent: 'center', alignItems: 'center' },
  avatarText: { color: colors.green, fontSize: 16, fontWeight: '700' },
  balanceCard: { backgroundColor: colors.deepGreen, borderRadius: 22, padding: 20, overflow: 'hidden' },
  balanceTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  balanceLabel: { color: '#BCD0C5', fontSize: 9, fontWeight: '700', letterSpacing: 1.3 },
  balanceAmount: { color: '#FFFFFF', fontSize: 29, fontWeight: '700', letterSpacing: -0.7, marginTop: 8 },
  balanceFooter: { flexDirection: 'row', alignItems: 'center', marginTop: 8 },
  returnChip: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(183,225,190,0.14)', borderRadius: 12, paddingVertical: 4, paddingHorizontal: 7, gap: 3 },
  returnText: { color: '#C4E4C9', fontSize: 10, fontWeight: '700' },
  balanceFootnote: { color: '#BCD0C5', fontSize: 10, marginLeft: 8 },
  chartBars: { position: 'absolute', right: 0, bottom: 0, height: 45, flexDirection: 'row', alignItems: 'flex-end', gap: 3 },
  chartBar: { width: 4, borderTopLeftRadius: 3, borderTopRightRadius: 3, backgroundColor: '#A8D9B3' },
  balanceBottomLine: { height: 1, backgroundColor: 'rgba(255,255,255,0.16)', marginTop: 19, marginBottom: 14 },
  balanceMeta: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  metaValue: { color: '#FFFFFF', fontSize: 12, fontWeight: '700' },
  metaLabel: { color: '#AFC4B8', fontSize: 9, marginTop: 4 },
  metaDivider: { width: 1, height: 27, backgroundColor: 'rgba(255,255,255,0.18)' },
  promoCard: { backgroundColor: '#E9EFE8', borderRadius: 22, marginTop: 16, padding: 19, minHeight: 204, overflow: 'hidden' },
  promoCopy: { width: '65%', zIndex: 2 },
  promoTag: { backgroundColor: '#D8E5DB', borderRadius: 12, paddingHorizontal: 8, paddingVertical: 5, alignSelf: 'flex-start' },
  promoTagText: { color: colors.green, fontSize: 8, letterSpacing: 0.8, fontWeight: '800' },
  promoTitle: { color: colors.ink, fontSize: 23, lineHeight: 27, fontWeight: '700', marginTop: 12, letterSpacing: -0.4 },
  promoBody: { color: '#64736A', fontSize: 11, lineHeight: 16, marginTop: 7, maxWidth: 210 },
  promoButton: { backgroundColor: '#FFFFFF', borderRadius: 12, flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-start', paddingHorizontal: 11, paddingVertical: 9, gap: 8, marginTop: 12 },
  promoButtonText: { color: colors.deepGreen, fontSize: 10, fontWeight: '700' },
  promoGraphic: { position: 'absolute', right: -5, bottom: 0, width: 136, height: 182 },
  graphicSun: { position: 'absolute', width: 65, height: 65, borderRadius: 40, right: 22, top: 16, backgroundColor: '#D7C6A7' },
  graphicBuildingBack: { position: 'absolute', right: 2, bottom: 0, height: 125, width: 62, backgroundColor: '#A7B9AD', borderTopLeftRadius: 26 },
  graphicBuildingFront: { position: 'absolute', right: 52, bottom: 0, height: 148, width: 63, backgroundColor: '#6E9180', borderTopLeftRadius: 28, paddingTop: 42, paddingHorizontal: 12 },
  buildingWindows: { flexDirection: 'row', flexWrap: 'wrap', gap: 7 },
  window: { height: 12, width: 9, backgroundColor: '#D4DDD3', opacity: 0.75, borderRadius: 1 },
  featuredRow: { gap: 12, paddingBottom: 4 },
  featuredCard: { width: 248 },
  howCard: { backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: colors.line, borderRadius: 17, marginTop: 22, padding: 15, flexDirection: 'row', alignItems: 'center', gap: 12 },
  howIcon: { width: 42, height: 42, backgroundColor: colors.paleGreen, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  howTitle: { color: colors.ink, fontSize: 12, fontWeight: '700' },
  howBody: { color: colors.muted, fontSize: 10, marginTop: 5 },
  disclaimer: { marginTop: 20, flexDirection: 'row', gap: 8, alignItems: 'flex-start', paddingHorizontal: 3 },
  disclaimerText: { color: colors.muted, fontSize: 9, lineHeight: 14, flex: 1 },
});
