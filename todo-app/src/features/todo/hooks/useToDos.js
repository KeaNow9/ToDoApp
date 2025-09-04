import { useEffect, useMemo, useState } from "react";
import { loadTodos, saveTodos } from "../storage";
import { applyFilterAndSearch } from "../filters";

const uid = () => crypto.randomUUID?.() || Math.random().toString(36).slice(2);

export function useTodos() {
  const [todos, setTodos] = useState(() => loadTodos());
  const [filter, setFilter] = useState("all");   // "all" | "active" | "done"
  const [query, setQuery] = useState("");

  useEffect(() => { saveTodos(todos); }, [todos]);

  const filtered = useMemo(
    () => applyFilterAndSearch(todos, filter, query),
    [todos, filter, query]
  );
  const remaining = useMemo(() => todos.filter((t) => !t.done).length, [todos]);

  function add(title) {
    const t = (title || "").trim();
    if (!t) return;
    setTodos((p) => [{ id: uid(), title: t, done: false, createdAt: Date.now() }, ...p]);
  }
  function toggle(id) { setTodos((p) => p.map((t) => (t.id === id ? { ...t, done: !t.done } : t))); }
  function edit(id, title) {
    const t = (title || "").trim(); if (!t) return;
    setTodos((p) => p.map((x) => (x.id === id ? { ...x, title: t } : x)));
  }
  function remove(id) { setTodos((p) => p.filter((t) => t.id !== id)); }
  function clear() { setTodos([]); }

  return { todos, filtered, remaining, add, toggle, edit, remove, clear, filter, setFilter, query, setQuery };
}
