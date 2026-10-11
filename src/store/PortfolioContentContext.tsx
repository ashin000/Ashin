import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { defaultPortfolioContent } from '../data/defaultPortfolioContent';
import type { PortfolioContent } from '../data/portfolioContent';

interface PortfolioContentContextValue {
  content: PortfolioContent;
  setContent: (content: PortfolioContent) => void;
}

const PortfolioContentContext = createContext<PortfolioContentContextValue | null>(null);

export function PortfolioContentProvider({ children }: { children: ReactNode }) {
  const [content, setContent] = useState(defaultPortfolioContent);

  useEffect(() => {
    let active = true;
    fetch('/api/content')
      .then((response) => response.ok ? response.json() : null)
      .then((savedContent: PortfolioContent | null) => {
        if (active && savedContent) setContent(savedContent);
      })
      .catch(() => {
        // Keep the bundled portfolio content available when the API is not configured.
      });
    return () => { active = false; };
  }, []);

  const value = useMemo(() => ({ content, setContent }), [content]);
  return <PortfolioContentContext.Provider value={value}>{children}</PortfolioContentContext.Provider>;
}

export function usePortfolioContent() {
  const context = useContext(PortfolioContentContext);
  if (!context) throw new Error('usePortfolioContent must be used within PortfolioContentProvider');
  return context;
}
