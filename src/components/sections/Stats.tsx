import CountUp from 'react-countup';
import { motion } from 'framer-motion';
import { FolderCode, Award, Clock, Briefcase, Cpu } from 'lucide-react';
import { useUIStore } from '../../store/uiStore';
import { usePortfolioContent } from '../../store/PortfolioContentContext';

const CountUpComponent = (CountUp as any).default || CountUp;

export const statsData = [
  {
    value: 15,
    suffix: '+',
    label: 'Projects Completed',
    icon: FolderCode,
    glowColor: 'rgba(59, 130, 246, 0.15)',
  },
  {
    value: 3,
    suffix: '+',
    label: 'Internships Done',
    icon: Briefcase,
    glowColor: 'rgba(34, 197, 94, 0.12)',
  },
  {
    value: 20,
    suffix: '+',
    label: 'Technologies Mastered',
    icon: Cpu,
    glowColor: 'rgba(168, 85, 247, 0.12)',
  },
  {
    value: 8,
    suffix: '+',
    label: 'Certifications',
    icon: Award,
    glowColor: 'rgba(234, 179, 8, 0.12)',
  },
  {
    value: 1000,
    suffix: '+',
    label: 'Hours Coding',
    icon: Clock,
    glowColor: 'rgba(239, 68, 68, 0.12)',
  },
];

const statIcons = new Map(statsData.map((stat) => [stat.label, stat.icon] as const));

export default function Stats() {
  const { setCursorMode } = useUIStore();
  const { content } = usePortfolioContent();
  const editableStats = content.stats.map((stat) => ({
    ...stat,
    icon: statIcons.get(String(stat.iconKey ?? '')) ?? FolderCode,
  })) as unknown as typeof statsData;

  return (
    <section className="py-16 relative overflow-hidden px-6 md:px-12 bg-[#050816] border-t border-white/5">
      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Responsive Grid */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-6 md:gap-8">
          {editableStats.map((stat, i) => {
            const IconComponent = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                onMouseEnter={() => setCursorMode('hover')}
                onMouseLeave={() => setCursorMode('default')}
                style={{ '--glow-color': stat.glowColor } as React.CSSProperties}
                className="glass-panel glass-panel-hover p-6 rounded-2xl flex flex-col items-center justify-center text-center gap-3 border border-white/5 transition-all duration-300 group"
              >
                {/* Icon wrapper with glow effect */}
                <div 
                  className="p-3 rounded-xl bg-white/5 border border-white/10 text-subtext group-hover:text-blue-400 group-hover:border-blue-500/30 transition-premium shadow-premium-glow"
                >
                  <IconComponent className="w-5 h-5" />
                </div>

                {/* Counter */}
                <div className="flex flex-col items-center">
                  <span className="font-heading text-3xl md:text-4xl font-bold text-white tracking-tight flex items-baseline">
                    <CountUpComponent
                      end={stat.value}
                      duration={2.5}
                      enableScrollSpy={true}
                      scrollSpyOnce={true}
                    />
                    <span className="text-blue-400 drop-shadow-[0_0_8px_rgba(96,165,250,0.4)] ml-0.5">
                      {stat.suffix}
                    </span>
                  </span>
                  
                  {/* Label */}
                  <span className="font-body text-[10px] md:text-xs text-subtext/70 uppercase tracking-widest font-semibold mt-1">
                    {stat.label}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
