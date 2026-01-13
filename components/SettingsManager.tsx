import React, { useState } from 'react';
import {
  Settings,
  Building,
  FileText,
  Globe,
  Bell,
  Save,
  CreditCard,
  Truck,
  Link2,
  Cloud,
  Users,
} from 'lucide-react';
import { useGlobal } from '../context/GlobalContext';
import { SystemConfig } from '../types';
import { EnterpriseInput, EnterpriseButton } from './Primitives';

type SettingsTab = 'general' | 'fiscal' | 'integrations' | 'store' | 'notifications';

const SettingsManager: React.FC = () => {
  const { systemConfig, setSystemConfig, addNotification, addAuditLog } = useGlobal();
  const [activeTab, setActiveTab] = useState<SettingsTab>('general');
  const [localConfig, setLocalConfig] = useState<SystemConfig>(
    JSON.parse(JSON.stringify(systemConfig)),
  );
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    await new Promise((r) => setTimeout(r, 1500));
    setSystemConfig(localConfig);
    addAuditLog(
      'CONFIG_CHANGE',
      'system',
      'global_settings',
      `Integraciones actualizadas en: ${activeTab}`,
    );
    addNotification('Sincronización global de ajustes exitosa', 'success');
    setIsSaving(false);
  };

  return (
    <div className='space-y-10 animate-in fade-in duration-700 pb-32'>
      <div className='flex flex-col xl:flex-row xl:items-end justify-between gap-8'>
        <div className='space-y-4'>
          <div className='flex items-center gap-3 text-blue-500'>
            <div className='w-12 h-12 glass rounded-2xl flex items-center justify-center border-blue-500/20 shadow-xl bg-surface'>
              <Settings className='w-6 h-6 animate-spin-slow' />
            </div>
            <div className='flex flex-col'>
              <span className='text-[9px] font-black uppercase tracking-[0.5em] text-content-muted'>
                Enterprise System Parameters
              </span>
              <h2 className='font-space text-4xl font-bold text-content-primary uppercase tracking-tighter leading-none'>
                Gobernanza de <span className='text-gradient'>Red</span>
              </h2>
            </div>
          </div>
        </div>
        <EnterpriseButton
          onClick={handleSave}
          disabled={isSaving}
          className='px-12 py-5 bg-blue-600'
        >
          {isSaving ? (
            'SYNCING...'
          ) : (
            <>
              <Save className='w-4 h-4' /> GUARDAR PARÁMETROS
            </>
          )}
        </EnterpriseButton>
      </div>

      <div className='flex glass p-2 rounded-[2.5rem] border-content-muted/10 gap-2 bg-surface/50 overflow-x-auto'>
        {[
          { id: 'general', label: 'Datos Empresa', icon: Building },
          { id: 'fiscal', label: 'Fiscal & CPE', icon: FileText },
          { id: 'integrations', label: 'APIs & Conectividad', icon: Link2 },
          { id: 'store', label: 'Tienda & SEO', icon: Globe },
          { id: 'notifications', label: 'Alertas Mail', icon: Bell },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as SettingsTab)}
            className={`flex-1 min-w-[180px] flex items-center justify-center gap-3 py-5 rounded-[2rem] text-[9px] font-black uppercase tracking-widest transition-all ${activeTab === tab.id ? 'bg-blue-600 text-white shadow-xl' : 'text-content-muted hover:bg-content-muted/5'}`}
          >
            <tab.icon className='w-4 h-4' />
            {tab.label}
          </button>
        ))}
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-3 gap-10'>
        <div className='lg:col-span-2 space-y-8'>
          {activeTab === 'general' && (
            <div className='glass-card rounded-[3rem] p-10 border-content-muted/10 space-y-10 bg-surface'>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
                <EnterpriseInput
                  label='Nombre Comercial'
                  value={localConfig.company.name}
                  onChange={(e) =>
                    setLocalConfig({
                      ...localConfig,
                      company: { ...localConfig.company, name: e.target.value },
                    })
                  }
                />
                <EnterpriseInput
                  label='Razón Social'
                  value={localConfig.company.socialReason}
                  onChange={(e) =>
                    setLocalConfig({
                      ...localConfig,
                      company: { ...localConfig.company, socialReason: e.target.value },
                    })
                  }
                />
                <EnterpriseInput
                  label='RUC SUNAT'
                  value={localConfig.company.ruc}
                  onChange={(e) =>
                    setLocalConfig({
                      ...localConfig,
                      company: { ...localConfig.company, ruc: e.target.value },
                    })
                  }
                />
                <EnterpriseInput
                  label='Teléfono Central'
                  value={localConfig.company.phone}
                  onChange={(e) =>
                    setLocalConfig({
                      ...localConfig,
                      company: { ...localConfig.company, phone: e.target.value },
                    })
                  }
                />
              </div>
            </div>
          )}

          {activeTab === 'integrations' && (
            <div className='space-y-8'>
              <div className='glass-card rounded-[3rem] p-10 border-content-muted/10 space-y-8 bg-surface'>
                <h4 className='text-[10px] font-black text-blue-500 uppercase tracking-widest flex items-center gap-2'>
                  <CreditCard className='w-4 h-4' /> Gateway de Pago Online
                </h4>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
                  <div className='space-y-2'>
                    <label className='text-[9px] font-black text-slate-500 uppercase'>
                      Proveedor Activo
                    </label>
                    <select
                      className='w-full p-4 glass border-content-muted/10 rounded-2xl text-xs font-bold text-white bg-main/40 outline-none'
                      value={localConfig.integrations.payment.provider}
                      onChange={(e) =>
                        setLocalConfig({
                          ...localConfig,
                          integrations: {
                            ...localConfig.integrations,
                            payment: {
                              ...localConfig.integrations.payment,
                              provider: e.target
                                .value as SystemConfig['integrations']['payment']['provider'],
                            },
                          },
                        })
                      }
                    >
                      <option value='NIUBIZ'>NIUBIZ (ANTERIOR VISANET)</option>
                      <option value='IZIPAY'>IZIPAY (EMBEDDED)</option>
                      <option value='CULQI'>CULQI (V4.0 API)</option>
                    </select>
                  </div>
                  <EnterpriseInput
                    label='Merchant ID'
                    value={localConfig.integrations.payment.merchantId}
                    onChange={(e) =>
                      setLocalConfig({
                        ...localConfig,
                        integrations: {
                          ...localConfig.integrations,
                          payment: {
                            ...localConfig.integrations.payment,
                            merchantId: e.target.value,
                          },
                        },
                      })
                    }
                  />
                  <div className='md:col-span-2'>
                    <EnterpriseInput
                      label='API Key de Producción'
                      type='password'
                      value={localConfig.integrations.payment.apiKey}
                      onChange={(e) =>
                        setLocalConfig({
                          ...localConfig,
                          integrations: {
                            ...localConfig.integrations,
                            payment: {
                              ...localConfig.integrations.payment,
                              apiKey: e.target.value,
                            },
                          },
                        })
                      }
                    />
                  </div>
                </div>
              </div>

              <div className='glass-card rounded-[3rem] p-10 border-content-muted/10 space-y-8 bg-surface'>
                <h4 className='text-[10px] font-black text-emerald-500 uppercase tracking-widest flex items-center gap-2'>
                  <Truck className='w-4 h-4' /> Logística & Courier API
                </h4>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
                  <div className='space-y-2'>
                    <label className='text-[9px] font-black text-slate-500 uppercase'>
                      Socio Courier
                    </label>
                    <select
                      className='w-full p-4 glass border-content-muted/10 rounded-2xl text-xs font-bold text-white bg-main/40 outline-none'
                      value={localConfig.integrations.courier.provider}
                      onChange={(e) =>
                        setLocalConfig({
                          ...localConfig,
                          integrations: {
                            ...localConfig.integrations,
                            courier: {
                              ...localConfig.integrations.courier,
                              provider: e.target
                                .value as SystemConfig['integrations']['courier']['provider'],
                            },
                          },
                        })
                      }
                    >
                      <option value='OLVA'>OLVA EXPRESS</option>
                      <option value='SHALOM'>SHALOM LOGISTICS</option>
                      <option value='DIRECT'>ENTREGA PROPIA ROSPORTS</option>
                    </select>
                  </div>
                  <EnterpriseInput
                    label='Ubigeo de Origen'
                    value={localConfig.integrations.courier.originUbigeo}
                    onChange={(e) =>
                      setLocalConfig({
                        ...localConfig,
                        integrations: {
                          ...localConfig.integrations,
                          courier: {
                            ...localConfig.integrations.courier,
                            originUbigeo: e.target.value,
                          },
                        },
                      })
                    }
                  />
                </div>
              </div>

              <div className='glass-card rounded-[3rem] p-10 border-content-muted/10 space-y-8 bg-surface'>
                <h4 className='text-[10px] font-black text-purple-500 uppercase tracking-widest flex items-center gap-2'>
                  <Users className='w-4 h-4' /> Validación RENIEC / SUNAT
                </h4>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
                  <EnterpriseInput
                    label='API Endpoint Validación'
                    value={localConfig.integrations.validation.dniApiUrl}
                    onChange={(e) =>
                      setLocalConfig({
                        ...localConfig,
                        integrations: {
                          ...localConfig.integrations,
                          validation: {
                            ...localConfig.integrations.validation,
                            dniApiUrl: e.target.value,
                          },
                        },
                      })
                    }
                  />
                  <EnterpriseInput
                    label='Bearer Token Auth'
                    type='password'
                    value={localConfig.integrations.validation.token}
                    onChange={(e) =>
                      setLocalConfig({
                        ...localConfig,
                        integrations: {
                          ...localConfig.integrations,
                          validation: {
                            ...localConfig.integrations.validation,
                            token: e.target.value,
                          },
                        },
                      })
                    }
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        <aside className='space-y-8'>
          <div className='glass-card rounded-[3rem] p-10 border-content-muted/10 space-y-10 bg-surface shadow-sm text-center'>
            <div className='w-20 h-20 glass rounded-[2rem] flex items-center justify-center mx-auto text-blue-500'>
              <Cloud className='w-10 h-10 animate-pulse' />
            </div>
            <div className='space-y-2'>
              <h4 className='text-xl font-space font-bold text-white uppercase'>
                Cloud Connectivity
              </h4>
              <p className='text-[9px] font-black text-slate-500 uppercase tracking-widest leading-relaxed'>
                Estado de los túneles API externos
              </p>
            </div>
            <div className='space-y-4 pt-4 border-t border-white/5'>
              <div className='flex justify-between items-center text-[8px] font-black uppercase'>
                <span className='text-slate-500'>RENIEC HUB</span>
                <span className='text-emerald-500'>LINKED</span>
              </div>
              <div className='flex justify-between items-center text-[8px] font-black uppercase'>
                <span className='text-slate-500'>NIUBIZ PRO</span>
                <span className='text-emerald-500'>READY</span>
              </div>
              <div className='flex justify-between items-center text-[8px] font-black uppercase'>
                <span className='text-slate-500'>OLVA WEBHOOK</span>
                <span className='text-amber-500'>LISTENING</span>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default SettingsManager;
