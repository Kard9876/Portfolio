import React from 'react';
import { contactInfo } from '../data/portfolioData';
import { ArrowUp, Github, Linkedin, Mail, Crosshair } from 'lucide-react';

export const Footer: React.FC<{ onOpenGame?: () => void }> = ({ onOpenGame }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="py-12 border-t border-zinc-900 bg-[#070709] text-xs text-zinc-500">
      <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div>
          <div className="text-zinc-300 font-semibold mb-1">
            Guilherme Barbosa
          </div>
          <div className="text-zinc-500 font-mono">
            Software & Machine Learning Engineer · Braga, Portugal
          </div>
        </div>

        <div className="flex items-center gap-6">
          <a
            href={contactInfo.github}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-zinc-300 transition-colors"
          >
            GitHub
          </a>
          <a
            href={contactInfo.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-zinc-300 transition-colors"
          >
            LinkedIn
          </a>
          {onOpenGame && (
            <button
              onClick={onOpenGame}
              className="text-amber-500 hover:text-amber-400 font-mono transition-colors cursor-pointer flex items-center gap-1"
            >
              <Crosshair className="w-3.5 h-3.5" />
              <span>Shooting Range</span>
            </button>
          )}
          <button
            onClick={scrollToTop}
            aria-label="Scroll to top"
            className="p-2 text-zinc-400 hover:text-white border border-zinc-800 rounded transition-colors cursor-pointer"
            title="Back to top"
          >
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </footer>
  );
};
