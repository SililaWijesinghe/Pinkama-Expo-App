import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  FlatList,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, RADIUS, SHADOWS, SPACING } from '../../constants/theme';
import { useLanguage } from '../../context/LanguageContext';
import { useBills } from '../../context/BillContext';
import { BillRequest } from '../../types';
import { SRI_LANKA_DISTRICTS } from '../../constants/mockData';
import { PinkamaHeader } from '../../components/common/PinkamaHeader';
import { FilterChip } from '../../components/common/FilterChip';
import { CustomInput } from '../../components/common/CustomInput';
import { DonationCard } from '../../components/cards/DonationCard';

interface FindDonationsScreenProps {
  onBack: () => void;
  onOpenBillDetails: (bill: BillRequest) => void;
  onDonateToBill: (bill: BillRequest) => void;
  onNotificationPress: () => void;
}

export const FindDonationsScreen: React.FC<FindDonationsScreenProps> = ({
  onBack,
  onOpenBillDetails,
  onDonateToBill,
  onNotificationPress,
}) => {
  const { t } = useLanguage();
  const {
    filteredBills,
    selectedBillType,
    setSelectedBillType,
    selectedDistrict,
    setSelectedDistrict,
    selectedAmountRange,
    setSelectedAmountRange,
    searchQuery,
    setSearchQuery,
  } = useBills();

  const resetFilters = () => {
    setSelectedBillType('all');
    setSelectedDistrict('සියල්ල / All');
    setSelectedAmountRange('all');
    setSearchQuery('');
  };

  const hasActiveFilters =
    selectedBillType !== 'all' ||
    selectedDistrict !== 'සියල්ල / All' ||
    selectedAmountRange !== 'all' ||
    searchQuery.trim().length > 0;

  return (
    <SafeAreaView style={styles.safeArea}>
      <PinkamaHeader
        title={t('findBillsTitle')}
        subtitle={t('appTagline')}
        showBack={false}
        onNotificationPress={onNotificationPress}
      />

      <FlatList
        data={filteredBills}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View style={styles.filterSection}>
            {/* Search Input */}
            <CustomInput
              label=""
              placeholder="නම, නගරය හෝ බිල්පත් අංකය සොයන්න..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              iconName="search"
              rightIconName={searchQuery ? 'close-circle' : undefined}
              onRightIconPress={() => setSearchQuery('')}
            />

            {/* Bill Type Selector (Matches Screen 2 of reference image) */}
            <Text style={styles.filterLabel}>{t('billTypeLabel')}</Text>
            <View style={styles.typeSelectorRow}>
              <TouchableOpacity
                style={[
                  styles.bigTypeButton,
                  selectedBillType === 'electricity' && styles.bigTypeButtonActive,
                ]}
                onPress={() =>
                  setSelectedBillType(
                    selectedBillType === 'electricity' ? 'all' : 'electricity'
                  )
                }
                accessibilityRole="button"
              >
                <Ionicons
                  name="flash"
                  size={20}
                  color={
                    selectedBillType === 'electricity'
                      ? '#FFFFFF'
                      : COLORS.electricity
                  }
                />
                <Text
                  style={[
                    styles.bigTypeText,
                    selectedBillType === 'electricity' && styles.bigTypeTextActive,
                  ]}
                >
                  {t('electricityDonation')}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.bigTypeButton,
                  selectedBillType === 'water' && styles.bigTypeButtonActiveWater,
                ]}
                onPress={() =>
                  setSelectedBillType(
                    selectedBillType === 'water' ? 'all' : 'water'
                  )
                }
                accessibilityRole="button"
              >
                <Ionicons
                  name="water"
                  size={20}
                  color={selectedBillType === 'water' ? '#FFFFFF' : COLORS.water}
                />
                <Text
                  style={[
                    styles.bigTypeText,
                    selectedBillType === 'water' && styles.bigTypeTextActive,
                  ]}
                >
                  {t('waterDonation')}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Amount Range Chips */}
            <Text style={styles.filterLabel}>{t('donationAmountRange')}</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.horizontalChips}
            >
              <FilterChip
                label="සියල්ල / All"
                selected={selectedAmountRange === 'all'}
                onPress={() => setSelectedAmountRange('all')}
              />
              <FilterChip
                label="රු. 1,000 - 3,000"
                selected={selectedAmountRange === 'under3000'}
                onPress={() => setSelectedAmountRange('under3000')}
              />
              <FilterChip
                label="රු. 3,000 - 6,000"
                selected={selectedAmountRange === '3000to6000'}
                onPress={() => setSelectedAmountRange('3000to6000')}
              />
              <FilterChip
                label="රු. 6,000+"
                selected={selectedAmountRange === 'above6000'}
                onPress={() => setSelectedAmountRange('above6000')}
              />
            </ScrollView>

            {/* District Chips */}
            <Text style={styles.filterLabel}>{t('selectDistrict')}</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.horizontalChips}
            >
              {SRI_LANKA_DISTRICTS.map((dist) => (
                <FilterChip
                  key={dist}
                  label={dist}
                  selected={selectedDistrict === dist}
                  onPress={() => setSelectedDistrict(dist)}
                  iconName="location-sharp"
                />
              ))}
            </ScrollView>

            {/* Results Header Strip (Matches Screen 3 of reference image) */}
            <View style={styles.resultsBanner}>
              <Text style={styles.resultsCount}>
                {t('searchResultsTitle')} ({filteredBills.length})
              </Text>

              {hasActiveFilters && (
                <TouchableOpacity
                  onPress={resetFilters}
                  style={styles.resetBtn}
                  accessibilityRole="button"
                >
                  <Text style={styles.resetBtnText}>{t('filterReset')}</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        }
        renderItem={({ item }) => (
          <DonationCard
            bill={item}
            onPress={() => onOpenBillDetails(item)}
            onDonatePress={() => onDonateToBill(item)}
          />
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="search" size={48} color={COLORS.lightText} />
            <Text style={styles.emptyTitle}>කිසිදු බිල්පතක් හමු නොවීය</Text>
            <Text style={styles.emptySub}>
              කරුණාකර ඔබ තේරූ පෙරහන් වෙනස් කර නැවත සොයන්න.
            </Text>
            <TouchableOpacity onPress={resetFilters} style={styles.emptyResetBtn}>
              <Text style={styles.emptyResetText}>{t('filterReset')}</Text>
            </TouchableOpacity>
          </View>
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  listContent: {
    padding: SPACING.lg,
    paddingBottom: SPACING.xxxl,
  },
  filterSection: {
    marginBottom: SPACING.md,
  },
  filterLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.deepPurple,
    marginTop: SPACING.sm,
    marginBottom: 6,
  },
  typeSelectorRow: {
    flexDirection: 'row',
    gap: SPACING.md,
    marginBottom: SPACING.sm,
  },
  bigTypeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: COLORS.border,
    paddingVertical: 12,
    borderRadius: RADIUS.md,
    ...SHADOWS.soft,
  },
  bigTypeButtonActive: {
    backgroundColor: COLORS.electricity,
    borderColor: COLORS.electricity,
  },
  bigTypeButtonActiveWater: {
    backgroundColor: COLORS.water,
    borderColor: COLORS.water,
  },
  bigTypeText: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.deepPurple,
  },
  bigTypeTextActive: {
    color: '#FFFFFF',
  },
  horizontalChips: {
    paddingVertical: 4,
    marginBottom: SPACING.sm,
  },
  resultsBanner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: SPACING.md,
    paddingBottom: SPACING.xs,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
  },
  resultsCount: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.deepPurple,
  },
  resetBtn: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  resetBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.primaryPink,
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
  emptyResetBtn: {
    marginTop: SPACING.lg,
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: COLORS.softLavender,
    borderRadius: RADIUS.round,
  },
  emptyResetText: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.deepPurple,
  },
});

