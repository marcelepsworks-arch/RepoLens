import React, { useState, useEffect } from 'react';
import { ProjectFile } from '../types';
import MarkdownRenderer from './MarkdownRenderer';

interface FileBrowserProps {
  files: ProjectFile[];
}

const FileBrowser: React.FC<FileBrowserProps> = ({ files }) => {
  // Default to MIGRATION_GUIDE.md if it exists, otherwise the first file
  const [selectedFile, setSelectedFile] = useState<ProjectFile | null>(null);

  useEffect(() => {
    if (files.length > 0 && !selectedFile) {
      const guide = files.find(f => f.filename === 'MIGRATION_GUIDE.md');
      setSelectedFile(guide || files[0]);
    }
  }, [files, selectedFile]);

  if (!selectedFile) return null;

  const handleDownload = (file: ProjectFile) => {
    const blob = new Blob([file.content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = file.filename.split('/').pop() || 'download';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Helper to determine icon
  const getFileIcon = (filename: string) => {
    if (filename.endsWith('.md')) return (
      <svg className="w-4 h-4 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    );
    if (filename.endsWith('.py')) return (
      <svg className="w-4 h-4 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
      </svg>
    );
    if (filename.endsWith('.json')) return (
      <svg className="w-4 h-4 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
      </svg>
    );
    return (
      <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    );
  };

  // Prepare content for renderer
  // If it's a code file, wrap it in markdown code blocks to leverage the existing renderer's highlighting
  const renderContent = () => {
    if (selectedFile.filename.endsWith('.md')) {
      return selectedFile.content;
    }
    const extension = selectedFile.filename.split('.').pop() || '';
    return "```" + extension + "\n" + selectedFile.content + "\n```";
  };

  return (
    <div className="flex flex-col md:flex-row h-[600px] w-full bg-[#0d1117] border border-slate-700 rounded-xl overflow-hidden shadow-2xl">
      {/* Sidebar: File List */}
      <div className="w-full md:w-64 bg-slate-900 border-b md:border-b-0 md:border-r border-slate-700 flex flex-col">
        <div className="p-4 border-b border-slate-800 bg-slate-900/50">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Project Explorer</h3>
        </div>
        <div className="flex-1 overflow-y-auto py-2">
          {files.map((file) => (
            <button
              key={file.filename}
              onClick={() => setSelectedFile(file)}
              className={`w-full text-left px-4 py-2 flex items-center gap-3 text-sm transition-colors
                ${selectedFile.filename === file.filename 
                  ? 'bg-primary/10 text-primary border-r-2 border-primary' 
                  : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'}
              `}
            >
              {getFileIcon(file.filename)}
              <span className="truncate font-mono">{file.filename}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 bg-[#0d1117]">
        {/* Header */}
        <div className="h-12 border-b border-slate-700 flex items-center justify-between px-4 bg-slate-800/30">
          <div className="flex items-center gap-2">
            <span className="text-sm font-mono text-slate-200">{selectedFile.filename}</span>
            <span className="text-xs text-slate-500 hidden sm:inline-block">- {selectedFile.description}</span>
          </div>
          <button
            onClick={() => handleDownload(selectedFile)}
            className="flex items-center gap-2 px-3 py-1.5 bg-primary/10 hover:bg-primary/20 text-primary text-xs font-semibold rounded transition-colors border border-primary/20"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Download
          </button>
        </div>

        {/* Editor/Viewer */}
        <div className="flex-1 overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
          <MarkdownRenderer content={renderContent()} />
        </div>
      </div>
    </div>
  );
};

export default FileBrowser;