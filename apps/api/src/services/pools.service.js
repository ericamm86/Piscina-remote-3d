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

const materialPricing = {
  interior: {
    "glass-mosaic": 420,
    porcelain: 620,
    "blue-vinyl": 180,
    "stone-texture": 760
  },
  coping: {
    travertine: 260,
    "white-marble": 520,
    "brushed-concrete": 210,
    "dark-stone": 430
  },
  deck: {
    cumaru: 1200,
    "porcelain-deck": 980,
    "natural-stone": 1350,
    "composite-wood": 1120
  },
  lighting: {
    "warm-led": 8500,
    "cool-led": 9200,
    "rgb-led": 12800
  }
};

export function estimateProjectCost(payload) {
  const model = poolModels.find((item) => item.id === payload.poolModelId) || poolModels[0];
  const area = model.dimensions.width * model.dimensions.length;
  const deckArea = area * 1.45;
  const materials = {
    interior: "glass-mosaic",
    coping: "travertine",
    deck: "cumaru",
    lighting: "warm-led",
    ...payload.materials
  };
  const interior = area * (materialPricing.interior[materials.interior] || materialPricing.interior["glass-mosaic"]);
  const coping = (model.dimensions.width + model.dimensions.length) * 2 * (materialPricing.coping[materials.coping] || materialPricing.coping.travertine);
  const deck = payload.features?.deck ? deckArea * (materialPricing.deck[materials.deck] || materialPricing.deck.cumaru) : 0;
  const lighting = payload.features?.lighting ? materialPricing.lighting[materials.lighting] || materialPricing.lighting["warm-led"] : 0;
  const trees = payload.features?.trees ? 4500 : 0;
  const gourmet = payload.features?.gourmet ? 26000 : 0;
  const terrainComplexity = payload.remoteSensing?.slopeRisk === "high" ? 1.18 : 1;
  const subtotal = (model.basePrice + interior + coping + deck + lighting + trees + gourmet) * terrainComplexity;

  return {
    currency: "BRL",
    model: model.name,
    estimatedAreaM2: area,
    subtotal: Math.round(subtotal),
    contingency: Math.round(subtotal * 0.12),
    total: Math.round(subtotal * 1.12),
    breakdown: {
      basePool: model.basePrice,
      interior: Math.round(interior),
      coping: Math.round(coping),
      deck: Math.round(deck),
      lighting: Math.round(lighting),
      landscaping: Math.round(trees),
      gourmet: Math.round(gourmet)
    },
    materials,
    notes: [
      "Estimativa conceitual para MVP academico.",
      "A vistoria tecnica deve validar medidas, recuos, drenagem e normas locais."
    ]
  };
}
