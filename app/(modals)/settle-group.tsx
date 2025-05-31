import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Switch, Alert } from 'react-native';
import { colors } from '@/constants/Colors';
import Button from '@/components/Button';
import { useGroupStore } from '@/hooks/useGroupStore';

export default function SettleGroupModal({ route, navigation }) {
  const { groupId, memberId } = route.params;
  const { groups, settleGroupMember } = useGroupStore();
  
  const group = groups.find(g => g.id === groupId);
  const member = group?.members.find(m => m.id === memberId);
  
  const [settlementAmount, setSettlementAmount] = useState('');
  const [fullySettled, setFullySettled] = useState(false);

  const handleSettle = () => {
    const amount = parseFloat(settlementAmount) || 0;
    
    if (fullySettled) {
      settleGroupMember(groupId, memberId, member?.due || 0);
    } else if (amount > 0 && amount <= (member?.due || 0)) {
      settleGroupMember(groupId, memberId, amount);
    } else {
      Alert.alert('Invalid Amount', 'Please enter a valid settlement amount.');
      return;
    }
    
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Settle {member?.name}</Text>
      <Text style={styles.subtitle}>
        Total Due: ${member?.due?.toFixed(2) || '0.00'}
      </Text>
      
      {!fullySettled && (
        <TextInput
          style={styles.input}
          placeholder={`Enter amount (max $${member?.due?.toFixed(2) || '0.00'})`}
          keyboardType="numeric"
          value={settlementAmount}
          onChangeText={setSettlementAmount}
        />
      )}
      
      <View style={styles.settleFullContainer}>
        <Text style={styles.settleFullText}>Mark as Fully Settled</Text>
        <Switch
          value={fullySettled}
          onValueChange={setFullySettled}
          trackColor={{ 
            false: colors.border, 
            true: colors.primary 
          }}
        />
      </View>
      
      <Button 
        title={fullySettled ? 'Fully Settle' : 'Settle Partial Amount'} 
        onPress={handleSettle}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: colors.background,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    marginBottom: 20,
  },
  settleFullContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  settleFullText: {
    fontSize: 16,
    color: colors.text,
  },
});