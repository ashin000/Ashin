import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUIStore } from '../../store/uiStore';

export default function LoadingScreen() {
  const { loading, loadingProgress, setLoading, setLoadingProgress } = useUIStore();
  const [showRole, setShowRole] = useState(false);

  useEffect(() => {
    if (!loading) return;

    let progress = 0;
    const interval = setInterval(() => {
      // Premium loading progression speed logic
      if (progress < 40) {
        progress += Math.floor(Math.random() * 8) + 4; // Fast start
      } else if (progress < 85) {
        progress += Math.floor(Math.random() * 4) + 1; // Slower middle
      } else if (progress < 99) {
        progress += 1; // Slow crawl near the end
      } else {
        progress = 100;
        clearInterval(interval);
        setTimeout(() => {
          setLoading(false);
        }, 800); // Short delay at 100% for smooth transition
      }

      const clamped = Math.min(progress, 100);
      setLoadingProgress(clamped);
    }, 45);

    // Show role subtext after a short delay
    const subtextTimeout = setTimeout(() => {
      setShowRole(true);
    }, 600);

    return () => {
      clearInterval(interval);
      clearTimeout(subtextTimeout);
    };
  }, [loading, setLoading, setLoadingProgress]);

  // Monogram SVG animation settings
  const pathVariants = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: {
      pathLength: 1,
      opacity: 1,
      transition: {
        duration: 2.2,
        ease: 'easeInOut' as const,
      },
    },
  };

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{
            opacity: 0,
            y: -100,
            transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as const },
          }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#050816] text-white"
        >
          {/* Background Grid Pattern */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />

          {/* Animated Monogram Logo */}
          <div className="relative mb-8 flex items-center justify-center w-28 h-28">
            <svg
              viewBox="0 0 100 100"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-full h-full text-blue-500 drop-shadow-[0_0_15px_rgba(59,130,246,0.6)]"
            >
              {/* Outer hexagonal border */}
              <motion.polygon
                points="50,5 90,28 90,72 50,95 10,72 10,28"
                stroke="currentColor"
                strokeWidth="1.5"
                variants={pathVariants}
                initial="hidden"
                animate="visible"
              />
              {/* 'A' Left leg */}
              <motion.path
                d="M 30 70 L 50 30"
                stroke="currentColor"
                strokeWidth="3.5"
                strokeLinecap="round"
                variants={pathVariants}
                initial="hidden"
                animate="visible"
              />
              {/* 'A' Right leg / 'R' stem */}
              <motion.path
                d="M 50 30 L 70 70"
                stroke="currentColor"
                strokeWidth="3.5"
                strokeLinecap="round"
                variants={pathVariants}
                initial="hidden"
                animate="visible"
              />
              {/* 'A' horizontal bar */}
              <motion.path
                d="M 38 54 L 62 54"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                variants={pathVariants}
                initial="hidden"
                animate="visible"
              />
              {/* 'R' curve */}
              <motion.path
                d="M 50 30 C 65 30, 65 48, 50 48"
                stroke="currentColor"
                strokeWidth="3.5"
                strokeLinecap="round"
                variants={pathVariants}
                initial="hidden"
                animate="visible"
              />
              {/* 'R' leg */}
              <motion.path
                d="M 50 48 L 65 70"
                stroke="currentColor"
                strokeWidth="3.5"
                strokeLinecap="round"
                variants={pathVariants}
                initial="hidden"
                animate="visible"
              />
            </svg>
          </div>

          {/* Text Branding */}
          <div className="text-center overflow-hidden mb-12">
            <motion.h1
              initial={{ y: 35, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, ease: 'easeOut' as const, delay: 0.2 }}
              className="font-heading text-3xl md:text-4xl font-bold tracking-[0.25em] text-white"
            >
              ASHIN R
            </motion.h1>

            <AnimatePresence>
              {showRole && (
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 0.7, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.6 }}
                  className="font-body text-xs md:text-sm tracking-[0.4em] uppercase text-blue-400 mt-2 font-medium"
                >
                  AI Engineer
                </motion.p>
              )}
            </AnimatePresence>
          </div>

          {/* Progress Bar & Numerical Counter */}
          <div className="w-64 md:w-80 flex flex-col items-center">
            {/* Progress Container */}
            <div className="relative w-full h-[3px] bg-white/5 rounded-full overflow-hidden mb-3">
              <motion.div
                style={{ width: `${loadingProgress}%` }}
                className="h-full bg-gradient-to-r from-blue-600 via-blue-400 to-glow shadow-[0_0_10px_#60A5FA]"
                transition={{ ease: 'easeOut' as const }}
              />
            </div>

            {/* Numerical Percentage */}
            <div className="flex justify-between w-full text-[10px] font-code text-subtext/60 uppercase tracking-widest">
              <span>SYSTEM LOADING</span>
              <span className="font-semibold text-blue-400">{loadingProgress}%</span>
            </div>
          </div>

          {/* Glowing dot moving in background */}
          <div className="absolute bottom-10 text-[9px] font-code text-subtext/40 tracking-[0.2em] uppercase">
            EST. 2026 // NEURAL NODE STABLE
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
