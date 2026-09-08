package in.careersetu.common.config;

import com.zaxxer.hikari.HikariConfig;
import com.zaxxer.hikari.HikariDataSource;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.core.env.Environment;

import javax.sql.DataSource;
import java.net.URI;

/**
 * Intelligent DataSource configuration for Render cloud deployments and local environments.
 *
 * <p>Render automatically injects {@code DATABASE_URL} as:
 * <pre>
 *   postgresql://user:password@host:port/dbname
 *   or
 *   postgres://user:password@host:port/dbname
 * </pre>
 * Java JDBC requires the {@code jdbc:postgresql://} prefix. This configuration
 * seamlessly normalizes Render's connection string, extracts credentials, and
 * falls back to an in-memory database if no external database is provisioned.
 */
@Configuration
public class DatabaseConfig {

    private static final Logger log = LoggerFactory.getLogger(DatabaseConfig.class);

    private final Environment env;

    public DatabaseConfig(Environment env) {
        this.env = env;
    }

    @Bean
    @Primary
    public DataSource dataSource() {
        String rawDatabaseUrl = env.getProperty("DATABASE_URL");
        String springDatasourceUrl = env.getProperty("spring.datasource.url");

        // 1. If DATABASE_URL is set (standard Render environment variable)
        if (rawDatabaseUrl != null && !rawDatabaseUrl.trim().isEmpty()) {
            return createPostgresDataSource(rawDatabaseUrl.trim());
        }

        // 2. If spring.datasource.url is explicitly provided
        if (springDatasourceUrl != null && !springDatasourceUrl.trim().isEmpty()) {
            if (springDatasourceUrl.startsWith("postgres://") || springDatasourceUrl.startsWith("postgresql://")) {
                return createPostgresDataSource(springDatasourceUrl.trim());
            }
            log.info("[CareerSetu] Using configured spring.datasource.url: {}", springDatasourceUrl);
            HikariConfig config = new HikariConfig();
            config.setJdbcUrl(springDatasourceUrl);
            config.setUsername(env.getProperty("spring.datasource.username", "sa"));
            config.setPassword(env.getProperty("spring.datasource.password", ""));
            config.setDriverClassName(env.getProperty("spring.datasource.driver-class-name", "org.h2.Driver"));
            config.setMaximumPoolSize(10);
            return new HikariDataSource(config);
        }

        // 3. Fallback to in-memory H2 database (ensures zero-crash boot on initial deploy)
        log.warn("[CareerSetu] No DATABASE_URL found. Booting with in-memory H2 database (PostgreSQL mode).");
        HikariConfig h2Config = new HikariConfig();
        h2Config.setJdbcUrl("jdbc:h2:mem:careersetu;DB_CLOSE_DELAY=-1;MODE=PostgreSQL;DATABASE_TO_LOWER=TRUE");
        h2Config.setDriverClassName("org.h2.Driver");
        h2Config.setUsername("sa");
        h2Config.setPassword("");
        h2Config.setMaximumPoolSize(5);
        return new HikariDataSource(h2Config);
    }

    private DataSource createPostgresDataSource(String rawUrl) {
        try {
            String jdbcUrl;
            String username = env.getProperty("DATABASE_USER");
            String password = env.getProperty("DATABASE_PASSWORD");

            if (rawUrl.startsWith("jdbc:")) {
                jdbcUrl = rawUrl;
            } else if (rawUrl.startsWith("postgres://") || rawUrl.startsWith("postgresql://")) {
                URI uri = new URI(rawUrl);
                String host = uri.getHost();
                int port = uri.getPort() == -1 ? 5432 : uri.getPort();
                String path = uri.getPath(); // includes leading '/'

                jdbcUrl = "jdbc:postgresql://" + host + ":" + port + path;
                if (uri.getQuery() != null && !uri.getQuery().isEmpty()) {
                    jdbcUrl += "?" + uri.getQuery();
                }

                String userInfo = uri.getUserInfo();
                if (userInfo != null && !userInfo.isEmpty()) {
                    String[] parts = userInfo.split(":", 2);
                    username = parts[0];
                    if (parts.length > 1) {
                        password = parts[1];
                    }
                }
            } else {
                jdbcUrl = "jdbc:" + rawUrl;
            }

            log.info("[CareerSetu] Configured Render PostgreSQL JDBC URL: {}:***",
                    jdbcUrl.replaceAll(":[^/@]+@", ":***@"));

            HikariConfig hikariConfig = new HikariConfig();
            hikariConfig.setJdbcUrl(jdbcUrl);
            hikariConfig.setDriverClassName("org.postgresql.Driver");
            if (username != null) hikariConfig.setUsername(username);
            if (password != null) hikariConfig.setPassword(password);

            // Production connection pool tuning
            hikariConfig.setMaximumPoolSize(15);
            hikariConfig.setMinimumIdle(3);
            hikariConfig.setConnectionTimeout(30000);
            hikariConfig.setIdleTimeout(600000);
            hikariConfig.setMaxLifetime(1800000);
            hikariConfig.setConnectionTestQuery("SELECT 1");

            return new HikariDataSource(hikariConfig);
        } catch (Exception e) {
            log.error("[CareerSetu] Failed to parse DATABASE_URL: {}. Falling back to default datasource.", rawUrl, e);
            throw new IllegalStateException("Failed to configure DataSource from DATABASE_URL: " + e.getMessage(), e);
        }
    }
}
