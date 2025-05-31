import SearchBar from '@/components/SearchBar';
import SubscriptionCard from '@/components/SubscriptionCard';
import { colors } from '@/constants/Colors';
import { useSubscriptionStore } from '@/hooks/useSubscriptionStore';
import { Stack } from 'expo-router';
import React from 'react';
import { FlatList, StyleSheet, View } from 'react-native';

export default function SubscriptionsScreen() {
  const { subscriptions } = useSubscriptionStore();
  const [searchQuery, setSearchQuery] = React.useState('');

  const filteredSubscriptions = React.useMemo(() => {
    if (!searchQuery) return subscriptions;
    const query = searchQuery.toLowerCase();
    return subscriptions.filter(sub => 
      sub.name.toLowerCase().includes(query) || 
      sub.description?.toLowerCase().includes(query) ||
      sub.category.toLowerCase().includes(query)
    );
  }, [subscriptions, searchQuery]);

  return (
    <>
      <Stack.Screen 
        options={{ 
          title: 'Subscriptions',
          headerLargeTitle: true,
          headerSearchBarOptions: {
            hideWhenScrolling: false
          }
        }} 
      />
      
      <View style={styles.container}>
        <SearchBar
          placeholder="Search subscriptions..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          style={styles.searchBar}
        />
        
        <FlatList
          data={filteredSubscriptions}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <SubscriptionCard
              subscription={item}
              onPress={() => {
                // TODO: Navigate to subscription details
              }}
            />
          )}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  searchBar: {
    margin: 16,
  },
  list: {
    padding: 16,
  },
});
