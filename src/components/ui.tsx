import { PropsWithChildren, ReactNode } from 'react';
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Link } from 'expo-router';
import { Property } from '../data/properties';

export const colors = {
  ink: '#172923',
  muted: '#7D8983',
  green: '#17634B',
  deepGreen: '#124B3B',
  paleGreen: '#E8F1EB',
  canvas: '#F7F8F5',
  line: '#E8ECE8',
  white: '#FFFFFF',
  gold: '#D8A85C',
};

export function formatINR(value: number) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(value);
}

export function PageTitle({
  eyebrow,
  title,
  subtitle,
  right,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  right?: ReactNode;
}) {
  return (
    <View style={styles.pageTitle}>
      <View style={{ flex: 1 }}>
        {eyebrow ? <Text style={styles.eyebrow}>{eyebrow}</Text> : null}
        <Text style={styles.pageHeading}>{title}</Text>
        {subtitle ? <Text style={styles.pageSubtitle}>{subtitle}</Text> : null}
      </View>
      {right}
    </View>
  );
}

export function SectionHeading({
  title,
  action,
  onAction,
}: {
  title: string;
  action?: string;
  onAction?: () => void;
}) {
  return (
    <View style={styles.sectionHeading}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {action ? (
        <Pressable onPress={onAction} hitSlop={8}>
          <Text style={styles.actionText}>{action}</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

export function PropertyCard({ item }: { item: Property }) {
  return (
    <Link href={`/property/${item.id}`} asChild>
      <Pressable style={styles.propertyCard}>
        <View style={styles.propertyImageWrap}>
          <Image source={{ uri: item.image }} style={styles.propertyImage} resizeMode="cover" />
          <View style={styles.propertyStatus}>
            <Text style={styles.propertyStatusText}>{item.status}</Text>
          </View>
          <View style={styles.heartButton}>
            <Ionicons name="heart-outline" size={17} color={colors.ink} />
          </View>
        </View>
        <View style={styles.propertyContent}>
          <Text style={styles.propertyName} numberOfLines={1}>{item.name}</Text>
          <Text style={styles.propertyLocation} numberOfLines={1}>
            <Ionicons name="location-outline" size={12} color={colors.muted} /> {item.location}
          </Text>
          <View style={styles.propertyMetrics}>
            <View>
              <Text style={styles.metricLabel}>TARGET YIELD</Text>
              <Text style={styles.metricValue}>{item.yield}%</Text>
            </View>
            <View style={styles.metricDivider} />
            <View>
              <Text style={styles.metricLabel}>FROM</Text>
              <Text style={styles.metricValue}>{formatINR(item.minimum)}</Text>
            </View>
          </View>
        </View>
      </Pressable>
    </Link>
  );
}

export function ScreenContainer({
  children,
  scroll = true,
  contentStyle,
}: PropsWithChildren<{ scroll?: boolean; contentStyle?: object }>) {
  return scroll ? (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={[styles.screenContent, contentStyle]}
      showsVerticalScrollIndicator={false}
    >
      {children}
    </ScrollView>
  ) : (
    <View style={[styles.screen, styles.screenContent, contentStyle]}>{children}</View>
  );
}

export function Pill({
  children,
  selected,
  onPress,
}: PropsWithChildren<{ selected?: boolean; onPress?: () => void }>) {
  return (
    <Pressable onPress={onPress} style={[styles.pill, selected ? styles.pillSelected : undefined]}>
      <Text style={[styles.pillText, selected ? styles.pillTextSelected : undefined]}>
        {children}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.canvas },
  screenContent: { paddingHorizontal: 22, paddingTop: 16, paddingBottom: 28 },
  pageTitle: { flexDirection: 'row', alignItems: 'center', marginBottom: 22 },
  eyebrow: { color: colors.green, fontSize: 11, fontWeight: '700', letterSpacing: 1.4, marginBottom: 7, textTransform: 'uppercase' },
  pageHeading: { color: colors.ink, fontSize: 27, fontWeight: '700', letterSpacing: -0.5 },
  pageSubtitle: { color: colors.muted, fontSize: 13, lineHeight: 19, marginTop: 6 },
  sectionHeading: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14, marginTop: 28 },
  sectionTitle: { color: colors.ink, fontSize: 17, fontWeight: '700' },
  actionText: { color: colors.green, fontSize: 12, fontWeight: '700' },
  propertyCard: { backgroundColor: colors.white, borderRadius: 18, overflow: 'hidden', borderWidth: 1, borderColor: '#EFF1EE' },
  propertyImageWrap: { height: 156, position: 'relative' },
  propertyImage: { width: '100%', height: '100%', backgroundColor: '#DDE4DE' },
  propertyStatus: { position: 'absolute', left: 12, top: 12, backgroundColor: 'rgba(255,255,255,0.94)', borderRadius: 20, paddingHorizontal: 10, paddingVertical: 6 },
  propertyStatusText: { color: colors.green, fontSize: 10, fontWeight: '700' },
  heartButton: { position: 'absolute', right: 12, top: 12, width: 31, height: 31, borderRadius: 18, backgroundColor: 'rgba(255,255,255,0.94)', alignItems: 'center', justifyContent: 'center' },
  propertyContent: { padding: 14 },
  propertyName: { color: colors.ink, fontSize: 15, fontWeight: '700' },
  propertyLocation: { color: colors.muted, fontSize: 11, marginTop: 5 },
  propertyMetrics: { flexDirection: 'row', alignItems: 'center', marginTop: 14, paddingTop: 12, borderTopWidth: 1, borderTopColor: colors.line },
  metricLabel: { color: colors.muted, fontSize: 8, fontWeight: '700', letterSpacing: 0.8 },
  metricValue: { color: colors.ink, fontSize: 12, fontWeight: '700', marginTop: 4 },
  metricDivider: { height: 26, width: 1, backgroundColor: colors.line, marginHorizontal: 14 },
  pill: { backgroundColor: colors.white, borderColor: colors.line, borderWidth: 1, borderRadius: 20, paddingHorizontal: 15, paddingVertical: 9 },
  pillSelected: { backgroundColor: colors.deepGreen, borderColor: colors.deepGreen },
  pillText: { color: '#66726C', fontSize: 12, fontWeight: '600' },
  pillTextSelected: { color: colors.white },
});
