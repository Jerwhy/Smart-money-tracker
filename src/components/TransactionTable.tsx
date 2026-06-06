import { Transaction } from '../types';
import { formatIDR } from '../utils';
import { Trash2 } from 'lucide-react';

interface TransactionTableProps {
  transactions: Transaction[];
  onSortSelect: () => void;
  isSorted: boolean;
  onDeleteTransaction: (id: string) => void;
}

export function TransactionTable({ transactions, onSortSelect, isSorted, onDeleteTransaction }: TransactionTableProps) {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 flex-1 flex flex-col overflow-hidden transition-colors">
      <div className="p-5 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center">
        <h3 className="text-sm font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Transaction History</h3>
        <button
          onClick={onSortSelect}
          className={`flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors ${
            isSorted 
              ? 'bg-indigo-100 dark:bg-indigo-900/50 text-indigo-800 dark:text-indigo-300' 
              : 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300'
          }`}
          title="CV Highlight: Algoritma Selection Sort"
        >
          <svg className="w-4 h-4" autoFocus={false} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12"></path>
          </svg>
          {isSorted ? 'Hapus Urutan' : 'Sort Highest Amount'}
        </button>
      </div>

      <div className="overflow-auto flex-1">
        <table className="w-full text-left">
          <thead className="bg-slate-50 dark:bg-slate-800/80 sticky top-0">
            <tr>
              <th className="px-6 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Description</th>
              <th className="px-6 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase text-center">Category</th>
              <th className="px-6 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase text-right">Pemasukan</th>
              <th className="px-6 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase text-right">Pengeluaran</th>
              <th className="px-6 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase text-center">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50 dark:divide-slate-700/50">
            {transactions.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-slate-500 dark:text-slate-400 font-medium">
                  Belum ada riwayat transaksi.
                </td>
              </tr>
            ) : (
              transactions.map(t => (
                <tr key={t.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-slate-800 dark:text-slate-100">{t.name}</div>
                    <div className="text-[10px] text-slate-400 dark:text-slate-500 uppercase font-bold">
                      {new Date(t.date).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="px-2 py-1 text-[10px] rounded-full bg-slate-100 dark:bg-slate-700/50 text-slate-600 dark:text-slate-300 font-bold uppercase tracking-wider">
                      {t.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right text-sm font-bold text-emerald-600 dark:text-emerald-400">
                    {t.type === 'income' ? formatIDR(t.amount) : '-'}
                  </td>
                  <td className="px-6 py-4 text-right text-sm font-bold text-rose-600 dark:text-rose-400">
                    {t.type === 'expense' ? formatIDR(t.amount) : '-'}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button 
                      onClick={() => onDeleteTransaction(t.id)}
                      className="p-2 text-slate-400 hover:text-red-500 dark:text-slate-500 dark:hover:text-red-400 transition-colors rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20"
                      title="Hapus transaksi"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <div className="p-4 bg-slate-50 dark:bg-slate-800/80 text-[10px] text-slate-400 dark:text-slate-500 text-center font-medium border-t border-slate-100 dark:border-slate-700">
        Showing last {transactions.length} transactions • Local Storage Active
      </div>
    </div>
  );
}
