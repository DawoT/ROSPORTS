import React, { useState, useEffect } from 'react';
import {
  User as UserIcon,
  Settings,
  Package,
  Heart,
  CreditCard,
  ShieldCheck,
  Zap,
  Activity,
  Award,
  ChevronRight,
  Clock,
  LogOut,
  Globe,
  Cpu,
  MapPin,
  CheckCircle,
  Truck,
  Search,
  Filter,
  ChevronLeft,
  Navigation,
  Box,
  Gift,
  Coins,
  History,
  Plus,
  Trash2,
  Edit3,
  X,
} from 'lucide-react';
import { User, Product, PointMovement, OrderHistoryItem, Address } from '../types';
import { useGlobal } from '../context/GlobalContext';

interface UserDashboardProps {
  user: User;
  onLogout: () => void;
  onViewOrders: () => void;
  onViewWishlist: () => void;
  onNavigate: (view: any) => void;
  wishlistItems?: Product[];
}

type DashboardTab = 'perfil' | 'pedidos' | 'direcciones' | 'puntos' | 'favoritos';

const UserDashboard: React.FC<UserDashboardProps> = ({
  user,
  onLogout,
  onNavigate,
  wishlistItems = [],
}) => {
  const { customers, setCustomers, addNotification } = useGlobal();
  const [activeTab, setActiveTab] = useState<DashboardTab>('perfil');
  const [selectedOrder, setSelectedOrder] = useState<OrderHistoryItem | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const currentCustomer = customers.find((c) => c.id === user.id) || {
    points: 1250,
    creditBalance: 0,
    purchaseHistory: [
      {
        orderId: 'RS-9921-X',
        date: '2025-05-12T14:30:00Z',
        total: 489.9,
        subtotal: 415.17,
        tax: 74.73,
        discount: 0,
        status: 'delivered',
        items: [{ name: 'Velocity X-1 Pro', qty: 1, price: 489.9, sku: 'SKU-001' }],
        billing: {
          type: 'BOLETA',
          docType: 'DNI',
          docNumber: '00000000',
          nameOrSocialReason: user.name,
        },
      },
      {
        orderId: 'RS-8840-Z',
        date: '2025-04-05T10:15:00Z',
        total: 329.0,
        subtotal: 278.81,
        tax: 50.19,
        discount: 50,
        status: 'delivered',
        items: [{ name: 'Urban Elite Mix', qty: 1, price: 329.0, sku: 'SKU-002' }],
        billing: {
          type: 'BOLETA',
          docType: 'DNI',
          docNumber: '00000000',
          nameOrSocialReason: user.name,
        },
      },
    ],
  };

  const savedAddresses: Address[] = user.addresses || [
    {
      id: '1',
      label: 'Mi Casa',
      fullName: user.name,
      street: 'Av. Javier Prado 1234, Dpto 402',
      district: 'San Isidro',
      city: 'Lima',
      phone: '999888777',
      isDefault: true,
    },
    {
      id: '2',
      label: 'Oficina',
      fullName: user.name,
      street: 'Calle Las Orquídeas 456, Piso 10',
      district: 'San Isidro',
      city: 'Lima',
      phone: '999111222',
      isDefault: false,
    },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'perfil':
        return (
          <div className='space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500'>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              <div className='glass-card rounded-[2.5rem] p-10 border border-content-muted/10 bg-surface space-y-6'>
                <h3 className='text-xl font-space font-bold uppercase text-content-primary'>
                  Datos Personales
                </h3>
                <div className='space-y-4'>
                  <div className='space-y-1'>
                    <p className='text-[9px] font-black text-content-muted uppercase tracking-widest'>
                      Nombre Completo
                    </p>
                    <p className='text-sm font-bold text-content-primary uppercase'>{user.name}</p>
                  </div>
                  <div className='space-y-1'>
                    <p className='text-[9px] font-black text-content-muted uppercase tracking-widest'>
                      Correo Electrónico
                    </p>
                    <p className='text-sm font-bold text-content-primary'>{user.email}</p>
                  </div>
                </div>
                <button className='text-[10px] font-black text-brand-blue uppercase border-b border-blue-500/20 pb-0.5'>
                  Editar Perfil
                </button>
              </div>
              <div className='glass-card rounded-[2.5rem] p-10 border border-content-muted/10 bg-surface space-y-6'>
                <h3 className='text-xl font-space font-bold uppercase text-content-primary'>
                  Seguridad
                </h3>
                <div className='space-y-4'>
                  <p className='text-xs text-content-secondary leading-relaxed'>
                    Tu cuenta está protegida con autenticación de dos pasos y cifrado de extremo a
                    extremo.
                  </p>
                  <button className='px-6 py-3 glass border-content-muted/10 rounded-xl text-[10px] font-black text-content-primary uppercase hover:bg-white/5 transition-all'>
                    Cambiar Contraseña
                  </button>
                </div>
              </div>
            </div>
          </div>
        );

      case 'pedidos':
        return (
          <div className='space-y-8 animate-in fade-in slide-in-from-right-4 duration-500'>
            <h2 className='text-4xl font-space font-bold text-content-primary uppercase tracking-tighter'>
              Mis <span className='text-gradient'>Pedidos</span>
            </h2>
            <div className='space-y-4'>
              {(currentCustomer.purchaseHistory || []).map((order: any) => (
                <div
                  key={order.orderId}
                  className='glass-card rounded-3xl p-8 border border-content-muted/10 bg-surface flex flex-col md:flex-row justify-between items-center gap-6 group hover:border-brand-blue/30 transition-all'
                >
                  <div className='flex items-center gap-6 flex-1'>
                    <div className='w-14 h-14 glass rounded-2xl flex items-center justify-center text-brand-blue bg-brand-blue/5 border-brand-blue/20'>
                      <Package className='w-6 h-6' />
                    </div>
                    <div className='space-y-1'>
                      <p className='text-[10px] font-mono font-bold text-blue-500'>
                        {order.orderId}
                      </p>
                      <p className='text-xs font-bold text-content-primary uppercase'>
                        {new Date(order.date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className='text-center md:text-right'>
                    <p className='text-[9px] font-black text-content-muted uppercase tracking-widest mb-1'>
                      Total Pagado
                    </p>
                    <p className='text-xl font-space font-bold text-content-primary'>
                      S/ {order.total.toFixed(2)}
                    </p>
                  </div>
                  <div className='flex items-center gap-4'>
                    <span
                      className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase border ${
                        order.status === 'delivered'
                          ? 'border-emerald-500/30 text-emerald-500 bg-emerald-500/5'
                          : 'border-amber-500/30 text-amber-500 bg-amber-500/5'
                      }`}
                    >
                      {order.status === 'delivered' ? 'Entregado' : 'En camino'}
                    </span>
                    <button className='p-3 glass rounded-xl border-content-muted/10 text-content-muted hover:text-brand-blue transition-all'>
                      <ChevronRight className='w-5 h-5' />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'direcciones':
        return (
          <div className='space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500'>
            <div className='flex justify-between items-end'>
              <h2 className='text-4xl font-space font-bold text-content-primary uppercase tracking-tighter'>
                Libreta de <span className='text-gradient'>Direcciones</span>
              </h2>
              <button className='px-8 py-4 bg-brand-blue text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg flex items-center gap-3'>
                <Plus className='w-4 h-4' /> AGREGAR NUEVA
              </button>
            </div>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              {savedAddresses.map((addr) => (
                <div
                  key={addr.id}
                  className='glass-card rounded-[2.5rem] p-10 border border-content-muted/10 bg-surface space-y-6 relative overflow-hidden group'
                >
                  {addr.isDefault && (
                    <div className='absolute top-0 right-0 px-6 py-2 bg-brand-blue text-white text-[8px] font-black uppercase tracking-widest rounded-bl-2xl'>
                      Principal
                    </div>
                  )}
                  <div className='flex items-center gap-4 text-brand-blue'>
                    <MapPin className='w-5 h-5' />
                    <h4 className='text-xl font-space font-bold uppercase'>{addr.label}</h4>
                  </div>
                  <div className='space-y-4'>
                    <p className='text-xs font-bold text-content-primary uppercase leading-relaxed'>
                      {addr.street}
                    </p>
                    <p className='text-[10px] font-bold text-content-muted uppercase tracking-widest'>
                      {addr.district}, {addr.city}
                    </p>
                    <p className='text-[10px] font-bold text-content-muted uppercase'>
                      Telf: {addr.phone}
                    </p>
                  </div>
                  <div className='pt-6 border-t border-content-muted/10 flex gap-4'>
                    <button className='text-[9px] font-black text-brand-blue uppercase flex items-center gap-2 hover:opacity-70 transition-opacity'>
                      <Edit3 className='w-3 h-3' /> Editar
                    </button>
                    <button className='text-[9px] font-black text-red-500 uppercase flex items-center gap-2 hover:opacity-70 transition-opacity'>
                      <Trash2 className='w-3 h-3' /> Eliminar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'puntos':
        return (
          <div className='space-y-12 animate-in fade-in slide-in-from-right-4 duration-500'>
            <div className='glass-card rounded-[3.5rem] p-12 border-brand-blue/20 bg-brand-blue/[0.02] flex flex-col md:flex-row items-center justify-between gap-10 bg-surface shadow-2xl overflow-hidden relative'>
              <div className='absolute inset-0 technical-grid opacity-10' />
              <div className='space-y-6 relative z-10'>
                <h2 className='text-4xl lg:text-6xl font-space font-bold text-content-primary uppercase tracking-tighter leading-none'>
                  Athlete <span className='text-brand-blue'>Rosports</span>
                </h2>
                <p className='text-sm text-content-secondary font-medium uppercase tracking-widest max-w-md'>
                  Tu nivel de fidelidad te otorga beneficios exclusivos en lanzamientos y eventos
                  VIP.
                </p>
                <div className='flex gap-4'>
                  <div className='px-6 py-3 glass rounded-2xl text-[10px] font-black text-amber-500 uppercase tracking-widest border-amber-500/20'>
                    Nivel: Elite Gold
                  </div>
                  <div className='px-6 py-3 glass rounded-2xl text-[10px] font-black text-brand-blue uppercase tracking-widest border-brand-blue/20'>
                    Dcto VIP: -10% Extra
                  </div>
                </div>
              </div>
              <div className='text-center md:text-right relative z-10'>
                <p className='text-[10px] font-black text-content-muted uppercase tracking-[0.5em] mb-2'>
                  Puntos Disponibles
                </p>
                <p className='text-7xl lg:text-8xl font-space font-bold text-brand-blue tracking-tighter leading-none'>
                  {currentCustomer.points}
                </p>
                <p className='text-xs font-bold text-content-secondary mt-2'>
                  Equivalente a S/ {(currentCustomer.points * 0.1).toFixed(2)} de saldo
                </p>
              </div>
            </div>

            <div className='space-y-8'>
              <div className='flex items-center gap-3 text-blue-500 px-4'>
                <History className='w-5 h-5' />
                <h3 className='text-[11px] font-black uppercase tracking-[0.6em]'>
                  Historial de Beneficios
                </h3>
              </div>
              <div className='glass-card rounded-[2.5rem] border border-content-muted/10 overflow-hidden bg-surface shadow-sm'>
                <table className='w-full text-left'>
                  <thead>
                    <tr className='bg-content-muted/[0.03] border-b border-content-muted/10'>
                      <th className='px-8 py-5 text-[9px] font-black text-content-muted uppercase'>
                        Fecha
                      </th>
                      <th className='px-8 py-5 text-[9px] font-black text-content-muted uppercase'>
                        Detalle
                      </th>
                      <th className='px-8 py-5 text-[9px] font-black text-content-muted uppercase text-right'>
                        Puntos
                      </th>
                    </tr>
                  </thead>
                  <tbody className='divide-y divide-content-muted/10 text-[11px]'>
                    <tr className='hover:bg-content-muted/[0.01]'>
                      <td className='px-8 py-5 font-bold text-content-secondary'>12 MAY 2025</td>
                      <td className='px-8 py-5 font-bold text-content-primary uppercase'>
                        Compra Pedido RS-9921-X
                      </td>
                      <td className='px-8 py-5 text-right font-black text-emerald-500'>+489</td>
                    </tr>
                    <tr className='hover:bg-content-muted/[0.01]'>
                      <td className='px-8 py-5 font-bold text-content-secondary'>05 ABR 2025</td>
                      <td className='px-8 py-5 font-bold text-content-primary uppercase'>
                        Compra Pedido RS-8840-Z
                      </td>
                      <td className='px-8 py-5 text-right font-black text-emerald-500'>+329</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );

      case 'favoritos':
        return (
          <div className='space-y-8 animate-in fade-in slide-in-from-left-4 duration-500'>
            <h2 className='text-4xl font-space font-bold text-content-primary uppercase tracking-tighter'>
              Mi Lista de <span className='text-gradient'>Deseos</span>
            </h2>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
              {wishlistItems.length > 0 ? (
                wishlistItems.map((p) => (
                  <div
                    key={p.id}
                    className='glass-card rounded-3xl overflow-hidden border border-content-muted/10 bg-surface flex flex-col'
                  >
                    <div className='h-48 p-6 flex items-center justify-center bg-main/50 relative overflow-hidden'>
                      <img src={p.image} className='h-full object-contain drop-shadow-xl' alt='' />
                    </div>
                    <div className='p-8 space-y-4 flex-1 flex flex-col'>
                      <h4 className='text-lg font-space font-bold text-content-primary uppercase tracking-tighter leading-tight'>
                        {p.name}
                      </h4>
                      <p className='text-xl font-space font-bold text-brand-blue'>
                        S/ {p.price.toFixed(2)}
                      </p>
                      <div className='pt-4 mt-auto flex gap-3'>
                        <button
                          onClick={() => {
                            setSelectedOrder(null);
                            onNavigate('product-details');
                          }}
                          className='flex-1 py-4 bg-slate-950 dark:bg-white text-white dark:text-black rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-brand-blue hover:text-white transition-all'
                        >
                          Añadir
                        </button>
                        <button className='p-4 glass rounded-xl text-red-500 border-red-500/20'>
                          <Trash2 className='w-4 h-4' />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className='col-span-full py-32 flex flex-col items-center justify-center text-center space-y-6 opacity-40'>
                  <Heart className='w-16 h-16' />
                  <p className='text-[10px] font-black uppercase tracking-widest'>
                    Aún no has guardado productos favoritos.
                  </p>
                </div>
              )}
            </div>
          </div>
        );
    }
  };

  return (
    <div className='pb-32 px-6 sm:px-10 lg:px-16 max-w-[1440px] mx-auto min-h-screen'>
      <div className='flex flex-col lg:flex-row gap-12'>
        <aside className='lg:w-80 space-y-8'>
          <div
            className={`glass-card rounded-[3rem] p-8 border border-content-muted/10 space-y-8 relative overflow-hidden sticky transition-all duration-700 bg-surface shadow-xl ${isScrolled ? 'top-28 md:top-32' : 'top-48 md:top-56'}`}
          >
            <div className='flex flex-col items-center text-center space-y-4 relative z-10'>
              <div className='relative'>
                <div className='w-24 h-24 rounded-full border-2 border-brand-blue p-1'>
                  <div className='w-full h-full rounded-full bg-main flex items-center justify-center overflow-hidden border border-content-muted/10'>
                    {user.avatar ? (
                      <img src={user.avatar} className='w-full h-full object-cover' />
                    ) : (
                      <UserIcon className='w-12 h-12 text-brand-blue' />
                    )}
                  </div>
                </div>
                <div className='absolute -bottom-1 -right-1 w-8 h-8 glass rounded-full flex items-center justify-center border-brand-blue/50 bg-main shadow-lg'>
                  <CheckCircle className='w-4 h-4 text-emerald-500' />
                </div>
              </div>
              <div className='space-y-1'>
                <h3 className='font-space text-2xl font-bold text-content-primary uppercase tracking-tighter leading-none'>
                  {user.name}
                </h3>
                <p className='text-[9px] font-black text-brand-blue uppercase tracking-[0.4em]'>
                  Miembro Elite Rosports
                </p>
              </div>
            </div>

            <nav className='flex flex-col gap-2'>
              {[
                { id: 'perfil', label: 'Mi Perfil', icon: UserIcon },
                { id: 'pedidos', label: 'Mis Pedidos', icon: Package },
                { id: 'direcciones', label: 'Direcciones', icon: MapPin },
                { id: 'puntos', label: 'Puntos Rosports', icon: Gift },
                { id: 'favoritos', label: 'Favoritos', icon: Heart },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id as DashboardTab);
                  }}
                  className={`flex items-center justify-between p-4 rounded-2xl transition-all group min-h-[52px] ${activeTab === item.id ? 'bg-brand-blue text-white shadow-xl' : 'glass border-transparent text-content-secondary hover:bg-brand-blue/5 hover:text-brand-blue'}`}
                >
                  <div className='flex items-center gap-4 text-[10px] font-black uppercase tracking-widest'>
                    <item.icon
                      className={`w-4 h-4 ${activeTab === item.id ? 'text-white' : 'text-content-muted group-hover:text-brand-blue'}`}
                    />
                    {item.label}
                  </div>
                  <ChevronRight
                    className={`w-4 h-4 transition-transform group-hover:translate-x-1 ${activeTab === item.id ? 'opacity-100' : 'opacity-0'}`}
                  />
                </button>
              ))}
              <button
                onClick={onLogout}
                className='flex items-center gap-4 p-4 rounded-2xl text-red-500 hover:bg-red-500/10 transition-all text-[10px] font-black uppercase tracking-widest mt-6 min-h-[52px]'
              >
                <LogOut className='w-4 h-4' /> CERRAR SESIÓN
              </button>
            </nav>
          </div>
        </aside>

        <div className='flex-1 min-w-0'>{renderContent()}</div>
      </div>
    </div>
  );
};

export default UserDashboard;
