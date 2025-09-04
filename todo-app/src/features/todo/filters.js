export function applyFilterAndSearch(todos, filter, query) {
  const q = (query || "").trim().toLowerCase();
  return todos
    .filter((t) => (filter === "active" ? !t.done : filter === "done" ? t.done : true))
    .filter((t) => t.title.toLowerCase().includes(q));
}
