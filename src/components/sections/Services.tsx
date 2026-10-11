import { motion } from 'framer-motion';
import { useUIStore } from '../../store/uiStore';
import { usePortfolioContent } from '../../store/PortfolioContentContext';
import {
  Brain,
  Cpu,
  Globe,
  Database,
  Radio,
  Zap,
  Cloud,
  Terminal,
  Layers,
  HelpCircle,
} from 'lucide-react';

export const servicesData = [
  {
    title: 'AI Development',
    description: 'Engineering agentic workflows, conversational agents, custom LLM fine-tuning, and retrieval-augmented generation (RAG) platforms.',
    icon: Brain,
    color: '#3B82F6',
  },
  {
    title: 'Machine Learning',
    description: 'Building predictive pipelines, computer vision models, anomaly detection scripts, and robust data regressions.',
    icon: Cpu,
    color: '#8B5CF6',
  },
  {
    title: 'Web Development',
    description: 'Designing premium frontends with smooth animations, high-fidelity responsive grids, and clean design tokens.',
    icon: Globe,
    color: '#10B981',
  },
  {
    title: 'Full Stack Development',
    description: 'Architecting end-to-end applications from secure database ledgers to responsive user dashboards.',
    icon: Database,
    color: '#F59E0B',
  },
  {
    title: 'IoT Solutions',
    description: 'Integrating microcontrollers (Raspberry Pi, Arduino) with sensor suites, automation circuits, and remote telemetry.',
    icon: Radio,
    color: '#EF4444',
  },
  {
    title: 'Automation Eng.',
    description: 'Writing high-speed scripts to automate files parsing, reporting workflows, system cron-jobs, and data scraping.',
    icon: Zap,
    color: '#EC4899',
  },
  {
    title: 'Cloud Deployment',
    description: 'Deploying dockerized containers to secure AWS/GCP servers with robust load balancers and domain routing.',
    icon: Cloud,
    color: '#06B6D4',
  },
  {
    title: 'Custom Software',
    description: 'Developing tailored desktop applications, command-line utilities, and custom workflow programs.',
    icon: Terminal,
    color: '#10B981',
  },
  {
    title: 'API Development',
    description: 'Designing secure, well-documented RESTful & GraphQL endpoints using FastAPI, Express, and Flask.',
    icon: Layers,
    color: '#6366F1',
  },
  {
    title: 'Technical Consultation',
    description: 'Providing advice on technology stacks, software design patterns, ML deployment steps, and product architecture.',
    icon: HelpCircle,
    color: '#6B7280',
  },
];

const serviceIcons = new Map(servicesData.map((service) => [service.title, service.icon] as const));

export default function Services() {
  const { setCursorMode } = useUIStore();
  const { content } = usePortfolioContent();
  const editableServices = content.services.map((service) => ({
    ...service,
    icon: serviceIcons.get(String(service.iconKey ?? '')) ?? HelpCircle,
  })) as unknown as typeof servicesData;

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.08,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 25 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: 'easeOut' as const },
    },
  };

  return (
    <section
      id="services"
      className="relative py-24 overflow-hidden px-6 md:px-12 border-t border-white/5 bg-[#050816]"
    >
      {/* Background visual detail */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-80 h-80 bg-blue-500/5 rounded-full blur-[120px] pointer-events-none" />

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
            06 / SOLUTIONS
          </span>
          <h2 className="font-heading text-3xl md:text-4xl font-bold tracking-tight text-white">
            SERVICES & EXPERTISE
          </h2>
          <div className="h-[1px] w-20 bg-blue-500/50 mt-4" />
        </motion.div>

        {/* Services Grid */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          variants={containerVariants}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
        >
          {editableServices.map((service) => {
            const Icon = service.icon;
            return (
              <motion.div
                key={service.title}
                variants={cardVariants}
                onMouseEnter={() => setCursorMode('hover')}
                onMouseLeave={() => setCursorMode('default')}
                className="glass-panel glass-panel-hover p-6 rounded-2xl border border-white/5 relative overflow-hidden transition-all duration-300 text-left group"
              >
                {/* Accent Corner Glow */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  style={{
                    background: `radial-gradient(circle at 10% 10%, ${service.color}0a, transparent 40%)`,
                  }}
                />

                {/* Service Icon with Glow */}
                <div
                  className="p-3 rounded-xl border w-fit mb-5 transition-colors duration-300"
                  style={{
                    backgroundColor: `${service.color}10`,
                    borderColor: `${service.color}30`,
                    color: service.color,
                  }}
                >
                  <Icon className="w-5 h-5" />
                </div>

                {/* Title & Description */}
                <h3 className="font-heading text-base sm:text-lg font-bold text-white tracking-tight mb-2.5">
                  {service.title}
                </h3>
                <p className="font-body text-xs md:text-sm text-subtext leading-relaxed">
                  {service.description}
                </p>

              </motion.div>
            );
          })}
        </motion.div>

      </div>
    </section>
  );
}
