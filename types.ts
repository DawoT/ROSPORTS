
export interface Review {
  id: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
  metrics: {
    comfort: number;
    durability: number;
    fit: 'small' | 'true' | 'large';
  };
  verifiedPurchase: boolean;
}

export interface CategoryHierarchy {
  id: string;
  label: string;
  subcategories: { id: string; label: string }[];
}

export interface StockLevel {
  nodeId: string;
  quantity: number;
  minStock: number;
  reserved: number;
}

export interface ProductVariant {
  sku: string;
  barcode: string;
  size: number;
  color: string;
  colorName: string;
  images: string[];
  inventoryLevels: StockLevel[];
  status: 'active' | 'out_of_stock' | 'discontinued';
}

export interface Product {
  id: string;
  name: string;
  brand: string;
  price: number;
  originalPrice?: number;
  cost?: number;
  image: string;
  description: string;
  category: 'Running' | 'Basketball' | 'Lifestyle' | 'Training';
  tags?: string[];
  sku_parent?: string;
  variants?: ProductVariant[];
  status?: 'active' | 'inactive' | 'out_of_stock' | 'discontinued';
  weight: string;
  drop: string;
  tractionScore: number;
  material?: string;
  colors?: string[];
  cushioningLevel?: string;
  reviews?: Review[];
  _syncStatus?: 'synced' | 'pending' | 'error';
  _lastUpdated?: string;
  demandVelocity?: number; 
}

export type UserRole = 'admin' | 'customer' | 'sales' | 'finance' | 'logistics' | 'supervisor';

export type Capability = 
  | 'catalog:read' | 'catalog:write' 
  | 'inventory:read' | 'inventory:adjust' | 'inventory:rebalance'
  | 'crm:read' | 'crm:write' 
  | 'pos:execute' | 'pos:void'
  | 'audit:read' | 'audit:verify'
  | 'finance:read' | 'finance:admin'
  | 'system:manage'
  | 'system:config'
  | 'ops:monitor'
  | 'network:view'
  | 'data:sync'
  | 'intel:biometrics'
  | 'reports:inventory'
  | 'reports:accounting'
  | 'iam:manage'
  | 'iam:read';

export interface AthleteBiometrics {
  gaitType: 'neutral' | 'pronator' | 'supinator';
  weeklyVolumeKm: number;
  activeInjuryRisks: string[];
  suggestedDrop: string;
  lastReplacementDate: string;
}

export interface PointMovement {
  id: string;
  date: string;
  type: 'earned' | 'redeemed' | 'expired';
  points: number;
  reference: string;
  balanceBefore: number;
  balanceAfter: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  capabilities: Capability[];
  status: 'active' | 'inactive';
  isLocked?: boolean;
  avatar?: string;
  lastLogin?: string;
  createdAt?: string;
  gear?: { id: string; name: string; kmUsed: number; maxKm: number; purchaseDate: string; image: string; degradationScore: number }[];
  stats?: { totalKm: string; trainingHours: string; deployments: string };
  athleteTier?: string;
  token?: string;
  tokenExpiresAt?: number;
  biometrics?: AthleteBiometrics;
  maxDiscountLimit?: number;
  addresses?: Address[];
}

export interface Address {
  id: string;
  label: string;
  fullName: string;
  street: string;
  district: string;
  city: string;
  reference?: string;
  phone: string;
  isDefault: boolean;
}

export interface SystemConfig {
  company: {
    name: string;
    socialReason: string;
    ruc: string;
    address: string;
    phone: string;
    email: string;
    logoUrl: string;
    workingHours: string;
    socials: { ig: string; fb: string; wa: string };
  };
  fiscal: {
    series: { boleta: string; factura: string };
    lastNumber: { boleta: number; factura: number };
    certificateStatus: 'valid' | 'expired' | 'none';
    oseProvider: string;
  };
  integrations: {
    payment: {
      provider: 'NIUBIZ' | 'IZIPAY' | 'CULQI';
      apiKey: string;
      merchantId: string;
      isSandbox: boolean;
    };
    courier: {
      provider: 'OLVA' | 'SHALOM' | 'DIRECT';
      apiKey: string;
      originUbigeo: string;
    };
    validation: {
      dniApiUrl: string;
      rucApiUrl: string;
      token: string;
    };
  };
  marketing: {
    pointsPerSol: number;
    solPerPointRedeemed: number;
    pointsExpirationMonths: number;
    automaticPromoLogic: string;
  };
  store: {
    seoTitle: string;
    seoDescription: string;
    domainUrl: string;
    shippingPolicy: string;
    returnPolicy: string;
    paymentMethods: string[];
  };
  notifications: {
    orderConfirm: boolean;
    stockAlert: boolean;
    dailyReport: boolean;
    fiscalError: boolean;
  };
}

export interface StockTransfer {
  id: string;
  originNodeId: string;
  targetNodeId: string;
  items: { sku: string; quantity: number; name: string }[];
  status: 'pending' | 'shipped' | 'received';
  createdAt: string;
  shippedAt?: string;
  receivedAt?: string;
  authorizedBy: string;
  receivedBy?: string;
}

export type ViewState = 'home' | 'shop' | 'dashboard' | 'admin-products' | 'admin-inventory' | 'admin-crm' | 'admin-pos' | 'admin-ledger' | 'auth' | 'checkout' | 'admin-ops' | 'admin-audit' | 'admin-logs' | 'product-telemetry' | 'admin-supply' | 'admin-finance' | 'admin-cash' | 'admin-shipping' | 'admin-rma' | 'admin-vendors' | 'admin-command' | 'admin-marketing' | 'admin-system-health' | 'product-details' | 'athlete-biometrics' | 'admin-inventory-reports' | 'admin-accounting-reports' | 'admin-iam' | 'admin-settings' | 'admin-branches';

// --- Connectivity & Resiliency ---
export type NetworkStatus = 'ONLINE' | 'OFFLINE' | 'DEGRADED' | 'MAINTENANCE' | 'CIRCUIT_OPEN';

export interface APIResponse<T> {
  data: T | null;
  status: number;
  message: string;
  traceId: string;
  timestamp: string;
}

export interface NetworkLog {
  id: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  endpoint: string;
  duration: number;
  status: number;
  timestamp: string;
  size: string;
}

export interface LiveEvent {
  id: string;
  type: 'TRANSACTION' | 'SECURITY' | 'INVENTORY' | 'SYSTEM' | 'BIOMETRIC_ALERT' | 'IAM_CHANGE' | 'CONFIG_CHANGE' | 'TRANSFER_ALERT' | 'PAYMENT_ALERT' | 'COURIER_UPDATE';
  severity: 'info' | 'warning' | 'critical';
  message: string;
  timestamp: string;
  node: string;
}

export interface AdminActionLog {
  id: string;
  userId: string;
  userName: string;
  action: string;
  entity: string;
  entityId: string;
  details: string;
  timestamp: string;
  ipAddress: string;
  integrityHash: string;
}

export interface SyncJob {
  id: string;
  entity: 'product' | 'customer' | 'order' | 'stock' | 'user' | 'config' | 'branch' | 'transfer';
  action: 'create' | 'update' | 'delete';
  payload: any;
  timestamp: string;
  retries: number;
}

export interface DatabaseHealth {
  localChanges: number;
  lastGlobalSync: string;
  integrityScore: number;
  status: 'SYNCHRONIZED' | 'PENDING_PUSH' | 'CONFLICT_DETECTED';
}

export interface Command {
  type: string;
  entity: string;
  entityId: string;
  payload: any;
  metadata?: {
    reason?: string;
    nodeId?: string;
    correlationId?: string;
  };
}

export interface CommandResult {
  success: boolean;
  transactionId: string;
  timestamp: string;
  effects: string[];
  error?: string;
}

export interface RebalanceSuggestion {
  sku: string;
  productName: string;
  sourceNode: string;
  targetNode: string;
  quantity: number;
  priority: 'low' | 'medium' | 'high';
  reason: string;
}

export interface VisualDiagnostic {
  confidence: number;
  detectedFaults: string[];
  recommendation: 'approve' | 'manual_review' | 'reject';
  aiAnalysis: string;
}

export interface RMACase {
  id: string;
  orderId: string;
  customerId: string;
  status: 'open' | 'under_review' | 'approved' | 'rejected';
  reason: 'defective' | 'wrong_size' | 'not_as_described';
  createdAt: string;
  technicianNote?: string;
  resolution?: 'refund' | 'replacement' | 'repair';
  visualDiagnostic?: VisualDiagnostic;
  productImage?: string;
}

export interface StockMovement {
  id: string;
  timestamp: string;
  type: string;
  items: { sku: string; quantity: number }[];
  reason: string;
  sourceNodeId: string;
  targetNodeId?: string;
}

export interface CartItem extends Product {
  quantity: number;
  selectedSize: number;
  selectedColor: string;
  selectedVariantSku: string;
  reservationExpiresAt: number;
  reservationNodeId: string;
  manualDiscount?: number;
}

export interface InventoryNode {
  id: string;
  name: string;
  type: 'warehouse' | 'store';
  address: string;
  status: 'online' | 'offline';
  capacity: number;
  responsible?: string;
  phone?: string;
  workingHours?: string;
  allowsPublicSales: boolean;
}

export type HealthStatus = 'NOMINAL' | 'DEGRADED' | 'CRITICAL';
export type DocType = 'DNI' | 'RUC' | 'PASSPORT';
export type CustomerSegment = 'vip' | 'frequent' | 'new' | 'inactive';
export type SaleChannel = 'WEB' | 'LOCAL_STORE' | 'SOCIAL_MEDIA' | 'WHATSAPP';
export type BillingType = 'BOLETA' | 'FACTURA';
export type PaymentMethod = 'CASH' | 'CREDIT_CARD' | 'DIGITAL_WALLET' | 'BANK_TRANSFER';
export type WishlistItem = Product;
export type AppEventType = 'STOCK_LOW' | 'SALE_FINALIZED' | 'MODULE_FAILURE' | 'NETWORK_OUTAGE' | 'DATA_SYNC_SUCCESS' | 'DATA_SYNC_ERROR' | 'BACKEND_PUSH' | 'PAYMENT_ALERT';

export interface ElectronicReceiptMetadata {
  hashCPE: string;
  digestValue: string;
  oseStatus: 'ACCEPTED' | 'REJECTED' | 'PENDING';
  sunatResponseCode: string;
  pdfUrl?: string;
  xmlUrl?: string;
}

export interface BillingData {
  type: BillingType;
  docType: string;
  docNumber: string;
  nameOrSocialReason: string;
  fiscalAddress?: string;
  email?: string;
  hashCPE?: string;
  oseStatus?: string;
  fiscalMetadata?: ElectronicReceiptMetadata;
}

export interface PaymentItem {
  id: string;
  method: PaymentMethod;
  amount: number;
  receivedAmount?: number;
  changeAmount?: number;
  reference?: string;
}

export interface OrderHistoryItem {
  orderId: string;
  date: string;
  total: number;
  subtotal: number;
  tax: number;
  discount: number;
  channel: SaleChannel;
  nodeId: string;
  sellerId: string;
  items: { name: string; qty: number; price: number; sku: string }[];
  status: 'delivered' | 'pending' | 'cancelled' | 'voided';
  pointsEarned: number;
  billing: BillingData;
  payments: PaymentItem[];
  voidReason?: string;
  voidDate?: string;
  shippingTracking?: {
    carrier: string;
    code: string;
    status: string;
    estimatedDelivery: string;
  };
}

export interface Customer {
  id: string;
  fullName: string;
  docType: DocType;
  docNumber: string;
  email: string;
  phone: string;
  address: string;
  district: string;
  city: string;
  points: number;
  creditBalance: number;
  status: 'active' | 'inactive';
  registrationDate: string;
  preferredBillingData?: BillingData;
  purchaseHistory?: OrderHistoryItem[];
  segment: CustomerSegment;
  _syncStatus?: 'synced' | 'pending' | 'error';
}

export interface Vendor {
  id: string;
  name: string;
  ruc: string;
  category: string;
  status: 'active' | 'inactive';
  performanceScore: number;
  contactName: string;
  email: string;
}

export interface CashDenomination {
  value: number;
  label: string;
  count: number;
}

export interface CashMovement {
  id: string;
  type: 'income' | 'expense';
  amount: number;
  concept: string;
  authorizedBy: string;
  timestamp: string;
  customerId?: string;
}

export interface CashSession {
  id: string;
  userId: string;
  userName: string;
  nodeId: string;
  status: 'open' | 'closed';
  startTime: string;
  endTime?: string;
  openingBalance: number;
  actualCashBalance?: number;
  difference?: number;
  openingDenominations: CashDenomination[];
  closingDenominations?: CashDenomination[];
  movements: CashMovement[];
  systemExpected: {
    cash: number;
    card: number;
    digital: number;
    other: number;
    totalDiscounts: number;
    salesCount: number;
  };
  integrityHash: string;
  receiptsIssued: string[];
}

export interface Campaign {
  id: string;
  name: string;
  description: string;
  type: 'category_discount' | 'fixed_coupon' | 'bogo' | 'flash_sale' | 'percentage' | 'fixed' | 'category' | 'brand';
  targetCategory?: string;
  targetBrand?: string;
  discountValue: number;
  discount?: number;
  minPurchaseAmount?: number;
  startsAt: string;
  endsAt: string;
  status: 'active' | 'inactive';
  usageCount: number;
  code: string;
  isAutomatic: boolean;
  channels: SaleChannel[];
  maxGlobalUsage: number;
  maxPerCustomer: number;
  priority: number;
  canCombine: boolean;
}

export interface PurchaseOrder {
  id: string;
  provider: string;
  status: 'ordered' | 'in_transit' | 'received';
  expectedDate: string;
  totalCost: number;
  currency: 'PEN' | 'USD';
  items: any[];
}

export interface ShipmentManifest {
  id: string;
  orderId: string;
  originNode: string;
  destinationAddress: string;
  carrier: string;
  trackingCode: string;
  status: 'pending' | 'shipped' | 'delivered';
  dispatchedAt?: string;
}

export interface AppEvent {
  type: AppEventType;
  payload: any;
  timestamp: string;
  source: string;
}

export interface ModuleHealth {
  id: string;
  label: string;
  status: HealthStatus;
  latency: number;
  errors: number;
  lastSync: string;
}
