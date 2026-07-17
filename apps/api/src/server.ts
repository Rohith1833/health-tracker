import { env } from './config/env.js';
import { createApp } from './app/create-app.js';

const app = createApp();

app.listen(env.PORT, () => {
  console.info(`API server listening on port ${env.PORT}`);
});
