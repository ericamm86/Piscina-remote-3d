import { useEffect, useMemo, useState } from "react";
import { AccountPanel } from "./components/AccountPanel";
import { AddressSearch } from "./components/AddressSearch";
import { Configurator } from "./components/Configurator";
import { KpiStrip } from "./components/KpiStrip";
import { MapPanel } from "./components/MapPanel";
import { ThreePoolScene } from "./components/ThreePoolScene";
import { Toast } from "./components/Toast";
import { api } from "./lib/api";
import { translations } from "./lib/i18n";

const defaultConfig = {
  modelId: "lap-modern",
  color: "#1da9c9",
  scale: 1,
  position: { x: 62, y: 66 },
  footprint: { width: 190, height: 108, rotation: -7 },
  features: {
    deck: true,
    lighting: true,
    trees: true,
    gourmet: false
  }
};

export default function App() {
  const [models, setModels] = useState([]);
  const [poolConfig, setPoolConfig] = useState(defaultConfig);
  const [geocode, setGeocode] = useState(null);
  const [estimate, setEstimate] = useState(null);
  const [siteImage, setSiteImage] = useState(null);
  const [language, setLanguage] = useState("pt");
  const [authUser, setAuthUser] = useState(null);
  const [projects, setProjects] = useState([]);
  const [adminOverview, setAdminOverview] = useState(null);
  const [toast, setToast] = useState("");
  const [loading, setLoading] = useState({ address: false, estimate: false, save: false, auth: false });
  const t = translations[language];

  const selectedModel = useMemo(
    () => models.find((model) => model.id === poolConfig.modelId) || models[0],
    [models, poolConfig.modelId]
  );

  useEffect(() => {
    api
      .me()
      .then(({ user }) => {
        setAuthUser(user);
        refreshProjects(user);
      })
      .catch(() => api.setAuthToken(""));
  }, []);

  useEffect(() => {
    if (!authUser) return;
    api.pools().then(setModels).catch(() => setModels([]));
    handleSearch("7620 Toscana Blvd, Orlando, FL");
  }, [authUser]);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(""), 3200);
    return () => window.clearTimeout(timer);
  }, [toast]);

  useEffect(() => {
    return () => {
      if (siteImage?.url) URL.revokeObjectURL(siteImage.url);
    };
  }, []);

  function handleSiteImageUpload(file) {
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setToast(t.invalidImage);
      return;
    }

    setSiteImage((current) => {
      if (current?.url) URL.revokeObjectURL(current.url);
      return {
        name: file.name,
        size: file.size,
        url: URL.createObjectURL(file)
      };
    });
    setToast(t.imageLoaded);
  }

  function handleSiteImageRemove() {
    setSiteImage((current) => {
      if (current?.url) URL.revokeObjectURL(current.url);
      return null;
    });
    setToast(t.imageRemoved);
  }

  async function handleSearch(address) {
    setLoading((current) => ({ ...current, address: true }));
    try {
      const result = await api.geocode(address);
      setGeocode(result);
      setToast(t.geocoded);
    } catch (error) {
      setToast(error.message);
    } finally {
      setLoading((current) => ({ ...current, address: false }));
    }
  }

  async function refreshProjects(user = authUser) {
    if (!user) return;
    const savedProjects = await api.projects();
    setProjects(savedProjects);
    if (user.role === "admin") {
      setAdminOverview(await api.adminOverview());
    }
  }

  async function handleLogin(credentials) {
    setLoading((current) => ({ ...current, auth: true }));
    try {
      const result = await api.login(credentials);
      api.setAuthToken(result.token);
      setAuthUser(result.user);
      await refreshProjects(result.user);
      setToast(t.loggedIn);
    } catch (error) {
      setToast(error.message);
    } finally {
      setLoading((current) => ({ ...current, auth: false }));
    }
  }

  async function handleRegister(payload) {
    setLoading((current) => ({ ...current, auth: true }));
    try {
      const result = await api.register(payload);
      api.setAuthToken(result.token);
      setAuthUser(result.user);
      await refreshProjects(result.user);
      setToast(t.accountCreated);
    } catch (error) {
      setToast(error.message);
    } finally {
      setLoading((current) => ({ ...current, auth: false }));
    }
  }

  function handleLogout() {
    api.setAuthToken("");
    setAuthUser(null);
    setProjects([]);
    setAdminOverview(null);
    setToast(t.loggedOut);
  }

  if (!authUser) {
    return (
      <main className="login-shell">
        <section className="login-hero">
          <header className="login-topbar">
            <div>
              <span className="brand-mark">PS</span>
              <div>
                <strong>PoolSight Remote 3D</strong>
                <span>{t.brandSubtitle}</span>
              </div>
            </div>
            <div className="language-switcher" aria-label={t.language}>
              <button className={language === "pt" ? "active" : ""} type="button" onClick={() => setLanguage("pt")}>
                PT
              </button>
              <button className={language === "en" ? "active" : ""} type="button" onClick={() => setLanguage("en")}>
                EN
              </button>
            </div>
          </header>

          <div className="login-layout">
            <div className="login-copy">
              <span className="eyebrow">{t.heroEyebrow}</span>
              <h1>{t.loginHeroTitle}</h1>
              <p>{t.loginHeroText}</p>
              <div className="login-highlights">
                <span>{t.googleSatellite}</span>
                <span>{t.render3d}</span>
              </div>
            </div>
            <AccountPanel
              t={t}
              authUser={authUser}
              projects={projects}
              adminOverview={adminOverview}
              onLogin={handleLogin}
              onRegister={handleRegister}
              onLogout={handleLogout}
              loading={loading.auth}
              variant="login"
            />
          </div>
        </section>
        <Toast message={toast} />
      </main>
    );
  }

  async function handleEstimate() {
    setLoading((current) => ({ ...current, estimate: true }));
    try {
      const result = await api.estimate({
        poolModelId: poolConfig.modelId,
        features: poolConfig.features,
        remoteSensing: { slopeRisk: "low" }
      });
      setEstimate(result);
      setToast(t.estimateReady);
    } catch (error) {
      setToast(error.message);
    } finally {
      setLoading((current) => ({ ...current, estimate: false }));
    }
  }

  async function handleSave() {
    if (!geocode) {
      setToast(t.searchBeforeSave);
      return;
    }

    if (!authUser) {
      setToast(t.loginBeforeSave);
      return;
    }

    setLoading((current) => ({ ...current, save: true }));
    try {
      await api.saveProject({
        name: t.projectName,
        address: geocode.formattedAddress,
        coordinates: geocode.coordinates,
        poolModelId: poolConfig.modelId,
        poolConfig,
        estimate,
        remoteSensing: {
          crs: geocode.gis?.crs,
          imagery: geocode.provider,
          selectedBackyardPoint: poolConfig.position
        }
      });
      await refreshProjects();
      setToast(t.projectSaved);
    } catch (error) {
      setToast(error.message);
    } finally {
      setLoading((current) => ({ ...current, save: false }));
    }
  }

  return (
    <main className="app-shell">
      <header className="topbar">
        <div>
          <span className="brand-mark">PS</span>
          <div>
            <strong>PoolSight Remote 3D</strong>
            <span>{t.brandSubtitle}</span>
          </div>
        </div>
        <nav aria-label={t.navLabel}>
          <a href="#mapa">{t.navMap}</a>
          <a href="#studio">{t.nav3d}</a>
          {authUser.role === "admin" && <a href="#docs">{t.navSaas}</a>}
        </nav>
        <div className="language-switcher" aria-label={t.language}>
          <button className={language === "pt" ? "active" : ""} type="button" onClick={() => setLanguage("pt")}>
            PT
          </button>
          <button className={language === "en" ? "active" : ""} type="button" onClick={() => setLanguage("en")}>
            EN
          </button>
        </div>
      </header>

      <section className="hero-band">
        <div className="hero-copy">
          <span className="eyebrow">{t.heroEyebrow}</span>
          <h1>{t.heroTitle}</h1>
          <p>{t.heroText}</p>
        </div>
        <AddressSearch onSearch={handleSearch} loading={loading.address} t={t} />
      </section>

      <KpiStrip geocode={geocode} t={t} />

      <section className="workspace" id="mapa">
        <MapPanel
          geocode={geocode}
          poolConfig={poolConfig}
          siteImage={siteImage}
          onSiteImageUpload={handleSiteImageUpload}
          onSiteImageRemove={handleSiteImageRemove}
          t={t}
          onPoolLayoutChange={(layout) =>
            setPoolConfig((current) => ({
              ...current,
              position: layout.position || current.position,
              footprint: {
                ...current.footprint,
                ...layout.footprint
              }
            }))
          }
        />
        <div className="studio-column" id="studio">
          <ThreePoolScene model={selectedModel} poolConfig={poolConfig} t={t} />
          <Configurator
            models={models}
            poolConfig={poolConfig}
            onChange={setPoolConfig}
            onEstimate={handleEstimate}
            onSave={handleSave}
            estimate={estimate}
            estimating={loading.estimate}
            saving={loading.save}
            language={language}
            t={t}
          />
        </div>
      </section>

      {authUser.role === "admin" && (
        <section className="architecture-strip" id="docs">
          <div>
            <span className="eyebrow">{t.futureResourcesEyebrow}</span>
            <h2>{t.futureResourcesTitle}</h2>
          </div>
          <p>{t.futureResourcesText}</p>
        </section>
      )}

      <AccountPanel
        t={t}
        authUser={authUser}
        projects={projects}
        adminOverview={adminOverview}
        onLogin={handleLogin}
        onRegister={handleRegister}
        onLogout={handleLogout}
        loading={loading.auth}
      />

      <Toast message={toast} />
    </main>
  );
}
