
import React, { useState, useEffect, useRef } from 'react';
import { useOSStore } from '../../store/osStore';
import { useTheme } from '../../components/Window';

export const Terminal: React.FC = () => {
  const theme = useTheme();
  const [history, setHistory] = useState<string[]>([
    'avryOS Kernel 6.5.0-v11-amd64 x86_64',
    'Welcome to avryOS Terminal.',
    'Type "help" for a list of commands.',
    ''
  ]);
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [history]);

  const handleCommand = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const newHistory = [...history, `root@avryos:~$ ${input}`];
    
    switch (input.trim().toLowerCase()) {
      case 'help':
        newHistory.push('Available commands: help, clear, neofetch, whoami, date, exit');
        break;
      case 'clear':
        setHistory([]);
        setInput('');
        return;
      case 'neofetch':
        newHistory.push('  _    _ _   _ _____ _______     __');
        newHistory.push(' | |  | | \\ | |_   _|__   __\\ \\   / /');
        newHistory.push(' | |  | |  \\| | | |    | |   \\ \\_/ / ');
        newHistory.push(' | |  | | . ` | | |    | |    \\   /  ');
        newHistory.push(' | |__| | |\\  |_| |_   | |     | |   ');
        newHistory.push('  \\____/|_| \\_|_____|  |_|     |_|   ');
        newHistory.push('-------------------------------------');
        newHistory.push('OS: avryOS v1.0.0');
        newHistory.push('Kernel: 6.5.0-custom');
        newHistory.push('Shell: bash 5.2.15');
        newHistory.push('Resolution: 1920x1080');
        newHistory.push('DE: avryOS (React-based)');
        newHistory.push('CPU: Virtualized Gemini Core');
        newHistory.push('Memory: 32GiB');
        break;
      case 'whoami':
        newHistory.push('administrator');
        break;
      case 'date':
        newHistory.push(new Date().toString());
        break;
      default:
        newHistory.push(`Command not found: ${input}`);
    }

    setHistory(newHistory);
    setInput('');
  };

  const isDark = theme === 'dark';

  return (
    <div className={`h-full mono p-4 text-sm font-light flex flex-col ${isDark ? 'bg-black text-green-500' : 'bg-white text-zinc-800'}`}>
      <div ref={scrollRef} className="flex-1 overflow-y-auto mb-2 space-y-1">
        {history.map((line, i) => (
          <div key={i} className="whitespace-pre-wrap">{line}</div>
        ))}
      </div>
      <form onSubmit={handleCommand} className="flex items-center gap-2">
        <span className={`font-bold shrink-0 ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>root@avryos:~$</span>
        <input 
          autoFocus
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className={`bg-transparent border-none outline-none flex-1 ${isDark ? 'text-green-500' : 'text-zinc-900'}`}
        />
      </form>
    </div>
  );
};
