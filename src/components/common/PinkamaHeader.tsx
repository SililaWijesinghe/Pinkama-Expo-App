import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, RADIUS, SHADOWS } from '../../constants/theme';
import { useLanguage } from '../../context/LanguageContext';
import { useBills } from '../../context/BillContext';
import { useAuth } from '../../context/AuthContext';

interface PinkamaHeaderProps {
  title?: string;
  subtitle?: string;
  showBack?: boolean;
  onBack?: () => void;
  onNotificationPress?: () => void;
  onProfilePress?: () => void;
}

export const PinkamaHeader: React.FC<PinkamaHeaderProps> = ({
  title,
  subtitle,
  showBack,
  onBack,
  onNotificationPress,
  onProfilePress,
}) => {
  const { language, toggleLanguage, t } = useLanguage();
  const { notifications } = useBills();
  const { role } = useAuth();

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        {showBack ? (
          <TouchableOpacity
            onPress={onBack}
            style={styles.backButton}
            accessibilityLabel="Go back"
            accessibilityRole="button"
          >
            <Ionicons name="arrow-back" size={24} color={COLORS.deepPurple} />
          </TouchableOpacity>
        ) : (
          <View style={styles.brandContainer}>
            <View style={styles.logoMark}>
              <Ionicons name="heart" size={16} color="#FFFFFF" />
            </View>
            <View>
              <Text style={styles.brandTitle}>පිංකම</Text>
              <Text style={styles.brandTagline}>Pinkama</Text>
            </View>
          </View>
        )}

        {/* Center Title if screen specific */}
        {title ? (
          <View style={styles.titleContainer}>
            <Text style={styles.screenTitle} numberOfLines={1}>
              {title}
            </Text>
            {subtitle && (
              <Text style={styles.screenSubtitle} numberOfLines={1}>
                {subtitle}
              </Text>
            )}
          </View>
        ) : (
          <View style={{ flex: 1 }} />
        )}

        {/* Right Actions: Language Toggle & Notification */}
        <View style={styles.actionsRow}>
          <TouchableOpacity
            style={styles.langPill}
            onPress={toggleLanguage}
            accessibilityLabel="Toggle language"
            accessibilityRole="button"
          >
            <Text style={styles.langText}>
              {language === 'si' ? 'ENG' : 'සිංහල'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.iconButton}
            onPress={onNotificationPress}
            accessibilityLabel="Notifications"
            accessibilityRole="button"
          >
            <Ionicons name="notifications-outline" size={22} color={COLORS.deepPurple} />
            {unreadCount > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{unreadCount}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.md,
    paddingBottom: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
    ...SHADOWS.soft,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  brandContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  logoMark: {
    width: 34,
    height: 34,
    borderRadius: RADIUS.round,
    backgroundColor: COLORS.primaryPink,
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.button,
  },
  brandTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.deepPurple,
    letterSpacing: 0.5,
  },
  brandTagline: {
    fontSize: 10,
    fontWeight: '600',
    color: COLORS.primaryPink,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: RADIUS.round,
    backgroundColor: COLORS.softLavender,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleContainer: {
    flex: 1,
    marginHorizontal: SPACING.sm,
  },
  screenTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: COLORS.deepPurple,
  },
  screenSubtitle: {
    fontSize: 12,
    color: COLORS.mutedText,
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  langPill: {
    paddingHorizontal: SPACING.sm + 2,
    paddingVertical: 5,
    backgroundColor: COLORS.softLavender,
    borderRadius: RADIUS.round,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  langText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.deepPurple,
  },
  iconButton: {
    width: 38,
    height: 38,
    borderRadius: RADIUS.round,
    backgroundColor: '#FAF5FA',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: -2,
    right: -2,
    backgroundColor: COLORS.primaryPink,
    minWidth: 18,
    height: 18,
    borderRadius: RADIUS.round,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
  },
});

