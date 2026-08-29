import { relations } from 'drizzle-orm';
import { pgTable, serial, text, timestamp, boolean, integer, jsonb } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  uid: text('uid').notNull().unique(),
  email: text('email').notNull(),
  isAdmin: boolean('is_admin').default(false).notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

export const projects = pgTable('projects', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  titleAr: text('title_ar'),
  slug: text('slug').notNull().unique(),
  description: text('description').notNull(),
  descriptionAr: text('description_ar'),
  category: text('category').notNull(),
  categoryAr: text('category_ar'),
  tags: jsonb('tags').$type<string[]>().default([]),
  technologies: jsonb('technologies').$type<string[]>().default([]),
  images: jsonb('images').$type<string[]>().default([]),
  video: text('video'),
  githubUrl: text('github_url'),
  liveDemo: text('live_demo'),
  documentation: text('documentation'),
  featured: boolean('featured').default(false),
  published: boolean('published').default(false),
  date: timestamp('date'),
  seoMetadata: jsonb('seo_metadata'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const posts = pgTable('posts', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  titleAr: text('title_ar'),
  slug: text('slug').notNull().unique(),
  category: text('category').notNull(),
  categoryAr: text('category_ar'),
  tags: jsonb('tags').$type<string[]>().default([]),
  featuredImage: text('featured_image'),
  content: text('content').notNull(),
  contentAr: text('content_ar'),
  metaTitle: text('meta_title'),
  metaTitleAr: text('meta_title_ar'),
  metaDescription: text('meta_description'),
  metaDescriptionAr: text('meta_description_ar'),
  keywords: text('keywords'),
  published: boolean('published').default(false),
  scheduledPublishing: timestamp('scheduled_publishing'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const skills = pgTable('skills', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  nameAr: text('name_ar'),
  level: integer('level'),
  category: text('category'),
  categoryAr: text('category_ar'),
  icon: text('icon'),
  orderIndex: integer('order_index').default(0),
  visible: boolean('visible').default(true),
  createdAt: timestamp('created_at').defaultNow(),
});

export const experience = pgTable('experience', {
  id: serial('id').primaryKey(),
  company: text('company').notNull(),
  companyAr: text('company_ar'),
  role: text('role').notNull(),
  roleAr: text('role_ar'),
  location: text('location'),
  locationAr: text('location_ar'),
  period: text('period'),
  periodAr: text('period_ar'),
  description: text('description'),
  descriptionAr: text('description_ar'),
  startDate: timestamp('start_date'),
  endDate: timestamp('end_date'),
  currentPosition: boolean('current_position').default(false),
  createdAt: timestamp('created_at').defaultNow(),
});

export const education = pgTable('education', {
  id: serial('id').primaryKey(),
  university: text('university').notNull(),
  universityAr: text('university_ar'),
  degree: text('degree').notNull(),
  degreeAr: text('degree_ar'),
  major: text('major'),
  majorAr: text('major_ar'),
  location: text('location'),
  locationAr: text('location_ar'),
  period: text('period'),
  periodAr: text('period_ar'),
  description: text('description'),
  descriptionAr: text('description_ar'),
  startDate: timestamp('start_date'),
  endDate: timestamp('end_date'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const certificates = pgTable('certificates', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  nameAr: text('name_ar'),
  issuer: text('issuer').notNull(),
  issuerAr: text('issuer_ar'),
  date: timestamp('date'),
  credentialUrl: text('credential_url'),
  pdfUpload: text('pdf_upload'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const services = pgTable('services', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  titleAr: text('title_ar'),
  description: text('description').notNull(),
  descriptionAr: text('description_ar'),
  icon: text('icon'),
  pricePlaceholder: text('price_placeholder'),
  features: jsonb('features').$type<string[]>().default([]),
  featuresAr: jsonb('features_ar').$type<string[]>().default([]),
  orderIndex: integer('order_index').default(0),
  visible: boolean('visible').default(true),
  createdAt: timestamp('created_at').defaultNow(),
});

export const testimonials = pgTable('testimonials', {
  id: serial('id').primaryKey(),
  clientName: text('client_name').notNull(),
  clientNameAr: text('client_name_ar'),
  company: text('company'),
  companyAr: text('company_ar'),
  position: text('position'),
  positionAr: text('position_ar'),
  photo: text('photo'),
  review: text('review').notNull(),
  reviewAr: text('review_ar'),
  rating: integer('rating').default(5),
  published: boolean('published').default(false),
  createdAt: timestamp('created_at').defaultNow(),
});

export const messages = pgTable('messages', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull(),
  subject: text('subject'),
  message: text('message').notNull(),
  read: boolean('read').default(false),
  archived: boolean('archived').default(false),
  replyPlaceholder: text('reply_placeholder'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const socialLinks = pgTable('social_links', {
  id: serial('id').primaryKey(),
  platform: text('platform').notNull(), // github, linkedin, etc
  icon: text('icon'),
  url: text('url').notNull(),
  orderIndex: integer('order_index').default(0),
  visible: boolean('visible').default(true),
  createdAt: timestamp('created_at').defaultNow(),
});

// App settings/content singleton-like table
export const settings = pgTable('settings', {
  id: serial('id').primaryKey(),
  key: text('key').notNull().unique(), // e.g., 'hero', 'about', 'general'
  value: jsonb('value').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const pageViews = pgTable('page_views', {
  id: serial('id').primaryKey(),
  path: text('path').notNull(),
  ip: text('ip'),
  userAgent: text('user_agent'),
  country: text('country'),
  createdAt: timestamp('created_at').defaultNow(),
});
