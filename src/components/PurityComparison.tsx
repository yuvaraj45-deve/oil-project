import React, { useState } from 'react';
import { ShieldCheck, XCircle, CheckCircle2, Sparkles, AlertTriangle, ArrowRight } from 'lucide-react';

export const PurityComparison: React.FC = () => {
  const comparisonRows = [
    {
      feature: 'Extraction Temperature',
      refined: 'Subjected to 200°C – 240°C thermal steam cracking',
      ssoil: 'Natural room temperature crushing (Always below 42°C)',
      refinedStatus: 'bad',
      ssoilStatus: 'good',
    },
    {
      feature: 'Chemical Solvents Used',
      refined: 'Hexane petroleum solvent used to maximize factory yield',
      ssoil: 'Zero chemical solvents. 100% mechanical wood pressure',
      refinedStatus: 'bad',
      ssoilStatus: 'good',
    },
    {
      feature: 'Bleaching & Clarification',
      refined: 'Sulfuric acid wash, caustic soda neutralization & silica clay',
      ssoil: '5 Days natural solar sunlight sedimentation',
      refinedStatus: 'bad',
      ssoilStatus: 'good',
    },
    {
      feature: 'Natural Vitamin E & Tocopherols',
      refined: 'Completely stripped by high heat and vacuum deodorization',
      ssoil: '100% retained natural antioxidants & plant phytosterols',
      refinedStatus: 'bad',
      ssoilStatus: 'good',
    },
    {
      feature: 'Anti-Foaming Additives',
      refined: 'Synthetic chemicals (e.g. Dimethylpolysiloxane / E900)',
      ssoil: 'Zero anti-foaming agents or synthetic preservatives',
      refinedStatus: 'bad',
      ssoilStatus: 'good',
    },
    {
      feature: 'Culinary Aroma & Taste',
      refined: 'Deodorized, flat, neutral, and chemical blandness',
      ssoil: 'Authentic roasted seed fragrance that fills your home',
      refinedStatus: 'bad',
      ssoilStatus: 'good',
    },
  ];

  return (
    <section className="py-16 sm:py-24 bg-cream-200/50 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs font-bold text-gold-700 uppercase tracking-widest bg-gold-100 border border-gold-300 px-3 py-1 rounded-full">
            The Purity Truth
          </span>
          <h2 className="text-3xl sm:text-4xl font-serif font-black text-forest-950 mt-3 tracking-tight">
            Commercial Refined Oil vs SS OIL Mara Chekku
          </h2>
          <p className="mt-3 text-stone-600 text-base sm:text-lg">
            Understand what goes into your family's daily cooking oil before you buy.
          </p>
          <div className="w-16 h-1 bg-gold-500 mx-auto mt-4 rounded-full" />
        </div>

        {/* Comparison Matrix Table */}
        <div className="max-w-4xl mx-auto rounded-3xl bg-white border border-cream-300 shadow-card overflow-hidden">
          
          {/* Table Header Columns */}
          <div className="grid grid-cols-12 bg-forest-950 text-white p-4 sm:p-6 items-center text-xs sm:text-sm font-bold border-b border-forest-900">
            <div className="col-span-4 sm:col-span-4 uppercase tracking-wider text-stone-400 text-[11px]">
              Critical Quality Standard
            </div>
            <div className="col-span-4 sm:col-span-4 text-center text-rose-300 flex items-center justify-center gap-1.5">
              <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>Commercial Refined</span>
            </div>
            <div className="col-span-4 sm:col-span-4 text-center text-gold-300 flex items-center justify-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span className="font-serif font-black tracking-wide text-white">SS OIL Wood-Pressed</span>
            </div>
          </div>

          {/* Comparison Rows */}
          <div className="divide-y divide-cream-200 text-xs sm:text-sm">
            {comparisonRows.map((row, idx) => (
              <div
                key={row.feature}
                className={`grid grid-cols-12 p-4 sm:p-5 items-center transition-colors ${
                  idx % 2 === 0 ? 'bg-cream-50/60' : 'bg-white'
                }`}
              >
                {/* Feature Label */}
                <div className="col-span-4 sm:col-span-4 font-bold text-forest-950 pr-2">
                  {row.feature}
                </div>

                {/* Refined Oil Column */}
                <div className="col-span-4 sm:col-span-4 text-center text-stone-600 px-2 flex flex-col items-center">
                  <span className="text-[11px] text-rose-700 font-semibold mb-1 flex items-center gap-1">
                    <XCircle className="w-3 h-3 shrink-0" /> Harmful Standard
                  </span>
                  <span className="text-stone-500 text-[11px] sm:text-xs leading-snug">
                    {row.refined}
                  </span>
                </div>

                {/* SS OIL Column */}
                <div className="col-span-4 sm:col-span-4 text-center px-2 flex flex-col items-center bg-gold-50/50 py-2 rounded-xl">
                  <span className="text-[11px] text-emerald-800 font-bold mb-1 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" /> 100% Purity
                  </span>
                  <span className="text-forest-900 font-medium text-[11px] sm:text-xs leading-snug">
                    {row.ssoil}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Footer Callout */}
          <div className="p-4 sm:p-6 bg-forest-900 text-cream-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-gold-400 shrink-0" />
              <span>
                <strong>Zero Compromises:</strong> Our wooden churns never exceed body temperature, keeping all essential fatty acids intact.
              </span>
            </div>
            <a
              href="#products"
              className="px-4 py-2 rounded-xl bg-gold-500 text-forest-950 font-bold text-xs hover:bg-gold-400 transition-colors shrink-0"
            >
              Shop 100% Mara Chekku
            </a>
          </div>

        </div>

      </div>
    </section>
  );
};
