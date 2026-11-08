import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, RADIUS, SHADOWS, SPACING } from '../../constants/theme';
import { useLanguage } from '../../context/LanguageContext';
import { useBills } from '../../context/BillContext';
import { BillRequest } from '../../types';
import { PinkamaHeader } from '../../components/common/PinkamaHeader';
import { BillRequestCard } from '../../components/cards/BillRequestCard';

interface ReceiverHomeScreenProps {
  onNavigateTab: (tab: any) => void;
  onOpenBillDetails: (bill: BillRequest) => void;
  onStartUpload: () => void;
}

export const ReceiverHomeScreen: React.FC<ReceiverHomeScreenProps> = ({
  onNavigateTab,
  onOpenBillDetails,
  onStartUpload,
}) => {
  const { t } = useLanguage();
  const { bills } = useBills();

  // Filter bills submitted by or relevant to receivers
  const receiverBills = bills.slice(0, 3);
  const activeCount = bills.filter((b) => b.status === 'verified' || b.status === 'pending').length;
  const fundedCount = bills.filter((b) => b.status === 'funded' || b.status === 'paid').length;

  return (
    <SafeAreaView style={styles.safeArea}>
      <PinkamaHeader onNotificationPress={() => onNavigateTab('alerts')} />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Welcome Greeting Banner (Matches Screen 5 of reference image) */}
        <LinearGradient
          colors={COLORS.softGradient}
          style={styles.greetingBanner}
        >
          <View style={styles.greetingCol}>
            <Text style={styles.greetingHi}>{t('receiverGreeting')}</Text>
            <Text style={styles.greetingRoleSub}>{t('receiverWelcomeSub')}</Text>
            <Text style={styles.supportHeadline}>
              "{t('receiverHeadline')}"
            </Text>
          </View>

          {/* Document Illustration */}
          <View style={styles.docIllustration}>
            <LinearGradient
              colors={COLORS.purpleGradient}
              style={styles.docCircle}
            >
              <Ionicons name="document-text" size={30} color="#FFFFFF" />
            </LinearGradient>
          </View>
        </LinearGradient>

        {/* Big CTA: නව බිල්පතක් එක් කරන්න + (Matches Screen 5) */}
        <TouchableOpacity
          activeOpacity={0.88}
          style={styles.addBillButton}
          onPress={onStartUpload}
          accessibilityRole="button"
        >
          <LinearGradient
            colors={COLORS.primaryGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.addBillGradient}
          >
            <Ionicons name="add-circle" size={24} color="#FFFFFF" />
            <Text style={styles.addBillText}>{t('addNewBillCta')}</Text>
          </LinearGradient>
        </TouchableOpacity>

        {/* Quick Nav Cards: "මගේ බිල්පත්" and "ලැබුණු දානයන්" (Matches Screen 5) */}
        <View style={styles.quickNavGrid}>
          {/* Card 1: මගේ බිල්පත් */}
          <TouchableOpacity
            activeOpacity={0.85}
            style={styles.quickNavCard}
            onPress={() => onNavigateTab('requests')}
            accessibilityRole="button"
          >
            <View style={[styles.navIconBox, { backgroundColor: COLORS.softLavender }]}>
              <Ionicons name="document-text-outline" size={24} color={COLORS.deepPurple} />
            </View>
            <Text style={styles.navCardTitle}>{t('myBillsLabel')}</Text>
            <View style={styles.badgeSmall}>
              <Text style={styles.badgeSmallText}>{activeCount} සක්‍රියයි</Text>
            </View>
          </TouchableOpacity>

          {/* Card 2: ලැබුණු දානයන් */}
          <TouchableOpacity
            activeOpacity={0.85}
            style={styles.quickNavCard}
            onPress={() => onNavigateTab('requests')}
            accessibilityRole="button"
          >
            <View style={[styles.navIconBox, { backgroundColor: '#FCE7F3' }]}>
              <Ionicons name="gift-outline" size={24} color={COLORS.primaryPink} />
            </View>
            <Text style={styles.navCardTitle}>{t('receivedDonationsLabel')}</Text>
            <View style={styles.badgeSmall}>
              <Text style={styles.badgeSmallText}>{fundedCount} ලැබී ඇත</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Supporting Slogan Banner */}
        <View style={styles.supportingCard}>
          <Ionicons name="shield-checkmark" size={20} color={COLORS.accentBlue} />
          <Text style={styles.supportingText}>
            {t('receiverSupportingText')}
          </Text>
        </View>

        {/* Recent Submitted Bills */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>මෑතකදී ඉදිරිපත් කළ බිල්පත්</Text>
          <TouchableOpacity onPress={() => onNavigateTab('requests')}>
            <Text style={styles.seeAllText}>සියල්ල බලන්න →</Text>
          </TouchableOpacity>
        </View>

        {receiverBills.map((bill) => (
          <BillRequestCard
            key={bill.id}
            bill={bill}
            onPress={() => onOpenBillDetails(bill)}
          />
        ))}
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
  greetingBanner: {
    flexDirection: 'row',
    borderRadius: RADIUS.xl,
    padding: SPACING.lg,
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.card,
  },
  greetingCol: {
    flex: 1,
    paddingRight: SPACING.sm,
  },
  greetingHi: {
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.deepPurple,
  },
  greetingRoleSub: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.primaryPink,
    marginTop: 2,
  },
  supportHeadline: {
    fontSize: 13,
    color: COLORS.darkText,
    marginTop: 8,
    fontWeight: '600',
    fontStyle: 'italic',
  },
  docIllustration: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  docCircle: {
    width: 60,
    height: 60,
    borderRadius: RADIUS.round,
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.button,
  },
  addBillButton: {
    marginTop: SPACING.lg,
    borderRadius: RADIUS.round,
    overflow: 'hidden',
    ...SHADOWS.button,
  },
  addBillGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    gap: SPACING.sm,
  },
  addBillText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  quickNavGrid: {
    flexDirection: 'row',
    gap: SPACING.md,
    marginTop: SPACING.lg,
  },
  quickNavCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.soft,
  },
  navIconBox: {
    width: 50,
    height: 50,
    borderRadius: RADIUS.round,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.sm,
  },
  navCardTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.deepPurple,
    textAlign: 'center',
  },
  badgeSmall: {
    marginTop: 6,
    backgroundColor: COLORS.softLavender,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: RADIUS.round,
  },
  badgeSmallText: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.primaryPink,
  },
  supportingCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    backgroundColor: '#F0F9FF',
    padding: SPACING.md,
    borderRadius: RADIUS.md,
    marginTop: SPACING.lg,
    borderWidth: 1,
    borderColor: '#BAE6FD',
  },
  supportingText: {
    fontSize: 12,
    color: '#0369A1',
    flex: 1,
    lineHeight: 18,
    fontWeight: '600',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: SPACING.xl,
    marginBottom: SPACING.sm,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.deepPurple,
  },
  seeAllText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.primaryPink,
  },
});

