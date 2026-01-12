import React, { useState, useEffect } from 'react';
import {
  Cpu,
  Zap,
  Shield,
  CreditCard,
  Landmark,
  FileSpreadsheet,
  Package,
  History,
  Lock,
  ChevronRight,
  LayoutDashboard,
  Settings,
  LogOut,
  Bell,
  Search,
  Globe,
  Menu,
  X,
  Activity,
  Terminal,
  MessageSquare,
  BarChart3,
  Calculator,
  UserCog,
  MapPin,
} from 'lucide-react';
import { ViewState, User, Capability, LiveEvent } from '../types';
import { useGlobal } from '../context/GlobalContext';
import { AuthService } from '../services/authService';
import { EventBus } from '../services/eventBusService';

const AdminDashboardShell: React.FC<any> = ({ children, currentView, setView, user }) => {
  const { setUser } = useGlobal();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [liveEvents, setLiveEvents] = useState<LiveEvent[]>([]);
  const [isFeedOpen, setIsFeedOpen] = useState(false);

  useEffect(() => {
    const unsub = EventBus.subscribe('BACKEND_PUSH', (ev) => {
      setLiveEvents((prev) => [ev.payload, ...prev].slice(0, 20));
    });

    const timer = setInterval(() => {
      if (Math.random() > 0.8) {
        const ev: LiveEvent = {
          id: `EV-${Date.now()}`,
          type: 'SECURITY',
          severity: 'info',
          message: `Acceso autorizado en Local San Isidro`,
          timestamp: new Date().toISOString(),
          node: 'N-01',
        };
        EventBus.publish('BACKEND_PUSH', ev, 'SimulatedWebSocket');
      }
    }, 12000);

    return () => {
      unsub();
      clearInterval(timer);
    };
  }, []);

  const menuItems: { id: ViewState; label: string; icon: any; cap: Capability }[] = [
    { id: 'admin-command', label: 'Panel Maestro', icon: Cpu, cap: 'system:manage' },
    { id: 'admin-system-health', label: 'Estado de la Tienda', icon: Activity, cap: 'ops:monitor' },
    { id: 'admin-branches', label: 'Nuestras Sedes', icon: MapPin, cap: 'system:config' },
    { id: 'admin-settings', label: 'Ajustes de Sistema', icon: Settings, cap: 'system:config' },
    { id: 'admin-iam', label: 'Gestión de Personal', icon: UserCog, cap: 'iam:manage' },
    {
      id: 'admin-accounting-reports',
      label: 'Libros Contables',
      icon: Calculator,
      cap: 'reports:accounting',
    },
    {
      id: 'admin-inventory-reports',
      label: 'Reportes de Stock',
      icon: BarChart3,
      cap: 'reports:inventory',
    },
    { id: 'admin-marketing', label: 'Centro de Promociones', icon: Zap, cap: 'crm:write' },
    { id: 'admin-pos', label: 'Caja de Ventas', icon: CreditCard, cap: 'pos:execute' },
    { id: 'admin-cash', label: 'Arqueo de Caja', icon: Landmark, cap: 'pos:execute' },
    { id: 'admin-ledger', label: 'Registro de Ventas', icon: FileSpreadsheet, cap: 'finance:read' },
    {
      id: 'admin-products',
      label: 'Catálogo de Modelos',
      icon: LayoutDashboard,
      cap: 'catalog:write',
    },
    { id: 'admin-inventory', label: 'Control de Almacén', icon: Package, cap: 'inventory:read' },
    { id: 'admin-logs', label: 'Registro de Actividad', icon: History, cap: 'audit:read' },
    { id: 'admin-ops', label: 'Centro de Control', icon: Shield, cap: 'system:manage' },
  ];

  return (
    <div className='flex min-h-screen bg-main text-content-primary transition-colors duration-500'>
      {isSidebarOpen && (
        <div
          className='fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] xl:hidden'
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <aside
        className={`fixed xl:sticky top-0 left-0 h-screen z-[70] w-72 md:w-80 border-r border-content-muted/10 bg-surface/95 backdrop-blur-[40px] flex flex-col transition-transform duration-500 shadow-2xl ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full xl:translate-x-0'}`}
      >
        <div className='p-6 md:p-8 border-b border-content-muted/10 flex items-center justify-between bg-content-muted/[0.02]'>
          <div className='flex items-center gap-4'>
            <div className='w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20'>
              <Globe className='w-5 h-5 text-white' />
            </div>
            <div>
              <h2 className='font-space font-bold text-xl tracking-tighter text-content-primary'>
                RO<span className='text-blue-500'>SPORTS</span>
              </h2>
              <p className='text-[8px] font-black text-content-muted uppercase tracking-[0.3em]'>
                Gestión de Boutique V3
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsSidebarOpen(false)}
            className='p-2 glass rounded-xl border-content-muted/10 text-content-muted xl:hidden'
          >
            <X />
          </button>
        </div>

        <nav className='flex-1 overflow-y-auto p-4 md:p-6 space-y-1 custom-scrollbar'>
          {menuItems.map((item) => {
            if (!AuthService.hasCapability(user.capabilities, item.cap)) return null;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setView(item.id);
                  setIsSidebarOpen(false);
                }}
                className={`w-full flex items-center justify-between p-3 md:p-4 rounded-2xl transition-all group min-h-[48px] ${currentView === item.id ? 'bg-blue-600 text-white shadow-xl' : 'text-content-secondary hover:bg-blue-600/5 hover:text-blue-500'}`}
              >
                <div className='flex items-center gap-4'>
                  <item.icon
                    className={`w-4 h-4 ${currentView === item.id ? 'text-white' : 'text-content-muted group-hover:text-blue-500'}`}
                  />
                  <span className='text-[9px] md:text-[10px] font-black uppercase tracking-widest'>
                    {item.label}
                  </span>
                </div>
              </button>
            );
          })}
        </nav>

        <div className='p-4 border-t border-content-muted/10'>
          <button
            onClick={() => setIsFeedOpen(!isFeedOpen)}
            className={`w-full p-4 rounded-2xl flex items-center justify-between transition-all ${liveEvents.length > 0 ? 'bg-blue-600/10 border border-blue-500/20' : 'glass'}`}
          >
            <div className='flex items-center gap-3'>
              <Terminal className='w-4 h-4 text-blue-500' />
              <span className='text-[8px] font-black uppercase tracking-widest text-content-primary'>
                Eventos en Vivo
              </span>
            </div>
            <div className='flex items-center gap-2'>
              {liveEvents.length > 0 && (
                <span className='w-1.5 h-1.5 bg-blue-500 rounded-full animate-ping' />
              )}
              <ChevronRight
                className={`w-4 h-4 transition-transform ${isFeedOpen ? 'rotate-90' : ''}`}
              />
            </div>
          </button>
        </div>
      </aside>

      <main className='flex-1 relative flex flex-col min-w-0'>
        <header className='h-20 md:h-24 border-b border-content-muted/10 bg-surface/80 backdrop-blur-[20px] sticky top-0 z-40 flex items-center justify-between px-4 md:px-12'>
          <button onClick={() => setIsSidebarOpen(true)} className='xl:hidden p-3 glass rounded-xl'>
            <Menu />
          </button>
          <div className='flex items-center gap-6'>
            <div className='hidden sm:flex items-center gap-3 px-4 py-2 glass rounded-full border-blue-500/20'>
              <Zap className='w-3 h-3 text-blue-500 fill-current' />
              <span className='text-[8px] font-black text-content-primary uppercase'>
                Plataforma: Estable
              </span>
            </div>
          </div>
        </header>

        <div className='flex-1 p-4 md:p-12 overflow-x-hidden relative'>
          {children}

          {isFeedOpen && (
            <div className='fixed bottom-10 right-10 w-96 max-h-[500px] glass-card rounded-[2.5rem] border-content-muted/10 shadow-2xl flex flex-col z-[80] animate-in slide-in-from-bottom-4'>
              <div className='p-6 border-b border-content-muted/10 flex justify-between items-center bg-content-muted/[0.02]'>
                <h4 className='text-[10px] font-black uppercase tracking-[0.3em] text-blue-500 flex items-center gap-2'>
                  <MessageSquare className='w-4 h-4' /> Monitor de Actividad
                </h4>
                <button
                  onClick={() => setIsFeedOpen(false)}
                  className='text-content-muted hover:text-white'
                >
                  <X className='w-4 h-4' />
                </button>
              </div>
              <div className='flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar'>
                {liveEvents.map((ev) => (
                  <div
                    key={ev.id}
                    className='p-4 glass rounded-2xl border-content-muted/10 animate-in fade-in slide-in-from-right-2'
                  >
                    <div className='flex justify-between items-center mb-1'>
                      <span className='text-[7px] font-black text-blue-500 uppercase'>
                        {ev.type === 'SECURITY' ? 'SEGURIDAD' : ev.type}
                      </span>
                      <span className='text-[7px] font-mono text-content-muted'>
                        {new Date(ev.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                    <p className='text-[10px] font-bold text-content-primary leading-tight'>
                      {ev.message}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboardShell;
