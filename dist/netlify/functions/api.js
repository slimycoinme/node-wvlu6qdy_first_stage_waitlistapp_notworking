import express from 'express';
import serverless from 'serverless-http';
import cors from 'cors';
import userRoutes from './routes/users.js';

const app = express();

// Middleware
app.use(cors({
  origin: '*',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Request logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Cache control
app.use((req, res, next) => {
  res.set({
    'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
    'Pragma': 'no-cache',
    'Expires': '0',
    'Surrogate-Control': 'no-store'
  });
  next();
});

// Routes
app.use('/.netlify/functions/api', userRoutes);

// Error handling
app.use((err, req, res, next) => {
  console.error('API Error:', err);
  res.status(500).json({
    data: {
      items: [],
      pagination: {
        total: 0,
        hasMore: false,
        timestamp: Date.now()
      }
    },
    success: false,
    error: 'Something went wrong'
  });
});

export const handler = serverless(app);
