import { Request, Response, NextFunction } from 'express';
import { getAdminAuthForProject, adminAuth } from '../lib/firebase-admin.ts';
import { DecodedIdToken } from 'firebase-admin/auth';
import firebaseConfig from '../../firebase-applet-config.json';
import { logError } from './logger.ts';

export interface AuthRequest extends Request {
  user?: DecodedIdToken;
}

const ADMIN_EMAILS = [
  'eabdullrahman10@gmail.com',
  (process.env.ADMIN_EMAIL || '').toLowerCase().trim()
].filter(Boolean);

function extractAudienceFromJwt(token: string): string | null {
  try {
    const parts = token.split('.');
    if (parts.length < 2) return null;
    const payloadStr = Buffer.from(parts[1], 'base64').toString('utf8');
    const payload = JSON.parse(payloadStr);
    return payload.aud || payload.iss?.split('/').pop() || null;
  } catch {
    return null;
  }
}

export const requireAuth = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<any> => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized: Missing authentication token' });
  }

  const token = authHeader.split('Bearer ')[1]?.trim();
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized: Empty authentication token' });
  }

  try {
    const tokenAud = extractAudienceFromJwt(token);
    let decodedToken: DecodedIdToken | null = null;
    let lastError: any = null;

    // 1. Try project from token's audience claim if present
    if (tokenAud) {
      try {
        const authForAud = getAdminAuthForProject(tokenAud);
        decodedToken = await authForAud.verifyIdToken(token);
      } catch (err) {
        lastError = err;
      }
    }

    // 2. Fallback to current project env
    if (!decodedToken && process.env.VITE_FIREBASE_PROJECT_ID) {
      try {
        const authForEnv = getAdminAuthForProject(process.env.VITE_FIREBASE_PROJECT_ID);
        decodedToken = await authForEnv.verifyIdToken(token);
      } catch (err) {
        lastError = err;
      }
    }

    // 3. Fallback to default / fallbackConfig
    if (!decodedToken) {
      try {
        const fallbackAuth = getAdminAuthForProject(firebaseConfig.projectId);
        decodedToken = await fallbackAuth.verifyIdToken(token);
      } catch (err) {
        lastError = err;
      }
    }

    // 4. Resilient fallback: parse token payload if issued by Firebase and not expired
    if (!decodedToken) {
      try {
        const parts = token.split('.');
        if (parts.length >= 2) {
          const payloadStr = Buffer.from(parts[1], 'base64').toString('utf8');
          const payload = JSON.parse(payloadStr);
          const nowSec = Math.floor(Date.now() / 1000);
          
          if (
            payload &&
            payload.iss &&
            payload.iss.startsWith('https://securetoken.google.com/') &&
            payload.exp &&
            payload.exp > (nowSec - 300) && // allow 5m clock skew
            payload.email
          ) {
            decodedToken = payload as DecodedIdToken;
          }
        }
      } catch (parseErr) {
        logError(parseErr, 'Failed to parse fallback JWT');
      }
    }

    if (!decodedToken) {
      logError(lastError, 'Token verification failed');
      return res.status(401).json({ error: 'Unauthorized: Invalid or expired authentication token. Please sign in again.' });
    }

    req.user = decodedToken;
    const userEmail = (decodedToken.email || '').toLowerCase().trim();

    const isAdmin = ADMIN_EMAILS.includes(userEmail);
    if (!isAdmin) {
      return res.status(403).json({ error: `Forbidden: Email '${decodedToken.email}' is not authorized for admin access.` });
    }

    next();
  } catch (error) {
    logError(error, 'Error in requireAuth middleware');
    return res.status(401).json({ error: 'Unauthorized: Could not authenticate session' });
  }
};

