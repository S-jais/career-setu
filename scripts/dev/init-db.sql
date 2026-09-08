-- CareerSetu Dev Database Init Script
-- Creates necessary extensions and additional databases
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS vector;

-- Keycloak database (for Keycloak profile)
CREATE DATABASE keycloak OWNER careersetu_user;
