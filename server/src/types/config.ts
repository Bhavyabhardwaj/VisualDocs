export interface DatabaseConfig {
    url: string;
}

export interface JWTConfig {
    secret: string;
    expiresIn: string;
  refreshSecret: string;
  refreshExpiresIn: string;
}

export interface ServerConfig {
    port: number;
    host: string;
    nodeEnv: string;
}

export interface AIConfig {
  geminiApiKey?: string;
  model: string;
}

export interface AppConfig {
  database: DatabaseConfig;
  jwt: JWTConfig;
  server: ServerConfig;
  ai: AIConfig;
}
