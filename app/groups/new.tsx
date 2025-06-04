import Button from '@/components/Button';
import { colors } from '@/constants/Colors';
import { useGroupStore } from '@/hooks/useGroupStore';
import { Stack, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

export default function NewGroupScreen() {
  const router = useRouter();
  const { addGroup } = useGroupStore();
  
  const [groupName, setGroupName] = useState('');
  const [memberName, setMemberName] = useState('');
  const [memberEmail, setMemberEmail] = useState('');
  const [members, setMembers] = useState<{ name: string; email?: string }[]>([
    { name: 'You', email: 'you@example.com' }, // Current user is always a member
  ]);

  const handleAddMember = () => {
    if (!memberName.trim()) {
      Alert.alert('Error', 'Please enter a member name');
      return;
    }
    
    setMembers([...members, { name: memberName, email: memberEmail }]);
    setMemberName('');
    setMemberEmail('');
  };

  const handleCreateGroup = () => {
    if (!groupName.trim()) {
      Alert.alert('Error', 'Please enter a group name');
      return;
    }
    
    if (members.length < 2) {
      Alert.alert('Error', 'Please add at least one more member');
      return;
    }
    
    // Create group members with random avatars
    const groupMembers = members.map((member, index) => {
      // Use different avatar for each member
      const avatarIndex = (index % 6) + 1;
      return {
        id: index === 0 ? 'user1' : `member-${Date.now()}-${index}`,
        name: member.name,
        email: member.email,
        avatar: `https://images.unsplash.com/photo-${1500000000000 + avatarIndex}?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80`,
      };
    });
    
    // Add the new group
    addGroup({
      name: groupName,
      members: groupMembers,
      expenses: [],
    });
    
    Alert.alert('Success', 'Group created successfully', [
      { text: 'OK', onPress: () => router.back() }
    ]);
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
      padding: 20,
    },
    card: {
      backgroundColor: colors.white,
      borderRadius: 16,
      padding: 20,
      marginBottom: 20,
      shadowColor: colors.text,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.05,
      shadowRadius: 8,
      elevation: 2,
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
      marginBottom: 16,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: colors.text,
      marginBottom: 16,
      marginTop: 8,
    },
    memberItem: {
      backgroundColor: colors.background,
      borderRadius: 8,
      padding: 12,
      marginBottom: 12,
    },
    memberName: {
      fontSize: 16,
      fontWeight: '500',
      color: colors.text,
    },
    memberEmail: {
      fontSize: 14,
      color: colors.textSecondary,
      marginTop: 4,
    },
    addMemberButton: {
      marginTop: 8,
    },
    buttonContainer: {
      marginBottom: 20,
    },
  });

  return (
    <>
      <Stack.Screen 
        options={{ 
          title: 'Create New Group',
          headerStyle: { backgroundColor: colors.card }, 
          headerTitleStyle: { color: colors.text },
          headerTintColor: colors.text
        }}
      />
      
      <ScrollView style={styles.container}>
        <View style={styles.card}>
          <Text style={styles.label}>Group Name</Text>
          <TextInput
            style={styles.input}
            value={groupName}
            onChangeText={setGroupName}
            placeholder="Enter group name"
            placeholderTextColor={colors.textSecondary}
          />
          
          <Text style={styles.sectionTitle}>Members</Text>
          
          {members.map((member, index) => (
            <View key={index} style={styles.memberItem}>
              <Text style={styles.memberName}>{member.name}</Text>
              {member.email && (
                <Text style={styles.memberEmail}>{member.email}</Text>
              )}
            </View>
          ))}
          
          <Text style={styles.label}>Add New Member</Text>
          <TextInput
            style={styles.input}
            value={memberName}
            onChangeText={setMemberName}
            placeholder="Enter member name"
            placeholderTextColor={colors.textSecondary}
          />
          
          <TextInput
            style={[styles.input, { marginTop: 12 }]}
            value={memberEmail}
            onChangeText={setMemberEmail}
            placeholder="Enter member email (optional)"
            placeholderTextColor={colors.textSecondary}
            keyboardType="email-address"
          />
          
          <Button
            title="Add Member"
            onPress={handleAddMember}
            variant="outline"
            size="medium"
            fullWidth
            style={styles.addMemberButton}
          />
        </View>
        
        <View style={styles.buttonContainer}>
          <Button
            title="Create Group"
            onPress={handleCreateGroup}
            variant="primary"
            size="large"
            fullWidth
          />
        </View>
      </ScrollView>
    </>
  );
}
