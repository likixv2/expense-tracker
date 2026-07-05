import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { api } from "../api/client";
import type { Expense, BalanceEntry, Group } from "../types";

export default function GroupDetail() {
  const { groupId } = useParams();
  const id = Number(groupId);
  const [group, setGroup] = useState<Group | null>(null);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [balances, setBalances] = useState<BalanceEntry[]>([]);
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");

  async function loadAll() {
    setGroup(await api.getGroup(id));
    setExpenses(await api.listExpenses(id));
    setBalances(await api.getBalances(id));
  }

  useEffect(() => {
    loadAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  async function handleAddExpense(e: React.FormEvent) {
    e.preventDefault();
    const participants = (group?.members || []).map((m) => ({ user_id: m.id }));
    await api.addExpense(id, {
      description,
      amount: Number(amount),
      split_type: "equal",
      participants,
    });
    setDescription("");
    setAmount("");
    loadAll();
  }

  return (
    <div>
      <h2>{group?.name}</h2>

      <h3>Add Expense</h3>
      <form onSubmit={handleAddExpense}>
        <input
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description"
        />
        <input
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Amount"
          type="number"
        />
        <button type="submit">Add</button>
      </form>

      <h3>Expenses</h3>
      <ul>
        {expenses.map((e) => (
          <li key={e.id}>
            {e.description} — Rs.{e.amount} (paid by user {e.paid_by})
          </li>
        ))}
      </ul>

      <h3>Balances</h3>
      <ul>
        {balances.map((b, i) => (
          <li key={i}>
            User {b.from_user} owes User {b.to_user}: Rs.{b.amount}
          </li>
        ))}
      </ul>
    </div>
  );
}
