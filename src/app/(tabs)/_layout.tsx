import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../components/ui';

const icons = {
  index: ['home-outline', 'home'],
  discover: ['compass-outline', 'compass'],
  portfolio: ['pie-chart-outline', 'pie-chart'],
  profile: ['person-outline', 'person'],
} as const;

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.green,
        tabBarInactiveTintColor: '#98A29C',
        tabBarLabelStyle: { fontSize: 10, fontWeight: '600', marginBottom: 3 },
        tabBarStyle: {
          height: 64,
          paddingTop: 8,
          paddingBottom: 5,
          borderTopColor: '#ECEFEC',
          backgroundColor: '#FFFFFF',
        },
        tabBarIcon: ({ focused, size }) => {
          const iconPair = icons[route.name as keyof typeof icons] ?? icons.index;
          return (
            <Ionicons
              name={focused ? iconPair[1] : iconPair[0]}
              size={size}
              color={focused ? colors.green : '#98A29C'}
            />
          );
        },
      })}
    >
      <Tabs.Screen name="index" options={{ title: 'Home' }} />
      <Tabs.Screen name="discover" options={{ title: 'Explore' }} />
      <Tabs.Screen name="portfolio" options={{ title: 'Portfolio' }} />
      <Tabs.Screen name="profile" options={{ title: 'Profile' }} />
    </Tabs>
  );
}
