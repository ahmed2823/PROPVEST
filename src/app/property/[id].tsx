import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, formatINR } from '../../components/ui';
import { properties } from '../../data/properties';

export default function PropertyDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const property = properties.find((item) => item.id === id);
  const [isSaved, setIsSaved] = useState(false);

  if (!property) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <Pressable onPress={() => router.back()} style={styles.backLink}><Ionicons name="arrow-back" size={18} color={colors.ink} /><Text style={styles.backText}>Go back</Text></Pressable>
        <View style={styles.notFound}><Text style={styles.notFoundTitle}>Property not found</Text><Text style={styles.notFoundCopy}>This listing may no longer be available.</Text></View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <StatusBar style="dark" />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <View style={styles.imageWrap}>
          <Image source={{ uri: property.image }} style={styles.heroImage} />
          <Pressable onPress={() => router.back()} style={styles.floatingButton}><Ionicons name="arrow-back" size={19} color={colors.ink} /></Pressable>
          <Pressable
            style={[styles.floatingButton, styles.heart]}
            onPress={() => setIsSaved((current) => !current)}
            accessibilityLabel={isSaved ? 'Remove from saved properties' : 'Save property'}
          >
            <Ionicons name={isSaved ? 'heart' : 'heart-outline'} size={19} color={isSaved ? '#B65D58' : colors.ink} />
          </Pressable>
          <View style={styles.imageCount}><View style={styles.activeDot} /><View style={styles.inactiveDot} /><View style={styles.inactiveDot} /><Text style={styles.imageCountText}>1 / 8</Text></View>
        </View>
        <View style={styles.body}>
          <View style={styles.statusRow}><View style={styles.statusPill}><View style={styles.liveDot} /><Text style={styles.statusText}>{property.status}</Text></View><Text style={styles.verified}><Ionicons name="checkmark-circle" size={13} color={colors.green} /> Verified listing</Text></View>
          <Text style={styles.title}>{property.name}</Text>
          <Text style={styles.location}><Ionicons name="location-outline" size={15} color={colors.muted} /> {property.location}</Text>

          <View style={styles.metricsCard}>
            <View style={styles.mainMetric}><Text style={styles.targetLabel}>TARGET ANNUAL RENTAL YIELD</Text><Text style={styles.targetValue}>{property.yield}% <Text style={styles.gross}>gross</Text></Text></View>
            <View style={styles.metricRow}>
              <View style={styles.metric}><Text style={styles.metricLabel}>PROJECTED APPRECIATION</Text><Text style={styles.metricAmount}>{property.appreciation}%</Text></View>
              <View style={styles.verticalRule} />
              <View style={styles.metric}><Text style={styles.metricLabel}>MINIMUM INVESTMENT</Text><Text style={styles.metricAmount}>{formatINR(property.minimum)}</Text></View>
            </View>
          </View>

          <View style={styles.fundingCard}>
            <View style={styles.fundingHeader}><Text style={styles.fundingTitle}>Investment progress</Text><Text style={styles.fundingPercent}>{property.funded}% funded</Text></View>
            <View style={styles.progressTrack}><View style={[styles.progressFill, { width: `${property.funded}%` }]} /></View>
            <View style={styles.fundingFooter}><Text style={styles.fundingCopy}>{formatINR((property.price * property.funded) / 100)} raised</Text><Text style={styles.fundingCopy}>{formatINR(property.price)} target</Text></View>
          </View>

          <Text style={styles.sectionTitle}>About this property</Text>
          <Text style={styles.description}>{property.description}</Text>
          <View style={styles.facts}>
            <View style={styles.fact}><Ionicons name="bed-outline" size={17} color={colors.green} /><Text style={styles.factValue}>{property.bedrooms}</Text><Text style={styles.factLabel}>Bedrooms</Text></View>
            <View style={styles.fact}><Ionicons name="resize-outline" size={17} color={colors.green} /><Text style={styles.factValue}>{property.area}</Text><Text style={styles.factLabel}>Area</Text></View>
            <View style={styles.fact}><Ionicons name="business-outline" size={17} color={colors.green} /><Text style={styles.factValue}>{property.type}</Text><Text style={styles.factLabel}>Type</Text></View>
          </View>

          <View style={styles.infoBox}><Ionicons name="information-circle-outline" size={17} color={colors.green} /><Text style={styles.infoText}>Rental yield and capital appreciation are projections and are not guaranteed. Please review all property documents before investing.</Text></View>
        </View>
      </ScrollView>
      <View style={styles.bottomBar}>
        <View><Text style={styles.fromLabel}>INVEST FROM</Text><Text style={styles.fromAmount}>{formatINR(property.minimum)}</Text></View>
        <Pressable style={styles.investButton} onPress={() => router.push(`/invest/${property.id}`)}>
          <Text style={styles.investText}>Invest now</Text><Ionicons name="arrow-forward" size={16} color="#FFFFFF" />
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.canvas },
  content: { paddingBottom: 24 },
  imageWrap: { height: 282, position: 'relative', backgroundColor: '#DDE4DE' },
  heroImage: { width: '100%', height: '100%' },
  floatingButton: { position: 'absolute', top: 16, left: 20, width: 40, height: 40, backgroundColor: 'rgba(255,255,255,0.94)', borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  heart: { left: undefined, right: 20 },
  imageCount: { position: 'absolute', right: 17, bottom: 14, backgroundColor: 'rgba(23,41,35,0.75)', borderRadius: 15, paddingHorizontal: 10, paddingVertical: 7, flexDirection: 'row', alignItems: 'center', gap: 5 },
  activeDot: { height: 5, width: 5, borderRadius: 3, backgroundColor: '#FFFFFF' },
  inactiveDot: { height: 4, width: 4, borderRadius: 2, backgroundColor: 'rgba(255,255,255,0.5)' },
  imageCountText: { color: '#FFFFFF', fontSize: 9, marginLeft: 3 },
  body: { paddingHorizontal: 22, paddingTop: 17, maxWidth: 600, width: '100%', alignSelf: 'center' },
  statusRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  statusPill: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#E8F1EB', borderRadius: 12, paddingVertical: 6, paddingHorizontal: 9, gap: 5 },
  liveDot: { width: 5, height: 5, borderRadius: 3, backgroundColor: colors.green },
  statusText: { color: colors.green, fontSize: 9, fontWeight: '700' },
  verified: { color: colors.green, fontSize: 9, fontWeight: '600' },
  title: { color: colors.ink, fontSize: 24, fontWeight: '700', letterSpacing: -0.5, marginTop: 13 },
  location: { color: colors.muted, fontSize: 12, marginTop: 6 },
  metricsCard: { backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: colors.line, borderRadius: 18, padding: 16, marginTop: 20 },
  mainMetric: { alignItems: 'center', paddingBottom: 14, borderBottomWidth: 1, borderBottomColor: colors.line },
  targetLabel: { color: colors.muted, fontSize: 8, fontWeight: '700', letterSpacing: 1 },
  targetValue: { color: colors.green, fontSize: 28, fontWeight: '700', marginTop: 5 },
  gross: { color: colors.muted, fontSize: 11, fontWeight: '500' },
  metricRow: { flexDirection: 'row', paddingTop: 14 },
  metric: { flex: 1, alignItems: 'center' },
  metricLabel: { color: colors.muted, fontSize: 7, fontWeight: '700', letterSpacing: 0.6, textAlign: 'center' },
  metricAmount: { color: colors.ink, fontSize: 13, fontWeight: '700', marginTop: 7 },
  verticalRule: { width: 1, backgroundColor: colors.line },
  fundingCard: { backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: colors.line, borderRadius: 17, padding: 15, marginTop: 13 },
  fundingHeader: { flexDirection: 'row', justifyContent: 'space-between' },
  fundingTitle: { color: colors.ink, fontSize: 11, fontWeight: '700' },
  fundingPercent: { color: colors.green, fontSize: 10, fontWeight: '700' },
  progressTrack: { height: 6, borderRadius: 6, backgroundColor: '#E8ECE8', overflow: 'hidden', marginTop: 12 },
  progressFill: { height: 6, backgroundColor: colors.green, borderRadius: 6 },
  fundingFooter: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 },
  fundingCopy: { color: colors.muted, fontSize: 9 },
  sectionTitle: { color: colors.ink, fontSize: 15, fontWeight: '700', marginTop: 22 },
  description: { color: '#68756E', fontSize: 12, lineHeight: 19, marginTop: 8 },
  facts: { flexDirection: 'row', backgroundColor: '#FFFFFF', borderRadius: 15, borderWidth: 1, borderColor: colors.line, paddingVertical: 14, marginTop: 16 },
  fact: { flex: 1, alignItems: 'center', gap: 4, borderRightWidth: 1, borderRightColor: colors.line },
  factValue: { color: colors.ink, fontSize: 10, fontWeight: '700', marginTop: 3 },
  factLabel: { color: colors.muted, fontSize: 8 },
  infoBox: { flexDirection: 'row', alignItems: 'flex-start', gap: 8, backgroundColor: '#E8F1EB', borderRadius: 13, padding: 12, marginTop: 17 },
  infoText: { flex: 1, color: '#617268', fontSize: 9, lineHeight: 14 },
  bottomBar: { backgroundColor: '#FFFFFF', paddingHorizontal: 22, paddingTop: 12, paddingBottom: 12, borderTopWidth: 1, borderTopColor: colors.line, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  fromLabel: { color: colors.muted, fontSize: 8, fontWeight: '700', letterSpacing: 0.7 },
  fromAmount: { color: colors.ink, fontSize: 15, fontWeight: '700', marginTop: 3 },
  investButton: { height: 46, minWidth: 156, backgroundColor: colors.deepGreen, borderRadius: 14, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10 },
  investText: { color: '#FFFFFF', fontSize: 12, fontWeight: '700' },
  backLink: { flexDirection: 'row', alignItems: 'center', padding: 18, gap: 8 },
  backText: { color: colors.ink, fontWeight: '600' },
  notFound: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  notFoundTitle: { color: colors.ink, fontSize: 18, fontWeight: '700' },
  notFoundCopy: { color: colors.muted, marginTop: 8, fontSize: 12 },
});
