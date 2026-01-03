
import React from 'react';
import { ShoppingBag, DollarSign, Package, Users, ArrowUpRight } from 'lucide-react';
import { useOSStore } from '../../store/osStore';
import { useTheme } from '../../components/Window';

export const Shopper: React.FC = () => {
  const theme = useTheme();
  const isDark = theme === 'dark';

  return (
    <div className={`h-full flex flex-col overflow-y-auto ${isDark ? 'bg-black' : 'bg-slate-50'}`}>
      <div className={`p-6 md:p-12 border-b ${isDark ? 'border-white/10 bg-white/[0.01]' : 'border-zinc-200 bg-white'}`}>
        <h1 className={`text-3xl md:text-5xl font-light uppercase tracking-tighter mb-4 ${isDark ? 'text-white' : 'text-zinc-900'}`}>Store Overview</h1>
        <div className="flex gap-4">
          <div className="bg-emerald-600/10 border border-emerald-600/30 px-3 py-1 text-emerald-500 text-[9px] font-bold uppercase tracking-widest">LIVE DATA</div>
          <div className={`border px-3 py-1 text-[9px] font-bold uppercase tracking-widest ${isDark ? 'bg-white/5 border-white/10 text-gray-500' : 'bg-zinc-100 border-zinc-200 text-zinc-500'}`}>Q4 2024</div>
        </div>
      </div>

      <div className="p-6 md:p-12 grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-12">
        <div className="space-y-2">
          <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Net Revenue</div>
          <div className={`text-4xl font-mono ${isDark ? 'text-white' : 'text-zinc-900'}`}>$128,492.00</div>
          <div className="flex items-center gap-1 text-emerald-500 text-xs font-bold">
            <ArrowUpRight size={14} /> +12.4%
          </div>
        </div>
        <div className="space-y-2">
          <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Order Volume</div>
          <div className={`text-4xl font-mono ${isDark ? 'text-white' : 'text-zinc-900'}`}>1,402</div>
          <div className="flex items-center gap-1 text-gray-500 text-xs font-bold">
            <Package size={14} /> Avg. $91.60
          </div>
        </div>
        <div className="space-y-2">
          <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Customer Base</div>
          <div className={`text-4xl font-mono ${isDark ? 'text-white' : 'text-zinc-900'}`}>42.9K</div>
          <div className="flex items-center gap-1 text-blue-500 text-xs font-bold">
            <Users size={14} /> +2.1K New
          </div>
        </div>
      </div>

      <div className="px-6 md:px-12 pb-12">
        <div className={`border p-4 md:p-8 overflow-x-auto ${isDark ? 'border-white/10 bg-white/[0.01]' : 'border-zinc-200 bg-white shadow-sm'}`}>
          <h3 className={`text-[10px] font-bold uppercase tracking-[0.3em] mb-8 border-b pb-4 ${isDark ? 'text-white border-white/10' : 'text-zinc-900 border-zinc-100'}`}>Top Inventory Performance</h3>
          <table className="w-full text-left text-xs uppercase tracking-tight min-w-[500px]">
            <thead>
              <tr className={`border-b ${isDark ? 'text-gray-500 border-white/10' : 'text-zinc-400 border-zinc-100'}`}>
                <th className="pb-4 font-bold">Product SKU</th>
                <th className="pb-4 font-bold">Sold</th>
                <th className="pb-4 font-bold">Stock</th>
                <th className="pb-4 font-bold">Status</th>
              </tr>
            </thead>
            <tbody className={isDark ? 'text-zinc-300' : 'text-zinc-700'}>
              {[
                { sku: 'VRT-11-CORE', sold: '842', stock: '12', status: 'LOW STOCK' },
                { sku: 'OS-PRO-KEY', sold: '511', stock: 'INF', status: 'OK' },
                { sku: 'DEV-KIT-Z', sold: '290', stock: '42', status: 'OK' },
              ].map(p => (
                <tr key={p.sku} className={`border-b transition-colors ${isDark ? 'border-white/5 hover:bg-white/5' : 'border-zinc-50 hover:bg-zinc-50'}`}>
                  <td className="py-4 font-mono">{p.sku}</td>
                  <td className="py-4">{p.sold}</td>
                  <td className="py-4">{p.stock}</td>
                  <td className="py-4">
                    <span className={`px-2 py-0.5 text-[8px] font-bold ${p.status === 'LOW STOCK' ? 'bg-red-600/20 text-red-500' : 'bg-emerald-600/20 text-emerald-500'}`}>
                      {p.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
