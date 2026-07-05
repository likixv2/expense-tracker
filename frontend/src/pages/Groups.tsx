import { useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api/client";
import type { Group } from "../types";

export default function Groups() {
  const [name, setName] = useState("");
  const [groups, setGroups] = useState<Group[]>([]);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    const group = await api.createGroup(name);
    setGroups([...groups, group]);
    setName("");
  }

  return (
    <div>
      <h2>Your Groups</h2>
      <form onSubmit={handleCreate}>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Group name"
        />
        <button type="submit">Create Group</button>
      </form>
      <ul>
        {groups.map((g) => (
          <li key={g.id}>
            <Link to={`/groups/${g.id}`}>{g.name}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
