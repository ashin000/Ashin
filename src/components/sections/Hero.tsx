import { useEffect, useRef } from 'react';
import { TypeAnimation } from 'react-type-animation';
import { motion } from 'framer-motion';
import { ArrowRight, Download, Send } from 'lucide-react';
import { useUIStore } from '../../store/uiStore';
import Magnetic from '../ui/Magnetic';
import profileImage from '../../assets/profile.jpg';
import { usePortfolioContent } from '../../store/PortfolioContentContext';

export default function Hero() {
  const { setCursorMode } = useUIStore();
  const { content } = usePortfolioContent();
  const roles = Array.isArray(content.profile.roles) ? content.profile.roles : [];
  const roleSequence = roles.flatMap((role) => [role, 2200]);
  const cardRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<number | null>(null);

  const updateCardTransform = (x: number, y: number) => {
    if (!cardRef.current) return;
    cardRef.current.style.transform = `perspective(1000px) rotateX(${x}deg) rotateY(${y}deg)`;
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    // Mouse coords relative to card center (-0.5 to 0.5)
    const mouseX = (e.clientX - rect.left) / width - 0.5;
    const mouseY = (e.clientY - rect.top) / height - 0.5;
    const rotateX = -mouseY * 20;
    const rotateY = mouseX * 20;

    if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
    frameRef.current = requestAnimationFrame(() => updateCardTransform(rotateX, rotateY));
  };

  const handleMouseLeave = () => {
    if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
    frameRef.current = null;
    updateCardTransform(0, 0);
  };

  useEffect(() => {
    return () => {
      if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
    };
  }, []);

  const scrollToSection = (href: string) => {
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      id="home"
      className="relative min-h-[92svh] flex items-center justify-center pt-24 pb-12 overflow-hidden px-6 md:px-12"
    >
      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
        
        {/* Left Side: Copywriting and CTAs */}
        <div className="lg:col-span-7 text-left flex flex-col gap-6">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="flex items-center gap-2"
          >
            <span className="w-8 h-[1px] bg-blue-500" />
            <span className="font-code text-xs md:text-sm text-blue-400 uppercase tracking-widest font-semibold">
              Hello, I'm
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut', delay: 0.1 }}
            className="font-heading text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-white leading-[1.1]"
          >
            {String(content.profile.name ?? 'ASHIN R')}
          </motion.h1>

          {/* Typing Role Animation */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="font-heading text-xl sm:text-2xl md:text-3xl font-semibold text-blue-400 min-h-[40px] flex items-center"
          >
            <TypeAnimation
              sequence={roleSequence.length ? roleSequence : ['Software Developer', 2200]}
              wrapper="span"
              speed={45}
              repeat={Infinity}
              className="drop-shadow-[0_0_10px_rgba(148,175,208,0.35)]"
            />
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut', delay: 0.3 }}
            className="font-body text-sm sm:text-base md:text-lg text-subtext leading-relaxed max-w-2xl mt-2"
          >
            {String(content.profile.summary ?? '')}
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut', delay: 0.4 }}
            className="flex flex-wrap items-center gap-4 mt-6"
          >
            {/* View Projects */}
            <Magnetic strength={0.2}>
              <button
                onClick={() => scrollToSection('#projects')}
                onMouseEnter={() => setCursorMode('magnetic')}
                onMouseLeave={() => setCursorMode('default')}
                className="flex items-center gap-2 px-6 py-3 font-body text-xs sm:text-sm font-semibold uppercase tracking-wider text-white border border-blue-500 rounded-full bg-blue-500/10 hover:bg-blue-500 shadow-accent-glow hover:shadow-premium-glow-lg transition-premium group"
              >
                View Projects
                <ArrowRight className="w-4.5 h-4.5 group-hover:translate-x-1 transition-transform" />
              </button>
            </Magnetic>

            {/* Resume */}
            <Magnetic strength={0.15}>
              <a
                href={String(content.profile.resumeUrl ?? '/resume.pdf')}
                download="Ashin-R-Resume.pdf"
                onMouseEnter={() => setCursorMode('hover')}
                onMouseLeave={() => setCursorMode('default')}
                className="flex items-center gap-2 px-6 py-3 font-body text-xs sm:text-sm font-semibold uppercase tracking-wider text-subtext hover:text-white border border-white/5 hover:border-white/20 rounded-full bg-white/5 hover:bg-white/5 transition-premium"
              >
                Download Resume
                <Download className="w-4.5 h-4.5" />
              </a>
            </Magnetic>

            {/* Hire Me */}
            <Magnetic strength={0.15}>
              <button
                onClick={() => scrollToSection('#contact')}
                onMouseEnter={() => setCursorMode('magnetic')}
                onMouseLeave={() => setCursorMode('default')}
                className="flex items-center gap-2 px-6 py-3 font-body text-xs sm:text-sm font-semibold uppercase tracking-wider text-subtext hover:text-white border border-white/5 hover:border-white/20 rounded-full bg-white/5 hover:bg-white/5 transition-premium"
              >
                Hire Me
                <Send className="w-4 h-4" />
              </button>
            </Magnetic>
          </motion.div>
        </div>

        {/* Right Side: Professional Interactive Wireframe avatar */}
        <div className="lg:col-span-5 flex justify-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
            ref={cardRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{
              transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg)',
              transformStyle: 'preserve-3d',
            }}
            className="w-72 h-96 sm:w-80 sm:h-[420px] relative rounded-2xl border border-slate-200 bg-slate-50 p-3 shadow-[0_14px_40px_rgba(15,23,42,0.08)] transition-all duration-100 ease-out flex items-center justify-center overflow-hidden cursor-pointer"
          >
            <div className="relative w-full h-full overflow-hidden rounded-xl border border-slate-200 bg-white" style={{ transform: 'translateZ(30px)' }}>
              <img
                src={String(content.profile.imageUrl || profileImage)}
                alt="Ashin R"
                className="h-full w-full object-cover object-top"
              />
            </div>
            
          </motion.div>
        </div>

      </div>

      {/* Slide down arrow */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-subtext/90 animate-bounce cursor-pointer" onClick={() => scrollToSection('#about')}>
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>
    </section>
  );
}
