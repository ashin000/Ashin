import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Terminal as TerminalIcon } from 'lucide-react';
import { useUIStore } from '../../store/uiStore';

interface TerminalLine {
  text: string;
  type: 'input' | 'output' | 'error' | 'success';
}

export default function Terminal() {
  const { terminalOpen, setTerminalOpen, setCursorMode } = useUIStore();
  const [input, setInput] = useState('');
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
        { text: '  sudo hire ashin   - Open the primary interview payload', type: 'success' },
        { text: '  clear             - Flush terminal log history', type: 'output' },
        { text: '  exit              - Terminate terminal session', type: 'output' }
      );
    } else if (trimmed === 'about') {
      newHistory.push(
        { text: 'ABOUT ASHIN R:', type: 'success' },
        { text: '  Curious AI engineer building systems bridging ML data layers and frontends.', type: 'output' },
        { text: '  Specializes in automation, python scripting, and IoT edge devices.', type: 'output' }
      );
    } else if (trimmed === 'skills') {
      newHistory.push(
        { text: 'STACK CAPABILITIES:', type: 'success' },
        { text: '  Languages : Python, TypeScript, Java, C, SQL', type: 'output' },
        { text: '  AI/ML     : TensorFlow, PyTorch, Scikit Learn, OpenCV', type: 'output' },
        { text: '  Cloud/Ops : Linux, AWS, Docker, GitHub Actions', type: 'output' }
      );
    } else if (trimmed === 'projects') {
      newHistory.push(
        { text: 'CASE STUDIES SUMMARY:', type: 'success' },
        { text: '  - AI Linux Administration Assistant (FastAPI, LLM command compiler)', type: 'output' },
        { text: '  - Cyber Incident Reporting System (Node.js, MongoDB threat class)', type: 'output' },
        { text: '  - Waste Segregation IoT (Raspberry Pi, OpenCV object sorter)', type: 'output' }
      );
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

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleCommand(input);
    }
  };

  return (
    <AnimatePresence>
      {terminalOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-70 flex items-center justify-center p-4 md:p-12 bg-background/90 backdrop-blur-md"
        >
          {/* Shell Container */}
          <motion.div
            initial={{ scale: 0.95, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.95, y: 20 }}
            className="w-full max-w-3xl h-[450px] md:h-[500px] rounded-xl border border-white/10 bg-[#050816] flex flex-col overflow-hidden shadow-premium-glow-lg text-left"
          >
            {/* Window title bar */}
            <div className="bg-white/5 border-b border-white/5 px-4 py-3 flex items-center justify-between select-none">
              <div className="flex items-center gap-2">
                <TerminalIcon className="w-4 h-4 text-blue-400" />
                <span className="font-code text-xs text-white/80 font-medium">
                  ashin@secure-shell:~/terminal
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/30" />
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/30" />
                <button
                  onClick={() => setTerminalOpen(false)}
                  className="p-1 rounded hover:bg-white/5 text-subtext hover:text-white transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Terminal logs area */}
            <div
              className="flex-1 p-6 overflow-y-auto font-code text-xs md:text-sm flex flex-col gap-2.5 scrollbar-thin scrollbar-thumb-white/5 scrollbar-track-transparent"
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
                      : 'text-subtext/80'
                  }`}
                >
                  {line.text}
                </div>
              ))}
              <div ref={bottomRef} />
            </div>

            {/* Input prompt bar */}
            <div className="border-t border-white/5 px-6 py-4 bg-white/[0.01] flex items-center gap-2">
              <span className="font-code text-xs md:text-sm text-blue-400 font-semibold select-none flex-shrink-0">
                visitor@ashin.dev:~$
              </span>
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                onFocus={() => setCursorMode('text')}
                onBlur={() => setCursorMode('default')}
                className="flex-1 bg-transparent border-none outline-none font-code text-xs md:text-sm text-white placeholder-white/10"
                placeholder="type command..."
                autoFocus
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
