import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Button } from '../components/ui/Button';
import { Home, Search } from 'lucide-react';
import { SEO } from '../components/SEO';

export default function NotFound() {
  return (
    <>
      <SEO title="404 - Page Not Found" />
      <div className="min-h-[80vh] flex flex-col items-center justify-center px-4 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-9xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-emerald-500 mb-4">
            404
          </h1>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
            Oops! Page Not Found
          </h2>
          <p className="text-lg text-zinc-600 dark:text-zinc-400 max-w-lg mx-auto mb-8">
            The page you're looking for doesn't exist, has been moved, or is temporarily unavailable. Let's get you back on track.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button size="lg" className="rounded-full" asChild>
              <Link to="/">
                <Home className="mr-2 h-4 w-4" />
                Back to Home
              </Link>
            </Button>
            <Button variant="outline" size="lg" className="rounded-full" asChild>
              <Link to="/portfolio">
                <Search className="mr-2 h-4 w-4" />
                Explore Projects
              </Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </>
  );
}
