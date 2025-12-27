
import React, { useState } from 'react';
import { analyzeWebStructure } from './services/geminiService';
import { ManualStructure, ScrapingStatus } from './types';
import ScrapingDashboard from './components/ScrapingDashboard';
import ManualStructureView from './components/ManualStructureView';
import { Search, Book, ShieldAlert, Cpu, Download, ArrowRight, Globe } from 'lucide-react';

const App: React.FC = () => {
  const [url, setUrl] = useState('');
  const [status, setStatus] = useState<ScrapingStatus>(ScrapingStatus.IDLE);
  const [structure, setStructure] = useState<ManualStructure | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleStartProcess = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;
    
    setError(null);
    setStatus(ScrapingStatus.DISCOVERY);
    
    try {
      // Simulate phases for UI effect
      setTimeout(() => setStatus(ScrapingStatus.ANALYZING), 1500);
      setTimeout(() => setStatus(ScrapingStatus.STRUCTURING), 3500);
      
      const result = await analyzeWebStructure(url);
      setStructure(result);
      setStatus(ScrapingStatus.COMPLETED);
    } catch (err: any) {
      setError(err.message || 'Error inesperado durante el proceso.');
      setStatus(ScrapingStatus.ERROR);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-indigo-600 p-2 rounded-lg">
              <Book className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-600">
              Web2Manual Pro
            </h1>
          </div>
          <div className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-500">
            <span className="flex items-center gap-1.5"><ShieldAlert className="w-4 h-4" /> Anti-Detection</span>
            <span className="flex items-center gap-1.5"><Cpu className="w-4 h-4" /> AI Structuring</span>
            <span className="flex items-center gap-1.5"><Globe className="w-4 h-4" /> Global Crawler</span>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12">
        {/* Intro Section */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">
            Convierte cualquier Web en un <span className="text-indigo-600">Manual Estructurado</span>
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Utilizamos IA avanzada y técnicas de evasión de grado industrial para capturar, ordenar y generar documentación profesional de cualquier sitio web.
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-3xl mx-auto mb-16">
          <form onSubmit={handleStartProcess} className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
            </div>
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://docs.ejemplo.com/introduccion"
              className="block w-full pl-11 pr-32 py-4 bg-white border border-slate-200 rounded-2xl shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-lg transition-all"
              required
            />
            <button
              type="submit"
              disabled={status !== ScrapingStatus.IDLE && status !== ScrapingStatus.COMPLETED && status !== ScrapingStatus.ERROR}
              className="absolute right-2 top-2 bottom-2 px-6 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-colors"
            >
              Generar Manual
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
          {error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-100 rounded-xl text-red-700 text-sm flex items-center gap-2">
              <ShieldAlert className="w-4 h-4" />
              {error}
            </div>
          )}
        </div>

        {/* Main Content Area */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Progress & Strategy */}
          <div className="lg:col-span-1 space-y-6">
            <ScrapingDashboard status={status} strategy={structure?.scrapingStrategy} />
          </div>

          {/* Results Area */}
          <div className="lg:col-span-2">
            {status === ScrapingStatus.IDLE ? (
              <div className="h-full min-h-[400px] border-2 border-dashed border-slate-200 rounded-3xl flex flex-col items-center justify-center text-slate-400 p-8 text-center">
                <div className="bg-slate-100 p-6 rounded-full mb-4">
                  <Globe className="w-12 h-12" />
                </div>
                <h3 className="text-xl font-semibold text-slate-600">Listo para escanear</h3>
                <p className="max-w-sm mt-2">Introduce una URL para comenzar el análisis estructural y la captura de contenido.</p>
              </div>
            ) : (
              <ManualStructureView structure={structure} loading={status !== ScrapingStatus.COMPLETED} />
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-8">
        <div className="max-w-7xl mx-auto px-4 text-center text-slate-500 text-sm">
          <p>© 2024 Web2Manual Pro - Tecnología de Scraping Ético & IA</p>
        </div>
      </footer>
    </div>
  );
};

export default App;
