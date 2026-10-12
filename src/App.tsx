import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { Experience } from './components/Experience';
import { Education } from './components/Education';
import { Projects } from './components/Projects';
import { Skills } from './components/Skills';
import { Contact } from './components/Contact';
import { Footer } from './components/Footer';
import { CsgoMiniGame } from './components/CsgoMiniGame';
import { Crosshair, X, Maximize2 } from 'lucide-react';

export default function App() {
  const [showGameModal, setShowGameModal] = useState(false);

  return (
    <div className="min-h-screen bg-[#09090b] text-[#f4f4f5] antialiased selection:bg-neutral-800 selection:text-white">
      {/* Navigation */}
      <Navbar onOpenGame={() => setShowGameModal(true)} />

      {/* Main Content Sections */}
      <main>
        {/* Hero Section */}
        <Hero onOpenGame={() => setShowGameModal(true)} />

        {/* Experience Section */}
        <Experience />

        {/* Education Section */}
        <Education />

        {/* Projects Section */}
        <Projects />

        {/* Skills Section */}
        <Skills />

        {/* Bonus CS:GO Mini-Game Feature Section */}
        <section id="cs-game" className="py-16 border-b border-zinc-800/80 bg-zinc-950/40">
          <div className="max-w-6xl mx-auto px-6">
            <div className="flex items-center justify-between gap-4 mb-8">
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
                Shooting Range
              </h2>

              <button
                onClick={() => setShowGameModal(true)}
                className="px-4 py-2 border border-zinc-800 hover:border-zinc-700 bg-zinc-900 text-xs font-mono text-zinc-300 hover:text-white rounded-md transition-colors flex items-center gap-2 cursor-pointer"
              >
                <Maximize2 className="w-3.5 h-3.5" />
                <span>Fullscreen</span>
              </button>
            </div>

            {/* Embedded interactive game frame */}
            <CsgoMiniGame />
          </div>
        </section>

        {/* Contact Section */}
        <Contact />
      </main>

      {/* Footer */}
      <Footer onOpenGame={() => setShowGameModal(true)} />

      {/* Fullscreen CS:GO Mini-Game Modal */}
      {showGameModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/90 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-5xl">
            <button
              onClick={() => setShowGameModal(false)}
              aria-label="Close Shooting Range"
              className="absolute -top-11 right-0 p-2 text-zinc-400 hover:text-white transition-colors cursor-pointer flex items-center gap-1.5 font-mono text-xs"
            >
              <X className="w-4 h-4" />
              <span>Close Game</span>
            </button>
            <CsgoMiniGame onClose={() => setShowGameModal(false)} />
          </div>
        </div>
      )}
    </div>
  );
}
