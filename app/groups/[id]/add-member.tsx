import Button from '@/components/Button';
import { colors } from '@/constants/Colors';
import { useGroupStore } from '@/hooks/useGroupStore';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

export default function AddGroupMemberScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { getGroupById, addMember } = useGroupStore();
  
  const group = getGroupById(id);
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  
  if (!group) {
    return (
      <View style={styles.notFoundContainer}>
        <Text style={styles.notFoundText}>Group not found</Text>
        <Button
          title="Go Back"
          onPress={() => router.back()}
          variant="primary"
          size="medium"
        />
      </View>
    );
  }
  
  const handleAddMember = () => {
    if (!name.trim()) {
      Alert.alert('Error', 'Please enter a member name');
      return;
    }
    
    // Generate a random avatar
    const avatarIndex = Math.floor(Math.random() * 10) + 1;
    const avatar = `https://images.unsplash.com/photo-${1500000000000 + avatarIndex}?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80`;
    
    addMember(id, {
      name,
      email: email.trim() || undefined,
      avatar,
    });
    
    Alert.alert('Success', 'Member added successfully', [
      { text: 'OK', onPress: () => router.back() }
    ]);
  };
  
  return (
    <>
      <Stack.Screen 
        options={{ 
          title: 'Add Member', 
          headerStyle: { backgroundColor: colors.card }, 
          headerTitleStyle: { color: colors.text }, 
          headerTintColor: colors.text 
        }} 
      />
      
      <ScrollView style={styles.container}>
        <View style={styles.card}>
          <Text style={styles.groupName}>{group.name}</Text>
          <Text style={styles.memberCount}>
            {group.members.length} {group.members.length === 1 ? 'member' : 'members'}
          </Text>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Member Name</Text>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="Enter member name"
              placeholderTextColor={colors.textSecondary}
            />
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email (Optional)</Text>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              placeholder="Enter member email"
              placeholderTextColor={colors.textSecondary}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>
          
          <Button
            title="Add Member"
            onPress={handleAddMember}
            variant="primary"
            size="large"
            fullWidth
            style={styles.addButton}
          />
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 20,
  },
  notFoundContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  notFoundText: {
    fontSize: 18,
    color: colors.textSecondary,
    marginBottom: 20,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 20,
    shadowColor: colors.text,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  groupName: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  memberCount: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 24,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
    marginBottom: 8,
  },
  input: {
    backgroundColor: colors.background,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: colors.text,
    borderWidth: 1,
    borderColor: colors.border,
  },
  addButton: {
    marginTop: 8,
  },
});
