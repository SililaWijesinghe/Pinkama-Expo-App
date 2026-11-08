import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { LanguageProvider } from './src/context/LanguageContext';
import { AuthProvider, useAuth } from './src/context/AuthContext';
import { BillProvider } from './src/context/BillContext';
import { BillRequest, DonationRecord } from './src/types';
import { BottomNavigation, NavTab } from './src/components/navigation/BottomNavigation';
import { RoleSelectScreen } from './src/screens/onboarding/RoleSelectScreen';
import { GiverHomeScreen } from './src/screens/giver/GiverHomeScreen';
import { FindDonationsScreen } from './src/screens/giver/FindDonationsScreen';
import { DonationDetailsScreen } from './src/screens/giver/DonationDetailsScreen';
import { DonationPaymentScreen } from './src/screens/giver/DonationPaymentScreen';
import { MyDonationsScreen } from './src/screens/giver/MyDonationsScreen';
import { ReceiverHomeScreen } from './src/screens/receiver/ReceiverHomeScreen';
import { UploadBillScreen } from './src/screens/receiver/UploadBillScreen';
import { MyRequestsScreen } from './src/screens/receiver/MyRequestsScreen';
import { NotificationsScreen } from './src/screens/shared/NotificationsScreen';
import { ProfileScreen } from './src/screens/shared/ProfileScreen';
import { COLORS } from './src/constants/theme';

type ViewMode =
  | 'tab'
  | 'donation_details'
  | 'donation_payment'
  | 'upload_bill';

function MainNavigator() {
  const { role, loginAs } = useAuth();
  const [isRoleSelected, setIsRoleSelected] = useState<boolean>(true); // default true for immediate preview, can logout to reselect
  const [currentTab, setCurrentTab] = useState<NavTab>('home');
  const [viewMode, setViewMode] = useState<ViewMode>('tab');

  // Selected bill for donation flow
  const [activeBill, setActiveBill] = useState<BillRequest | null>(null);
  const [paymentAmount, setPaymentAmount] = useState<number>(0);

  // If user is at Role Selection screen
  if (!isRoleSelected) {
    return (
      <RoleSelectScreen
        onSelectRole={(chosenRole) => {
          loginAs(chosenRole);
          setIsRoleSelected(true);
          setCurrentTab('home');
          setViewMode('tab');
        }}
      />
    );
  }

  // Handle detailed flows (e.g. Donation Details -> Payment -> Success)
  if (viewMode === 'donation_details' && activeBill) {
    return (
      <DonationDetailsScreen
        bill={activeBill}
        onBack={() => setViewMode('tab')}
        onProceedToPayment={(bill, amount) => {
          setPaymentAmount(amount);
          setViewMode('donation_payment');
        }}
      />
    );
  }

  if (viewMode === 'donation_payment' && activeBill) {
    return (
      <DonationPaymentScreen
        bill={activeBill}
        donationAmount={paymentAmount}
        onBack={() => setViewMode('donation_details')}
        onPaymentSuccess={(donation) => {
          setViewMode('tab');
          setCurrentTab('donations');
        }}
      />
    );
  }

  // Handle Receiver Bill Upload Wizard
  if (viewMode === 'upload_bill') {
    return (
      <UploadBillScreen
        onBack={() => setViewMode('tab')}
        onSuccess={() => {
          setViewMode('tab');
          setCurrentTab('requests');
        }}
      />
    );
  }

  // Render current tab content based on Role
  const renderTabContent = () => {
    if (role === 'giver') {
      switch (currentTab) {
        case 'home':
          return (
            <GiverHomeScreen
              onNavigateTab={(tab) => setCurrentTab(tab)}
              onOpenBillDetails={(bill) => {
                setActiveBill(bill);
                setViewMode('donation_details');
              }}
              onDonateToBill={(bill) => {
                setActiveBill(bill);
                setPaymentAmount(Math.max(0, bill.amount - bill.collectedAmount));
                setViewMode('donation_payment');
              }}
            />
          );
        case 'find':
          return (
            <FindDonationsScreen
              onBack={() => setCurrentTab('home')}
              onOpenBillDetails={(bill) => {
                setActiveBill(bill);
                setViewMode('donation_details');
              }}
              onDonateToBill={(bill) => {
                setActiveBill(bill);
                setPaymentAmount(Math.max(0, bill.amount - bill.collectedAmount));
                setViewMode('donation_payment');
              }}
              onNotificationPress={() => setCurrentTab('alerts')}
            />
          );
        case 'donations':
          return (
            <MyDonationsScreen
              onBack={() => setCurrentTab('home')}
              onNotificationPress={() => setCurrentTab('alerts')}
            />
          );
        case 'alerts':
          return <NotificationsScreen onBack={() => setCurrentTab('home')} />;
        case 'profile':
          return (
            <ProfileScreen
              onLogoutToRoleSelect={() => {
                setIsRoleSelected(false);
              }}
            />
          );
        default:
          return null;
      }
    }

    // Receiver Role
    switch (currentTab) {
      case 'home':
        return (
          <ReceiverHomeScreen
            onNavigateTab={(tab) => setCurrentTab(tab)}
            onOpenBillDetails={(bill) => {
              setActiveBill(bill);
              setViewMode('donation_details');
            }}
            onStartUpload={() => setViewMode('upload_bill')}
          />
        );
      case 'requests':
        return (
          <MyRequestsScreen
            onStartUpload={() => setViewMode('upload_bill')}
            onNotificationPress={() => setCurrentTab('alerts')}
          />
        );
      case 'add':
        // Clicking central Add button opens the 3-step wizard
        return (
          <UploadBillScreen
            onBack={() => setCurrentTab('home')}
            onSuccess={() => setCurrentTab('requests')}
          />
        );
      case 'alerts':
        return <NotificationsScreen onBack={() => setCurrentTab('home')} />;
      case 'profile':
        return (
          <ProfileScreen
            onLogoutToRoleSelect={() => {
              setIsRoleSelected(false);
            }}
          />
        );
      default:
        return null;
    }
  };

  return (
    <View style={styles.appContainer}>
      <View style={styles.contentContainer}>{renderTabContent()}</View>
      <BottomNavigation
        currentTab={currentTab}
        onSelectTab={(tab) => {
          if (tab === 'add' && role === 'receiver') {
            setViewMode('upload_bill');
          } else {
            setViewMode('tab');
            setCurrentTab(tab);
          }
        }}
      />
    </View>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <StatusBar style="dark" />
      <LanguageProvider>
        <AuthProvider>
          <BillProvider>
            <MainNavigator />
          </BillProvider>
        </AuthProvider>
      </LanguageProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  appContainer: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  contentContainer: {
    flex: 1,
  },
});
