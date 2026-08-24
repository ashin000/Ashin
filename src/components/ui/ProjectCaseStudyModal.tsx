import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion } from 'framer-motion';
import { X, ExternalLink, Cpu, AlertTriangle, Lightbulb, Compass, FileText } from 'lucide-react';
import { FaGithub } from 'react-icons/fa';
import type { ProjectCaseStudy } from '../../data/projectsData';
import { useUIStore } from '../../store/uiStore';
import Magnetic from './Magnetic';

interface ProjectCaseStudyModalProps {
  project: ProjectCaseStudy | null;
  onClose: () => void;
}

export default function ProjectCaseStudyModal({ project, onClose }: ProjectCaseStudyModalProps) {
  const { setCursorMode } = useUIStore();

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;

    if (project) {
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [project]);

  if (!project) return null;

  return createPortal(
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 z-[100] flex justify-end bg-background/80 backdrop-blur-md"
    >
      {/* Click outside to close */}
      <div className="absolute inset-0 cursor-pointer" onClick={onClose} />

      {/* Case Study Sidebar Container */}
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 220 }}
        className="relative w-full max-w-3xl h-full bg-[#0F172A] border-l border-white/10 shadow-premium-glow-lg flex flex-col z-20 overflow-hidden select-text"
      >
        
        {/* Modal Header */}
        <div className="sticky top-0 bg-[#0F172A]/90 backdrop-blur-md border-b border-white/5 px-6 py-5 flex items-center justify-between z-20">
          <div className="flex items-center gap-3">
            <span className="text-2xl">{project.bannerEmoji}</span>
            <div>
              <span className="font-code text-[9px] font-bold text-blue-400 uppercase tracking-widest bg-blue-500/10 border border-blue-500/20 px-2 py-0.5 rounded">
                {project.category}
              </span>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            {/* Close Button */}
            <Magnetic strength={0.25}>
              <button
                onClick={onClose}
                onMouseEnter={() => setCursorMode('magnetic')}
                onMouseLeave={() => setCursorMode('default')}
                className="p-2 rounded-full border border-white/5 bg-white/5 hover:bg-white/10 text-subtext hover:text-white transition-premium"
              >
                <X className="w-4.5 h-4.5" />
              </button>
            </Magnetic>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div data-lenis-prevent className="flex-1 overflow-y-auto p-6 md:p-10 flex flex-col gap-10">
          
          {/* Title and Intro */}
          <div className="text-left flex flex-col gap-3">
            <h1 className="font-heading text-2xl md:text-3.5xl font-bold text-white tracking-tight leading-tight">
              {project.title}
            </h1>
            <p className="font-body text-base text-subtext leading-relaxed">
              {project.subtitle}
            </p>

            {/* Links Block */}
            <div className="flex items-center gap-3.5 mt-2">
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                onMouseEnter={() => setCursorMode('hover')}
                onMouseLeave={() => setCursorMode('default')}
                className="flex items-center gap-1.5 px-4.5 py-2 font-body text-xs font-semibold uppercase tracking-wider text-white border border-white/10 rounded-full bg-white/5 hover:bg-white/10 transition-premium"
              >
                <FaGithub className="w-3.5 h-3.5" />
                Source Code
              </a>
              {project.demoUrl && (
                <a
                  href={project.demoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onMouseEnter={() => setCursorMode('hover')}
                  onMouseLeave={() => setCursorMode('default')}
                  className="flex items-center gap-1.5 px-4.5 py-2 font-body text-xs font-semibold uppercase tracking-wider text-white border border-blue-500/30 rounded-full bg-blue-500/10 hover:bg-blue-500 shadow-premium-glow transition-premium"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  Live Demo
                </a>
              )}
            </div>
          </div>

          <hr className="border-white/5" />

          {/* Tech Stack details */}
          <div className="text-left flex flex-col gap-4">
            <div className="flex items-center gap-2 text-white font-heading font-semibold text-sm tracking-widest uppercase">
              <Cpu className="w-4 h-4 text-blue-400" />
              Technology Stack
            </div>
            <div className="flex flex-wrap gap-2">
              {project.techStack.map((tech) => (
                <span
                  key={tech}
                  className="font-code text-[11px] font-medium text-white/90 bg-white/5 border border-white/5 px-3 py-1 rounded-md"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {/* Problem & Solution block */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
            <div className="flex flex-col gap-3">
              <h3 className="font-heading text-xs font-bold text-red-400 uppercase tracking-widest">
                The Problem
              </h3>
              <p className="font-body text-xs md:text-sm text-subtext leading-relaxed bg-red-500/[0.02] border border-red-500/10 p-5 rounded-2xl">
                {project.problem}
              </p>
            </div>
            <div className="flex flex-col gap-3">
              <h3 className="font-heading text-xs font-bold text-emerald-400 uppercase tracking-widest">
                The Solution
              </h3>
              <p className="font-body text-xs md:text-sm text-subtext leading-relaxed bg-emerald-500/[0.02] border border-emerald-500/10 p-5 rounded-2xl">
                {project.solution}
              </p>
            </div>
          </div>

          {/* Key Features list */}
          <div className="text-left flex flex-col gap-4">
            <div className="flex items-center gap-2 text-white font-heading font-semibold text-sm tracking-widest uppercase">
              <Compass className="w-4 h-4 text-blue-400" />
              Key Features
            </div>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {project.features.map((feature, i) => (
                <li
                  key={i}
                  className="flex items-start gap-2.5 p-4 rounded-xl bg-white/5 border border-white/3 font-body text-xs md:text-sm text-subtext leading-relaxed"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5 flex-shrink-0" />
                  {feature}
                </li>
              ))}
            </ul>
          </div>

          {/* System Architecture */}
          <div className="text-left flex flex-col gap-3">
            <div className="flex items-center gap-2 text-white font-heading font-semibold text-sm tracking-widest uppercase">
              <FileText className="w-4 h-4 text-blue-400" />
              Architecture
            </div>
            <p className="font-body text-xs md:text-sm text-subtext leading-relaxed p-5 rounded-2xl bg-white/5 border border-white/3">
              {project.architecture}
            </p>
          </div>

          {/* Challenges & Lessons block */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left mb-6">
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2 font-heading text-xs font-bold text-yellow-400 uppercase tracking-widest">
                <AlertTriangle className="w-4 h-4" />
                Technical Challenges
              </div>
              <p className="font-body text-xs md:text-sm text-subtext leading-relaxed p-5 rounded-2xl bg-yellow-500/[0.02] border border-yellow-500/10">
                {project.challenges}
              </p>
            </div>
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2 font-heading text-xs font-bold text-blue-400 uppercase tracking-widest">
                <Lightbulb className="w-4 h-4" />
                Lessons Learned
              </div>
              <p className="font-body text-xs md:text-sm text-subtext leading-relaxed p-5 rounded-2xl bg-blue-500/[0.02] border border-blue-500/10">
                {project.lessons}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            onMouseEnter={() => setCursorMode('hover')}
            onMouseLeave={() => setCursorMode('default')}
            className="self-start flex items-center gap-2 px-5 py-2.5 font-body text-xs font-semibold uppercase tracking-wider text-subtext hover:text-white border border-white/10 rounded-full bg-white/5 hover:bg-white/10 transition-premium"
          >
            <X className="w-4 h-4" />
            Cancel
          </button>

        </div>

      </motion.div>
    </motion.div>,
    document.body,
  );
}
