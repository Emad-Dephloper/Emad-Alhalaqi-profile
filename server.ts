import "dotenv/config";
import express from "express";
import path from "path";
import cors from "cors";
import helmet from "helmet";
import hpp from "hpp";
import rateLimit from "express-rate-limit";
import { createServer as createViteServer } from "vite";
import { db } from './src/db/index.ts';
import { users } from './src/db/schema.ts';
import { AuthRequest, requireAuth } from './src/server/auth.ts';
import { api } from './src/server/api.ts';

import { logError } from './src/server/logger.ts';

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Trust reverse proxy for rate limiting (e.g. Cloud Run / Nginx)
  app.set('trust proxy', 1);

  // Security Middlewares
  app.use(cors({
    origin: true,
    credentials: true,
  }));

  app.use(helmet({
    contentSecurityPolicy: false, // Disabled to allow Vite and external images/scripts
    crossOriginEmbedderPolicy: false,
  }));

  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 300, // Limit each IP to 1000 requests per windowMs
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: 'Too many requests, please try again later.' }
  });

  // Apply rate limiter to all API requests
  app.use('/api', limiter);

  app.use(express.json({ limit: "10mb" })); app.use(express.urlencoded({ limit: "10mb", extended: true }));
  app.use(hpp()); // Protect against HTTP Parameter Pollution attacks

  // Mount API router
  app.use('/api', api);

  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });
  
  // Create / Register Admin User endpoint (invoked on login)
  app.post("/api/auth/sync", requireAuth, async (req: AuthRequest, res) => {
    try {
        if(!req.user) return res.status(401).send();
        const uid = req.user.uid;
        const email = req.user.email || '';
        
        const result = await db.insert(users)
            .values({
                uid,
                email,
                isAdmin: true // We know it's the admin based on the middleware
            })
            .onConflictDoUpdate({
                target: users.uid,
                set: { email },
            })
            .returning();
            
        res.json(result[0]);
    } catch(err) {
        logError(err, 'User Sync');
        res.status(500).json({ error: 'Failed to sync user' });
    }
  });


  // Catch all undefined /api routes to prevent Vite from returning index.html
  app.use('/api', (req, res) => {
    res.status(404).json({ error: 'API route not found' });
  });

  app.use('/api', (err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    logError(err, `API Error: ${req.method} ${req.url}`);
    res.status(500).json({ error: err.message || 'Internal Server Error' });
  });


  // Vite middleware for development

  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
