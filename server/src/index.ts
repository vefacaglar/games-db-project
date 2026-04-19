import express from 'express';
import cors from 'cors';
import { config } from './infrastructure/config/index.js';
import { connectDatabase } from './infrastructure/database/index.js';
import { authRoutes, gameRoutes, listRoutes, reviewRoutes } from './presentation/routes/index.js';

const app = express();

app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api/auth', authRoutes);
app.use('/api/games', gameRoutes);
app.use('/api/lists', listRoutes);
app.use('/api/reviews', reviewRoutes);

app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', err.message);
  res.status(500).json({ error: 'Internal server error' });
});

async function start() {
  await connectDatabase();
  app.listen(config.port, () => {
    console.log(`Server running on port ${config.port}`);
  });
}

start();