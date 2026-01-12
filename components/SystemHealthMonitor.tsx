
import React, { useState, useEffect } from 'react';
import { 
  Activity, Shield, Zap, Server, AlertTriangle, 
  CheckCircle, RefreshCw, Cpu, Wifi, Database,
  Lock, Unlock
} from 'lucide-react';
import { SystemMonitor } from '../services/systemMonitorService';
import { ModuleHealth, HealthStatus, NetworkStatus } from '../types';
import { EnterpriseDataTable, TechnicalBadge } from './Primitives';
import { API } from '../services/apiClient';

const SystemHealthMonitor: React.FC = () => {
  const [report, setReport] = useState<ModuleHealth[]>(SystemMonitor.getHealthReport());
  const [networkStatus, setNetworkStatus] = useState<NetworkStatus>(API.getStatus());
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setReport(SystemMonitor.getHealthReport());
      setNetworkStatus(API.getStatus());
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  const getStatusColor = (status: HealthStatus | NetworkStatus) => {
    switch (status) {
      case 'NOMINAL': case 'ONLINE': return 'text-emerald-500';
      case 'DEGRADED': return 'text-amber-500';
      case 'CRITICAL': case 'CIRCUIT_OPEN': case 'OFFLINE': return 'text-red-500';
      default: return 'text-content-muted';
    }
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-700 pb-20">
      <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-8">
        <div className="space-y-4">
          <div className="flex items-center gap-3 text-blue-500">
            <div className="w-12 h-12 glass rounded-2xl flex items-center justify-center border-blue-500/20 shadow-xl bg-surface">
               <Shield className="w-6 h-6" />
            </div>
            <div className="flex flex-col">
               <span className="text-[9px] font-black uppercase tracking-[0.5em] text-content-muted">Security & Resiliency Hub</span>
               <h2 className="font-space text-4xl font-bold text-content-primary uppercase tracking-tighter leading-none">Global <span className="text-gradient">Observability</span></h2>
            </div>
          </div>
        </div>
        
        <div className="flex gap-4">
           <div className={`px-8 py-5 rounded-2xl border flex items-center gap-4 transition-all shadow-xl bg-surface ${networkStatus === 'CIRCUIT_OPEN' ? 'border-red-500/30' : 'border-emerald-500/30'}`}>
              {networkStatus === 'CIRCUIT_OPEN' ? <Lock className="w-5 h-5 text-red-500" /> : <Unlock className="w-5 h-5 text-emerald-500" />}
              <div className="flex flex-col">
                 <span className="text-[8px] font-black text-content-muted uppercase tracking-widest">Circuit Breaker</span>
                 <span className={`text-xs font-bold uppercase ${getStatusColor(networkStatus)}`}>{networkStatus}</span>
              </div>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
         {report.map(mod => (
           <div key={mod.id} className="glass-card rounded-[2rem] p-8 border-content-muted/10 space-y-4 bg-surface">
              <div className="flex justify-between items-start">
                 <div className={`p-3 glass rounded-xl ${getStatusColor(mod.status)} bg-current/5`}>
                    <Server className="w-6 h-6" />
                 </div>
                 <TechnicalBadge variant={mod.status === 'NOMINAL' ? 'emerald' : mod.status === 'DEGRADED' ? 'amber' : 'red'}>
                   {mod.status}
                 </TechnicalBadge>
              </div>
              <div>
                 <p className="text-[10px] font-black text-content-muted uppercase tracking-widest">{mod.label}</p>
                 <p className="text-2xl font-bold font-space text-content-primary">{mod.latency}ms</p>
                 <p className="text-[8px] font-mono text-content-muted mt-2">LAST_SYNC: {new Date(mod.lastSync).toLocaleTimeString()}</p>
              </div>
           </div>
         ))}
      </div>

      <div className="space-y-6">
         <h4 className="text-[10px] font-black text-blue-500 uppercase tracking-[0.6em] px-4">Distributed Mesh Telemetry</h4>
         <EnterpriseDataTable<ModuleHealth> 
          data={report}
          columns={[
            { key: 'id', label: 'Node ID', render: (item) => <span className="text-[10px] font-mono font-bold text-blue-600 dark:text-blue-500">{item.id}</span> },
            { key: 'label', label: 'Service Component' },
            { key: 'status', label: 'Health State', render: (item) => <TechnicalBadge variant={item.status === 'NOMINAL' ? 'emerald' : 'red'}>{item.status}</TechnicalBadge> },
            { key: 'errors', label: 'Failures', render: (item) => <span className={`text-xs font-bold ${item.errors > 0 ? 'text-red-500' : 'text-content-muted'}`}>{item.errors} DETECTED</span> },
            { key: 'latency', label: 'Round-trip', render: (item) => <span className="text-xs font-bold text-content-secondary">{item.latency}ms</span> }
          ]}
         />
      </div>
    </div>
  );
};

export default SystemHealthMonitor;
