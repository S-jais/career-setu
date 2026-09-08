# ============================================================
# Stage 1: Build Stage (Maven + OpenJDK 21)
# ============================================================
FROM maven:3.9.9-eclipse-temurin-21-alpine AS builder

WORKDIR /build

# Cache Maven dependencies layer
COPY pom.xml .
RUN mvn dependency:go-offline -B || true

# Copy source code and build the production jar
COPY src ./src
RUN mvn clean package -DskipTests -B

# ============================================================
# Stage 2: Minimal Production Runtime (JRE 21 Alpine)
# ============================================================
FROM eclipse-temurin:21-jre-alpine

# Install curl for Render healthcheck probes
RUN apk add --no-cache curl tzdata

# Create dedicated non-root application user
RUN addgroup -S careersetu && adduser -S careersetu -G careersetu

WORKDIR /app

# Copy the built executable jar from builder stage
COPY --from=builder /build/target/careersetu-backend-1.0.0-SNAPSHOT.jar /app/app.jar

# Ensure proper permissions
RUN chown -R careersetu:careersetu /app

USER careersetu

# Render sets the PORT environment variable dynamically (defaults to 8080)
ENV PORT=8080
ENV SPRING_PROFILES_ACTIVE=render
ENV JAVA_OPTS="-XX:+UseContainerSupport -XX:MaxRAMPercentage=75.0 -XX:+ExitOnOutOfMemoryError -Djava.security.egd=file:/dev/./urandom"

EXPOSE 8080

# Health check configuration for container orchestrators
HEALTHCHECK --interval=30s --timeout=5s --start-period=45s --retries=3 \
  CMD curl -f http://localhost:${PORT}/actuator/health || exit 1

# Execute Spring Boot application
ENTRYPOINT ["sh", "-c", "exec java $JAVA_OPTS -jar /app/app.jar"]
