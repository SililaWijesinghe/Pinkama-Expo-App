import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  Modal,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, RADIUS, SHADOWS, SPACING } from '../../constants/theme';
import { useLanguage } from '../../context/LanguageContext';
import { useBills } from '../../context/BillContext';
import { BillType, UtilityProvider } from '../../types';
import { SRI_LANKA_DISTRICTS } from '../../constants/mockData';
import { PinkamaHeader } from '../../components/common/PinkamaHeader';
import { CustomInput } from '../../components/common/CustomInput';
import { GradientButton } from '../../components/common/GradientButton';

interface UploadBillScreenProps {
  onBack: () => void;
  onSuccess: () => void;
}

export const UploadBillScreen: React.FC<UploadBillScreenProps> = ({
  onBack,
  onSuccess,
}) => {
  const { t } = useLanguage();
  const { addBillRequest } = useBills();

  // Wizard state: 1 = Details, 2 = Photo, 3 = Confirm
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);

  // Form Fields
  const [billType, setBillType] = useState<BillType>('electricity');
  const [provider, setProvider] = useState<UtilityProvider>('CEB');
  const [accountNumber, setAccountNumber] = useState('');
  const [accountHolderName, setAccountHolderName] = useState('');
  const [district, setDistrict] = useState('නුවරඑළිය (Nuwara Eliya)');
  const [city, setCity] = useState('');
  const [amount, setAmount] = useState('');
  const [dueDate, setDueDate] = useState('2026-11-28');
  const [familyStory, setFamilyStory] = useState('');
  const [billImage, setBillImage] = useState<string | null>(null);

  const [showDistrictModal, setShowDistrictModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // Validation
  const isStep1Valid =
    accountNumber.trim().length >= 6 &&
    accountHolderName.trim().length >= 3 &&
    city.trim().length >= 2 &&
    parseFloat(amount) > 0;

  const handlePickFromGallery = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.8,
    });
    if (!result.canceled && result.assets && result.assets.length > 0) {
      setBillImage(result.assets[0].uri);
    }
  };

  const handleCaptureCamera = async () => {
    const perm = await ImagePicker.requestCameraPermissionsAsync();
    if (!perm.granted) {
      Alert.alert('අවසර අවශ්‍යයි', 'බිල්පතේ ඡායාරූපය ගැනීමට කැමරා අවසරය ලබා දෙන්න.');
      return;
    }
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 0.8,
    });
    if (!result.canceled && result.assets && result.assets.length > 0) {
      setBillImage(result.assets[0].uri);
    }
  };

  const handleSubmit = () => {
    addBillRequest({
      billType,
      provider,
      accountNumber,
      accountHolderName,
      district,
      city,
      amount: parseFloat(amount) || 0,
      dueDate,
      familyStory,
      billImageUrl: billImage || undefined,
    });
    setShowSuccessModal(true);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <PinkamaHeader
        title={t('uploadBillTitle')}
        subtitle={`${currentStep} / 3 පියවර`}
        showBack
        onBack={() => {
          if (currentStep > 1) {
            setCurrentStep((prev) => (prev - 1) as any);
          } else {
            onBack();
          }
        }}
      />

      {/* Stepper Header (Matches Screen 6 of reference image: 1 විස්තර -> 2 පින්තූර -> 3 තහවුරු) */}
      <View style={styles.stepperContainer}>
        {/* Step 1 */}
        <View style={styles.stepItem}>
          <View
            style={[
              styles.stepBadge,
              currentStep >= 1 && styles.stepBadgeActive,
            ]}
          >
            <Text
              style={[
                styles.stepNumber,
                currentStep >= 1 && styles.stepNumberActive,
              ]}
            >
              1
            </Text>
          </View>
          <Text
            style={[
              styles.stepLabel,
              currentStep >= 1 && styles.stepLabelActive,
            ]}
          >
            {t('step1Title')}
          </Text>
        </View>

        <View
          style={[styles.stepLine, currentStep >= 2 && styles.stepLineActive]}
        />

        {/* Step 2 */}
        <View style={styles.stepItem}>
          <View
            style={[
              styles.stepBadge,
              currentStep >= 2 && styles.stepBadgeActive,
            ]}
          >
            <Text
              style={[
                styles.stepNumber,
                currentStep >= 2 && styles.stepNumberActive,
              ]}
            >
              2
            </Text>
          </View>
          <Text
            style={[
              styles.stepLabel,
              currentStep >= 2 && styles.stepLabelActive,
            ]}
          >
            {t('step2Title')}
          </Text>
        </View>

        <View
          style={[styles.stepLine, currentStep >= 3 && styles.stepLineActive]}
        />

        {/* Step 3 */}
        <View style={styles.stepItem}>
          <View
            style={[
              styles.stepBadge,
              currentStep >= 3 && styles.stepBadgeActive,
            ]}
          >
            <Text
              style={[
                styles.stepNumber,
                currentStep >= 3 && styles.stepNumberActive,
              ]}
            >
              3
            </Text>
          </View>
          <Text
            style={[
              styles.stepLabel,
              currentStep >= 3 && styles.stepLabelActive,
            ]}
          >
            {t('step3Title')}
          </Text>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* STEP 1: Details (Matches Screen 6) */}
        {currentStep === 1 && (
          <View style={styles.card}>
            <Text style={styles.stepHeading}>{t('step1Subtitle')}</Text>

            {/* Bill Type Selector */}
            <Text style={styles.inputLabel}>{t('billTypeLabel')}</Text>
            <View style={styles.typeRow}>
              <TouchableOpacity
                style={[
                  styles.typePill,
                  billType === 'electricity' && styles.typePillElectricity,
                ]}
                onPress={() => {
                  setBillType('electricity');
                  setProvider('CEB');
                }}
                accessibilityRole="button"
              >
                <Ionicons
                  name="flash"
                  size={18}
                  color={billType === 'electricity' ? '#FFFFFF' : COLORS.electricity}
                />
                <Text
                  style={[
                    styles.typePillText,
                    billType === 'electricity' && styles.typePillTextActive,
                  ]}
                >
                  ⚡ විදුලි බිල් (Electricity)
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.typePill,
                  billType === 'water' && styles.typePillWater,
                ]}
                onPress={() => {
                  setBillType('water');
                  setProvider('NWSDB');
                }}
                accessibilityRole="button"
              >
                <Ionicons
                  name="water"
                  size={18}
                  color={billType === 'water' ? '#FFFFFF' : COLORS.water}
                />
                <Text
                  style={[
                    styles.typePillText,
                    billType === 'water' && styles.typePillTextActive,
                  ]}
                >
                  💧 ජල බිල් (Water)
                </Text>
              </TouchableOpacity>
            </View>

            {/* Provider Selector */}
            <Text style={styles.inputLabel}>{t('selectProvider')}</Text>
            <View style={styles.providerSelectBox}>
              <Text style={styles.providerSelectedText}>
                {billType === 'electricity'
                  ? 'CEB (ලංකා විදුලිබල මණ්ඩලය)'
                  : 'NWSDB (ජාතික ජල සම්පාදන මණ්ඩලය)'}
              </Text>
              <Ionicons name="checkmark-circle" size={20} color={COLORS.primaryPink} />
            </View>

            {/* Account / Bill Number */}
            <CustomInput
              label={t('enterAccountNumber')}
              placeholder="උදා: 1234567890"
              value={accountNumber}
              onChangeText={setAccountNumber}
              keyboardType="numeric"
              iconName="card-outline"
            />

            {/* Account Holder Name */}
            <CustomInput
              label={t('enterHolderName')}
              placeholder="උදා: කේ. එන්. පෙරේරා"
              value={accountHolderName}
              onChangeText={setAccountHolderName}
              iconName="person-outline"
            />

            {/* District & City */}
            <Text style={styles.inputLabel}>{t('district')}</Text>
            <TouchableOpacity
              style={styles.dropdownButton}
              onPress={() => setShowDistrictModal(true)}
              accessibilityRole="button"
            >
              <Ionicons name="location-outline" size={20} color={COLORS.primaryPink} />
              <Text style={styles.dropdownText}>{district}</Text>
              <Ionicons name="chevron-down" size={18} color={COLORS.mutedText} />
            </TouchableOpacity>

            <CustomInput
              label={t('city')}
              placeholder="උදා: නුවරඑළිය"
              value={city}
              onChangeText={setCity}
              iconName="business-outline"
            />

            {/* Amount */}
            <CustomInput
              label={t('enterAmount')}
              placeholder="උදා: 4860"
              value={amount}
              onChangeText={setAmount}
              keyboardType="numeric"
              iconName="cash-outline"
            />

            {/* Due Date */}
            <CustomInput
              label={t('selectDueDate')}
              value={dueDate}
              onChangeText={setDueDate}
              iconName="calendar-outline"
            />

            {/* Optional note */}
            <CustomInput
              label={t('familyStoryPlaceholder')}
              placeholder="දරුවන් සංඛ්‍යාව, අසනීප හෝ වෙනත් කරුණු..."
              value={familyStory}
              onChangeText={setFamilyStory}
              multiline
              numberOfLines={3}
              style={{ minHeight: 70 }}
            />

            <GradientButton
              title={`${t('nextStep')} →`}
              onPress={() => setCurrentStep(2)}
              disabled={!isStep1Valid}
              size="lg"
              style={{ marginTop: SPACING.md }}
            />
          </View>
        )}

        {/* STEP 2: Photo Upload (Matches Screen 7) */}
        {currentStep === 2 && (
          <View style={styles.card}>
            <Text style={styles.stepHeading}>{t('step2Subtitle')}</Text>

            {/* Upload Box (Matches Screen 7 visual representation) */}
            <View style={styles.uploadPreviewContainer}>
              {billImage ? (
                <View style={styles.imageWrapper}>
                  <Image source={{ uri: billImage }} style={styles.uploadedImg} />
                  <View style={styles.verifiedCheckBadge}>
                    <Ionicons name="checkmark-circle" size={20} color={COLORS.success} />
                    <Text style={styles.verifiedCheckText}>
                      {t('billUploadedSuccess')}
                    </Text>
                  </View>
                </View>
              ) : (
                <View style={styles.mockBillIllustration}>
                  <View style={styles.mockBillTop}>
                    <Text style={styles.mockBillTitle}>
                      {provider} {billType === 'electricity' ? '⚡' : '💧'}
                    </Text>
                    <Text style={styles.mockBillSub}>ELECTRICITY / WATER BILL</Text>
                  </View>
                  <View style={styles.mockBillLines}>
                    <View style={styles.mockLine} />
                    <View style={[styles.mockLine, { width: '80%' }]} />
                    <View style={[styles.mockLine, { width: '90%' }]} />
                    <View style={[styles.mockLine, { width: '60%' }]} />
                  </View>

                  {/* Upload Prompt Action */}
                  <TouchableOpacity
                    style={styles.cameraCircleBtn}
                    onPress={handleCaptureCamera}
                    accessibilityRole="button"
                  >
                    <Ionicons name="camera" size={26} color="#FFFFFF" />
                  </TouchableOpacity>

                  <Text style={styles.uploadPromptText}>
                    බිල්පතේ පැහැදිලි ඡායාරූපයක් එක් කරන්න
                  </Text>
                </View>
              )}
            </View>

            {/* Camera / Gallery Picker Buttons */}
            <View style={styles.pickerButtonsRow}>
              <TouchableOpacity
                style={styles.pickerBtn}
                onPress={handleCaptureCamera}
                accessibilityRole="button"
              >
                <Ionicons name="camera-outline" size={20} color={COLORS.deepPurple} />
                <Text style={styles.pickerBtnText}>{t('cameraUpload')}</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.pickerBtn}
                onPress={handlePickFromGallery}
                accessibilityRole="button"
              >
                <Ionicons name="images-outline" size={20} color={COLORS.deepPurple} />
                <Text style={styles.pickerBtnText}>{t('galleryUpload')}</Text>
              </TouchableOpacity>
            </View>

            {/* Continue or skip photo (for demo convenience, allows proceeding with verified placeholder) */}
            <GradientButton
              title={`${t('nextStep')} →`}
              onPress={() => setCurrentStep(3)}
              size="lg"
              style={{ marginTop: SPACING.xl }}
            />
          </View>
        )}

        {/* STEP 3: Confirm & Submit */}
        {currentStep === 3 && (
          <View style={styles.card}>
            <Text style={styles.stepHeading}>{t('step3Subtitle')}</Text>

            <View style={styles.summaryBox}>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryKey}>{t('billTypeLabel')}:</Text>
                <Text style={styles.summaryVal}>
                  {billType === 'electricity' ? '⚡ විදුලි බිල්' : '💧 ජල බිල්'} ({provider})
                </Text>
              </View>

              <View style={styles.summaryItem}>
                <Text style={styles.summaryKey}>{t('billNumber')}:</Text>
                <Text style={styles.summaryVal}>{accountNumber}</Text>
              </View>

              <View style={styles.summaryItem}>
                <Text style={styles.summaryKey}>{t('receiverName')}:</Text>
                <Text style={styles.summaryVal}>{accountHolderName}</Text>
              </View>

              <View style={styles.summaryItem}>
                <Text style={styles.summaryKey}>{t('city')}:</Text>
                <Text style={styles.summaryVal}>
                  {city} ({district})
                </Text>
              </View>

              <View style={[styles.summaryItem, styles.summaryTotalItem]}>
                <Text style={styles.summaryTotalKey}>{t('amountDue')}:</Text>
                <Text style={styles.summaryTotalVal}>
                  {t('currency')} {parseFloat(amount || '0').toLocaleString()}
                </Text>
              </View>
            </View>

            <View style={styles.disclaimerBox}>
              <Ionicons name="lock-closed" size={18} color={COLORS.primaryPink} />
              <Text style={styles.disclaimerText}>
                ඔබ ඇතුළත් කළ තොරතුරු ස්වයංක්‍රීයව CEB/NWSDB දත්ත පද්ධතිය මඟින් සත්‍යාපනය කරනු ලැබේ.
              </Text>
            </View>

            {/* Big Submit Button: බිල්පත ඉදිරිපත් කරන්න */}
            <GradientButton
              title={t('submitBillCta')}
              onPress={handleSubmit}
              size="lg"
              style={{ marginTop: SPACING.lg }}
            />
          </View>
        )}
      </ScrollView>

      {/* District Selection Modal */}
      <Modal
        visible={showDistrictModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowDistrictModal(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.districtModalCard}>
            <Text style={styles.modalHeaderTitle}>{t('selectDistrict')}</Text>
            <ScrollView style={{ maxHeight: 350 }}>
              {SRI_LANKA_DISTRICTS.filter((d) => !d.includes('සියල්ල')).map((d) => (
                <TouchableOpacity
                  key={d}
                  style={styles.districtItem}
                  onPress={() => {
                    setDistrict(d);
                    setShowDistrictModal(false);
                  }}
                >
                  <Text
                    style={[
                      styles.districtItemText,
                      district === d && styles.districtItemTextActive,
                    ]}
                  >
                    {d}
                  </Text>
                  {district === d && (
                    <Ionicons name="checkmark" size={18} color={COLORS.primaryPink} />
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Success Modal */}
      <Modal
        visible={showSuccessModal}
        transparent
        animationType="fade"
        onRequestClose={() => {
          setShowSuccessModal(false);
          onSuccess();
        }}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.successModalCard}>
            <LinearGradient
              colors={COLORS.primaryGradient}
              style={styles.successIconBadge}
            >
              <Ionicons name="checkmark-done" size={36} color="#FFFFFF" />
            </LinearGradient>
            <Text style={styles.successModalTitle}>
              {t('billSubmittedSuccessTitle')}
            </Text>
            <Text style={styles.successModalMsg}>
              {t('billSubmittedSuccessMsg')}
            </Text>

            <GradientButton
              title="මගේ බිල්පත් වෙත යන්න"
              size="md"
              onPress={() => {
                setShowSuccessModal(false);
                onSuccess();
              }}
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
  stepperContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.xl,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
  },
  stepItem: {
    alignItems: 'center',
  },
  stepBadge: {
    width: 28,
    height: 28,
    borderRadius: RADIUS.round,
    backgroundColor: COLORS.borderLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  stepBadgeActive: {
    backgroundColor: COLORS.primaryPink,
  },
  stepNumber: {
    fontSize: 12,
    fontWeight: '800',
    color: COLORS.mutedText,
  },
  stepNumberActive: {
    color: '#FFFFFF',
  },
  stepLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.mutedText,
  },
  stepLabelActive: {
    color: COLORS.deepPurple,
    fontWeight: '800',
  },
  stepLine: {
    flex: 1,
    height: 2,
    backgroundColor: COLORS.borderLight,
    marginHorizontal: SPACING.sm,
    top: -10,
  },
  stepLineActive: {
    backgroundColor: COLORS.primaryPink,
  },
  scrollContent: {
    padding: SPACING.lg,
    paddingBottom: SPACING.xxxl,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: RADIUS.xl,
    padding: SPACING.xl,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.card,
  },
  stepHeading: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.deepPurple,
    marginBottom: SPACING.lg,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.deepPurple,
    marginBottom: 8,
  },
  typeRow: {
    flexDirection: 'row',
    gap: SPACING.md,
    marginBottom: SPACING.lg,
  },
  typePill: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 12,
    borderRadius: RADIUS.md,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    backgroundColor: '#FAF5FA',
  },
  typePillElectricity: {
    backgroundColor: COLORS.electricity,
    borderColor: COLORS.electricity,
  },
  typePillWater: {
    backgroundColor: COLORS.water,
    borderColor: COLORS.water,
  },
  typePillText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.deepPurple,
  },
  typePillTextActive: {
    color: '#FFFFFF',
  },
  providerSelectBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.softLavender,
    padding: SPACING.md,
    borderRadius: RADIUS.md,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  providerSelectedText: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.deepPurple,
  },
  dropdownButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: COLORS.border,
    borderRadius: RADIUS.md,
    paddingHorizontal: SPACING.md,
    height: 50,
    marginBottom: SPACING.md,
  },
  dropdownText: {
    fontSize: 14,
    color: COLORS.darkText,
    flex: 1,
    marginLeft: SPACING.sm,
  },
  uploadPreviewContainer: {
    backgroundColor: '#F8FAFC',
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 220,
    marginBottom: SPACING.lg,
  },
  imageWrapper: {
    width: '100%',
    alignItems: 'center',
  },
  uploadedImg: {
    width: '100%',
    height: 180,
    borderRadius: RADIUS.md,
  },
  verifiedCheckBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: COLORS.successBg,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: RADIUS.round,
    marginTop: SPACING.sm,
  },
  verifiedCheckText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#065F46',
  },
  mockBillIllustration: {
    width: '85%',
    backgroundColor: '#FFFFFF',
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
  },
  mockBillTop: {
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    paddingBottom: 6,
    width: '100%',
  },
  mockBillTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.deepPurple,
  },
  mockBillSub: {
    fontSize: 10,
    color: COLORS.mutedText,
    fontWeight: '600',
  },
  mockBillLines: {
    width: '100%',
    gap: 6,
    marginVertical: 12,
  },
  mockLine: {
    height: 5,
    backgroundColor: '#E2E8F0',
    borderRadius: 3,
    width: '100%',
  },
  cameraCircleBtn: {
    width: 52,
    height: 52,
    borderRadius: RADIUS.round,
    backgroundColor: COLORS.primaryPink,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: SPACING.sm,
    ...SHADOWS.button,
  },
  uploadPromptText: {
    fontSize: 12,
    color: COLORS.mutedText,
    textAlign: 'center',
    fontWeight: '600',
  },
  pickerButtonsRow: {
    flexDirection: 'row',
    gap: SPACING.md,
  },
  pickerBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: COLORS.softLavender,
    paddingVertical: 12,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  pickerBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.deepPurple,
  },
  summaryBox: {
    backgroundColor: '#FAF5FA',
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    gap: 8,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  summaryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  summaryKey: {
    fontSize: 13,
    color: COLORS.mutedText,
  },
  summaryVal: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.deepPurple,
  },
  summaryTotalItem: {
    borderTopWidth: 1,
    borderTopColor: COLORS.borderLight,
    paddingTop: 8,
    marginTop: 4,
  },
  summaryTotalKey: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.deepPurple,
  },
  summaryTotalVal: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.primaryPink,
  },
  disclaimerBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    backgroundColor: '#FFF0F7',
    padding: SPACING.md,
    borderRadius: RADIUS.md,
    marginTop: SPACING.lg,
  },
  disclaimerText: {
    fontSize: 12,
    color: COLORS.primaryPink,
    flex: 1,
    lineHeight: 18,
    fontWeight: '600',
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(33, 16, 45, 0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.lg,
  },
  districtModalCard: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: RADIUS.xl,
    padding: SPACING.xl,
    ...SHADOWS.card,
  },
  modalHeaderTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.deepPurple,
    marginBottom: SPACING.md,
  },
  districtItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
  },
  districtItemText: {
    fontSize: 14,
    color: COLORS.darkText,
  },
  districtItemTextActive: {
    color: COLORS.primaryPink,
    fontWeight: '700',
  },
  successModalCard: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: RADIUS.xl,
    padding: SPACING.xl,
    alignItems: 'center',
    ...SHADOWS.card,
  },
  successIconBadge: {
    width: 68,
    height: 68,
    borderRadius: RADIUS.round,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.md,
    ...SHADOWS.button,
  },
  successModalTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.deepPurple,
  },
  successModalMsg: {
    fontSize: 13,
    color: COLORS.mutedText,
    textAlign: 'center',
    marginTop: 6,
    lineHeight: 20,
  },
});

