import {
  CircleDollarSign,
  Droplets,
  Grid2X2,
  Lamp,
  Layers,
  Lightbulb,
  Palette,
  Ruler,
  Save,
  Sparkles,
  Trees
} from "lucide-react";
import { useMemo, useState } from "react";

const colors = [
  { value: "#1da9c9", name: "Lagoon" },
  { value: "#18b79a", name: "Aqua" },
  { value: "#2f79d6", name: "Deep" },
  { value: "#49c5f6", name: "Crystal" }
];

const tabs = [
  { id: "design", label: "Projeto", icon: Grid2X2 },
  { id: "materials", label: "Materiais", icon: Palette },
  { id: "extras", label: "Extras", icon: Layers }
];

const featureOptions = [
  { key: "deck", label: "Deck perimetral", detail: "Madeira ou cimenticio", icon: Layers },
  { key: "lighting", label: "Iluminacao LED", detail: "Pontos subaquaticos", icon: Lightbulb },
  { key: "trees", label: "Paisagismo", detail: "Vegetacao e sombra", icon: Trees },
  { key: "gourmet", label: "Area gourmet", detail: "Modulo externo", icon: Lamp }
];

export function Configurator({
  models,
  poolConfig,
  onChange,
  onEstimate,
  onSave,
  estimate,
  saving,
  estimating
}) {
  const [activeTab, setActiveTab] = useState("design");
  const selectedModel = useMemo(
    () => models.find((model) => model.id === poolConfig.modelId) || models[0],
    [models, poolConfig.modelId]
  );
  const scaledDimensions = selectedModel
    ? {
        width: selectedModel.dimensions.width * poolConfig.scale,
        length: selectedModel.dimensions.length * poolConfig.scale,
        depth: selectedModel.dimensions.depth,
        area: selectedModel.dimensions.width * selectedModel.dimensions.length * poolConfig.scale * poolConfig.scale
      }
    : null;

  function updateFeature(key) {
    onChange({
      ...poolConfig,
      features: {
        ...poolConfig.features,
        [key]: !poolConfig.features[key]
      }
    });
  }

  return (
    <aside className="config-panel">
      <div className="config-header">
        <div>
          <span className="eyebrow">Studio 3D</span>
          <h2>Configurador</h2>
          <p>Projeto conceitual, materiais e implantacao</p>
        </div>
        <Sparkles size={22} />
      </div>

      <div className="config-tabs" role="tablist" aria-label="Etapas do configurador">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              className={activeTab === tab.id ? "active" : ""}
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={activeTab === tab.id}
              onClick={() => setActiveTab(tab.id)}
            >
              <Icon size={15} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {activeTab === "design" && (
        <div className="config-section">
          <div className="section-title">
            <Ruler size={16} />
            <span>Catalogo tecnico</span>
          </div>

          <div className="model-list">
            {models.map((model) => {
              const active = model.id === poolConfig.modelId;
              return (
                <button
                  className={active ? "model-card active" : "model-card"}
                  key={model.id}
                  type="button"
                  onClick={() => onChange({ ...poolConfig, modelId: model.id })}
                >
                  <span className="pool-thumbnail">
                    <span className={`pool-shape ${model.id}`} />
                  </span>
                  <span>
                    <strong>{model.name}</strong>
                    <small>
                      {model.dimensions.width} x {model.dimensions.length} m / {model.category}
                    </small>
                  </span>
                </button>
              );
            })}
          </div>

          <label className="precision-field">
            <span>
              Escala do projeto
              <strong>{Math.round(poolConfig.scale * 100)}%</strong>
            </span>
            <input
              type="range"
              min="0.75"
              max="1.35"
              step="0.05"
              value={poolConfig.scale}
              onChange={(event) => onChange({ ...poolConfig, scale: Number(event.target.value) })}
            />
          </label>

          <label className="precision-field">
            <span>
              Rotacao 2D
              <strong>{poolConfig.footprint?.rotation || 0} deg</strong>
            </span>
            <input
              type="range"
              min="-90"
              max="90"
              step="1"
              value={poolConfig.footprint?.rotation || 0}
              onChange={(event) =>
                onChange({
                  ...poolConfig,
                  footprint: {
                    ...poolConfig.footprint,
                    rotation: Number(event.target.value)
                  }
                })
              }
            />
          </label>

          {scaledDimensions && (
            <div className="technical-grid">
              <Metric label="Largura" value={`${scaledDimensions.width.toFixed(1)} m`} />
              <Metric label="Comprimento" value={`${scaledDimensions.length.toFixed(1)} m`} />
              <Metric label="Profundidade" value={`${scaledDimensions.depth.toFixed(1)} m`} />
              <Metric label="Area" value={`${scaledDimensions.area.toFixed(1)} m2`} />
            </div>
          )}
        </div>
      )}

      {activeTab === "materials" && (
        <div className="config-section">
          <div className="section-title">
            <Droplets size={16} />
            <span>Agua e acabamento</span>
          </div>

          <div className="material-grid">
            {colors.map((color) => (
              <button
                className={poolConfig.color === color.value ? "material-swatch active" : "material-swatch"}
                key={color.value}
                type="button"
                title={color.name}
                onClick={() => onChange({ ...poolConfig, color: color.value })}
              >
                <span style={{ backgroundColor: color.value }} />
                <strong>{color.name}</strong>
                <small>{color.value}</small>
              </button>
            ))}
          </div>

          <div className="finish-board">
            <div>
              <span>Borda</span>
              <strong>Travertino claro</strong>
            </div>
            <div>
              <span>Deck</span>
              <strong>Madeira cumaru</strong>
            </div>
            <div>
              <span>Revestimento</span>
              <strong>{selectedModel?.finish || "Pastilha premium"}</strong>
            </div>
          </div>
        </div>
      )}

      {activeTab === "extras" && (
        <div className="config-section">
          <div className="section-title">
            <Layers size={16} />
            <span>Componentes externos</span>
          </div>

          <div className="addon-list">
            {featureOptions.map((feature) => {
              const Icon = feature.icon;
              const active = poolConfig.features[feature.key];
              return (
                <button
                  className={active ? "addon-row active" : "addon-row"}
                  key={feature.key}
                  type="button"
                  onClick={() => updateFeature(feature.key)}
                >
                  <Icon size={17} />
                  <span>
                    <strong>{feature.label}</strong>
                    <small>{feature.detail}</small>
                  </span>
                  <em>{active ? "ON" : "OFF"}</em>
                </button>
              );
            })}
          </div>
        </div>
      )}

      <div className="site-readout">
        <div>
          <span>Posicao no lote</span>
          <strong>X {poolConfig.position.x} / Y {poolConfig.position.y}</strong>
        </div>
        <div>
          <span>Compatibilidade</span>
          <strong>Conceito aprovado</strong>
        </div>
      </div>

      <div className="actions pro-actions">
        <button type="button" onClick={onEstimate} disabled={estimating}>
          <CircleDollarSign size={18} />
          {estimating ? "Calculando" : "Orcamento"}
        </button>
        <button className="secondary" type="button" onClick={onSave} disabled={saving}>
          <Save size={18} />
          {saving ? "Salvando" : "Salvar"}
        </button>
      </div>

      {estimate && (
        <div className="estimate-card">
          <span>Estimativa conceitual</span>
          <strong>{estimate.total.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</strong>
          <small>{estimate.model} / {estimate.estimatedAreaM2} m2</small>
        </div>
      )}
    </aside>
  );
}

function Metric({ label, value }) {
  return (
    <div>
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}
