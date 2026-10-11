import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal as TerminalIcon, Menu, X, ArrowUpRight } from 'lucide-react';
import { useUIStore } from '../../store/uiStore';
import Magnetic from '../ui/Magnetic';
import { usePortfolioContent } from '../../store/PortfolioContentContext';

const navItems = [
  { label: 'Home', href: '#home' },
  { label: 'About', href: '#about' },
  { label: 'Experience', href: '#experience' },
  { label: 'Skills', href: '#skills' },
  { label: 'Projects', href: '#projects' },
  { label: 'Certificates', href: '#certificates' },
  { label: 'Services', href: '#services' },
  { label: 'Contact', href: '#contact' },
];

export default function Navbar() {
  const { activeSection, setActiveSection, toggleTerminal, setCursorMode } = useUIStore();
  const { content } = usePortfolioContent();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);

      // Simple active section check based on scroll position
      const sections = navItems.map((item) => item.href.substring(1));
      const scrollPos = window.scrollY + 100;

      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [setActiveSection]);

  const handleNavClick = (href: string) => {
    setMobileMenuOpen(false);
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <motion.header
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        scrolled
          ? 'py-4 bg-[#050816]/75 backdrop-blur-md border-b border-white/5'
          : 'py-6 bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
        {/* Monogram Logo */}
        <a
          href="#home"
          onClick={(e) => {
            e.preventDefault();
            handleNavClick('#home');
          }}
          onMouseEnter={() => setCursorMode('magnetic')}
          onMouseLeave={() => setCursorMode('default')}
          className="flex items-center gap-2.5 font-heading text-lg font-bold tracking-widest text-white group"
        >
          <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400 group-hover:bg-blue-500/20 group-hover:border-blue-500/50 transition-premium shadow-[0_0_10px_rgba(59,130,246,0.15)]">
            AR
          </div>
          <span className="hidden sm:inline-block group-hover:text-blue-400 transition-colors">
            {String(content.profile.name ?? 'ASHIN R')}.
          </span>
        </a>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1.5 p-1 bg-white/0 border border-white/0 rounded-full">
          {navItems.map((item) => {
            const isActive = activeSection === item.href.substring(1);
            return (
              <a
                key={item.label}
                href={item.href}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick(item.href);
                }}
                onMouseEnter={() => setCursorMode('hover')}
                onMouseLeave={() => setCursorMode('default')}
                className={`relative px-4 py-2 font-body text-xs font-medium tracking-wide uppercase rounded-full transition-colors duration-300 ${
                  isActive ? 'text-white' : 'text-subtext hover:text-white'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="active-nav-pill"
                    className="absolute inset-0 bg-white/5 border border-white/10 rounded-full -z-10"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
                {item.label}
              </a>
            );
          })}
        </nav>

        {/* Action Buttons (Resume & Terminal toggle) */}
        <div className="hidden lg:flex items-center gap-4">
          {/* Active Terminal Trigger */}
          <Magnetic strength={0.3}>
            <button
              onClick={toggleTerminal}
              onMouseEnter={() => setCursorMode('magnetic')}
              onMouseLeave={() => setCursorMode('default')}
              title="Open Shell Terminal"
              className="p-2.5 rounded-lg border border-white/5 bg-white/5 hover:bg-white/5 text-subtext hover:text-white transition-premium"
            >
              <TerminalIcon className="w-4.5 h-4.5 text-blue-400 drop-shadow-[0_0_5px_rgba(96,165,250,0.5)]" />
            </button>
          </Magnetic>

          {/* Premium Resume Button */}
          <Magnetic strength={0.25}>
            <a
              href={String(content.profile.resumeUrl ?? '/resume.pdf')}
              download="Ashin-R-Resume.pdf"
              onMouseEnter={() => setCursorMode('hover')}
              onMouseLeave={() => setCursorMode('default')}
              className="flex items-center gap-1 px-4 py-2 font-body text-xs font-semibold uppercase tracking-wider text-white border border-blue-500/30 rounded-full bg-blue-500/10 hover:bg-blue-500 hover:border-blue-500 shadow-premium-glow hover:shadow-premium-glow-lg transition-premium"
            >
              Resume
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
          </Magnetic>
        </div>

        {/* Mobile controls */}
        <div className="flex lg:hidden items-center gap-3">
          <button
            onClick={toggleTerminal}
            className="p-2 rounded-lg border border-white/5 bg-white/5 text-blue-400"
          >
            <TerminalIcon className="w-4 h-4" />
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg border border-white/5 bg-white/5 text-white"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Slidedown */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="lg:hidden absolute top-[100%] left-0 right-0 bg-[#050816]/95 backdrop-blur-xl border-b border-white/5 overflow-hidden"
          >
            <nav className="flex flex-col p-6 gap-4">
              {navItems.map((item) => {
                const isActive = activeSection === item.href.substring(1);
                return (
                  <a
                    key={item.label}
                    href={item.href}
                    onClick={(e) => {
                      e.preventDefault();
                      handleNavClick(item.href);
                    }}
                    className={`text-sm font-body font-semibold tracking-widest uppercase py-2 border-b border-white/3 ${
                      isActive ? 'text-blue-400' : 'text-subtext'
                    }`}
                  >
                    {item.label}
                  </a>
                );
              })}
              <a
                href={String(content.profile.resumeUrl ?? '/resume.pdf')}
                download="Ashin-R-Resume.pdf"
                className="flex items-center justify-center gap-2 py-3 mt-2 text-center text-xs font-semibold uppercase tracking-wider text-white border border-blue-500/30 rounded-lg bg-blue-500/10"
              >
                Download Resume
                <ArrowUpRight className="w-4 h-4" />
              </a>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
