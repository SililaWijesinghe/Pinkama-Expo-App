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
import { BillRequest, DonationRecord, PaymentMethod } from '../../types';
import { PinkamaHeader } from '../../components/common/PinkamaHeader';
import { GradientButton } from '../../components/common/GradientButton';

interface DonationPaymentScreenProps {
  bill: BillRequest;
  donationAmount: number;
  onBack: () => void;
  onPaymentSuccess: (donation: DonationRecord) => void;
}

export const DonationPaymentScreen: React.FC<DonationPaymentScreenProps> = ({
  bill,
  donationAmount,
  onBack,
  onPaymentSuccess,
}) => {
  const { t } = useLanguage();
  const { donateToBill } = useBills();

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('card');
  const [isProcessing, setIsProcessing] = useState(false);
  const [createdDonation, setCreatedDonation] = useState<DonationRecord | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const isElectricity = bill.billType === 'electricity';

  const handlePayNow = () => {
    setIsProcessing(true);
    // Simulate real gateway handshake
    setTimeout(() => {
      const rec = donateToBill(bill.id, donationAmount, paymentMethod);
      setIsProcessing(false);
      if (rec) {
        setCreatedDonation(rec);
        setShowSuccessModal(true);
      }
    }, 1200);
  };

  const handleFinish = () => {
    setShowSuccessModal(false);
    if (createdDonation) {
      onPaymentSuccess(createdDonation);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <PinkamaHeader
        title={t('paymentTitle')}
        subtitle={bill.provider}
        showBack
        onBack={onBack}
      />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Bill Summary Card (Matches Screen 4 of reference image) */}
        <View style={styles.card}>
          <View style={styles.iconCircleContainer}>
            <View
              style={[
                styles.iconCircle,
                { backgroundColor: isElectricity ? COLORS.electricityBg : COLORS.waterBg },
              ]}
            >
              <Ionicons
                name={isElectricity ? 'flash' : 'water'}
                size={32}
                color={isElectricity ? COLORS.electricity : COLORS.water}
              />
            </View>
            <Text style={styles.billHeaderTitle}>
              {bill.provider} - {isElectricity ? t('electricityDonation') : t('waterDonation')}
            </Text>
          </View>

          {/* Details Table */}
          <View style={styles.table}>
            <View style={styles.tableRow}>
              <Text style={styles.tableLabel}>{t('receiverName')} :</Text>
              <Text style={styles.tableValue}>{bill.accountHolderName}</Text>
            </View>

            <View style={styles.tableRow}>
              <Text style={styles.tableLabel}>{t('city')} :</Text>
              <Text style={styles.tableValue}>{bill.city}</Text>
            </View>

            <View style={styles.tableRow}>
              <Text style={styles.tableLabel}>{t('billNumber')} :</Text>
              <Text style={[styles.tableValue, styles.mono]}>
                {bill.accountNumber}
              </Text>
            </View>

            <View style={[styles.tableRow, styles.totalRow]}>
              <Text style={styles.totalLabel}>{t('amountDue')} :</Text>
              <Text style={styles.totalValue}>
                {t('currency')} {donationAmount.toLocaleString()}
              </Text>
            </View>
          </View>
        </View>

        {/* Payment Method Selector (Matches Screen 4 of reference image) */}
        <View style={styles.card}>
          <Text style={styles.sectionHeading}>{t('selectPaymentMethod')}</Text>

          {/* Method 1: Visa / Mastercard */}
          <TouchableOpacity
            style={[
              styles.methodOption,
              paymentMethod === 'card' && styles.methodOptionActive,
            ]}
            onPress={() => setPaymentMethod('card')}
            accessibilityRole="radio"
            accessibilityState={{ checked: paymentMethod === 'card' }}
          >
            <View style={styles.methodLeft}>
              <View style={[styles.radioDot, paymentMethod === 'card' && styles.radioDotActive]} />
              <Ionicons name="card" size={24} color={COLORS.primaryPink} />
              <View>
                <Text style={styles.methodTitle}>{t('cardPayment')}</Text>
                <Text style={styles.methodSub}>Debit / Credit Card (Secure 3D)</Text>
              </View>
            </View>
          </TouchableOpacity>

          {/* Method 2: PayHere (Sri Lanka) */}
          <TouchableOpacity
            style={[
              styles.methodOption,
              paymentMethod === 'payhere' && styles.methodOptionActive,
            ]}
            onPress={() => setPaymentMethod('payhere')}
            accessibilityRole="radio"
            accessibilityState={{ checked: paymentMethod === 'payhere' }}
          >
            <View style={styles.methodLeft}>
              <View style={[styles.radioDot, paymentMethod === 'payhere' && styles.radioDotActive]} />
              <Ionicons name="phone-portrait-outline" size={24} color={COLORS.accentBlue} />
              <View>
                <Text style={styles.methodTitle}>{t('payherePayment')}</Text>
                <Text style={styles.methodSub}>Genie / eZ Cash / FriMi / mCash</Text>
              </View>
            </View>
          </TouchableOpacity>

          {/* Method 3: Direct Utility Settlement */}
          <TouchableOpacity
            style={[
              styles.methodOption,
              paymentMethod === 'bank_transfer' && styles.methodOptionActive,
            ]}
            onPress={() => setPaymentMethod('bank_transfer')}
            accessibilityRole="radio"
            accessibilityState={{ checked: paymentMethod === 'bank_transfer' }}
          >
            <View style={styles.methodLeft}>
              <View style={[styles.radioDot, paymentMethod === 'bank_transfer' && styles.radioDotActive]} />
              <Ionicons name="business" size={24} color={COLORS.deepPurple} />
              <View>
                <Text style={styles.methodTitle}>{t('bankPayment')}</Text>
                <Text style={styles.methodSub}>CEB / NWSDB Direct API Settlement</Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>

        {/* Security / Non-profit Note */}
        <View style={styles.securityBox}>
          <Ionicons name="shield-checkmark" size={20} color={COLORS.success} />
          <Text style={styles.securityText}>{t('securePaymentNote')}</Text>
        </View>

        {/* Big CTA: දැන්ම දානය කරන්න */}
        <GradientButton
          title={t('confirmDonationBtn')}
          size="lg"
          onPress={handlePayNow}
          loading={isProcessing}
          style={styles.payButton}
        />
      </ScrollView>

      {/* Digital Receipt & Success Modal */}
      <Modal
        visible={showSuccessModal}
        transparent
        animationType="slide"
        onRequestClose={handleFinish}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <LinearGradient
              colors={COLORS.primaryGradient}
              style={styles.modalHeaderBadge}
            >
              <Ionicons name="checkmark-done" size={36} color="#FFFFFF" />
            </LinearGradient>

            <Text style={styles.modalTitle}>{t('paymentSuccessTitle')}</Text>
            <Text style={styles.modalMsg}>{t('paymentSuccessMsg')}</Text>

            {/* Digital Receipt Details */}
            {createdDonation && (
              <View style={styles.receiptBox}>
                <View style={styles.receiptHeader}>
                  <Text style={styles.receiptAppBrand}>පිංකම Pinkama</Text>
                  <Text style={styles.receiptBadgeText}>VERIFIED RECEIPT</Text>
                </View>

                <View style={styles.receiptRow}>
                  <Text style={styles.receiptLabel}>{t('receiptNo')}:</Text>
                  <Text style={styles.receiptValue}>{createdDonation.receiptNo}</Text>
                </View>

                <View style={styles.receiptRow}>
                  <Text style={styles.receiptLabel}>{t('receiverName')}:</Text>
                  <Text style={styles.receiptValue}>{createdDonation.recipientName}</Text>
                </View>

                <View style={styles.receiptRow}>
                  <Text style={styles.receiptLabel}>{t('utilityProvider')}:</Text>
                  <Text style={styles.receiptValue}>
                    {createdDonation.provider} (No. {createdDonation.accountNumber})
                  </Text>
                </View>

                <View style={[styles.receiptRow, styles.receiptTotalRow]}>
                  <Text style={styles.receiptTotalLabel}>{t('amountDue')}:</Text>
                  <Text style={styles.receiptTotalValue}>
                    {t('currency')} {createdDonation.amount.toLocaleString()}
                  </Text>
                </View>
              </View>
            )}

            <GradientButton
              title={t('backToHome')}
              onPress={handleFinish}
              size="md"
              style={{ width: '100%', marginTop: SPACING.lg }}
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
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: RADIUS.xl,
    padding: SPACING.xl,
    marginBottom: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.card,
  },
  iconCircleContainer: {
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: RADIUS.round,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.sm,
  },
  billHeaderTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.deepPurple,
  },
  table: {
    borderTopWidth: 1,
    borderTopColor: COLORS.borderLight,
    paddingTop: SPACING.md,
    gap: SPACING.sm + 2,
  },
  tableRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  tableLabel: {
    fontSize: 13,
    color: COLORS.mutedText,
    fontWeight: '600',
  },
  tableValue: {
    fontSize: 14,
    color: COLORS.deepPurple,
    fontWeight: '700',
  },
  mono: {
    letterSpacing: 1,
  },
  totalRow: {
    marginTop: SPACING.sm,
    paddingTop: SPACING.sm,
    borderTopWidth: 1,
    borderTopColor: COLORS.borderLight,
  },
  totalLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.deepPurple,
  },
  totalValue: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.primaryPink,
  },
  sectionHeading: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.deepPurple,
    marginBottom: SPACING.md,
  },
  methodOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: SPACING.md,
    borderRadius: RADIUS.lg,
    backgroundColor: '#FAF5FA',
    borderWidth: 1.5,
    borderColor: 'transparent',
    marginBottom: SPACING.sm,
  },
  methodOptionActive: {
    backgroundColor: '#FFF0F7',
    borderColor: COLORS.primaryPink,
  },
  methodLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
  },
  radioDot: {
    width: 18,
    height: 18,
    borderRadius: RADIUS.round,
    borderWidth: 2,
    borderColor: COLORS.mutedText,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioDotActive: {
    borderColor: COLORS.primaryPink,
    backgroundColor: COLORS.primaryPink,
  },
  methodTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.deepPurple,
  },
  methodSub: {
    fontSize: 11,
    color: COLORS.mutedText,
    marginTop: 2,
  },
  securityBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    backgroundColor: COLORS.successBg,
    padding: SPACING.md,
    borderRadius: RADIUS.md,
    marginBottom: SPACING.lg,
  },
  securityText: {
    fontSize: 12,
    color: '#065F46',
    flex: 1,
    lineHeight: 18,
    fontWeight: '600',
  },
  payButton: {
    marginBottom: SPACING.lg,
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
    alignItems: 'center',
    ...SHADOWS.card,
  },
  modalHeaderBadge: {
    width: 70,
    height: 70,
    borderRadius: RADIUS.round,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.md,
    ...SHADOWS.button,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.deepPurple,
  },
  modalMsg: {
    fontSize: 13,
    color: COLORS.mutedText,
    textAlign: 'center',
    marginTop: 6,
    lineHeight: 20,
    marginBottom: SPACING.lg,
  },
  receiptBox: {
    width: '100%',
    backgroundColor: '#F8FAFC',
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 8,
  },
  receiptHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    paddingBottom: 6,
    marginBottom: 4,
  },
  receiptAppBrand: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.deepPurple,
  },
  receiptBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: COLORS.success,
  },
  receiptRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  receiptLabel: {
    fontSize: 12,
    color: COLORS.mutedText,
  },
  receiptValue: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.deepPurple,
  },
  receiptTotalRow: {
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    paddingTop: 6,
    marginTop: 4,
  },
  receiptTotalLabel: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.deepPurple,
  },
  receiptTotalValue: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.primaryPink,
  },
});

