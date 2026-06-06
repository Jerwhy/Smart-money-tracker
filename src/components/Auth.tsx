import { useState } from 'react';
import { Wallet, LogIn, UserPlus } from 'lucide-react';

export function Auth({ onLogin }: { onLogin: (username: string) => void }) {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!username || !password) {
      setError('Harap isi semua kolom');
      return;
    }

    const usersStr = localStorage.getItem('smart_expense_users');
    const users = usersStr ? JSON.parse(usersStr) : {};

    if (isLogin) {
      if (users[username] === password) {
        onLogin(username);
      } else {
        setError('Username atau password salah');
      }
    } else {
      if (users[username]) {
        setError('Username sudah terdaftar');
      } else {
        users[username] = password;
        localStorage.setItem('smart_expense_users', JSON.stringify(users));
        onLogin(username);
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8 selection:bg-indigo-100 dark:selection:bg-indigo-900/50 selection:text-indigo-900 dark:selection:text-indigo-200">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200 dark:shadow-none">
            <Wallet size={24} className="text-white" />
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Smart Expense Tracker
        </h2>
        <p className="mt-2 text-center text-sm text-slate-500 dark:text-slate-400 font-medium">
          {isLogin ? 'Masuk ke akun Anda' : 'Buat akun baru'}
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white dark:bg-slate-800 py-8 px-4 shadow-sm sm:rounded-2xl border border-slate-100 dark:border-slate-700 sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800/50 text-red-600 dark:text-red-400 px-4 py-3 rounded-xl text-sm font-medium">
                {error}
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Username
              </label>
              <input
                type="text"
                required
                value={username}
                onChange={e => setUsername(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm text-slate-900 dark:text-white dark:placeholder-slate-400 transition-colors"
                placeholder="Masukkan username"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm text-slate-900 dark:text-white dark:placeholder-slate-400 transition-colors"
                placeholder="Masukkan password"
              />
            </div>

            <button
              type="submit"
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-lg shadow-indigo-200 dark:shadow-none text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors gap-2 items-center"
            >
              {isLogin ? <LogIn size={18} /> : <UserPlus size={18} />}
              {isLogin ? 'Sign In' : 'Register'}
            </button>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200 dark:border-slate-700" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400">
                  {isLogin ? 'Belum punya akun?' : 'Sudah punya akun?'}
                </span>
              </div>
            </div>

            <div className="mt-6">
              <button
                onClick={() => {
                  setIsLogin(!isLogin);
                  setError('');
                }}
                className="w-full flex justify-center py-3 px-4 border border-slate-200 dark:border-slate-600 rounded-xl shadow-sm text-sm font-medium text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
              >
                {isLogin ? 'Daftar Akun Baru' : 'Masuk ke Akun'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
