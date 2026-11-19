import { useMemo, useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PageTitle, Pill, PropertyCard, colors } from '../../components/ui';
import { properties } from '../../data/properties';

const filters = ['All properties', 'High yield', 'Almost funded', 'Villas'];

export default function DiscoverScreen() {
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('All properties');
  const [sortByYield, setSortByYield] = useState(false);

  const visibleProperties = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    const filtered = properties.filter((item) => {
      const matchesQuery =
        !normalizedQuery ||
        `${item.name} ${item.location} ${item.type}`.toLowerCase().includes(normalizedQuery);
      const matchesFilter =
        filter === 'All properties' ||
        (filter === 'High yield' && item.yield >= 8.5) ||
        (filter === 'Almost funded' && item.funded >= 80) ||
        (filter === 'Villas' && item.type === 'Villa');
      return matchesQuery && matchesFilter;
    });
    return sortByYield ? filtered.sort((a, b) => b.yield - a.yield) : filtered;
  }, [filter, query, sortByYield]);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <StatusBar style="dark" />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <PageTitle eyebrow="INVEST IN INDIA" title="Find your place." subtitle="Handpicked properties. A share of the future." />
        <View style={styles.searchBox}>
          <Ionicons name="search-outline" size={19} color={colors.muted} />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Search areas or properties"
            placeholderTextColor="#9AA49E"
            style={styles.searchInput}
            returnKeyType="search"
          />
          {query.length > 0 ? (
            <Pressable onPress={() => setQuery('')} hitSlop={8}>
              <Ionicons name="close-circle" size={18} color="#A1ABA4" />
            </Pressable>
          ) : (
            <View style={styles.searchIcon}><Ionicons name="options-outline" size={17} color={colors.green} /></View>
          )}
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterRow}>
          {filters.map((item) => (
            <Pill key={item} selected={filter === item} onPress={() => setFilter(item)}>{item}</Pill>
          ))}
        </ScrollView>
        <View style={styles.resultRow}>
          <Text style={styles.resultCount}>{visibleProperties.length} properties</Text>
          <Pressable style={styles.sortButton} onPress={() => setSortByYield((current) => !current)}>
            <Ionicons name="swap-vertical-outline" size={14} color={colors.ink} />
            <Text style={styles.sortText}>{sortByYield ? 'Top yield' : 'Top picks'}</Text>
          </Pressable>
        </View>
        {visibleProperties.length > 0 ? (
          <View style={styles.grid}>
            {visibleProperties.map((item) => <PropertyCard key={item.id} item={item} />)}
          </View>
        ) : (
          <View style={styles.empty}>
            <View style={styles.emptyIcon}><Ionicons name="search-outline" size={23} color={colors.green} /></View>
            <Text style={styles.emptyTitle}>No properties found</Text>
            <Text style={styles.emptyCopy}>Try another area or choose a different filter.</Text>
            <Pressable onPress={() => { setQuery(''); setFilter('All properties'); }}>
              <Text style={styles.clearText}>Clear filters</Text>
            </Pressable>
          </View>
        )}
        <View style={styles.note}>
          <Ionicons name="information-circle-outline" size={16} color={colors.muted} />
          <Text style={styles.noteText}>Projected returns are estimates and are not guaranteed.</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.canvas },
  content: { paddingHorizontal: 22, paddingTop: 16, paddingBottom: 28, maxWidth: 560, width: '100%', alignSelf: 'center' },
  searchBox: { minHeight: 50, backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: colors.line, borderRadius: 15, paddingHorizontal: 14, flexDirection: 'row', alignItems: 'center', gap: 10 },
  searchInput: { flex: 1, color: colors.ink, fontSize: 13, paddingVertical: 11 },
  searchIcon: { width: 30, height: 30, borderRadius: 10, backgroundColor: colors.paleGreen, justifyContent: 'center', alignItems: 'center' },
  filterRow: { gap: 8, paddingVertical: 17 },
  resultRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 13 },
  resultCount: { color: colors.ink, fontSize: 13, fontWeight: '700' },
  sortButton: { flexDirection: 'row', gap: 5, alignItems: 'center', paddingVertical: 6, paddingHorizontal: 9, backgroundColor: '#FFFFFF', borderRadius: 9, borderWidth: 1, borderColor: colors.line },
  sortText: { color: colors.ink, fontSize: 10, fontWeight: '600' },
  grid: { gap: 14 },
  empty: { alignItems: 'center', paddingVertical: 50, paddingHorizontal: 24, backgroundColor: '#FFFFFF', borderRadius: 18, borderWidth: 1, borderColor: colors.line },
  emptyIcon: { width: 48, height: 48, borderRadius: 16, backgroundColor: colors.paleGreen, justifyContent: 'center', alignItems: 'center' },
  emptyTitle: { color: colors.ink, fontWeight: '700', fontSize: 15, marginTop: 14 },
  emptyCopy: { color: colors.muted, fontSize: 12, textAlign: 'center', marginTop: 6, lineHeight: 18 },
  clearText: { color: colors.green, fontWeight: '700', fontSize: 12, marginTop: 14 },
  note: { flexDirection: 'row', alignItems: 'flex-start', gap: 7, marginTop: 18, paddingHorizontal: 2 },
  noteText: { color: colors.muted, fontSize: 10, lineHeight: 15, flex: 1 },
});
