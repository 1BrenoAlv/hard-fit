package br.com.hardfit.repository;

import br.com.hardfit.model.Evolution;
import br.com.hardfit.model.SiteSettings;
import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public class SiteContentRepository {
    private final JdbcClient jdbc;

    public SiteContentRepository(JdbcClient jdbc) {
        this.jdbc = jdbc;
    }

    public SiteSettings findSettings() {
        return jdbc.sql("""
                SELECT hotmart_url, hero_image_url, fat_loss_image_url, strength_image_url, consistency_image_url
                FROM site_settings WHERE id = 1
                """).query(SiteSettings.class).single();
    }

    public void updateSettings(SiteSettings settings) {
        jdbc.sql("""
                UPDATE site_settings
                SET hotmart_url = :hotmartUrl, hero_image_url = :heroImageUrl,
                    fat_loss_image_url = :fatLossImageUrl, strength_image_url = :strengthImageUrl,
                    consistency_image_url = :consistencyImageUrl
                WHERE id = 1
                """).paramSource(settings).update();
    }

    public List<Evolution> findEvolutions() {
        return jdbc.sql("""
                SELECT id, title, before_image_url, after_image_url
                FROM evolutions ORDER BY created_at DESC, id
                """).query(Evolution.class).list();
    }

    public void insertEvolution(Evolution evolution) {
        jdbc.sql("""
                INSERT INTO evolutions (id, title, before_image_url, after_image_url)
                VALUES (:id, :title, :beforeImageUrl, :afterImageUrl)
                """).paramSource(evolution).update();
    }

    public boolean updateEvolution(Evolution evolution) {
        return jdbc.sql("""
                UPDATE evolutions SET title = :title, before_image_url = :beforeImageUrl,
                    after_image_url = :afterImageUrl WHERE id = :id
                """).paramSource(evolution).update() > 0;
    }

    public boolean deleteEvolution(UUID id) {
        return jdbc.sql("DELETE FROM evolutions WHERE id = :id").param("id", id).update() > 0;
    }
}
