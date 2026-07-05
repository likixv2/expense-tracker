export interface User {
  id: number;
  name: string;
  email: string;
}

export interface Group {
  id: number;
  name: string;
  created_by: number;
  members?: User[];
}

export interface ExpenseSplit {
  user_id: number;
  share_amount: number;
}

export interface Expense {
  id: number;
  group_id: number;
  paid_by: number;
  description: string;
  amount: number;
  category: string;
  splits: ExpenseSplit[];
}

export interface BalanceEntry {
  from_user: number;
  to_user: number;
  amount: number;
}
