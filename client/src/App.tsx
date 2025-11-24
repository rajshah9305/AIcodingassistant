import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Terminal, 
  Cpu, 
  Zap, 
  MessageSquare, 
  ArrowRight, 
  AlertTriangle, 
  Activity,
  Layers,
  Copy,
  Hash,
  Shield,
  Maximize2
} from 'lucide-react';
import { trpc } from '@/lib/trpc';

// --- TYPES ---
interface Toast {
  id: number;
  message: string;
  type: 'ERROR' | 'SUCCESS' | 'INFO';
}

interface AnalysisResult {
  complexity: number;
  security: number;
  performance: number;
  issues: Array<{ id: number; type: string; text: string }>;
}

interface ChatMessage {
  role: 'USR' | 'SYS';
  text: string;
  timestamp: Date;
}

// --- VISUAL ASSETS & UTILS ---
const randomString = (length: number): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

const useScrambledText = (targetValue: string, isScrambling: boolean, baseLength: number = 5): string => {
  const [displayedText, setDisplayedText] = useState(targetValue);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isScrambling) {
      intervalRef.current = setInterval(() => {
        setDisplayedText(randomString(baseLength));
      }, 50);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
      setDisplayedText(targetValue);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isScrambling, targetValue, baseLength]);

  return isScrambling ? displayedText : targetValue;
};

const GrainOverlay = () => (
  <div 
    className="fixed inset-0 pointer-events-none z-[50] opacity-[0.04] mix-blend-overlay" 
    style={{
      backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='1'/%3E%3C/svg%3E")`
    }}
  />
);

// Unified Section Header Component - Enhanced Visual Hierarchy
const SectionHeader = ({ 
  title, 
  subtitle, 
  status = "IDLE", 
  active = false 
}: { 
  title: string; 
  subtitle: string; 
  status?: string; 
  active?: boolean;
}) => (
  <div className="relative flex flex-col sm:flex-row justify-between items-start sm:items-end border-b border-neutral-800/50 pb-5 mb-8 select-none gap-4">
    {/* Subtle gradient line under header */}
    <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-lime-400/20 to-transparent" />
    
    <div className="flex-1 min-w-0 space-y-2">
      <div className="flex items-center gap-2.5 text-[11px] font-mono text-lime-400/80 tracking-[0.15em] mb-2 uppercase">
        <Hash size={12} className="text-lime-400/60" />
        <span className="truncate font-semibold">{subtitle}</span>
      </div>
      <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-[-0.02em] text-white uppercase flex items-center gap-4 flex-wrap leading-[1.1]">
        <span className="break-words bg-gradient-to-br from-white via-white to-neutral-300 bg-clip-text text-transparent">
          {title}
        </span>
        {active && (
          <div className="relative flex-shrink-0">
            <div className="w-3 h-3 sm:w-4 sm:h-4 bg-lime-400 rounded-full animate-pulse shadow-lg shadow-lime-400/50" />
            <div className="absolute inset-0 w-3 h-3 sm:w-4 sm:h-4 bg-lime-400/30 rounded-full animate-ping" />
          </div>
        )}
      </h2>
    </div>
    <div className="hidden sm:flex flex-col items-end text-right flex-shrink-0 space-y-1.5">
      <span className="text-[10px] text-neutral-500/70 font-mono tracking-wider uppercase">PROCESS_STATE</span>
      <div className="flex items-center gap-2">
        <span className={`text-sm font-black font-mono tracking-wider uppercase ${active ? 'text-lime-400' : 'text-neutral-400'}`}>
          {status}
        </span>
        {active && (
          <div className="w-1.5 h-1.5 bg-lime-400 rounded-full animate-pulse shadow-sm shadow-lime-400/50" />
        )}
      </div>
    </div>
  </div>
);

// --- GLOBAL NOTIFICATION SYSTEM ---
const NotificationContext = React.createContext<{
  notify: (msg: string, type?: 'ERROR' | 'SUCCESS' | 'INFO') => void;
}>({
  notify: () => {}
});

const NotificationProvider = ({ children }: { children: React.ReactNode }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const notify = useCallback((message: string, type: 'ERROR' | 'SUCCESS' | 'INFO' = 'INFO') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  }, []);

  return (
    <NotificationContext.Provider value={{ notify }}>
      {children}
      <div className="fixed bottom-20 sm:bottom-24 right-4 sm:right-8 z-[200] flex flex-col gap-2 pointer-events-none max-w-[calc(100vw-2rem)]">
        {toasts.map(toast => (
          <div 
            key={toast.id}
            className={`
              min-w-[240px] sm:min-w-[280px] max-w-full p-3 font-mono text-xs font-bold border-l-4 shadow-2xl backdrop-blur-md
              animate-in slide-in-from-right-full fade-in duration-300 pointer-events-auto
              hover:scale-[1.02] transition-transform
              ${toast.type === 'ERROR' ? 'bg-neutral-900/95 border-pink-500 text-pink-400' : ''}
              ${toast.type === 'SUCCESS' ? 'bg-neutral-900/95 border-lime-400 text-lime-400' : ''}
              ${toast.type === 'INFO' ? 'bg-neutral-900/95 border-cyan-400 text-cyan-400' : ''}
            `}
          >
            <div className="flex justify-between items-center mb-1 opacity-50 text-[10px]">
              <span>[{toast.type}]</span>
              <span>{new Date().toLocaleTimeString()}</span>
            </div>
            <div className="break-words">{toast.message}</div>
          </div>
        ))}
      </div>
    </NotificationContext.Provider>
  );
};

const useNotify = () => React.useContext(NotificationContext);

// --- SUB-VIEWS ---
const AnalyzeView = () => {
  const { notify } = useNotify();
  const [code, setCode] = useState(`function optimize_neural_net(data) {
  // CRITICAL: Memory leak potential
  const cache = new Map();
  
  return data.map(item => {
    if (cache.has(item.id)) {
      return cache.get(item.id);
    }
    const result = heavy_compute(item);
    cache.set(item.id, result);
    return result;
  });
}`);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState<AnalysisResult | null>(null);

  const analyzeMutation = trpc.analyzeCode.useMutation();

  const handleAnalysis = async () => {
    setIsAnalyzing(true);
    setResults(null);
    try {
      const data = await analyzeMutation.mutateAsync({
        code,
        language: "javascript",
      });
      setResults({
        complexity: data.complexity,
        security: data.security,
        performance: data.performance,
        issues: data.issues.map((issue: any, index: number) => ({
          id: index + 1,
          type: issue.type,
          text: issue.text,
        })),
      });
      notify("DIAGNOSTIC_COMPLETE", "SUCCESS");
    } catch (error: any) {
      notify(error.message || "Analysis failed", "ERROR");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const complexText = useScrambledText(results ? `${results.complexity}%` : '---', isAnalyzing, 3);
  const secureText = useScrambledText(results ? `${results.security}%` : '---', isAnalyzing, 3);
  const perfText = useScrambledText(results ? `${results.performance}%` : '---', isAnalyzing, 3);

  return (
    <div className="h-full flex flex-col p-5 sm:p-6 lg:p-8 animate-in fade-in duration-500 overflow-auto">
      <SectionHeader 
        title="System Diagnostic" 
        subtitle="MODULE: ANALYZER_CORE" 
        active={isAnalyzing} 
        status={isAnalyzing ? "SCANNING" : "READY"} 
      />

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 lg:gap-8 min-h-0">
        {/* Editor Area - Enhanced */}
        <div className="lg:col-span-7 flex flex-col gap-3 relative min-h-[300px] lg:min-h-0">
          <div className="flex justify-between items-center bg-gradient-to-r from-neutral-900/80 to-neutral-900/60 border border-neutral-800/60 p-3 px-4 backdrop-blur-sm rounded-t-lg">
             <span className="text-[11px] font-mono text-neutral-400 uppercase tracking-wider font-semibold">Input Source</span>
             <div className="flex items-center gap-2">
               <span className="text-[11px] font-mono text-lime-400/90 font-bold">JS/TS</span>
               <div className="w-2 h-2 bg-lime-400/50 rounded-full animate-pulse" />
             </div>
          </div>
          <div className="flex-1 bg-gradient-to-br from-neutral-950 via-neutral-900/50 to-neutral-950 border border-neutral-800/60 focus-within:border-lime-400/60 focus-within:shadow-lg focus-within:shadow-lime-400/10 transition-all duration-300 relative overflow-hidden group min-h-[200px] rounded-b-lg">
            {/* Subtle gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-lime-400/5 via-transparent to-transparent opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 pointer-events-none" />
            
            <textarea 
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className={`relative z-10 w-full h-full bg-transparent p-5 sm:p-6 font-mono text-xs sm:text-sm text-neutral-200 leading-relaxed resize-none focus:outline-none custom-scrollbar ${isAnalyzing ? 'opacity-30' : ''}`}
              spellCheck="false"
              disabled={isAnalyzing}
              style={{ textShadow: '0 0 1px rgba(255, 255, 255, 0.1)' }}
            />
            {isAnalyzing && (
               <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-15 animate-pulse pointer-events-none z-20" />
            )}
          </div>
        </div>

        {/* HUD Panel - Enhanced */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          {/* Metrics Grid - Enhanced Visual Appeal */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: 'COMPLEXITY', val: complexText, color: 'text-pink-400', border: 'border-pink-500/40', bg: 'from-pink-950/30 to-pink-900/10', glow: 'shadow-pink-500/20' },
              { label: 'SECURITY', val: secureText, color: 'text-cyan-400', border: 'border-cyan-500/40', bg: 'from-cyan-950/30 to-cyan-900/10', glow: 'shadow-cyan-500/20' },
              { label: 'EFFICIENCY', val: perfText, color: 'text-lime-400', border: 'border-lime-500/40', bg: 'from-lime-950/30 to-lime-900/10', glow: 'shadow-lime-500/20' }
            ].map((m) => (
              <div 
                key={m.label} 
                className={`relative bg-gradient-to-br ${m.bg} border ${m.border} p-4 sm:p-5 flex flex-col justify-between aspect-square hover:scale-105 hover:shadow-lg hover:${m.glow} transition-all duration-300 rounded-lg group overflow-hidden`}
              >
                {/* Subtle glow effect on hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${m.bg} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                
                <span className="relative z-10 text-[10px] sm:text-[11px] text-neutral-400 font-mono tracking-wider truncate uppercase font-semibold">{m.label}</span>
                <span className={`relative z-10 text-2xl sm:text-3xl lg:text-4xl font-black font-mono tracking-tighter ${m.color}`} style={{ textShadow: `0 0 20px currentColor` }}>
                  {m.val}
                </span>
                
                {/* Animated border on hover */}
                <div className={`absolute inset-0 border-2 ${m.border} rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none`} />
              </div>
            ))}
          </div>

          {/* Issues List - Enhanced */}
          <div className="flex-1 bg-gradient-to-br from-neutral-900/80 to-neutral-950/80 border border-neutral-800/60 p-4 sm:p-5 overflow-hidden flex flex-col min-h-[200px] rounded-lg backdrop-blur-sm">
             <div className="flex justify-between items-center mb-4 pb-3 border-b border-neutral-800/50">
               <span className="text-xs sm:text-sm font-black text-white uppercase tracking-wider">Detected Anomalies</span>
               <div className="flex items-center gap-2">
                 <Activity size={14} className={isAnalyzing ? "animate-spin text-lime-400" : "text-neutral-600"} />
                 {results && (
                   <span className="text-[10px] font-mono text-neutral-500">{results.issues.length} found</span>
                 )}
               </div>
             </div>
             
             <div className="flex-1 overflow-y-auto custom-scrollbar space-y-3 pr-2">
                {isAnalyzing ? (
                   <div className="text-center py-10 sm:py-12">
                      <div className="inline-flex items-center gap-2 text-lime-400 font-mono text-xs animate-pulse">
                        <Activity size={14} className="animate-spin" />
                        <span>DECRYPTING_SIGNALS...</span>
                      </div>
                   </div>
                ) : results ? (
                  results.issues.map((issue) => (
                    <div 
                      key={issue.id} 
                      className="group p-3 sm:p-4 bg-gradient-to-r from-neutral-950/90 to-neutral-950/70 border-l-4 border-neutral-700/50 hover:border-lime-400/60 transition-all duration-300 hover:bg-neutral-900/50 hover:shadow-lg hover:shadow-lime-400/5 rounded-r-lg"
                    >
                       <div className="flex items-center gap-2.5 mb-2">
                          {issue.type === 'CRITICAL' && <AlertTriangle size={14} className="text-pink-400 flex-shrink-0" style={{ filter: 'drop-shadow(0 0 4px currentColor)' }} />}
                          {issue.type === 'WARN' && <Shield size={14} className="text-yellow-400 flex-shrink-0" style={{ filter: 'drop-shadow(0 0 4px currentColor)' }} />}
                          {issue.type === 'INFO' && <Activity size={14} className="text-cyan-400 flex-shrink-0" style={{ filter: 'drop-shadow(0 0 4px currentColor)' }} />}
                          <span className={`text-[11px] font-black uppercase tracking-wider ${issue.type === 'CRITICAL' ? 'text-pink-400' : issue.type === 'WARN' ? 'text-yellow-400' : 'text-cyan-400'}`}>
                            {issue.type}
                          </span>
                       </div>
                       <p className="text-xs sm:text-sm text-neutral-300 font-mono leading-relaxed break-words">{issue.text}</p>
                    </div>
                  ))
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-neutral-600/50">
                    <div className="relative mb-4">
                      <Layers size={32} className="sm:w-10 sm:h-10 opacity-30" />
                      <div className="absolute inset-0 bg-lime-400/10 blur-xl" />
                    </div>
                    <span className="text-xs font-mono uppercase tracking-wider">AWAITING_INPUT</span>
                  </div>
                )}
             </div>
          </div>

          <button 
            onClick={handleAnalysis}
            disabled={isAnalyzing || !code.trim()}
            className="relative w-full py-4 sm:py-5 bg-gradient-to-r from-lime-400 to-lime-500 hover:from-lime-300 hover:to-lime-400 text-black font-black uppercase tracking-wider text-xs sm:text-sm transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2.5 hover:scale-[1.02] active:scale-[0.98] shadow-xl hover:shadow-2xl hover:shadow-lime-400/40 rounded-lg overflow-hidden group"
          >
            {/* Shimmer effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
            
            {isAnalyzing ? (
              <Activity size={18} className="animate-spin relative z-10" />
            ) : (
              <Zap size={18} className="relative z-10" style={{ filter: 'drop-shadow(0 0 4px rgba(0,0,0,0.3))' }} />
            )}
            <span className="relative z-10">{isAnalyzing ? 'Processing...' : 'Initiate Scan'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

const RefactorView = () => {
  const { notify } = useNotify();
  const [slider, setSlider] = useState(50);
  const [inputCode, setInputCode] = useState(`function sort(arr) {
  for(let i=0; i<arr.length; i++) {
    for(let j=0; j<arr.length; j++) {
      if(arr[i] < arr[j]) {
         let temp = arr[i];
         arr[i] = arr[j];
         arr[j] = temp;
      }
    }
  }
  return arr;
}`);
  const [outputCode, setOutputCode] = useState('');
  const [isMutating, setIsMutating] = useState(false);
  const [strategy, setStrategy] = useState('PERFORMANCE');
  const sliderIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isMutating) {
      sliderIntervalRef.current = setInterval(() => {
        setSlider(prev => {
          const change = Math.random() * 8 - 4;
          let newVal = prev + change;
          if (newVal < 30) newVal = 30;
          if (newVal > 70) newVal = 70;
          return newVal;
        });
      }, 100);
    } else {
      if (sliderIntervalRef.current) clearInterval(sliderIntervalRef.current);
      setSlider(50);
    }
    return () => {
      if (sliderIntervalRef.current) clearInterval(sliderIntervalRef.current);
    };
  }, [isMutating]);

  trpc.refactorCode.useSubscription(
    { code: inputCode, language: "javascript", strategy: strategy as "CLEAN" | "PERFORMANCE" | "SECURE" },
    {
      enabled: isMutating,
      onData: (data: { chunk: string; done: boolean }) => {
        if (!data.done) {
          setOutputCode((prev) => prev + data.chunk);
        } else {
          setIsMutating(false);
          notify("MUTATION_SUCCESSFUL", "SUCCESS");
        }
      },
      onError: () => {
        setIsMutating(false);
        notify("MUTATION_FAILED", "ERROR");
      },
    }
  );

  const handleRefactor = () => {
    setIsMutating(true);
    setOutputCode('');
  };

  return (
    <div className="h-full flex flex-col p-4 sm:p-6 lg:p-8 animate-in fade-in duration-500 overflow-auto">
      <SectionHeader 
        title="Mutation Engine" 
        subtitle="MODULE: REFACTOR_CORE" 
        active={isMutating} 
        status={isMutating ? "MUTATING" : "IDLE"} 
      />

      <div className="flex flex-wrap justify-end gap-2 mb-4">
        {['CLEAN', 'PERFORMANCE', 'SECURE'].map((s) => (
          <button 
            key={s}
            onClick={() => setStrategy(s)}
            disabled={isMutating}
            className={`px-3 sm:px-4 py-2 text-[10px] font-bold border font-mono transition-all duration-300 uppercase ${
              strategy === s 
                ? 'bg-cyan-400 text-black border-cyan-400 hover:bg-cyan-300' 
                : 'bg-transparent text-neutral-500 border-neutral-800 hover:border-neutral-600 hover:text-neutral-300'
            } disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 active:scale-95`}
          >
            {s}
          </button>
        ))}
      </div>

      <div className="flex-1 relative border border-neutral-800/60 bg-gradient-to-br from-neutral-950/90 to-neutral-900/70 overflow-hidden select-none group flex flex-col min-h-[400px] rounded-lg backdrop-blur-sm">
        {/* Diff Container */}
        <div className="relative flex-1 w-full h-full">
           {/* Right Side (After) - Enhanced */}
           <div className="absolute inset-0 bg-gradient-to-br from-cyan-950/20 to-neutral-900/40">
              <div className="absolute top-0 right-0 p-3 px-4 bg-gradient-to-r from-cyan-900/30 to-cyan-900/10 text-cyan-400 text-[11px] font-mono font-bold uppercase tracking-wider border-b border-l border-cyan-500/20 backdrop-blur-sm">
                PROPOSED_STATE
              </div>
              {outputCode ? (
                <pre className="p-5 sm:p-6 lg:p-8 font-mono text-xs sm:text-sm text-cyan-200/90 overflow-auto h-full custom-scrollbar whitespace-pre-wrap break-words leading-relaxed" style={{ textShadow: '0 0 1px rgba(6, 182, 212, 0.3)' }}>{outputCode}</pre>
              ) : (
                <div className="h-full flex items-center justify-center text-neutral-600 font-mono text-xs">
                   {isMutating ? (
                     <div className="flex items-center gap-3 text-lime-400">
                       <Activity size={16} className="animate-spin" />
                       <span className="animate-pulse">CALCULATING_OPTIMAL_PATH...</span>
                     </div>
                   ) : (
                     <span className="text-neutral-500">AWAITING_MUTATION</span>
                   )}
                </div>
              )}
           </div>

           {/* Left Side (Before) - Clipped - Enhanced */}
           <div 
             className="absolute inset-0 bg-gradient-to-br from-pink-950/30 to-neutral-950/80 border-r-2 border-lime-400/60 overflow-hidden transition-[width] ease-out duration-100 shadow-[4px_0_20px_rgba(163,230,53,0.15)]"
             style={{ width: `${slider}%` }}
           >
              <div className="absolute top-0 left-0 p-3 px-4 bg-gradient-to-r from-pink-900/30 to-pink-900/10 text-pink-400 text-[11px] font-mono font-bold uppercase tracking-wider border-b border-r border-pink-500/20 backdrop-blur-sm">
                CURRENT_STATE
              </div>
              <textarea 
                className="w-full h-full bg-transparent p-5 sm:p-6 lg:p-8 font-mono text-xs sm:text-sm text-pink-200/90 resize-none focus:outline-none custom-scrollbar whitespace-pre-wrap break-words leading-relaxed"
                value={inputCode}
                onChange={(e) => setInputCode(e.target.value)}
                disabled={isMutating}
                spellCheck="false"
                style={{ textShadow: '0 0 1px rgba(236, 72, 153, 0.3)' }}
              />
           </div>

           {/* Slider Handle */}
           <input 
              type="range" 
              min="0" 
              max="100" 
              value={slider} 
              onChange={(e) => setSlider(Number(e.target.value))}
              disabled={isMutating}
              className="absolute inset-0 w-full h-full opacity-0 cursor-col-resize z-30"
           />
           <div 
             className="absolute top-0 bottom-0 w-1 bg-gradient-to-b from-transparent via-lime-400 to-transparent z-20 pointer-events-none shadow-[0_0_20px_rgba(163,230,53,0.6)] transition-all duration-100"
             style={{ left: `${slider}%` }}
           >
             <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 bg-gradient-to-br from-neutral-950 to-black border-2 border-lime-400 text-lime-400 p-2 rounded-lg hover:scale-110 transition-transform shadow-xl shadow-lime-400/30 group">
               <Maximize2 size={12} className="sm:w-4 sm:h-4 -rotate-45 group-hover:rotate-0 transition-transform duration-300" />
             </div>
           </div>
        </div>
      </div>
      
      <div className="mt-4 flex flex-col sm:flex-row justify-end gap-3 sm:gap-4">
        {outputCode && (
           <button 
             onClick={() => {
               navigator.clipboard.writeText(outputCode); 
               notify("COPIED", "INFO");
             }} 
             className="flex items-center justify-center gap-2 text-neutral-500 hover:text-white transition-colors text-xs font-mono uppercase px-4 py-2 border border-neutral-800 hover:border-neutral-600 hover:bg-neutral-900"
           >
             <Copy size={14} /> Copy Buffer
           </button>
        )}
        <button 
          onClick={handleRefactor}
          disabled={isMutating || !inputCode.trim()}
          className="px-6 sm:px-8 py-2.5 sm:py-3 bg-cyan-400 hover:bg-cyan-300 text-black font-black font-mono uppercase text-xs sm:text-sm transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl hover:shadow-cyan-400/30"
        >
          {isMutating ? 'Mutating...' : 'Commit Mutation'}
        </button>
      </div>
    </div>
  );
};

const GenerateView = () => {
  const { notify } = useNotify();
  const [prompt, setPrompt] = useState('');
  const [output, setOutput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [displayedText, setDisplayedText] = useState('');

  useEffect(() => {
    if (output && !isGenerating) {
      let i = 0;
      const timer = setInterval(() => {
        setDisplayedText(output.substring(0, i));
        i++;
        if (i > output.length) clearInterval(timer);
      }, 10);
      return () => clearInterval(timer);
    } else if (!output) {
      setDisplayedText('');
    }
  }, [output, isGenerating]);

  trpc.generateCode.useSubscription(
    { prompt, language: "javascript" },
    {
      enabled: isGenerating,
      onData: (data: { chunk: string; done: boolean }) => {
        if (!data.done) {
          setOutput((prev) => prev + data.chunk);
        } else {
          setIsGenerating(false);
          notify("MANIFESTATION_COMPLETE", "SUCCESS");
        }
      },
      onError: () => {
        setIsGenerating(false);
        notify("Generation failed", "ERROR");
      },
    }
  );

  const handleGenerate = () => {
    if (!prompt.trim()) {
      notify("INPUT_REQUIRED", "ERROR");
      return;
    }
    setIsGenerating(true);
    setDisplayedText('');
    setOutput('');
  };

  return (
    <div className="h-full flex flex-col p-4 sm:p-6 lg:p-8 animate-in fade-in duration-500 overflow-auto">
      <SectionHeader 
        title="Manifestation" 
        subtitle="MODULE: GEN_AI" 
        active={isGenerating} 
        status={isGenerating ? "COMPILING" : "STANDBY"} 
      />

      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 lg:gap-8 min-h-0">
        {/* Input Column - Enhanced */}
        <div className="flex flex-col gap-3 sm:gap-4 h-full min-h-[300px]">
          <div className="bg-gradient-to-br from-neutral-900/90 to-neutral-950/90 border border-neutral-800/60 flex-1 flex flex-col relative group focus-within:border-lime-400/60 focus-within:shadow-lg focus-within:shadow-lime-400/10 transition-all duration-300 min-h-[250px] rounded-lg overflow-hidden backdrop-blur-sm">
            <div className="p-3 border-b border-neutral-800/50 bg-gradient-to-r from-neutral-950/80 to-neutral-900/60 flex justify-between items-center backdrop-blur-sm">
              <span className="text-[11px] font-mono text-neutral-400 uppercase tracking-wider font-semibold">DIRECTIVE_INPUT</span>
              <Terminal size={14} className="text-neutral-500" />
            </div>
            <textarea 
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="w-full h-full bg-transparent p-5 sm:p-6 text-base sm:text-xl font-bold text-white focus:outline-none resize-none custom-scrollbar placeholder:text-neutral-600 leading-relaxed"
              placeholder="Describe system architecture..."
              disabled={isGenerating}
              style={{ textShadow: '0 0 1px rgba(255, 255, 255, 0.1)' }}
            />
            {/* Subtle gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-lime-400/5 via-transparent to-transparent opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 pointer-events-none" />
            
            <div className="absolute bottom-4 sm:bottom-5 right-4 sm:right-5">
              <button 
                onClick={handleGenerate}
                disabled={isGenerating || !prompt.trim()}
                className="relative w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-lime-400 to-lime-500 text-black flex items-center justify-center hover:scale-110 active:scale-95 transition-transform duration-300 disabled:bg-neutral-800 disabled:text-neutral-600 disabled:cursor-not-allowed shadow-xl hover:shadow-2xl hover:shadow-lime-400/40 rounded-lg overflow-hidden group/btn"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-lime-300 to-lime-400 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300" />
                {isGenerating ? (
                  <Activity className="animate-spin relative z-10" size={20} />
                ) : (
                  <ArrowRight size={20} className="relative z-10" style={{ filter: 'drop-shadow(0 0 4px rgba(0,0,0,0.3))' }} />
                )}
              </button>
            </div>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {['React', 'Rust', 'Python', 'Go'].map((lang) => (
              <button 
                key={lang} 
                className="border border-neutral-800 py-2 text-neutral-500 font-mono text-[10px] hover:border-cyan-400 hover:text-cyan-400 transition-colors duration-300 uppercase disabled:opacity-50 hover:scale-105 active:scale-95"
              >
                {lang}
              </button>
            ))}
          </div>
        </div>

        {/* Output Column - Enhanced */}
        <div className="bg-gradient-to-br from-black to-neutral-950 border border-neutral-800/60 relative flex flex-col min-h-[300px] rounded-lg overflow-hidden backdrop-blur-sm">
          <div className="flex items-center gap-3 p-3 border-b border-neutral-800/50 bg-gradient-to-r from-neutral-900/60 to-neutral-900/40 backdrop-blur-sm">
             <div className="flex gap-1.5 ml-2">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500/30 border border-red-500/20" />
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/30 border border-yellow-500/20" />
                <div className="w-2.5 h-2.5 rounded-full bg-green-500/30 border border-green-500/20" />
             </div>
             <div className="ml-2 sm:ml-4 text-[11px] font-mono text-neutral-400 uppercase tracking-wider font-semibold">output.tsx</div>
          </div>
          
          <div className="flex-1 overflow-auto custom-scrollbar p-5 sm:p-6 font-mono text-xs sm:text-sm relative min-h-[200px]">
            {displayedText || isGenerating ? (
              <>
                <pre className="text-cyan-300/95 whitespace-pre-wrap leading-relaxed break-words" style={{ textShadow: '0 0 1px rgba(6, 182, 212, 0.3)' }}>{displayedText}</pre>
                {isGenerating && <span className="inline-block w-2 h-5 bg-lime-400 animate-pulse ml-1 align-middle shadow-lg shadow-lime-400/50"/>}
              </>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-neutral-700/50 select-none">
                 <div className="relative mb-5">
                   <Cpu size={40} className="sm:w-14 sm:h-14 opacity-20" />
                   <div className="absolute inset-0 bg-cyan-400/10 blur-xl" />
                 </div>
                 <p className="text-xs font-mono uppercase tracking-widest text-neutral-500">Awaiting Manifestation</p>
              </div>
            )}
            
            {!isGenerating && displayedText && (
               <button 
                 onClick={() => {
                   navigator.clipboard.writeText(output); 
                   notify("COPIED", "INFO");
                 }}
                 className="absolute top-4 sm:top-5 right-4 sm:right-5 p-2.5 hover:bg-neutral-800/80 rounded-lg text-neutral-400 hover:text-white transition-all duration-300 hover:scale-110 active:scale-95 border border-neutral-800/50 hover:border-neutral-700 hover:shadow-lg"
               >
                 <Copy size={16} />
               </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const ChatHistory = ({ messages, isTyping, currentMessage }: { messages: ChatMessage[]; isTyping: boolean; currentMessage: string }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  return (
    <div className="h-full flex flex-col p-4 sm:p-6 lg:p-8 animate-in fade-in duration-500 overflow-auto">
      <SectionHeader 
        title="Neural Link" 
        subtitle="MODULE: COMMS_UPLINK" 
        active={isTyping} 
        status={isTyping ? "RECEIVING" : "CONNECTED"} 
      />
      
      <div className="flex-1 border-t border-neutral-800/50 overflow-hidden relative min-h-[400px] rounded-lg bg-gradient-to-br from-neutral-950/50 to-black/50 backdrop-blur-sm">
        {/* Background Grid - Enhanced */}
        <div className="absolute inset-0 grid grid-cols-[repeat(auto-fill,minmax(30px,1fr))] sm:grid-cols-[repeat(auto-fill,minmax(40px,1fr))] grid-rows-[repeat(auto-fill,minmax(30px,1fr))] sm:grid-rows-[repeat(auto-fill,minmax(40px,1fr))] opacity-[0.03] pointer-events-none">
           {[...Array(100)].map((_,i) => <div key={i} className="border-[0.5px] border-neutral-700" />)}
        </div>
        
        {/* Subtle gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-lime-400/5 via-transparent to-transparent pointer-events-none" />

        <div className="h-full overflow-y-auto custom-scrollbar p-4 sm:p-5 lg:p-6 space-y-5 sm:space-y-6 relative z-10" ref={scrollRef}>
          {messages.map((msg, i) => (
            <div 
              key={i} 
              className={`flex flex-col gap-2 max-w-[85%] sm:max-w-2xl ${msg.role === 'USR' ? 'self-end items-end ml-auto' : 'items-start mr-auto'} animate-in fade-in`}
            >
              <div className="flex items-center gap-2.5 mb-1 flex-wrap">
                <span className={`text-[11px] font-mono font-black px-2 py-1 rounded uppercase tracking-wider ${
                  msg.role === 'USR' 
                    ? 'bg-gradient-to-r from-cyan-900/60 to-cyan-900/40 text-cyan-300 border border-cyan-500/30' 
                    : 'bg-gradient-to-r from-pink-900/60 to-pink-900/40 text-pink-300 border border-pink-500/30'
                }`}>
                  {msg.role}
                </span>
                <span className="text-[10px] font-mono text-neutral-500">{msg.timestamp.toLocaleTimeString()}</span>
              </div>
              <div className={`font-mono text-sm sm:text-base leading-relaxed p-4 sm:p-5 border-l-4 break-words rounded-r-lg shadow-lg ${
                  msg.role === 'USR' 
                    ? 'border-cyan-400/60 bg-gradient-to-r from-cyan-950/30 via-cyan-950/20 to-transparent text-cyan-100' 
                    : 'border-pink-400/60 bg-gradient-to-r from-pink-950/30 via-pink-950/20 to-transparent text-pink-100'
                }`}
                style={{ textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)' }}
              >
                {msg.text}
              </div>
            </div>
          ))}
          {isTyping && (
             <div className="flex flex-col gap-2 items-start animate-in fade-in">
               <span className="text-[11px] font-mono font-black px-2 py-1 rounded uppercase tracking-wider bg-gradient-to-r from-pink-900/60 to-pink-900/40 text-pink-300 border border-pink-500/30">SYS</span>
               <div className="px-5 py-4 bg-gradient-to-r from-pink-500/10 to-pink-500/5 border-l-4 border-pink-400/50 rounded-r-lg shadow-lg min-h-[3rem]">
                 {currentMessage ? (
                   <div className="text-sm text-pink-100 font-mono leading-relaxed break-words">{currentMessage}</div>
                 ) : (
                   <div className="flex items-center gap-2">
                     <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce shadow-lg shadow-pink-400/50" style={{animationDelay: '0ms'}}></div>
                     <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce shadow-lg shadow-pink-400/50" style={{animationDelay: '100ms'}}></div>
                     <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce shadow-lg shadow-pink-400/50" style={{animationDelay: '200ms'}}></div>
                   </div>
                 )}
               </div>
             </div>
          )}
        </div>
      </div>
    </div>
  );
};

// --- PERSISTENT COMMAND BAR - Enhanced ---
const CommandBar = ({ 
  input, 
  setInput, 
  handleSend, 
  isTyping 
}: { 
  input: string; 
  setInput: (val: string) => void; 
  handleSend: () => void; 
  isTyping: boolean;
}) => {
  return (
    <div className="absolute bottom-0 left-0 right-0 h-16 sm:h-18 bg-gradient-to-t from-black via-neutral-950 to-neutral-950/95 border-t border-neutral-800/60 z-40 flex items-center px-4 sm:px-5 lg:px-6 gap-3 sm:gap-4 backdrop-blur-sm">
      {/* Subtle top gradient */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-lime-400/20 to-transparent" />
      
      <div className="hidden sm:flex items-center gap-2.5 text-lime-400/90 select-none flex-shrink-0">
        <Terminal size={16} className="sm:w-5 sm:h-5" style={{ filter: 'drop-shadow(0 0 4px currentColor)' }} />
        <span className="font-mono text-xs font-black tracking-wider uppercase">COMMAND:</span>
      </div>
      
      <div className="flex-1 relative group min-w-0">
        <input 
          type="text" 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
          className="w-full bg-gradient-to-r from-neutral-900/90 to-neutral-900/70 border border-neutral-800/60 text-white font-mono text-xs sm:text-sm px-4 sm:px-5 py-3 focus:outline-none focus:border-lime-400/60 focus:bg-neutral-900 focus:shadow-lg focus:shadow-lime-400/10 transition-all duration-300 placeholder:text-neutral-600 rounded-lg"
          placeholder="Enter system query or command..." 
          disabled={isTyping}
        />
        <div className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 flex items-center gap-2 pointer-events-none">
           {isTyping && <Activity size={14} className="sm:w-4 sm:h-4 text-lime-400 animate-spin" style={{ filter: 'drop-shadow(0 0 4px currentColor)' }} />}
           {!isTyping && <span className="text-[10px] sm:text-[11px] text-neutral-500 font-mono hidden md:block tracking-wider">ENTER TO SEND</span>}
        </div>
      </div>

      <div className="hidden lg:flex gap-5 border-l border-neutral-800/60 pl-5 flex-shrink-0">
        <div className="flex flex-col items-end gap-0.5">
          <span className="text-[10px] font-mono text-neutral-500/70 uppercase tracking-wider">UPTIME</span>
          <span className="text-xs font-black font-mono text-white">00:42:12</span>
        </div>
        <div className="flex flex-col items-end gap-0.5">
          <span className="text-[10px] font-mono text-neutral-500/70 uppercase tracking-wider">NET</span>
          <span className="text-xs font-black font-mono text-cyan-400" style={{ textShadow: '0 0 8px currentColor' }}>SECURE</span>
        </div>
      </div>
    </div>
  );
};

// --- BOOT SEQUENCE ---
const BootScreen = ({ onComplete }: { onComplete: () => void }) => {
  const [lines, setLines] = useState<string[]>([]);
  
  useEffect(() => {
    const bootText = [
      "INITIALIZING KERNEL...",
      "LOADING NEURAL MODULES...",
      "MOUNTING VIRTUAL DOM...",
      "ESTABLISHING SECURE UPLINK...",
      "SYSTEM READY."
    ];
    let delay = 0;
    bootText.forEach((line, index) => {
      delay += Math.random() * 300 + 100;
      setTimeout(() => {
        setLines(prev => [...prev, line]);
        if (index === bootText.length - 1) setTimeout(onComplete, 800);
      }, delay);
    });
  }, [onComplete]);

  return (
    <div className="fixed inset-0 bg-black z-[9999] flex flex-col items-center justify-center font-mono text-lime-400 p-4 sm:p-8 select-none">
      <div className="w-full max-w-md border border-neutral-800 p-6 sm:p-8 bg-neutral-950">
        <div className="flex justify-between border-b border-neutral-800 pb-2 mb-4">
           <span className="text-xs sm:text-sm">BOOT_SEQUENCE</span>
           <span className="text-xs sm:text-sm">v2.0.4</span>
        </div>
        {lines.map((line, i) => (
          <div key={i} className="mb-1 text-xs sm:text-sm opacity-80">{`> ${line}`}</div>
        ))}
        <div className="animate-pulse mt-2 text-lime-500">_</div>
      </div>
    </div>
  );
};

// --- MAIN LAYOUT ---
const App = () => {
  const { notify } = useNotify();
  const [activeTab, setActiveTab] = useState<'ANALYZE' | 'REFACTOR' | 'GENERATE' | 'CHAT'>('ANALYZE');
  const [booted, setBooted] = useState(false);
  
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'SYS', text: 'NEURAL LINK ESTABLISHED. WAITING FOR COMMAND.', timestamp: new Date() }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [currentMessage, setCurrentMessage] = useState('');
  const [pendingMessage, setPendingMessage] = useState('');

  trpc.chat.useSubscription(
    { 
      message: pendingMessage, 
      history: messages.slice(0, -1).map(m => ({
        role: m.role === 'USR' ? 'user' as const : 'assistant' as const,
        content: m.text,
      }))
    },
    {
      enabled: isTyping && !!pendingMessage,
      onData: (data: { chunk: string; done: boolean }) => {
        if (!data.done) {
          setCurrentMessage((prev) => prev + data.chunk);
        } else {
          setMessages((prev) => [
            ...prev,
            { role: 'SYS', text: currentMessage, timestamp: new Date() }
          ]);
          setCurrentMessage('');
          setPendingMessage('');
          setIsTyping(false);
        }
      },
      onError: () => {
        setIsTyping(false);
        setPendingMessage('');
        notify("CONNECTION_LOST", "ERROR");
        setMessages(prev => [...prev, { role: 'SYS', text: "ERR: CONNECTION_LOST", timestamp: new Date() }]);
      },
    }
  );

  const handleSend = () => {
    if (!input.trim() || isTyping) return;
    const newMsg: ChatMessage = { role: 'USR', text: input, timestamp: new Date() };
    setMessages(prev => [...prev, newMsg]);
    setPendingMessage(input);
    setInput('');
    setIsTyping(true);
    setCurrentMessage('');
  };

  const tabs = [
    { id: 'ANALYZE' as const, icon: Activity },
    { id: 'REFACTOR' as const, icon: Cpu },
    { id: 'GENERATE' as const, icon: Zap },
    { id: 'CHAT' as const, icon: MessageSquare },
  ];

  if (!booted) return <BootScreen onComplete={() => setBooted(true)} />;

  return (
    <>
      <style>{`
        .writing-vertical-rl { writing-mode: vertical-rl; text-orientation: mixed; }
        .custom-scrollbar::-webkit-scrollbar { width: 6px; height: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: #000; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background-color: #333; border-radius: 3px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background-color: #a3e635; }
        @keyframes slide-in-from-right-full {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        .animate-in {
          animation: slide-in-from-right-full 0.3s ease-out;
        }
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .fade-in {
          animation: fade-in 0.5s ease-out;
        }
      `}</style>
      
      <NotificationProvider>
        <div className="bg-neutral-950 min-h-screen text-white font-sans selection:bg-lime-400 selection:text-black overflow-hidden flex">
          <GrainOverlay />
          
          {/* SIDEBAR - Enhanced */}
          <nav className="relative w-14 sm:w-16 md:w-20 border-r border-neutral-800/60 bg-gradient-to-b from-black via-neutral-950 to-black z-30 flex flex-col justify-between py-5 sm:py-6 shrink-0">
             {/* Subtle gradient accent */}
             <div className="absolute right-0 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-lime-400/20 to-transparent" />
             
             <div className="flex flex-col items-center gap-5 sm:gap-6">
                <div className="relative w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-lime-400 to-lime-500 rounded-lg flex items-center justify-center mb-2 sm:mb-4 shadow-[0_0_20px_rgba(163,230,53,0.5)] hover:scale-110 hover:shadow-[0_0_30px_rgba(163,230,53,0.7)] transition-all duration-300 group">
                   <Terminal size={18} className="sm:w-6 sm:h-6 text-black relative z-10" />
                   <div className="absolute inset-0 bg-gradient-to-br from-lime-300 to-lime-400 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                {tabs.map((tab) => {
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`relative w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center rounded-lg transition-all duration-300 group ${
                        isActive 
                          ? 'bg-gradient-to-br from-neutral-800/80 to-neutral-900/80 text-lime-400 scale-110 shadow-lg shadow-lime-400/20' 
                          : 'text-neutral-500 hover:text-white hover:bg-neutral-900/50'
                      } hover:scale-105 active:scale-95`}
                    >
                      {/* Active glow effect */}
                      {isActive && (
                        <div className="absolute inset-0 bg-gradient-to-br from-lime-400/10 to-transparent rounded-lg" />
                      )}
                      
                      <tab.icon 
                        size={20} 
                        className={`sm:w-6 sm:h-6 relative z-10 transition-all duration-300 ${
                          isActive ? 'drop-shadow-[0_0_8px_rgba(163,230,53,0.6)]' : ''
                        }`}
                      />
                      
                      {/* Tooltip */}
                      <div className="absolute left-full ml-4 sm:ml-5 bg-gradient-to-br from-neutral-900 to-neutral-950 border border-neutral-800/80 px-3 py-2 text-[11px] font-mono tracking-wider opacity-0 group-hover:opacity-100 transition-all duration-300 z-50 pointer-events-none whitespace-nowrap uppercase shadow-2xl backdrop-blur-sm rounded-lg">
                        {tab.id}
                        <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-neutral-900"></div>
                      </div>
                      
                      {/* Active indicator */}
                      {isActive && (
                        <div className="absolute left-0 top-3 bottom-3 w-1 bg-gradient-to-b from-lime-400 to-lime-500 shadow-lg shadow-lime-400/50 rounded-r-full" />
                      )}
                    </button>
                  );
                })}
             </div>
             
             <div className="flex flex-col items-center gap-4 sm:gap-5">
                <div className="w-px h-8 sm:h-10 bg-gradient-to-b from-transparent via-neutral-800 to-transparent" />
                <div className="relative">
                  <div className="w-2.5 h-2.5 rounded-full bg-gradient-to-br from-green-400 to-green-500 animate-pulse shadow-lg shadow-green-500/50" />
                  <div className="absolute inset-0 w-2.5 h-2.5 rounded-full bg-green-500/30 animate-ping" />
                </div>
             </div>
          </nav>

          {/* MAIN CANVAS */}
          <main className="flex-1 relative flex flex-col min-w-0 overflow-hidden">
             {/* Dynamic Content Area (Above Footer) */}
             <div className="flex-1 relative overflow-hidden bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-neutral-900/50 via-neutral-950 to-neutral-950">
                {/* Background Grid */}
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-5 mix-blend-overlay pointer-events-none" />
                <div className="absolute inset-0 grid grid-cols-[repeat(auto-fill,minmax(80px,1fr))] sm:grid-cols-[repeat(auto-fill,minmax(100px,1fr))] opacity-[0.03] pointer-events-none">
                    {[...Array(50)].map((_,i) => <div key={i} className="border-r border-neutral-100" />)}
                </div>

                <div className="absolute inset-0 overflow-y-auto custom-scrollbar pb-14 sm:pb-16 lg:pb-20">
                   {activeTab === 'ANALYZE' && <AnalyzeView />}
                   {activeTab === 'REFACTOR' && <RefactorView />}
                   {activeTab === 'GENERATE' && <GenerateView />}
                   {activeTab === 'CHAT' && <ChatHistory messages={messages} isTyping={isTyping} currentMessage={currentMessage} />}
                </div>
             </div>

             {/* Persistent Command Footer */}
             <CommandBar 
               input={input} 
               setInput={setInput} 
               handleSend={handleSend} 
               isTyping={isTyping} 
             />
          </main>
        </div>
      </NotificationProvider>
    </>
  );
};

export default App;
