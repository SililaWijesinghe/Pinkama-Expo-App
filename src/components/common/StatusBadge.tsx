import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BillStatus } from '../../types';
import { COLORS, RADIUS, SPACING } from '../../constants/theme';
import { useLanguage } from '../../context/LanguageContext';

interface StatusBadgeProps {
  status: BillStatus;
  size?: 'sm' | 'md';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'md' }) => {
  const { t } = useLanguage();

  const getStatusConfig = () => {
    switch (status) {
      case 'verified':
        return {
          label: t('statusVerified'),
          bg: COLORS.successBg,
          text: COLORS.success,
          icon: 'checkmark-circle' as const,
        };
      case 'funded':
        return {
          label: t('statusFunded'),
          bg: '#E0F2FE',
          text: '#0284C7',
          icon: 'ribbon' as const,
        };
      case 'paid':
        return {
          label: t('statusPaid'),
          bg: '#EDE9FE',
          text: '#7C3AED',
          icon: 'checkmark-done-circle' as const,
        };
      case 'rejected':
        return {
          label: t('statusRejected'),
          bg: COLORS.dangerBg,
          text: COLORS.danger,
          icon: 'alert-circle' as const,
        };
      case 'pending':
      default:
        return {
          label: t('statusPending'),
          bg: COLORS.warningBg,
          text: COLORS.warning,
          icon: 'time' as const,
        };
    }
  };

  const config = getStatusConfig();
  const isSm = size === 'sm';

  return (
    <View
      style={[
        styles.badge,
        { backgroundColor: config.bg },
        isSm && styles.badgeSm,
      ]}
    >
      <Ionicons
        name={config.icon}
        size={isSm ? 12 : 14}
        color={config.text}
        style={{ marginRight: 4 }}
      />
      <Text
        style={[
          styles.text,
          { color: config.text },
          isSm && styles.textSm,
        ]}
      >
        {config.label}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.sm + 2,
    paddingVertical: 4,
    borderRadius: RADIUS.round,
    alignSelf: 'flex-start',
  },
  badgeSm: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: 2,
  },
  text: {
    fontSize: 12,
    fontWeight: '700',
  },
  textSm: {
    fontSize: 10,
  },
});

