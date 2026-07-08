const BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:8000";

function getToken() {
  return localStorage.getItem("token");
}

function formatError(err: unknown): string {
  const e = err as { detail?: unknown };
  if (!e || e.detail == null) return "Request failed";
  if (typeof e.detail === "string") return e.detail;
  if (Array.isArray(e.detail)) {
    return e.detail
      .map((item) => {
        const loc = Array.isArray(item?.loc) ? item.loc[item.loc.length - 1] : "field";
        return `${loc}: ${item?.msg ?? "invalid"}`;
      })
      .join("; ");
  }
  return "Request failed";
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
    throw new Error(formatError(err));
  }

  return res.json();
}

export const api = {
  register: (data: { name: string; email: string; password: string }) =>
    request("/auth/register", { method: "POST", body: JSON.stringify(data) }),

  login: (data: { email: string; password: string }) => {
    const form = new URLSearchParams();
    form.append("username", data.email);
    form.append("password", data.password);
    return fetch(`${BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: form,
    }).then(async (res) => {
      if (!res.ok) {
        const err = await res.json().catch(() => ({ detail: res.statusText }));
        throw new Error(formatError(err));
      }
      return res.json();
    });
  },

  createGroup: (name: string) =>
    request("/groups", { method: "POST", body: JSON.stringify({ name }) }),

  listGroups: () => request("/groups"),

  listUsers: (search?: string) => {
    console.log("listUsers called with:", search);
    console.trace("Called from");
    return request(
      `/users${search ? `?search=${encodeURIComponent(search)}` : ""}`
  );
},

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
