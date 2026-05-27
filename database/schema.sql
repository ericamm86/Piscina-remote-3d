CREATE EXTENSION IF NOT EXISTS postgis;
CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'client',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE pool_models (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  width_m NUMERIC(8, 2) NOT NULL,
  length_m NUMERIC(8, 2) NOT NULL,
  depth_m NUMERIC(8, 2) NOT NULL,
  base_price_cents INTEGER NOT NULL,
  metadata JSONB NOT NULL DEFAULT '{}'
);

CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID REFERENCES users(id),
  name TEXT NOT NULL,
  address TEXT NOT NULL,
  coordinate GEOGRAPHY(POINT, 4326) NOT NULL,
  selected_area GEOMETRY(POLYGON, 4326),
  pool_model_id TEXT REFERENCES pool_models(id),
  pool_config JSONB NOT NULL DEFAULT '{}',
  remote_sensing JSONB NOT NULL DEFAULT '{}',
  status TEXT NOT NULL DEFAULT 'concept',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX projects_coordinate_idx ON projects USING GIST (coordinate);
CREATE INDEX projects_selected_area_idx ON projects USING GIST (selected_area);

CREATE TABLE estimates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  subtotal_cents INTEGER NOT NULL,
  contingency_cents INTEGER NOT NULL,
  total_cents INTEGER NOT NULL,
  currency TEXT NOT NULL DEFAULT 'BRL',
  assumptions JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
