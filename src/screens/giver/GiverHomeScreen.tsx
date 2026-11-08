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
import { DonationCard } from '../../components/cards/DonationCard';

interface GiverHomeScreenProps {
  onNavigateTab: (tab: any) => void;
  onOpenBillDetails: (bill: BillRequest) => void;
  onDonateToBill: (bill: BillRequest) => void;
}

export const GiverHomeScreen: React.FC<GiverHomeScreenProps> = ({
  onNavigateTab,
  onOpenBillDetails,
  onDonateToBill,
}) => {
  const { t } = useLanguage();
  const { bills, setSelectedBillType, totalDonated, familiesAssistedCount, activeRequestsCount } = useBills();

  const handleFilterAndGo = (type: 'electricity' | 'water') => {
    setSelectedBillType(type);
    onNavigateTab('find');
  };

  const urgentBills = bills.filter((b) => b.status === 'verified').slice(0, 3);

  return (
    <SafeAreaView style={styles.safeArea}>
      <PinkamaHeader onNotificationPress={() => onNavigateTab('alerts')} />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Welcome Greeting Banner (Matches Screen 1 of reference image) */}
        <LinearGradient
          colors={COLORS.softGradient}
          style={styles.greetingBanner}
        >
          <View style={styles.greetingTextCol}>
            <Text style={styles.greetingHi}>{t('giverGreeting')}</Text>
            <Text style={styles.greetingRoleSub}>{t('giverWelcomeSub')}</Text>
            <Text style={styles.greetingHeadline}>"{t('giverHeadline')}"</Text>
          </View>

          <View style={styles.heartIllustration}>
            <LinearGradient
              colors={COLORS.primaryGradient}
              style={styles.heartCircle}
            >
              <Ionicons name="heart" size={32} color="#FFFFFF" />
            </LinearGradient>
          </View>
        </LinearGradient>

        {/* 4 Quick Action Cards (Directly matching Screen 1) */}
        <View style={styles.quickActionsGrid}>
          {/* Card 1: ⚡ විදුලි බිල් දානය */}
          <TouchableOpacity
            activeOpacity={0.85}
            style={styles.actionCard}
            onPress={() => handleFilterAndGo('electricity')}
            accessibilityRole="button"
          >
            <View style={[styles.actionIconBox, { backgroundColor: COLORS.electricityBg }]}>
              <Ionicons name="flash" size={24} color={COLORS.electricity} />
            </View>
            <Text style={styles.actionCardTitle}>{t('electricityDonation')}</Text>
          </TouchableOpacity>

          {/* Card 2: 💧 ජල බිල් දානය */}
          <TouchableOpacity
            activeOpacity={0.85}
            style={styles.actionCard}
            onPress={() => handleFilterAndGo('water')}
            accessibilityRole="button"
          >
            <View style={[styles.actionIconBox, { backgroundColor: COLORS.waterBg }]}>
              <Ionicons name="water" size={24} color={COLORS.water} />
            </View>
            <Text style={styles.actionCardTitle}>{t('waterDonation')}</Text>
          </TouchableOpacity>

          {/* Card 3: 🔍 බිල් සොයන්න */}
          <TouchableOpacity
            activeOpacity={0.85}
            style={styles.actionCard}
            onPress={() => onNavigateTab('find')}
            accessibilityRole="button"
          >
            <View style={[styles.actionIconBox, { backgroundColor: COLORS.softLavender }]}>
              <Ionicons name="search" size={24} color={COLORS.deepPurple} />
            </View>
            <Text style={styles.actionCardTitle}>{t('searchBills')}</Text>
          </TouchableOpacity>

          {/* Card 4: ♡ මගේ දායන් */}
          <TouchableOpacity
            activeOpacity={0.85}
            style={styles.actionCard}
            onPress={() => onNavigateTab('donations')}
            accessibilityRole="button"
          >
            <View style={[styles.actionIconBox, { backgroundColor: '#FCE7F3' }]}>
              <Ionicons name="heart-outline" size={24} color={COLORS.primaryPink} />
            </View>
            <Text style={styles.actionCardTitle}>{t('myDonations')}</Text>
          </TouchableOpacity>
        </View>

        {/* Impact Stats Strip */}
        <View style={styles.statsStrip}>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>
              {t('currency')} {totalDonated.toLocaleString()}
            </Text>
            <Text style={styles.statLabel}>{t('totalDonatedLabel')}</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{familiesAssistedCount}</Text>
            <Text style={styles.statLabel}>{t('familiesAssistedLabel')}</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{activeRequestsCount}</Text>
            <Text style={styles.statLabel}>{t('activeRequestsLabel')}</Text>
          </View>
        </View>

        {/* Featured / Urgent Assistance Section */}
        <View style={styles.sectionHeader}>
          <View>
            <Text style={styles.sectionTitle}>සහය අපේක්ෂා කරන බිල්පත්</Text>
            <Text style={styles.sectionSubtitle}>
              සෘජුවම විදුලි හා ජල සම්පාදන මණ්ඩලයට ගෙවිය හැක
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => onNavigateTab('find')}
            accessibilityRole="button"
          >
            <Text style={styles.seeAllText}>සියල්ල ({bills.length}) →</Text>
          </TouchableOpacity>
        </View>

        {/* Cards */}
        {urgentBills.map((bill) => (
          <DonationCard
            key={bill.id}
            bill={bill}
            onPress={() => onOpenBillDetails(bill)}
            onDonatePress={() => onDonateToBill(bill)}
          />
        ))}

        {/* Big CTA Button */}
        <TouchableOpacity
          activeOpacity={0.88}
          style={styles.bigCtaButton}
          onPress={() => onNavigateTab('find')}
          accessibilityRole="button"
        >
          <LinearGradient
            colors={COLORS.primaryGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.bigCtaGradient}
          >
            <Ionicons name="gift-outline" size={22} color="#FFFFFF" />
            <Text style={styles.bigCtaText}>{t('donateTodayCta')}</Text>
          </LinearGradient>
        </TouchableOpacity>
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
  greetingTextCol: {
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
  greetingHeadline: {
    fontSize: 13,
    color: COLORS.darkText,
    marginTop: 8,
    fontWeight: '600',
    fontStyle: 'italic',
  },
  heartIllustration: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  heartCircle: {
    width: 60,
    height: 60,
    borderRadius: RADIUS.round,
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.button,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.md,
    marginTop: SPACING.lg,
  },
  actionCard: {
    flex: 1,
    minWidth: '46%',
    backgroundColor: '#FFFFFF',
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.soft,
  },
  actionIconBox: {
    width: 50,
    height: 50,
    borderRadius: RADIUS.round,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.sm,
  },
  actionCardTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.deepPurple,
    textAlign: 'center',
  },
  statsStrip: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: RADIUS.lg,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.sm,
    marginTop: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'space-around',
    ...SHADOWS.soft,
  },
  statBox: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.primaryPink,
  },
  statLabel: {
    fontSize: 10,
    color: COLORS.mutedText,
    marginTop: 2,
    textAlign: 'center',
    fontWeight: '600',
  },
  statDivider: {
    width: 1,
    height: 28,
    backgroundColor: COLORS.borderLight,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginTop: SPACING.xl,
    marginBottom: SPACING.sm,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.deepPurple,
  },
  sectionSubtitle: {
    fontSize: 11,
    color: COLORS.mutedText,
    marginTop: 2,
  },
  seeAllText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.primaryPink,
  },
  bigCtaButton: {
    marginTop: SPACING.xl,
    borderRadius: RADIUS.round,
    overflow: 'hidden',
    ...SHADOWS.button,
  },
  bigCtaGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    gap: SPACING.sm,
  },
  bigCtaText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
});

