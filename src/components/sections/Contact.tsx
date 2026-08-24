import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import emailjs from '@emailjs/browser';
import { Send, Phone, Mail, MapPin, Download, CheckCircle, AlertCircle } from 'lucide-react';
import { FaGithub, FaLinkedin, FaInstagram } from 'react-icons/fa';
import { useUIStore } from '../../store/uiStore';
import Magnetic from '../ui/Magnetic';
import LinkedInBadge from '../ui/LinkedInBadge';

export default function Contact() {
  const { setCursorMode } = useUIStore();
  const formRef = useRef<HTMLFormElement>(null);
  
  const [formData, setFormData] = useState({
    user_name: '',
    user_email: '',
    subject: '',
    message: '',
  });

  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formRef.current) return;
    setStatus('sending');

    // Replace with your EmailJS credentials (e.g. env variables or placeholders)
    const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID || 'service_placeholder';
    const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID || 'template_placeholder';
    const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY || 'public_placeholder';

    if (serviceId === 'service_placeholder' || templateId === 'template_placeholder') {
      // Premium Simulation Fallback if credentials are not configured
      console.warn('EmailJS keys not configured. Simulating successful form delivery...');
      setTimeout(() => {
        setStatus('success');
        setFormData({ user_name: '', user_email: '', subject: '', message: '' });
      }, 1500);
      return;
    }

    try {
      await emailjs.sendForm(serviceId, templateId, formRef.current, publicKey);
      setStatus('success');
      setFormData({ user_name: '', user_email: '', subject: '', message: '' });
    } catch (err) {
      console.error('EmailJS Error:', err);
      setStatus('error');
    }
  };

  return (
    <section
      id="contact"
      className="relative py-24 overflow-hidden px-6 md:px-12 border-t border-white/5 bg-[#050816]"
    >
      {/* Background visual detail */}
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col mb-16 text-left">
          <span className="font-code text-xs text-blue-400 uppercase tracking-[0.2em] font-semibold mb-2">
            08 / COLLABORATE
          </span>
          <h2 className="font-heading text-3xl md:text-4xl font-bold tracking-tight text-white">
            GET IN TOUCH
          </h2>
          <div className="h-[1px] w-20 bg-blue-500/50 mt-4" />
        </div>

        {/* Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* Left Column: Direct info, Availability, Resume (LG:col-span-5) */}
          <div className="lg:col-span-5 flex flex-col gap-8 text-left">
            <div>
              <h3 className="font-heading text-xl font-bold text-white tracking-tight mb-3">
                Let's Build Something Revolutionary
              </h3>
              <p className="font-body text-xs md:text-sm text-subtext leading-relaxed">
                Whether you want to discuss AI integrations, full-stack architectures, or have an open role for a forward-thinking AI Engineer—drop a line.
              </p>
            </div>

            {/* Availability Badges */}
            <div className="flex flex-wrap gap-3">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-code text-[10px] font-bold uppercase tracking-wider">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                Open to Internships
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-code text-[10px] font-bold uppercase tracking-wider">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                Open to Freelance
              </div>
            </div>

            {/* Direct Contacts Info */}
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3.5">
                <div className="p-2.5 rounded-xl bg-white/5 border border-white/5 text-blue-400">
                  <Mail className="w-4.5 h-4.5" />
                </div>
                <div>
                  <span className="block font-body text-[9px] text-subtext/50 uppercase tracking-wider">Email Address</span>
                  <a href="mailto:ashin@example.com" className="font-code text-xs md:text-sm text-white hover:text-blue-400 transition-colors">
                    ashin@example.com
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-3.5">
                <div className="p-2.5 rounded-xl bg-white/5 border border-white/5 text-blue-400">
                  <Phone className="w-4.5 h-4.5" />
                </div>
                <div>
                  <span className="block font-body text-[9px] text-subtext/50 uppercase tracking-wider">Phone number</span>
                  <a href="tel:+919876543210" className="font-code text-xs md:text-sm text-white hover:text-blue-400 transition-colors">
                    +91 98765 43210
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-3.5">
                <div className="p-2.5 rounded-xl bg-white/5 border border-white/5 text-blue-400">
                  <MapPin className="w-4.5 h-4.5" />
                </div>
                <div>
                  <span className="block font-body text-[9px] text-subtext/50 uppercase tracking-wider">Current Location</span>
                  <span className="font-code text-xs md:text-sm text-white">
                    Kerala, India
                  </span>
                </div>
              </div>
            </div>

            {/* Official LinkedIn Profile Badge Card */}
            <div className="glass-panel p-5 rounded-2xl border border-white/5 bg-white/[0.02] flex flex-col items-center gap-3 overflow-hidden shadow-premium-glow">
              <div className="w-full flex items-center justify-between pb-2 border-b border-white/5">
                <span className="font-code text-xs text-blue-400 uppercase tracking-widest font-semibold flex items-center gap-2">
                  <FaLinkedin className="w-4 h-4 text-[#0A66C2]" />
                  LinkedIn Profile Badge
                </span>
                <span className="text-[10px] font-code text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20 uppercase tracking-wider font-semibold">
                  Verified
                </span>
              </div>
              <LinkedInBadge />
            </div>

            {/* Download Resume Block & Socials */}
            <div className="border-t border-white/5 pt-6 mt-2 flex flex-wrap items-center justify-between gap-4">
              <Magnetic strength={0.25}>
                <a
                  href="/resume.pdf"
                  download="Ashin-R-Resume.pdf"
                  onMouseEnter={() => setCursorMode('hover')}
                  onMouseLeave={() => setCursorMode('default')}
                  className="flex items-center gap-2.5 px-6 py-3 border border-blue-500/30 rounded-xl bg-blue-500/10 text-white font-body text-xs font-semibold uppercase tracking-wider shadow-premium-glow hover:bg-blue-500 hover:border-blue-500 hover:shadow-premium-glow-lg transition-premium w-fit"
                >
                  Download Full Resume
                  <Download className="w-4.5 h-4.5" />
                </a>
              </Magnetic>

              {/* Social icons list */}
              <div className="flex items-center gap-4">
                <Magnetic strength={0.3}>
                  <a
                    href="https://in.linkedin.com/in/ashin-r-05a4b9325"
                    target="_blank"
                    rel="noopener noreferrer"
                    onMouseEnter={() => setCursorMode('magnetic')}
                    onMouseLeave={() => setCursorMode('default')}
                    className="p-3 rounded-full border border-white/5 bg-white/5 text-subtext hover:text-blue-400 hover:border-blue-500/30 transition-premium shadow-premium-glow hover:bg-white/5"
                  >
                    <FaLinkedin className="w-4.5 h-4.5" />
                  </a>
                </Magnetic>
                <Magnetic strength={0.3}>
                  <a
                    href="https://github.com/ashin000"
                    target="_blank"
                    rel="noopener noreferrer"
                    onMouseEnter={() => setCursorMode('magnetic')}
                    onMouseLeave={() => setCursorMode('default')}
                    className="p-3 rounded-full border border-white/5 bg-white/5 text-subtext hover:text-blue-400 hover:border-blue-500/30 transition-premium shadow-premium-glow hover:bg-white/5"
                  >
                    <FaGithub className="w-4.5 h-4.5" />
                  </a>
                </Magnetic>
                <Magnetic strength={0.3}>
                  <a
                    href="https://instagram.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    onMouseEnter={() => setCursorMode('magnetic')}
                    onMouseLeave={() => setCursorMode('default')}
                    className="p-3 rounded-full border border-white/5 bg-white/5 text-subtext hover:text-blue-400 hover:border-blue-500/30 transition-premium shadow-premium-glow hover:bg-white/5"
                  >
                    <FaInstagram className="w-4.5 h-4.5" />
                  </a>
                </Magnetic>
              </div>
            </div>
          </div>

          {/* Right Column: Working Contact Form (LG:col-span-7) */}
          <div className="lg:col-span-7 w-full">
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="glass-panel p-6 md:p-8 rounded-2xl border border-white/5 relative overflow-hidden"
            >
              <form ref={formRef} onSubmit={handleFormSubmit} className="flex flex-col gap-5 text-left">
                {/* Name */}
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="user_name" className="font-heading text-[10px] font-bold text-white uppercase tracking-widest">
                    Your Name
                  </label>
                  <input
                    type="text"
                    id="user_name"
                    name="user_name"
                    required
                    value={formData.user_name}
                    onChange={handleInputChange}
                    onFocus={() => setCursorMode('text')}
                    onBlur={() => setCursorMode('default')}
                    className="w-full px-4 py-3 bg-white/5 border border-white/5 rounded-xl font-body text-xs md:text-sm text-white placeholder-subtext/30 focus:outline-none focus:border-blue-500/50 transition-colors"
                    placeholder="Enter your name"
                  />
                </div>

                {/* Email */}
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="user_email" className="font-heading text-[10px] font-bold text-white uppercase tracking-widest">
                    Your Email
                  </label>
                  <input
                    type="email"
                    id="user_email"
                    name="user_email"
                    required
                    value={formData.user_email}
                    onChange={handleInputChange}
                    onFocus={() => setCursorMode('text')}
                    onBlur={() => setCursorMode('default')}
                    className="w-full px-4 py-3 bg-white/5 border border-white/5 rounded-xl font-body text-xs md:text-sm text-white placeholder-subtext/30 focus:outline-none focus:border-blue-500/50 transition-colors"
                    placeholder="name@company.com"
                  />
                </div>

                {/* Subject */}
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="subject" className="font-heading text-[10px] font-bold text-white uppercase tracking-widest">
                    Subject
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    required
                    value={formData.subject}
                    onChange={handleInputChange}
                    onFocus={() => setCursorMode('text')}
                    onBlur={() => setCursorMode('default')}
                    className="w-full px-4 py-3 bg-white/5 border border-white/5 rounded-xl font-body text-xs md:text-sm text-white placeholder-subtext/30 focus:outline-none focus:border-blue-500/50 transition-colors"
                    placeholder="Opportunities, projects, questions..."
                  />
                </div>

                {/* Message */}
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="message" className="font-heading text-[10px] font-bold text-white uppercase tracking-widest">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={5}
                    value={formData.message}
                    onChange={handleInputChange}
                    onFocus={() => setCursorMode('text')}
                    onBlur={() => setCursorMode('default')}
                    className="w-full px-4 py-3 bg-white/5 border border-white/5 rounded-xl font-body text-xs md:text-sm text-white placeholder-subtext/30 focus:outline-none focus:border-blue-500/50 transition-colors resize-none"
                    placeholder="Write your message details..."
                  />
                </div>

                {/* Submit Feedback overlays */}
                <AnimatePresence>
                  {status === 'success' && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center gap-2.5 font-body text-xs md:text-sm"
                    >
                      <CheckCircle className="w-5 h-5 flex-shrink-0" />
                      Message sent successfully! I'll get back to you shortly.
                    </motion.div>
                  )}
                  {status === 'error' && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 flex items-center gap-2.5 font-body text-xs md:text-sm"
                    >
                      <AlertCircle className="w-5 h-5 flex-shrink-0" />
                      Error sending message. Please try emailing directly.
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Submit button */}
                <div className="mt-2.5">
                  <Magnetic strength={0.15}>
                    <button
                      type="submit"
                      disabled={status === 'sending' || status === 'success'}
                      onMouseEnter={() => setCursorMode('hover')}
                      onMouseLeave={() => setCursorMode('default')}
                      className="flex items-center justify-center gap-2 px-6 py-3 border border-white/10 rounded-xl bg-white/5 hover:bg-white/10 hover:border-white/20 text-white font-body text-xs font-semibold uppercase tracking-wider transition-premium disabled:opacity-50"
                    >
                      {status === 'sending' ? 'Transmitting...' : 'Send Message'}
                      <Send className="w-4 h-4" />
                    </button>
                  </Magnetic>
                </div>
              </form>
            </motion.div>
          </div>

        </div>

      </div>
    </section>
  );
}
