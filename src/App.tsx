import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { LanguageProvider } from './context/LanguageContext';
import { AuthProvider } from './context/AuthContext';
import { Layout } from './components/layout/Layout';
import { AdminLayout } from './components/layout/AdminLayout';
import { AnalyticsTracker } from './components/AnalyticsTracker';
import Home from './pages/Home';
import About from './pages/About';
import Portfolio from './pages/Portfolio';
import Services from './pages/Services';
import Blog from './pages/Blog';
import BlogPost from './pages/BlogPost';
import Resume from './pages/Resume';
import Contact from './pages/Contact';
import NotFound from './pages/NotFound';

// Admin Pages
import Dashboard from './pages/admin/Dashboard';
import ProjectsAdmin from './pages/admin/ProjectsAdmin';
import PostsAdmin from './pages/admin/PostsAdmin';
import ServicesAdmin from './pages/admin/ServicesAdmin';
import SocialLinksAdmin from './pages/admin/SocialLinksAdmin';
import Login from './pages/admin/Login';

import SettingsAdmin from './pages/admin/SettingsAdmin';
import MessagesAdmin from './pages/admin/MessagesAdmin';

import SkillsAdmin from './pages/admin/SkillsAdmin';
import CertificatesAdmin from './pages/admin/CertificatesAdmin';
import TestimonialsAdmin from './pages/admin/TestimonialsAdmin';
import ResumeAdmin from './pages/admin/ResumeAdmin';

export default function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <AuthProvider>
          <BrowserRouter>
            <AnalyticsTracker />
            <Routes>
              {/* Main Website */}
              <Route path="/" element={<Layout />}>
                <Route index element={<Home />} />
                <Route path="about" element={<About />} />
                <Route path="portfolio" element={<Portfolio />} />
                <Route path="services" element={<Services />} />
                <Route path="blog" element={<Blog />} />
                <Route path="blog/:slug" element={<BlogPost />} />
                <Route path="resume" element={<Resume />} />
                <Route path="contact" element={<Contact />} />
                <Route path="*" element={<NotFound />} />
              </Route>

              {/* Admin Panel */}
              <Route path="/login" element={<Login />} />
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<Dashboard />} />
                <Route path="projects" element={<ProjectsAdmin />} />
                <Route path="posts" element={<PostsAdmin />} />
                <Route path="services" element={<ServicesAdmin />} />
                <Route path="social-links" element={<SocialLinksAdmin />} />
                <Route path="skills" element={<SkillsAdmin />} />
                <Route path="certificates" element={<CertificatesAdmin />} />
                <Route path="testimonials" element={<TestimonialsAdmin />} />
                <Route path="resume" element={<ResumeAdmin />} />
                <Route path="settings" element={<SettingsAdmin />} />
                <Route path="messages" element={<MessagesAdmin />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}

