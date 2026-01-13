import React from 'react';
import hljs from 'highlight.js';

interface MarkdownRendererProps {
  content: string;
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
  // Split content into blocks of "text" or "code"
  const blocks = React.useMemo(() => {
    const lines = content.split('\n');
    const result: { type: 'text' | 'code'; content: string[]; lang?: string }[] = [];
    let currentBlock: { type: 'text' | 'code'; content: string[]; lang?: string } = { type: 'text', content: [] };

    lines.forEach((line) => {
      if (line.trim().startsWith('```')) {
        // Close current block
        if (currentBlock.content.length > 0) {
          result.push(currentBlock);
        }
        
        // Switch type
        if (currentBlock.type === 'text') {
          // Starting code block
          const lang = line.trim().replace('```', '');
          currentBlock = { type: 'code', content: [], lang };
        } else {
          // Ending code block, switch back to text
          currentBlock = { type: 'text', content: [] };
        }
      } else {
        currentBlock.content.push(line);
      }
    });
    
    // Push final block
    if (currentBlock.content.length > 0) {
      result.push(currentBlock);
    }
    
    return result;
  }, [content]);

  return (
    <div className="space-y-4 text-slate-300 leading-relaxed font-light">
      {blocks.map((block, blockIdx) => {
        if (block.type === 'code') {
           const codeString = block.content.join('\n');
           let highlightedCode = codeString;
           let languageClass = '';

           try {
              if (block.lang && hljs.getLanguage(block.lang)) {
                 highlightedCode = hljs.highlight(codeString, { language: block.lang }).value;
                 languageClass = `language-${block.lang}`;
              } else {
                 const result = hljs.highlightAuto(codeString);
                 highlightedCode = result.value;
                 languageClass = result.language ? `language-${result.language}` : '';
              }
           } catch (e) {
              console.warn('Syntax highlighting failed:', e);
           }

           return (
             <div key={blockIdx} className="my-6 rounded-lg overflow-hidden border border-slate-700 shadow-lg bg-[#282c34]">
               {block.lang && (
                 <div className="bg-slate-800/80 px-4 py-2 text-xs text-slate-400 font-mono border-b border-slate-700 uppercase flex items-center justify-between">
                   <span>{block.lang}</span>
                 </div>
               )}
               <pre className="!m-0 !p-0 overflow-x-auto">
                 <code 
                   className={`hljs !bg-transparent !p-4 font-mono text-sm leading-relaxed block ${languageClass}`}
                   dangerouslySetInnerHTML={{ __html: highlightedCode }}
                 />
               </pre>
             </div>
           );
        }

        // Render Text Block with inline formatting
        return (
          <div key={blockIdx} className="space-y-2">
            {block.content.map((line, lineIdx) => {
              if (line.trim().startsWith('## ')) {
                return <h2 key={lineIdx} className="text-2xl font-bold text-primary mt-8 mb-4 border-b border-slate-700 pb-2">{line.replace('## ', '')}</h2>;
              }
              if (line.trim().startsWith('### ')) {
                return <h3 key={lineIdx} className="text-xl font-semibold text-secondary mt-6 mb-2">{line.replace('### ', '')}</h3>;
              }
              if (line.trim().startsWith('- ') || line.trim().startsWith('* ')) {
                return (
                  <div key={lineIdx} className="flex items-start ml-4">
                    <span className="text-primary mr-2 mt-1.5 text-xs">●</span>
                    <span dangerouslySetInnerHTML={{ 
                      __html: line.replace(/^[\-\*] /, '')
                        .replace(/\*\*(.*?)\*\*/g, '<strong class="text-white font-medium">$1</strong>')
                        .replace(/`([^`]+)`/g, '<code class="bg-slate-800 px-1 py-0.5 rounded text-primary text-sm font-mono">$1</code>') 
                    }} />
                  </div>
                );
              }
              
              if (line.trim() === '') return <div key={lineIdx} className="h-2"></div>;

              return (
                <p 
                  key={lineIdx}
                  dangerouslySetInnerHTML={{ 
                    __html: line
                      .replace(/\*\*(.*?)\*\*/g, '<strong class="text-white font-medium">$1</strong>')
                      .replace(/`([^`]+)`/g, '<code class="bg-slate-800 px-1 py-0.5 rounded text-secondary text-sm font-mono border border-slate-700">$1</code>')
                      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" class="text-primary hover:underline">$1</a>')
                  }} 
                />
              );
            })}
          </div>
        );
      })}
    </div>
  );
};

export default MarkdownRenderer;