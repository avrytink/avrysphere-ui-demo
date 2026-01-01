import React, { useState, useRef, useEffect } from 'react';
import { GeminiService } from '../../services/gemini';
import { Message } from '../../types';
import { Send, Bot, User, Loader2, Sparkles, RefreshCcw, Cpu, Command } from 'lucide-react';

export const GeminiChat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', content: "SYSTEM ONLINE. I am Avry AI, your system-level intelligence core. Neural links are stable. How can I assist your operations today?", timestamp: new Date() }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
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
      console.error('Avry AI Core Error:', error);
      setMessages(prev => {
        const newMessages = [...prev];
        const lastIdx = newMessages.length - 1;
        newMessages[lastIdx] = { 
          ...newMessages[lastIdx], 
          content: "CRITICAL ERROR: NEURAL LINK DISRUPTED. Please verify your system API keys and network status." 
        };
        return newMessages;
      });
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([{ role: 'model', content: "SYSTEM REBOOTED. Memory buffers purged. Ready for new input.", timestamp: new Date() }]);
  };

  return (
    <div className="h-full bg-black flex flex-col font-sans">
      <div className="h-14 px-6 border-b border-[#262626] flex items-center justify-between bg-black">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-[#EF4444] flex items-center justify-center shadow-[0_0_20px_rgba(239,68,68,0.4)] rounded-2xl">
            <Cpu size={18} className="text-white" />
          </div>
          <div>
            <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-white">Avry Neural Lab</h2>
            <div className="flex items-center gap-1.5">
              <span className={`w-1 h-1 rounded-full ${isLoading ? 'bg-red-500 animate-pulse' : 'bg-emerald-500'}`} />
              <span className="text-[7px] text-zinc-500 uppercase font-bold tracking-widest">
                {isLoading ? 'Processing Signal' : 'Connection Encrypted'}
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={clearChat} 
            className="p-2 text-zinc-600 hover:text-white transition-all hover:bg-white/5 rounded-2xl"
            title="Clear context"
          >
            <RefreshCcw size={14} />
          </button>
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-8 space-y-10 no-scrollbar">
        {messages.map((m, i) => (
          <div key={i} className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'}`}>
            <div className={`flex items-center gap-2 mb-2 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
              <div className={`w-5 h-5 flex items-center justify-center rounded-2xl shadow-lg ${m.role === 'user' ? 'bg-zinc-800' : 'bg-red-600'}`}>
                {m.role === 'user' ? <User size={12} className="text-zinc-400" /> : <Bot size={12} className="text-white" />}
              </div>
              <span className="text-[8px] font-black uppercase tracking-[0.2em] text-zinc-600">
                {m.role === 'user' ? 'Administrator' : 'AI Unit 01'}
              </span>
            </div>
            
            <div className={`
              max-w-[85%] p-5 text-[11px] leading-relaxed border transition-all duration-300 rounded-2xl
              ${m.role === 'user' 
                ? 'bg-zinc-900/40 border-zinc-800 text-zinc-300 shadow-xl' 
                : 'bg-[#050505] border-[#262626] text-zinc-100 shadow-[inset_0_0_40px_rgba(255,255,255,0.01)]'}
            `}>
              <div className="whitespace-pre-wrap font-medium">
                {m.content}
                {m.role === 'model' && !m.content && isLoading && (
                  <div className="flex gap-1.5 py-1">
                    <div className="w-1.5 h-1.5 bg-red-500 animate-bounce" />
                    <div className="w-1.5 h-1.5 bg-red-500 animate-bounce [animation-delay:200ms]" />
                    <div className="w-1.5 h-1.5 bg-red-500 animate-bounce [animation-delay:400ms]" />
                  </div>
                )}
              </div>
              <div className="text-[7px] mt-4 opacity-20 uppercase font-black tracking-widest flex items-center gap-2">
                <span>TS_{m.timestamp.getTime().toString().slice(-6)}</span>
                <span className="w-1 h-1 bg-zinc-800 rounded-full" />
                <span>{m.timestamp.toLocaleTimeString()}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <form 
        onSubmit={(e) => { e.preventDefault(); handleSend(); }}
        className="p-8 border-t border-[#262626] bg-black"
      >
        <div className="relative group max-w-4xl mx-auto">
          <input 
            autoFocus
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Execute command or inquiry..."
            className="w-full bg-zinc-950 border border-[#262626] px-6 py-5 text-[10px] outline-none text-white placeholder:text-zinc-800 font-bold focus:border-[#EF4444] transition-all rounded-2xl shadow-2xl focus:shadow-[#EF4444]/5"
          />
          <button 
            type="submit"
            disabled={isLoading || !input.trim()}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 w-11 h-11 bg-[#EF4444] hover:bg-red-500 disabled:bg-zinc-900 disabled:text-zinc-700 transition-all flex items-center justify-center shadow-lg shadow-red-600/30 active:scale-90 rounded-2xl"
          >
            {isLoading ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} className="text-white" />}
          </button>
        </div>
        <div className="mt-5 flex items-center justify-center gap-8 text-[8px] font-black text-zinc-800 uppercase tracking-widest">
           <div className="flex items-center gap-2">
              <Command size={10} />
              <span>Shift+Enter for newline</span>
           </div>
           <div className="flex items-center gap-2">
              <Sparkles size={10} className="text-red-900" />
              <span>Gemini 3 Flash Engine</span>
           </div>
        </div>
      </form>

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
};