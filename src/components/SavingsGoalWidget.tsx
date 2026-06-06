import React, { useState, useEffect } from 'react';
import { SavingsGoal } from '../types';
import { Target, Plus, CheckCircle, Trash2 } from 'lucide-react';
import { formatIDR } from '../utils';
import confetti from 'canvas-confetti';
import { motion } from 'motion/react';

interface SavingsGoalWidgetProps {
  currentBalance: number;
  goal: SavingsGoal | null;
  onSaveGoal: (goal: SavingsGoal) => void;
  onClearGoal: () => void;
}

export function SavingsGoalWidget({ currentBalance, goal, onSaveGoal, onClearGoal }: SavingsGoalWidgetProps) {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [deadline, setDeadline] = useState('');
  const [hasCelebrated, setHasCelebrated] = useState(false);

  // Trigger celebration when the goal is achieved
  const progress = goal ? Math.min(100, Math.max(0, (currentBalance / goal.targetAmount) * 100)) : 0;
  
  useEffect(() => {
    if (goal && progress >= 100 && !hasCelebrated) {
      setHasCelebrated(true);
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#4f46e5', '#10b981', '#f59e0b', '#ec4899']
      });
    } else if (progress < 100) {
      setHasCelebrated(false);
    }
  }, [progress, goal, hasCelebrated]);

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/\D/g, '');
    if (!rawValue) {
      setAmount('');
      return;
    }
    const formatted = Number(rawValue).toLocaleString('id-ID');
    setAmount(formatted);
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    const rawAmount = Number(amount.replace(/\D/g, ''));
    if (!name || !rawAmount || !deadline || isNaN(rawAmount)) return;

    onSaveGoal({
      id: Math.random().toString(36).substring(2, 9),
      name,
      targetAmount: rawAmount,
      deadlineDate: new Date(deadline).toISOString()
    });
    
    setIsFormOpen(false);
    setName('');
    setAmount('');
    setDeadline('');
    setHasCelebrated(false); // Reset celebration flag
  };

  if (!goal && !isFormOpen) {
    return (
      <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 p-6 rounded-2xl shadow-sm border border-indigo-100 dark:border-indigo-800/30 flex flex-col items-center justify-center text-center">
        <div className="w-12 h-12 bg-white dark:bg-slate-800 rounded-full flex items-center justify-center shadow-sm mb-3">
          <Target className="text-indigo-600 dark:text-indigo-400" size={24} />
        </div>
        <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">Bikin Target Menabung yuk!</h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 mb-4">Buat goals baru supaya kamu lebih semangat buat atur keuangan.</p>
        <button 
          onClick={() => setIsFormOpen(true)}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-medium transition-colors shadow-sm"
        >
          <Plus size={18} />
          Buat Target
        </button>
      </div>
    );
  }

  if (isFormOpen) {
    return (
      <form onSubmit={handleCreate} className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-base font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <Target className="text-indigo-600 dark:text-indigo-400" size={20} />
            Target Menabung Baru
          </h3>
          <button type="button" onClick={() => setIsFormOpen(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
            &times;
          </button>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Nama Target</label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="e.g. Beli Laptop Baru"
              className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm text-slate-900 dark:text-white dark:placeholder-slate-400 transition-colors"
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Nominal (IDR)</label>
              <input
                type="text"
                value={amount}
                onChange={handleAmountChange}
                placeholder="e.g. 5.000.000"
                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm text-slate-900 dark:text-white dark:placeholder-slate-400 transition-colors"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Tenggat Waktu</label>
             <input
                type="date"
                value={deadline}
                onChange={e => setDeadline(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm text-slate-900 dark:text-white transition-colors"
                required
              />
            </div>
          </div>
        </div>
        
        <div className="mt-5 flex gap-3">
          <button type="submit" className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 rounded-xl font-medium transition-colors shadow-sm">
            Simpan Target
          </button>
        </div>
      </form>
    );
  }

  // Active Goal Display
  if (!goal) return null; // Safe guard

  const isAchieved = progress >= 100;
  const deadlineDate = new Date(goal.deadlineDate);
  const now = new Date();
  
  // Calculate remaining months estimation
  const monthsDiff = (deadlineDate.getFullYear() - now.getFullYear()) * 12 + (deadlineDate.getMonth() - now.getMonth());
  const isExpired = monthsDiff < 0 && !isAchieved;

  return (
    <div className={`p-6 rounded-2xl shadow-sm border relative overflow-hidden transition-colors ${
      isAchieved 
        ? 'bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-200 dark:from-emerald-900/20 dark:to-teal-900/20 dark:border-emerald-800/50' 
        : 'bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700'
    }`}>
      {/* Background decorations */}
      {isAchieved && (
        <div className="absolute -top-10 -right-10 text-emerald-200 dark:text-emerald-800/30 rotate-12 opacity-50">
          <CheckCircle size={150} />
        </div>
      )}

      <div className="flex justify-between items-start mb-4 relative z-10">
        <div>
          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider mb-2 ${
            isAchieved 
              ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-400' 
              : 'bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400'
          }`}>
             <Target size={12} />
             Target Menabung
          </span>
          <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">{goal.name}</h3>
        </div>
        <button 
          onClick={onClearGoal}
          className="text-slate-400 hover:text-red-500 dark:text-slate-500 dark:hover:text-red-400 transition-colors p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg"
          title="Hapus Target"
        >
          <Trash2 size={16} />
        </button>
      </div>

      <div className="mb-2 flex justify-between items-end relative z-10">
        <p className={`text-2xl font-bold ${isAchieved ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-800 dark:text-slate-100'}`}>
          {formatIDR(Math.min(currentBalance, goal.targetAmount))}
          <span className="text-sm font-medium text-slate-400 dark:text-slate-500"> / {formatIDR(goal.targetAmount)}</span>
        </p>
        <span className={`text-sm font-bold ${isAchieved ? 'text-emerald-600 dark:text-emerald-400' : 'text-indigo-600 dark:text-indigo-400'}`}>
          {progress.toFixed(0)}%
        </span>
      </div>

      <div className="h-3 w-full bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden mb-4 relative z-10">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 1, ease: 'easeOut' }}
          className={`h-full rounded-full ${
            isAchieved 
              ? 'bg-emerald-500' 
              : 'bg-indigo-500'
          }`}
        />
      </div>

      <div className="flex justify-between items-center text-xs font-medium text-slate-500 dark:text-slate-400 relative z-10">
        {isAchieved ? (
           <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5 font-bold">
             <CheckCircle size={14} />
             Yeay! Target tercapai! 🎉
           </span>
        ) : (
          <>
            <span>Sisa: {formatIDR(goal.targetAmount - currentBalance)}</span>
            <span className={isExpired ? 'text-red-500' : ''}>
              Tenggat: {monthsDiff > 0 ? `~${monthsDiff} bulan lagi` : deadlineDate.toLocaleDateString('id-ID', { month: 'short', year: 'numeric' })}
            </span>
          </>
        )}
      </div>
    </div>
  );
}
