import AmountInput from '@/components/AmountInput';
import Button from '@/components/Button';
import { colors } from '@/constants/Colors';
import { useExpenseStore } from '@/hooks/useExpenseStore';
import { useGroupStore } from '@/hooks/useGroupStore';
import { Image } from 'expo-image';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    Alert,
    Pressable,
    ScrollView,
    StyleSheet,
    Switch,
    Text,
    View,
} from 'react-native';

export default function SplitExpenseScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { getExpenseById } = useExpenseStore();
  const { groups, addExpense: addGroupExpense } = useGroupStore();
  
  const expense = getExpenseById(id);
  
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);
  const [selectedMembers, setSelectedMembers] = useState<Record<string, boolean>>({});
  const [splitType, setSplitType] = useState<'equal' | 'custom'>('equal');
  const [customAmounts, setCustomAmounts] = useState<Record<string, number>>({});
  const [totalCustomAmount, setTotalCustomAmount] = useState(0);

  useEffect(() => {
    if (selectedGroupId) {
      const group = groups.find(g => g.id === selectedGroupId);
      if (group) {
        // Initialize all members as selected
        const initialSelectedMembers: Record<string, boolean> = {};
        const initialCustomAmounts: Record<string, number> = {};
        
        group.members.forEach(member => {
          initialSelectedMembers[member.id] = true;
          
          // Calculate equal split amount
          if (expense) {
            const memberCount = group.members.length;
            const equalAmount = expense.amount / memberCount;
            initialCustomAmounts[member.id] = equalAmount;
          }
        });
        
        setSelectedMembers(initialSelectedMembers);
        setCustomAmounts(initialCustomAmounts);
        setTotalCustomAmount(expense.amount);
      }
    }
  }, [selectedGroupId, groups, expense]);
  
  if (!expense) {
    return (
      <View style={styles.notFoundContainer}>
        <Text style={styles.notFoundText}>Expense not found</Text>
        <Button
          title="Go Back"
          onPress={() => router.back()}
          variant="primary"
          size="medium"
        />
      </View>
    );
  }
  
  const handleToggleMember = (memberId: string) => {
    setSelectedMembers(prev => ({
      ...prev,
      [memberId]: !prev[memberId]
    }));
  };
  
  const handleSplitExpense = () => {
    if (!selectedGroupId) {
      Alert.alert('Error', 'Please select a group');
      return;
    }
    
    const selectedGroup = groups.find(g => g.id === selectedGroupId);
    if (!selectedGroup) return;
    
    // Get selected members
    const members = selectedGroup.members.filter(member => selectedMembers[member.id]);
    
    if (members.length === 0) {
      Alert.alert('Error', 'Please select at least one member');
      return;
    }
    
    // Create split members array
    const splitBetween = members.map(member => {
      let amount;
      
      if (splitType === 'equal') {
        amount = expense.amount / members.length;
      } else {
        amount = customAmounts[member.id] || 0;
      }
      
    // Validate total amount before submitting
      if (splitType === 'custom' && Math.abs(totalCustomAmount - expense.amount) > 0.01) {
        Alert.alert(
          'Error',
          'The sum of all shares must equal the total expense amount.',
          [{ text: 'OK' }]
        );
        return;
      }

      return {
        memberId: member.id,
        amount,
        settled: member.id === 'user1', // Current user's expenses are automatically settled
      };
    });
    
    // Add expense to the group
    addGroupExpense(selectedGroupId, {
      name: expense.name,
      description: expense.description,
      amount: expense.amount,
      date: expense.date,
      paidBy: 'user1', // Assuming current user paid
      splitBetween,
    });
    
    Alert.alert('Success', 'Expense split successfully', [
      { text: 'OK', onPress: () => router.navigate(`/groups/${selectedGroupId}`) }
    ]);
  };
  
  const getSelectedMembersCount = () => {
    return Object.values(selectedMembers).filter(Boolean).length;
  };
  
  const calculateEqualSplitAmount = () => {
    const selectedCount = getSelectedMembersCount();
    if (selectedCount === 0) return 0;
    return expense.amount / selectedCount;
  };
  
  return (
    <>
      <Stack.Screen options={{ title: 'Split Expense' }} />
      
      <ScrollView style={styles.container}>
        <View style={styles.expenseCard}>
          <Text style={styles.expenseName}>{expense.name}</Text>
          <Text style={styles.expenseAmount}>${expense.amount.toFixed(2)}</Text>
          <Text style={styles.expenseDescription}>{expense.description}</Text>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Select Group</Text>
          
          {groups.length > 0 ? (
            groups.map(group => (
              <Pressable
                key={group.id}
                style={[
                  styles.groupItem,
                  selectedGroupId === group.id && styles.selectedGroupItem,
                ]}
                onPress={() => setSelectedGroupId(group.id)}
              >
                <Text
                  style={[
                    styles.groupName,
                    selectedGroupId === group.id && styles.selectedGroupName,
                  ]}
                >
                  {group.name}
                </Text>
                <Text
                  style={[
                    styles.groupMembers,
                    selectedGroupId === group.id && styles.selectedGroupMembers,
                  ]}
                >
                  {group.members.length} members
                </Text>
              </Pressable>
            ))
          ) : (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>
                No groups available. Create a group first.
              </Text>
              <Button
                title="Create Group"
                onPress={() => router.push('/groups/new')}
                variant="outline"
                size="small"
                style={styles.createGroupButton}
              />
            </View>
          )}
        </View>
        
        {selectedGroupId && (
          <>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Split Type</Text>
              
              <View style={styles.splitTypeContainer}>
                <Pressable
                  style={[
                    styles.splitTypeButton,
                    splitType === 'equal' && styles.selectedSplitTypeButton,
                  ]}
                  onPress={() => setSplitType('equal')}
                >
                  <Text
                    style={[
                      styles.splitTypeText,
                      splitType === 'equal' && styles.selectedSplitTypeText,
                    ]}
                  >
                    Equal Split
                  </Text>
                </Pressable>
                
                <Pressable
                  style={[
                    styles.splitTypeButton,
                    splitType === 'custom' && styles.selectedSplitTypeButton,
                  ]}
                  onPress={() => setSplitType('custom')}
                >
                  <Text
                    style={[
                      styles.splitTypeText,
                      splitType === 'custom' && styles.selectedSplitTypeText,
                    ]}
                  >
                    Custom Split
                  </Text>
                </Pressable>
              </View>
            </View>
            
            <View style={styles.section}>              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Select Members</Text>
                {splitType === 'equal' ? (
                  <Text style={styles.equalSplitAmount}>
                    ${calculateEqualSplitAmount().toFixed(2)} each
                  </Text>
                ) : (
                  <Text style={[
                    styles.equalSplitAmount,
                    Math.abs(totalCustomAmount - expense.amount) > 0.01 && styles.amountError
                  ]}>
                    ${totalCustomAmount.toFixed(2)} / ${expense.amount.toFixed(2)}
                  </Text>
                )}
              </View>
              
              {groups
                .find(g => g.id === selectedGroupId)
                ?.members.map(member => (
                  <View key={member.id} style={styles.memberItem}>                    <View style={styles.memberInfo}>
                      <Image
                        source={{ uri: member.avatar }}
                        style={styles.memberAvatar}
                        contentFit="cover"
                      />
                      <Text style={styles.memberName}>
                        {member.name} {member.id === 'user1' ? '(You)' : ''}
                      </Text>
                    </View>
                    
                    <View style={styles.memberControls}>
                      {splitType === 'custom' && selectedMembers[member.id] && (
                        <AmountInput
                          value={customAmounts[member.id]?.toString() || ''}
                          onChangeText={(text) => {
                            const amount = parseFloat(text) || 0;
                            setCustomAmounts(prev => ({
                              ...prev,
                              [member.id]: amount
                            }));
                            // Update total custom amount
                            const newTotal = Object.values({
                              ...customAmounts,
                              [member.id]: amount
                            }).reduce((sum, val) => sum + val, 0);
                            setTotalCustomAmount(newTotal);
                          }}
                          style={styles.amountInput}
                        />
                      )}
                      <Switch
                        value={selectedMembers[member.id] || false}
                        onValueChange={() => handleToggleMember(member.id)}
                        trackColor={{ false: colors.border, true: colors.primary }}
                        thumbColor={colors.white}
                      />
                    </View>
                  </View>
                ))}
            </View>
          </>
        )}
        
        <View style={styles.buttonContainer}>
          <Button
            title="Split Expense"
            onPress={handleSplitExpense}
            variant="primary"
            size="large"
            fullWidth
            disabled={!selectedGroupId || getSelectedMembersCount() === 0}
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
  expenseCard: {
    backgroundColor: colors.white,
    margin: 20,
    borderRadius: 16,
    padding: 20,
    shadowColor: colors.text,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    alignItems: 'center',
  },
  expenseName: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  expenseAmount: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 8,
  },
  expenseDescription: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  section: {
    backgroundColor: colors.white,
    margin: 20,
    marginTop: 0,
    borderRadius: 16,
    padding: 20,
    shadowColor: colors.text,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 16,
  },
  equalSplitAmount: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.primary,
  },
  groupItem: {
    backgroundColor: colors.background,
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  selectedGroupItem: {
    backgroundColor: colors.primaryLight,
    borderColor: colors.primary,
  },
  groupName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  selectedGroupName: {
    color: colors.primary,
  },
  groupMembers: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  selectedGroupMembers: {
    color: colors.primary,
  },
  emptyContainer: {
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: 16,
    textAlign: 'center',
  },
  createGroupButton: {
    marginTop: 8,
  },
  splitTypeContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 8,
  },
  splitTypeButton: {
    flex: 1,
    backgroundColor: colors.background,
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  selectedSplitTypeButton: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  splitTypeText: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
  },
  selectedSplitTypeText: {
    color: colors.white,
  },
  memberItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  memberInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  memberAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  memberName: {
    fontSize: 16,
    color: colors.text,
  },  buttonContainer: {
    padding: 20,
    paddingTop: 0,
    marginBottom: 20,
  },
  memberControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },  amountInput: {
    width: 100,
    marginBottom: 0,
  },
  amountError: {
    color: colors.error,
  },
});
