export type Language = 'si' | 'en';

export type UserRole = 'guest' | 'giver' | 'receiver';

export type BillType = 'electricity' | 'water';

export type UtilityProvider = 'CEB' | 'LECO' | 'NWSDB';

export type BillStatus = 'pending' | 'verified' | 'funded' | 'paid' | 'rejected';

export type PaymentMethod = 'card' | 'payhere' | 'bank_transfer';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  district: string;
  city: string;
  avatarUrl?: string;
}

export interface BillRequest {
  id: string;
  billType: BillType;
  provider: UtilityProvider;
  accountNumber: string;
  accountHolderName: string;
  district: string;
  city: string;
  amount: number;
  collectedAmount: number;
  dueDate: string;
  status: BillStatus;
  submittedAt: string;
  billImageUrl?: string;
  familyStory?: string;
  recipientAvatar?: string;
  donorCount: number;
  isUrgent?: boolean;
}

export interface DonationRecord {
  id: string;
  billId: string;
  billType: BillType;
  provider: UtilityProvider;
  accountNumber: string;
  recipientName: string;
  district: string;
  city: string;
  amount: number;
  donatedAt: string;
  paymentMethod: PaymentMethod;
  receiptNo: string;
  status: 'confirmed' | 'processing';
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  type: 'donation' | 'bill' | 'system';
}

