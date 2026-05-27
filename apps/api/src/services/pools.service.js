export const poolModels = [
  {
    id: "lap-modern",
    name: "Retangular Infinity",
    category: "premium",
    dimensions: { width: 4, length: 8, depth: 1.4 },
    basePrice: 92000,
    finish: "porcelanato claro"
  },
  {
    id: "family-freeform",
    name: "Organic Family",
    category: "residential",
    dimensions: { width: 5, length: 7, depth: 1.35 },
    basePrice: 78000,
    finish: "vinil azul"
  },
  {
    id: "compact-spa",
    name: "Compact Spa",
    category: "urban",
    dimensions: { width: 3, length: 5, depth: 1.2 },
    basePrice: 54000,
    finish: "pastilha verde agua"
  }
];

export function estimateProjectCost(payload) {
  const model = poolModels.find((item) => item.id === payload.poolModelId) || poolModels[0];
  const area = model.dimensions.width * model.dimensions.length;
  const deck = payload.features?.deck ? area * 1200 : 0;
  const lighting = payload.features?.lighting ? 8500 : 0;
  const trees = payload.features?.trees ? 4500 : 0;
  const gourmet = payload.features?.gourmet ? 26000 : 0;
  const terrainComplexity = payload.remoteSensing?.slopeRisk === "high" ? 1.18 : 1;
  const subtotal = (model.basePrice + deck + lighting + trees + gourmet) * terrainComplexity;

  return {
    currency: "BRL",
    model: model.name,
    estimatedAreaM2: area,
    subtotal: Math.round(subtotal),
    contingency: Math.round(subtotal * 0.12),
    total: Math.round(subtotal * 1.12),
    notes: [
      "Estimativa conceitual para MVP academico.",
      "A vistoria tecnica deve validar medidas, recuos, drenagem e normas locais."
    ]
  };
}
