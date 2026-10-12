import React, { useState } from 'react';
import { contactInfo } from '../data/portfolioData';
import { Mail, Github, Linkedin, Copy, Check, ArrowUpRight } from 'lucide-react';

export const Contact: React.FC = () => {
  const [copiedEmail, setCopiedEmail] = useState(false);

  const copyEmail = () => {
    navigator.clipboard.writeText(contactInfo.email);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2500);
  };

  return (
    <section id="contact" className="py-24 border-b border-zinc-800/80 bg-zinc-950/30">
      <div className="max-w-4xl mx-auto px-6 text-center">
        {/* Minimalist Section Header */}
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white mb-6 text-balance">
          Contact Me
        </h2>

        <p className="text-sm sm:text-base text-zinc-400 max-w-xl mx-auto leading-relaxed mb-10">
          I&apos;m currently open to new software engineering and machine learning opportunities. Whether you have a question, a project to collaborate on, or any other inquiries, feel free to reach out.
        </p>

        {/* Sleek Minimalist Email Interaction Card */}
        <div className="inline-flex flex-col sm:flex-row items-center gap-2 sm:gap-3 p-1.5 sm:p-2 bg-[#121215] border border-zinc-800/90 hover:border-zinc-700/80 rounded-2xl sm:rounded-full max-w-full mx-auto mb-10 transition-all duration-200 shadow-xl">
          <a
            href={`mailto:${contactInfo.email}`}
            className="flex items-center gap-3 pl-4 pr-3 py-2 text-zinc-100 hover:text-white font-mono text-sm sm:text-base font-medium transition-colors"
          >
            <Mail className="w-4 h-4 text-amber-400 shrink-0" />
            <span>{contactInfo.email}</span>
          </a>

          <div className="flex items-center gap-2 px-2 pb-1 sm:pb-0">
            <button
              onClick={copyEmail}
              aria-label="Copy email address"
              className="px-3.5 py-1.5 text-xs font-mono rounded-full border border-zinc-700/60 bg-zinc-800/70 hover:bg-zinc-700 text-zinc-300 hover:text-white transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              {copiedEmail ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400 font-medium">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-zinc-400" />
                  <span>Copy</span>
                </>
              )}
            </button>

            <a
              href={`mailto:${contactInfo.email}`}
              className="px-4 py-1.5 text-xs font-semibold rounded-full bg-white hover:bg-zinc-200 text-black transition-colors flex items-center gap-1 whitespace-nowrap shadow-sm"
            >
              <span>Send Mail</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Social and Profile Links */}
        <div className="flex flex-wrap items-center justify-center gap-6 text-xs font-mono text-zinc-400">
          <a
            href={contactInfo.github}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition-colors flex items-center gap-1.5 group"
          >
            <Github className="w-4 h-4 text-zinc-500 group-hover:text-white transition-colors" />
            <span>GitHub @Kard9876</span>
            <ArrowUpRight className="w-3 h-3 text-zinc-600 group-hover:text-zinc-400" />
          </a>

          <span aria-hidden="true" className="text-zinc-700">·</span>

          <a
            href={contactInfo.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition-colors flex items-center gap-1.5 group"
          >
            <Linkedin className="w-4 h-4 text-zinc-500 group-hover:text-white transition-colors" />
            <span>LinkedIn</span>
            <ArrowUpRight className="w-3 h-3 text-zinc-600 group-hover:text-zinc-400" />
          </a>
        </div>
      </div>
    </section>
  );
};
