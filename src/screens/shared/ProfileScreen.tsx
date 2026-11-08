import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Modal,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, RADIUS, SHADOWS, SPACING } from '../../constants/theme';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { PinkamaHeader } from '../../components/common/PinkamaHeader';
import { GradientButton } from '../../components/common/GradientButton';

interface ProfileScreenProps {
  onLogoutToRoleSelect: () => void;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({
  onLogoutToRoleSelect,
}) => {
  const { language, toggleLanguage, t } = useLanguage();
  const { user, role, switchRole, logout } = useAuth();

  const [showAboutModal, setShowAboutModal] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);

  const handleRoleToggle = () => {
    const targetRole = role === 'giver' ? 'receiver' : 'giver';
    switchRole(targetRole);
    Alert.alert(
      'භූමිකාව මාරු විය',
      targetRole === 'giver'
        ? 'ඔබ දැන් දායක (Giver) ගිණුමේ සිටී.'
        : 'ඔබ දැන් ප්‍රතිලාභී (Receiver) ගිණුමේ සිටී.'
    );
  };

  const handleLogout = () => {
    logout();
    onLogoutToRoleSelect();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <PinkamaHeader
        title={t('tabProfile')}
        subtitle="පරිශීලක තොරතුරු සහ සැකසුම්"
        showBack={false}
      />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* User Profile Card */}
        <View style={styles.profileCard}>
          <LinearGradient
            colors={role === 'giver' ? COLORS.primaryGradient : COLORS.purpleGradient}
            style={styles.avatarCircle}
          >
            <Ionicons
              name={role === 'giver' ? 'heart' : 'person'}
              size={36}
              color="#FFFFFF"
            />
          </LinearGradient>

          <Text style={styles.userName}>{user?.name || 'පරිශීලක'}</Text>
          <Text style={styles.userEmail}>{user?.email || 'user@example.com'}</Text>
          <Text style={styles.userLocation}>
            <Ionicons name="location-outline" size={14} color={COLORS.mutedText} />{' '}
            {user?.city}, {user?.district}
          </Text>

          <View
            style={[
              styles.roleBadge,
              {
                backgroundColor:
                  role === 'giver' ? COLORS.softLavender : '#EDE9FE',
              },
            ]}
          >
            <Text
              style={[
                styles.roleBadgeText,
                { color: role === 'giver' ? COLORS.primaryPink : COLORS.deepPurple },
              ]}
            >
              {role === 'giver' ? t('giverRole') : t('receiverRole')}
            </Text>
          </View>
        </View>

        {/* Role Switcher Action Box */}
        <TouchableOpacity
          activeOpacity={0.88}
          style={styles.roleSwitchCard}
          onPress={handleRoleToggle}
          accessibilityRole="button"
        >
          <View style={styles.switchIconBox}>
            <Ionicons name="swap-horizontal" size={24} color={COLORS.primaryPink} />
          </View>
          <View style={styles.switchTextCol}>
            <Text style={styles.switchTitle}>
              {role === 'giver' ? t('switchToReceiver') : t('switchToGiver')}
            </Text>
            <Text style={styles.switchSub}>
              {role === 'giver'
                ? 'ඔබේ පවුලේ බිල්පත් සඳහා ආධාර ඉල්ලන්න'
                : 'වෙනත් පවුල්වල බිල්පත් පියවීමට දායක වන්න'}
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={COLORS.mutedText} />
        </TouchableOpacity>

        {/* Preferences & Settings */}
        <View style={styles.menuCard}>
          {/* Language Toggle */}
          <TouchableOpacity
            style={styles.menuItem}
            onPress={toggleLanguage}
            accessibilityRole="button"
          >
            <View style={styles.menuItemLeft}>
              <View style={[styles.menuIcon, { backgroundColor: '#F0FDF4' }]}>
                <Ionicons name="globe-outline" size={20} color={COLORS.success} />
              </View>
              <Text style={styles.menuItemTitle}>{t('languageSetting')}</Text>
            </View>
            <View style={styles.menuItemRight}>
              <Text style={styles.menuLangValue}>
                {language === 'si' ? 'සිංහල (Sinhala)' : 'English'}
              </Text>
              <Ionicons name="chevron-forward" size={18} color={COLORS.mutedText} />
            </View>
          </TouchableOpacity>

          {/* About Pinkama */}
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => setShowAboutModal(true)}
            accessibilityRole="button"
          >
            <View style={styles.menuItemLeft}>
              <View style={[styles.menuIcon, { backgroundColor: '#FDF2F8' }]}>
                <Ionicons name="information-circle-outline" size={20} color={COLORS.primaryPink} />
              </View>
              <Text style={styles.menuItemTitle}>{t('aboutPinkama')}</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={COLORS.mutedText} />
          </TouchableOpacity>

          {/* Terms & Privacy */}
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => setShowPrivacyModal(true)}
            accessibilityRole="button"
          >
            <View style={styles.menuItemLeft}>
              <View style={[styles.menuIcon, { backgroundColor: '#EFF6FF' }]}>
                <Ionicons name="shield-checkmark-outline" size={20} color={COLORS.accentBlue} />
              </View>
              <Text style={styles.menuItemTitle}>{t('termsAndPrivacy')}</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={COLORS.mutedText} />
          </TouchableOpacity>
        </View>

        {/* Log Out Button */}
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={handleLogout}
          accessibilityRole="button"
        >
          <Ionicons name="log-out-outline" size={20} color={COLORS.danger} />
          <Text style={styles.logoutText}>{t('logout')}</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* About Pinkama Modal */}
      <Modal
        visible={showAboutModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowAboutModal(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeaderRow}>
              <Text style={styles.modalBrand}>පිංකම (Pinkama)</Text>
              <TouchableOpacity onPress={() => setShowAboutModal(false)}>
                <Ionicons name="close-circle" size={24} color={COLORS.mutedText} />
              </TouchableOpacity>
            </View>
            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={styles.aboutMotto}>"කිං කුසල ගවේසී"</Text>
              <Text style={styles.aboutTagline}>
                බිල්පත් දානයෙන් ජීවිතයට අත්වැලක්
              </Text>
              <Text style={styles.aboutBody}>
                පිංකම යනු ශ්‍රී ලාංකික ජනතාවට අත්‍යවශ්‍ය වන ජල හා විදුලි බිල්පත්
                සෘජුවම ලංකා විදුලිබල මණ්ඩලය (CEB) සහ ජාතික ජල සම්පාදන මණ්ඩලය
                (NWSDB) වෙත පියවීමට මඟපාදන, විනිවිදභාවයෙන් යුතු ඩිජිටල් මානුෂීය
                වේදිකාවකි.
              </Text>
              <Text style={styles.aboutBody}>
                මෙහිදී මුදල් කෙළින්ම පුද්ගලයින් වෙත ලබා නොදෙන අතර, අවශ්‍යතා
                ඇති පවුල්වල සැබෑ බිල්පත් පියවීමට පමණක් දායකත්වය සෘජුවම යොමු කෙරේ.
              </Text>
              <GradientButton
                title={t('close')}
                onPress={() => setShowAboutModal(false)}
                size="sm"
                style={{ marginTop: SPACING.lg }}
              />
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Privacy & Terms Modal */}
      <Modal
        visible={showPrivacyModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowPrivacyModal(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeaderRow}>
              <Text style={styles.modalBrand}>පෞද්ගලිකත්වය සහ ආරක්ෂාව</Text>
              <TouchableOpacity onPress={() => setShowPrivacyModal(false)}>
                <Ionicons name="close-circle" size={24} color={COLORS.mutedText} />
              </TouchableOpacity>
            </View>
            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={styles.aboutBody}>
                1. ප්‍රතිලාභීන්ගේ පුද්ගලික තොරතුරු සහ බිල්පත් ඡායාරූප සුරක්ෂිතව
                තබා ගන්නා අතර අනවශ්‍ය දත්ත ප්‍රසිද්ධ නොකෙරේ.
              </Text>
              <Text style={styles.aboutBody}>
                2. දායකයින්ගේ සියලුම ගෙවීම් ශ්‍රී ලංකා මහ බැංකුව විසින් අනුමත
                සුරක්ෂිත ගෙවීම් පද්ධති (Payment Gateways) ඔස්සේ සෘජුවම ක්‍රියාත්මක වේ.
              </Text>
              <GradientButton
                title={t('close')}
                onPress={() => setShowPrivacyModal(false)}
                size="sm"
                style={{ marginTop: SPACING.lg }}
              />
            </ScrollView>
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
  profileCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: RADIUS.xl,
    padding: SPACING.xl,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.card,
  },
  avatarCircle: {
    width: 72,
    height: 72,
    borderRadius: RADIUS.round,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.md,
    ...SHADOWS.button,
  },
  userName: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.deepPurple,
  },
  userEmail: {
    fontSize: 13,
    color: COLORS.mutedText,
    marginTop: 2,
  },
  userLocation: {
    fontSize: 12,
    color: COLORS.mutedText,
    marginTop: 4,
  },
  roleBadge: {
    paddingHorizontal: 14,
    paddingVertical: 5,
    borderRadius: RADIUS.round,
    marginTop: SPACING.md,
  },
  roleBadgeText: {
    fontSize: 12,
    fontWeight: '800',
  },
  roleSwitchCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    marginTop: SPACING.lg,
    borderWidth: 1.5,
    borderColor: COLORS.primaryPink,
    ...SHADOWS.soft,
  },
  switchIconBox: {
    width: 44,
    height: 44,
    borderRadius: RADIUS.round,
    backgroundColor: COLORS.softLavender,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
  },
  switchTextCol: {
    flex: 1,
  },
  switchTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.deepPurple,
  },
  switchSub: {
    fontSize: 11,
    color: COLORS.mutedText,
    marginTop: 2,
  },
  menuCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: RADIUS.lg,
    padding: SPACING.sm,
    marginTop: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.soft,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
  },
  menuIcon: {
    width: 36,
    height: 36,
    borderRadius: RADIUS.round,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuItemTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.deepPurple,
  },
  menuItemRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  menuLangValue: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.primaryPink,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#FFFFFF',
    borderRadius: RADIUS.round,
    paddingVertical: 14,
    marginTop: SPACING.xl,
    borderWidth: 1,
    borderColor: COLORS.dangerBg,
  },
  logoutText: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.danger,
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
    maxHeight: '80%',
    backgroundColor: '#FFFFFF',
    borderRadius: RADIUS.xl,
    padding: SPACING.xl,
    ...SHADOWS.card,
  },
  modalHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
    paddingBottom: SPACING.sm,
    marginBottom: SPACING.md,
  },
  modalBrand: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.deepPurple,
  },
  aboutMotto: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.primaryPink,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  aboutTagline: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.deepPurple,
    textAlign: 'center',
    marginTop: 2,
    marginBottom: SPACING.md,
  },
  aboutBody: {
    fontSize: 13,
    color: COLORS.darkText,
    lineHeight: 20,
    marginBottom: SPACING.sm,
  },
});

