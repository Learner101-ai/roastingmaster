import React, { useState } from 'react';
import AuditInput from './components/AuditInput';
import ReportCard from './components/ReportCard';
import { scrapeUrl } from './services/scrapingService';
import { analyzeContent } from './services/geminiService';
import { generatePDF } from './utils/pdfGenerator';
import { AppState, AuditResult } from './types';
import { Terminal, ShieldAlert } from 'lucide-react';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.IDLE);
  const [result, setResult] = useState<AuditResult | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleAnalyze = async (urlInput: string) => {
    setErrorMsg(null);
    setAppState(AppState.SCRAPING);

    try {
      // 1. Scrape
      const scrapeRes = await scrapeUrl(urlInput);
      
      if (!scrapeRes.success || !scrapeRes.text) {
        throw new Error(scrapeRes.error || "Failed to access website content. It might be blocked or empty.");
      }

      // 2. Analyze
      setAppState(AppState.ANALYZING);
      const analysis = await analyzeContent(scrapeRes.text, urlInput);

      setResult(analysis);
      setAppState(AppState.COMPLETE);
    } catch (err: any) {
      setAppState(AppState.ERROR);
      setErrorMsg(err.message || "An unexpected error occurred.");
    }
  };

  const handleDownload = () => {
    if (result) {
      generatePDF(result);
    }
  };

  const handleReset = () => {
    setAppState(AppState.IDLE);
    setResult(null);
    setErrorMsg(null);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-roast-500/30 selection:text-roast-200">
      
      {/* Background decoration */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-roast-900/10 blur-[100px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-blue-900/10 blur-[100px]" />
      </div>

      <div className="relative z-10 flex flex-col min-h-screen">
        
        {/* Navigation */}
        <nav className="w-full p-6 flex justify-between items-center border-b border-white/5 backdrop-blur-sm">
          <div className="flex items-center gap-2 font-black tracking-tighter text-xl">
            <span className="text-roast-500 text-2xl">⚡</span> ROAST_MY_LANDING
          </div>
          <div className="flex gap-4">
             <a href="#" className="text-slate-400 hover:text-white transition-colors text-sm font-medium">About</a>
             <a href="#" className="text-slate-400 hover:text-white transition-colors text-sm font-medium">Pricing</a>
          </div>
        </nav>

        {/* Main Content */}
        <main className="flex-grow flex flex-col items-center justify-center p-6">
          
          {appState === AppState.ERROR && (
            <div className="mb-8 p-4 bg-red-950/50 border border-red-500/50 rounded-lg flex items-center gap-3 text-red-200 max-w-lg animate-in fade-in slide-in-from-top-4">
              <ShieldAlert className="w-5 h-5 flex-shrink-0" />
              <p className="text-sm">{errorMsg}</p>
              <button onClick={handleReset} className="ml-auto text-xs underline hover:text-white">Try Again</button>
            </div>
          )}

          {(appState === AppState.IDLE || appState === AppState.SCRAPING || appState === AppState.ANALYZING || appState === AppState.ERROR) && (
             <AuditInput onAnalyze={handleAnalyze} appState={appState} />
          )}

          {appState === AppState.COMPLETE && result && (
            <ReportCard result={result} onDownload={handleDownload} onReset={handleReset} />
          )}

        </main>

        {/* Footer */}
        <footer className="w-full p-6 text-center text-slate-600 text-xs border-t border-white/5">
          <p>© {new Date().getFullYear()} RoastMyLanding. Powered by Google Gemini.</p>
        </footer>

      </div>
    </div>
  );
};

export default App;