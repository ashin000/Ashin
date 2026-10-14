import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Search, X, Award, ExternalLink, Calendar } from 'lucide-react';
import { useUIStore } from '../../store/uiStore';
import Magnetic from '../ui/Magnetic';
import { usePortfolioContent } from '../../store/PortfolioContentContext';

export interface Certificate {
  id: string;
  title: string;
  issuer: string;
  date: string;
  credentialId: string;
  category: string;
  verifyUrl: string;
  imageColor: string; // Dynamic abstract color gradient representing the certificate
  imageUrl?: string;
}

export const certificatesData: Certificate[] = [
  {
    id: 'cert-tf-dev',
    title: 'TensorFlow Developer Certificate',
    issuer: 'Google TensorFlow team',
    date: 'Jan 2025',
    credentialId: 'TF-904-2025',
    category: 'Machine Learning',
    verifyUrl: 'https://verify.com',
    imageColor: 'from-blue-700/35 to-blue-900/35',
    imageUrl: '',
  },
  {
    id: 'cert-gcp-ml',
    title: 'Google Cloud Professional Machine Learning Engineer',
    issuer: 'Google Cloud',
    date: 'Mar 2025',
    credentialId: 'GCP-MLE-4820',
    category: 'Cloud',
    verifyUrl: 'https://verify.com',
    imageColor: 'from-blue-700/35 to-blue-900/35',
    imageUrl: '',
  },
  {
    id: 'cert-dl-spec',
    title: 'Deep Learning Specialization',
    issuer: 'DeepLearning.AI',
    date: 'Nov 2024',
    credentialId: 'DL-SPEC-773',
    category: 'Artificial Intelligence',
    verifyUrl: 'https://verify.com',
    imageColor: 'from-blue-700/35 to-blue-900/35',
    imageUrl: '',
  },
  {
    id: 'cert-python-adv',
    title: 'Advanced Python Software Architect',
    issuer: 'Python Institute',
    date: 'Aug 2024',
    credentialId: 'PY-ARC-0028',
    category: 'Programming',
    verifyUrl: 'https://verify.com',
    imageColor: 'from-blue-700/35 to-blue-900/35',
    imageUrl: '',
  },
  {
    id: 'cert-ui-figma',
    title: 'Modern UI/UX & Design Systems',
    issuer: 'Interaction Design Foundation',
    date: 'Dec 2024',
    credentialId: 'IDF-UIUX-492',
    category: 'UI UX',
    verifyUrl: 'https://verify.com',
    imageColor: 'from-blue-700/35 to-blue-900/35',
    imageUrl: '',
  },
  {
    id: 'cert-hack-ai',
    title: 'First Place - AI Agents Global Hackathon',
    issuer: 'Techstars & OpenAI',
    date: 'Feb 2025',
    credentialId: 'HACK-AI-OPENAI',
    category: 'Hackathons',
    verifyUrl: 'https://verify.com',
    imageColor: 'from-blue-700/35 to-blue-900/35',
    imageUrl: '',
  },
];

export default function Certificates() {
  const { setCursorMode } = useUIStore();
  const { content } = usePortfolioContent();
  const certificates = content.certificates as unknown as Certificate[];
  const categories = ['All', ...new Set(certificates.map((certificate) => certificate.category).filter(Boolean))];
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCert, setSelectedCert] = useState<Certificate | null>(null);
  const certificateGradient = 'from-blue-700/35 to-blue-900/35';

  const carouselRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!selectedCert) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [selectedCert]);

  // Filters search and category
  const filteredCerts = certificates.filter((cert) => {
    const matchesCategory = activeCategory === 'All' || cert.category === activeCategory;
    const matchesSearch =
      cert.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cert.issuer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const scroll = (direction: 'left' | 'right') => {
    if (!carouselRef.current) return;
    const { scrollLeft, clientWidth } = carouselRef.current;
    const scrollAmount = clientWidth * 0.75;
    carouselRef.current.scrollTo({
      left: direction === 'left' ? scrollLeft - scrollAmount : scrollLeft + scrollAmount,
      behavior: 'smooth',
    });
  };

  return (
    <section
      id="certificates"
      className="relative py-24 overflow-hidden px-6 md:px-12 border-t border-white/5 bg-[#050816]"
    >
      {/* Background visual detail */}
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-blue-500/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">

        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 text-left">
          <div>
            <span className="font-code text-xs text-blue-400 uppercase tracking-[0.2em] font-semibold mb-2">
              05 / CREDENTIALS
            </span>
            <h2 className="font-heading text-3xl md:text-4xl font-bold tracking-tight text-white">
              CERTIFICATIONS & HACKATHONS
            </h2>
            <div className="h-[1px] w-20 bg-blue-500/50 mt-4" />
          </div>

          {/* Search bar & Category indicator */}
          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            {/* Search Input */}
            <div className="relative flex-1 md:flex-initial">
              <Search className="w-4 h-4 text-subtext/90 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search credentials..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full md:w-56 pl-10 pr-4 py-2 font-body text-xs text-white placeholder-subtext/75 bg-white/5 border border-white/5 rounded-xl focus:outline-none focus:border-blue-500/50 transition-colors"
              />
            </div>
          </div>
        </div>

        {/* Categories Bar */}
        <div className="flex flex-wrap items-center gap-2 mb-10 text-left">
          {categories.map((cat) => {
            const isActive = activeCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                onMouseEnter={() => setCursorMode('hover')}
                onMouseLeave={() => setCursorMode('default')}
                className={`px-4 py-1.5 font-body text-[10px] md:text-xs font-semibold uppercase tracking-wider rounded-xl transition-all duration-300 ${isActive ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' : 'text-subtext hover:text-white border border-transparent'
                  }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Carousel Slider Panel */}
        <div className="relative">
          {/* Slider Container */}
          <div
            ref={carouselRef}
            className="flex gap-6 overflow-x-auto scrollbar-none pb-6 snap-x snap-mandatory"
            style={{ scrollbarWidth: 'none' }}
          >
            {filteredCerts.length > 0 ? (
              filteredCerts.map((cert) => {
                return (
                  <motion.div
                    key={cert.id}
                    onClick={() => {
                      setSelectedCert(cert);
                      setCursorMode('default');
                    }}
                    onMouseEnter={() => setCursorMode('hover')}
                    onMouseLeave={() => setCursorMode('default')}
                    className={`flex-shrink-0 w-80 sm:w-96 snap-start glass-panel p-6 rounded-2xl border border-white/5 relative overflow-hidden transition-all duration-300 cursor-pointer flex flex-col justify-between ${cert.imageUrl ? 'h-[22rem]' : 'h-72'} text-left select-none`}
                  >
                    {/* Background abstract gradient mockup */}
                    {!cert.imageUrl && <div className={`absolute top-0 left-0 right-0 h-2 bg-gradient-to-r ${certificateGradient}`} />}

                    {cert.imageUrl ? (
                      <div className="relative z-[1] h-28 w-full overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
                        <img src={cert.imageUrl} alt={`${cert.title} certificate`} loading="lazy" className="h-full w-full object-contain" />
                      </div>
                    ) : null}

                    <div className="relative z-[1] flex flex-col gap-4 mt-2">
                      <div className="flex justify-between items-start">
                        <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-blue-400 shadow-premium-glow">
                          <Award className="w-5 h-5" />
                        </div>
                        <span className="font-code text-[8px] font-bold text-subtext/90 uppercase tracking-widest bg-white/5 border border-white/5 px-2 py-0.5 rounded">
                          {cert.category}
                        </span>
                      </div>

                      <div>
                        <h3 className="font-heading text-base sm:text-lg font-bold text-white tracking-tight line-clamp-2">
                          {cert.title}
                        </h3>
                        <p className="font-body text-xs text-subtext/80 font-medium mt-1">
                          {cert.issuer}
                        </p>
                      </div>
                    </div>

                    <div className="relative z-[1] flex items-center justify-between border-t border-white/5 pt-4 mt-4">
                      <div className="flex items-center gap-1.5 font-body text-[10px] text-subtext/90">
                        <Calendar className="w-3.5 h-3.5" />
                        {cert.date}
                      </div>
                      <div className="flex items-center gap-1 font-code text-[9px] font-bold text-blue-400 uppercase tracking-widest group-hover:text-blue-300">
                        View Certificate
                        <ChevronRight className="w-3 h-3" />
                      </div>
                    </div>
                  </motion.div>
                );
              })
            ) : (
              <div className="w-full text-center py-12 text-subtext font-body text-sm">
                No certifications found matching search filters.
              </div>
            )}
          </div>

          {/* Carousel Arrows */}
          {filteredCerts.length > 2 && (
            <div className="flex items-center justify-end gap-3 mt-6">
              <Magnetic strength={0.3}>
                <button
                  onClick={() => scroll('left')}
                  className="p-3 rounded-full border border-white/5 bg-white/5 hover:bg-white/5 text-subtext hover:text-white transition-premium"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
              </Magnetic>
              <Magnetic strength={0.3}>
                <button
                  onClick={() => scroll('right')}
                  className="p-3 rounded-full border border-white/5 bg-white/5 hover:bg-white/5 text-subtext hover:text-white transition-premium"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </Magnetic>
            </div>
          )}
        </div>

        {/* Cert Modal Viewer */}
        {createPortal(
          <AnimatePresence>
            {selectedCert && (
              <motion.div
                key={selectedCert.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto overscroll-contain p-4 sm:p-6 bg-background/80 backdrop-blur-md"
            >
              {/* Click outside to close */}
              <div className="absolute inset-0 cursor-pointer" onClick={() => setSelectedCert(null)} />

              {/* Modal Card */}
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                role="dialog"
                aria-modal="true"
                aria-label={`${selectedCert.title} certificate details`}
                className="relative my-auto max-h-[calc(100dvh-2rem)] w-full max-w-xl overflow-y-auto overscroll-contain bg-[#0F172A] border border-white/10 p-6 md:p-8 rounded-2xl shadow-premium-glow-lg flex flex-col gap-6 z-10 text-left"
              >
                {/* Close Button */}
                <button
                  onClick={() => setSelectedCert(null)}
                  className="absolute top-4 right-4 p-1.5 rounded-full border border-white/5 bg-white/5 hover:bg-white/10 text-subtext hover:text-white transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>

                {/* Abstract Certificate Visual Header */}
                <div className={`h-40 rounded-xl bg-gradient-to-tr ${certificateGradient} border border-white/5 flex flex-col items-center justify-center relative overflow-hidden`}>
                  {selectedCert.imageUrl ? (
                    <img src={selectedCert.imageUrl} alt={`${selectedCert.title} certificate`} className="absolute inset-0 h-full w-full object-contain bg-slate-50" />
                  ) : (
                    <>
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(73,104,142,0.18),transparent_70%)]" />
                      <Award className="w-12 h-12 text-blue-400 drop-shadow-[0_0_10px_rgba(148,175,208,0.4)] mb-2" />
                      <span className="font-heading text-xs font-semibold text-white/80 uppercase tracking-[0.2em]">{selectedCert.issuer}</span>
                    </>
                  )}
                </div>

                {/* Certificate details */}
                <div className="flex flex-col gap-4">
                  <div>
                    <span className="font-code text-[8px] font-bold text-blue-400 uppercase tracking-widest bg-blue-500/10 border border-blue-500/20 px-2.5 py-0.5 rounded">
                      {selectedCert.category}
                    </span>
                    <h3 className="font-heading text-xl font-bold text-white tracking-tight mt-2.5">
                      {selectedCert.title}
                    </h3>
                    <p className="font-body text-sm text-subtext mt-1">
                      Issued by {selectedCert.issuer}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4 border-t border-white/5 pt-4">
                    <div>
                      <span className="font-body text-[10px] text-subtext/90 uppercase tracking-wider">Issue Date</span>
                      <p className="font-body text-xs font-medium text-white/90 mt-0.5">{selectedCert.date}</p>
                    </div>
                    <div>
                      <span className="font-body text-[10px] text-subtext/90 uppercase tracking-wider">Credential ID</span>
                      <p className="font-code text-xs font-medium text-blue-400 mt-0.5">{selectedCert.credentialId}</p>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="mt-2 flex flex-col-reverse gap-3 border-t border-white/5 pt-4 sm:flex-row sm:items-center sm:justify-between">
                  <a
                    href={selectedCert.verifyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onMouseEnter={() => setCursorMode('hover')}
                    onMouseLeave={() => setCursorMode('default')}
                    className="inline-flex w-fit max-w-full shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-lg border border-blue-500/30 bg-blue-500/10 px-4 py-3 font-body text-xs font-semibold uppercase tracking-wider text-white shadow-premium-glow transition-premium hover:bg-blue-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-300"
                  >
                    Verify Credential
                    <ExternalLink aria-hidden="true" className="h-4 w-4 shrink-0" />
                  </a>
                  <button
                    onClick={() => setSelectedCert(null)}
                    className="self-start py-2 font-body text-xs font-semibold uppercase tracking-wider text-subtext transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-300 sm:self-auto"
                  >
                    Close Viewer
                  </button>
                </div>

              </motion.div>
              </motion.div>
            )}
          </AnimatePresence>,
          document.body,
        )}

      </div>
    </section>
  );
}
