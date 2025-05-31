import Button from '@/components/Button';
import { colors } from '@/constants/Colors';
import { useGroupStore } from '@/hooks/useGroupStore';
import { GroupExpense, Member } from '@/types';
import { Image } from 'expo-image';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { MoreVertical, Plus, Share2, UserPlus } from 'lucide-react-native';
import React, { useState } from 'react';
import {
    Alert,
    FlatList,
    Pressable,
    StyleSheet,
    Text,
    View
} from 'react-native';

export default function GroupDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { getGroupById, deleteGroup, settleExpense } = useGroupStore();
  
  const group = getGroupById(id);
  const [activeTab, setActiveTab] = useState<'expenses' | 'members'>('expenses');
  
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
  
  const handleDeleteGroup = () => {
    Alert.alert(
      'Delete Group',
      'Are you sure you want to delete this group?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            deleteGroup(id);
            router.back();
          },
        },
      ]
    );
  };
  
  const handleSettleExpense = (expenseId: string, memberId: string) => {
    Alert.alert(
      'Settle Expense',
      'Mark this expense as settled for this member?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Settle',
          onPress: () => {
            settleExpense(id, expenseId, memberId);
          },
        },
      ]
    );
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  };
  
  const renderExpenseItem = ({ item }: { item: GroupExpense }) => {
    const paidByMember = group.members.find(
      (member) => member.id === item.paidBy
    );
    
    return (
      <View style={styles.expenseCard}>
        <View style={styles.expenseHeader}>
          <Text style={styles.expenseName}>{item.name}</Text>
          <Text style={styles.expenseAmount}>${item.amount.toFixed(2)}</Text>
        </View>
        
        <Text style={styles.expenseDescription}>{item.description}</Text>
        <Text style={styles.expenseDate}>{formatDate(item.date)}</Text>
        
        <View style={styles.paidByContainer}>
          <Text style={styles.paidByText}>Paid by: </Text>
          <Text style={styles.paidByName}>{paidByMember?.name || 'Unknown'}</Text>
        </View>
        
        <View style={styles.splitContainer}>
          <Text style={styles.splitTitle}>Split between:</Text>
          {item.splitBetween.map((split) => {
            const member = group.members.find((m) => m.id === split.memberId);
            return (
              <View key={split.memberId} style={styles.splitItem}>
                <View style={styles.splitMember}>
                  <Image
                    source={{ uri: member?.avatar }}
                    style={styles.splitAvatar}
                    contentFit="cover"
                  />
                  <Text style={styles.splitName}>{member?.name}</Text>
                </View>
                <View style={styles.splitAmountContainer}>
                  <Text style={styles.splitAmount}>
                    ${split.amount.toFixed(2)}
                  </Text>
                  {!split.settled ? (
                    <Button
                      title="Settle"
                      onPress={() => handleSettleExpense(item.id, split.memberId)}
                      variant="outline"
                      size="small"
                    />
                  ) : (
                    <Text style={styles.settledText}>Settled</Text>
                  )}
                </View>
              </View>
            );
          })}
        </View>
      </View>
    );
  };
  
  const renderMemberItem = ({ item }: { item: Member }) => {
    return (
      <View style={styles.memberCard}>
        <Image
          source={{ uri: item.avatar }}
          style={styles.memberAvatar}
          contentFit="cover"
        />
        <View style={styles.memberInfo}>
          <Text style={styles.memberName}>{item.name}</Text>
          {item.email && (
            <Text style={styles.memberEmail}>{item.email}</Text>
          )}
        </View>
      </View>
    );
  };
  
  return (
    <>
      <Stack.Screen
        options={{
          title: group.name,
          headerRight: () => (
            <Pressable style={styles.moreButton}>
              <MoreVertical size={24} color={colors.text} />
            </Pressable>
          ),
        }}
      />
      
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.membersPreview}>
            {group.members.slice(0, 3).map((member) => (
              <Image
                key={member.id}
                source={{ uri: member.avatar }}
                style={styles.memberPreviewAvatar}
                contentFit="cover"
              />
            ))}
            {group.members.length > 3 && (
              <View style={styles.memberPreviewMore}>
                <Text style={styles.memberPreviewMoreText}>
                  +{group.members.length - 3}
                </Text>
              </View>
            )}
          </View>
          
          <View style={styles.actionsContainer}>
            <Pressable style={styles.actionButton}>
              <Share2 size={20} color={colors.primary} />
              <Text style={styles.actionText}>Share</Text>
            </Pressable>
            <Pressable style={styles.actionButton}>
              <UserPlus size={20} color={colors.primary} />
              <Text style={styles.actionText}>Invite</Text>
            </Pressable>
          </View>
        </View>
        
        <View style={styles.tabsContainer}>
          <Pressable
            style={[
              styles.tabButton,
              activeTab === 'expenses' && styles.activeTabButton,
            ]}
            onPress={() => setActiveTab('expenses')}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === 'expenses' && styles.activeTabText,
              ]}
            >
              Expenses
            </Text>
          </Pressable>
          <Pressable
            style={[
              styles.tabButton,
              activeTab === 'members' && styles.activeTabButton,
            ]}
            onPress={() => setActiveTab('members')}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === 'members' && styles.activeTabText,
              ]}
            >
              Members
            </Text>
          </Pressable>
        </View>
        
        {activeTab === 'expenses' ? (
          <>
            <FlatList
              data={group.expenses}
              keyExtractor={(item) => item.id}
              renderItem={renderExpenseItem}
              contentContainerStyle={styles.listContent}
              ListEmptyComponent={
                <View style={styles.emptyContainer}>
                  <Text style={styles.emptyText}>
                    No expenses yet. Add your first expense!
                  </Text>
                </View>
              }
            />
            
            <Pressable
              style={styles.addButton}
              onPress={() => router.push(`/groups/${id}/add-expense`)}
            >
              <Plus size={24} color={colors.white} />
            </Pressable>
          </>
        ) : (
          <>
            <FlatList
              data={group.members}
              keyExtractor={(item) => item.id}
              renderItem={renderMemberItem}
              contentContainerStyle={styles.listContent}
            />
            
            <Pressable
              style={styles.addButton}
              onPress={() => router.push(`/groups/${id}/add-member`)}
            >
              <Plus size={24} color={colors.white} />
            </Pressable>
          </>
        )}
      </View>
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
  moreButton: {
    padding: 8,
  },
  header: {
    backgroundColor: colors.white,
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  membersPreview: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  memberPreviewAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: -10,
    borderWidth: 2,
    borderColor: colors.white,
  },
  memberPreviewMore: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.white,
  },
  memberPreviewMoreText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  actionButton: {
    alignItems: 'center',
    padding: 8,
  },
  actionText: {
    fontSize: 14,
    color: colors.primary,
    marginTop: 4,
  },
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
  },
  activeTabButton: {
    borderBottomWidth: 2,
    borderBottomColor: colors.primary,
  },
  tabText: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.textSecondary,
  },
  activeTabText: {
    color: colors.primary,
  },
  listContent: {
    padding: 20,
  },
  emptyContainer: {
    padding: 20,
    backgroundColor: colors.white,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  expenseCard: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: colors.text,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  expenseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  expenseName: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  expenseAmount: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  expenseDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 8,
  },
  expenseDate: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 12,
  },
  paidByContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  paidByText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  paidByName: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
  },
  splitContainer: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: 12,
  },
  splitTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
    marginBottom: 12,
  },
  splitItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  splitMember: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  splitAvatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginRight: 8,
  },
  splitName: {
    fontSize: 14,
    color: colors.text,
  },
  splitAmountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  splitAmount: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
  },
  settledText: {
    fontSize: 14,
    color: colors.success,
  },
  memberCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: colors.text,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  memberAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 16,
  },
  memberInfo: {
    flex: 1,
  },
  memberName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  memberEmail: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  addButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.text,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
});
