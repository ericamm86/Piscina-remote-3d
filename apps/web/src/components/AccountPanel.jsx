import { Lock, LogOut, ShieldCheck, UserPlus } from "lucide-react";
import { useRef, useState } from "react";

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
    name: "",
    email: "",
    password: ""
  });
  const firstInputRef = useRef(null);

  function selectMode(nextMode) {
    setMode(nextMode);
    window.setTimeout(() => firstInputRef.current?.focus(), 0);
  }

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
            <button className={mode === "login" ? "active" : ""} type="button" onClick={() => selectMode("login")}>
              <Lock size={15} />
              {t.haveAccount}
            </button>
            <button className={mode === "register" ? "active" : ""} type="button" onClick={() => selectMode("register")}>
              <UserPlus size={15} />
              {t.newAccount}
            </button>
          </div>
          {mode === "register" && (
            <label>
              {t.name}
              <input
                ref={firstInputRef}
                autoComplete="name"
                name="name"
                required
                value={form.name}
                onChange={(event) => setForm({ ...form, name: event.target.value })}
              />
            </label>
          )}
          <label>
            {t.email}
            <input
              ref={mode === "login" ? firstInputRef : null}
              autoComplete="email"
              name="email"
              required
              type="email"
              value={form.email}
              onChange={(event) => setForm({ ...form, email: event.target.value })}
            />
          </label>
          <label>
            {t.password}
            <input
              autoComplete={mode === "login" ? "current-password" : "new-password"}
              name="password"
              required
              type="password"
              value={form.password}
              onChange={(event) => setForm({ ...form, password: event.target.value })}
            />
          </label>
          <button className="auth-submit" type="submit" disabled={loading}>
            {loading ? t.authLoading : mode === "login" ? t.loginAction : t.registerAction}
          </button>
        </form>
      )}
    </section>
  );
}
