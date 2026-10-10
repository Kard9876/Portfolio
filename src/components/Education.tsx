import React from 'react';
import { educationList } from '../data/portfolioData';
import { GraduationCap } from 'lucide-react';

export const Education: React.FC = () => {
  return (
    <section id="education" className="py-20 border-b border-zinc-800/80 bg-zinc-950/30">
      <div className="max-w-6xl mx-auto px-6">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-baseline justify-between mb-12 gap-2">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mb-2 flex items-center gap-2.5">
              <GraduationCap className="w-6 h-6 text-zinc-400" />
              Education & Academic Background
            </h2>
            <p className="text-xs sm:text-sm text-zinc-400">
              Formal degrees in Software Engineering at the University of Minho.
            </p>
          </div>
          <div className="text-xs font-mono text-zinc-500">
            University of Minho · Braga, Portugal
          </div>
        </div>

        {/* Education Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {educationList.map((item, idx) => (
            <div
              key={idx}
              className="p-6 rounded-lg border border-zinc-800/80 bg-zinc-950/70 hover:border-zinc-700 transition-colors flex flex-col justify-between"
            >
              <div>
                {item.period && (
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="text-xs font-mono text-zinc-500">{item.period}</span>
                  </div>
                )}

                <h3 className="text-lg font-semibold text-white mb-1">
                  {item.degree}
                </h3>

                {item.specialization && (
                  <div className="text-xs font-medium text-zinc-300 mb-2">
                    Specialization: {item.specialization}
                  </div>
                )}
              </div>

              {(item.institution || item.location) && (
                <div className="flex items-center gap-2 text-xs text-zinc-500 font-mono mt-4">
                  {item.institution && <span>{item.institution}</span>}
                  {item.institution && item.location && <span aria-hidden="true" className="text-zinc-700">·</span>}
                  {item.location && <span>{item.location}</span>}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
