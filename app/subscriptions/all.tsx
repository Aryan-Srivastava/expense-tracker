import SearchBar from '@/components/SearchBar';
import SubscriptionCard from '@/components/SubscriptionCard';
import { ThemedView } from '@/components/ThemedView';
import { colors } from '@/constants/Colors';
import { useSubscriptionStore } from '@/hooks/useSubscriptionStore';
import { Stack } from 'expo-router';
import React from 'react';
import { FlatList, StyleSheet } from 'react-native';

export default function AllSubscriptionsScreen() {
  const { subscriptions } = useSubscriptionStore();
  const [searchQuery, setSearchQuery] = React.useState('');

  const filteredSubscriptions = React.useMemo(() => {
    if (!searchQuery) return subscriptions;
    const lowerQuery = searchQuery.toLowerCase();
    return subscriptions.filter(subscription => 
      subscription.name.toLowerCase().includes(lowerQuery) ||
      subscription.description.toLowerCase().includes(lowerQuery)
    );
  }, [subscriptions, searchQuery]);

  return (
    <ThemedView style={styles.container}>
      <Stack.Screen 
        options={{
          title: 'All Subscriptions',
          headerShadowVisible: false,
          headerStyle: { backgroundColor: colors.background },
        }} 
      />
      
      <SearchBar
        placeholder="Search subscriptions..."
        value={searchQuery}
        onChangeText={setSearchQuery}
        style={styles.searchBar}
      />

      <FlatList
        data={filteredSubscriptions}
        renderItem={({ item }) => (
          <SubscriptionCard
            subscription={item}
            onPress={() => {
              // TODO: Navigate to subscription detail screen
            }}
          />
        )}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  searchBar: {
    marginHorizontal: 16,
    marginVertical: 12,
  },
  list: {
    padding: 16,
  },
});
