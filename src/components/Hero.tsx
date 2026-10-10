import React from 'react';
import { ArrowDown, Github, Linkedin, Mail, MapPin, Crosshair, FileText } from 'lucide-react';
import { contactInfo, summary } from '../data/portfolioData';

interface HeroProps {
  onOpenGame?: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenGame }) => {
  return (
    <section id="about" className="relative pt-20 pb-16 md:pt-28 md:pb-24 border-b border-zinc-800/80 bg-grid-pattern">
      <div className="absolute inset-0 bg-radial-glow pointer-events-none" />

      <div className="relative max-w-6xl mx-auto px-6">
        {/* Top availability & domain line */}
        <div className="flex flex-wrap items-center gap-3 text-xs font-mono text-zinc-400 mb-6">
          <span className="text-zinc-300">Software & Machine Learning Engineer</span>
          <span aria-hidden="true" className="text-zinc-700">·</span>
          <span>Braga, Portugal</span>
          <span aria-hidden="true" className="text-zinc-700">·</span>
          <span className="text-emerald-400">Open to Roles</span>
        </div>

        {/* Hero Headline & Bio */}
        <div className="max-w-4xl">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-white mb-6 leading-[1.1] text-balance">
            Guilherme Barbosa
          </h1>

          <p className="text-lg sm:text-xl text-zinc-300 font-medium mb-6 leading-relaxed">
            Software & Machine Learning Engineer specialized in distributed systems, predictive neural architectures, and scalable microservices.
          </p>

          <p className="text-sm sm:text-base text-zinc-400 leading-relaxed max-w-3xl mb-10">
            {summary}
          </p>
        </div>

        {/* Action Buttons & Links */}
        <div className="flex flex-wrap items-center gap-4 mb-14">
          <a
            href="#projects"
            className="px-5 py-2.5 bg-white hover:bg-zinc-200 text-black font-semibold text-xs rounded-md transition-colors flex items-center gap-2"
          >
            <span>View Projects</span>
            <ArrowDown className="w-3.5 h-3.5" />
          </a>

          <a
            href="#contact"
            className="px-5 py-2.5 bg-zinc-900 hover:bg-zinc-800 text-white border border-zinc-700/80 font-medium text-xs rounded-md transition-colors flex items-center gap-2"
          >
            <Mail className="w-3.5 h-3.5 text-zinc-400" />
            <span>Contact Me</span>
          </a>

          <button
            onClick={onOpenGame}
            className="px-5 py-2.5 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 font-medium text-xs rounded-md transition-colors flex items-center gap-2 cursor-pointer font-mono"
          >
            <Crosshair className="w-3.5 h-3.5" />
            <span>Shooting Range</span>
          </button>

          {/* Social icons */}
          <div className="flex items-center gap-2 sm:ml-4 border-l sm:border-zinc-800 sm:pl-4">
            <a
              href={contactInfo.github}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub Profile"
              className="p-2.5 text-zinc-400 hover:text-white border border-zinc-800 hover:border-zinc-700 rounded-md transition-colors"
            >
              <Github className="w-4 h-4" />
            </a>
            <a
              href={contactInfo.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn Profile"
              className="p-2.5 text-zinc-400 hover:text-white border border-zinc-800 hover:border-zinc-700 rounded-md transition-colors"
            >
              <Linkedin className="w-4 h-4" />
            </a>
            <a
              href={`mailto:${contactInfo.email}`}
              aria-label="Send Email"
              className="p-2.5 text-zinc-400 hover:text-white border border-zinc-800 hover:border-zinc-700 rounded-md transition-colors"
            >
              <Mail className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
