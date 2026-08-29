import express from 'express';
import cors from 'cors';
import serverless from 'serverless-http';
import { api } from '../../src/server/api.ts';

const app = express();

app.use(cors({
  origin: true,
  credentials: true,
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Support standard /api, Netlify function prefix, or root relative routes
app.use('/api', api);
app.use('/.netlify/functions/api', api);
app.use('/', api);

export const handler = serverless(app);
