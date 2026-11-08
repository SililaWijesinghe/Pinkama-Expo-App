import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, RADIUS, SHADOWS, SPACING } from '../../constants/theme';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { useBills } from '../../context/BillContext';

export type NavTab = 'home' | 'find' | 'donations' | 'requests' | 'add' | 'alerts' | 'profile';

interface BottomNavigationProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
}

export const BottomNavigation: React.FC<BottomNavigationProps> = ({
  currentTab,
  onSelectTab,
}) => {
  const { t } = useLanguage();
  const { role } = useAuth();
  const { notifications } = useBills();

  const unreadAlerts = notifications.some((n) => !n.read);

  if (role === 'giver') {
    return (
      <View style={styles.container}>
        {/* Tab 1: Home */}
        <TouchableOpacity
          style={styles.tabItem}
          onPress={() => onSelectTab('home')}
          accessibilityRole="button"
          accessibilityLabel="Home"
        >
          <Ionicons
            name={currentTab === 'home' ? 'home' : 'home-outline'}
            size={22}
            color={currentTab === 'home' ? COLORS.primaryPink : COLORS.mutedText}
          />
          <Text
            style={[styles.tabLabel, currentTab === 'home' && styles.tabLabelActive]}
          >
            {t('tabHome')}
          </Text>
        </TouchableOpacity>

        {/* Tab 2: Find */}
        <TouchableOpacity
          style={styles.tabItem}
          onPress={() => onSelectTab('find')}
          accessibilityRole="button"
          accessibilityLabel="Find"
        >
          <Ionicons
            name={currentTab === 'find' ? 'search' : 'search-outline'}
            size={22}
            color={currentTab === 'find' ? COLORS.primaryPink : COLORS.mutedText}
          />
          <Text
            style={[styles.tabLabel, currentTab === 'find' && styles.tabLabelActive]}
          >
            {t('tabFind')}
          </Text>
        </TouchableOpacity>

        {/* Tab 3: Donations */}
        <TouchableOpacity
          style={styles.tabItem}
          onPress={() => onSelectTab('donations')}
          accessibilityRole="button"
          accessibilityLabel="Donations"
        >
          <Ionicons
            name={currentTab === 'donations' ? 'heart' : 'heart-outline'}
            size={22}
            color={currentTab === 'donations' ? COLORS.primaryPink : COLORS.mutedText}
          />
          <Text
            style={[styles.tabLabel, currentTab === 'donations' && styles.tabLabelActive]}
          >
            {t('tabDonations')}
          </Text>
        </TouchableOpacity>

        {/* Tab 4: Alerts */}
        <TouchableOpacity
          style={styles.tabItem}
          onPress={() => onSelectTab('alerts')}
          accessibilityRole="button"
          accessibilityLabel="Alerts"
        >
          <View style={styles.iconWithBadge}>
            <Ionicons
              name={currentTab === 'alerts' ? 'notifications' : 'notifications-outline'}
              size={22}
              color={currentTab === 'alerts' ? COLORS.primaryPink : COLORS.mutedText}
            />
            {unreadAlerts && <View style={styles.alertDot} />}
          </View>
          <Text
            style={[styles.tabLabel, currentTab === 'alerts' && styles.tabLabelActive]}
          >
            {t('tabAlerts')}
          </Text>
        </TouchableOpacity>

        {/* Tab 5: Profile */}
        <TouchableOpacity
          style={styles.tabItem}
          onPress={() => onSelectTab('profile')}
          accessibilityRole="button"
          accessibilityLabel="Profile"
        >
          <Ionicons
            name={currentTab === 'profile' ? 'person' : 'person-outline'}
            size={22}
            color={currentTab === 'profile' ? COLORS.primaryPink : COLORS.mutedText}
          />
          <Text
            style={[styles.tabLabel, currentTab === 'profile' && styles.tabLabelActive]}
          >
            {t('tabProfile')}
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Receiver Navigation
  return (
    <View style={styles.container}>
      {/* Tab 1: Home */}
      <TouchableOpacity
        style={styles.tabItem}
        onPress={() => onSelectTab('home')}
        accessibilityRole="button"
        accessibilityLabel="Home"
      >
        <Ionicons
          name={currentTab === 'home' ? 'home' : 'home-outline'}
          size={22}
          color={currentTab === 'home' ? COLORS.primaryPink : COLORS.mutedText}
        />
        <Text
          style={[styles.tabLabel, currentTab === 'home' && styles.tabLabelActive]}
        >
          {t('tabHome')}
        </Text>
      </TouchableOpacity>

      {/* Tab 2: Requests */}
      <TouchableOpacity
        style={styles.tabItem}
        onPress={() => onSelectTab('requests')}
        accessibilityRole="button"
        accessibilityLabel="Requests"
      >
        <Ionicons
          name={currentTab === 'requests' ? 'document-text' : 'document-text-outline'}
          size={22}
          color={currentTab === 'requests' ? COLORS.primaryPink : COLORS.mutedText}
        />
        <Text
          style={[styles.tabLabel, currentTab === 'requests' && styles.tabLabelActive]}
        >
          {t('tabRequests')}
        </Text>
      </TouchableOpacity>

      {/* Tab 3: Central Elevated Add Bill Button */}
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={() => onSelectTab('add')}
        style={styles.elevatedButtonContainer}
        accessibilityRole="button"
        accessibilityLabel="Add New Bill"
      >
        <LinearGradient
          colors={COLORS.primaryGradient}
          style={styles.elevatedButton}
        >
          <Ionicons name="add" size={28} color="#FFFFFF" />
        </LinearGradient>
      </TouchableOpacity>

      {/* Tab 4: Alerts */}
      <TouchableOpacity
        style={styles.tabItem}
        onPress={() => onSelectTab('alerts')}
        accessibilityRole="button"
        accessibilityLabel="Alerts"
      >
        <View style={styles.iconWithBadge}>
          <Ionicons
            name={currentTab === 'alerts' ? 'notifications' : 'notifications-outline'}
            size={22}
            color={currentTab === 'alerts' ? COLORS.primaryPink : COLORS.mutedText}
          />
          {unreadAlerts && <View style={styles.alertDot} />}
        </View>
        <Text
          style={[styles.tabLabel, currentTab === 'alerts' && styles.tabLabelActive]}
        >
          {t('tabAlerts')}
        </Text>
      </TouchableOpacity>

      {/* Tab 5: Profile */}
      <TouchableOpacity
        style={styles.tabItem}
        onPress={() => onSelectTab('profile')}
        accessibilityRole="button"
        accessibilityLabel="Profile"
      >
        <Ionicons
          name={currentTab === 'profile' ? 'person' : 'person-outline'}
          size={22}
          color={currentTab === 'profile' ? COLORS.primaryPink : COLORS.mutedText}
        />
        <Text
          style={[styles.tabLabel, currentTab === 'profile' && styles.tabLabelActive]}
        >
          {t('tabProfile')}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: COLORS.borderLight,
    paddingTop: SPACING.sm,
    paddingBottom: Platform.OS === 'ios' ? 24 : SPACING.sm,
    paddingHorizontal: SPACING.sm,
    alignItems: 'center',
    justifyContent: 'space-around',
    ...SHADOWS.card,
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    paddingVertical: 2,
  },
  iconWithBadge: {
    position: 'relative',
  },
  alertDot: {
    position: 'absolute',
    top: 0,
    right: -2,
    width: 8,
    height: 8,
    borderRadius: RADIUS.round,
    backgroundColor: COLORS.primaryPink,
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.mutedText,
    marginTop: 4,
  },
  tabLabelActive: {
    color: COLORS.primaryPink,
    fontWeight: '800',
  },
  elevatedButtonContainer: {
    top: -14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  elevatedButton: {
    width: 52,
    height: 52,
    borderRadius: RADIUS.round,
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.button,
  },
});

