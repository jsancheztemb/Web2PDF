
import React from 'react';
import { ScrapingStatus } from '../types';
import { CheckCircle2, Circle, Loader2, ShieldCheck, Cpu, Terminal, Fingerprint } from 'lucide-react';

interface Props {
  status: ScrapingStatus;
  strategy?: string[];
}

const ScrapingDashboard: React.FC<Props> = ({ status, strategy }) => {
  const steps = [
    { key: ScrapingStatus.DISCOVERY, label: 'Descubrimiento de URLs', icon: Terminal },
    { key: ScrapingStatus.ANALYZING, label: 'Evasión de Anti-Bot (TLS/JA3)', icon: Fingerprint },
    { key: ScrapingStatus.STRUCTURING, label: 'Jerarquización por IA', icon: Cpu },
    { key: ScrapingStatus.COMPLETED, label: 'Manual PDF Generado', icon: ShieldCheck },
  ];

  const getStatusIcon = (stepStatus: ScrapingStatus) => {
    const currentIndex = steps.findIndex(s => s.key === status);
    const stepIndex = steps.findIndex(s => s.key === stepStatus);

    if (status === ScrapingStatus.ERROR) return <Circle className="w-5 h-5 text-slate-300" />;
    
    // If fully completed
    if (status === ScrapingStatus.COMPLETED) {
      return <CheckCircle2 className="w-5 h-5 text-emerald-500 fill-emerald-50" />;
    }

    if (stepIndex < currentIndex) return <CheckCircle2 className="w-5 h-5 text-indigo-500 fill-indigo-50" />;
    if (stepIndex === currentIndex) return <Loader2 className="w-5 h-5 text-indigo-600 animate-spin" />;
    return <Circle className="w-5 h-5 text-slate-300" />;
  };

  const getStatusText = (stepKey: ScrapingStatus) => {
    if (status === ScrapingStatus.ERROR) return 'Error en proceso';
    if (status === ScrapingStatus.COMPLETED) return 'Finalizado con éxito';
    
    const currentIndex = steps.findIndex(s => s.key === status);
    const stepIndex = steps.findIndex(s => s.key === stepKey);

    if (stepIndex < currentIndex) return 'Completado';
    if (stepIndex === currentIndex) return 'En curso...';
    return 'Esperando...';
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
      <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
        <Terminal className="w-5 h-5 text-indigo-600" />
        Monitor de Proceso
      </h3>

      <div className="space-y-6">
        {steps.map((step) => (
          <div key={step.key} className="flex items-start gap-3">
            <div className="mt-0.5">{getStatusIcon(step.key)}</div>
            <div>
              <p className={`text-sm font-semibold ${status === step.key ? 'text-indigo-600' : 'text-slate-700'}`}>
                {step.label}
              </p>
              <p className="text-xs text-slate-500 mt-0.5">
                {getStatusText(step.key)}
              </p>
            </div>
          </div>
        ))}
      </div>

      {strategy && strategy.length > 0 && (
        <div className="mt-8 pt-8 border-t border-slate-100">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Estrategia de Evasión Aplicada</h4>
          <ul className="space-y-3">
            {strategy.map((item, i) => (
              <li key={i} className="flex items-center gap-2 text-xs text-slate-600 bg-slate-50 p-2 rounded-lg border border-slate-100">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ScrapingDashboard;
