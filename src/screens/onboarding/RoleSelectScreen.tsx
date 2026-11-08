import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, RADIUS, SHADOWS, SPACING } from '../../constants/theme';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';

interface RoleSelectScreenProps {
  onSelectRole: (role: 'giver' | 'receiver') => void;
}

export const RoleSelectScreen: React.FC<RoleSelectScreenProps> = ({ onSelectRole }) => {
  const { language, toggleLanguage, t } = useLanguage();
  const { loginAs } = useAuth();

  const handleChoose = (role: 'giver' | 'receiver') => {
    loginAs(role);
    onSelectRole(role);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Top Language Toggle */}
        <View style={styles.topBar}>
          <TouchableOpacity
            style={styles.langPill}
            onPress={toggleLanguage}
            accessibilityRole="button"
          >
            <Ionicons name="globe-outline" size={16} color={COLORS.deepPurple} />
            <Text style={styles.langText}>
              {language === 'si' ? 'English' : 'සිංහල'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Hero Header */}
        <View style={styles.heroSection}>
          <LinearGradient
            colors={COLORS.primaryGradient}
            style={styles.logoBadge}
          >
            <Ionicons name="heart" size={32} color="#FFFFFF" />
          </LinearGradient>

          <Text style={styles.appName}>පිංකම</Text>
          <Text style={styles.appNameEn}>Pinkama Mobile</Text>
          <Text style={styles.tagline}>{t('appTagline')}</Text>

          <View style={styles.mottoBox}>
            <Text style={styles.mottoTitle}>"{t('motto')}"</Text>
            <Text style={styles.mottoSub}>{t('mottoSub')}</Text>
          </View>
        </View>

        {/* Role Cards */}
        <View style={styles.cardsSection}>
          {/* Card 1: Giver (දායකයෙක් ලෙස) */}
          <TouchableOpacity
            activeOpacity={0.9}
            style={styles.roleCard}
            onPress={() => handleChoose('giver')}
            accessibilityRole="button"
          >
            <LinearGradient
              colors={['#FFFFFF', '#FFF5FB']}
              style={styles.cardInner}
            >
              <View style={styles.roleHeader}>
                <View style={[styles.roleIconBox, { backgroundColor: COLORS.primaryPink }]}>
                  <Ionicons name="heart" size={24} color="#FFFFFF" />
                </View>
                <View style={styles.roleTitleCol}>
                  <Text style={styles.roleTypeTag}>{t('giverRole')}</Text>
                  <Text style={styles.roleMainAction}>{t('giverAction')}</Text>
                </View>
              </View>

              <Text style={styles.roleDesc}>{t('giverSub')}</Text>

              <View style={styles.featurePills}>
                <View style={styles.pill}>
                  <Text style={styles.pillText}>⚡ විදුලි බිල්</Text>
                </View>
                <View style={styles.pill}>
                  <Text style={styles.pillText}>💧 ජල බිල්</Text>
                </View>
                <View style={styles.pill}>
                  <Text style={styles.pillText}>🛡️ සෘජු ගෙවීම</Text>
                </View>
              </View>

              <LinearGradient
                colors={COLORS.primaryGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.actionBtn}
              >
                <Text style={styles.actionBtnText}>{t('giverAction')} →</Text>
              </LinearGradient>
            </LinearGradient>
          </TouchableOpacity>

          {/* Card 2: Receiver (ප්‍රතිලාභියෙක් ලෙස) */}
          <TouchableOpacity
            activeOpacity={0.9}
            style={styles.roleCard}
            onPress={() => handleChoose('receiver')}
            accessibilityRole="button"
          >
            <LinearGradient
              colors={['#FFFFFF', '#F6F5FF']}
              style={styles.cardInner}
            >
              <View style={styles.roleHeader}>
                <View style={[styles.roleIconBox, { backgroundColor: COLORS.deepPurple }]}>
                  <Ionicons name="hand-right" size={24} color="#FFFFFF" />
                </View>
                <View style={styles.roleTitleCol}>
                  <Text style={[styles.roleTypeTag, { color: COLORS.deepPurple }]}>
                    {t('receiverRole')}
                  </Text>
                  <Text style={styles.roleMainAction}>{t('receiverAction')}</Text>
                </View>
              </View>

              <Text style={styles.roleDesc}>{t('receiverSub')}</Text>

              <View style={styles.featurePills}>
                <View style={styles.pill}>
                  <Text style={styles.pillText}>📄 බිල්පත් උඩුගත කිරීම</Text>
                </View>
                <View style={styles.pill}>
                  <Text style={styles.pillText}>🔒 රහස්‍යභාවය</Text>
                </View>
              </View>

              <LinearGradient
                colors={COLORS.purpleGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.actionBtn}
              >
                <Text style={styles.actionBtnText}>{t('receiverAction')} →</Text>
              </LinearGradient>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* Footer Note */}
        <View style={styles.footerNote}>
          <Text style={styles.footerNoteText}>
            ශ්‍රී ලංකාවේ සියලුම ප්‍රජාවන් සඳහා විවෘත, විනිවිදභාවයෙන් යුතු ඩිජිටල් පිංකමකි.
          </Text>
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
  topBar: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: SPACING.sm,
  },
  langPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: RADIUS.round,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.soft,
  },
  langText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.deepPurple,
  },
  heroSection: {
    alignItems: 'center',
    marginVertical: SPACING.md,
  },
  logoBadge: {
    width: 64,
    height: 64,
    borderRadius: RADIUS.round,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.sm,
    ...SHADOWS.button,
  },
  appName: {
    fontSize: 32,
    fontWeight: '800',
    color: COLORS.deepPurple,
    letterSpacing: 1,
  },
  appNameEn: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.primaryPink,
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  tagline: {
    fontSize: 14,
    color: COLORS.mutedText,
    marginTop: 6,
    fontWeight: '600',
  },
  mottoBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    marginTop: SPACING.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    ...SHADOWS.soft,
  },
  mottoTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.deepPurple,
    fontStyle: 'italic',
  },
  mottoSub: {
    fontSize: 12,
    color: COLORS.mutedText,
    textAlign: 'center',
    marginTop: 4,
    lineHeight: 18,
  },
  cardsSection: {
    marginTop: SPACING.lg,
    gap: SPACING.lg,
  },
  roleCard: {
    borderRadius: RADIUS.xl,
    overflow: 'hidden',
    ...SHADOWS.card,
  },
  cardInner: {
    padding: SPACING.xl,
    borderRadius: RADIUS.xl,
    borderWidth: 1.5,
    borderColor: COLORS.border,
  },
  roleHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
  },
  roleIconBox: {
    width: 48,
    height: 48,
    borderRadius: RADIUS.round,
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.soft,
  },
  roleTitleCol: {
    flex: 1,
  },
  roleTypeTag: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.primaryPink,
  },
  roleMainAction: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.deepPurple,
  },
  roleDesc: {
    fontSize: 13,
    color: COLORS.mutedText,
    marginVertical: SPACING.md,
    lineHeight: 20,
  },
  featurePills: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: SPACING.lg,
  },
  pill: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: RADIUS.round,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  pillText: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.deepPurple,
  },
  actionBtn: {
    paddingVertical: 14,
    borderRadius: RADIUS.round,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  footerNote: {
    marginTop: SPACING.xl,
    alignItems: 'center',
  },
  footerNoteText: {
    fontSize: 11,
    color: COLORS.lightText,
    textAlign: 'center',
    lineHeight: 16,
  },
});
