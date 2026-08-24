import { useState } from 'react';
import { motion } from 'framer-motion';
import { useUIStore } from '../../store/uiStore';
import {
  Code,
  Layout,
  Server,
  Database,
  BrainCircuit,
  GitBranch,
} from 'lucide-react';

import {
  SiPython,
  SiJavascript,
  SiTypescript,
  SiC,
  SiVite,
  SiTailwindcss,
  SiFastapi,
  SiFlask,
  SiDjango,
  SiFirebase,
  SiMongodb,
  SiMysql,
  SiSqlite,
  SiTensorflow,
  SiPytorch,
  SiScikitlearn,
  SiOpencv,
  SiPandas,
  SiNumpy,
} from 'react-icons/si';

import {
  FaJava,
  FaReact,
  FaHtml5,
  FaCss3Alt,
  FaBootstrap,
  FaNodeJs,
  FaLinux,
  FaAws,
  FaDocker,
  FaGitAlt,
  FaGithub,
  FaDatabase,
} from 'react-icons/fa';

import { VscVscode } from 'react-icons/vsc';

const skillsData = [
  {
    category: 'Programming',
    icon: Code,
    color: '#3B82F6', // Blue
    skills: [
      { name: 'Python', icon: SiPython },
      { name: 'Java', icon: FaJava },
      { name: 'JavaScript', icon: SiJavascript },
      { name: 'TypeScript', icon: SiTypescript },
      { name: 'C', icon: SiC },
      { name: 'SQL', icon: FaDatabase },
    ],
  },
  {
    category: 'Frontend',
    icon: Layout,
    color: '#10B981', // Emerald
    skills: [
      { name: 'React', icon: FaReact },
      { name: 'Vite', icon: SiVite },
      { name: 'HTML5', icon: FaHtml5 },
      { name: 'CSS3', icon: FaCss3Alt },
      { name: 'Tailwind CSS', icon: SiTailwindcss },
      { name: 'Bootstrap', icon: FaBootstrap },
    ],
  },
  {
    category: 'Backend',
    icon: Server,
    color: '#EC4899', // Pink
    skills: [
      { name: 'FastAPI', icon: SiFastapi },
      { name: 'Flask', icon: SiFlask },
      { name: 'Django', icon: SiDjango },
      { name: 'Node.js', icon: FaNodeJs },
    ],
  },
  {
    category: 'Databases',
    icon: Database,
    color: '#F59E0B', // Amber
    skills: [
      { name: 'Firebase', icon: SiFirebase },
      { name: 'MongoDB', icon: SiMongodb },
      { name: 'MySQL', icon: SiMysql },
      { name: 'SQLite', icon: SiSqlite },
    ],
  },
  {
    category: 'Artificial Intelligence',
    icon: BrainCircuit,
    color: '#8B5CF6', // Violet
    skills: [
      { name: 'TensorFlow', icon: SiTensorflow },
      { name: 'PyTorch', icon: SiPytorch },
      { name: 'Scikit Learn', icon: SiScikitlearn },
      { name: 'OpenCV', icon: SiOpencv },
      { name: 'Pandas', icon: SiPandas },
      { name: 'NumPy', icon: SiNumpy },
    ],
  },
  {
    category: 'DevOps & Tools',
    icon: GitBranch,
    color: '#EF4444', // Red
    skills: [
      { name: 'Linux OS', icon: FaLinux },
      { name: 'AWS Cloud', icon: FaAws },
      { name: 'Docker', icon: FaDocker },
      { name: 'Git', icon: FaGitAlt },
      { name: 'GitHub', icon: FaGithub },
      { name: 'VS Code', icon: VscVscode },
    ],
  },
];

export default function Skills() {
  const { setCursorMode } = useUIStore();
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as any },
    },
  };

  return (
    <section
      id="skills"
      className="relative py-24 overflow-hidden px-6 md:px-12 border-t border-white/5 bg-[#050816]"
    >
      {/* Background visual detail */}
      <div className="absolute top-1/4 right-0 w-80 h-80 bg-blue-500/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-col mb-16 text-left"
        >
          <span className="font-code text-xs text-blue-400 uppercase tracking-[0.2em] font-semibold mb-2">
            03 / CAPABILITIES
          </span>
          <h2 className="font-heading text-3xl md:text-4xl font-bold tracking-tight text-white">
            SKILLS & STACK
          </h2>
          <div className="h-[1px] w-20 bg-blue-500/50 mt-4" />
        </motion.div>

        {/* Categories Grid */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          variants={containerVariants}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
        >
          {skillsData.map((category, index) => {
            const Icon = category.icon;
            const isHovered = hoveredIndex === index;

            return (
              <motion.div
                key={category.category}
                variants={cardVariants}
                onMouseEnter={() => {
                  setHoveredIndex(index);
                  setCursorMode('hover');
                }}
                onMouseLeave={() => {
                  setHoveredIndex(null);
                  setCursorMode('default');
                }}
                className="glass-panel p-6 md:p-8 rounded-2xl border border-white/5 relative overflow-hidden transition-all duration-500 select-none group"
                style={{
                  transform: isHovered ? 'translateY(-6px)' : 'translateY(0)',
                  borderColor: isHovered ? `${category.color}33` : 'rgba(255, 255, 255, 0.08)',
                  boxShadow: isHovered
                    ? `0 10px 30px -15px ${category.color}44, 0 0 20px -5px ${category.color}22`
                    : 'none',
                }}
              >
                {/* Glow Background Overlay */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  style={{
                    background: `radial-gradient(circle at 50% 10%, ${category.color}0d, transparent 50%)`,
                  }}
                />

                {/* Category Header */}
                <div className="flex items-center gap-3.5 mb-6 text-left relative z-10">
                  <div
                    className="p-2.5 rounded-xl border transition-colors duration-300"
                    style={{
                      backgroundColor: `${category.color}10`,
                      borderColor: `${category.color}30`,
                      color: category.color,
                    }}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-heading text-lg font-bold text-white tracking-wide">
                    {category.category}
                  </h3>
                </div>

                {/* Grid of skills */}
                <div className="grid grid-cols-2 gap-3 relative z-10">
                  {category.skills.map((skill) => {
                    const SkillIcon = skill.icon;
                    return (
                      <div
                        key={skill.name}
                        className="flex items-center gap-2 p-2.5 rounded-xl bg-white/5 border border-white/3 hover:bg-white/5 hover:border-white/10 transition-premium text-left group/skill"
                      >
                        <span 
                          className="flex items-center justify-center w-6 h-6 rounded-md bg-white/5 border border-white/5 text-subtext transition-colors group-hover/skill:text-white"
                          style={{ '--hover-color': category.color } as React.CSSProperties}
                        >
                          <SkillIcon className="w-3.5 h-3.5 group-hover/skill:text-[var(--hover-color)] transition-colors duration-300" />
                        </span>
                        <span className="font-body text-[11px] md:text-xs font-medium text-subtext group-hover/skill:text-white transition-colors duration-300">
                          {skill.name}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            );
          })}
        </motion.div>

      </div>
    </section>
  );
}
