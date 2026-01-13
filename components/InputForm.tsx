import React, { useState } from 'react';

interface InputFormProps {
  onAnalyze: (url: string) => void;
  isLoading: boolean;
}

const InputForm: React.FC<InputFormProps> = ({ onAnalyze, isLoading }) => {
  const [url, setUrl] = useState('https://github.com/EPS-Works/micropython-starter-template');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (url.trim()) {
      onAnalyze(url.trim());
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto mb-10">
      <form onSubmit={handleSubmit} className="relative group">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-secondary rounded-lg blur opacity-30 group-hover:opacity-60 transition duration-500"></div>
        <div className="relative flex items-center bg-surface rounded-lg p-2 border border-slate-700 shadow-xl">
          <div className="pl-4 text-slate-400">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
            </svg>
          </div>
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Enter GitHub Repository URL..."
            className="flex-grow bg-transparent border-none focus:ring-0 text-white placeholder-slate-500 px-4 py-3 font-mono text-sm sm:text-base outline-none w-full"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading}
            className={`
              ml-2 px-6 py-3 rounded-md font-semibold text-slate-900 transition-all duration-200 min-w-[140px]
              ${isLoading 
                ? 'bg-slate-500 cursor-not-allowed' 
                : 'bg-primary hover:bg-sky-300 active:scale-95 shadow-[0_0_15px_rgba(56,189,248,0.3)]'}
            `}
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-5 w-5 text-slate-900" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Drafting
              </span>
            ) : (
              'Upgrade Repo'
            )}
          </button>
        </div>
      </form>
      <div className="mt-3 text-center">
        <p className="text-xs text-slate-500 uppercase tracking-widest font-semibold">Generate a Senior-Level Architecture Plan</p>
      </div>
    </div>
  );
};

export default InputForm;