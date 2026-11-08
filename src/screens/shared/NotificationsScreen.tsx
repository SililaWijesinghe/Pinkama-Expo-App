import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, RADIUS, SPACING } from '../../constants/theme';
import { useLanguage } from '../../context/LanguageContext';
import { useBills } from '../../context/BillContext';
import { PinkamaHeader } from '../../components/common/PinkamaHeader';
import { NotificationCard } from '../../components/cards/NotificationCard';

interface NotificationsScreenProps {
  onBack?: () => void;
}

export const NotificationsScreen: React.FC<NotificationsScreenProps> = ({ onBack }) => {
  const { t } = useLanguage();
  const { notifications, markNotificationRead } = useBills();

  const handlePress = (id: string) => {
    markNotificationRead(id);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <PinkamaHeader
        title={t('tabAlerts')}
        subtitle="යාවත්කාලීන තොරතුරු"
        showBack={false}
      />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {notifications.map((notif) => (
          <NotificationCard
            key={notif.id}
            notification={notif}
            onPress={() => handlePress(notif.id)}
          />
        ))}

        {notifications.length === 0 && (
          <View style={styles.emptyContainer}>
            <Ionicons name="notifications-off-outline" size={48} color={COLORS.lightText} />
            <Text style={styles.emptyTitle}>දැනුම්දීම් කිසිවක් නොමැත</Text>
            <Text style={styles.emptySub}>
              ඔබගේ බිල්පත් හෝ දායකත්වයන් පිළිබඳ නව යාවත්කාලීන කිරීම් මෙහි සටහන් වනු ඇත.
            </Text>
          </View>
        )}
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
});

