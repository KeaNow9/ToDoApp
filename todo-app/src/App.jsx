import { useState } from "react";
import { useTodos } from "./features/todo/hooks/useTodos";

export default function App() {
  const {
    filtered,
    remaining,
    add,
    toggle,
    edit,
    remove,
    clear,
    filter,
    setFilter,
    query,
    setQuery,
  } = useTodos();
  const [title, setTitle] = useState("");

  function submit(e) {
    e.preventDefault();
    if (!title.trim()) return;
    add(title);
    setTitle("");
  }

  return (
    <div className="wrap">
      <header className="header">
        <h1>Ma To-Do</h1>
        <div className="counter" aria-live="polite">
          {remaining} tâche{remaining > 1 ? "s" : ""} à faire
        </div>
      </header>

      <form className="add" onSubmit={submit} autoComplete="off">
        <label className="sr-only" htmlFor="todo-input">Nouvelle tâche</label>
        <input
          id="todo-input"
          name="title"
          type="text"
          placeholder="Ex.: Réviser le chapitre 3…"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <button className="primary" type="submit">Ajouter</button>
      </form>

      <div className="toolbar">
        <div className="filters" role="tablist" aria-label="Filtres">
          {["all", "active", "done"].map((f) => (
            <button
              key={f}
              role="tab"
              aria-selected={filter === f}
              className={filter === f ? "active" : ""}
              onClick={() => setFilter(f)}
            >
              {f === "all" ? "Toutes" : f === "active" ? "Actives" : "Terminées"}
            </button>
          ))}
        </div>

        <div className="search">
          <label className="sr-only" htmlFor="search-input">Rechercher</label>
          <input
            id="search-input"
            type="text"
            placeholder="Recherche…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button type="button" className="danger" onClick={clear}>
            Tout effacer
          </button>
        </div>
      </div>

      {filtered.length === 0 ? (
        <p className="empty">Aucune tâche. Ajoute ta première ci-dessus ✨</p>
      ) : (
        <ul className="list" aria-live="polite">
          {filtered.map((t) => (
            <TodoItem
              key={t.id}
              todo={t}
              onToggle={() => toggle(t.id)}
              onRemove={() => remove(t.id)}
              onEdit={(next) => edit(t.id, next)}
            />
          ))}
        </ul>
      )}
    </div>
  );
}

function TodoItem({ todo, onToggle, onRemove, onEdit }) {
  const [editing, setEditing] = useState(false);
  const [temp, setTemp] = useState(todo.title);

  function commit() {
    setEditing(false);
    if (temp.trim() && temp !== todo.title) onEdit(temp);
  }

  return (
    <li className={`item ${todo.done ? "done" : ""}`} data-id={todo.id}>
      <input
        type="checkbox"
        checked={todo.done}
        onChange={onToggle}
        aria-label="Marquer comme terminée"
      />

      {editing ? (
        <input
          className="edit"
          value={temp}
          onChange={(e) => setTemp(e.target.value)}
          onBlur={commit}
          onKeyDown={(e) => {
            if (e.key === "Enter") commit();
            if (e.key === "Escape") {
              setTemp(todo.title);
              setEditing(false);
            }
          }}
          autoFocus
        />
      ) : (
        <div className="title" onDoubleClick={() => setEditing(true)}>
          {todo.title}
        </div>
      )}

      <div className="meta">{new Date(todo.createdAt).toLocaleString()}</div>
      <button onClick={onRemove}>Supprimer</button>
    </li>
  );
}
