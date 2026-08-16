import { env } from "./config/env.js";
import { logger } from "./config/logger.js";
import { createApp } from "./app.js";

const app = createApp();

const port = Number(process.env.PORT ?? env.APP_PORT);

app.listen(port, () => {
  logger.info(`API server listening on port ${port}`);
});