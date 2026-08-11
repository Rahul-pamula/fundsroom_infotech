import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { env } from './config/env.js';
import { errorHandler } from './middleware/error-handler.js';
import { notFoundHandler } from './middleware/not-found.js';
import routes from './routes/index.js';

export const app = express();

app.use(helmet());
app.use(
  cors({
    origin: env.CLIENT_URL,
  })
);
app.use(express.json());
app.use(
  '/api/v1/auth/login',
  rateLimit({
    windowMs: 60 * 1000,
    limit: 10,
    standardHeaders: true,
    legacyHeaders: false,
  })
);

app.get('/health', (_request, response) => {
  response.status(200).json({ success: true, message: 'API is healthy' });
});

app.use('/api/v1', routes);
app.use(notFoundHandler);
app.use(errorHandler);

