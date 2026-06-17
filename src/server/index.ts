import express from 'express';
import cors from 'cors';
import { resolve } from 'path';
import { config } from 'dotenv';

config({ path: resolve(process.cwd(), '.env') });

import petsRouter from './routes/pets';
import applicationsRouter from './routes/applications';
import profileRouter from './routes/profile';
import favoritesRouter from './routes/favorites';
import adminRouter from './routes/admin';

const app = express();
const PORT = parseInt(process.env.PORT || '3001', 10);

app.use(cors());
app.use(express.json());

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use('/api', petsRouter);
app.use('/api', applicationsRouter);
app.use('/api', profileRouter);
app.use('/api', favoritesRouter);
app.use('/api', adminRouter);

app.listen(PORT, () => {
  console.log(`PawMate API Server running on http://localhost:${PORT}`);
});
