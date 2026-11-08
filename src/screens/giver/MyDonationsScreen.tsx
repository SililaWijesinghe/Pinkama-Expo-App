import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, RADIUS, SHADOWS, SPACING } from '../../constants/theme';
import { useLanguage } from '../../context/LanguageContext';
import { useBills } from '../../context/BillContext';
import { DonationRecord } from '../../types';
import { PinkamaHeader } from '../../components/common/PinkamaHeader';
import { GradientButton } from '../../components/common/GradientButton';

interface MyDonationsScreenProps {
  onBack?: () => void;
  onNotificationPress: () => void;
}

export const MyDonationsScreen: React.FC<MyDonationsScreenProps> = ({
  onBack,
  onNotificationPress,
}) => {
  const { t } = useLanguage();
  const { donations, totalDonated, familiesAssistedCount } = useBills();
  const [selectedReceipt, setSelectedReceipt] = useState<DonationRecord | null>(null);

  return (
    <SafeAreaView style={styles.safeArea}>
      <PinkamaHeader
        title={t('myDonations')}
        subtitle={`${donations.length} සම්පූර්ණ කළ දානයන්`}
        showBack={false}
        onNotificationPress={onNotificationPress}
      />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Total Summary Card */}
        <LinearGradient
          colors={COLORS.primaryGradient}
          style={styles.summaryCard}
        >
          <View style={styles.summaryTop}>
            <View>
              <Text style={styles.summarySub}>{t('totalDonatedLabel')}</Text>
              <Text style={styles.summaryAmount}>
                {t('currency')} {totalDonated.toLocaleString()}
              </Text>
            </View>
            <View style={styles.heartIconBox}>
              <Ionicons name="heart" size={28} color="#FFFFFF" />
            </View>
          </View>

          <View style={styles.summaryBottom}>
            <Text style={styles.assistedText}>
              🛡️ පවුල් {familiesAssistedCount} කට සෘජු ආධාර ලබා දී ඇත
            </Text>
          </View>
        </LinearGradient>

        <Text style={styles.historyTitle}>පරිත්‍යාග ඉතිහාසය / Donation History</Text>

        {/* List of Donations */}
        {donations.map((don) => {
          const isElectricity = don.billType === 'electricity';
          return (
            <View key={don.id} style={styles.donationItem}>
              <View style={styles.itemHeader}>
                <View
                  style={[
                    styles.itemIconBox,
                    {
                      backgroundColor: isElectricity
                        ? COLORS.electricityBg
                        : COLORS.waterBg,
                    },
                  ]}
                >
                  <Ionicons
                    name={isElectricity ? 'flash' : 'water'}
                    size={20}
                    color={isElectricity ? COLORS.electricity : COLORS.water}
                  />
                </View>

                <View style={styles.itemTitleCol}>
                  <Text style={styles.itemProvider}>
                    {don.provider} - {isElectricity ? t('electricityDonation') : t('waterDonation')}
                  </Text>
                  <Text style={styles.itemRecipient}>
                    {don.recipientName} ({don.city})
                  </Text>
                </View>

                <View style={styles.itemAmountCol}>
                  <Text style={styles.itemAmount}>
                    {t('currency')} {don.amount.toLocaleString()}
                  </Text>
                  <Text style={styles.itemReceiptBadge}>{don.receiptNo}</Text>
                </View>
              </View>

              <View style={styles.itemFooter}>
                <Text style={styles.itemDate}>
                  <Ionicons name="time-outline" size={12} color={COLORS.mutedText} />{' '}
                  {don.donatedAt}
                </Text>

                <TouchableOpacity
                  style={styles.receiptButton}
                  onPress={() => setSelectedReceipt(don)}
                  accessibilityRole="button"
                >
                  <Ionicons name="receipt-outline" size={14} color={COLORS.primaryPink} />
                  <Text style={styles.receiptButtonText}>රිසිට්පත බලන්න</Text>
                </TouchableOpacity>
              </View>
            </View>
          );
        })}
      </ScrollView>

      {/* Receipt Modal */}
      <Modal
        visible={!!selectedReceipt}
        transparent
        animationType="fade"
        onRequestClose={() => setSelectedReceipt(null)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <View style={styles.receiptModalHeader}>
              <Text style={styles.receiptModalBrand}>පිංකම Pinkama</Text>
              <TouchableOpacity onPress={() => setSelectedReceipt(null)}>
                <Ionicons name="close-circle" size={24} color={COLORS.mutedText} />
              </TouchableOpacity>
            </View>

            {selectedReceipt && (
              <View style={styles.receiptBody}>
                <View style={styles.receiptStatusRow}>
                  <Ionicons name="checkmark-circle" size={20} color={COLORS.success} />
                  <Text style={styles.receiptStatusText}>
                    සෘජු සේවා සැපයුම් ගෙවීම සත්‍යාපිතයි
                  </Text>
                </View>

                <View style={styles.receiptDivider} />

                <View style={styles.receiptRow}>
                  <Text style={styles.receiptLabel}>{t('receiptNo')}:</Text>
                  <Text style={styles.receiptValBold}>{selectedReceipt.receiptNo}</Text>
                </View>

                <View style={styles.receiptRow}>
                  <Text style={styles.receiptLabel}>{t('receiverName')}:</Text>
                  <Text style={styles.receiptVal}>{selectedReceipt.recipientName}</Text>
                </View>

                <View style={styles.receiptRow}>
                  <Text style={styles.receiptLabel}>{t('city')}:</Text>
                  <Text style={styles.receiptVal}>{selectedReceipt.city}</Text>
                </View>

                <View style={styles.receiptRow}>
                  <Text style={styles.receiptLabel}>{t('utilityProvider')}:</Text>
                  <Text style={styles.receiptVal}>
                    {selectedReceipt.provider} (No. {selectedReceipt.accountNumber})
                  </Text>
                </View>

                <View style={styles.receiptRow}>
                  <Text style={styles.receiptLabel}>{t('transactionDate')}:</Text>
                  <Text style={styles.receiptVal}>{selectedReceipt.donatedAt}</Text>
                </View>

                <View style={[styles.receiptRow, styles.receiptTotalRow]}>
                  <Text style={styles.receiptTotalLabel}>පරිත්‍යාග මුදල:</Text>
                  <Text style={styles.receiptTotalVal}>
                    {t('currency')} {selectedReceipt.amount.toLocaleString()}
                  </Text>
                </View>

                <Text style={styles.blessingText}>
                  "දිවිමග එකළු කරන පුණ්‍ය දාන පාරමිතාවන් ඔබට සෙත සලසාවා!"
                </Text>
              </View>
            )}

            <GradientButton
              title={t('close')}
              onPress={() => setSelectedReceipt(null)}
              size="sm"
              style={{ width: '100%', marginTop: SPACING.md }}
            />
          </View>
        </View>
      </Modal>
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
  summaryCard: {
    borderRadius: RADIUS.xl,
    padding: SPACING.xl,
    marginBottom: SPACING.lg,
    ...SHADOWS.card,
  },
  summaryTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  summarySub: {
    fontSize: 13,
    color: '#FFE2F1',
    fontWeight: '700',
  },
  summaryAmount: {
    fontSize: 26,
    fontWeight: '800',
    color: '#FFFFFF',
    marginTop: 4,
  },
  heartIconBox: {
    width: 50,
    height: 50,
    borderRadius: RADIUS.round,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  summaryBottom: {
    marginTop: SPACING.md,
    paddingTop: SPACING.sm,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.2)',
  },
  assistedText: {
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: '700',
  },
  historyTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.deepPurple,
    marginBottom: SPACING.md,
  },
  donationItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.soft,
  },
  itemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemIconBox: {
    width: 42,
    height: 42,
    borderRadius: RADIUS.round,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
  },
  itemTitleCol: {
    flex: 1,
  },
  itemProvider: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.deepPurple,
  },
  itemRecipient: {
    fontSize: 12,
    color: COLORS.mutedText,
    marginTop: 2,
  },
  itemAmountCol: {
    alignItems: 'flex-end',
  },
  itemAmount: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.primaryPink,
  },
  itemReceiptBadge: {
    fontSize: 10,
    color: COLORS.lightText,
    marginTop: 2,
  },
  itemFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: SPACING.sm,
    paddingTop: SPACING.sm,
    borderTopWidth: 1,
    borderTopColor: COLORS.borderLight,
  },
  itemDate: {
    fontSize: 11,
    color: COLORS.mutedText,
  },
  receiptButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: RADIUS.round,
    backgroundColor: COLORS.softLavender,
  },
  receiptButtonText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.primaryPink,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(33, 16, 45, 0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.lg,
  },
  modalCard: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: RADIUS.xl,
    padding: SPACING.xl,
    ...SHADOWS.card,
  },
  receiptModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
    paddingBottom: SPACING.sm,
    marginBottom: SPACING.md,
  },
  receiptModalBrand: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.deepPurple,
  },
  receiptBody: {
    gap: SPACING.sm,
  },
  receiptStatusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: COLORS.successBg,
    padding: SPACING.sm,
    borderRadius: RADIUS.md,
  },
  receiptStatusText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#065F46',
  },
  receiptDivider: {
    height: 1,
    backgroundColor: COLORS.borderLight,
    marginVertical: 4,
  },
  receiptRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  receiptLabel: {
    fontSize: 12,
    color: COLORS.mutedText,
  },
  receiptVal: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.darkText,
  },
  receiptValBold: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.deepPurple,
  },
  receiptTotalRow: {
    borderTopWidth: 1,
    borderTopColor: COLORS.borderLight,
    paddingTop: SPACING.sm,
    marginTop: 4,
  },
  receiptTotalLabel: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.deepPurple,
  },
  receiptTotalVal: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.primaryPink,
  },
  blessingText: {
    fontSize: 11,
    fontStyle: 'italic',
    color: COLORS.mutedText,
    textAlign: 'center',
    marginTop: SPACING.sm,
  },
});

