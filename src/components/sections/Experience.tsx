import { motion } from 'framer-motion';
import { Briefcase } from 'lucide-react';
import { useUIStore } from '../../store/uiStore';

const timelineEvents = [
  {
    year: '2024',
    title: 'Started Programming',
    company: 'Self-Directed / Academic Genesis',
    description: 'Began exploring core software engineering principles, algorithms, and data structures. Developed foundation in python scripting, automation, and problem-solving.',
    tags: ['Python', 'Data Structures', 'C Programming', 'SQL'],
    type: 'education',
  },
  {
    year: '2025',
    title: 'Machine Learning Intern',
    company: 'Azentra Global',
    description: 'Worked on pipelines for industrial predictive modelling. Designed preprocessing modules, engineered robust tabular features, trained deep networks and scikit-learn models.',
    tags: ['Machine Learning', 'Data Preprocessing', 'Feature Engineering', 'Model Building', 'Python'],
    type: 'internship',
  },
  {
    year: '2025',
    title: 'Linux & AWS Intern',
    company: 'NDimentionz Pvt Ltd',
    description: 'Maintained cloud infrastructure configurations. Automated server script deployments, managed virtual private networks, load balancers, and AWS instance provisioning.',
    tags: ['Linux Shell', 'AWS Cloud', 'Networking', 'Server Deployment', 'IAM Policies'],
    type: 'internship',
  },
  {
    year: '2025 - Present',
    title: 'Product Developer',
    company: 'Nex-X Sparks',
    description: 'Leading client-facing product development from architecture to implementation. Architecting robust database layers, designing responsive frontends, and deploying to cloud containers.',
    tags: ['Product Architecture', 'Full Stack Development', 'Software Architecture', 'Client Deliverables'],
    type: 'professional',
  },
  {
    year: 'Future',
    title: 'AI Engineer',
    company: 'Global Technology Company',
    description: 'Pioneering production-ready neural networks, Large Language Model architectures, and agentic workflows that operate at global scale.',
    tags: ['Deep Learning', 'Agentic Workflows', 'Scale Architectures', 'Next-Gen AI Systems'],
    type: 'aspiration',
  },
];

export default function Experience() {
  const { setCursorMode } = useUIStore();

  return (
    <section
      id="experience"
      className="relative py-24 overflow-hidden px-6 md:px-12 border-t border-white/5 bg-[#050816]"
    >
      {/* Background ambient lighting */}
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-500/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-5xl mx-auto relative z-10">
        
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-col mb-16 text-left"
        >
          <span className="font-code text-xs text-blue-400 uppercase tracking-[0.2em] font-semibold mb-2">
            02 / JOURNEY
          </span>
          <h2 className="font-heading text-3xl md:text-4xl font-bold tracking-tight text-white">
            EXPERIENCE & TIMELINE
          </h2>
          <div className="h-[1px] w-20 bg-blue-500/50 mt-4" />
        </motion.div>

        {/* Vertical Timeline Track */}
        <div className="relative border-l-2 border-white/5 ml-4 md:ml-32 pl-6 md:pl-12 flex flex-col gap-12">
          
          {timelineEvents.map((event, index) => {
            return (
              <div key={event.title + index} className="relative group text-left">
                
                {/* Year Label (Positioned absolute left on large screens) */}
                <div className="hidden md:block absolute right-[100%] mr-20 top-1 text-right w-32">
                  <span className="font-code text-sm font-bold tracking-wider text-blue-400 drop-shadow-[0_0_8px_rgba(96,165,250,0.35)]">
                    {event.year}
                  </span>
                </div>

                {/* Timeline Node Point */}
                <div className="absolute left-[-31px] md:left-[-55px] top-1.5 w-4 h-4 rounded-full border border-blue-500/50 bg-[#050816] flex items-center justify-center transition-all duration-300 group-hover:border-blue-400 group-hover:scale-125 shadow-[0_0_8px_rgba(59,130,246,0.2)]">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
                </div>

                {/* Mobile Year Badge */}
                <div className="md:hidden mb-2">
                  <span className="font-code text-xs font-bold tracking-wider text-blue-400 bg-blue-500/10 px-2.5 py-1 rounded border border-blue-500/20">
                    {event.year}
                  </span>
                </div>

                {/* Glass Card Content */}
                <motion.div
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: '-80px' }}
                  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  onMouseEnter={() => setCursorMode('hover')}
                  onMouseLeave={() => setCursorMode('default')}
                  className={`glass-panel glass-panel-hover p-6 md:p-8 rounded-2xl border border-white/5 relative overflow-hidden transition-all duration-300 ${
                    event.type === 'aspiration'
                      ? 'border-blue-500/20 bg-blue-500/[0.02]'
                      : 'bg-white/5'
                  }`}
                >
                  {/* Subtle vertical card background bar */}
                  <div className={`absolute top-0 bottom-0 left-0 w-1 ${
                    event.type === 'aspiration' ? 'bg-gradient-to-b from-blue-500 to-purple-500' : 'bg-blue-500/30'
                  }`} />

                  {/* Header details */}
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                    <div>
                      <h3 className="font-heading text-lg md:text-xl font-bold text-white tracking-tight">
                        {event.title}
                      </h3>
                      <div className="font-body text-xs md:text-sm text-subtext/80 font-medium flex items-center gap-1.5 mt-0.5">
                        <Briefcase className="w-3.5 h-3.5 text-blue-400" />
                        {event.company}
                      </div>
                    </div>

                    <span className={`font-code text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded ${
                      event.type === 'internship'
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        : event.type === 'professional'
                        ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20'
                        : event.type === 'aspiration'
                        ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                        : 'bg-white/5 text-subtext/80 border border-white/10'
                    }`}>
                      {event.type}
                    </span>
                  </div>

                  {/* Description */}
                  <p className="font-body text-xs md:text-sm text-subtext leading-relaxed mb-5">
                    {event.description}
                  </p>

                  {/* Badges/Tags */}
                  <div className="flex flex-wrap gap-1.5">
                    {event.tags.map((tag) => (
                      <span
                        key={tag}
                        className="font-code text-[10px] text-white/70 bg-white/5 border border-white/5 px-2.5 py-1 rounded-md transition-colors hover:bg-white/10 hover:text-white"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                </motion.div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
