import 'dotenv/config';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import connectDatabase from './config/db.js';
import assignmentRoutes from './routes/assignmentRoutes.js';
import authRoutes from './routes/authRoutes.js';
import courseRoutes from './routes/courseRoutes.js';
import enrollmentRoutes from './routes/enrollmentRoutes.js';
import progressRoutes from './routes/progressRoutes.js';
import quizRoutes from './routes/quizRoutes.js';

const { PORT = 5000, MONGODB_URI, JWT_SECRET, CLIENT_URL = 'http://localhost:5173' } = process.env;
if (!JWT_SECRET || JWT_SECRET.length < 32) {
  console.error('JWT_SECRET must be set to a random string of at least 32 characters.');
  process.exit(1);
}

const app = express();
app.use(helmet());
app.use(cors({ origin: CLIENT_URL.split(',').map((origin) => origin.trim()) }));
app.use(express.json({ limit: '100kb' }));
app.use(morgan('dev'));

app.get('/api/health', (_req, res) => res.json({ ok: true, service: 'Auspify LMS API' }));
app.use('/api/auth', authRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/enrollments', enrollmentRoutes);
app.use('/api/quizzes', quizRoutes);
app.use('/api/assignments', assignmentRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api', (_req, res) => res.status(404).json({ message: 'API route not found.' }));
app.use((error, _req, res, _next) => {
  if (error.code === 11000) return res.status(409).json({ message: 'This record already exists.' });
  if (error.name === 'ValidationError') return res.status(400).json({ message: Object.values(error.errors).map(({ message }) => message).join(', ') });
  if (error.name === 'CastError') return res.status(400).json({ message: 'Invalid identifier.' });
  if (error.type === 'entity.parse.failed') return res.status(400).json({ message: 'Invalid JSON request body.' });
  console.error(error);
  res.status(500).json({ message: 'Something went wrong on the server.' });
});

try {
  await connectDatabase(MONGODB_URI);
  app.listen(PORT, () => console.log(`Auspify LMS API running at http://localhost:${PORT}`));
} catch (error) {
  console.error(`Failed to start Auspify LMS API: ${error.message}`);
  process.exit(1);
}
