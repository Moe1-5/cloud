import { env } from "./config/env.js";
import { logger } from "./config/logger.js";
import { createApp } from "./app.js";

const app = createApp();

app.listen(env.APP_PORT, () => {
  logger.info(`API server listening on port ${env.APP_PORT}`);
});
