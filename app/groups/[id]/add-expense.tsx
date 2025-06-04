import Button from '@/components/Button';
import { colors } from '@/constants/Colors';
import { useGroupStore } from '@/hooks/useGroupStore';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { Calendar } from 'lucide-react-native';
import React, { useState } from 'react';
import {
  Alert,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

export default function AddGroupExpenseScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { getGroupById, addExpense } = useGroupStore();
  
  const group = getGroupById(id);
  
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [splitType, setSplitType] = useState<'equal' | 'custom'>('equal');
  const [selectedMembers, setSelectedMembers] = useState<Record<string, boolean>>({});

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
    formContainer: {
      backgroundColor: colors.white,
      margin: 20,
      borderRadius: 16,
      padding: 20,
      shadowColor: colors.text,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.05,
      shadowRadius: 8,
      elevation: 2,
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
    textArea: {
      minHeight: 80,
    },
    dateInput: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: colors.background,
      borderRadius: 8,
      padding: 12,
      borderWidth: 1,
      borderColor: colors.border,
    },
    dateText: {
      fontSize: 16,
      color: colors.text,
    },
    splitTypeContainer: {
      flexDirection: 'row',
      gap: 12,
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
      backgroundColor: colors.background,
      borderRadius: 8,
      padding: 12,
      marginBottom: 8,
      borderWidth: 1,
      borderColor: colors.border,
    },
    selectedMemberItem: {
      backgroundColor: colors.primaryLight,
      borderColor: colors.primary,
    },
    memberName: {
      fontSize: 16,
      color: colors.text,
    },
    selectedMemberName: {
      fontWeight: '500',
      color: colors.primary,
    },
    memberAmount: {
      fontSize: 16,
      fontWeight: '500',
      color: colors.primary,
    },
    buttonContainer: {
      padding: 20,
      paddingTop: 0,
      marginBottom: 20,
    },
  });
  
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
  
  // Initialize selected members if not already done
  if (Object.keys(selectedMembers).length === 0 && group.members.length > 0) {
    const initialSelectedMembers: Record<string, boolean> = {};
    group.members.forEach(member => {
      initialSelectedMembers[member.id] = true;
    });
    setSelectedMembers(initialSelectedMembers);
  }
  
  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      setDate(selectedDate);
    }
  };
  
  const showDatepicker = () => {
    setShowDatePicker(true);
  };
  
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };
  
  const handleToggleMember = (memberId: string) => {
    setSelectedMembers(prev => ({
      ...prev,
      [memberId]: !prev[memberId]
    }));
  };
  
  const handleAddExpense = () => {
    if (!name || !amount) {
      Alert.alert('Error', 'Please enter a name and amount');
      return;
    }
    
    const amountValue = parseFloat(amount);
    if (isNaN(amountValue) || amountValue <= 0) {
      Alert.alert('Error', 'Please enter a valid amount');
      return;
    }
    
    // Get selected members
    const members = group.members.filter(member => selectedMembers[member.id]);
    
    if (members.length === 0) {
      Alert.alert('Error', 'Please select at least one member');
      return;
    }
    
    // Create split members array
    const splitBetween = members.map(member => {
      return {
        memberId: member.id,
        amount: amountValue / members.length, // Equal split for now
        settled: member.id === 'user1', // Current user's expenses are automatically settled
      };
    });
    
    // Add expense to the group
    addExpense(id, {
      name,
      description,
      amount: amountValue,
      date: date.toISOString(),
      paidBy: 'user1', // Assuming current user paid
      splitBetween,
    });
    
    Alert.alert('Success', 'Expense added successfully', [
      { text: 'OK', onPress: () => router.back() }
    ]);
  };
  
  return (
    <>
      <Stack.Screen 
        options={{ 
          title: 'Add Group Expense', 
          headerStyle: { backgroundColor: colors.card }, 
          headerTitleStyle: { color: colors.text },
          headerTintColor: colors.text
        }} 
      />

      <ScrollView style={styles.container}>
        <View style={styles.formContainer}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Name</Text>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="Enter expense name"
              placeholderTextColor={colors.textSecondary}
            />
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Description</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={description}
              onChangeText={setDescription}
              placeholder="Enter description (optional)"
              placeholderTextColor={colors.textSecondary}
              multiline
              numberOfLines={3}
              textAlignVertical="top"
            />
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Amount</Text>
            <TextInput
              style={styles.input}
              value={amount}
              onChangeText={setAmount}
              placeholder="0.00"
              placeholderTextColor={colors.textSecondary}
              keyboardType="decimal-pad"
            />
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Date</Text>
            <Pressable style={styles.dateInput} onPress={showDatepicker}>
              <Text style={styles.dateText}>{formatDate(date)}</Text>
              <Calendar size={20} color={colors.textSecondary} />
            </Pressable>
            {showDatePicker && (
              <DateTimePicker
                value={date}
                mode="date"
                display="default"
                onChange={handleDateChange}
              />
            )}
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Split Type</Text>
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
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Split Between</Text>
            {group.members.map(member => (
              <Pressable
                key={member.id}
                style={[
                  styles.memberItem,
                  selectedMembers[member.id] && styles.selectedMemberItem,
                ]}
                onPress={() => handleToggleMember(member.id)}
              >
                <Text
                  style={[
                    styles.memberName,
                    selectedMembers[member.id] && styles.selectedMemberName,
                  ]}
                >
                  {member.name} {member.id === 'user1' ? '(You)' : ''}
                </Text>
                {selectedMembers[member.id] && (
                  <Text style={styles.memberAmount}>
                    ${(parseFloat(amount || '0') / Object.values(selectedMembers).filter(Boolean).length).toFixed(2)}
                  </Text>
                )}
              </Pressable>
            ))}
          </View>
        </View>
        
        <View style={styles.buttonContainer}>
          <Button
            title="Add Expense"
            onPress={handleAddExpense}
            variant="primary"
            size="large"
            fullWidth
          />
        </View>
      </ScrollView>
    </>
  );
}
