import React, { useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import "./style.css";

const initialTasks = [
  { id: 1, title: "اختبار Container Build", status: "done" },
  { id: 2, title: "تشغيل npm install", status: "doing" },
  { id: 3, title: "اختبار النشر الحقيقي", status: "todo" }
];

function App() {
  const [tasks, setTasks] = useState(initialTasks);
  const [text, setText] = useState("");
  const [filter, setFilter] = useState("all");

  const visible = useMemo(
    () => filter === "all" ? tasks : tasks.filter(t => t.status === filter),
    [tasks, filter]
  );

  function addTask(e) {
    e.preventDefault();
    const title = text.trim();
    if (!title) return;
    setTasks([{ id: Date.now(), title, status: "todo" }, ...tasks]);
    setText("");
  }

  function cycleStatus(id) {
    setTasks(tasks.map(t => t.id !== id ? t : ({
      ...t,
      status: t.status === "todo" ? "doing" : t.status === "doing" ? "done" : "todo"
    })));
  }

  function removeTask(id) {
    setTasks(tasks.filter(t => t.id !== id));
  }

  const counts = {
    all: tasks.length,
    todo: tasks.filter(t => t.status === "todo").length,
    doing: tasks.filter(t => t.status === "doing").length,
    done: tasks.filter(t => t.status === "done").length
  };

  return (
    <main className="page">
      <section className="app">
        <header>
          <div>
            <span className="badge">CONTAINER BUILD TEST</span>
            <h1>لوحة مهام BuildMind</h1>
            <p>مشروع React/Vite حقيقي لاختبار البناء على الخادم.</p>
          </div>
          <div className="status">● جاهز للاختبار</div>
        </header>

        <div className="stats">
          <div><b>{counts.all}</b><span>كل المهام</span></div>
          <div><b>{counts.todo}</b><span>معلقة</span></div>
          <div><b>{counts.doing}</b><span>قيد التنفيذ</span></div>
          <div><b>{counts.done}</b><span>مكتملة</span></div>
        </div>

        <form onSubmit={addTask} className="add">
          <input value={text} onChange={e => setText(e.target.value)}
                 placeholder="اكتب مهمة جديدة..." />
          <button>إضافة مهمة</button>
        </form>

        <nav className="filters">
          {[
            ["all","الكل"],["todo","معلقة"],["doing","قيد التنفيذ"],["done","مكتملة"]
          ].map(([key,label]) =>
            <button key={key} className={filter===key ? "active":""}
              onClick={() => setFilter(key)}>{label}</button>
          )}
        </nav>

        <section className="tasks">
          {visible.map(task =>
            <article className="task" key={task.id}>
              <div>
                <strong>{task.title}</strong>
                <small>{task.status === "done" ? "مكتملة" : task.status === "doing" ? "قيد التنفيذ" : "معلقة"}</small>
              </div>
              <div className="actions">
                <button onClick={() => cycleStatus(task.id)}>تغيير الحالة</button>
                <button className="danger" onClick={() => removeTask(task.id)}>حذف</button>
              </div>
            </article>
          )}
          {!visible.length && <div className="empty">لا توجد مهام في هذا القسم.</div>}
        </section>

        <footer>
          <span>BuildMind</span>
          <span>React + Vite</span>
          <span>npm install → npm run build</span>
        </footer>
      </section>
    </main>
  );
}

createRoot(document.getElementById("root")).render(<App />);