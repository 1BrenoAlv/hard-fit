CREATE TABLE IF NOT EXISTS site_settings (
    id INTEGER PRIMARY KEY,
    hotmart_url VARCHAR(2048),
    hero_image_url VARCHAR(2048),
    fat_loss_image_url VARCHAR(2048),
    strength_image_url VARCHAR(2048),
    consistency_image_url VARCHAR(2048)
);

INSERT INTO site_settings (id)
SELECT 1 WHERE NOT EXISTS (SELECT 1 FROM site_settings WHERE id = 1);

CREATE TABLE IF NOT EXISTS evolutions (
    id UUID PRIMARY KEY,
    title VARCHAR(120) NOT NULL,
    before_image_url VARCHAR(2048) NOT NULL,
    after_image_url VARCHAR(2048) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
