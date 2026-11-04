
import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import mongoose from 'mongoose';

import authRoutes from './routes/auth.js';
import jobRoutes from './routes/jobs.js';
import applicationRoutes from './routes/applications.js';

const {
  MONGO_URI,
  JWT_SECRET,
  PORT = 5000,
  CLIENT_URL = 'http://localhost:5173',
} = process.env;

if (!MONGO_URI || !JWT_SECRET || JWT_SECRET.length < 16) {
  console.error(
    'Set MONGO_URI and a JWT_SECRET (16+ characters) in server/.env'
  );

  process.exit(1);
}

const app = express();

app.use(helmet());
app.use(cors({ origin: CLIENT_URL.split(',') }));
app.use(express.json({ limit: '100kb' }));
app.use(morgan('dev'));

app.get('/api/health', (req, res) => res.json({ ok: true }));

app.use('/api/auth', authRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/applications', applicationRoutes);

app.use('/api', (req, res) =>
  res.status(404).json({ message: 'Route not found' })
);

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  if (err.code === 11000) {
    return res.status(409).json({
      message: 'This record already exists',
    });
  }

  if (err.name === 'ValidationError') {
    return res.status(400).json({
      message: Object.values(err.errors)
        .map((e) => e.message)
        .join(', '),
    });
  }

  if (err.name === 'CastError') {
    return res.status(400).json({
      message: 'Invalid id',
    });
  }

  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({
      message: 'Invalid JSON',
    });
  }

  console.error(err);

  res.status(500).json({
    message: 'Something went wrong on the server',
  });
});

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log('MongoDB connected');

    app.listen(PORT, () =>
      console.log(`API running on http://localhost:${PORT}`)
    );
  })
  .catch((e) => {
    console.error('MongoDB connection failed:', e.message);
    process.exit(1);
  });
