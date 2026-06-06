import { useState } from 'react';
import { formatIDR } from '../utils';
import { Wallet, TrendingDown, TrendingUp, AlertTriangle, Eye, EyeOff } from 'lucide-react';
import { motion } from 'motion/react';

interface DashboardCardsProps {
  totalIncome: number;
  totalExpense: number;
}

export function DashboardCards({ totalIncome, totalExpense }: DashboardCardsProps) {
  const balance = totalIncome - totalExpense;
  const isOverbudget = balance < 100000;
  const [isMasked, setIsMasked] = useState(false);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 shrink-0 w-full">
      {/* Total Balance Card (Highlights warning if < 100,000) */}
      <motion.div
        animate={isOverbudget ? {
          x: [-3, 3, -3, 3, 0],
          scale: [1, 1.01, 1],
        } : {}}
        transition={{
          duration: 0.4,
          repeat: isOverbudget ? Infinity : 0,
          repeatType: "reverse",
          repeatDelay: 2
        }}
        className={isOverbudget 
          ? "bg-red-50 dark:bg-red-900/20 p-6 rounded-2xl border-2 border-red-200 dark:border-red-900/50 ring-4 ring-red-50 dark:ring-red-900/20 ring-opacity-50" 
          : "bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700"
        }
      >
        <div className="flex justify-between items-start mb-1">
          <div className="flex items-center gap-2">
            <p className={"text-sm font-medium " + (isOverbudget ? "text-red-600 dark:text-red-400" : "text-slate-500 dark:text-slate-400")}>Current Balance</p>
            <button onClick={() => setIsMasked(!isMasked)} className={"transition-colors " + (isOverbudget ? "text-red-400 dark:text-red-500 hover:text-red-600 dark:hover:text-red-400" : "text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300")}>
              {isMasked ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          <div className={"p-2 rounded-lg " + (isOverbudget ? "bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-400" : "bg-indigo-50 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400")}>
             {isOverbudget ? <AlertTriangle size={20} /> : <Wallet size={20} />}
          </div>
        </div>
        <p className={"text-2xl font-bold tracking-tight " + (isOverbudget ? "text-red-700 dark:text-red-400" : "text-slate-800 dark:text-slate-100")}>
          {isMasked ? "Rp ••••••" : formatIDR(balance)}
        </p>
        <div className={"mt-2 text-xs font-semibold " + (isOverbudget ? "text-red-600 dark:text-red-400 animate-pulse" : "text-emerald-600 dark:text-emerald-400")}>
          {isOverbudget ? "⚠️ Peringatan: Saldo di bawah Rp 100.000!" : "Status balance aman"}
        </div>
      </motion.div>

      {/* Income Card */}
      <div className="bg-emerald-500 dark:bg-emerald-600 p-6 rounded-2xl shadow-sm border border-emerald-600 dark:border-emerald-700 text-white transition-colors">
        <div className="flex justify-between items-start mb-1">
          <p className="text-sm font-medium text-emerald-50 dark:text-emerald-100">Total Income</p>
          <div className="p-2 rounded-lg bg-emerald-400/30 text-white">
             <TrendingUp size={20} />
          </div>
        </div>
        <p className="text-2xl font-bold tracking-tight">{formatIDR(totalIncome)}</p>
      </div>

      {/* Expense Card */}
      <div className="bg-rose-500 dark:bg-rose-600 p-6 rounded-2xl shadow-sm border border-rose-600 dark:border-rose-700 text-white transition-colors">
        <div className="flex justify-between items-start mb-1">
          <p className="text-sm font-medium text-rose-50 dark:text-rose-100">Total Expense</p>
          <div className="p-2 rounded-lg bg-rose-400/30 text-white">
             <TrendingDown size={20} />
          </div>
        </div>
        <p className="text-2xl font-bold tracking-tight">{formatIDR(totalExpense)}</p>
      </div>

      {/* Budget Status Card */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 flex flex-col justify-between">
        <div className="flex justify-between items-start mb-4">
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Budget Status</p>
        </div>
        <div className="flex-1 flex items-center">
          {isOverbudget ? (
            <span className="inline-flex px-4 py-2 bg-red-50 dark:bg-red-900/40 text-red-700 dark:text-red-400 rounded-lg text-sm font-bold border border-red-200 dark:border-red-800 w-full justify-center tracking-wide shadow-sm animate-pulse">
              OVERBUDGET
            </span>
          ) : (
            <span className="inline-flex px-4 py-2 bg-emerald-50 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400 rounded-lg text-sm font-bold border border-emerald-200 dark:border-emerald-800 w-full justify-center tracking-wide">
              STABLE
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
