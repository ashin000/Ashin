import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import type { ProjectCaseStudy } from '../../data/projectsData';
import ProjectCaseStudyModal from '../ui/ProjectCaseStudyModal';
import { useUIStore } from '../../store/uiStore';
import { usePortfolioContent } from '../../store/PortfolioContentContext';

export default function Projects() {
  const { setCursorMode } = useUIStore();
  const { content } = usePortfolioContent();
  const projects = content.projects as unknown as ProjectCaseStudy[];
  const categories = ['All', ...new Set(projects.map((project) => project.category).filter(Boolean))];
  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedProject, setSelectedProject] = useState<ProjectCaseStudy | null>(null);

  const filteredProjects = projects.filter((project) => {
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
        <div className="flex flex-col gap-6 mb-16 text-left xl:flex-row xl:items-end xl:justify-between">
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
          <div className="flex w-full flex-wrap items-center gap-2 rounded-2xl border border-white/10 bg-slate-900/70 p-2 shadow-lg shadow-black/20 xl:w-auto xl:max-w-full xl:justify-end">
            {categories.map((cat) => {
              const isActive = activeCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  onMouseEnter={() => setCursorMode('hover')}
                  onMouseLeave={() => setCursorMode('default')}
                  className={`shrink-0 whitespace-nowrap rounded-xl px-4 py-2.5 font-body text-[11px] md:text-xs font-semibold uppercase tracking-[0.08em] transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 ${
                    isActive
                      ? 'border border-blue-400/40 bg-blue-500/20 text-blue-100 shadow-[0_0_18px_rgba(59,130,246,0.16)]'
                      : 'border border-transparent text-slate-300 hover:border-white/10 hover:bg-white/5 hover:text-white'
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
