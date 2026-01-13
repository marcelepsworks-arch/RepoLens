import React, { useState } from 'react';
import InputForm from './components/InputForm';
import ResultView from './components/ResultView';
import { AnalysisState } from './types';
import { analyzeRepository } from './services/geminiService';

const App: React.FC = () => {
  const [state, setState] = useState<AnalysisState>({
    status: 'idle',
    data: null,
    error: null,
  });

  const handleAnalyze = async (url: string) => {
    setState({ status: 'loading', data: null, error: null });
    
    try {
      const data = await analyzeRepository(url);
      setState({ status: 'success', data, error: null });
    } catch (error: any) {
      setState({ 
        status: 'error', 
        data: null, 
        error: error.message || "An unexpected error occurred." 
      });
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden flex flex-col items-center">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-secondary/10 to-transparent pointer-events-none" />
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-40 -left-20 w-72 h-72 bg-secondary/10 rounded-full blur-3xl pointer-events-none" />

      <main className="w-full max-w-7xl px-4 py-12 md:py-20 relative z-10 flex flex-col items-center">
        
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center p-3 bg-slate-800 rounded-2xl mb-6 shadow-xl border border-slate-700">
             <svg className="w-10 h-10 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
             </svg>
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-white mb-4">
            Repo<span className="text-primary">Lens</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto font-light">
            Instant, AI-powered technical analysis for GitHub repositories. <br/>
            Understand structure, stack, and code quality in seconds.
          </p>
        </div>

        {/* Form Section */}
        <InputForm onAnalyze={handleAnalyze} isLoading={state.status === 'loading'} />

        {/* Output Section */}
        <div className="w-full">
           {state.status === 'loading' && (
             <div className="w-full max-w-4xl mx-auto p-12 bg-surface/50 rounded-xl border border-slate-700/50 backdrop-blur-sm flex flex-col items-center justify-center text-center space-y-4">
                <div className="relative">
                  <div className="w-16 h-16 border-4 border-slate-700 border-t-primary rounded-full animate-spin"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                  </div>
                </div>
                <h3 className="text-xl font-medium text-white">Architecting V2 & Migration Guide</h3>
                <p className="text-slate-400">Drafting AsyncIO patterns, robustness checks, and documenting migration steps...</p>
             </div>
           )}

           {state.status === 'error' && (
             <div className="w-full max-w-4xl mx-auto p-6 bg-red-900/20 border border-red-500/50 rounded-xl flex items-start gap-4 text-red-200">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <div>
                  <h4 className="font-bold text-red-100">Analysis Failed</h4>
                  <p className="mt-1 opacity-90">{state.error}</p>
                </div>
             </div>
           )}

           {state.status === 'success' && state.data && (
             <ResultView data={state.data} />
           )}
        </div>
      </main>

      <footer className="w-full py-6 text-center text-slate-600 text-sm">
        <p>&copy; {new Date().getFullYear()} RepoLens. Powered by Gemini 3 Pro.</p>
      </footer>
    </div>
  );
};

export default App;