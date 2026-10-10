import React, { useState } from 'react';
import { projectList } from '../data/portfolioData';
import { ProjectItem } from '../types/portfolio';
import { Github, ExternalLink, Code2, Sparkles, X } from 'lucide-react';

export const Projects: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<'all' | 'ml' | 'systems' | 'web'>('all');
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null);

  const filteredProjects =
    activeFilter === 'all'
      ? projectList
      : projectList.filter((p) => p.category === activeFilter);

  return (
    <section id="projects" className="py-20 border-b border-zinc-800/80">
      <div className="max-w-6xl mx-auto px-6">
        {/* Section Header & Filter Controls */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mb-2">
              Featured Projects & Systems
            </h2>
            <p className="text-xs sm:text-sm text-zinc-400">
              Open-source repositories, distributed microservices, and machine learning pipelines.
            </p>
          </div>

          {/* Interactive filter control tabs (functional buttons allowed per constitution) */}
          <div className="flex items-center gap-1 p-1 bg-zinc-900/90 border border-zinc-800 rounded-lg self-start md:self-auto">
            <button
              onClick={() => setActiveFilter('all')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                activeFilter === 'all'
                  ? 'bg-zinc-800 text-white shadow-sm'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              All ({projectList.length})
            </button>
            <button
              onClick={() => setActiveFilter('ml')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                activeFilter === 'ml'
                  ? 'bg-zinc-800 text-white shadow-sm'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              AI & Machine Learning
            </button>
            <button
              onClick={() => setActiveFilter('systems')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                activeFilter === 'systems'
                  ? 'bg-zinc-800 text-white shadow-sm'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              Distributed & Systems
            </button>
            <button
              onClick={() => setActiveFilter('web')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                activeFilter === 'web'
                  ? 'bg-zinc-800 text-white shadow-sm'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              Web & Apps
            </button>
          </div>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              className="group flex flex-col justify-between p-6 rounded-lg border border-zinc-800/80 bg-zinc-950/60 hover:border-zinc-700 hover:bg-zinc-900/40 transition-all duration-200"
            >
              <div>
                {/* Meta header */}
                <div className="flex items-center justify-between gap-2 text-xs font-mono text-zinc-500 mb-3">
                  <span>{project.period}</span>
                </div>

                {/* Title */}
                <h3 className="text-lg font-semibold text-white group-hover:text-zinc-200 transition-colors mb-2">
                  {project.title}
                </h3>

                {/* Description */}
                <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed mb-5">
                  {project.description}
                </p>

                {/* Tech stack: clean unboxed monospace text (Zero-Pill Discipline) */}
                <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs font-mono text-zinc-400 mb-6">
                  {project.technologies.map((tech, idx) => (
                    <React.Fragment key={tech}>
                      <span className="text-zinc-300">{tech}</span>
                      {idx < project.technologies.length - 1 && (
                        <span aria-hidden="true" className="text-zinc-600">
                          /
                        </span>
                      )}
                    </React.Fragment>
                  ))}
                </div>
              </div>

              {/* Bottom Card Actions */}
              <div className="flex items-center justify-between gap-3 pt-4 border-t border-zinc-900">
                <button
                  onClick={() => setSelectedProject(project)}
                  className="text-xs font-medium text-zinc-400 hover:text-white transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <Code2 className="w-3.5 h-3.5" />
                  <span>Architecture Details</span>
                </button>

                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-mono text-zinc-400 hover:text-white transition-colors flex items-center gap-1.5"
                >
                  <Github className="w-3.5 h-3.5" />
                  <span>GitHub</span>
                  <ExternalLink className="w-3 h-3 text-zinc-500" />
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* View all on GitHub banner */}
        <div className="mt-12 p-6 rounded-lg border border-zinc-800/80 bg-zinc-950/40 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <div className="text-sm font-semibold text-white">Explore Full Code Repositories</div>
            <div className="text-xs text-zinc-400 mt-0.5">
              Source code, algorithmic implementations, and benchmarks available on GitHub @Kard9876.
            </div>
          </div>
          <a
            href="https://github.com/Kard9876"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 text-white border border-zinc-700/80 font-medium text-xs rounded-md transition-colors flex items-center gap-2 shrink-0"
          >
            <Github className="w-4 h-4" />
            <span>github.com/Kard9876</span>
            <ExternalLink className="w-3 h-3 text-zinc-500" />
          </a>
        </div>
      </div>

      {/* Project Details Modal */}
      {selectedProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-2xl bg-[#0e0e11] border border-zinc-800 rounded-xl p-6 sm:p-8 shadow-2xl">
            <button
              onClick={() => setSelectedProject(null)}
              aria-label="Close modal"
              className="absolute top-5 right-5 p-2 text-zinc-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 text-xs font-mono text-zinc-500 mb-2">
              <span>{selectedProject.period}</span>
            </div>

            <h3 className="text-2xl font-bold text-white mb-4">
              {selectedProject.title}
            </h3>

            <p className="text-sm text-zinc-300 leading-relaxed mb-6">
              {selectedProject.detailedDescription || selectedProject.description}
            </p>

            <div className="mb-6">
              <div className="text-xs font-mono text-zinc-400 uppercase tracking-wider mb-2">
                Key Engineering Highlights
              </div>
              <ul className="space-y-2 text-xs sm:text-sm text-zinc-300">
                {selectedProject.highlights.map((h, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-2 shrink-0" />
                    <span>{h}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mb-6">
              <div className="text-xs font-mono text-zinc-400 uppercase tracking-wider mb-2">
                Technologies & Tools
              </div>
              <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs font-mono text-zinc-300">
                {selectedProject.technologies.map((tech, idx) => (
                  <span key={tech} className="bg-zinc-900 border border-zinc-800 px-2 py-1 rounded">
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-zinc-800">
              <button
                onClick={() => setSelectedProject(null)}
                className="px-4 py-2 text-xs font-medium text-zinc-400 hover:text-white transition-colors cursor-pointer"
              >
                Close
              </button>
              <a
                href={selectedProject.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-white hover:bg-zinc-200 text-black font-semibold text-xs rounded-md transition-colors flex items-center gap-2"
              >
                <Github className="w-4 h-4" />
                <span>View on GitHub</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
