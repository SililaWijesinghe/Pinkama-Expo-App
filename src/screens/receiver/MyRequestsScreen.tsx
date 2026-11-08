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
import { COLORS, RADIUS, SHADOWS, SPACING } from '../../constants/theme';
import { useLanguage } from '../../context/LanguageContext';
import { useBills } from '../../context/BillContext';
import { BillRequest } from '../../types';
import { PinkamaHeader } from '../../components/common/PinkamaHeader';
import { BillRequestCard } from '../../components/cards/BillRequestCard';
import { StatusBadge } from '../../components/common/StatusBadge';
import { ProgressIndicator } from '../../components/common/ProgressIndicator';
import { GradientButton } from '../../components/common/GradientButton';

interface MyRequestsScreenProps {
  onStartUpload: () => void;
  onNotificationPress: () => void;
}

export const MyRequestsScreen: React.FC<MyRequestsScreenProps> = ({
  onStartUpload,
  onNotificationPress,
}) => {
  const { t } = useLanguage();
  const { bills } = useBills();

  // Tab: active vs completed (Matches Screen 8: සක්‍රිය vs අවසන්)
  const [activeTab, setActiveTab] = useState<'active' | 'completed'>('active');
  const [selectedBill, setSelectedBill] = useState<BillRequest | null>(null);

  const activeBills = bills.filter(
    (b) => b.status === 'verified' || b.status === 'pending'
  );
  const completedBills = bills.filter(
    (b) => b.status === 'funded' || b.status === 'paid'
  );

  const currentList = activeTab === 'active' ? activeBills : completedBills;

  return (
    <SafeAreaView style={styles.safeArea}>
      <PinkamaHeader
        title={t('myBillsLabel')}
        subtitle="ඔබ ඉදිරිපත් කළ ඉල්ලීම්"
        showBack={false}
        onNotificationPress={onNotificationPress}
      />

      {/* Segmented Tabs (Matches Screen 8 of reference image: සක්‍රිය (2) / අවසන් (4)) */}
      <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={[styles.tabBtn, activeTab === 'active' && styles.tabBtnActive]}
          onPress={() => setActiveTab('active')}
          accessibilityRole="tab"
          accessibilityState={{ selected: activeTab === 'active' }}
        >
          <Text
            style={[styles.tabText, activeTab === 'active' && styles.tabTextActive]}
          >
            {t('activeBillsTab')} ({activeBills.length})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabBtn, activeTab === 'completed' && styles.tabBtnActive]}
          onPress={() => setActiveTab('completed')}
          accessibilityRole="tab"
          accessibilityState={{ selected: activeTab === 'completed' }}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === 'completed' && styles.tabTextActive,
            ]}
          >
            {t('completedBillsTab')} ({completedBills.length})
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {currentList.map((bill) => (
          <BillRequestCard
            key={bill.id}
            bill={bill}
            onPress={() => setSelectedBill(bill)}
          />
        ))}

        {currentList.length === 0 && (
          <View style={styles.emptyContainer}>
            <Ionicons name="document-text-outline" size={48} color={COLORS.lightText} />
            <Text style={styles.emptyTitle}>මෙම කාණ්ඩයේ බිල්පත් නොමැත</Text>
            <Text style={styles.emptySub}>
              ඔබට අවශ්‍ය විදුලි හෝ ජල බිල්පත් සඳහා ආධාර ඉල්ලීමක් ඉදිරිපත් කළ හැක.
            </Text>
            <TouchableOpacity onPress={onStartUpload} style={styles.emptyAddBtn}>
              <Text style={styles.emptyAddText}>{t('addNewBillCta')}</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>

      {/* Detail / Tracking Modal */}
      <Modal
        visible={!!selectedBill}
        transparent
        animationType="slide"
        onRequestClose={() => setSelectedBill(null)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <View style={styles.modalTopRow}>
              <Text style={styles.modalHeading}>බිල්පත් ප්‍රගති තත්ත්වය</Text>
              <TouchableOpacity onPress={() => setSelectedBill(null)}>
                <Ionicons name="close-circle" size={24} color={COLORS.mutedText} />
              </TouchableOpacity>
            </View>

            {selectedBill && (
              <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.modalBillHeader}>
                  <View>
                    <Text style={styles.modalProvider}>
                      {selectedBill.provider} -{' '}
                      {selectedBill.billType === 'electricity'
                        ? t('electricityDonation')
                        : t('waterDonation')}
                    </Text>
                    <Text style={styles.modalAcc}>
                      {t('billNumber')}: {selectedBill.accountNumber}
                    </Text>
                  </View>
                  <StatusBadge status={selectedBill.status} />
                </View>

                {/* Progress */}
                <View style={styles.modalProgressSection}>
                  <ProgressIndicator
                    collected={selectedBill.collectedAmount}
                    total={selectedBill.amount}
                  />
                </View>

                {/* Lifecycle Tracking Steps */}
                <View style={styles.timeline}>
                  {/* Step 1: Submission */}
                  <View style={styles.timelineItem}>
                    <View style={[styles.timelineDot, styles.timelineDotComplete]}>
                      <Ionicons name="checkmark" size={14} color="#FFFFFF" />
                    </View>
                    <View style={styles.timelineTextCol}>
                      <Text style={styles.timelineTitle}>ඉල්ලීම ලැබිණි</Text>
                      <Text style={styles.timelineSub}>
                        {selectedBill.submittedAt} දින සාර්ථකව පද්ධතියට එක් විය.
                      </Text>
                    </View>
                  </View>

                  {/* Step 2: Verification */}
                  <View style={styles.timelineItem}>
                    <View
                      style={[
                        styles.timelineDot,
                        selectedBill.status !== 'pending' &&
                          styles.timelineDotComplete,
                      ]}
                    >
                      <Ionicons
                        name={
                          selectedBill.status !== 'pending'
                            ? 'checkmark'
                            : 'time-outline'
                        }
                        size={14}
                        color="#FFFFFF"
                      />
                    </View>
                    <View style={styles.timelineTextCol}>
                      <Text style={styles.timelineTitle}>
                        CEB/NWSDB සත්‍යාපනය
                      </Text>
                      <Text style={styles.timelineSub}>
                        බිල්පත් අංකය සහ හිඟ මුදල ස්වයංක්‍රීයව තහවුරු කෙරිණි.
                      </Text>
                    </View>
                  </View>

                  {/* Step 3: Funding */}
                  <View style={styles.timelineItem}>
                    <View
                      style={[
                        styles.timelineDot,
                        (selectedBill.status === 'funded' ||
                          selectedBill.status === 'paid') &&
                          styles.timelineDotComplete,
                      ]}
                    >
                      <Ionicons
                        name={
                          selectedBill.status === 'funded' ||
                          selectedBill.status === 'paid'
                            ? 'checkmark'
                            : 'heart-outline'
                        }
                        size={14}
                        color="#FFFFFF"
                      />
                    </View>
                    <View style={styles.timelineTextCol}>
                      <Text style={styles.timelineTitle}>දායකයින්ගේ දායකත්වය</Text>
                      <Text style={styles.timelineSub}>
                        {selectedBill.donorCount} දායකයින් විසින් රු.{' '}
                        {selectedBill.collectedAmount.toLocaleString()} ක් එකතු කර ඇත.
                      </Text>
                    </View>
                  </View>

                  {/* Step 4: Provider Settlement */}
                  <View style={styles.timelineItem}>
                    <View
                      style={[
                        styles.timelineDot,
                        selectedBill.status === 'paid' &&
                          styles.timelineDotComplete,
                      ]}
                    >
                      <Ionicons
                        name={
                          selectedBill.status === 'paid'
                            ? 'checkmark-done'
                            : 'business-outline'
                        }
                        size={14}
                        color="#FFFFFF"
                      />
                    </View>
                    <View style={styles.timelineTextCol}>
                      <Text style={styles.timelineTitle}>
                        සෘජු බිල්පත් පියවීම
                      </Text>
                      <Text style={styles.timelineSub}>
                        අදාළ විදුලි බල හෝ ජල සම්පාදන මණ්ඩලයට සෘජුවම ගෙවීම් වාර්තා වේ.
                      </Text>
                    </View>
                  </View>
                </View>

                <GradientButton
                  title={t('close')}
                  onPress={() => setSelectedBill(null)}
                  size="md"
                  style={{ marginTop: SPACING.lg }}
                />
              </ScrollView>
            )}
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
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    padding: SPACING.sm,
    marginHorizontal: SPACING.lg,
    marginTop: SPACING.md,
    borderRadius: RADIUS.round,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.soft,
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: RADIUS.round,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabBtnActive: {
    backgroundColor: COLORS.primaryPink,
  },
  tabText: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.deepPurple,
  },
  tabTextActive: {
    color: '#FFFFFF',
  },
  scrollContent: {
    padding: SPACING.lg,
    paddingBottom: SPACING.xxxl,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.xxxl,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.deepPurple,
    marginTop: SPACING.md,
  },
  emptySub: {
    fontSize: 13,
    color: COLORS.mutedText,
    textAlign: 'center',
    marginTop: 4,
    paddingHorizontal: SPACING.xl,
  },
  emptyAddBtn: {
    marginTop: SPACING.lg,
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: COLORS.primaryPink,
    borderRadius: RADIUS.round,
  },
  emptyAddText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
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
    maxHeight: '85%',
    backgroundColor: '#FFFFFF',
    borderRadius: RADIUS.xl,
    padding: SPACING.xl,
    ...SHADOWS.card,
  },
  modalTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
    paddingBottom: SPACING.sm,
    marginBottom: SPACING.md,
  },
  modalHeading: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.deepPurple,
  },
  modalBillHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  modalProvider: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.deepPurple,
  },
  modalAcc: {
    fontSize: 12,
    color: COLORS.mutedText,
    marginTop: 2,
  },
  modalProgressSection: {
    marginTop: SPACING.md,
    marginBottom: SPACING.lg,
  },
  timeline: {
    paddingLeft: 4,
    gap: SPACING.md,
  },
  timelineItem: {
    flexDirection: 'row',
    gap: SPACING.md,
    alignItems: 'flex-start',
  },
  timelineDot: {
    width: 26,
    height: 26,
    borderRadius: RADIUS.round,
    backgroundColor: COLORS.borderLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  timelineDotComplete: {
    backgroundColor: COLORS.success,
  },
  timelineTextCol: {
    flex: 1,
  },
  timelineTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.deepPurple,
  },
  timelineSub: {
    fontSize: 11,
    color: COLORS.mutedText,
    marginTop: 2,
    lineHeight: 16,
  },
});

