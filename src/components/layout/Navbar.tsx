import React from 'react';
import { NavLink } from 'react-router-dom';
import { Moon, Sun, Globe, Menu, X } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';
import { Button } from '../ui/Button';
import { cn } from '../../lib/utils';
import { motion, AnimatePresence } from 'motion/react';

export function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const { language, t, toggleLanguage, dir } = useLanguage();
  const [isOpen, setIsOpen] = React.useState(false);

  const links = [
    { to: '/', label: t.nav.home },
    { to: '/about', label: t.nav.about },
    { to: '/portfolio', label: t.nav.portfolio },
    { to: '/services', label: t.nav.services },
    { to: '/blog', label: t.nav.blog },
    { to: '/resume', label: t.nav.resume },
    { to: '/contact', label: t.nav.contact },
    { to: '/admin', label: 'Admin' },
  ];

  return (
    <nav className="fixed top-0 w-full z-50 bg-white/90 dark:bg-[#09090b]/90 backdrop-blur-md border-b border-zinc-200 dark:border-white/10 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-2">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0 flex items-center">
            <NavLink to="/" className="text-xl font-[800] tracking-[-0.02em] flex items-center gap-2">
              {language === 'en' ? 'Emad Alhalaqi' : 'عماد الحلقي'}
              <div className="flex items-center gap-2 bg-emerald-500/10 px-2 py-1 rounded-full">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest hidden sm:inline-block">
                  {dir === 'rtl' ? 'متاح' : 'Available'}
                </span>
              </div>
            </NavLink>
          </div>
          
          <div className="hidden md:flex items-center space-x-1 rtl:space-x-reverse">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  cn(
                    "px-3 py-2 text-[0.875rem] font-[500] transition-colors",
                    isActive
                      ? "text-zinc-900 dark:text-white"
                      : "text-zinc-600 dark:text-[#a1a1aa] hover:text-zinc-900 dark:hover:text-white"
                  )
                }
              >
                {link.label}
              </NavLink>
            ))}
          </div>

          <div className="flex items-center space-x-2 rtl:space-x-reverse">
            <Button variant="ghost" size="icon" onClick={toggleLanguage} className="rounded-full hidden sm:flex" aria-label="Toggle language">
              <Globe className="h-4 w-4" />
              <span className="sr-only">Toggle language</span>
            </Button>
            <Button variant="ghost" size="icon" onClick={toggleTheme} className="rounded-full hidden sm:flex" aria-label="Toggle theme">
              {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              <span className="sr-only">Toggle theme</span>
            </Button>
            <Button size="sm" className="hidden sm:flex rounded-full px-4" asChild>
              <NavLink to="/contact">
                {dir === 'rtl' ? 'تواصل معي' : 'Contact Me'}
              </NavLink>
            </Button>
            
            <div className="md:hidden">
              <Button variant="ghost" size="icon" onClick={() => setIsOpen(!isOpen)} aria-label="Menu">
                {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden glass border-t border-zinc-200 dark:border-zinc-800"
          >
            <div className="px-2 pt-2 pb-3 space-y-1">
              {links.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  onClick={() => setIsOpen(false)}
                  className={({ isActive }) =>
                    cn(
                      "block px-3 py-2 rounded-md text-base font-medium",
                      isActive
                        ? "bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50"
                        : "text-zinc-600 dark:text-zinc-400"
                    )
                  }
                >
                  {link.label}
                </NavLink>
              ))}
              <div className="flex items-center space-x-2 rtl:space-x-reverse px-3 py-2">
                <Button variant="outline" size="sm" onClick={toggleLanguage} className="w-full justify-center">
                  <Globe className="h-4 w-4 mr-2 rtl:ml-2 rtl:mr-0" />
                  {language === 'en' ? 'عربي' : 'English'}
                </Button>
                <Button variant="outline" size="sm" onClick={toggleTheme} className="w-full justify-center">
                  {theme === 'dark' ? <Sun className="h-4 w-4 mr-2 rtl:ml-2 rtl:mr-0" /> : <Moon className="h-4 w-4 mr-2 rtl:ml-2 rtl:mr-0" />}
                  {theme === 'dark' ? 'Light' : 'Dark'}
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
