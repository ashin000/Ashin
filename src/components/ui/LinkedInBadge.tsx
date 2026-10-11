import { ArrowUpRight, BadgeCheck, Briefcase, MapPin } from 'lucide-react';
import { FaLinkedin } from 'react-icons/fa';

interface LinkedInBadgeProps {
  vanity?: string;
  name?: string;
  headline?: string;
  location?: string;
  className?: string;
}

export default function LinkedInBadge({
  vanity = 'ashin-r-05a4b9325',
  name = 'Ashin R',
  headline = 'AI & Machine Learning Engineer',
  location = 'Kerala, India',
  className = '',
}: LinkedInBadgeProps) {
  const profileUrl = `https://www.linkedin.com/in/${vanity}`;

  return (
    <div className={`w-full ${className}`}>
      <div className="w-full rounded-2xl border border-[#0A66C2]/20 bg-gradient-to-br from-[#0A66C2]/10 via-[#0b1220] to-[#050816] p-5 text-left">
        <div className="flex items-start justify-between gap-4">
          <div className="flex min-w-0 items-center gap-3.5">
            <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-[#0A66C2] text-white shadow-[0_8px_24px_rgba(10,102,194,0.24)]">
              <FaLinkedin className="h-6 w-6" aria-hidden="true" />
            </div>
            <div className="min-w-0">
              <p className="truncate font-heading text-base font-bold text-white">{name}</p>
              <p className="mt-1 flex items-center gap-1.5 font-body text-xs text-slate-400">
                <MapPin className="h-3.5 w-3.5 shrink-0 text-blue-300" /> {location}
              </p>
            </div>
          </div>
          <BadgeCheck className="h-5 w-5 shrink-0 text-blue-300" aria-label="Profile" />
        </div>

        <div className="mt-5 flex items-start gap-2.5 border-t border-white/10 pt-4">
          <Briefcase className="mt-0.5 h-4 w-4 shrink-0 text-blue-300" />
          <p className="font-body text-sm leading-6 text-slate-300">{headline}</p>
        </div>

        <a
          href={profileUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-5 inline-flex min-h-10 items-center gap-2 rounded-lg border border-[#0A66C2]/40 bg-[#0A66C2]/15 px-4 py-2.5 font-body text-xs font-bold uppercase tracking-wider text-blue-100 transition hover:border-[#0A66C2] hover:bg-[#0A66C2]/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-300"
        >
          View LinkedIn profile <ArrowUpRight className="h-4 w-4" />
        </a>
      </div>
    </div>
  );
}
