import { useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Transaction } from '../types';
import { formatIDR } from '../utils';

interface ExpenseChartProps {
  transactions: Transaction[];
}

const CATEGORY_COLORS: Record<string, string> = {
  'Makanan': '#6366f1',      // Indigo
  'Transportasi': '#10b981', // Emerald
  'Hiburan': '#f43f5e',      // Rose
  'Tagihan': '#f59e0b',      // Amber
  'Lainnya': '#8b5cf6',      // Purple
  'Gaji': '#10b981'          // Emerald
};

export function ExpenseChart({ transactions }: ExpenseChartProps) {
  const data = useMemo(() => {
    const expenses = transactions.filter(t => t.type === 'expense');
    
    // Group expenditures by category
    const grouped = expenses.reduce((acc, curr) => {
      acc[curr.category] = (acc[curr.category] || 0) + curr.amount;
      return acc;
    }, {} as Record<string, number>);

    // Convert to array format for Recharts
    return Object.entries(grouped)
      .map(([name, value]) => ({ name, value }))
      .filter(item => item.value > 0);
  }, [transactions]);

  if (data.length === 0) {
    return (
      <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 flex flex-col items-center justify-center h-full min-h-[350px]">
        <div className="w-16 h-16 rounded-full bg-slate-50 dark:bg-slate-700/50 flex items-center justify-center mb-4 text-slate-300 dark:text-slate-500">
           {/* Placeholder circle icon */}
           <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M12 8v8"></path><path d="M8 12h8"></path></svg>
        </div>
        <p className="text-slate-500 dark:text-slate-400 font-medium">Belum ada data pengeluaran.</p>
        <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">Tambahkan transaksi untuk melihat grafik.</p>
      </div>
    );
  }

  // To properly handle theme for tooltip, since CSS variables cannot easily pass to Recharts without extra care,
  // we could detect document theme but it's easier to just use transparent generic styling or rely on CSS.
  // We'll leave Recharts tooltip background roughly neutral or slightly dark.
  
  return (
    <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 flex flex-col h-full min-h-[350px]">
      <h3 className="text-sm font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">Spending Chart</h3>
      
      <div className="flex-1 w-full relative min-h-[250px] mt-4">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={75}
              outerRadius={105}
              paddingAngle={4}
              dataKey="value"
              animationBegin={0}
              animationDuration={800}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={CATEGORY_COLORS[entry.name] || '#cbd5e1'} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value: number) => formatIDR(value)}
              contentStyle={{ borderRadius: '8px', border: '1px solid #f1f5f9', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', fontSize: '14px' }}
            />
            <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: '12px' }} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
