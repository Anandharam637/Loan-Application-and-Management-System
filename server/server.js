import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import apiRoutes from './routes/api.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'ONLINE',
    service: 'Apex Trust Bank - Loan Management Core API',
    version: '2.0.0',
    timestamp: new Date().toISOString()
  });
});

// Mount API Routes
app.use('/api', apiRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('API Error:', err);
  res.status(500).json({ success: false, error: 'Internal Server Error', message: err.message });
});

app.listen(PORT, () => {
  console.log(`🚀 Apex Trust Bank LMS API Server running on port ${PORT}`);
  console.log(`👉 REST API Base: http://localhost:${PORT}/api`);
  console.log(`👉 Health Check: http://localhost:${PORT}/health`);
});
