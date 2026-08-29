import { Router } from 'express';
import { db } from '../db/index.ts';
import { 
  projects, posts, services, skills, experience, 
  education, certificates, testimonials, messages, socialLinks, settings 
} from '../db/schema.ts';
import { pageViews } from '../db/schema.ts';
import { eq } from 'drizzle-orm';
import { requireAuth } from './auth.ts';
import { logError } from './logger.ts';


const asyncHandler = (fn: any) => (req: any, res: any, next: any) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

const api = Router();

['get', 'post', 'put', 'delete'].forEach(method => {
  const original = (api as any)[method].bind(api);
  (api as any)[method] = (path: string, ...handlers: any[]) => {
    const wrappedHandlers = handlers.map(h => {
      if (typeof h === 'function' && h.constructor.name === 'AsyncFunction') {
        return asyncHandler(h);
      }
      return h;
    });
    return original(path, ...wrappedHandlers);
  };
});


// Public endpoints to fetch data for the frontend
api.get('/projects', async (req, res) => {
  try {
    const data = await db.query.projects.findMany({ orderBy: (projects, { desc }) => [desc(projects.createdAt)] });
    res.json(data);
  } catch (error) {
    logError(error, 'GET /projects');
    res.status(500).json({ error: error.message });
  }
});

api.get('/posts', async (req, res) => {
  const data = await db.query.posts.findMany({ orderBy: (posts, { desc }) => [desc(posts.createdAt)] });
  res.json(data);
});

api.get('/services', async (req, res) => {
  const data = await db.query.services.findMany({ orderBy: (services, { asc }) => [asc(services.orderIndex)] });
  res.json(data);
});

api.get('/social-links', async (req, res) => {
  const data = await db.query.socialLinks.findMany({ orderBy: (socialLinks, { asc }) => [asc(socialLinks.orderIndex)] });
  res.json(data);
});

api.get('/settings', async (req, res) => {
  const data = await db.query.settings.findMany();
  res.json(data);
});

api.get('/skills', async (req, res) => {
  const data = await db.query.skills.findMany({ orderBy: (skills, { asc }) => [asc(skills.orderIndex)] });
  res.json(data);
});

api.get('/experience', async (req, res) => {
  const data = await db.query.experience.findMany({ orderBy: (experience, { desc }) => [desc(experience.createdAt)] });
  res.json(data);
});

api.get('/education', async (req, res) => {
  const data = await db.query.education.findMany({ orderBy: (education, { desc }) => [desc(education.createdAt)] });
  res.json(data);
});

api.get('/certificates', async (req, res) => {
  const data = await db.query.certificates.findMany({ orderBy: (certificates, { desc }) => [desc(certificates.date)] });
  res.json(data);
});

api.get('/testimonials', async (req, res) => {
  const data = await db.query.testimonials.findMany({ 
    where: eq(testimonials.published, true),
    orderBy: (testimonials, { desc }) => [desc(testimonials.createdAt)] 
  });
  res.json(data);
});

// Admin endpoints
const createCrudEndpoints = (router: Router, path: string, table: any) => {
  router.get(`/admin/${path}`, requireAuth, async (req, res) => {
    const data = await db.select().from(table);
    res.json(data);
  });

  router.post(`/admin/${path}`, requireAuth, async (req, res) => {
    const { id, createdAt, updatedAt, ...body } = req.body;
    try {
      const data = await db.insert(table).values(body).returning();
      res.json(data[0]);
    } catch (err) {
      logError(err, `Error inserting into ${path}`);
      res.status(500).json({ error: 'Database error' });
    }
  });

  router.put(`/admin/${path}/:id`, requireAuth, async (req, res) => {
    const idParam = parseInt(req.params.id);
    const { id, createdAt, updatedAt, ...body } = req.body;
    try {
      const data = await db.update(table).set(body).where(eq(table.id, idParam)).returning();
      res.json(data[0]);
    } catch (err) {
      logError(err, `Error updating ${path}`);
      res.status(500).json({ error: 'Database error' });
    }
  });

  router.delete(`/admin/${path}/:id`, requireAuth, async (req, res) => {
    const id = parseInt(req.params.id);
    await db.delete(table).where(eq(table.id, id));
    res.json({ success: true });
  });
};

createCrudEndpoints(api, 'projects', projects);
createCrudEndpoints(api, 'posts', posts);
createCrudEndpoints(api, 'services', services);
createCrudEndpoints(api, 'skills', skills);
createCrudEndpoints(api, 'experience', experience);
createCrudEndpoints(api, 'education', education);
createCrudEndpoints(api, 'certificates', certificates);
createCrudEndpoints(api, 'testimonials', testimonials);
createCrudEndpoints(api, 'messages', messages);


import rateLimit from "express-rate-limit";

const messageLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5, // Limit each IP to 5 messages per hour
  message: { error: 'لقد تجاوزت الحد المسموح به للرسائل، يرجى المحاولة لاحقاً' }
});

api.post('/messages', messageLimiter, async (req, res) => {
  const { name, email, subject, message } = req.body;
  try {
    const data = await db.insert(messages).values({ name, email, subject, message }).returning();
    res.json(data[0]);
  } catch (err) {
    logError(err, 'Error inserting message');
    res.status(500).json({ error: 'Database error' });
  }
});
createCrudEndpoints(api, 'social-links', socialLinks);

// Settings has key as unique instead of standard serial id for updates
api.put('/admin/settings/:key', requireAuth, async (req, res) => {
    const key = req.params.key;
    const { value } = req.body;
    const data = await db.insert(settings)
        .values({ key, value })
        .onConflictDoUpdate({
            target: settings.key,
            set: { value, updatedAt: new Date() }
        })
        .returning();
    res.json(data[0]);
});

api.get('/admin/stats', requireAuth, async (req, res) => {
    const projectsCount = await db.select({ count: projects.id }).from(projects);
    const postsCount = await db.select({ count: posts.id }).from(posts);
    const servicesCount = await db.select({ count: services.id }).from(services);
    
    res.json({
        projects: projectsCount.length,
        posts: postsCount.length,
        services: servicesCount.length,
    });
});


api.post('/logs', (req, res) => {
  const { error, context } = req.body;
  logError(error, context || 'Client Error');
  res.json({ success: true });
});

export { api };

// --- Analytics ---
api.post('/analytics/track', async (req, res) => {
  const { path } = req.body;
  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
  const userAgent = req.headers['user-agent'];
  
  if (path) {
    try {
      await db.insert(pageViews).values({
        path,
        ip: typeof ip === 'string' ? ip : undefined,
        userAgent: typeof userAgent === 'string' ? userAgent : undefined,
      });
      res.json({ success: true });
    } catch (err) {
      console.error('Failed to track page view', err);
      res.status(500).json({ error: 'Failed to track page view' });
    }
  } else {
    res.status(400).json({ error: 'Path is required' });
  }
});

api.get('/admin/analytics', requireAuth, async (req, res) => {
  try {
    const allViews = await db.query.pageViews.findMany();
    
    // Process data for dashboard
    const totalViews = allViews.length;
    
    // Views per path
    const pathCounts: Record<string, number> = {};
    const dateCounts: Record<string, number> = {};
    
    allViews.forEach((view: any) => {
      // Path stats
      if (view.path) {
        pathCounts[view.path] = (pathCounts[view.path] || 0) + 1;
      }
      
      // Date stats (last 7 days etc)
      if (view.createdAt) {
        const dateObj = new Date(view.createdAt);
        const dateStr = dateObj.toISOString().split('T')[0];
        dateCounts[dateStr] = (dateCounts[dateStr] || 0) + 1;
      }
    });
    
    const topPages = Object.entries(pathCounts)
      .map(([path, views]) => ({ path, views: Number(views) }))
      .sort((a, b) => b.views - a.views)
      .slice(0, 10);
      
    const viewsByDate = Object.entries(dateCounts)
      .map(([date, views]) => ({ date, views }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    
    res.json({
      totalViews,
      topPages,
      viewsByDate
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch analytics' });
  }
});
