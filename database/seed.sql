INSERT INTO pool_models (id, name, category, width_m, length_m, depth_m, base_price_cents, metadata)
VALUES
  ('lap-modern', 'Retangular Infinity', 'premium', 4.00, 8.00, 1.40, 9200000, '{"finish":"porcelanato claro"}'),
  ('family-freeform', 'Organic Family', 'residential', 5.00, 7.00, 1.35, 7800000, '{"finish":"vinil azul"}'),
  ('compact-spa', 'Compact Spa', 'urban', 3.00, 5.00, 1.20, 5400000, '{"finish":"pastilha verde agua"}')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  width_m = EXCLUDED.width_m,
  length_m = EXCLUDED.length_m,
  depth_m = EXCLUDED.depth_m,
  base_price_cents = EXCLUDED.base_price_cents,
  metadata = EXCLUDED.metadata;
