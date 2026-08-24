import { ArrowUp } from 'lucide-react';
import { FaGithub, FaLinkedin, FaInstagram } from 'react-icons/fa';
import { useUIStore } from '../../store/uiStore';
import Magnetic from '../ui/Magnetic';

export default function Footer() {
  const { setCursorMode } = useUIStore();
  const currentYear = new Date().getFullYear();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative border-t border-white/5 bg-[#050816] py-12 overflow-hidden">
      {/* Background radial overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(59,130,246,0.03),transparent_60%)] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
        
        {/* Left side brand details */}
        <div className="flex flex-col items-center md:items-start text-center md:text-left gap-2">
          <div className="font-heading text-lg font-bold tracking-widest text-white">
            ASHIN R.
          </div>
          <p className="font-body text-xs text-subtext/70 italic max-w-xs">
            "Building the Future with Artificial Intelligence."
          </p>
        </div>

        {/* Center: Social Icons */}
        <div className="flex items-center gap-6">
          <Magnetic strength={0.3}>
            <a
              href="https://github.com/ashin000"
              target="_blank"
              rel="noopener noreferrer"
              onMouseEnter={() => setCursorMode('magnetic')}
              onMouseLeave={() => setCursorMode('default')}
              className="p-3 rounded-full border border-white/5 bg-white/5 text-subtext hover:text-blue-400 hover:border-blue-500/30 transition-premium shadow-premium-glow hover:bg-white/5"
            >
              <FaGithub className="w-4 h-4" />
            </a>
          </Magnetic>
          <Magnetic strength={0.3}>
            <a
              href="https://in.linkedin.com/in/ashin-r-05a4b9325"
              target="_blank"
              rel="noopener noreferrer"
              onMouseEnter={() => setCursorMode('magnetic')}
              onMouseLeave={() => setCursorMode('default')}
              className="p-3 rounded-full border border-white/5 bg-white/5 text-subtext hover:text-blue-400 hover:border-blue-500/30 transition-premium shadow-premium-glow hover:bg-white/5"
            >
              <FaLinkedin className="w-4 h-4" />
            </a>
          </Magnetic>
          <Magnetic strength={0.3}>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              onMouseEnter={() => setCursorMode('magnetic')}
              onMouseLeave={() => setCursorMode('default')}
              className="p-3 rounded-full border border-white/5 bg-white/5 text-subtext hover:text-blue-400 hover:border-blue-500/30 transition-premium shadow-premium-glow hover:bg-white/5"
            >
              <FaInstagram className="w-4 h-4" />
            </a>
          </Magnetic>
        </div>

        {/* Right side: Copyright & Back to top */}
        <div className="flex flex-col items-center md:items-end text-center md:text-right gap-3">
          <p className="font-body text-xs text-subtext/60">
            &copy; {currentYear} Ashin R. All rights reserved.
          </p>
          <p className="font-body text-[10px] text-subtext/40">
            Designed and Developed by{' '}
            <span className="text-subtext/70 font-semibold hover:text-blue-400 transition-colors">
              Ashin R
            </span>
          </p>
          
          {/* Scroll to Top Trigger */}
          <button
            onClick={scrollToTop}
            onMouseEnter={() => setCursorMode('hover')}
            onMouseLeave={() => setCursorMode('default')}
            className="mt-2 flex items-center gap-1.5 font-heading text-[10px] font-bold tracking-widest text-subtext hover:text-white uppercase transition-colors"
          >
            Back to top
            <div className="p-1.5 rounded-full border border-white/10 bg-white/5 text-subtext hover:text-white transition-premium">
              <ArrowUp className="w-3 h-3" />
            </div>
          </button>
        </div>
      </div>
    </footer>
  );
}
