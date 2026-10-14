import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Terminal as TerminalIcon } from 'lucide-react';
import { useUIStore } from '../../store/uiStore';
import { usePortfolioContent } from '../../store/PortfolioContentContext';

interface TerminalLine {
  text: string;
  type: 'input' | 'output' | 'error' | 'success';
}

export default function Terminal() {
  const { terminalOpen, setTerminalOpen, setCursorMode } = useUIStore();
  const { content } = usePortfolioContent();
  const [input, setInput] = useState('');
  const [adminLoginStep, setAdminLoginStep] = useState<'idle' | 'username' | 'password' | 'checking'>('idle');
  const [adminUsername, setAdminUsername] = useState('');
  const [history, setHistory] = useState<TerminalLine[]>([
    { text: 'System Console [v1.0.8]', type: 'success' },
    { text: 'Establishing secure link to Ashin R AI core...', type: 'output' },
    { text: 'Link stable. Type "help" to list available commands.', type: 'output' },
  ]);
  
  const inputRef = useRef<HTMLInputElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (terminalOpen) {
      inputRef.current?.focus();
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [terminalOpen]);

  useEffect(() => {
    // Scroll to bottom whenever history updates
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  const handleCommand = (cmd: string) => {
    const trimmed = cmd.trim().toLowerCase();
    const newHistory = [...history, { text: `visitor@ashin.dev:~$ ${cmd}`, type: 'input' as const }];

    if (trimmed === 'help') {
      newHistory.push(
        { text: 'Available commands:', type: 'success' },
        { text: '  about             - Story and genesis details', type: 'output' },
        { text: '  skills            - Stack and capabilities summary', type: 'output' },
        { text: '  projects          - List case studies summary', type: 'output' },
        { text: '  admin             - Open the private portfolio editor sign-in', type: 'success' },
        { text: '  sudo hire ashin   - Open the primary interview payload', type: 'success' },
        { text: '  clear             - Flush terminal log history', type: 'output' },
        { text: '  exit              - Terminate terminal session', type: 'output' }
      );
    } else if (trimmed === 'about') {
      const biography = Array.isArray(content.about.paragraphs) ? content.about.paragraphs : [];
      newHistory.push(
        { text: 'ABOUT ASHIN R:', type: 'success' },
        ...biography.map((paragraph) => ({ text: `  ${paragraph}`, type: 'output' as const }))
      );
    } else if (trimmed === 'skills') {
      const skillSummary = content.skills.map((category) => {
        const names = Array.isArray(category.skills) ? category.skills.join(', ') : '';
        return `  ${String(category.category ?? 'Skills')} : ${names}`;
      });
      newHistory.push(
        { text: 'STACK CAPABILITIES:', type: 'success' },
        ...skillSummary.map((line) => ({ text: line, type: 'output' as const }))
      );
    } else if (trimmed === 'projects') {
      const projectSummary = content.projects.map((project) => `  - ${String(project.title ?? 'Project')} (${String(project.subtitle ?? '')})`);
      newHistory.push(
        { text: 'CASE STUDIES SUMMARY:', type: 'success' },
        ...projectSummary.map((line) => ({ text: line, type: 'output' as const }))
      );
    } else if (['admin', 'admin login', 'sudo admin'].includes(trimmed)) {
      newHistory.push(
        { text: 'Private admin authentication started.', type: 'success' },
        { text: 'Enter your username, then your password. Password input is hidden.', type: 'output' },
        { text: 'Do not enter these credentials anywhere except your own trusted portfolio session.', type: 'output' }
      );
      setAdminUsername('');
      setAdminLoginStep('username');
    } else if (trimmed === 'sudo hire ashin') {
      newHistory.push(
        { text: 'Loading AI Engineer...', type: 'success' },
        { text: 'Projects Loaded.', type: 'success' },
        { text: 'Skills Loaded.', type: 'success' },
        { text: 'Ready for Interview.', type: 'success' },
        { text: 'Triggering contact navigation protocols...', type: 'output' }
      );
      // Close terminal and scroll to contact form after a delay
      setTimeout(() => {
        setTerminalOpen(false);
        const contactSec = document.getElementById('contact');
        if (contactSec) contactSec.scrollIntoView({ behavior: 'smooth' });
      }, 2500);
    } else if (trimmed === 'clear') {
      setHistory([]);
      setInput('');
      return;
    } else if (trimmed === 'exit') {
      setTerminalOpen(false);
      setInput('');
      return;
    } else {
      newHistory.push({
        text: `Command not found: "${cmd}". Type "help" for a list of commands.`,
        type: 'error',
      });
    }

    setHistory(newHistory);
    setInput('');
  };

  const handleAdminCredential = async () => {
    const value = input;
    setInput('');

    if (adminLoginStep === 'username') {
      const username = value.trim();
      if (!username) {
        setHistory((previous) => [...previous, { text: 'Username cannot be empty. Try again.', type: 'error' }]);
        return;
      }
      setAdminUsername(username);
      setAdminLoginStep('password');
      setHistory((previous) => [...previous, { text: 'Username received. Enter password:', type: 'success' }]);
      return;
    }

    if (adminLoginStep !== 'password') return;
    if (!value) {
      setHistory((previous) => [...previous, { text: 'Password cannot be empty. Try again.', type: 'error' }]);
      return;
    }

    setAdminLoginStep('checking');
    setHistory((previous) => [...previous, { text: 'Authenticating securely…', type: 'output' }]);
    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: adminUsername, password: value }),
      });
      const result = await response.json() as { error?: string; authenticated?: boolean };
      if (!response.ok) throw new Error(result.error ?? 'Authentication failed.');
      setHistory((previous) => [...previous, { text: 'Authentication successful. Opening the admin editor…', type: 'success' }]);
      setAdminLoginStep('idle');
      window.setTimeout(() => {
        setTerminalOpen(false);
        window.location.assign('/admin');
      }, 700);
    } catch (error) {
      setAdminUsername('');
      setAdminLoginStep('username');
      setHistory((previous) => [...previous, {
        text: error instanceof Error ? `${error.message} Enter username to try again.` : 'Authentication failed. Enter username to try again.',
        type: 'error',
      }]);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      if (adminLoginStep === 'username' || adminLoginStep === 'password') {
        void handleAdminCredential();
      } else if (adminLoginStep === 'idle') {
        handleCommand(input);
      }
    }
  };

  return (
    <AnimatePresence>
      {terminalOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="theme-light fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6 lg:p-10 bg-[#243b5a]/25 backdrop-blur-xl"
        >
          {/* Shell Container */}
          <motion.div
            initial={{ scale: 0.95, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.95, y: 20 }}
            className="terminal-window w-full max-w-5xl h-[min(78svh,720px)] min-h-[360px] rounded-2xl border border-blue-400/30 bg-black flex flex-col overflow-hidden shadow-[0_24px_100px_rgba(0,0,0,0.45),0_0_45px_rgba(73,104,142,0.2)] text-left ring-1 ring-white/10"
          >
            {/* Window title bar */}
            <div className="terminal-titlebar bg-[#111318] border-b border-white/10 px-4 sm:px-6 py-3.5 flex items-center justify-between select-none">
              <div className="flex items-center gap-2">
                <TerminalIcon className="w-4 h-4 text-blue-400" />
                <span className="font-code text-xs sm:text-sm text-white font-semibold">
                  ashin@secure-shell:~/terminal
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/30" />
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/30" />
                <button
                  onClick={() => {
                    setInput('');
                    setAdminUsername('');
                    setAdminLoginStep('idle');
                    setTerminalOpen(false);
                  }}
                  className="p-1 rounded hover:bg-white/5 text-subtext hover:text-white transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Terminal logs area */}
            <div
              className="terminal-output flex-1 p-5 sm:p-8 overflow-y-auto bg-black font-code text-sm sm:text-base flex flex-col gap-3 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent"
              onClick={() => inputRef.current?.focus()}
            >
              {history.map((line, idx) => (
                <div
                  key={idx}
                  className={`leading-relaxed ${
                    line.type === 'input'
                      ? 'text-white font-medium'
                      : line.type === 'success'
                      ? 'text-emerald-400 font-semibold'
                      : line.type === 'error'
                      ? 'text-red-400 font-semibold'
                      : 'text-slate-300'
                  }`}
                >
                  {line.text}
                </div>
              ))}
              <div ref={bottomRef} />
            </div>

            {/* Input prompt bar */}
            <div className="terminal-commandbar border-t border-blue-400/20 px-4 sm:px-6 py-4 bg-[#111318] flex items-center gap-2">
              <span className="font-code text-xs sm:text-sm text-blue-300 font-bold select-none flex-shrink-0">
                {adminLoginStep === 'username' ? 'admin username:' : adminLoginStep === 'password' ? 'admin password:' : adminLoginStep === 'checking' ? 'admin auth:' : 'visitor@ashin.dev:~$'}
              </span>
              <input
                ref={inputRef}
                type={adminLoginStep === 'password' ? 'password' : 'text'}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                onFocus={() => setCursorMode('text')}
                onBlur={() => setCursorMode('default')}
                className="flex-1 min-w-0 bg-transparent border-none outline-none font-code text-sm sm:text-base text-white placeholder-slate-400 caret-blue-300"
                placeholder={adminLoginStep === 'username' ? 'enter username…' : adminLoginStep === 'password' ? 'enter password…' : adminLoginStep === 'checking' ? 'verifying…' : 'type command...'}
                autoComplete="off"
                disabled={adminLoginStep === 'checking'}
                autoFocus
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
