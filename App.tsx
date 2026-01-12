
import React, { useState, useEffect } from 'react';
import { GlobalProvider, useGlobal } from './context/GlobalContext';
import { ViewState, Product } from './types';
import Layout from './components/Layout';
import PromotionalSlider from './components/PromotionalSlider';
import ProductCard from './components/ProductCard';
import QuickViewModal from './components/QuickViewModal';
import AuthView from './components/AuthView';
import UserDashboard from './components/UserDashboard';
import CheckoutView from './components/CheckoutView';
import AdminProductManager from './components/AdminProductManager';
import InventoryControlCenter from './components/InventoryControlCenter';
import CRMManager from './components/CRMManager';
import PerformanceAnalytics from './components/PerformanceAnalytics';
import GlobalSearch from './components/GlobalSearch';
import POSInterface from './components/POSInterface';
import OrderLedger from './components/OrderLedger';
import OperationalDashboard from './components/OperationalDashboard';
import InventoryConciliation from './components/InventoryConciliation';
import ProductTelemetryDeepDive from './components/ProductTelemetryDeepDive';
import SupplyChainManager from './components/SupplyChainManager';
import FinancialDashboard from './components/FinancialDashboard';
import CashSessionManager from './components/CashSessionManager';
import ShippingManifestManager from './components/ShippingManifestManager';
import SessionLockOverlay from './components/SessionLockOverlay';
import ReturnsManager from './components/ReturnsManager';
import CommandCenter from './components/CommandCenter';
import VendorPortal from './components/VendorPortal';
import SecurityAuditTrail from './components/SecurityAuditTrail';
import MarketingHub from './components/MarketingHub';
import AdminDashboardShell from './components/AdminDashboardShell';
import InventoryVelocityRadar from './components/InventoryVelocityRadar';
import SystemHealthMonitor from './components/SystemHealthMonitor';
import InventoryReports from './components/InventoryReports';
import AccountingReports from './components/AccountingReports';
import UserManager from './components/UserManager';
import SettingsManager from './components/SettingsManager';
import BranchManager from './components/BranchManager';
import ShopView from './components/ShopView';
import StoreLocator from './components/StoreLocator';
import ProductDetailsView from './components/ProductDetailsView';
import AthleteBiometricsHub from './components/AthleteBiometricsHub';
import LiveSupportAssistant from './components/LiveSupportAssistant';
import { RefreshCw, Search } from 'lucide-react';

const AppContent: React.FC = () => {
  const { 
    products, setProducts, 
    user, setUser, 
    addToCart, toggleWishlist, wishlistItems,
    inventoryNodes, movements, handleStockUpdate,
    isSyncing, currentView, setView, selectedProduct, setSelectedProduct
  } = useGlobal();
  
  const [quickViewProduct, setQuickViewProduct] = useState<any>(null);
  const [telemetryProduct, setTelemetryProduct] = useState<Product | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    let timer: any;
    const resetTimer = () => {
      if (user && user.role !== 'customer' && !user.isLocked) {
        clearTimeout(timer);
        timer = setTimeout(() => {
          setUser({ ...user, isLocked: true });
        }, 15 * 60 * 1000);
      }
    };
    window.addEventListener('mousemove', resetTimer);
    window.addEventListener('keypress', resetTimer);
    resetTimer();
    return () => {
      window.removeEventListener('mousemove', resetTimer);
      window.removeEventListener('keypress', resetTimer);
      clearTimeout(timer);
    };
  }, [user, setUser]);

  const navigateToProduct = (p: Product) => {
    setSelectedProduct(p);
    setView('product-details');
  };

  const isAdminView = currentView.startsWith('admin-') || currentView === 'product-telemetry';

  if (isAdminView && user && user.role !== 'customer') {
    return (
      <AdminDashboardShell currentView={currentView} setView={setView} user={user}>
        <SessionLockOverlay />
        
        {currentView === 'admin-command' && (
          <div className="space-y-12">
            <CommandCenter />
            <InventoryVelocityRadar />
          </div>
        )}
        {currentView === 'admin-system-health' && <SystemHealthMonitor />}
        {currentView === 'admin-inventory-reports' && <InventoryReports />}
        {currentView === 'admin-accounting-reports' && <AccountingReports />}
        {currentView === 'admin-iam' && <UserManager />}
        {currentView === 'admin-settings' && <SettingsManager />}
        {currentView === 'admin-branches' && <BranchManager />}
        {currentView === 'admin-vendors' && <VendorPortal />}
        {currentView === 'admin-products' && (
          <AdminProductManager 
            centralProducts={products} 
            onSave={p => setProducts(prev => prev.map(old => old.id === p.id ? p : old))} 
            onDelete={id => setProducts(prev => prev.filter(p => p.id !== id))} 
            onTelemetry={p => { setTelemetryProduct(p); setView('product-telemetry'); }}
          />
        )}
        {currentView === 'product-telemetry' && telemetryProduct && (
          <ProductTelemetryDeepDive 
            product={telemetryProduct} 
            onBack={() => setView('admin-products')} 
          />
        )}
        {currentView === 'admin-inventory' && <InventoryControlCenter centralProducts={products} nodes={inventoryNodes} movements={movements} onStockAction={handleStockUpdate} />}
        {currentView === 'admin-crm' && <CRMManager />}
        {currentView === 'admin-pos' && <POSInterface />}
        {currentView === 'admin-ledger' && <OrderLedger />}
        {currentView === 'admin-ops' && <OperationalDashboard />}
        {currentView === 'admin-audit' && <InventoryConciliation />}
        {currentView === 'admin-logs' && <SecurityAuditTrail />}
        {currentView === 'admin-supply' && <SupplyChainManager />}
        {currentView === 'admin-finance' && <FinancialDashboard />}
        {currentView === 'admin-cash' && <CashSessionManager />}
        {currentView === 'admin-shipping' && <ShippingManifestManager />}
        {currentView === 'admin-rma' && <ReturnsManager />}
        {currentView === 'admin-marketing' && <MarketingHub />}
        
        <QuickViewModal product={quickViewProduct} onClose={() => setQuickViewProduct(null)} onAddToCart={addToCart} />
        <GlobalSearch isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} products={products} onSelect={(p) => setQuickViewProduct(p)} />
      </AdminDashboardShell>
    );
  }

  return (
    <Layout
      currentView={currentView}
      setView={setView}
      isCartOpen={isCartOpen}
      setIsCartOpen={setIsCartOpen}
      isWishlistOpen={isWishlistOpen}
      setIsWishlistOpen={setIsWishlistOpen}
    >
      <SessionLockOverlay />

      {/* HUD Flotante - Z-300: Bajo el Header pero sobre el contenido */}
      <div className={`fixed transition-all duration-700 cubic-bezier(0.4, 0, 0.2, 1) left-6 md:left-10 z-[300] ${isScrolled ? 'top-28 md:top-32' : 'top-48 md:top-56'} ${isSyncing ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-10 pointer-events-none'}`}>
         <div className="glass px-6 py-4 rounded-2xl border-blue-500/30 flex items-center gap-4 bg-blue-500/5 shadow-2xl">
            <RefreshCw className="w-4 h-4 text-blue-500 animate-spin" />
            <span className="text-[9px] font-black text-blue-500 uppercase tracking-widest">Sincronizando Nodo Central...</span>
         </div>
      </div>

      <button 
        onClick={() => setIsSearchOpen(true)}
        className="fixed bottom-6 md:bottom-10 right-6 md:right-10 z-[300] w-14 h-14 bg-blue-600 text-white rounded-full shadow-[0_20px_40px_rgba(37,99,235,0.4)] flex items-center justify-center hover:scale-110 transition-transform active:scale-95 group focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <Search className="w-6 h-6 group-hover:rotate-12 transition-transform" />
      </button>

      <LiveSupportAssistant />

      {currentView === 'home' && (
        <>
          <PromotionalSlider onShopClick={() => setView('shop')} />
          <div className="py-24 md:py-32 px-6 md:px-10 max-w-[1440px] mx-auto space-y-16 md:space-y-24">
             <div className="space-y-4 text-center">
                <span className="text-blue-500 text-[10px] font-black uppercase tracking-[0.5em]">High-Performance Selection</span>
                <h2 className="font-space text-4xl md:text-6xl font-bold dark:text-white uppercase tracking-tighter">Modelos <span className="text-gradient">Elite</span></h2>
             </div>
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
                {products.slice(0, 3).map(p => (
                  <ProductCard 
                    key={p.id} 
                    product={p} 
                    onAddToCart={addToCart} 
                    onViewDetails={() => navigateToProduct(p)} 
                    onQuickView={() => setQuickViewProduct(p)} 
                    onToggleWishlist={toggleWishlist}
                    isWishlisted={wishlistItems.some(w => w.id === p.id)}
                  />
                ))}
             </div>
             <div className="flex justify-center">
                <button onClick={() => setView('shop')} className="px-10 md:px-12 py-5 md:py-6 glass border-white/10 text-[9px] md:text-[10px] font-black uppercase tracking-[0.4em] text-white hover:bg-blue-600 transition-all rounded-2xl">Explorar Catálogo Completo</button>
             </div>
          </div>
          <StoreLocator />
        </>
      )}
      
      {currentView === 'shop' && <ShopView />}

      {currentView === 'product-details' && selectedProduct && (
        <ProductDetailsView product={selectedProduct} onBack={() => setView('shop')} />
      )}

      {currentView === 'checkout' && <CheckoutView onBack={() => setView('shop')} />}
      
      {currentView === 'auth' && (
        <AuthView 
          onAuthSuccess={(u) => { 
            setUser(u); 
            setView(u.role === 'admin' ? 'admin-command' : 'dashboard'); 
          }} 
          onBack={() => setView('home')} 
        />
      )}
      
      {currentView === 'dashboard' && user && (
        <div className="space-y-12">
          <UserDashboard 
            user={user} 
            onLogout={() => { setUser(null); setView('home'); }} 
            onNavigate={setView} 
            wishlistItems={wishlistItems}
            onViewOrders={() => {}} 
            onViewWishlist={() => {}}
          />
          {user.role === 'admin' && <PerformanceAnalytics />}
        </div>
      )}

      {currentView === 'athlete-biometrics' && <AthleteBiometricsHub />}

      <QuickViewModal product={quickViewProduct} onClose={() => setQuickViewProduct(null)} onAddToCart={addToCart} />
      <GlobalSearch isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} products={products} onSelect={(p) => navigateToProduct(p)} />
    </Layout>
  );
};

const App: React.FC = () => (
  <GlobalProvider>
    <AppContent />
  </GlobalProvider>
);

export default App;
