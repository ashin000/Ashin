import { motion } from 'framer-motion';
import { Target, Eye, Award } from 'lucide-react';
import { useUIStore } from '../../store/uiStore';

export default function About() {
  const { setCursorMode } = useUIStore();

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] as any },
    },
  };

  return (
    <section
      id="about"
      className="relative py-24 overflow-hidden px-6 md:px-12 border-t border-white/5 bg-[#050816]"
    >
      {/* Subtle Glow Overlay */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-80 h-80 bg-blue-500/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-col mb-12 text-left"
        >
          <span className="font-code text-xs text-blue-400 uppercase tracking-[0.2em] font-semibold mb-2">
            01 / GENESIS
          </span>
          <h2 className="font-heading text-3xl md:text-4xl font-bold tracking-tight text-white">
            ABOUT ME
          </h2>
          <div className="h-[1px] w-20 bg-blue-500/50 mt-4" />
        </motion.div>

        {/* Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* Left Side: The Storytelling Paragraphs */}
          <div className="lg:col-span-7 text-left">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-100px' }}
              variants={containerVariants}
              className="flex flex-col gap-6"
            >
              <motion.p
                variants={itemVariants}
                className="font-heading text-xl sm:text-2xl md:text-3xl text-white font-medium leading-relaxed border-l-2 border-blue-500/30 pl-6 py-2"
              >
                "My curiosity started with one question: <span className="text-blue-400 drop-shadow-[0_0_8px_rgba(96,165,250,0.3)] font-semibold">How machines think like humans?</span>"
              </motion.p>

              <motion.p
                variants={itemVariants}
                className="font-body text-base md:text-lg text-subtext leading-relaxed mt-2"
              >
                That single question inspired my journey into Artificial Intelligence. Today I build
                intelligent software, AI systems, automation tools, IoT applications, and modern web
                platforms that solve real-world problems.
              </motion.p>

              <motion.p
                variants={itemVariants}
                className="font-body text-base md:text-lg text-subtext leading-relaxed"
              >
                I believe every unfamiliar technology is simply another opportunity to learn. Whenever I
                encounter a new challenge, I quickly adapt, learn what is necessary, and build the solution.
              </motion.p>
            </motion.div>
          </div>

          {/* Right Side: Mission, Vision, Values Grid */}
          <div className="lg:col-span-5">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-100px' }}
              variants={containerVariants}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-6"
            >
              {/* Mission Card */}
              <motion.div
                variants={itemVariants}
                onMouseEnter={() => setCursorMode('hover')}
                onMouseLeave={() => setCursorMode('default')}
                className="glass-panel glass-panel-hover p-6 rounded-xl border border-white/5 flex gap-4 text-left transition-all duration-300"
              >
                <div className="p-3 rounded-lg bg-blue-500/10 text-blue-400 h-fit border border-blue-500/20">
                  <Target className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-heading text-sm font-semibold tracking-wider text-white uppercase mb-1.5">
                    Mission
                  </h3>
                  <p className="font-body text-xs text-subtext leading-relaxed">
                    Pioneering intelligent software architectures that bridge complex data structures with intuitive human interfaces.
                  </p>
                </div>
              </motion.div>

              {/* Vision Card */}
              <motion.div
                variants={itemVariants}
                onMouseEnter={() => setCursorMode('hover')}
                onMouseLeave={() => setCursorMode('default')}
                className="glass-panel glass-panel-hover p-6 rounded-xl border border-white/5 flex gap-4 text-left transition-all duration-300"
              >
                <div className="p-3 rounded-lg bg-blue-500/10 text-blue-400 h-fit border border-blue-500/20">
                  <Eye className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-heading text-sm font-semibold tracking-wider text-white uppercase mb-1.5">
                    Vision
                  </h3>
                  <p className="font-body text-xs text-subtext leading-relaxed">
                    Accelerating developer capabilities and enterprise scalability by automating deployment, systems, and workflow engines.
                  </p>
                </div>
              </motion.div>

              {/* Core Values Card */}
              <motion.div
                variants={itemVariants}
                onMouseEnter={() => setCursorMode('hover')}
                onMouseLeave={() => setCursorMode('default')}
                className="glass-panel glass-panel-hover p-6 rounded-xl border border-white/5 flex gap-4 text-left transition-all duration-300"
              >
                <div className="p-3 rounded-lg bg-blue-500/10 text-blue-400 h-fit border border-blue-500/20">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-heading text-sm font-semibold tracking-wider text-white uppercase mb-1.5">
                    Core Values
                  </h3>
                  <p className="font-body text-xs text-subtext leading-relaxed">
                    Cultivating a growth mindset, practicing technical integrity, and deploying responsive systems built on solid principles.
                  </p>
                </div>
              </motion.div>

            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
}
