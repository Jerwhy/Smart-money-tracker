import { useState } from 'react';
import { PlusCircle } from 'lucide-react';
import { Transaction, TransactionType, Category } from '../types';

interface TransactionFormProps {
  onAdd: (t: Omit<Transaction, 'id' | 'date'>) => void;
}

const CATEGORIES: Category[] = ['Makanan', 'Transportasi', 'Hiburan', 'Tagihan', 'Gaji', 'Lainnya'];

export function TransactionForm({ onAdd }: TransactionFormProps) {
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState<Category>('Makanan');
  const [type, setType] = useState<TransactionType>('expense');

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Only allow digits
    const rawValue = e.target.value.replace(/\D/g, '');
    if (!rawValue) {
      setAmount('');
      return;
    }
    // Format with id-ID locale for thousand separators (dots)
    const formatted = Number(rawValue).toLocaleString('id-ID');
    setAmount(formatted);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const rawAmount = Number(amount.replace(/\D/g, ''));
    if (!name || !rawAmount || isNaN(rawAmount)) return;

    onAdd({
      name,
      amount: rawAmount,
      category,
      type
    });

    setName('');
    setAmount('');
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-800 p-5 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 flex-1 flex flex-col">
      <h3 className="text-sm font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-4">Input Transaction</h3>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Type</label>
          <div className="flex bg-slate-100 dark:bg-slate-700/50 p-1 rounded-xl">
            <button
              type="button"
              onClick={() => setType('expense')}
              className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${
                type === 'expense'
                  ? 'bg-white dark:bg-slate-800 text-rose-600 dark:text-rose-400 shadow-sm'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
              }`}
            >
              Pengeluaran
            </button>
            <button
              type="button"
              onClick={() => setType('income')}
              className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${
                type === 'income'
                  ? 'bg-white dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 shadow-sm'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
              }`}
            >
              Pemasukan
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Description</label>
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="e.g. Starbucks Coffee"
            className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm text-slate-900 dark:text-white dark:placeholder-slate-400 transition-colors"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Amount (IDR)</label>
            <input
              type="text"
              value={amount}
              onChange={handleAmountChange}
              placeholder="e.g. 50.000"
              className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm text-slate-900 dark:text-white dark:placeholder-slate-400 transition-colors"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Category</label>
            <select
              value={category}
              onChange={e => setCategory(e.target.value as Category)}
              className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm text-slate-900 dark:text-white appearance-none cursor-pointer transition-colors"
            >
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>

        <button
          type="submit"
          className="mt-4 w-full bg-indigo-600 text-white py-3 rounded-xl font-semibold shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition flex items-center justify-center gap-2"
        >
          <PlusCircle size={18} />
          Add Transaction
        </button>
      </div>
    </form>
  );
}
