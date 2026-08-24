import { useEffect } from 'react';
import Lenis from 'lenis';
import { useUIStore } from './store/uiStore';
import { useKonamiCode } from './hooks/useKonamiCode';

// Components
import LoadingScreen from './components/ui/LoadingScreen';
import Background3D from './components/ui/Background3D';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Terminal from './components/ui/Terminal';

// Sections
import Hero from './components/sections/Hero';
import About from './components/sections/About';
import Stats from './components/sections/Stats';
import Experience from './components/sections/Experience';
import Skills from './components/sections/Skills';
import Projects from './components/sections/Projects';
import Certificates from './components/sections/Certificates';
import Services from './components/sections/Services';
import GitHub from './components/sections/GitHub';
import Contact from './components/sections/Contact';

export default function App() {
  const { loading, setTerminalOpen } = useUIStore();

  // Initialize Lenis Smooth Scroll
  useEffect(() => {
    if (loading) return;

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, [loading]);

  // Register Konami Code Easter Egg
  useKonamiCode(() => {
    console.log('Konami Code sequence detected! Activating terminal panel...');
    setTerminalOpen(true);
  });

  return (
    <>
      {/* 1. Loading Screen */}
      <LoadingScreen />

      {!loading && (
        <>
          {/* 2. Interactive 3D Canvas Background */}
          <Background3D />

          {/* 3. Glassmorphic Navigation Bar */}
          <Navbar />

          {/* 5. Main Content Wrapper */}
          <main className="relative z-10 w-full overflow-x-hidden">
            <Hero />
            <About />
            <Stats />
            <Experience />
            <Skills />
            <Projects />
            <Certificates />
            <Services />
            <GitHub />
            <Contact />
          </main>

          {/* 6. Page Footer */}
          <Footer />

          {/* 7. Hidden Easter Egg Terminal Shell Overlay */}
          <Terminal />
        </>
      )}
    </>
  );
}
