import React from 'react';
import { experienceList } from '../data/portfolioData';

export const Experience: React.FC = () => {
  return (
    <section id="experience" className="py-20 border-b border-zinc-800/80">
      <div className="max-w-6xl mx-auto px-6">
        {/* Section Header */}
        <div className="mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Work & Research Experience
          </h2>
        </div>

        {/* Experience List */}
        <div className="space-y-12">
          {experienceList.map((item, index) => (
            <div
              key={item.id}
              className="group border-b border-zinc-900 pb-10 last:border-b-0 last:pb-0"
            >
              {/* Header row */}
              <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 mb-3">
                <div>
                  <h3 className="text-lg font-semibold text-white group-hover:text-zinc-200 transition-colors">
                    {item.role}
                  </h3>
                  <div className="flex flex-wrap items-center gap-2 text-xs text-zinc-400 mt-1">
                    <span className="text-zinc-300 font-medium">{item.institution}</span>
                    {item.project && (
                      <>
                        <span aria-hidden="true" className="text-zinc-700">·</span>
                        <span className="text-zinc-400">{item.project}</span>
                      </>
                    )}
                    {item.reference && (
                      <>
                        <span aria-hidden="true" className="text-zinc-700">·</span>
                        <span className="font-mono text-zinc-500">{item.reference}</span>
                      </>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs font-mono text-zinc-500 whitespace-nowrap">
                  <span>{item.period}</span>
                  <span aria-hidden="true" className="text-zinc-700">·</span>
                  <span>{item.location}</span>
                </div>
              </div>

              {/* Highlights bulleted with clean subtle dots */}
              <ul className="mt-4 space-y-2 text-sm text-zinc-400 max-w-4xl">
                {item.highlights.map((bullet, bIndex) => (
                  <li key={bIndex} className="flex items-start gap-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-zinc-600 mt-2 shrink-0" />
                    <span className="leading-relaxed">{bullet}</span>
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
