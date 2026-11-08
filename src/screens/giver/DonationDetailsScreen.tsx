import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, RADIUS, SHADOWS, SPACING } from '../../constants/theme';
import { useLanguage } from '../../context/LanguageContext';
import { BillRequest } from '../../types';
import { PinkamaHeader } from '../../components/common/PinkamaHeader';
import { StatusBadge } from '../../components/common/StatusBadge';
import { ProgressIndicator } from '../../components/common/ProgressIndicator';
import { CustomInput } from '../../components/common/CustomInput';
import { GradientButton } from '../../components/common/GradientButton';

interface DonationDetailsScreenProps {
  bill: BillRequest;
  onBack: () => void;
  onProceedToPayment: (bill: BillRequest, donationAmount: number) => void;
}

export const DonationDetailsScreen: React.FC<DonationDetailsScreenProps> = ({
  bill,
  onBack,
  onProceedToPayment,
}) => {
  const { t } = useLanguage();
  const isElectricity = bill.billType === 'electricity';
  const remaining = Math.max(0, bill.amount - bill.collectedAmount);

  const [donationAmount, setDonationAmount] = useState<string>(
    remaining.toString()
  );

  const handleFullPayoff = () => {
    setDonationAmount(remaining.toString());
  };

  const handlePartial = (fraction: number) => {
    const val = Math.round(remaining * fraction);
    setDonationAmount(val.toString());
  };

  const parsedAmount = parseFloat(donationAmount) || 0;
  const isValidAmount = parsedAmount > 0 && parsedAmount <= remaining;

  return (
    <SafeAreaView style={styles.safeArea}>
      <PinkamaHeader
        title={t('billDetailsTitle')}
        subtitle={bill.city}
        showBack
        onBack={onBack}
      />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Bill Overview Header Card */}
        <View style={styles.overviewCard}>
          <View style={styles.topRow}>
            <View
              style={[
                styles.iconBadge,
                { backgroundColor: isElectricity ? COLORS.electricityBg : COLORS.waterBg },
              ]}
            >
              <Ionicons
                name={isElectricity ? 'flash' : 'water'}
                size={26}
                color={isElectricity ? COLORS.electricity : COLORS.water}
              />
            </View>
            <View style={styles.badgeCol}>
              <Text style={styles.providerTitle}>
                {bill.provider} - {isElectricity ? t('electricityDonation') : t('waterDonation')}
              </Text>
              <StatusBadge status={bill.status} />
            </View>
          </View>

          {/* Simulated Utility Bill Preview (Matches Screen 7/8 in reference) */}
          <View style={styles.billMockPreview}>
            <View style={styles.billMockHeader}>
              <Text style={styles.billMockLogo}>
                {bill.provider === 'CEB' ? 'CEB ⚡' : 'NWSDB 💧'}
              </Text>
              <Text style={styles.billMockType}>
                {bill.provider === 'CEB' ? 'ELECTRICITY BILL' : 'WATER TARIFF INVOICE'}
              </Text>
            </View>
            <View style={styles.billMockLines}>
              <View style={styles.billLine} />
              <View style={[styles.billLine, { width: '80%' }]} />
              <View style={[styles.billLine, { width: '60%' }]} />
            </View>
            <View style={styles.billMockFooter}>
              <Text style={styles.verifiedWatermark}>
                🛡️ CEB/NWSDB සත්‍යාපිත බිල්පතකි
              </Text>
            </View>
          </View>

          {/* Details Grid */}
          <View style={styles.detailsGrid}>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>{t('receiverName')}:</Text>
              <Text style={styles.detailValue}>{bill.accountHolderName}</Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>{t('district')} / {t('city')}:</Text>
              <Text style={styles.detailValue}>
                {bill.district} - {bill.city}
              </Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>{t('billNumber')}:</Text>
              <Text style={[styles.detailValue, styles.monoText]}>
                {bill.accountNumber}
              </Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>{t('dueDate')}:</Text>
              <Text style={[styles.detailValue, { color: COLORS.danger }]}>
                {bill.dueDate}
              </Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>{t('amountDue')}:</Text>
              <Text style={[styles.detailValue, styles.highlightAmount]}>
                {t('currency')} {bill.amount.toLocaleString()}
              </Text>
            </View>
          </View>

          {/* Progress */}
          <View style={styles.progressBox}>
            <Text style={styles.progressTitle}>දානමය එකතු කිරීම් තත්ත්වය</Text>
            <ProgressIndicator
              collected={bill.collectedAmount}
              total={bill.amount}
            />
            <View style={styles.remainingStrip}>
              <Text style={styles.remainingText}>
                {t('remainingAmount')}:{' '}
                <Text style={styles.remainingBold}>
                  {t('currency')} {remaining.toLocaleString()}
                </Text>
              </Text>
            </View>
          </View>
        </View>

        {/* Family Story */}
        {bill.familyStory && (
          <View style={styles.storyCard}>
            <View style={styles.storyHeader}>
              <Ionicons name="information-circle" size={18} color={COLORS.deepPurple} />
              <Text style={styles.storyTitle}>පවුලේ තත්ත්වය පිළිබඳ සටහන</Text>
            </View>
            <Text style={styles.storyContent}>{bill.familyStory}</Text>
          </View>
        )}

        {/* Donation Amount Selection */}
        <View style={styles.donationInputCard}>
          <Text style={styles.inputSectionTitle}>
            {t('customDonationAmount')}
          </Text>

          {/* Quick preset buttons */}
          <View style={styles.presetsRow}>
            <TouchableOpacity
              style={[
                styles.presetPill,
                donationAmount === remaining.toString() && styles.presetPillActive,
              ]}
              onPress={handleFullPayoff}
              accessibilityRole="button"
            >
              <Text
                style={[
                  styles.presetText,
                  donationAmount === remaining.toString() && styles.presetTextActive,
                ]}
              >
                {t('fullAmountCta')} ({t('currency')} {remaining.toLocaleString()})
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.presetPill}
              onPress={() => handlePartial(0.5)}
              accessibilityRole="button"
            >
              <Text style={styles.presetText}>50%</Text>
            </TouchableOpacity>
          </View>

          <CustomInput
            label=""
            value={donationAmount}
            onChangeText={setDonationAmount}
            keyboardType="numeric"
            iconName="cash-outline"
            helperText={`උපරිම දායකත්වය: ${t('currency')} ${remaining.toLocaleString()}`}
            error={
              parsedAmount > remaining
                ? `බිල්පතේ ඉතිරි මුදල වන රු. ${remaining.toLocaleString()} නොඉක්මවිය හැක.`
                : parsedAmount <= 0
                ? 'කරුණාකර වලංගු මුදලක් ඇතුළත් කරන්න.'
                : undefined
            }
          />

          <GradientButton
            title={t('proceedToDonate')}
            onPress={() => onProceedToPayment(bill, parsedAmount)}
            disabled={!isValidAmount}
            size="lg"
            style={styles.proceedButton}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    padding: SPACING.lg,
    paddingBottom: SPACING.xxxl,
  },
  overviewCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: RADIUS.xl,
    padding: SPACING.xl,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.card,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
    marginBottom: SPACING.lg,
  },
  iconBadge: {
    width: 52,
    height: 52,
    borderRadius: RADIUS.round,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeCol: {
    flex: 1,
    gap: 4,
  },
  providerTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.deepPurple,
  },
  billMockPreview: {
    backgroundColor: '#F8FAFC',
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderStyle: 'dashed',
    marginBottom: SPACING.lg,
  },
  billMockHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    paddingBottom: 6,
    marginBottom: 8,
  },
  billMockLogo: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.deepPurple,
  },
  billMockType: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.mutedText,
  },
  billMockLines: {
    gap: 6,
    marginVertical: 4,
  },
  billLine: {
    height: 6,
    backgroundColor: '#E2E8F0',
    borderRadius: 3,
    width: '100%',
  },
  billMockFooter: {
    marginTop: 8,
    alignItems: 'center',
  },
  verifiedWatermark: {
    fontSize: 11,
    color: COLORS.success,
    fontWeight: '700',
  },
  detailsGrid: {
    gap: SPACING.sm,
    borderTopWidth: 1,
    borderTopColor: COLORS.borderLight,
    paddingTop: SPACING.md,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: 13,
    color: COLORS.mutedText,
    fontWeight: '600',
  },
  detailValue: {
    fontSize: 14,
    color: COLORS.deepPurple,
    fontWeight: '700',
  },
  monoText: {
    letterSpacing: 1,
  },
  highlightAmount: {
    fontSize: 16,
    color: COLORS.primaryPink,
    fontWeight: '800',
  },
  progressBox: {
    marginTop: SPACING.lg,
    paddingTop: SPACING.md,
    borderTopWidth: 1,
    borderTopColor: COLORS.borderLight,
  },
  progressTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.deepPurple,
    marginBottom: 6,
  },
  remainingStrip: {
    alignItems: 'flex-end',
    marginTop: 4,
  },
  remainingText: {
    fontSize: 12,
    color: COLORS.mutedText,
  },
  remainingBold: {
    color: COLORS.primaryPink,
    fontWeight: '800',
  },
  storyCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    marginTop: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.soft,
  },
  storyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 6,
  },
  storyTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.deepPurple,
  },
  storyContent: {
    fontSize: 13,
    color: COLORS.darkText,
    lineHeight: 20,
  },
  donationInputCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: RADIUS.xl,
    padding: SPACING.xl,
    marginTop: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.card,
  },
  inputSectionTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.deepPurple,
    marginBottom: SPACING.sm,
  },
  presetsRow: {
    flexDirection: 'row',
    gap: SPACING.sm,
    marginBottom: SPACING.md,
  },
  presetPill: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: RADIUS.round,
    backgroundColor: COLORS.softLavender,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  presetPillActive: {
    backgroundColor: COLORS.primaryPink,
    borderColor: COLORS.primaryPink,
  },
  presetText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.deepPurple,
  },
  presetTextActive: {
    color: '#FFFFFF',
  },
  proceedButton: {
    marginTop: SPACING.sm,
  },
});

