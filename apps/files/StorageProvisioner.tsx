
import React, { useState } from 'react';
import { Cloud, Server, Database, Lock, Globe, Shield, CheckCircle2, Loader2 } from 'lucide-react';
import { useVFSStore } from '../../store/vfsStore';
import { useOSStore } from '../../store/osStore';

export const StorageProvisioner: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const { theme } = useOSStore();
  const { addItem } = useVFSStore();
  const [step, setStep] = useState<'select' | 'configure' | 'syncing'>('select');
  const [selectedProvider, setSelectedProvider] = useState<'s3' | 'dropbox' | 'mega' | null>(null);

  const isDark = theme === 'dark';

  const providers = [
    { id: 's3', name: 'Amazon S3', icon: Database, color: 'text-orange-400', desc: 'Secure enterprise object storage.' },
    { id: 'dropbox', name: 'Dropbox', icon: Cloud, color: 'text-blue-400', desc: 'Sync files across all devices.' },
    { id: 'mega', name: 'Mega.nz', icon: Shield, color: 'text-red-500', desc: 'User-controlled encrypted cloud.' },
  ];

  const handleProvision = () => {
    setStep('syncing');
    setTimeout(() => {
      if (selectedProvider) {
        addItem({
          name: `${selectedProvider.toUpperCase()} Storage`,
          type: selectedProvider as any,
          parentId: 'cloud-root',
          provider: selectedProvider as any,
        });
      }
      onComplete();
    }, 2000);
  };

  return (
    <div className={`h-full p-8 flex flex-col font-sans ${isDark ? 'bg-black text-white' : 'bg-white text-zinc-900'}`}>
      {step === 'select' && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 h-full flex flex-col">
          <h2 className="text-2xl font-black uppercase tracking-tighter mb-2">Connect Virtual Storage</h2>
          <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-[0.2em] mb-8">Select a provider to establish neural link</p>
          
          <div className="space-y-3 flex-1 overflow-y-auto no-scrollbar">
            {providers.map(p => (
              <div 
                key={p.id}
                onClick={() => setSelectedProvider(p.id as any)}
                className={`p-6 border rounded-3xl cursor-pointer transition-all flex items-center justify-between group ${selectedProvider === p.id ? 'bg-blue-600/10 border-blue-600' : (isDark ? 'bg-white/[0.02] border-white/10 hover:border-white/20' : 'bg-zinc-50 border-zinc-200 hover:border-zinc-300')}`}
              >
                <div className="flex items-center gap-5">
                   <div className={`p-4 rounded-2xl border ${isDark ? 'bg-black border-white/5' : 'bg-white border-zinc-100'} ${p.color}`}><p.icon size={24} /></div>
                   <div>
                      <div className="text-sm font-black uppercase tracking-widest">{p.name}</div>
                      <p className="text-[10px] text-zinc-600 uppercase font-bold mt-1">{p.desc}</p>
                   </div>
                </div>
                {selectedProvider === p.id && <CheckCircle2 size={20} className="text-blue-500" />}
              </div>
            ))}
          </div>

          <button 
            disabled={!selectedProvider}
            onClick={() => setStep('configure')}
            className="w-full py-4 mt-6 bg-blue-600 hover:bg-blue-500 disabled:opacity-20 disabled:grayscale transition-all rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] text-white"
          >
            Configure Handshake
          </button>
        </div>
      )}

      {step === 'configure' && (
        <div className="animate-in fade-in zoom-in-95 duration-500 space-y-6">
          <h2 className="text-xl font-black uppercase tracking-tighter">Security Credentials</h2>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-[9px] font-black text-zinc-500 uppercase tracking-widest ml-1">Access Key ID</label>
              <input type="text" placeholder="AVRY_CORE_XXXXXXXXXX" className={`w-full border p-4 rounded-xl outline-none focus:border-blue-600 text-xs font-mono ${isDark ? 'bg-white/[0.05] border-white/10' : 'bg-zinc-50 border-zinc-200'}`} />
            </div>
            <div className="space-y-2">
              <label className="text-[9px] font-black text-zinc-500 uppercase tracking-widest ml-1">Secret Cipher</label>
              <input type="password" value="••••••••••••••••" readOnly className={`w-full border p-4 rounded-xl outline-none text-xs font-mono ${isDark ? 'bg-white/[0.05] border-white/10' : 'bg-zinc-50 border-zinc-200'}`} />
            </div>
            <div className="p-4 bg-emerald-500/5 border border-emerald-500/20 rounded-xl flex items-center gap-3">
              <Lock size={16} className="text-emerald-500" />
              <span className="text-[9px] font-bold text-emerald-500 uppercase">Hardware-Level Encryption Active</span>
            </div>
          </div>

          <div className="flex gap-3 pt-6">
            <button onClick={() => setStep('select')} className={`flex-1 py-4 border rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${isDark ? 'border-white/10 hover:bg-white/5' : 'border-zinc-200 hover:bg-zinc-50'}`}>Abort</button>
            <button onClick={handleProvision} className="flex-1 py-4 bg-blue-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-500 transition-all shadow-lg shadow-blue-600/20 text-white">Establish Link</button>
          </div>
        </div>
      )}

      {step === 'syncing' && (
        <div className="flex-1 flex flex-col items-center justify-center gap-8 animate-in fade-in duration-1000">
           <div className="relative">
              <div className="absolute inset-0 bg-blue-600/20 blur-3xl animate-pulse rounded-full" />
              <div className={`w-32 h-32 rounded-full border-4 flex items-center justify-center relative ${isDark ? 'border-white/5' : 'border-zinc-100'}`}>
                 <Loader2 size={48} className="text-blue-600 animate-spin" />
              </div>
           </div>
           <div className="text-center space-y-2">
              <h3 className="text-lg font-black uppercase tracking-widest">Synthesizing Storage</h3>
              <p className="text-[9px] text-zinc-600 font-bold uppercase tracking-[0.4em]">Allocating virtual partition nodes...</p>
           </div>
        </div>
      )}
    </div>
  );
};
