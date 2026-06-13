import express from 'express';
import cors from 'cors';
import { config } from 'dotenv';
import {
  handleChatRequest,
  ChatValidationError,
} from './chatHandler.js';

config();

const app = express();
const PORT = process.env.PORT || 3001;
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX = 20;

if (!process.env.GEMINI_API_KEY) {
  console.error('GEMINI_API_KEY is required. Set it in .env before starting the server.');
  process.exit(1);
}

const rateLimitStore = new Map();

function rateLimit(req, res, next) {
  const ip = req.ip || req.socket.remoteAddress || 'unknown';
  const now = Date.now();
  const entry = rateLimitStore.get(ip);

  if (!entry || now - entry.windowStart > RATE_LIMIT_WINDOW_MS) {
    rateLimitStore.set(ip, { windowStart: now, count: 1 });
    return next();
  }

  if (entry.count >= RATE_LIMIT_MAX) {
    return res.status(429).json({ error: 'Rate limit exceeded. Please try again later.' });
  }

  entry.count += 1;
  return next();
}

app.use(express.json({ limit: '16kb' }));
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  })
);
app.set('trust proxy', 1);

app.post('/api/chat', rateLimit, async (req, res) => {
  try {
    const result = await handleChatRequest(req.body ?? {});
    return res.json(result);
  } catch (error) {
    if (error instanceof ChatValidationError) {
      return res.status(error.statusCode).json({ error: error.message });
    }

    console.error('Gemini API error:', error);
    return res.status(502).json({
      error: 'Failed to generate a response. Please try again shortly.',
    });
  }
});

app.listen(PORT, () => {
  console.log(`Somatic API server running on http://localhost:${PORT}`);
});
