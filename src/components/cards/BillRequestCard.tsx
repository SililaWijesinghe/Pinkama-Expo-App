import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BillRequest } from '../../types';
import { COLORS, RADIUS, SHADOWS, SPACING } from '../../constants/theme';
import { useLanguage } from '../../context/LanguageContext';
import { StatusBadge } from '../common/StatusBadge';
import { ProgressIndicator } from '../common/ProgressIndicator';

interface BillRequestCardProps {
  bill: BillRequest;
  onPress: () => void;
}

export const BillRequestCard: React.FC<BillRequestCardProps> = ({ bill, onPress }) => {
  const { t } = useLanguage();
  const isElectricity = bill.billType === 'electricity';

  return (
    <TouchableOpacity
      activeOpacity={0.88}
      onPress={onPress}
      style={styles.card}
      accessibilityRole="button"
      accessibilityLabel={`${bill.provider} bill request, status ${bill.status}`}
    >
      <View style={styles.topRow}>
        <View style={styles.leftGroup}>
          <View
            style={[
              styles.iconBox,
              { backgroundColor: isElectricity ? COLORS.electricityBg : COLORS.waterBg },
            ]}
          >
            <Ionicons
              name={isElectricity ? 'flash' : 'water'}
              size={20}
              color={isElectricity ? COLORS.electricity : COLORS.water}
            />
          </View>
          <View>
            <Text style={styles.providerTitle}>
              {bill.provider} - {isElectricity ? t('electricityDonation') : t('waterDonation')}
            </Text>
            <Text style={styles.accountNumberText}>
              {t('billNumber')}: {bill.accountNumber}
            </Text>
          </View>
        </View>

        <Ionicons name="chevron-forward" size={20} color={COLORS.mutedText} />
      </View>

      <View style={styles.amountStatusRow}>
        <View>
          <Text style={styles.amountLabel}>{t('amountDue')}</Text>
          <Text style={styles.amountText}>
            {t('currency')} {bill.amount.toLocaleString()}
          </Text>
        </View>

        <StatusBadge status={bill.status} />
      </View>

      {/* Progress Bar */}
      <View style={styles.progressContainer}>
        <ProgressIndicator
          collected={bill.collectedAmount}
          total={bill.amount}
          height={6}
        />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    marginVertical: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.card,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  leftGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
  },
  iconBox: {
    width: 42,
    height: 42,
    borderRadius: RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  providerTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.deepPurple,
  },
  accountNumberText: {
    fontSize: 12,
    color: COLORS.mutedText,
    marginTop: 2,
  },
  amountStatusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginTop: SPACING.md,
    paddingTop: SPACING.sm,
    borderTopWidth: 1,
    borderTopColor: COLORS.borderLight,
  },
  amountLabel: {
    fontSize: 11,
    color: COLORS.mutedText,
    fontWeight: '600',
  },
  amountText: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.primaryPink,
    marginTop: 2,
  },
  progressContainer: {
    marginTop: SPACING.xs,
  },
});

