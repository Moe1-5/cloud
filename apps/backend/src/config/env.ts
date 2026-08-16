import path from "node:path";
import { fileURLToPath } from "node:url";
import { config } from "dotenv";
import { z } from "zod";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootEnvPath = path.resolve(__dirname, "../../../../.env");

config({ path: rootEnvPath });

const emptyStringToUndefined = (value: unknown) => (value === "" ? undefined : value);

const envSchema = z.object({
  APP_ENV: z.enum(["development", "test", "production"]).default("development"),
  APP_PORT: z.coerce.number().int().positive().default(3000),
  APP_URL: z.string().url().default("http://localhost:3000"),
  CORS_ORIGIN: z.string().default("http://localhost:5173"),
  AWS_REGION: z.string().min(1).default("ap-southeast-1"),
  DYNAMODB_TABLE_NAME: z.string().min(1).default("ddac-projects"),
  DYNAMODB_ENDPOINT: z.preprocess(emptyStringToUndefined, z.string().url().optional()),
  JWT_SECRET: z.string().min(16).default("development-only-secret-change-before-production"),
  JWT_EXPIRES_IN: z.string().min(1).default("7d"),
  AUTH_BOOTSTRAP_EMAIL: z.string().email().default("admin@example.com"),
  AUTH_BOOTSTRAP_PASSWORD: z.string().min(8).default("Admin123!"),
  AUTH_BOOTSTRAP_NAME: z.string().min(3).default("System Administrator"),
  SERVE_STATIC_FRONTEND: z
    .enum(["true", "false"])
    .default("false")
    .transform((value) => value === "true"),
  FRONTEND_DIST_PATH: z.string().default("apps/frontend/dist")
});

export const env = envSchema.parse(process.env);
