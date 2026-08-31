import { initializeApp, getApps } from 'firebase-admin/app';
import { getAuth, Auth, DecodedIdToken } from 'firebase-admin/auth';
import firebaseConfig from '../../firebase-applet-config.json';

const appsMap = new Map<string, Auth>();

export function getAdminAuthForProject(projectId?: string): Auth {
  const targetProjectId = projectId || process.env.VITE_FIREBASE_PROJECT_ID || firebaseConfig.projectId;
  
  if (appsMap.has(targetProjectId)) {
    return appsMap.get(targetProjectId)!;
  }

  const appName = `app_${targetProjectId}`;
  const existingApp = getApps().find(a => a.name === appName || (targetProjectId === firebaseConfig.projectId && a.name === '[DEFAULT]'));
  
  if (existingApp) {
    const authInstance = getAuth(existingApp);
    appsMap.set(targetProjectId, authInstance);
    return authInstance;
  }

  const newApp = initializeApp({ projectId: targetProjectId }, appName);
  const authInstance = getAuth(newApp);
  appsMap.set(targetProjectId, authInstance);
  return authInstance;
}

// Default Admin Auth
export const adminAuth = getAdminAuthForProject();

