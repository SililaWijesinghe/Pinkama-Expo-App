import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NotificationItem } from '../../types';
import { COLORS, RADIUS, SHADOWS, SPACING } from '../../constants/theme';

interface NotificationCardProps {
  notification: NotificationItem;
  onPress: () => void;
}

export const NotificationCard: React.FC<NotificationCardProps> = ({
  notification,
  onPress,
}) => {
  const getIconConfig = () => {
    switch (notification.type) {
      case 'donation':
        return {
          name: 'heart-circle' as const,
          color: COLORS.primaryPink,
          bg: COLORS.softLavender,
        };
      case 'bill':
        return {
          name: 'document-text' as const,
          color: COLORS.water,
          bg: COLORS.waterBg,
        };
      case 'system':
      default:
        return {
          name: 'information-circle' as const,
          color: COLORS.deepPurple,
          bg: '#EDE9FE',
        };
    }
  };

  const icon = getIconConfig();

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      style={[styles.card, !notification.read && styles.unreadCard]}
    >
      <View style={[styles.iconBox, { backgroundColor: icon.bg }]}>
        <Ionicons name={icon.name} size={24} color={icon.color} />
      </View>
      <View style={styles.textContainer}>
        <View style={styles.titleRow}>
          <Text style={[styles.title, !notification.read && styles.unreadTitle]}>
            {notification.title}
          </Text>
          {!notification.read && <View style={styles.unreadDot} />}
        </View>
        <Text style={styles.message}>{notification.message}</Text>
        <Text style={styles.timestamp}>{notification.timestamp}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    marginVertical: 4,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    ...SHADOWS.soft,
  },
  unreadCard: {
    borderColor: COLORS.border,
    backgroundColor: '#FFFDFE',
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: RADIUS.round,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
  },
  textContainer: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.deepPurple,
    flex: 1,
  },
  unreadTitle: {
    color: COLORS.primaryPink,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: RADIUS.round,
    backgroundColor: COLORS.primaryPink,
    marginLeft: 6,
  },
  message: {
    fontSize: 12,
    color: COLORS.darkText,
    marginTop: 4,
    lineHeight: 18,
  },
  timestamp: {
    fontSize: 11,
    color: COLORS.lightText,
    marginTop: 6,
  },
});

