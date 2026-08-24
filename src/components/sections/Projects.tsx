import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { projectsData, type ProjectCaseStudy } from '../../data/projectsData';
import ProjectCaseStudyModal from '../ui/ProjectCaseStudyModal';
import { useUIStore } from '../../store/uiStore';

const categories = ['All', 'Artificial Intelligence', 'Full Stack', 'Data Science', 'IoT & Security'];

export default function Projects() {
  const { setCursorMode } = useUIStore();
  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedProject, setSelectedProject] = useState<ProjectCaseStudy | null>(null);

  const filteredProjects = projectsData.filter((project) => {
    if (activeCategory === 'All') return true;
    return project.category === activeCategory;
  });

  return (
    <section
      id="projects"
      className="relative py-24 overflow-hidden px-6 md:px-12 border-t border-white/5 bg-[#050816]"
    >
      {/* Background visual glows */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-96 h-96 bg-blue-500/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16 text-left">
          <div>
            <span className="font-code text-xs text-blue-400 uppercase tracking-[0.2em] font-semibold mb-2">
              04 / PORTFOLIO
            </span>
            <h2 className="font-heading text-3xl md:text-4xl font-bold tracking-tight text-white">
              CASE STUDIES & PROJECTS
            </h2>
            <div className="h-[1px] w-20 bg-blue-500/50 mt-4" />
          </div>

          {/* Filtering Bar */}
          <div className="flex flex-wrap items-center gap-2 bg-white/5 border border-white/5 p-1.5 rounded-2xl md:rounded-full">
            {categories.map((cat) => {
              const isActive = activeCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  onMouseEnter={() => setCursorMode('hover')}
                  onMouseLeave={() => setCursorMode('default')}
                  className={`px-4.5 py-2 font-body text-[10px] md:text-xs font-semibold uppercase tracking-wider rounded-xl md:rounded-full transition-all duration-300 ${
                    isActive ? 'bg-white/5 text-white border border-white/10' : 'text-subtext hover:text-white'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>

        {/* Projects Grid */}
        <motion.div
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
        >
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project) => {
              return (
                <motion.div
                  key={project.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  onClick={() => {
                    setSelectedProject(project);
                    setCursorMode('default');
                  }}
                  onMouseEnter={() => setCursorMode('hover')}
                  onMouseLeave={() => setCursorMode('default')}
                  className="glass-panel glass-panel-hover p-6 rounded-2xl border border-white/5 relative overflow-hidden transition-all duration-300 text-left cursor-pointer flex flex-col justify-between min-h-[220px]"
                >
                  {/* Glowing hover accent */}
                  <div className="absolute top-0 right-0 p-4 opacity-30 group-hover:opacity-100 transition-opacity">
                    <ArrowUpRight className="w-4 h-4 text-blue-400" />
                  </div>

                  <div>
                    {/* Header: Banner Emoji & Category */}
                    <div className="flex items-center gap-3.5 mb-4">
                      <span className="text-xl">{project.bannerEmoji}</span>
                      <span className="font-code text-[9px] font-bold text-subtext/70 uppercase tracking-widest bg-white/5 border border-white/5 px-2 py-0.5 rounded">
                        {project.category}
                      </span>
                    </div>

                    {/* Project Title */}
                    <h3 className="font-heading text-lg font-bold text-white tracking-tight mb-2">
                      {project.title}
                    </h3>

                    {/* Subtitle */}
                    <p className="font-body text-xs text-subtext leading-relaxed line-clamp-3">
                      {project.subtitle}
                    </p>
                  </div>

                  {/* Tech stack summary */}
                  <div className="flex flex-wrap gap-1.5 mt-5">
                    {project.techStack.slice(0, 3).map((tech) => (
                      <span
                        key={tech}
                        className="font-code text-[9px] text-white/50 bg-white/5 border border-white/3 px-2 py-0.5 rounded"
                      >
                        {tech}
                      </span>
                    ))}
                    {project.techStack.length > 3 && (
                      <span className="font-code text-[9px] text-blue-400 bg-blue-500/5 border border-blue-500/10 px-2 py-0.5 rounded font-semibold">
                        +{project.techStack.length - 3}
                      </span>
                    )}
                  </div>

                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>

        {/* Dynamic sliding Case Study Modal */}
        <AnimatePresence>
          {selectedProject && (
            <ProjectCaseStudyModal
              project={selectedProject}
              onClose={() => setSelectedProject(null)}
            />
          )}
        </AnimatePresence>

      </div>
    </section>
  );
}
