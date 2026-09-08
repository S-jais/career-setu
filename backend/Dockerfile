# ============================================================
# Stage 1: Build Stage (Maven + OpenJDK 21)
# ============================================================
FROM maven:3.9.9-eclipse-temurin-21-alpine AS builder

WORKDIR /build

# Memory-optimized Maven configuration for cloud build environments
ENV MAVEN_OPTS="-Xmx384m -XX:+TieredCompilation -XX:TieredStopAtLevel=1"

# Copy pom and source code
COPY pom.xml .
COPY src ./src

# Build production jar
RUN mvn clean package -DskipTests -B

# ============================================================
# Stage 2: Minimal Production Runtime (JRE 21 Alpine)
# ============================================================
FROM eclipse-temurin:21-jre-alpine

# Install curl and tzdata
RUN apk add --no-cache curl tzdata

# Create non-root application user
RUN addgroup -S careersetu && adduser -S careersetu -G careersetu

WORKDIR /app

# Copy the built executable jar from builder stage
COPY --from=builder /build/target/careersetu-backend-1.0.0-SNAPSHOT.jar /app/app.jar

# Ensure proper permissions
RUN chown -R careersetu:careersetu /app

USER careersetu

# Render injects PORT dynamically (defaults to 10000 on Render)
ENV PORT=10000
ENV SPRING_PROFILES_ACTIVE=render
ENV JAVA_OPTS="-XX:+UseContainerSupport -XX:MaxRAMPercentage=75.0 -XX:+ExitOnOutOfMemoryError -Djava.security.egd=file:/dev/./urandom"

EXPOSE 10000

# Execute Spring Boot application
ENTRYPOINT ["sh", "-c", "exec java $JAVA_OPTS -jar /app/app.jar"]
