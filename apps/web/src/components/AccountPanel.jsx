import { Lock, LogOut, ShieldCheck, UserPlus } from "lucide-react";
import { useState } from "react";

export function AccountPanel({
  t,
  authUser,
  projects,
  adminOverview,
  onLogin,
  onRegister,
  onLogout,
  loading,
  variant = "panel"
}) {
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({
    name: "Cliente Demo",
    email: "cliente@demo.com",
    password: "demo123"
  });

  function submit(event) {
    event.preventDefault();
    if (mode === "login") onLogin({ email: form.email, password: form.password });
    else onRegister(form);
  }

  return (
    <section className={variant === "login" ? "account-panel login-card" : "account-panel"}>
      <div className="panel-heading compact">
        <div>
          <span className="eyebrow">{t.authenticatedArea}</span>
          <h2>{t.account}</h2>
          <p>{t.authenticatedSubtitle}</p>
        </div>
        <ShieldCheck size={20} />
      </div>

      {authUser ? (
        <>
          <div className="session-card">
            <div>
              <strong>{authUser.name}</strong>
              <span>{authUser.email}</span>
              <small>{authUser.role}</small>
            </div>
            <button type="button" onClick={onLogout}>
              <LogOut size={16} />
              {t.logout}
            </button>
          </div>

          <div className="history-list">
            <h3>{t.projectHistory}</h3>
            {projects.length ? (
              projects.slice(0, 4).map((project) => (
                <div className="history-item" key={project.id}>
                  <strong>{project.name}</strong>
                  <span>{project.address}</span>
                </div>
              ))
            ) : (
              <p>{t.noProjects}</p>
            )}
          </div>

          {authUser.role === "admin" && adminOverview && (
            <div className="admin-mini">
              <h3>{t.adminPanel}</h3>
              <div>
                <span>{t.users}</span>
                <strong>{adminOverview.totals.users}</strong>
              </div>
              <div>
                <span>{t.projects}</span>
                <strong>{adminOverview.totals.projects}</strong>
              </div>
            </div>
          )}
        </>
      ) : (
        <form className="auth-form" onSubmit={submit}>
          <div className="auth-toggle">
            <button className={mode === "login" ? "active" : ""} type="button" onClick={() => setMode("login")}>
              <Lock size={15} />
              {t.login}
            </button>
            <button className={mode === "register" ? "active" : ""} type="button" onClick={() => setMode("register")}>
              <UserPlus size={15} />
              {t.register}
            </button>
          </div>

          {mode === "register" && (
            <label>
              {t.name}
              <input value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} />
            </label>
          )}
          <label>
            {t.email}
            <input type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} />
          </label>
          <label>
            {t.password}
            <input
              type="password"
              value={form.password}
              onChange={(event) => setForm({ ...form, password: event.target.value })}
            />
          </label>
          <button type="submit" disabled={loading}>
            {mode === "login" ? t.login : t.register}
          </button>
        </form>
      )}
    </section>
  );
}
