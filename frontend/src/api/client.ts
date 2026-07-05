const BASE_URL = "http://localhost:8000";

function getToken() {
  return localStorage.getItem("token");
}

async function request(path: string, options: RequestInit = {}) {
  const token = getToken();
  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: res.statusText }));
    throw new Error(err.detail || "Request failed");
  }

  return res.json();
}

export const api = {
  register: (data: { name: string; email: string; password: string }) =>
    request("/auth/register", { method: "POST", body: JSON.stringify(data) }),

  login: (data: { email: string; password: string }) =>
    request("/auth/login", { method: "POST", body: JSON.stringify(data) }),

  createGroup: (name: string) =>
    request("/groups", { method: "POST", body: JSON.stringify({ name }) }),

  getGroup: (id: number) => request(`/groups/${id}`),

  addMember: (groupId: number, userId: number) =>
    request(`/groups/${groupId}/members`, {
      method: "POST",
      body: JSON.stringify({ user_id: userId }),
    }),

  listExpenses: (groupId: number) => request(`/groups/${groupId}/expenses`),

  addExpense: (groupId: number, data: unknown) =>
    request(`/groups/${groupId}/expenses`, {
      method: "POST",
      body: JSON.stringify(data),
    }),

  getBalances: (groupId: number) => request(`/groups/${groupId}/balances`),

  settleUp: (groupId: number, data: { paid_to: number; amount: number }) =>
    request(`/groups/${groupId}/settlements`, {
      method: "POST",
      body: JSON.stringify(data),
    }),
};
