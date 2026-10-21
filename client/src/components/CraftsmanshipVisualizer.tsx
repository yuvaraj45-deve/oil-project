import React, { useState } from 'react';
import { Sparkles, ArrowRight, CheckCircle2, ShieldCheck, Sun, Droplets, Award, Compass } from 'lucide-react';
import { CRAFT_STAGES_DATA } from '../data/oilData';
import { CraftStage } from '../types';

export const CraftsmanshipVisualizer: React.FC = () => {
  const [activeStep, setActiveStep] = useState(1);

  const currentStage: CraftStage =
    CRAFT_STAGES_DATA.find((s) => s.step === activeStep) || CRAFT_STAGES_DATA[0];

  return (
    <section className="py-16 sm:py-24 bg-forest-950 text-cream-100 relative overflow-hidden">
      {/* Decorative Golden Ambient Glows */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 -ml-40 w-96 h-96 rounded-full bg-gold-500/10 blur-3xl pointer-events-none" />
      <div className="absolute top-10 right-10 w-80 h-80 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-forest-900 border border-gold-500/30 text-gold-300 text-xs font-bold uppercase tracking-widest mb-3">
            <Compass className="w-3.5 h-3.5 text-gold-400" />
            <span>The Sacred Mill Journey</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-black text-white tracking-tight">
            The Mara Chekku Experience
          </h2>
          <p className="mt-3 text-stone-300 text-base sm:text-lg font-light leading-relaxed">
            Click through our 5 generational milestones to discover how raw village seeds transform into liquid gold without artificial heat or chemicals.
          </p>
          <div className="w-16 h-1 bg-gold-500 mx-auto mt-4 rounded-full" />
        </div>

        {/* Step Navigation Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 sm:gap-3 mb-10">
          {CRAFT_STAGES_DATA.map((stage) => {
            const isActive = stage.step === activeStep;
            return (
              <button
                key={stage.step}
                onClick={() => setActiveStep(stage.step)}
                className={`p-3.5 rounded-2xl text-left transition-all duration-300 border flex flex-col justify-between cursor-pointer ${
                  isActive
                    ? 'bg-forest-900 border-gold-400 shadow-lg scale-102 ring-1 ring-gold-400'
                    : 'bg-forest-900/40 border-forest-800/80 hover:bg-forest-900/70 text-stone-400'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span
                    className={`text-xs font-bold font-mono px-2 py-0.5 rounded ${
                      isActive ? 'bg-gold-500 text-forest-950' : 'bg-forest-800 text-stone-400'
                    }`}
                  >
                    0{stage.step}
                  </span>
                  {isActive && (
                    <span className="w-2 h-2 rounded-full bg-gold-400 animate-ping" />
                  )}
                </div>
                <div>
                  <h4
                    className={`text-xs font-bold truncate ${
                      isActive ? 'text-white' : 'text-stone-300'
                    }`}
                  >
                    {stage.title}
                  </h4>
                  <span className="text-[10px] text-stone-400 block truncate mt-0.5">
                    {stage.traditionalName.split(' ')[0]}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Active Stage Interactive Showcase Card */}
        <div className="bg-forest-900/80 rounded-3xl border border-forest-800 p-6 sm:p-10 shadow-2xl backdrop-blur-md">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* Left: Stage Visual */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-2xl overflow-hidden border border-forest-700/80 h-72 sm:h-96 bg-forest-950 group">
                <img
                  key={currentStage.step}
                  src={currentStage.image}
                  alt={currentStage.title}
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 animate-fadeIn"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-forest-950 via-forest-950/20 to-transparent" />

                {/* Metric Badge Overlay */}
                <div className="absolute bottom-4 left-4 right-4 bg-forest-950/90 backdrop-blur-md p-3.5 rounded-xl border border-gold-500/30 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-stone-400 block">
                      {currentStage.metricLabel}
                    </span>
                    <span className="text-base sm:text-lg font-bold font-serif text-gold-400">
                      {currentStage.metricValue}
                    </span>
                  </div>
                  <div className="p-2 rounded-lg bg-forest-900 text-gold-400">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Stage Detail & Narrative */}
            <div className="lg:col-span-7 space-y-5">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-widest text-gold-400 bg-forest-950 px-3 py-1 rounded-full border border-forest-800">
                  Step 0{currentStage.step} of 05
                </span>
                <span className="text-xs text-stone-400 font-serif italic">
                  {currentStage.traditionalName}
                </span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-serif font-black text-white tracking-tight">
                {currentStage.title}
              </h3>

              <div className="p-3.5 rounded-xl bg-forest-950/60 border border-forest-800 text-xs font-semibold text-gold-300">
                ✨ {currentStage.tagline}
              </div>

              <p className="text-stone-300 text-sm sm:text-base leading-relaxed font-light">
                {currentStage.description}
              </p>

              {/* Progress control buttons */}
              <div className="pt-4 border-t border-forest-800 flex items-center justify-between">
                <button
                  disabled={activeStep === 1}
                  onClick={() => setActiveStep(Math.max(1, activeStep - 1))}
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-forest-950 hover:bg-forest-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  ← Previous Step
                </button>

                <div className="flex items-center gap-1.5">
                  {CRAFT_STAGES_DATA.map((s) => (
                    <span
                      key={s.step}
                      className={`h-1.5 rounded-full transition-all duration-300 ${
                        s.step === activeStep ? 'w-6 bg-gold-400' : 'w-2 bg-forest-700'
                      }`}
                    />
                  ))}
                </div>

                <button
                  disabled={activeStep === CRAFT_STAGES_DATA.length}
                  onClick={() => setActiveStep(Math.min(CRAFT_STAGES_DATA.length, activeStep + 1))}
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-gold-500 text-forest-950 hover:bg-gold-400 disabled:opacity-40 disabled:cursor-not-allowed transition-colors font-bold"
                >
                  Next Step →
                </button>
              </div>

            </div>

          </div>
        </div>

      </div>
    </section>
  );
};
