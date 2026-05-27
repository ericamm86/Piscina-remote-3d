import { useEffect, useMemo, useState } from "react";
import { AddressSearch } from "./components/AddressSearch";
import { Configurator } from "./components/Configurator";
import { KpiStrip } from "./components/KpiStrip";
import { MapPanel } from "./components/MapPanel";
import { ThreePoolScene } from "./components/ThreePoolScene";
import { Toast } from "./components/Toast";
import { api } from "./lib/api";

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
  const [toast, setToast] = useState("");
  const [loading, setLoading] = useState({ address: false, estimate: false, save: false });

  const selectedModel = useMemo(
    () => models.find((model) => model.id === poolConfig.modelId) || models[0],
    [models, poolConfig.modelId]
  );

  useEffect(() => {
    api.pools().then(setModels).catch(() => setModels([]));
    handleSearch("7620 Toscana Blvd, Orlando, FL");
  }, []);

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
      setToast("Envie uma imagem em formato JPG, PNG ou WebP.");
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
    setToast("Imagem real carregada como base do terreno.");
  }

  function handleSiteImageRemove() {
    setSiteImage((current) => {
      if (current?.url) URL.revokeObjectURL(current.url);
      return null;
    });
    setToast("Imagem real removida. Mapa demo reativado.");
  }

  async function handleSearch(address) {
    setLoading((current) => ({ ...current, address: true }));
    try {
      const result = await api.geocode(address);
      setGeocode(result);
      setToast("Terreno localizado e convertido para coordenadas geograficas.");
    } catch (error) {
      setToast(error.message);
    } finally {
      setLoading((current) => ({ ...current, address: false }));
    }
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
      setToast("Orcamento preliminar gerado.");
    } catch (error) {
      setToast(error.message);
    } finally {
      setLoading((current) => ({ ...current, estimate: false }));
    }
  }

  async function handleSave() {
    if (!geocode) {
      setToast("Busque um endereco antes de salvar.");
      return;
    }

    setLoading((current) => ({ ...current, save: true }));
    try {
      await api.saveProject({
        name: "Conceito residencial com piscina",
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
      setToast("Projeto salvo no backend demo.");
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
            <span>Sensoriamento remoto para piscinas residenciais</span>
          </div>
        </div>
        <nav aria-label="Modulos do sistema">
          <a href="#mapa">Mapa</a>
          <a href="#studio">3D</a>
          <a href="#docs">SaaS</a>
        </nav>
      </header>

      <section className="hero-band">
        <div className="hero-copy">
          <span className="eyebrow">Arquitetura, GIS e visualizacao</span>
          <h1>Pre-visualizacao 3D de piscinas usando imagens aereas</h1>
          <p>
            Localize o endereco do cliente, selecione a area do quintal e apresente uma proposta visual antes da visita tecnica.
          </p>
        </div>
        <AddressSearch onSearch={handleSearch} loading={loading.address} />
      </section>

      <KpiStrip geocode={geocode} />

      <section className="workspace" id="mapa">
        <MapPanel
          geocode={geocode}
          poolConfig={poolConfig}
          siteImage={siteImage}
          onSiteImageUpload={handleSiteImageUpload}
          onSiteImageRemove={handleSiteImageRemove}
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
          <ThreePoolScene model={selectedModel} poolConfig={poolConfig} />
          <Configurator
            models={models}
            poolConfig={poolConfig}
            onChange={setPoolConfig}
            onEstimate={handleEstimate}
            onSave={handleSave}
            estimate={estimate}
            estimating={loading.estimate}
            saving={loading.save}
          />
        </div>
      </section>

      <section className="architecture-strip" id="docs">
        <div>
          <span className="eyebrow">Roadmap tecnico</span>
          <h2>MVP pronto para evoluir para SaaS</h2>
        </div>
        <p>
          Backend modular, banco PostgreSQL planejado, autenticacao por token, APIs Google Maps, camada GIS e motor 3D isolado para futuras rotinas de IA, drone e realidade aumentada.
        </p>
      </section>

      <Toast message={toast} />
    </main>
  );
}
