import Button from '@/components/Button';
import { colors } from '@/constants/Colors';
import { useExpenseStore } from '@/hooks/useExpenseStore';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { Calendar, Edit2, Tag, Trash2 } from 'lucide-react-native';
import React from 'react';
import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';

export default function ExpenseDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { getExpenseById, deleteExpense } = useExpenseStore();
  
  const expense = getExpenseById(id);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    headerButtons: {
      flexDirection: 'row',
      gap: 8,
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
    amountContainer: {
      backgroundColor: colors.white,
      padding: 20,
      alignItems: 'center',
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    amountLabel: {
      fontSize: 16,
      color: colors.textSecondary,
      marginBottom: 8,
    },
    amount: {
      fontSize: 36,
      fontWeight: '700',
      color: colors.text,
    },
    card: {
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
    title: {
      fontSize: 20,
      fontWeight: '600',
      color: colors.text,
      marginBottom: 8,
    },
    description: {
      fontSize: 16,
      color: colors.textSecondary,
      marginBottom: 20,
    },
    detailsContainer: {
      gap: 16,
    },
    detailItem: {
      flexDirection: 'row',
      alignItems: 'flex-start',
    },
    detailIcon: {
      marginRight: 8,
      marginTop: 2,
    },
    detailText: {
      fontSize: 16,
      color: colors.text,
      flex: 1,
    },
    tagsContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 8,
    },
    tagBadge: {
      backgroundColor: colors.primaryLight,
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 16,
    },
    tagText: {
      fontSize: 14,
      color: colors.primary,
      fontWeight: '500',
    },
    actionsContainer: {
      padding: 20,
    },
  });
  
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
  
  const handleDelete = () => {
    Alert.alert(
      'Delete Expense',
      'Are you sure you want to delete this expense?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            deleteExpense(id);
            router.back();
          },
        },
      ]
    );
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Expense Details',
          headerRight: () => (
            <View style={styles.headerButtons}>
              <Button
                title="Edit"
                onPress={() => router.push(`/expenses/edit/${id}`)}
                variant="ghost"
                size="small"
                icon={<Edit2 size={16} color={colors.primary} />}
              />
              <Button
                title="Delete"
                onPress={handleDelete}
                variant="ghost"
                size="small"
                icon={<Trash2 size={16} color={colors.error} />}
              />
            </View>
          ),
        }}
      />
      
      <ScrollView style={styles.container}>
        <View style={styles.amountContainer}>
          <Text style={styles.amountLabel}>Amount</Text>
          <Text style={styles.amount}>${expense.amount.toFixed(2)}</Text>
        </View>
        
        <View style={styles.card}>
          <Text style={styles.title}>{expense.name}</Text>
          <Text style={styles.description}>{expense.description}</Text>
          
          <View style={styles.detailsContainer}>
            <View style={styles.detailItem}>
              <Calendar size={16} color={colors.textSecondary} style={styles.detailIcon} />
              <Text style={styles.detailText}>{formatDate(expense.date)}</Text>
            </View>
            
            <View style={styles.detailItem}>
              <Tag size={16} color={colors.textSecondary} style={styles.detailIcon} />
              <View style={styles.tagsContainer}>
                <View style={styles.tagBadge}>
                  <Text style={styles.tagText}>{expense.tag}</Text>
                </View>
                <View style={styles.tagBadge}>
                  <Text style={styles.tagText}>{expense.category}</Text>
                </View>
              </View>
            </View>
          </View>
        </View>
        
        <View style={styles.actionsContainer}>
          <Button
            title="Split with Group"
            onPress={() => router.push(`/expenses/split/${id}`)}
            variant="primary"
            size="large"
            fullWidth
          />
        </View>
      </ScrollView>
    </>
  );
}
