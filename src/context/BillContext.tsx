import React, { createContext, useContext, useState, ReactNode } from 'react';
import { BillRequest, BillType, DonationRecord, NotificationItem, PaymentMethod } from '../types';
import { INITIAL_BILLS, INITIAL_DONATIONS, INITIAL_NOTIFICATIONS } from '../constants/mockData';

interface BillContextType {
  bills: BillRequest[];
  donations: DonationRecord[];
  notifications: NotificationItem[];
  addBillRequest: (newBill: Omit<BillRequest, 'id' | 'collectedAmount' | 'status' | 'submittedAt' | 'donorCount'>) => BillRequest;
  donateToBill: (billId: string, amount: number, paymentMethod: PaymentMethod) => DonationRecord | null;
  markNotificationRead: (id: string) => void;
  // Filters
  selectedBillType: 'all' | BillType;
  setSelectedBillType: (type: 'all' | BillType) => void;
  selectedDistrict: string;
  setSelectedDistrict: (district: string) => void;
  selectedAmountRange: 'all' | 'under3000' | '3000to6000' | 'above6000';
  setSelectedAmountRange: (range: 'all' | 'under3000' | '3000to6000' | 'above6000') => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  filteredBills: BillRequest[];
  // Stats
  totalDonated: number;
  familiesAssistedCount: number;
  activeRequestsCount: number;
}

const BillContext = createContext<BillContextType | undefined>(undefined);

export const BillProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [bills, setBills] = useState<BillRequest[]>(INITIAL_BILLS);
  const [donations, setDonations] = useState<DonationRecord[]>(INITIAL_DONATIONS);
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);

  // Filters
  const [selectedBillType, setSelectedBillType] = useState<'all' | BillType>('all');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('සියල්ල / All');
  const [selectedAmountRange, setSelectedAmountRange] = useState<'all' | 'under3000' | '3000to6000' | 'above6000'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const addBillRequest = (
    newBillData: Omit<BillRequest, 'id' | 'collectedAmount' | 'status' | 'submittedAt' | 'donorCount'>
  ): BillRequest => {
    const newBill: BillRequest = {
      ...newBillData,
      id: `bill-${Date.now()}`,
      collectedAmount: 0,
      status: 'pending',
      submittedAt: new Date().toISOString().split('T')[0],
      donorCount: 0,
    };
    setBills((prev) => [newBill, ...prev]);

    // Add local notification
    const newNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      title: 'නව බිල්පතක් යොමු කෙරිණි',
      message: `${newBill.provider} බිල්පත (රු. ${newBill.amount.toLocaleString()}) සත්‍යාපනය සඳහා යොමු කරන ලදී.`,
      timestamp: 'මීට සුළු මොහොතකට පෙර',
      read: false,
      type: 'bill',
    };
    setNotifications((prev) => [newNotif, ...prev]);

    return newBill;
  };

  const donateToBill = (billId: string, amount: number, paymentMethod: PaymentMethod): DonationRecord | null => {
    const targetBill = bills.find((b) => b.id === billId);
    if (!targetBill) return null;

    const newCollected = Math.min(targetBill.amount, targetBill.collectedAmount + amount);
    const isNowFunded = newCollected >= targetBill.amount;

    // Update bill
    setBills((prev) =>
      prev.map((b) =>
        b.id === billId
          ? {
              ...b,
              collectedAmount: newCollected,
              status: isNowFunded ? 'funded' : b.status,
              donorCount: b.donorCount + 1,
            }
          : b
      )
    );

    // Create donation receipt
    const receiptNo = `PNK-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const newDonation: DonationRecord = {
      id: `don-${Date.now()}`,
      billId: targetBill.id,
      billType: targetBill.billType,
      provider: targetBill.provider,
      accountNumber: targetBill.accountNumber,
      recipientName: targetBill.accountHolderName,
      district: targetBill.district,
      city: targetBill.city,
      amount,
      donatedAt: new Date().toLocaleString(),
      paymentMethod,
      receiptNo,
      status: 'confirmed',
    };

    setDonations((prev) => [newDonation, ...prev]);

    // Add Notification
    const donationNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      title: 'දානමය පින්කම සාර්ථකයි!',
      message: `${targetBill.accountHolderName} වෙනුවෙන් රු. ${amount.toLocaleString()} ක සෘජු දායකත්වයක් සටහන් විය. රිසිට් අංකය: ${receiptNo}`,
      timestamp: 'දැන්',
      read: false,
      type: 'donation',
    };
    setNotifications((prev) => [donationNotif, ...prev]);

    return newDonation;
  };

  const markNotificationRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  // Filter logic
  const filteredBills = bills.filter((b) => {
    if (selectedBillType !== 'all' && b.billType !== selectedBillType) {
      return false;
    }
    if (selectedDistrict !== 'සියල්ල / All' && b.district !== selectedDistrict) {
      return false;
    }
    if (selectedAmountRange === 'under3000' && b.amount >= 3000) {
      return false;
    }
    if (selectedAmountRange === '3000to6000' && (b.amount < 3000 || b.amount > 6000)) {
      return false;
    }
    if (selectedAmountRange === 'above6000' && b.amount <= 6000) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = b.accountHolderName.toLowerCase().includes(q);
      const matchCity = b.city.toLowerCase().includes(q);
      const matchDistrict = b.district.toLowerCase().includes(q);
      const matchAcc = b.accountNumber.includes(q);
      if (!matchName && !matchCity && !matchDistrict && !matchAcc) {
        return false;
      }
    }
    return true;
  });

  const totalDonated = donations.reduce((sum, d) => sum + d.amount, 0);
  const familiesAssistedCount = new Set(donations.map((d) => d.recipientName)).size;
  const activeRequestsCount = bills.filter((b) => b.status === 'verified' || b.status === 'pending').length;

  return (
    <BillContext.Provider
      value={{
        bills,
        donations,
        notifications,
        addBillRequest,
        donateToBill,
        markNotificationRead,
        selectedBillType,
        setSelectedBillType,
        selectedDistrict,
        setSelectedDistrict,
        selectedAmountRange,
        setSelectedAmountRange,
        searchQuery,
        setSearchQuery,
        filteredBills,
        totalDonated,
        familiesAssistedCount,
        activeRequestsCount,
      }}
    >
      {children}
    </BillContext.Provider>
  );
};

export const useBills = (): BillContextType => {
  const context = useContext(BillContext);
  if (!context) {
    throw new Error('useBills must be used within a BillProvider');
  }
  return context;
};

