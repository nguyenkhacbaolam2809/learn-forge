import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth';
import dashboardRoutes from './routes/dashboard';
import courseRoutes from './routes/courses';
import taskRoutes from './routes/tasks';
import messagesRoutes from './routes/messages';
import { initDb } from './utils/db';

dotenv.config();

const app = express();
const port = process.env.PORT || 4000;

app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());

initDb();

app.use('/api/auth', authRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/messages', messagesRoutes);

app.get('/api/health', (_, res) => res.json({ status: 'ok' }));

app.listen(port, () => {
  console.log(`Backend running on http://localhost:${port}`);
});
