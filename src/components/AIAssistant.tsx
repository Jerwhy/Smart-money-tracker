import { useState } from 'react';
import { Transaction } from '../types';
import { Sparkles, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface AIAssistantProps {
  transactions: Transaction[];
}

export function AIAssistant({ transactions }: AIAssistantProps) {
  const [advice, setAdvice] = useState<string | null>(null);

  const generateAdvice = () => {
    if (transactions.length === 0) {
      setAdvice('Belum ada riwayat transaksi yang bisa dianalisis. Tambahkan transaksimu dulu ya!');
      return;
    }

    const totalIncome = transactions.filter(t => t.type === 'income').reduce((a, b) => a + b.amount, 0);
    const totalExpense = transactions.filter(t => t.type === 'expense').reduce((a, b) => a + b.amount, 0);
    const entertainmentExpense = transactions.filter(t => t.type === 'expense' && t.category === 'Hiburan').reduce((a, b) => a + b.amount, 0);

    const now = new Date();
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const twoWeeksAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);

    const thisWeekTxs = transactions.filter(t => new Date(t.date) >= oneWeekAgo);
    const lastWeekTxs = transactions.filter(t => new Date(t.date) >= twoWeeksAgo && new Date(t.date) < oneWeekAgo);

    const thisWeekInc = thisWeekTxs.filter(t => t.type === 'income').reduce((a, b) => a + b.amount, 0);
    const thisWeekExp = thisWeekTxs.filter(t => t.type === 'expense').reduce((a, b) => a + b.amount, 0);
    const thisWeekBalance = thisWeekInc - thisWeekExp;

    const lastWeekInc = lastWeekTxs.filter(t => t.type === 'income').reduce((a, b) => a + b.amount, 0);
    const lastWeekExp = lastWeekTxs.filter(t => t.type === 'expense').reduce((a, b) => a + b.amount, 0);
    const lastWeekBalance = lastWeekInc - lastWeekExp;

    if (totalExpense > totalIncome) {
      setAdvice('Peringatan: Kamu besar pasak daripada tiang. Segera batasi pengeluaranmu!');
    } else if (totalExpense > 0 && (entertainmentExpense / totalExpense) > 0.4) {
      setAdvice('Hei, kamu terlalu banyak jajan bulan ini. Kurangi nonton atau nongkrong dulu ya!');
    } else if (thisWeekBalance > lastWeekBalance || thisWeekBalance >= 0) {
      setAdvice('Bagus sekali! Manajemen keuanganmu minggu ini sangat sehat. Pertahankan!');
    } else {
      setAdvice('Keuanganmu cukup stabil, tapi tetap perhatikan pengeluaran ya!');
    }
  };

  return (
    <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-[1px] rounded-2xl shadow-sm mb-6">
      <div className="bg-white dark:bg-slate-800 rounded-[15px] p-5 relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold mb-1">
            <Sparkles size={20} />
            Asisten Finansial AI
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Dapatkan saran pintar berdasarkan riwayat transaksimu.
          </p>
        </div>
        
        <button 
          onClick={generateAdvice}
          className="shrink-0 px-5 py-2.5 bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-900/50 dark:hover:bg-indigo-900/80 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 rounded-xl text-sm font-semibold transition-colors flex items-center justify-center gap-2"
        >
          <Sparkles size={16} />
          Minta Saran AI
        </button>

        <AnimatePresence>
          {advice && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="absolute inset-0 z-10 p-5 bg-white dark:bg-slate-800 flex items-center gap-4"
            >
              <div className="w-10 h-10 shrink-0 bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 rounded-full flex items-center justify-center">
                <Sparkles size={20} />
              </div>
              <p className="text-sm text-slate-800 dark:text-slate-100 font-medium flex-1 leading-relaxed">
                "{advice}"
              </p>
              <button 
                onClick={() => setAdvice(null)} 
                className="shrink-0 p-2 text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                title="Tutup"
              >
                <X size={20} />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
