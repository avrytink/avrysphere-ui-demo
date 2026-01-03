
import React, { useState } from 'react';
import { useOSStore } from '../../store/osStore';
import { useTheme } from '../../components/Window';

export const Calculator: React.FC = () => {
  const theme = useTheme();
  const [display, setDisplay] = useState('0');
  const [equation, setEquation] = useState('');

  const isDark = theme === 'dark';

  const handleKey = (key: string) => {
    if (key === 'C') {
      setDisplay('0');
      setEquation('');
    } else if (key === '=') {
      try {
        const result = eval(equation.replace('×', '*').replace('÷', '/'));
        setDisplay(String(result));
        setEquation(String(result));
      } catch {
        setDisplay('Error');
      }
    } else {
      setDisplay(prev => prev === '0' ? key : prev + key);
      setEquation(prev => prev + key);
    }
  };

  const keys = ['C', '÷', '×', '⌫', '7', '8', '9', '-', '4', '5', '6', '+', '1', '2', '3', '=', '0', '.', '(', ')'];

  return (
    <div className={`h-full p-6 flex flex-col font-mono ${isDark ? 'bg-black' : 'bg-white'}`}>
      <div className={`flex-1 flex flex-col justify-end text-right p-6 mb-4 border rounded-2xl ${isDark ? 'bg-white/[0.02] border-white/10' : 'bg-zinc-50 border-zinc-200'}`}>
        <div className={`text-xs mb-2 truncate ${isDark ? 'text-gray-500' : 'text-zinc-400'}`}>{equation || '0'}</div>
        <div className={`text-5xl font-light tracking-tighter ${isDark ? 'text-white' : 'text-zinc-900'}`}>{display}</div>
      </div>
      <div className="grid grid-cols-4 gap-2">
        {keys.map(k => (
          <button 
            key={k} 
            onClick={() => handleKey(k)}
            className={`h-14 flex items-center justify-center border transition-colors text-lg rounded-2xl ${k === '=' ? 'bg-red-600 border-none hover:bg-red-500 text-white' : (isDark ? 'border-white/10 hover:bg-white/10 text-white' : 'border-zinc-200 hover:bg-zinc-100 text-zinc-900 bg-white shadow-sm')}`}
          >
            {k}
          </button>
        ))}
      </div>
    </div>
  );
};
