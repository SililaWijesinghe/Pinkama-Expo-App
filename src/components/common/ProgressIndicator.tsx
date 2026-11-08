import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, RADIUS, SPACING } from '../../constants/theme';
import { useLanguage } from '../../context/LanguageContext';

interface ProgressIndicatorProps {
  collected: number;
  total: number;
  showLabels?: boolean;
  height?: number;
}

export const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({
  collected,
  total,
  showLabels = true,
  height = 8,
}) => {
  const { t } = useLanguage();
  const percentage = Math.min(100, Math.round((collected / Math.max(1, total)) * 100));

  return (
    <View style={styles.container}>
      {showLabels && (
        <View style={styles.labelRow}>
          <Text style={styles.collectedText}>
            {t('currency')} {collected.toLocaleString()}
          </Text>
          <Text style={styles.percentageText}>{percentage}%</Text>
          <Text style={styles.totalText}>
            {t('currency')} {total.toLocaleString()}
          </Text>
        </View>
      )}
      <View style={[styles.track, { height }]}>
        <LinearGradient
          colors={COLORS.primaryGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={[styles.fill, { width: `${percentage}%`, height }]}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginVertical: SPACING.xs,
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  collectedText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.primaryPink,
  },
  percentageText: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.deepPurple,
  },
  totalText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.mutedText,
  },
  track: {
    width: '100%',
    backgroundColor: COLORS.borderLight,
    borderRadius: RADIUS.round,
    overflow: 'hidden',
  },
  fill: {
    borderRadius: RADIUS.round,
  },
});

