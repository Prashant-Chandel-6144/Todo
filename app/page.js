"use client";

import { useEffect, useState } from "react";

export default function Home() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [todos, setTodos] = useState([]);
  const [status, setStatus] = useState("TODO");
  const [priority, setPriority] = useState("LOW");

  const handleEdit = async () => {
    
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure")) return;
    try {
      const res = await fetch(`/api/todo/${id}`, { method: "DELETE" });
      if (res.ok) fetchTodos();
    } catch (error) {
      alert("Error Deleting Todo");
      console.log("Error deleting todo", error);
    }
  };

  const fetchTodos = async () => {
    try {
      const res = await fetch("/api/todo");
      const data = await res.json();
      setTodos(data);
    } catch (error) {
      console.log("Error fetching todos:", error);
    }
  };

  useEffect(() => { fetchTodos(); }, []);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!title || !description) { alert("Please fill the required fields"); return; }
    try {
      setIsLoading(true);
      const res = await fetch("/api/todo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description, status, priority }),
      });
      if (res.ok) {
        alert("Todo Created Successfully");
        setTitle("");
        setDescription("");
        fetchTodos();
      }
    } catch (error) {
      alert("Error saving todo...");
      console.log("Error saving todo", error);
    } finally {
      setIsLoading(false);
    }
  };

  const priorityBadge = {
    HIGH:   "border border-red-500/30 text-red-400 bg-red-500/10",
    MEDIUM: "border border-amber-500/30 text-amber-400 bg-amber-500/10",
    LOW:    "border border-emerald-500/30 text-emerald-400 bg-emerald-500/10",
  };

  const inputClass =
    "w-full bg-black border border-neutral-800 rounded-md px-3 py-2 text-sm text-neutral-100 placeholder-neutral-600 outline-none focus:border-neutral-500 transition-colors";

  const labelClass = "text-xs uppercase tracking-widest text-neutral-500";

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-neutral-100 px-6 py-12 font-mono">

      {/* ── Header ── */}
      <header className="max-w-3xl mx-auto mb-12 border-b border-neutral-800 pb-6">
        <h1 className="text-2xl font-semibold tracking-tight mb-1">
          <span className="text-[#e8ff44]">_</span>todo
        </h1>
        <p className="text-xs text-neutral-500 tracking-wide">A simple fullstack todo application</p>
      </header>

      {/* ── Layout ── */}
      <div className="max-w-3xl mx-auto grid grid-cols-1 md:grid-cols-[320px_1fr] gap-8 items-start">

        {/* ── Form ── */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
          <h2 className="text-xs uppercase tracking-widest text-neutral-500 mb-6">New Task</h2>
          <form onSubmit={onSubmit} className="flex flex-col gap-4">

            <div className="flex flex-col gap-1.5">
              <label className={labelClass}>Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter todo title..."
                className={inputClass}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className={labelClass}>Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter todo description..."
                rows={5}
                className={inputClass + " resize-none"}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <label htmlFor="status" className={labelClass}>Status</label>
                <select
                  id="status"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className={inputClass}
                >
                  <option value="PENDING">PENDING</option>
                  <option value="TODO">TODO</option>
                  <option value="COMPLETED">COMPLETED</option>
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="priority" className={labelClass}>Priority</label>
                <select
                  id="priority"
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  className={inputClass}
                >
                  <option value="HIGH">HIGH</option>
                  <option value="MEDIUM">MEDIUM</option>
                  <option value="LOW">LOW</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-1 py-2.5 bg-[#e8ff44] text-black text-xs font-semibold uppercase tracking-widest rounded-md hover:opacity-85 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              {isLoading ? "Adding..." : "Add Todo"}
            </button>

          </form>
        </div>

        {/* ── List ── */}
        <div>
          <h2 className="text-xs uppercase tracking-widest text-neutral-500 mb-4">
            Tasks — {todos.length}
          </h2>

          {todos.length === 0 ? (
            <div className="border border-dashed border-neutral-800 rounded-xl py-16 text-center">
              <p className="text-sm text-neutral-600">No todos yet. Create one →</p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {todos.map((todo) => (
                <div
                  key={todo._id}
                  className="bg-neutral-900 border border-neutral-800 hover:border-neutral-700 rounded-xl px-5 py-4 transition-colors"
                >
                  <p className="text-sm font-medium text-neutral-100 mb-1">{todo.title}</p>
                  <p className="text-xs text-neutral-500 leading-relaxed mb-4">{todo.description}</p>

                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded border border-neutral-700 text-neutral-500">
                      {todo.status}
                    </span>
                    <span className={`text-[10px] uppercase tracking-wider px-2 py-0.5 rounded ${priorityBadge[todo.priority]}`}>
                      {todo.priority}
                    </span>

                    <div className="ml-auto flex gap-2">
                      <button
                        onClick={handleEdit}
                        className="text-[10px] uppercase tracking-wider px-2.5 py-1 rounded border border-neutral-800 text-neutral-500 hover:border-[#e8ff44] hover:text-[#e8ff44] transition-colors cursor-pointer"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(todo._id)}
                        className="text-[10px] uppercase tracking-wider px-2.5 py-1 rounded border border-neutral-800 text-neutral-500 hover:border-red-500 hover:text-red-400 transition-colors cursor-pointer"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}