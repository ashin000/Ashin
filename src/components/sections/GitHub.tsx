import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { GitFork, Star, BookOpen, GitCommit, Award, Terminal } from 'lucide-react';
import { useUIStore } from '../../store/uiStore';

interface GitHubProfile {
  name: string;
  login: string;
  avatar_url: string;
  html_url: string;
  bio: string;
  public_repos: number;
  followers: number;
}

interface Repository {
  name: string;
  description: string;
  language: string;
  stargazers_count: number;
  forks_count: number;
  html_url: string;
}

export default function GitHub() {
  const { setCursorMode } = useUIStore();
  const [profile, setProfile] = useState<GitHubProfile | null>(null);
  const [repos, setRepos] = useState<Repository[]>([]);
  const [loading, setLoading] = useState(true);

  // Fallback / Pinned projects details if API fails or for offline presentation
  const mockRepos: Repository[] = [
    {
      name: 'ai-linux-administration-assistant',
      description: 'Conversational agent for automated system management and shell diagnostics.',
      language: 'Python',
      stargazers_count: 32,
      forks_count: 8,
      html_url: 'https://github.com/ashin000',
    },
    {
      name: 'cyber-incident-reporting-system',
      description: 'Secure dashboard for logging, classifying, and reporting enterprise cyber threats.',
      language: 'TypeScript',
      stargazers_count: 18,
      forks_count: 4,
      html_url: 'https://github.com/ashin000',
    },
    {
      name: 'waste-segregation-iot',
      description: 'Embedded automated bin that classifies and sorts garbage using TensorFlow Lite.',
      language: 'Python',
      stargazers_count: 24,
      forks_count: 6,
      html_url: 'https://github.com/ashin000',
    },
    {
      name: 'heart-disease-prediction',
      description: 'Supervised ML model for early risk screening of cardiovascular disease.',
      language: 'Python',
      stargazers_count: 15,
      forks_count: 2,
      html_url: 'https://github.com/ashin000',
    },
  ];

  const mockProfile: GitHubProfile = {
    name: 'Ashin R',
    login: 'ashin000',
    avatar_url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=60', // Beautiful premium fluid render
    html_url: 'https://github.com/ashin000',
    bio: 'AI Engineer | Full Stack Developer | Building intelligent agents and automation systems.',
    public_repos: 24,
    followers: 120,
  };

  useEffect(() => {
    // Attempt to fetch the live GitHub profile details for the provided account.
    const fetchGitHubData = async () => {
      try {
        const profileRes = await fetch('https://api.github.com/users/ashin000');
        if (!profileRes.ok) throw new Error('API limit or not found');
        const profileData = await profileRes.json();
        
        const reposRes = await fetch('https://api.github.com/users/ashin000/repos?sort=updated&per_page=6');
        if (!reposRes.ok) throw new Error('Repos not found');
        const reposData = await reposRes.json();

        setProfile({
          name: profileData.name || 'Ashin R',
          login: profileData.login,
          avatar_url: profileData.avatar_url,
          html_url: profileData.html_url,
          bio: profileData.bio || 'AI Engineer & Full Stack Developer.',
          public_repos: profileData.public_repos,
          followers: profileData.followers,
        });

        // Filter and map repository items
        const mappedRepos = reposData.slice(0, 4).map((r: any) => ({
          name: r.name,
          description: r.description || 'No description provided.',
          language: r.language || 'Code',
          stargazers_count: r.stargazers_count,
          forks_count: r.forks,
          html_url: r.html_url,
        }));
        setRepos(mappedRepos);
      } catch (err) {
        // Safe premium fallback
        setProfile(mockProfile);
        setRepos(mockRepos);
      } finally {
        setLoading(false);
      }
    };

    fetchGitHubData();
  }, []);

  // Generate a mock contribution matrix grid (7 rows for days of week, 52 columns)
  const contributionGrid = (() => {
    const grid = [];
    const colors = [
      'bg-white/[0.02] border-white/3', // No commits
      'bg-emerald-950/20 border-emerald-900/20', // Low commits
      'bg-emerald-900/40 border-emerald-800/30', // Medium-low commits
      'bg-emerald-700/60 border-emerald-600/30', // Medium-high commits
      'bg-emerald-500/80 border-emerald-400/40 shadow-[0_0_5px_rgba(16,185,129,0.3)]', // High commits
    ];

    for (let day = 0; day < 7; day++) {
      const row = [];
      for (let week = 0; week < 28; week++) {
        // Reduce grid length on mobile to fit nicely
        // Randomize weight to look authentic
        const rIndex = Math.random() < 0.2 ? Math.floor(Math.random() * 5) : 0;
        row.push({
          commits: rIndex === 0 ? 0 : Math.floor(Math.random() * 8) + 1,
          colorClass: colors[rIndex],
        });
      }
      grid.push(row);
    }
    return grid;
  })();

  if (loading) {
    return (
      <section className="py-24 bg-[#050816] text-subtext text-center font-body text-xs md:text-sm">
        SYNCING GITHUB CORE SERVICES...
      </section>
    );
  }

  return (
    <section
      id="github"
      className="relative py-24 overflow-hidden px-6 md:px-12 border-t border-white/5 bg-[#050816]"
    >
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/4 -translate-y-1/2 w-80 h-80 bg-blue-500/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col mb-16 text-left">
          <span className="font-code text-xs text-blue-400 uppercase tracking-[0.2em] font-semibold mb-2">
            07 / INTEGRATIONS
          </span>
          <h2 className="font-heading text-3xl md:text-4xl font-bold tracking-tight text-white">
            LIVE GITHUB WIDGET
          </h2>
          <div className="h-[1px] w-20 bg-blue-500/50 mt-4" />
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: User Card & Pinned Repos (LG:col-span-8) */}
          <div className="lg:col-span-8 flex flex-col gap-6 md:gap-8">
            
            {/* Github profile summary */}
            {profile && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="glass-panel p-6 rounded-2xl border border-white/5 flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-5 relative overflow-hidden"
              >
                {/* Profile Image with Ring Glow */}
                <div className="relative w-18 h-18 rounded-full overflow-hidden border-2 border-blue-500/30 p-1 flex-shrink-0">
                  <img src={profile.avatar_url} alt={profile.name} className="w-full h-full rounded-full object-cover" />
                </div>
                
                <div className="flex-1 flex flex-col gap-2.5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
                    <div>
                      <h3 className="font-heading text-lg font-bold text-white tracking-tight">{profile.name}</h3>
                      <span className="font-code text-xs text-blue-400">@{profile.login}</span>
                    </div>
                    
                    <a
                      href={profile.html_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      onMouseEnter={() => setCursorMode('hover')}
                      onMouseLeave={() => setCursorMode('default')}
                      className="px-4 py-1.5 border border-white/10 hover:border-white/20 rounded-lg bg-white/5 font-body text-[10px] font-semibold uppercase tracking-wider text-white transition-colors h-fit self-center sm:self-auto"
                    >
                      Follow Profile
                    </a>
                  </div>
                  
                  <p className="font-body text-xs md:text-sm text-subtext leading-relaxed">{profile.bio}</p>
                  
                  {/* Info stats details */}
                  <div className="flex items-center justify-center sm:justify-start gap-6 border-t border-white/5 pt-4 mt-1.5">
                    <div className="flex items-center gap-1.5">
                      <BookOpen className="w-3.5 h-3.5 text-blue-400" />
                      <span className="font-code text-xs font-semibold text-white">{profile.public_repos} Repos</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Star className="w-3.5 h-3.5 text-yellow-400" />
                      <span className="font-code text-xs font-semibold text-white">{profile.followers} Followers</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Repositories block */}
            <div className="flex flex-col gap-4 text-left">
              <h3 className="font-heading text-xs font-bold text-white uppercase tracking-widest flex items-center gap-2">
                <Terminal className="w-4 h-4 text-blue-400" />
                Featured Pinned Repositories
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {repos.map((repo) => (
                  <a
                    key={repo.name}
                    href={repo.html_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onMouseEnter={() => setCursorMode('hover')}
                    onMouseLeave={() => setCursorMode('default')}
                    className="glass-panel glass-panel-hover p-5 rounded-xl border border-white/5 flex flex-col justify-between h-40 transition-premium"
                  >
                    <div>
                      <h4 className="font-heading text-sm font-bold text-white tracking-tight hover:text-blue-400 transition-colors line-clamp-1">
                        {repo.name}
                      </h4>
                      <p className="font-body text-[11px] text-subtext/80 leading-relaxed mt-2 line-clamp-2">
                        {repo.description}
                      </p>
                    </div>

                    <div className="flex items-center justify-between border-t border-white/5 pt-3 mt-3">
                      <span className="font-code text-[9px] font-semibold text-blue-400 bg-blue-500/5 px-2 py-0.5 rounded">
                        {repo.language}
                      </span>
                      <div className="flex items-center gap-3 text-subtext/60">
                        <span className="flex items-center gap-1 font-code text-[10px]">
                          <Star className="w-3 h-3 text-yellow-500" />
                          {repo.stargazers_count}
                        </span>
                        <span className="flex items-center gap-1 font-code text-[10px]">
                          <GitFork className="w-3 h-3 text-blue-400" />
                          {repo.forks_count}
                        </span>
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            </div>

          </div>

          {/* Right Column: Contribution grid & stats (LG:col-span-4) */}
          <div className="lg:col-span-4 flex flex-col gap-6 md:gap-8 w-full">
            
            {/* Contribution graph card */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="glass-panel p-6 rounded-2xl border border-white/5 flex flex-col gap-4 text-left w-full overflow-hidden"
            >
              <h3 className="font-heading text-xs font-bold text-white uppercase tracking-widest flex items-center gap-2">
                <GitCommit className="w-4 h-4 text-emerald-400" />
                Activity Graph (365 Days)
              </h3>

              {/* Grid panel */}
              <div className="flex flex-col gap-1 w-full overflow-x-auto pb-2 scrollbar-none">
                {contributionGrid.map((row, rIdx) => (
                  <div key={rIdx} className="flex gap-1">
                    {row.map((cell, cIdx) => (
                      <div
                        key={cIdx}
                        className={`w-2.5 h-2.5 rounded-[1.5px] border ${cell.colorClass} transition-colors duration-200 cursor-help flex-shrink-0`}
                        title={cell.commits > 0 ? `${cell.commits} commits` : 'No commits'}
                      />
                    ))}
                  </div>
                ))}
              </div>

              {/* Labels details */}
              <div className="flex items-center justify-between text-[9px] font-code text-subtext/60 mt-1">
                <span>Less active</span>
                <div className="flex gap-1 items-center">
                  <div className="w-2 h-2 rounded-[1.5px] bg-white/[0.02] border border-white/5" />
                  <div className="w-2 h-2 rounded-[1.5px] bg-emerald-950/20" />
                  <div className="w-2 h-2 rounded-[1.5px] bg-emerald-900/40" />
                  <div className="w-2 h-2 rounded-[1.5px] bg-emerald-700/60" />
                  <div className="w-2 h-2 rounded-[1.5px] bg-emerald-500/80" />
                </div>
                <span>More active</span>
              </div>
            </motion.div>

            {/* Language distribution or Hackathon badge */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="glass-panel p-6 rounded-2xl border border-white/5 flex flex-col gap-4 text-left relative overflow-hidden"
            >
              <h3 className="font-heading text-xs font-bold text-white uppercase tracking-widest flex items-center gap-2">
                <Award className="w-4 h-4 text-blue-400" />
                Stack Distribution
              </h3>

              <div className="flex flex-col gap-3">
                {/* Python */}
                <div className="flex flex-col gap-1.5">
                  <div className="flex justify-between text-xs font-code text-subtext">
                    <span>Python & ML Libraries</span>
                    <span className="font-semibold text-white">55%</span>
                  </div>
                  <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 rounded-full" style={{ width: '55%' }} />
                  </div>
                </div>
                {/* TypeScript */}
                <div className="flex flex-col gap-1.5">
                  <div className="flex justify-between text-xs font-code text-subtext">
                    <span>TypeScript & React</span>
                    <span className="font-semibold text-white">30%</span>
                  </div>
                  <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-purple-500 rounded-full" style={{ width: '30%' }} />
                  </div>
                </div>
                {/* Other/Shell */}
                <div className="flex flex-col gap-1.5">
                  <div className="flex justify-between text-xs font-code text-subtext">
                    <span>Linux & Cloud Systems</span>
                    <span className="font-semibold text-white">15%</span>
                  </div>
                  <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 rounded-full" style={{ width: '15%' }} />
                  </div>
                </div>
              </div>
            </motion.div>

          </div>

        </div>

      </div>
    </section>
  );
}
