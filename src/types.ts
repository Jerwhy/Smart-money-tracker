export type TransactionType = 'income' | 'expense';

export type Category = 'Makanan' | 'Transportasi' | 'Hiburan' | 'Tagihan' | 'Gaji' | 'Lainnya';

export interface Transaction {
  id: string;
  name: string;
  amount: number;
  category: Category;
  type: TransactionType;
  date: string;
}

export interface SavingsGoal {
  id: string;
  name: string;
  targetAmount: number;
  deadlineDate: string; // ISO date string
}
