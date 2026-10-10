import React, { useState } from 'react';
import { Crosshair, Menu, X, ArrowUpRight } from 'lucide-react';

interface NavbarProps {
  onOpenGame?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenGame }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-zinc-800/80 bg-[#09090b]/85 backdrop-blur-md">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-8 px-6 py-4">
        {/* Zone 1: Single text element wordmark */}
        <a
          href="#about"
          className="text-base font-semibold tracking-tight text-white hover:text-zinc-300 transition-colors whitespace-nowrap shrink-0 flex items-center gap-2"
        >
          <span className="w-2 h-2 rounded-full bg-zinc-200 inline-block" />
          Guilherme Barbosa
        </a>

        {/* Zone 2: 4–5 clean single-line text navigation links */}
        <nav className="hidden md:flex items-center gap-7 text-xs font-medium text-zinc-400">
          <a href="#about" className="hover:text-white transition-colors whitespace-nowrap shrink-0">
            About
          </a>
          <a href="#experience" className="hover:text-white transition-colors whitespace-nowrap shrink-0">
            Experience
          </a>
          <a href="#education" className="hover:text-white transition-colors whitespace-nowrap shrink-0">
            Education
          </a>
          <a href="#projects" className="hover:text-white transition-colors whitespace-nowrap shrink-0">
            Projects
          </a>
          <a href="#skills" className="hover:text-white transition-colors whitespace-nowrap shrink-0">
            Skills
          </a>
          <a href="#contact" className="hover:text-white transition-colors whitespace-nowrap shrink-0">
            Contact
          </a>

          {/* Shooting Range Trigger */}
          <button
            onClick={onOpenGame}
            className="flex items-center gap-1.5 text-amber-400 hover:text-amber-300 transition-colors whitespace-nowrap shrink-0 cursor-pointer font-mono text-[11px]"
          >
            <Crosshair className="w-3.5 h-3.5" />
            <span>Shooting Range</span>
          </button>
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="hidden md:flex items-center gap-3 shrink-0">
          <a
            href="#contact"
            className="px-4 py-2 text-xs font-medium text-black bg-white hover:bg-zinc-200 rounded-md transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5"
          >
            <span>Get in Touch</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* Mobile menu toggle */}
        <div className="flex md:hidden items-center gap-2">
          {onOpenGame && (
            <button
              onClick={onOpenGame}
              className="p-2 text-amber-400 hover:text-amber-300 transition-colors"
              aria-label="Shooting Range"
            >
              <Crosshair className="w-5 h-5" />
            </button>
          )}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-zinc-400 hover:text-white transition-colors"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-zinc-800 bg-[#0c0c0e] px-6 py-4 flex flex-col gap-4 text-sm font-medium">
          <a
            href="#about"
            onClick={() => setMobileMenuOpen(false)}
            className="text-zinc-300 hover:text-white transition-colors"
          >
            About
          </a>
          <a
            href="#experience"
            onClick={() => setMobileMenuOpen(false)}
            className="text-zinc-300 hover:text-white transition-colors"
          >
            Experience
          </a>
          <a
            href="#education"
            onClick={() => setMobileMenuOpen(false)}
            className="text-zinc-300 hover:text-white transition-colors"
          >
            Education
          </a>
          <a
            href="#projects"
            onClick={() => setMobileMenuOpen(false)}
            className="text-zinc-300 hover:text-white transition-colors"
          >
            Projects
          </a>
          <a
            href="#skills"
            onClick={() => setMobileMenuOpen(false)}
            className="text-zinc-300 hover:text-white transition-colors"
          >
            Skills
          </a>
          <a
            href="#contact"
            onClick={() => setMobileMenuOpen(false)}
            className="text-zinc-300 hover:text-white transition-colors"
          >
            Contact
          </a>
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              if (onOpenGame) onOpenGame();
            }}
            className="flex items-center gap-2 text-amber-400 py-1 text-left"
          >
            <Crosshair className="w-4 h-4" />
            <span>Shooting Range</span>
          </button>
          <a
            href="#contact"
            onClick={() => setMobileMenuOpen(false)}
            className="w-full text-center py-2 text-xs font-semibold text-black bg-white rounded-md mt-2"
          >
            Get in Touch
          </a>
        </div>
      )}
    </header>
  );
};
