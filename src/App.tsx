import { useState, useEffect, useMemo } from 'react';
import { Transaction, SavingsGoal } from './types';
import { DashboardCards } from './components/DashboardCards';
import { TransactionForm } from './components/TransactionForm';
import { ExpenseChart } from './components/ExpenseChart';
import { TransactionTable } from './components/TransactionTable';
import { SavingsGoalWidget } from './components/SavingsGoalWidget';
import { AIAssistant } from './components/AIAssistant';
import { Wallet, LogOut, Sun, Moon } from 'lucide-react';
import { Auth } from './components/Auth';

export default function App() {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem('smart_expense_theme');
    return savedTheme === 'dark';
  });

  const [currentUser, setCurrentUser] = useState<string | null>(() => localStorage.getItem('smart_expense_active_user'));
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [savingsGoal, setSavingsGoal] = useState<SavingsGoal | null>(null);
  const [sortActive, setSortActive] = useState(false);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('smart_expense_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('smart_expense_theme', 'light');
    }
  }, [isDarkMode]);

  // Load transactions when user changes
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('smart_expense_active_user', currentUser);
      
      const savedTransactions = localStorage.getItem(`smart_expense_tracker_data_${currentUser}`);
      if (savedTransactions) {
        try { setTransactions(JSON.parse(savedTransactions)); } 
        catch (e) { setTransactions([]); }
      } else {
        setTransactions([]);
      }

      const savedGoal = localStorage.getItem(`smart_expense_goal_${currentUser}`);
      if (savedGoal) {
        try { setSavingsGoal(JSON.parse(savedGoal)); } 
        catch (e) { setSavingsGoal(null); }
      } else {
        setSavingsGoal(null);
      }
    } else {
      localStorage.removeItem('smart_expense_active_user');
      setTransactions([]);
      setSavingsGoal(null);
    }
  }, [currentUser]);

  // Sync to LocalStorage whenever transactions change
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(`smart_expense_tracker_data_${currentUser}`, JSON.stringify(transactions));
    }
  }, [transactions, currentUser]);

  // Sync goal to LocalStorage
  useEffect(() => {
    if (currentUser) {
      if (savingsGoal) {
        localStorage.setItem(`smart_expense_goal_${currentUser}`, JSON.stringify(savingsGoal));
      } else {
        localStorage.removeItem(`smart_expense_goal_${currentUser}`);
      }
    }
  }, [savingsGoal, currentUser]);

  const handleLogout = () => {
    setCurrentUser(null);
  };

  // CV HIGHLIGHT: Selection Sort Manual Algorithm Implementation
  const displayedTransactions = useMemo(() => {
    if (!sortActive) {
      // Default rendering: chronologically inverted (latest first)
      return [...transactions].reverse();
    }

    // Algoritma simulasi manual sorting: Selection Sort
    // Mengurutkan riwayat pengeluaran dari yang terbesar ke terkecil
    const arr = [...transactions];
    for (let i = 0; i < arr.length; i++) {
      let maxIdx = i;
      for (let j = i + 1; j < arr.length; j++) {
        // Find the maximum value in the unsorted remainder of the array
        if (arr[j].amount > arr[maxIdx].amount) {
          maxIdx = j;
        }
      }
      // Swap maximum value with the current index
      if (maxIdx !== i) {
        const temp = arr[i];
        arr[i] = arr[maxIdx];
        arr[maxIdx] = temp;
      }
    }
    return arr;
  }, [transactions, sortActive]);

  if (!currentUser) {
    return <Auth onLogin={setCurrentUser} />;
  }

  // Aggregate stats
  const totalIncome = transactions.filter(t => t.type === 'income').reduce((acc, curr) => acc + curr.amount, 0);
  const totalExpense = transactions.filter(t => t.type === 'expense').reduce((acc, curr) => acc + curr.amount, 0);

  // Form submit handler
  const handleAddTransaction = (newTx: Omit<Transaction, 'id' | 'date'>) => {
    const fullTx: Transaction = {
      ...newTx,
      id: Math.random().toString(36).substring(2, 9),
      date: new Date().toISOString()
    };
    setTransactions(prev => [...prev, fullTx]);
  };

  const handleDeleteTransaction = (id: string) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
  };

  return (
    <div className="h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 font-sans flex flex-col overflow-hidden selection:bg-indigo-100 dark:selection:bg-indigo-900/50 selection:text-indigo-900 dark:selection:text-indigo-200">
      <nav className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 px-8 py-4 flex justify-between items-center shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shadow-sm">
            <Wallet size={18} className="text-white" />
          </div>
          <span className="font-bold text-xl tracking-tight text-slate-800 dark:text-slate-100">Smart Expense Tracker</span>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="p-2 rounded-lg text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300 transition-colors bg-slate-100 dark:bg-slate-700/50 hover:bg-slate-200 dark:hover:bg-slate-700"
            title="Toggle Theme"
          >
            {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <span className="text-sm text-slate-500 dark:text-slate-400 font-medium hidden sm:block">Welcome back, <strong className="text-slate-700 dark:text-slate-300">{currentUser}</strong></span>
          <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900/50 rounded-full border-2 border-white dark:border-slate-700 shadow-sm overflow-hidden flex items-center justify-center text-indigo-700 dark:text-indigo-300 font-bold text-xs uppercase">
            {currentUser.substring(0, 2)}
          </div>
          <button onClick={handleLogout} className="text-slate-400 hover:text-red-500 dark:hover:text-red-400 transition-colors ml-2" title="Logout">
             <LogOut size={20} />
          </button>
        </div>
      </nav>

      <div className="flex-1 p-4 md:p-6 grid grid-cols-1 md:grid-cols-12 gap-6 overflow-auto">
        <div className="md:col-span-4 flex flex-col gap-6">
          <TransactionForm onAdd={handleAddTransaction} />
          <ExpenseChart transactions={transactions} />
        </div>
        <div className="md:col-span-8 flex flex-col gap-6">
          <DashboardCards totalIncome={totalIncome} totalExpense={totalExpense} />
          
          <SavingsGoalWidget 
            currentBalance={totalIncome - totalExpense}
            goal={savingsGoal}
            onSaveGoal={setSavingsGoal}
            onClearGoal={() => setSavingsGoal(null)}
          />

          <AIAssistant transactions={transactions} />

          <div className="flex-1 flex flex-col min-h-[400px]">
            <TransactionTable
              transactions={displayedTransactions}
              isSorted={sortActive}
              onSortSelect={() => setSortActive(!sortActive)}
              onDeleteTransaction={handleDeleteTransaction}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
