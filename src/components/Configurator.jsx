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
import { formatArea, formatCurrency, formatLength } from "../lib/i18n";

const colors = [
  { value: "#1da9c9", name: "Lagoon" },
  { value: "#18b79a", name: "Aqua" },
  { value: "#2f79d6", name: "Deep" },
  { value: "#49c5f6", name: "Crystal" }
];

export function Configurator({
  models,
  poolConfig,
  onChange,
  onEstimate,
  onSave,
  estimate,
  saving,
  estimating,
  language,
  t
}) {
  const [activeTab, setActiveTab] = useState("design");
  const tabs = [
    { id: "design", label: t.tabDesign, icon: Grid2X2 },
    { id: "materials", label: t.tabMaterials, icon: Palette },
    { id: "extras", label: t.tabExtras, icon: Layers }
  ];
  const featureOptions = [
    { key: "deck", label: t.perimeterDeck, detail: t.deckDetail, icon: Layers },
    { key: "lighting", label: t.ledLighting, detail: t.lightingDetail, icon: Lightbulb },
    { key: "trees", label: t.landscaping, detail: t.landscapingDetail, icon: Trees },
    { key: "gourmet", label: t.gourmetArea, detail: t.gourmetDetail, icon: Lamp }
  ];
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
          <span className="eyebrow">{t.studio}</span>
          <h2>{t.configurator}</h2>
          <p>{t.configSubtitle}</p>
        </div>
        <Sparkles size={22} />
      </div>

      <div className="config-tabs" role="tablist" aria-label={t.configTabsLabel}>
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
            <span>{t.technicalCatalog}</span>
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
                    <strong>{t.models[model.id] || model.name}</strong>
                    <small>
                      {model.dimensions.width} x {model.dimensions.length} m / {t.categories[model.category] || model.category}
                    </small>
                  </span>
                </button>
              );
            })}
          </div>

          <label className="precision-field">
            <span>
              {t.projectScale}
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
              {t.rotation2d}
              <strong>{poolConfig.footprint?.rotation || 0} {t.degrees}</strong>
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
              <Metric label={t.width} value={formatLength(scaledDimensions.width)} />
              <Metric label={t.length} value={formatLength(scaledDimensions.length)} />
              <Metric label={t.depth} value={formatLength(scaledDimensions.depth)} />
              <Metric label={t.area} value={formatArea(scaledDimensions.area, language)} />
            </div>
          )}
        </div>
      )}

      {activeTab === "materials" && (
        <div className="config-section">
          <div className="section-title">
            <Droplets size={16} />
            <span>{t.waterFinish}</span>
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
              <span>{t.edge}</span>
              <strong>{t.travertine}</strong>
            </div>
            <div>
              <span>{t.deck}</span>
              <strong>{t.cumaru}</strong>
            </div>
            <div>
              <span>{t.lining}</span>
              <strong>{t.finishes[selectedModel?.id] || t.premiumTile}</strong>
            </div>
          </div>
        </div>
      )}

      {activeTab === "extras" && (
        <div className="config-section">
          <div className="section-title">
            <Layers size={16} />
            <span>{t.exteriorComponents}</span>
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
          <span>{t.lotPosition}</span>
          <strong>X {poolConfig.position.x} / Y {poolConfig.position.y}</strong>
        </div>
        <div>
          <span>{t.compatibility}</span>
          <strong>{t.conceptApproved}</strong>
        </div>
      </div>

      <div className="actions pro-actions">
        <button type="button" onClick={onEstimate} disabled={estimating}>
          <CircleDollarSign size={18} />
          {estimating ? t.estimating : t.estimate}
        </button>
        <button className="secondary" type="button" onClick={onSave} disabled={saving}>
          <Save size={18} />
          {saving ? t.saving : t.save}
        </button>
      </div>

      {estimate && (
        <div className="estimate-card">
          <span>{t.conceptualEstimate}</span>
          <strong>{formatCurrency(estimate.total, language)}</strong>
          <small>{t.models[poolConfig.modelId] || estimate.model} / {formatArea(estimate.estimatedAreaM2, language)}</small>
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
