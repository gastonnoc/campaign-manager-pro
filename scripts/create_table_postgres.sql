-- Script para crear la tabla de campañas en PostgreSQL (RDS)
-- Ejecuta este script en tu base de datos PostgreSQL

CREATE TABLE IF NOT EXISTS campaigns (
    id VARCHAR(255) PRIMARY KEY,
    name VARCHAR(500) NOT NULL,
    client VARCHAR(255) NOT NULL,
    platform VARCHAR(100) NOT NULL,
    budget DECIMAL(15, 2) NOT NULL CHECK (budget > 0),
    units INTEGER NOT NULL CHECK (units > 0),
    margin DECIMAL(15, 2) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    status VARCHAR(20) NOT NULL CHECK (status IN ('active', 'paused', 'completed')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices para mejorar el rendimiento
CREATE INDEX idx_campaigns_client ON campaigns(client);
CREATE INDEX idx_campaigns_platform ON campaigns(platform);
CREATE INDEX idx_campaigns_status ON campaigns(status);
CREATE INDEX idx_campaigns_dates ON campaigns(start_date, end_date);

-- Función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger para actualizar updated_at
CREATE TRIGGER update_campaigns_updated_at
    BEFORE UPDATE ON campaigns
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Insertar datos de ejemplo
INSERT INTO campaigns (id, name, client, platform, budget, units, margin, start_date, end_date, status)
VALUES 
    ('1', 'Campaña Verano 2025', 'Tech Corp', 'Google Ads', 50000.00, 10000, 5.00, '2025-01-01', '2025-03-31', 'active'),
    ('2', 'Lanzamiento Producto X', 'Fashion Brand', 'Meta Ads', 75000.00, 15000, 5.00, '2025-02-01', '2025-04-30', 'active');

COMMENT ON TABLE campaigns IS 'Tabla de campañas publicitarias';
COMMENT ON COLUMN campaigns.margin IS 'Calculado como budget / units';
