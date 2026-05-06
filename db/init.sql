CREATE TABLE IF NOT EXISTS activity_records (
  id TEXT PRIMARY KEY,
  date DATE NOT NULL,
  activity_type TEXT NOT NULL,
  description TEXT NOT NULL,
  amount NUMERIC NOT NULL,
  unit TEXT NOT NULL,
  source TEXT NOT NULL DEFAULT 'manual',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS emission_factors (
  id SERIAL PRIMARY KEY,
  activity_type TEXT NOT NULL,
  description TEXT NOT NULL,
  activity_unit TEXT NOT NULL,
  factor NUMERIC NOT NULL,
  factor_unit TEXT NOT NULL,
  version TEXT NOT NULL DEFAULT 'v1',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE (activity_type, description, activity_unit, version)
);

INSERT INTO emission_factors
  (activity_type, description, activity_unit, factor, factor_unit, version)
VALUES
  ('electricity', '한국전력', 'kWh', 0.456, 'kgCO2e/kWh', 'v1'),
  ('raw_material', '플라스틱 1', 'kg', 2.3, 'kgCO2e/kg', 'v1'),
  ('raw_material', '플라스틱 2', 'kg', 3.2, 'kgCO2e/kg', 'v1'),
  ('transportation', '트럭', 'ton-km', 3.5, 'kgCO2e/ton-km', 'v1')
ON CONFLICT (activity_type, description, activity_unit, version) DO NOTHING;