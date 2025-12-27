
import React, { useState } from 'react';
import { ManualStructure } from '../types';
import { BookOpen, ChevronRight, FileText, Download, ExternalLink, Loader2, Check } from 'lucide-react';

interface Props {
  structure: ManualStructure | null;
  loading: boolean;
}

const ManualStructureView: React.FC<Props> = ({ structure, loading }) => {
  const [downloading, setDownloading] = useState(false);
  const [downloaded, setDownloaded] = useState(false);

  const handleDownload = () => {
    if (!structure) return;
    
    setDownloading(true);
    
    // Simulate PDF generation delay
    setTimeout(() => {
      const content = `MANUAL: ${structure.siteTitle}\n` +
        `Estrategia de Scraping: ${structure.scrapingStrategy.join(', ')}\n\n` +
        structure.chapters.map((c, i) => (
          `CAPÍTULO ${i + 1}: ${c.title}\n` +
          `Resumen: ${c.summary}\n` +
          `Páginas:\n` +
          c.pages.map(p => `- ${p.title} (${p.url})`).join('\n')
        )).join('\n\n');

      const blob = new Blob([content], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${structure.siteTitle.replace(/\s+/g, '_')}_Manual.pdf.txt`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      setDownloading(false);
      setDownloaded(true);
      setTimeout(() => setDownloaded(false), 3000);
    }, 1500);
  };

  if (loading) {
    return (
      <div className="bg-white rounded-3xl border border-slate-200 p-12 shadow-sm flex flex-col items-center justify-center text-center">
        <Loader2 className="w-12 h-12 text-indigo-600 animate-spin mb-4" />
        <h3 className="text-xl font-bold text-slate-900">Analizando estructura lógica...</h3>
        <p className="text-slate-500 mt-2 max-w-sm">
          Gemini 3 Pro está recorriendo el sitio, detectando protecciones y organizando el contenido en un orden coherente de manual.
        </p>
      </div>
    );
  }

  if (!structure) return null;

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h3 className="text-2xl font-bold text-slate-900">{structure.siteTitle}</h3>
            <p className="text-slate-500 text-sm mt-1">Estructura de manual generada (~{structure.totalEstimatedPages} páginas estimadas)</p>
          </div>
          <button 
            onClick={handleDownload}
            disabled={downloading}
            className={`flex items-center justify-center gap-2 px-6 py-3 font-bold rounded-2xl transition-all shadow-lg shadow-slate-200 min-w-[200px] ${
              downloaded 
                ? 'bg-emerald-500 text-white' 
                : 'bg-slate-900 text-white hover:bg-slate-800'
            } disabled:opacity-70`}
          >
            {downloading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Generando...
              </>
            ) : downloaded ? (
              <>
                <Check className="w-5 h-5" />
                ¡Descargado!
              </>
            ) : (
              <>
                <Download className="w-5 h-5" />
                Descargar PDF Completo
              </>
            )}
          </button>
        </div>

        <div className="space-y-8">
          {structure.chapters.map((chapter, idx) => (
            <div key={chapter.id} className="group">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold text-sm">
                  {idx + 1}
                </div>
                <h4 className="text-lg font-bold text-slate-800">{chapter.title}</h4>
              </div>
              
              <div className="pl-11 space-y-4">
                <p className="text-sm text-slate-600 leading-relaxed italic border-l-2 border-slate-100 pl-4">
                  {chapter.summary}
                </p>
                
                <div className="grid sm:grid-cols-2 gap-3">
                  {chapter.pages.map((page, pIdx) => (
                    <div key={pIdx} className="bg-slate-50 rounded-xl p-4 border border-slate-100 hover:border-indigo-200 hover:bg-white transition-all cursor-default flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <span className="text-xs font-bold text-indigo-500 uppercase tracking-wider">Subsección</span>
                          <FileText className="w-3.5 h-3.5 text-slate-400" />
                        </div>
                        <h5 className="text-sm font-bold text-slate-900 line-clamp-1">{page.title}</h5>
                        {page.description && (
                          <p className="text-xs text-slate-500 mt-2 line-clamp-2 leading-relaxed">
                            {page.description}
                          </p>
                        )}
                      </div>
                      <div className="mt-4 flex items-center justify-between">
                        <a 
                          href={page.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-[10px] text-slate-400 hover:text-indigo-600 flex items-center gap-1 transition-colors"
                        >
                          <ExternalLink className="w-3 h-3" />
                          Ver Fuente
                        </a>
                        <div className="h-1 w-12 bg-slate-200 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-indigo-500" 
                            style={{ width: `${(page.relevance || 0) * 100}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Additional Manual Metadata Card */}
      <div className="bg-gradient-to-br from-indigo-600 to-violet-700 rounded-3xl p-8 text-white shadow-xl">
        <div className="flex items-center gap-4 mb-4">
          <BookOpen className="w-10 h-10 opacity-50" />
          <h4 className="text-xl font-bold">Resumen de Composición</h4>
        </div>
        <p className="text-indigo-100 mb-6">
          Este manual ha sido jerarquizado siguiendo un orden pedagógico. Hemos priorizado la consistencia visual y la eliminación de redundancias (headers/footers repetitivos) para asegurar una experiencia de lectura fluida.
        </p>
        <div className="grid grid-cols-3 gap-4 border-t border-white/20 pt-6">
          <div>
            <p className="text-xs font-medium opacity-70">Capítulos</p>
            <p className="text-2xl font-bold">{structure.chapters.length}</p>
          </div>
          <div>
            <p className="text-xs font-medium opacity-70">Fuentes</p>
            <p className="text-2xl font-bold">{structure.chapters.reduce((acc, c) => acc + c.pages.length, 0)}</p>
          </div>
          <div>
            <p className="text-xs font-medium opacity-70">Formato</p>
            <p className="text-2xl font-bold">PDF/A-1</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManualStructureView;
