import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BillRequest } from '../../types';
import { COLORS, RADIUS, SHADOWS, SPACING } from '../../constants/theme';
import { useLanguage } from '../../context/LanguageContext';
import { ProgressIndicator } from '../common/ProgressIndicator';
import { GradientButton } from '../common/GradientButton';

interface DonationCardProps {
  bill: BillRequest;
  onPress: () => void;
  onDonatePress: () => void;
}

export const DonationCard: React.FC<DonationCardProps> = ({
  bill,
  onPress,
  onDonatePress,
}) => {
  const { t } = useLanguage();
  const isElectricity = bill.billType === 'electricity';
  const remaining = Math.max(0, bill.amount - bill.collectedAmount);

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={onPress}
      style={styles.card}
      accessibilityRole="button"
      accessibilityLabel={`${bill.provider} bill for ${bill.city}`}
    >
      <View style={styles.headerRow}>
        {/* Recipient / Avatar Icon */}
        <View style={styles.avatarContainer}>
          <View
            style={[
              styles.avatarCircle,
              { backgroundColor: isElectricity ? COLORS.electricityBg : COLORS.waterBg },
            ]}
          >
            <Ionicons
              name={isElectricity ? 'flash' : 'water'}
              size={22}
              color={isElectricity ? COLORS.electricity : COLORS.water}
            />
          </View>
        </View>

        {/* Bill Title & Location */}
        <View style={styles.titleCol}>
          <View style={styles.providerRow}>
            <Text style={styles.providerText}>
              {bill.provider} - {isElectricity ? t('electricityDonation') : t('waterDonation')}
            </Text>
            {bill.isUrgent && (
              <View style={styles.urgentBadge}>
                <Text style={styles.urgentText}>හදිසි / Urgent</Text>
              </View>
            )}
          </View>
          <Text style={styles.cityText}>
            <Ionicons name="location-sharp" size={12} color={COLORS.mutedText} /> {bill.city}
          </Text>
        </View>

        {/* Amount */}
        <View style={styles.amountCol}>
          <Text style={styles.amountLabel}>{t('amountDue')}</Text>
          <Text style={styles.amountValue}>
            {t('currency')} {bill.amount.toLocaleString()}
          </Text>
        </View>
      </View>

      {/* Progress */}
      <View style={styles.progressSection}>
        <ProgressIndicator collected={bill.collectedAmount} total={bill.amount} />
      </View>

      {/* Footer Actions */}
      <View style={styles.footerRow}>
        <View style={styles.remainingInfo}>
          <Text style={styles.remainingLabel}>{t('remainingAmount')}:</Text>
          <Text style={styles.remainingValue}>
            {t('currency')} {remaining.toLocaleString()}
          </Text>
        </View>

        <GradientButton
          title={t('donateBtn')}
          size="sm"
          onPress={onDonatePress}
          style={styles.donateButton}
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
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    marginRight: SPACING.md,
  },
  avatarCircle: {
    width: 46,
    height: 46,
    borderRadius: RADIUS.round,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleCol: {
    flex: 1,
  },
  providerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 4,
  },
  providerText: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.deepPurple,
  },
  urgentBadge: {
    backgroundColor: COLORS.dangerBg,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: RADIUS.round,
  },
  urgentText: {
    fontSize: 9,
    fontWeight: '700',
    color: COLORS.danger,
  },
  cityText: {
    fontSize: 12,
    color: COLORS.mutedText,
    marginTop: 2,
  },
  amountCol: {
    alignItems: 'flex-end',
  },
  amountLabel: {
    fontSize: 10,
    color: COLORS.mutedText,
    fontWeight: '600',
  },
  amountValue: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.primaryPink,
  },
  progressSection: {
    marginTop: SPACING.sm,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: SPACING.sm,
    paddingTop: SPACING.sm,
    borderTopWidth: 1,
    borderTopColor: COLORS.borderLight,
  },
  remainingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  remainingLabel: {
    fontSize: 12,
    color: COLORS.mutedText,
  },
  remainingValue: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.deepPurple,
  },
  donateButton: {
    minWidth: 110,
  },
});

