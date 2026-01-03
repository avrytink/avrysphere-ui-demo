
import React, { useState, useRef, useEffect } from 'react';
import { Cpu, RefreshCcw, Check, Copy, Loader2, ArrowUp } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { GeminiService } from '../../services/gemini';
import { Message } from '../../types';
import { useOSStore } from '../../store/osStore';
import { useTheme } from '../../components/Window';
import { useDockStore } from '../../store/dockStore';

export const AvryAI: React.FC = () => {
  const theme = useTheme();
  const { accentColor } = useOSStore();
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', content: "Hello! I'm Avry AI, the intelligence core for your system. How can I help you today?", timestamp: new Date() }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg: Message = { role: 'user', content: input, timestamp: new Date() };
    const initialAiMsg: Message = { role: 'model', content: '', timestamp: new Date() };
    
    setMessages(prev => [...prev, userMsg, initialAiMsg]);
    const currentInput = input;
    setInput('');
    setIsLoading(true);

    try {
      const gemini = GeminiService.getInstance();
      const history = messages.slice(0, -1).map(m => ({
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
    } catch (error) {
      console.error('Avry AI Error:', error);
      setMessages(prev => {
        const newMessages = [...prev];
        const lastIdx = newMessages.length - 1;
        newMessages[lastIdx] = { 
          ...newMessages[lastIdx], 
          content: "Sorry, I encountered an error connecting to the neural link. Please check your system configuration." 
        };
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

  const isDark = theme === 'dark';

  return (
    <div className={`h-full flex flex-col font-sans ${isDark ? 'bg-zinc-950' : 'bg-slate-50'}`}>
      {/* Header */}
      <div className={`h-14 px-6 border-b flex items-center justify-between backdrop-blur-md ${isDark ? 'border-zinc-900 bg-zinc-950/50' : 'border-zinc-200 bg-white/50'}`}>
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center shadow-[0_0_15px_rgba(59,130,246,0.2)]">
            <Cpu size={16} className="text-white" />
          </div>
          <div>
            <h2 className={`text-xs font-bold tracking-tight ${isDark ? 'text-white' : 'text-zinc-900'}`}>Avry AI</h2>
            <p className="text-[10px] text-zinc-500 font-medium">System Core v1.0</p>
          </div>
        </div>
        <button 
          onClick={() => setMessages([{ role: 'model', content: "Conversation reset. How can I help?", timestamp: new Date() }])}
          className={`p-2 text-zinc-500 transition-colors ${isDark ? 'hover:text-white' : 'hover:text-zinc-900'}`}
        >
          <RefreshCcw size={14} />
        </button>
      </div>

      {/* Message Area */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-12 no-scrollbar">
        <div className="max-w-3xl mx-auto w-full space-y-12">
          {messages.map((m, i) => (
            <div key={i} className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start animate-in fade-in slide-in-from-bottom-2 duration-500'}`}>
              
              {/* Role Header for AI */}
              {m.role === 'model' && (
                <div className="flex items-center gap-3 mb-3">
                  <div className={`w-6 h-6 rounded-md border flex items-center justify-center ${isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200 shadow-sm'}`}>
                    <Cpu size={12} className="text-blue-500" />
                  </div>
                  <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest">Avry AI</span>
                </div>
              )}

              {/* Message Content */}
              <div className={`
                w-full group relative
                ${m.role === 'user' 
                  ? `max-w-[80%] border p-4 rounded-2xl text-sm leading-relaxed shadow-sm ${isDark ? 'bg-zinc-900 border-zinc-800 text-zinc-200' : 'bg-white border-zinc-200 text-zinc-800'}` 
                  : `text-sm leading-relaxed ${isDark ? 'text-zinc-100' : 'text-zinc-800'}`}
              `}>
                {m.role === 'model' ? (
                  <div className={`prose max-w-none ${isDark ? 'prose-invert' : 'prose-zinc'}`}>
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {m.content || '...'}
                    </ReactMarkdown>
                    {isLoading && !m.content && (
                      <div className="flex gap-1.5 py-2">
                        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" />
                        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce [animation-delay:200ms]" />
                        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce [animation-delay:400ms]" />
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="whitespace-pre-wrap">{m.content}</p>
                )}

                {/* Interaction Bar */}
                <div className={`
                  mt-4 flex items-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity
                  ${m.role === 'user' ? 'justify-end' : 'justify-start'}
                `}>
                  <button 
                    onClick={() => copyToClipboard(m.content, i)}
                    className={`p-1.5 transition-colors flex items-center gap-1.5 ${isDark ? 'text-zinc-600 hover:text-zinc-300' : 'text-zinc-400 hover:text-zinc-700'}`}
                  >
                    {copiedId === i ? <Check size={12} className="text-emerald-500" /> : <Copy size={12} />}
                    <span className="text-[9px] font-bold uppercase tracking-widest">{copiedId === i ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Input Area */}
      <div className="p-6 pb-10">
        <div className="max-w-3xl mx-auto relative group">
          <form 
            onSubmit={(e) => { e.preventDefault(); handleSend(); }}
            className={`relative border rounded-2xl p-1 shadow-2xl transition-all ${isDark ? 'bg-zinc-900 border-zinc-800 focus-within:border-zinc-700' : 'bg-white border-zinc-200 focus-within:border-zinc-300'}`}
          >
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
              placeholder="Message Avry AI..."
              className={`w-full bg-transparent px-5 py-4 text-sm outline-none resize-none min-h-[56px] max-h-[200px] ${isDark ? 'text-white placeholder:text-zinc-600' : 'text-zinc-900 placeholder:text-zinc-400'}`}
            />
            <div className="absolute right-2 bottom-2">
              <button 
                type="submit"
                disabled={isLoading || !input.trim()}
                className={`w-10 h-10 transition-all flex items-center justify-center rounded-xl shadow-lg active:scale-95 ${isDark ? 'bg-white hover:bg-zinc-200 disabled:bg-zinc-800 disabled:text-zinc-600 text-black' : 'bg-black hover:bg-zinc-800 disabled:bg-zinc-100 disabled:text-zinc-300 text-white'}`}
              >
                {isLoading ? <Loader2 size={18} className="animate-spin" /> : <ArrowUp size={20} strokeWidth={2.5} />}
              </button>
            </div>
          </form>
          <p className="mt-3 text-center text-[10px] text-zinc-500 font-medium">
            Avry AI can make mistakes. Check important info.
          </p>
        </div>
      </div>

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
};
