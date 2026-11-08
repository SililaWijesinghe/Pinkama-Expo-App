export const COLORS = {
  // Brand Identity
  primaryPink: '#EC087B',
  deepPurple: '#510653',
  secondaryPink: '#F42A9A',
  softLavender: '#F8E9F7',
  cardBg: '#FFFFFF',
  background: '#FAF4FA',
  accentBlue: '#1689E8',
  darkText: '#21102D',
  mutedText: '#7B6A82',
  lightText: '#A191A7',
  border: '#F0D6EE',
  borderLight: '#F7EBF5',
  
  // Utility & Status
  electricity: '#E87A00',
  electricityBg: '#FFF4E5',
  water: '#0284C7',
  waterBg: '#E0F2FE',
  success: '#10B981',
  successBg: '#D1FAE5',
  warning: '#F59E0B',
  warningBg: '#FEF3C7',
  danger: '#EF4444',
  dangerBg: '#FEE2E2',
  
  // Gradients
  primaryGradient: ['#EC087B', '#F42A9A', '#9C177E'] as const,
  purpleGradient: ['#510653', '#801072'] as const,
  softGradient: ['#FFF5FC', '#F8E9F7'] as const,
  cardGradient: ['#FFFFFF', '#FCF7FB'] as const,
  goldGradient: ['#F59E0B', '#D97706'] as const,
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
};

export const RADIUS = {
  sm: 8,
  md: 14,
  lg: 18,
  xl: 24,
  round: 999,
};

export const SHADOWS = {
  soft: {
    shadowColor: '#510653',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3,
  },
  card: {
    shadowColor: '#510653',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 5,
  },
  button: {
    shadowColor: '#EC087B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
};

