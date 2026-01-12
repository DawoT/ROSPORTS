import React, { useState, useMemo } from 'react';
import {
  UserCog,
  UserPlus,
  Shield,
  Key,
  Edit3,
  Lock,
  Unlock,
  ShieldCheck,
  CheckCircle,
} from 'lucide-react';
import { useGlobal } from '../context/GlobalContext';
// Add AdminActionLog to types import to support explicit generic typing below
import { User, UserRole, Capability, AdminActionLog } from '../types';
import { EnterpriseDataTable, TechnicalBadge } from './Primitives';
import { AuthService } from '../services/authService';

type IAMTab = 'operators' | 'roles' | 'security-logs';

const UserManager: React.FC = () => {
  const { auditLogs, addAuditLog, addNotification } = useGlobal();
  const [activeTab, setActiveTab] = useState<IAMTab>('operators');
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  // Usuarios simulados para la gestión IAM
  const [systemUsers, setSystemUsers] = useState<User[]>([
    {
      id: 'USR-001',
      name: 'JUAN ADMIN',
      email: 'admin@rosports.com',
      role: 'admin',
      capabilities: AuthService.getCapabilitiesByRole('admin'),
      status: 'active',
      createdAt: '2025-01-01',
      lastLogin: '2025-05-12 09:12',
    },
    {
      id: 'USR-002',
      name: 'CARLOS VENTAS',
      email: 'carlos.v@rosports.com',
      role: 'sales',
      capabilities: AuthService.getCapabilitiesByRole('sales'),
      status: 'active',
      createdAt: '2025-03-15',
      lastLogin: '2025-05-12 11:45',
    },
    {
      id: 'USR-003',
      name: 'ANA SUPER',
      email: 'ana.s@rosports.com',
      role: 'supervisor',
      capabilities: AuthService.getCapabilitiesByRole('supervisor'),
      status: 'active',
      createdAt: '2025-02-10',
      lastLogin: '2025-05-11 18:30',
    },
    {
      id: 'USR-004',
      name: 'PEDRO BODEGA',
      email: 'pedro.b@rosports.com',
      role: 'logistics',
      capabilities: AuthService.getCapabilitiesByRole('logistics'),
      status: 'inactive',
      createdAt: '2025-04-05',
      lastLogin: '2025-05-05 08:20',
    },
  ]);

  const toggleUserStatus = (userId: string) => {
    setSystemUsers((prev) =>
      prev.map((u) => {
        if (u.id === userId) {
          const newStatus = u.status === 'active' ? 'inactive' : 'active';
          addAuditLog('IAM_CHANGE', 'user', userId, `Estado de usuario cambiado a: ${newStatus}`);
          addNotification(
            `Usuario ${u.name} ${newStatus === 'active' ? 'Activado' : 'Suspendido'}`,
            'info',
          );
          return { ...u, status: newStatus as any };
        }
        return u;
      }),
    );
  };

  const rolesMatrix = [
    { role: 'admin', label: 'Overlord Admin', color: 'text-red-500', permissions: 'TOTAL_ACCESS' },
    {
      role: 'supervisor',
      label: 'Operativo Senior',
      color: 'text-amber-500',
      permissions: 'READ_WRITE_LIMIT',
    },
    { role: 'sales', label: 'Agente POS', color: 'text-blue-500', permissions: 'TERMINAL_ONLY' },
    {
      role: 'logistics',
      label: 'Control Bodega',
      color: 'text-purple-500',
      permissions: 'INVENTORY_ONLY',
    },
  ];

  return (
    <div className='space-y-10 animate-in fade-in duration-700 pb-32'>
      <div className='flex flex-col xl:flex-row xl:items-end justify-between gap-8'>
        <div className='space-y-4'>
          <div className='flex items-center gap-3 text-blue-500'>
            <div className='w-12 h-12 glass rounded-2xl flex items-center justify-center border-blue-500/20 shadow-xl bg-surface'>
              <UserCog className='w-6 h-6' />
            </div>
            <div className='flex flex-col'>
              <span className='text-[9px] font-black uppercase tracking-[0.5em] text-content-muted'>
                Global Identity Governance
              </span>
              <h2 className='font-space text-4xl font-bold text-content-primary uppercase tracking-tighter'>
                Identity & <span className='text-gradient'>Access</span>
              </h2>
            </div>
          </div>
        </div>
        <button
          onClick={() => {
            setEditingUser(null);
            setIsEditorOpen(true);
          }}
          className='px-10 py-5 bg-blue-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.4em] shadow-xl hover:bg-blue-500 transition-all flex items-center gap-3 min-h-[56px]'
        >
          <UserPlus className='w-4 h-4' /> REGISTRAR OPERADOR
        </button>
      </div>

      <div className='flex glass p-2 rounded-[2.5rem] border-content-muted/10 gap-2 bg-surface/50 overflow-x-auto'>
        {[
          { id: 'operators', label: 'Operadores del Sistema', icon: Shield },
          { id: 'roles', label: 'Matriz de Permisos', icon: Key },
          { id: 'security-logs', label: 'Actividad Forense', icon: History },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex-1 min-w-[220px] flex items-center justify-center gap-3 py-5 rounded-[2rem] text-[9px] font-black uppercase tracking-widest transition-all ${activeTab === tab.id ? 'bg-blue-600 text-white shadow-xl' : 'text-content-muted hover:bg-content-muted/5'}`}
          >
            <tab.icon className='w-4 h-4' />
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'operators' && (
        /* Explicitly provide User generic to fix type inference errors and correctly resolve key paths */
        <EnterpriseDataTable<User>
          data={systemUsers}
          columns={[
            {
              key: 'name',
              label: 'Identidad Técnica',
              render: (u) => (
                <div className='flex items-center gap-4'>
                  <div className='w-12 h-12 glass rounded-full flex items-center justify-center border border-content-muted/10 bg-main text-blue-500 font-bold'>
                    {u.name[0]}
                  </div>
                  <div className='flex flex-col'>
                    <span className='text-xs font-bold text-content-primary uppercase'>
                      {u.name}
                    </span>
                    <span className='text-[9px] text-content-muted font-mono'>{u.email}</span>
                  </div>
                </div>
              ),
            },
            {
              key: 'role',
              label: 'Privilegios',
              render: (u) => (
                <span
                  className={`px-4 py-1.5 rounded-xl text-[8px] font-black uppercase border ${
                    u.role === 'admin'
                      ? 'border-red-500/30 text-red-500 bg-red-500/5'
                      : u.role === 'supervisor'
                        ? 'border-amber-500/30 text-amber-500 bg-amber-500/5'
                        : 'border-blue-500/30 text-blue-500 bg-blue-500/5'
                  }`}
                >
                  {u.role} NODE
                </span>
              ),
            },
            {
              key: 'lastLogin',
              label: 'Último Enlace',
              render: (u) => (
                <div className='flex flex-col'>
                  <span className='text-[10px] font-bold text-content-secondary'>
                    {u.lastLogin || 'NUNCA'}
                  </span>
                  <span className='text-[8px] text-content-muted uppercase'>IP: 192.168.1.XX</span>
                </div>
              ),
            },
            {
              key: 'status',
              label: 'Estado Nodo',
              render: (u) => (
                <TechnicalBadge variant={u.status === 'active' ? 'emerald' : 'red'}>
                  {u.status}
                </TechnicalBadge>
              ),
            },
            {
              key: 'actions',
              label: 'Acciones',
              render: (u) => (
                <div className='flex justify-end gap-3'>
                  <button
                    onClick={() => toggleUserStatus(u.id)}
                    className='p-2.5 glass rounded-xl border-content-muted/10 text-content-muted hover:text-blue-500 transition-all shadow-sm'
                  >
                    {u.status === 'active' ? (
                      <Lock className='w-4 h-4' />
                    ) : (
                      <Unlock className='w-4 h-4' />
                    )}
                  </button>
                  <button
                    onClick={() => {
                      setEditingUser(u);
                      setIsEditorOpen(true);
                    }}
                    className='p-2.5 glass rounded-xl border-content-muted/10 text-content-muted hover:text-amber-500 transition-all shadow-sm'
                  >
                    <Edit3 className='w-4 h-4' />
                  </button>
                </div>
              ),
            },
          ]}
        />
      )}

      {activeTab === 'roles' && (
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8'>
          {rolesMatrix.map((role) => (
            <div
              key={role.role}
              className='glass-card rounded-[3rem] p-10 border-content-muted/10 space-y-8 flex flex-col bg-surface hover:border-blue-500/30 transition-all group'
            >
              <div
                className={`w-16 h-16 glass rounded-2xl flex items-center justify-center ${role.color} bg-current/5 border-current/20 shadow-xl group-hover:scale-110 transition-transform`}
              >
                <Shield className='w-8 h-8' />
              </div>
              <div className='space-y-2'>
                <h4 className='text-2xl font-space font-bold text-content-primary uppercase leading-none'>
                  {role.label}
                </h4>
                <p className='text-[10px] font-black text-content-muted uppercase tracking-widest'>
                  {role.permissions}
                </p>
              </div>
              <div className='pt-6 border-t border-content-muted/10 space-y-4'>
                <div className='flex items-center gap-3 text-[9px] font-bold text-content-secondary uppercase'>
                  <CheckCircle className='w-3.5 h-3.5 text-emerald-500' /> Catalog Read
                </div>
                <div
                  className={`flex items-center gap-3 text-[9px] font-bold uppercase ${role.role === 'admin' || role.role === 'supervisor' ? 'text-content-secondary' : 'text-content-muted opacity-30 line-through'}`}
                >
                  <CheckCircle
                    className={`w-3.5 h-3.5 ${role.role === 'admin' || role.role === 'supervisor' ? 'text-emerald-500' : ''}`}
                  />{' '}
                  Finance Admin
                </div>
              </div>
              <button className='w-full py-4 glass border-content-muted/10 rounded-2xl text-[9px] font-black uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all mt-auto'>
                EDITAR CAPACIDADES
              </button>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'security-logs' && (
        <div className='space-y-8'>
          <div className='glass p-8 rounded-[2.5rem] border-content-muted/10 bg-surface flex flex-col md:flex-row items-center justify-between gap-8 shadow-sm'>
            <div className='flex items-center gap-6'>
              <div className='w-16 h-16 glass rounded-2xl flex items-center justify-center text-emerald-500'>
                <ShieldCheck className='w-8 h-8' />
              </div>
              <div className='space-y-1'>
                <h3 className='text-2xl font-space font-bold text-content-primary uppercase'>
                  Cadena de Integridad
                </h3>
                <p className='text-[10px] font-black text-emerald-500 uppercase tracking-widest'>
                  Protocolo SHA-256 Verificado // Todos los nodos nominales
                </p>
              </div>
            </div>
            <div className='flex gap-4'>
              <button className='px-8 py-4 glass border-content-muted/10 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all shadow-sm'>
                Audit Download
              </button>
            </div>
          </div>
          /* Explicitly provide AdminActionLog generic to fix type inference errors and allow key
          matching */
          <EnterpriseDataTable<AdminActionLog>
            data={auditLogs.filter(
              (l) =>
                l.action.includes('IAM') ||
                l.action.includes('auth') ||
                l.action.includes('system'),
            )}
            columns={[
              {
                key: 'timestamp',
                label: 'Timestamp',
                render: (l) => (
                  <span className='text-[10px] font-mono text-content-muted'>
                    {new Date(l.timestamp).toLocaleString()}
                  </span>
                ),
              },
              {
                key: 'userName',
                label: 'Sujeto Auditado',
                render: (l) => (
                  <span className='text-xs font-bold uppercase text-blue-500'>{l.userName}</span>
                ),
              },
              {
                key: 'details',
                label: 'Evento de Seguridad',
                render: (l) => (
                  <p className='text-xs font-medium text-content-primary italic'>"{l.details}"</p>
                ),
              },
              {
                key: 'integrityHash',
                label: 'Signature',
                render: (l) => (
                  <span className='text-[8px] font-mono text-content-muted opacity-60 truncate max-w-[120px]'>
                    {l.integrityHash}
                  </span>
                ),
              },
            ]}
          />
        </div>
      )}

      {isEditorOpen && (
        <UserEditor
          user={editingUser}
          onClose={() => setIsEditorOpen(false)}
          onSave={(u) => {
            setSystemUsers((prev) => {
              const exists = prev.find((old) => old.id === u.id);
              if (exists) return prev.map((old) => (old.id === u.id ? u : old));
              return [u, ...prev];
            });
            addAuditLog(
              'IAM_CREATE',
              'user',
              u.id,
              `Nuevo operador creado: ${u.name} [Rol: ${u.role}]`,
            );
            addNotification('Operador sincronizado en el nodo', 'success');
            setIsEditorOpen(false);
          }}
        />
      )}
    </div>
  );
};

const UserEditor: React.FC<{
  user: User | null;
  onClose: () => void;
  onSave: (u: User) => void;
}> = ({ user, onClose, onSave }) => {
  const [form, setForm] = useState<Partial<User>>(
    user || {
      name: '',
      email: '',
      role: 'sales',
      status: 'active',
      maxDiscountLimit: 10,
    },
  );

  return (
    <div className='fixed inset-0 z-[300] flex items-center justify-center p-6'>
      <div
        className='absolute inset-0 bg-main/95 backdrop-blur-xl animate-in fade-in'
        onClick={onClose}
      />
      <div className='relative w-full max-w-2xl glass-card rounded-[3.5rem] border-content-muted/10 p-12 space-y-10 animate-in slide-in-from-bottom-12 duration-700 bg-surface shadow-2xl'>
        <div className='flex items-center gap-4'>
          <div className='w-16 h-16 glass rounded-2xl flex items-center justify-center text-blue-500 border border-blue-500/20'>
            <UserCog className='w-8 h-8' />
          </div>
          <h3 className='text-3xl font-space font-bold text-content-primary uppercase tracking-tighter'>
            {user ? 'Actualizar Ficha' : 'Nueva Identidad'}
          </h3>
        </div>

        <div className='space-y-6'>
          <div className='space-y-2'>
            <label className='text-[9px] font-black text-content-muted uppercase px-2 tracking-widest'>
              Nombre Completo Operador
            </label>
            <input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value.toUpperCase() })}
              className='w-full p-5 glass border-content-muted/10 rounded-2xl text-content-primary bg-main/50 text-xs font-bold outline-none focus:border-blue-500 shadow-sm'
              placeholder='EJ: MARCO AURELIO'
            />
          </div>
          <div className='space-y-2'>
            <label className='text-[9px] font-black text-content-muted uppercase px-2 tracking-widest'>
              Correo Corporativo (Username)
            </label>
            <input
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className='w-full p-5 glass border-content-muted/10 rounded-2xl text-content-primary bg-main/50 text-xs font-bold outline-none focus:border-blue-500 shadow-sm'
              placeholder='operador@rosports.com'
            />
          </div>
          <div className='grid grid-cols-2 gap-6'>
            <div className='space-y-2'>
              <label className='text-[9px] font-black text-content-muted uppercase px-2 tracking-widest'>
                Rol Asignado
              </label>
              <select
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value as any })}
                className='w-full p-5 glass border-content-muted/10 rounded-2xl text-content-primary bg-main/50 text-xs font-bold outline-none focus:border-blue-500 appearance-none'
              >
                <option value='admin'>ADMINISTRADOR</option>
                <option value='supervisor'>SUPERVISOR</option>
                <option value='sales'>VENDEDOR POS</option>
                <option value='logistics'>LOGÍSTICA</option>
              </select>
            </div>
            <div className='space-y-2'>
              <label className='text-[9px] font-black text-content-muted uppercase px-2 tracking-widest'>
                Límite de Descuento (%)
              </label>
              <input
                type='number'
                value={form.maxDiscountLimit}
                onChange={(e) => setForm({ ...form, maxDiscountLimit: Number(e.target.value) })}
                className='w-full p-5 glass border-content-muted/10 rounded-2xl text-content-primary bg-main/50 text-xs font-bold outline-none focus:border-blue-500 shadow-sm'
              />
            </div>
          </div>
        </div>

        <div className='flex gap-4'>
          <button
            onClick={onClose}
            className='flex-1 py-5 glass text-content-muted rounded-2xl text-[10px] font-black uppercase tracking-widest hover:text-content-primary hover:bg-main transition-all shadow-sm'
          >
            CANCELAR
          </button>
          <button
            onClick={() =>
              onSave({
                ...form,
                id: form.id || `USR-${Date.now()}`,
                capabilities: AuthService.getCapabilitiesByRole(form.role as any),
              } as User)
            }
            className='flex-2 px-12 py-5 bg-blue-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.4em] shadow-xl hover:bg-blue-500 transition-all min-h-[56px]'
          >
            SINCRONIZAR IDENTIDAD
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserManager;
