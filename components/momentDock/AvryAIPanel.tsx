
import React, { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Cpu, RefreshCcw, X, Loader2, ArrowUp, Copy, Check } from 'lucide-react';
import { GeminiService } from '../../services/gemini';
import { Message, DesktopLayout } from '../../types';
import { useOSStore } from '../../store/osStore';
import { useSphereStore } from '../../store/sphereStore';

interface AvryAIPanelProps {
  onClose: () => void;
}

export const AvryAIPanel: React.FC<AvryAIPanelProps> = ({ onClose }) => {
  const { theme } = useOSStore();
  const { layout } = useSphereStore();
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', content: "SYSTEM ONLINE. I am Avry AI. How can I assist you?", timestamp: new Date() }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const isUnity = layout === DesktopLayout.UNITY;
  const isDark = theme === 'dark';

  const panelBg = isDark ? 'bg-zinc-900/80 border-white/10' : 'bg-white/80 border-white/40';
  const textPrimary = isDark ? 'text-white' : 'text-zinc-900';
  const textSecondary = isDark ? 'text-zinc-400' : 'text-zinc-600';
  const iconColor = isDark ? 'text-zinc-400' : 'text-zinc-500';
  const hoverColor = isDark ? 'hover:text-white' : 'hover:text-black';
  const headerBg = isDark ? 'bg-black/40 border-zinc-800' : 'bg-white/40 border-white/20';
  
  const userMsgBg = isDark ? 'bg-zinc-800 border-zinc-700 text-zinc-100' : 'bg-white/90 border-white/50 text-zinc-800 shadow-sm';
  const aiMsgText = isDark ? 'text-zinc-100' : 'text-zinc-900';

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: 'user', content: input, timestamp: new Date() };
    const initialAiMessage: Message = { role: 'model', content: '', timestamp: new Date() };
    
    setMessages(prev => [...prev, userMessage, initialAiMessage]);
    const currentInput = input;
    setInput('');
    setIsLoading(true);

    try {
      const gemini = GeminiService.getInstance();
      const history = messages.map(m => ({
        role: m.role,
        parts: [{ text: m.content }]
      }));

      let accumulatedContent = '';
      const stream = gemini.generateChatStream(currentInput, history);

      for await (const chunk of stream) {
        accumulatedContent += chunk;
        setMessages(prev => {
          const newMessages = [...prev];
          const lastIdx = newMessages.length - 1;
          newMessages[lastIdx] = { ...newMessages[lastIdx], content: accumulatedContent };
          return newMessages;
        });
      }
    } catch (err) {
      console.error('Avry AI Link Error:', err);
      setMessages(prev => {
        const newMessages = [...prev];
        const lastIdx = newMessages.length - 1;
        newMessages[lastIdx] = { ...newMessages[lastIdx], content: "ERROR: NEURAL LINK INTERRUPTED." };
        return newMessages;
      });
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedId(index);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className={`
      flex flex-col border z-[3000] shadow-[20px_0_60px_rgba(0,0,0,0.5)] rounded-[2rem] overflow-hidden backdrop-blur-3xl
      ${panelBg}
      ${isUnity 
        ? 'fixed left-20 top-12 bottom-4 w-[420px] animate-in slide-in-from-left duration-300' 
        : 'fixed bottom-28 left-1/2 translate-x-[240px] w-[400px] h-[600px] max-h-[80vh] animate-in slide-in-from-bottom-10 zoom-in-95 duration-300 origin-bottom'
      }
    `}>
      {/* Header */}
      <div className={`h-14 px-5 border-b flex items-center justify-between backdrop-blur-xl ${headerBg}`}>
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-600/10">
            <Cpu size={16} className="text-white" />
          </div>
          <span className={`text-sm font-bold ${textPrimary}`}>Avry AI Assistant</span>
        </div>
        <div className="flex items-center gap-1">
          <button 
            onClick={() => setMessages([{ role: 'model', content: "System rebooted. Memory cleared.", timestamp: new Date() }])} 
            className={`p-2 transition-colors ${iconColor} ${hoverColor}`}
          >
            <RefreshCcw size={13} />
          </button>
          <button onClick={onClose} className={`p-2 transition-colors ${iconColor} ${hoverColor}`}>
            <X size={16} />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-5 space-y-10 no-scrollbar">
        {messages.map((m, i) => (
          <div key={i} className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start animate-in fade-in slide-in-from-bottom-1'}`}>
            {m.role === 'model' && (
              <div className="flex items-center gap-2 mb-2">
                <Cpu size={10} className="text-blue-500" />
                <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Avry Core</span>
              </div>
            )}
            
            <div className={`
              w-full group relative
              ${m.role === 'user' 
                ? `max-w-[85%] border p-3.5 rounded-2xl text-[13px] leading-relaxed shadow-sm ${userMsgBg}` 
                : `text-[13px] leading-relaxed ${aiMsgText}`}
            `}>
              {m.role === 'model' ? (
                <div className={`prose max-w-none ${isDark ? 'prose-invert' : 'prose-zinc'}`}>
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {m.content || '...'}
                  </ReactMarkdown>
                  {isLoading && !m.content && (
                    <div className="flex gap-1 py-1">
                      <div className="w-1 h-1 bg-blue-500 rounded-full animate-pulse" />
                      <div className="w-1 h-1 bg-blue-500 rounded-full animate-pulse [animation-delay:200ms]" />
                      <div className="w-1 h-1 bg-blue-500 rounded-full animate-pulse [animation-delay:400ms]" />
                    </div>
                  )}
                </div>
              ) : (
                <p className="whitespace-pre-wrap">{m.content}</p>
              )}
              
              <div className={`mt-2 flex opacity-0 group-hover:opacity-100 transition-opacity ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <button 
                  onClick={() => copyToClipboard(m.content, i)}
                  className={`text-xs font-bold transition-colors flex items-center gap-1 ${iconColor} ${hoverColor}`}
                >
                  {copiedId === i ? <Check size={10} className="text-emerald-500" /> : <Copy size={10} />}
                  {copiedId === i ? 'Copied' : 'Copy'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Input */}
      <div className={`p-5 pb-6 ${isDark ? 'bg-gradient-to-t from-zinc-950/80 to-transparent' : 'bg-gradient-to-t from-white/80 to-transparent'}`}>
        <form onSubmit={handleSend} className={`relative border rounded-2xl p-1 transition-all shadow-xl backdrop-blur-md ${isDark ? 'bg-zinc-900/80 border-zinc-800 focus-within:border-zinc-700' : 'bg-white/80 border-white/40 focus-within:border-white/60'}`}>
          <textarea 
            autoFocus
            rows={1}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder="Ask anything..."
            className={`w-full bg-transparent px-4 py-3 text-[13px] outline-none resize-none max-h-32 ${isDark ? 'text-white placeholder:text-zinc-600' : 'text-zinc-900 placeholder:text-zinc-400'}`}
          />
          <div className="absolute right-2 bottom-2">
            <button 
              type="submit"
              disabled={isLoading || !input.trim()}
              className={`w-8 h-8 transition-all flex items-center justify-center rounded-lg active:scale-95 ${isDark ? 'bg-white hover:bg-zinc-200 disabled:bg-zinc-800 disabled:text-zinc-700 text-black' : 'bg-black hover:bg-zinc-800 disabled:bg-zinc-200 disabled:text-zinc-400 text-white'}`}
            >
              {isLoading ? <Loader2 size={14} className="animate-spin" /> : <ArrowUp size={16} strokeWidth={3} />}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
