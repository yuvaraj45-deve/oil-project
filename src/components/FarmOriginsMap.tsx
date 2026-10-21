import React from 'react';
import { MapPin, ShieldCheck, Heart, Sparkles, Leaf, Award } from 'lucide-react';

export const FarmOriginsMap: React.FC = () => {
  const farmRegions = [
    {
      region: 'Salem & Saurashtra',
      tamil: 'சேலம் & சௌராஷ்டிரா',
      crop: 'Native Sun-Dried Groundnuts',
      benefit: 'Drought-tolerant hardy red-soil peanuts with 48% natural healthy fats',
      icon: '🥜',
      farmers: '450+ Farmer Families',
    },
    {
      region: 'Erode & Thanjavur',
      tamil: 'ஈரோடு & தஞ்சாவூர்',
      crop: 'Black Sesame (Karuppu Ellu)',
      benefit: 'Naturally dried in delta breezes; rich in natural sesamol & calcium',
      icon: '🌿',
      farmers: '320+ Farmer Families',
    },
    {
      region: 'Pollachi & Anaimalai',
      tamil: 'பொள்ளாச்சி & ஆனைமலை',
      crop: 'Sulphur-Free Coconut Copra',
      benefit: 'Sun-cured on high coastal drying platforms; zero chemical sulfur fumigation',
      icon: '🥥',
      farmers: '280+ Farmer Families',
    },
    {
      region: 'Tirunelveli & Udangudi',
      tamil: 'திருநெல்வேலி & உடன்குடி',
      crop: 'Pure Palm Jaggery (Karupatti)',
      benefit: 'Simmered over firewood in village cauldrons to tame sesame bitterness',
      icon: '🍯',
      farmers: '180+ Tapper Artisans',
    },
  ];

  return (
    <section className="py-16 sm:py-24 bg-forest-950 text-cream-100 relative overflow-hidden">
      {/* Background Subtle Watermark */}
      <div className="absolute inset-0 bg-[radial-gradient(#144E3C_1px,transparent_1px)] [background-size:28px_28px] opacity-25 pointer-events-none" />
      <div className="absolute top-0 right-0 -mr-24 -mt-24 w-96 h-96 rounded-full bg-gold-500/10 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-forest-900 border border-gold-500/30 text-gold-300 text-xs font-bold uppercase tracking-widest mb-3">
            <Leaf className="w-3.5 h-3.5 text-gold-400" />
            <span>Single-Origin Farm Direct</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-black text-white tracking-tight">
            Rooted in Village Soil
          </h2>
          <p className="mt-3 text-stone-300 text-base sm:text-lg font-light leading-relaxed">
            We bypass industrial commodity brokers and work directly with organic farmer cooperatives across Tamil Nadu and western drylands.
          </p>
          <div className="w-16 h-1 bg-gold-500 mx-auto mt-4 rounded-full" />
        </div>

        {/* 4 Farm Region Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {farmRegions.map((farm) => (
            <div
              key={farm.region}
              className="bg-forest-900/80 rounded-3xl p-6 border border-forest-800 shadow-xl hover:border-gold-400 transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-3xl p-2 rounded-2xl bg-forest-950 border border-forest-800 group-hover:scale-110 transition-transform">
                    {farm.icon}
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-gold-400 bg-forest-950 px-2 py-0.5 rounded border border-forest-800">
                    Direct Origin
                  </span>
                </div>

                <div className="flex items-center gap-1.5 text-xs font-serif italic text-gold-300 mb-1">
                  <MapPin className="w-3.5 h-3.5 text-gold-400" />
                  <span>{farm.tamil}</span>
                </div>

                <h3 className="font-serif text-xl font-bold text-white group-hover:text-gold-300 transition-colors">
                  {farm.region}
                </h3>

                <div className="text-xs font-bold text-cream-200 mt-2 mb-1">
                  {farm.crop}
                </div>

                <p className="text-stone-300 text-xs leading-relaxed font-light mt-1">
                  {farm.benefit}
                </p>
              </div>

              <div className="pt-4 mt-5 border-t border-forest-800 flex items-center justify-between text-xs text-stone-400">
                <span className="flex items-center gap-1">
                  <Heart className="w-3.5 h-3.5 text-rose-400" />
                  <span>{farm.farmers}</span>
                </span>
                <span className="text-emerald-400 font-semibold">Fair Trade</span>
              </div>
            </div>
          ))}
        </div>

        {/* Farmer Fair Trade Pledge Ribbon */}
        <div className="mt-12 p-6 rounded-3xl bg-forest-900/60 border border-forest-800 max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-300">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gold-500 text-forest-950 flex items-center justify-center shrink-0 font-bold">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-white block text-sm">
                100% Traceability & Fair Remuneration Pledge
              </span>
              <span>
                Farmers are paid a 25% premium above APMC market mandi rates for pesticide-free, mature harvest batches.
              </span>
            </div>
          </div>

          <a
            href="#about"
            className="px-5 py-2.5 rounded-xl bg-forest-950 hover:bg-forest-800 text-gold-300 border border-forest-700 font-bold whitespace-nowrap transition-colors"
          >
            Learn About Our Story
          </a>
        </div>

      </div>
    </section>
  );
};
