import React from 'react';
import { skillCategories } from '../data/portfolioData';
import { Wrench } from 'lucide-react';

export const Skills: React.FC = () => {
  return (
    <section id="skills" className="py-20 border-b border-zinc-800/80 bg-zinc-950/20">
      <div className="max-w-6xl mx-auto px-6">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-baseline justify-between mb-12 gap-2">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mb-2 flex items-center gap-2.5">
              <Wrench className="w-5 h-5 text-zinc-400" />
              Technical Skills & Stack
            </h2>
            <p className="text-xs sm:text-sm text-zinc-400">
              Core technologies, research toolchains, and software engineering foundations.
            </p>
          </div>
          <div className="text-xs font-mono text-zinc-500">
            Systems · AI / ML · Tools & Core Tech
          </div>
        </div>

        {/* Skills Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {skillCategories.map((group) => (
            <div
              key={group.category}
              className="p-6 rounded-lg border border-zinc-800/80 bg-zinc-950/60"
            >
              <h3 className="text-xs font-mono uppercase tracking-wider text-zinc-400 mb-4 pb-2 border-b border-zinc-900">
                {group.category}
              </h3>

              {/* Clean unboxed item list (Zero-Pill Discipline) */}
              <ul className="space-y-2.5 text-sm text-zinc-300">
                {group.skills.map((skill) => (
                  <li key={skill} className="flex items-center gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-zinc-500 shrink-0" />
                    <span>{skill}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
