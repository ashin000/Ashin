import { useEffect, useRef, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { useUIStore } from '../../store/uiStore';

export default function CustomCursor() {
  const { cursorMode, cursorLabel } = useUIStore();
  const [isVisible, setIsVisible] = useState(false);
  const isVisibleRef = useRef(false);

  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  // Smooth springs for trailing effect
  const springConfig = { damping: 25, stiffness: 250, mass: 0.5 };
  const cursorSpringX = useSpring(cursorX, springConfig);
  const cursorSpringY = useSpring(cursorY, springConfig);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      if (!isVisibleRef.current) {
        isVisibleRef.current = true;
        setIsVisible(true);
      }
    };

    const handleMouseLeave = () => {
      isVisibleRef.current = false;
      setIsVisible(false);
    };

    const handleMouseEnter = () => {
      isVisibleRef.current = true;
      setIsVisible(true);
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    // Add active cursor class to body for pointer-none rules
    document.body.classList.add('custom-cursor-active');

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
      document.body.classList.remove('custom-cursor-active');
    };
  }, []);

  if (!isVisible) return null;

  // Custom sizes based on cursor mode
  const getCursorStyles = () => {
    switch (cursorMode) {
      case 'hover':
        return {
          width: 50,
          height: 50,
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          borderColor: '#60A5FA',
          borderWidth: 1.5,
        };
      case 'magnetic':
        return {
          width: 65,
          height: 65,
          backgroundColor: 'rgba(96, 165, 250, 0.15)',
          borderColor: '#3B82F6',
          borderWidth: 2,
        };
      case 'text':
        return {
          width: 12,
          height: 40,
          backgroundColor: '#FFFFFF',
          borderRadius: '4px',
          borderWidth: 0,
        };
      default:
        return {
          width: 20,
          height: 20,
          backgroundColor: 'rgba(255, 255, 255, 0.05)',
          borderColor: 'rgba(255, 255, 255, 0.4)',
          borderWidth: 1,
        };
    }
  };

  const styles = getCursorStyles();

  return (
    <>
      {/* Outer Ring/Glow */}
      <motion.div
        style={{
          position: 'fixed',
          left: cursorSpringX,
          top: cursorSpringY,
          translateX: '-50%',
          translateY: '-50%',
          pointerEvents: 'none',
          zIndex: 9999,
          borderRadius: cursorMode === 'text' ? '2px' : '50%',
          ...styles,
        }}
        animate={{
          scale: cursorMode === 'hover' || cursorMode === 'magnetic' ? 1.15 : 1,
        }}
        transition={{ type: 'spring', damping: 20, stiffness: 300 }}
        className="hidden md:flex items-center justify-center overflow-hidden transition-colors duration-200"
      >
        {cursorLabel && cursorMode === 'hover' && (
          <span className="text-[9px] font-heading uppercase tracking-wider text-white font-semibold">
            {cursorLabel}
          </span>
        )}
      </motion.div>

      {/* Inner Dot */}
      <motion.div
        style={{
          position: 'fixed',
          left: cursorX,
          top: cursorY,
          translateX: '-50%',
          translateY: '-50%',
          pointerEvents: 'none',
          zIndex: 10000,
          width: 6,
          height: 6,
          backgroundColor: '#3B82F6',
          borderRadius: '50%',
          boxShadow: '0 0 10px #60A5FA, 0 0 20px #3B82F6',
        }}
        className="hidden md:block"
      />
    </>
  );
}
