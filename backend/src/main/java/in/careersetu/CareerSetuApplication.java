package in.careersetu;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.annotation.EnableScheduling;

/**
 * CareerSetu — AI-Powered India-First Academia–Industry Collaboration Platform
 *
 * <p>Skills to Opportunities. Campus to Career.
 *
 * <p>Security controls were implemented and tested against the defined threat model and security
 * baseline; no known critical findings remain at the time of testing. Designed for regulatory and
 * institutional compliance alignment; formal legal/compliance review is required before production
 * deployment.
 */
@SpringBootApplication
@EnableCaching
@EnableAsync
@EnableScheduling
public class CareerSetuApplication {

    public static void main(String[] args) {
        SpringApplication.run(CareerSetuApplication.class, args);
    }
}
