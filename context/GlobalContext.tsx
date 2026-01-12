import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import {
  Product,
  CartItem,
  User,
  Customer,
  StockMovement,
  InventoryNode,
  WishlistItem,
  OrderHistoryItem,
  SaleChannel,
  BillingData,
  AdminActionLog,
  RMACase,
  Vendor,
  CashSession,
  CashMovement,
  PaymentItem,
  ViewState,
  Command,
  CommandResult,
  RebalanceSuggestion,
  Campaign,
  DatabaseHealth,
  NetworkStatus,
  SystemConfig,
} from '../types';
import { MOCK_PRODUCTS } from '../constants';
import { SecurityService } from '../services/securityService';
import { InventoryService, StockTransition } from '../services/inventoryService';
import { AuthService } from '../services/authService';
import { CommandBus } from '../services/commandBusService';
import { AIAssistantService } from '../services/aiAssistantService';
import { API } from '../services/apiClient';
import { SyncManager } from '../services/dataOrchestrator';

interface Notification {
  id: number;
  message: string;
  type: 'success' | 'info' | 'error' | 'warning';
  duration?: number;
}

interface FinalizeOrderParams {
  total?: number;
  discount?: number;
  channel?: SaleChannel;
  billing?: BillingData;
  payments?: PaymentItem[];
  pointsEarned?: number;
  pointsRedeemed?: number;
  selectedCustomerId?: string;
}

interface GlobalContextType {
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  inventoryNodes: InventoryNode[];
  movements: StockMovement[];
  auditLogs: AdminActionLog[];
  user: User | null;
  setUser: (user: User | null) => void;
  systemConfig: SystemConfig;
  setSystemConfig: (config: SystemConfig) => void;
  activeCashSession: CashSession | null;
  setActiveCashSession: (session: CashSession | null) => void;
  recordCashMovement: (movement: CashMovement) => void;
  activePromos: Campaign[];
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  cartItems: CartItem[];
  wishlistItems: WishlistItem[];
  toggleWishlist: (product: Product) => void;
  removeFromWishlist: (id: string) => void;
  customers: Customer[];
  setCustomers: React.Dispatch<React.SetStateAction<Customer[]>>;
  vendors: Vendor[];
  rmaCases: RMACase[];
  setRMACases: React.Dispatch<React.SetStateAction<RMACase[]>>;
  notifications: Notification[];
  isSyncing: boolean;
  dbHealth: DatabaseHealth;
  networkStatus: NetworkStatus;
  addNotification: (
    message: string,
    type?: 'success' | 'info' | 'error' | 'warning',
    duration?: number,
  ) => void;
  removeNotification: (id: number) => void;
  addToCart: (product: Product, size: number, color: string) => void;
  removeFromCart: (id: string, size: number, color?: string) => void;
  updateCartQuantity: (id: string, size: number, delta: number, color?: string) => void;
  executeCommand: (cmd: Command) => Promise<CommandResult>;
  handleStockUpdate: (
    productId: string,
    variantSku: string,
    quantity: number,
    type: string,
    reason: string,
    nodeId: string,
    targetNodeId?: string,
  ) => void;
  addAuditLog: (action: string, entity: string, entityId: string, details: string) => void;
  finalizeOrder: (params: FinalizeOrderParams) => void;
  currentView: ViewState;
  setView: (view: ViewState) => void;
  selectedProduct: Product | null;
  setSelectedProduct: (p: Product | null) => void;
  runRebalanceAudit: () => Promise<void>;
  rebalanceSuggestions: RebalanceSuggestion[];
  triggerCloudSync: () => Promise<void>;
}

const GlobalContext = createContext<GlobalContextType | undefined>(undefined);

const LocalStorageRepo = {
  get: <T,>(key: string, fallback: T): T => {
    try {
      const val = localStorage.getItem(`rosports-v21-${key}`);
      return val ? JSON.parse(val) : fallback;
    } catch {
      return fallback;
    }
  },
  save: (key: string, val: unknown) => {
    try {
      localStorage.setItem(`rosports-v21-${key}`, JSON.stringify(val));
    } catch (e) {
      console.error('Repo Error', e);
    }
  },
};

const DEFAULT_CONFIG: SystemConfig = {
  company: {
    name: 'ROSPORTS ELITE',
    socialReason: 'ROSPORTS PERU S.A.C.',
    ruc: '20601234567',
    address: 'AV. JAVIER PRADO ESTE 1234, LIMA',
    phone: '+51 999 888 777',
    email: 'contacto@rosports.com.pe',
    logoUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=100',
    workingHours: 'LUN-SAB 09:00 - 21:00',
    socials: { ig: '@rosports_elite', fb: 'rosportsoficial', wa: '51999888777' },
  },
  fiscal: {
    series: { boleta: 'B001', factura: 'F001' },
    lastNumber: { boleta: 42, factura: 15 },
    certificateStatus: 'valid',
    oseProvider: 'BIZLINKS_TECH',
  },
  integrations: {
    payment: { provider: 'NIUBIZ', apiKey: '', merchantId: '4591122', isSandbox: true },
    courier: { provider: 'OLVA', apiKey: '', originUbigeo: '150131' },
    validation: {
      dniApiUrl: 'https://api.reniec.gob.pe/v1',
      rucApiUrl: 'https://api.sunat.gob.pe/v1',
      token: '',
    },
  },
  marketing: {
    pointsPerSol: 1,
    solPerPointRedeemed: 0.1,
    pointsExpirationMonths: 12,
    automaticPromoLogic: 'highest_priority',
  },
  store: {
    seoTitle: 'ROSPORTS | High Performance Footwear',
    seoDescription: 'Zapatillas de running y basketball elite en Perú.',
    domainUrl: 'www.rosports.com.pe',
    shippingPolicy: 'Envíos en 24h para Lima Metropolitana.',
    returnPolicy: '30 días de garantía técnica por defectos.',
    paymentMethods: ['CASH', 'CREDIT_CARD', 'YAPE'],
  },
  notifications: {
    orderConfirm: true,
    stockAlert: true,
    dailyReport: false,
    fiscalError: true,
  },
};

export const GlobalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [theme, setTheme] = useState<'light' | 'dark'>(() => LocalStorageRepo.get('theme', 'dark'));
  const [user, setUserState] = useState<User | null>(() => LocalStorageRepo.get('session', null));
  const [systemConfig, setSystemConfig] = useState<SystemConfig>(() =>
    LocalStorageRepo.get('system-config', DEFAULT_CONFIG),
  );
  const [activeCashSession, setActiveCashSession] = useState<CashSession | null>(() =>
    LocalStorageRepo.get('active-cash', null),
  );
  const [auditLogs, setAuditLogs] = useState<AdminActionLog[]>(() =>
    LocalStorageRepo.get('audit-logs', []),
  );
  const [cartItems, setCartItems] = useState<CartItem[]>(() => LocalStorageRepo.get('cart', []));
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>(() =>
    LocalStorageRepo.get('wishlist', []),
  );
  const [movements, setMovements] = useState<StockMovement[]>(() =>
    LocalStorageRepo.get('movements', []),
  );
  const [rmaCases, setRMACases] = useState<RMACase[]>(() => LocalStorageRepo.get('rma-cases', []));
  const [currentView, setView] = useState<ViewState>(() =>
    LocalStorageRepo.get('current-view', 'home'),
  );
  const [products, setProducts] = useState<Product[]>(() =>
    LocalStorageRepo.get<Product[]>('central-products', MOCK_PRODUCTS),
  );
  const [customers, setCustomers] = useState<Customer[]>(() =>
    LocalStorageRepo.get<Customer[]>('customers', []),
  );

  const [vendors] = useState<Vendor[]>(() =>
    LocalStorageRepo.get<Vendor[]>('vendors', [
      {
        id: 'V-001',
        name: 'NIKE GLOBAL',
        ruc: '20100012345',
        category: 'Footwear',
        status: 'active',
        performanceScore: 98,
        contactName: 'John Nike',
        email: 'supply@nike.com',
      },
      {
        id: 'V-002',
        name: 'ADIDAS PERU',
        ruc: '20200054321',
        category: 'Apparel',
        status: 'active',
        performanceScore: 95,
        contactName: 'Jane Adi',
        email: 'sales@adidas.pe',
      },
    ]),
  );

  const [isSyncing, setIsSyncing] = useState(false);
  const [dbHealth, setDbHealth] = useState<DatabaseHealth>(SyncManager.getHealth());
  const [networkStatus, setNetworkStatus] = useState<NetworkStatus>('ONLINE');
  const [rebalanceSuggestions, setRebalanceSuggestions] = useState<RebalanceSuggestion[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const [activePromos] = useState<Campaign[]>([
    {
      id: 'CAMP-001',
      name: 'Elite Cyber Week',
      description: '20% off en toda la categoría Running',
      type: 'category',
      targetCategory: 'Running',
      discountValue: 20,
      startsAt: '2025-05-10',
      endsAt: '2025-12-31',
      status: 'active',
      usageCount: 42,
      code: 'CYBER20',
      isAutomatic: true,
      channels: ['WEB', 'LOCAL_STORE'],
      canCombine: true,
      maxGlobalUsage: 1000,
      maxPerCustomer: 1,
      priority: 10,
    },
  ]);

  const inventoryNodes: InventoryNode[] = [
    {
      id: 'N-01',
      name: 'Almacén Central',
      type: 'warehouse',
      address: 'Av. Industrial 450',
      status: 'online',
      capacity: 10000,
      allowsPublicSales: false,
    },
    {
      id: 'N-02',
      name: 'Tienda Principal',
      type: 'store',
      address: 'Javier Prado 1234',
      status: 'online',
      capacity: 2000,
      allowsPublicSales: true,
    },
    {
      id: 'N-03',
      name: 'Sucursal Norte',
      type: 'store',
      address: 'Mega Plaza L-22',
      status: 'online',
      capacity: 1500,
      allowsPublicSales: true,
    },
  ];

  const addNotification = useCallback(
    (message: string, type: 'success' | 'info' | 'error' | 'warning' = 'success', duration = 4000) => {
      const id = Date.now();
      setNotifications((prev) => [...prev, { id, message, type, duration }]);
      setTimeout(() => setNotifications((p) => p.filter((n) => n.id !== id)), duration);
    },
    [],
  );

  useEffect(() => {
    const check = setInterval(() => {
      if (user && !AuthService.isSessionValid(user)) {
        setUserState((prev) => (prev ? { ...prev, isLocked: true } : null));
        addNotification('Sesión expirada. Protocolo de re-autenticación activado.', 'warning');
      }
      setNetworkStatus(API.getStatus());
      setDbHealth({ ...SyncManager.getHealth() });
    }, 5000);
    return () => clearInterval(check);
  }, [user, addNotification]);

  const setUser = (u: User | null) => {
    if (u) {
      const sessionUser = AuthService.generateSession(u);
      setUserState(sessionUser);
    } else {
      localStorage.removeItem('rosports-jwt');
      setUserState(null);
    }
  };

  const addAuditLog = useCallback(
    (action: string, entity: string, entityId: string, details: string) => {
      setAuditLogs((prev) => {
        const prevHash = prev.length > 0 ? prev[0].integrityHash : 'GENESIS';
        const logContent = {
          action,
          entity,
          entityId,
          details,
          timestamp: new Date().toISOString(),
        };
        const newLog: AdminActionLog = {
          ...logContent,
          id: `LOG-${Date.now()}`,
          userId: user?.id || 'SYSTEM',
          userName: user?.name || 'System Operator',
          ipAddress: '127.0.0.1',
          integrityHash: SecurityService.generateIntegrityHash(logContent, prevHash),
        };
        return [newLog, ...prev];
      });
    },
    [user],
  );

  const handleStockUpdate = useCallback(
    async (
      productId: string,
      variantSku: string,
      quantity: number,
      type: string,
      reason: string,
      nodeId: string,
      targetNodeId?: string,
    ) => {
      setProducts((prev) =>
        prev.map((p) => {
          const isTargetProduct =
            p.id === productId || p.variants?.some((v) => v.sku === variantSku);
          if (!isTargetProduct) return p;
          return {
            ...p,
            variants: p.variants?.map((v) => {
              if (v.sku !== variantSku) return v;
              return {
                ...v,
                inventoryLevels: v.inventoryLevels.map((level) => {
                  const transitionMap: Record<string, StockTransition> = {
                    reserve: 'RESERVE',
                    release: 'RELEASE',
                    finalize_exit: 'FINALIZE_SALE',
                    entry: 'ENTRY',
                    return: 'RETURN',
                    exit: 'EXIT',
                    waste: 'WASTE',
                    transfer: 'TRANSFER_OUT',
                  };
                  if (level.nodeId === nodeId)
                    return InventoryService.applyTransition(
                      level,
                      quantity,
                      transitionMap[type] || 'EXIT',
                    );
                  if (level.nodeId === targetNodeId && type === 'transfer')
                    return InventoryService.applyTransition(level, quantity, 'TRANSFER_IN');
                  return level;
                }),
              };
            }),
            _syncStatus: 'pending',
          };
        }),
      );
      SyncManager.enqueue({
        entity: 'stock',
        action: 'update',
        payload: { productId, variantSku, quantity, type, nodeId, targetNodeId },
      });
      addAuditLog(
        'stock_adjustment',
        'inventory',
        variantSku,
        `Ajuste encolado: ${type} x${quantity}`,
      );
    },
    [addAuditLog],
  );

  const triggerCloudSync = async () => {
    setIsSyncing(true);
    const data = await SyncManager.forceRehydrate();
    if (data.products) setProducts(data.products);
    if (data.customers) setCustomers(data.customers);
    setIsSyncing(false);
    addNotification('Sincronización global completada', 'success');
  };

  const executeCommand = async (cmd: Command): Promise<CommandResult> => {
    setIsSyncing(true);
    const result = await CommandBus.execute(cmd);
    if (result.success) {
      SyncManager.enqueue({ entity: 'order', action: 'create', payload: cmd });
      addNotification(`TX ${result.transactionId} registrada`, 'success');
    } else addNotification(result.error || 'Execution Fault', 'error');
    setIsSyncing(false);
    return result;
  };

  const finalizeOrder = useCallback(
    async (params: FinalizeOrderParams) => {
      if (cartItems.length === 0) return;
      const orderId = `RS-${Date.now()}`;

      // Si el usuario está logueado, agregar al historial
      if (user) {
        const newOrder: OrderHistoryItem = {
          orderId,
          date: new Date().toISOString(),
          total: params.total || cartItems.reduce((acc, i) => acc + i.price * i.quantity, 0),
          subtotal: (params.total || 0) / 1.18,
          tax: (params.total || 0) - (params.total || 0) / 1.18,
          discount: params.discount || 0,
          channel: params.channel || 'WEB',
          nodeId: 'N-02',
          sellerId: 'SISTEMA_WEB',
          items: cartItems.map((i) => ({
            name: i.name,
            qty: i.quantity,
            price: i.price,
            sku: i.selectedVariantSku,
          })),
          status: 'pending',
          pointsEarned: params.pointsEarned || 0,
          billing: params.billing,
          payments: params.payments || [],
        };

        // Actualizar cliente localmente si es una compra autenticada
        if (params.selectedCustomerId) {
          setCustomers((prev) =>
            prev.map((c) => {
              if (c.id !== params.selectedCustomerId) return c;
              return {
                ...c,
                points: c.points + (params.pointsEarned || 0) - (params.pointsRedeemed || 0),
                purchaseHistory: [newOrder, ...(c.purchaseHistory || [])],
              };
            }),
          );
        }
      }

      SyncManager.enqueue({
        entity: 'order',
        action: 'create',
        payload: { ...params, orderId, items: cartItems },
      });
      cartItems.forEach((item) =>
        handleStockUpdate(
          item.id,
          item.selectedVariantSku,
          item.quantity,
          'finalize_exit',
          `Venta ${orderId}`,
          item.reservationNodeId,
        ),
      );

      setCartItems([]);
      addNotification(`Venta ${orderId} procesada exitosamente`, 'success');
      addAuditLog('create', 'sale', orderId, `Orden finalizada.`);
    },
    [cartItems, user, handleStockUpdate, addNotification, addAuditLog],
  );

  useEffect(() => {
    LocalStorageRepo.save('theme', theme);
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);
  useEffect(() => {
    LocalStorageRepo.save('central-products', products);
    LocalStorageRepo.save('customers', customers);
    LocalStorageRepo.save('audit-logs', auditLogs);
    LocalStorageRepo.save('session', user);
    LocalStorageRepo.save('vendors', vendors);
    LocalStorageRepo.save('system-config', systemConfig);
    LocalStorageRepo.save('cart', cartItems);
    LocalStorageRepo.save('wishlist', wishlistItems);
    LocalStorageRepo.save('current-view', currentView);
    LocalStorageRepo.save('movements', movements);
  }, [
    products,
    customers,
    auditLogs,
    user,
    vendors,
    systemConfig,
    cartItems,
    wishlistItems,
    currentView,
    movements,
  ]);

  return (
    <GlobalContext.Provider
      value={{
        products,
        setProducts,
        inventoryNodes,
        movements,
        auditLogs,
        user,
        setUser,
        systemConfig,
        setSystemConfig,
        theme,
        toggleTheme: () => setTheme((p) => (p === 'light' ? 'dark' : 'light')),
        isSyncing,
        dbHealth,
        networkStatus,
        activeCashSession,
        setActiveCashSession,
        recordCashMovement: (m) => {
          if (activeCashSession)
            setActiveCashSession({
              ...activeCashSession,
              movements: [m, ...activeCashSession.movements],
            });
          API.post('/finance/cash', m);
        },
        activePromos,
        cartItems,
        wishlistItems,
        toggleWishlist: (p) => {
          setWishlistItems((prev) => {
            const exists = prev.find((i) => i.id === p.id);
            if (exists) return prev.filter((i) => i.id !== p.id);
            addNotification(`${p.name} guardado en lista de deseos`, 'info');
            return [...prev, p];
          });
        },
        removeFromWishlist: (id) => setWishlistItems((prev) => prev.filter((i) => i.id !== id)),
        customers,
        setCustomers,
        vendors,
        rmaCases,
        setRMACases,
        notifications,
        addNotification,
        removeNotification: (id) => setNotifications((p) => p.filter((n) => n.id !== id)),
        addToCart: (p, s, c) => {
          const v = p.variants?.find((vx) => vx.size === s && vx.color === c);
          if (!v) return;
          handleStockUpdate(p.id, v.sku, 1, 'reserve', 'Carrito', 'N-02');
          setCartItems((prev) => {
            const exists = prev.find((i) => i.selectedVariantSku === v.sku);
            if (exists) {
              return prev.map((i) =>
                i.selectedVariantSku === v.sku ? { ...i, quantity: i.quantity + 1 } : i,
              );
            }
            return [
              ...prev,
              {
                ...p,
                quantity: 1,
                selectedSize: s,
                selectedColor: c,
                selectedVariantSku: v.sku,
                reservationExpiresAt: Date.now() + 1200000,
                reservationNodeId: 'N-02',
              } as CartItem,
            ];
          });
          addNotification(`${p.name} añadido a la bolsa`, 'success');
        },
        removeFromCart: (id, s, c) => {
          setCartItems((prev) => {
            const item = prev.find(
              (i) => i.id === id && i.selectedSize === s && i.selectedColor === c,
            );
            if (item)
              handleStockUpdate(
                item.id,
                item.selectedVariantSku,
                item.quantity,
                'release',
                'Cancelado',
                item.reservationNodeId,
              );
            return prev.filter(
              (i) => !(i.id === id && i.selectedSize === s && i.selectedColor === c),
            );
          });
        },
        updateCartQuantity: (id, s, delta, c) => {
          setCartItems((prev) =>
            prev.map((item) => {
              if (item.id === id && item.selectedSize === s && item.selectedColor === c) {
                const newQty = item.quantity + delta;
                if (newQty <= 0) return item;
                handleStockUpdate(
                  item.id,
                  item.selectedVariantSku,
                  Math.abs(delta),
                  delta > 0 ? 'reserve' : 'release',
                  'Ajuste',
                  item.reservationNodeId,
                );
                return { ...item, quantity: newQty };
              }
              return item;
            }),
          );
        },
        executeCommand,
        handleStockUpdate,
        addAuditLog,
        finalizeOrder,
        currentView,
        setView,
        selectedProduct,
        setSelectedProduct,
        runRebalanceAudit: async () => {
          setIsSyncing(true);
          const s = await AIAssistantService.getRebalanceStrategy(products);
          setRebalanceSuggestions(s);
          setIsSyncing(false);
        },
        rebalanceSuggestions,
        triggerCloudSync,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobal = () => {
  const context = useContext(GlobalContext);
  if (!context) throw new Error('useGlobal missing');
  return context;
};
