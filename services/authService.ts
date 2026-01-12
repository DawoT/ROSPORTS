
import { UserRole, Capability, User } from '../types';

export const AuthService = {
  getCapabilitiesByRole: (role: UserRole): Capability[] => {
    switch (role) {
      case 'admin':
        return [
          'catalog:read', 'catalog:write', 'inventory:read', 'inventory:adjust', 
          'inventory:rebalance', 'crm:read', 'crm:write', 'pos:execute', 'pos:void', 
          'audit:read', 'audit:verify', 'finance:read', 'finance:admin', 'system:manage', 
          'system:config', 'network:view', 'data:sync', 'intel:biometrics', 'reports:inventory', 
          'reports:accounting', 'iam:manage', 'iam:read'
        ];
      case 'supervisor':
        return [
          'catalog:read', 'catalog:write', 'inventory:read', 'crm:read', 
          'pos:execute', 'pos:void', 'audit:read', 'reports:inventory', 'reports:accounting', 'iam:read'
        ];
      case 'sales':
        return ['catalog:read', 'inventory:read', 'crm:read', 'crm:write', 'pos:execute'];
      case 'logistics':
        return ['catalog:read', 'inventory:read', 'inventory:adjust', 'inventory:rebalance', 'reports:inventory'];
      case 'customer':
      default:
        return ['catalog:read', 'intel:biometrics'];
    }
  },

  getOperationalLimits: (role: UserRole) => {
    switch (role) {
      case 'sales': return { maxDiscount: 10, voidAuthRequired: true };
      case 'supervisor': return { maxDiscount: 25, voidAuthRequired: false };
      case 'admin': return { maxDiscount: 100, voidAuthRequired: false };
      default: return { maxDiscount: 0, voidAuthRequired: true };
    }
  },

  generateSession: (user: Partial<User>): User => {
    const now = Date.now();
    const token = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.${btoa(JSON.stringify(user))}.${Math.random().toString(36).substr(2, 10)}`;
    
    localStorage.setItem('rosports-jwt', token);

    return {
      ...user,
      token,
      status: 'active',
      tokenExpiresAt: now + (60 * 60 * 1000), // 1 hora
      capabilities: AuthService.getCapabilitiesByRole(user.role || 'customer'),
      maxDiscountLimit: AuthService.getOperationalLimits(user.role || 'customer').maxDiscount
    } as User;
  },

  isSessionValid: (user: User | null): boolean => {
    if (!user || !user.tokenExpiresAt) return false;
    return Date.now() < user.tokenExpiresAt;
  },

  hasCapability: (userCapabilities: Capability[], required: Capability): boolean => {
    return userCapabilities.includes(required) || userCapabilities.includes('system:manage' as Capability);
  }
};
