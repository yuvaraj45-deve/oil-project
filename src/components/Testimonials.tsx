import React from 'react';
import { Star, Quote, CheckCircle, Heart } from 'lucide-react';
import { TESTIMONIALS_DATA } from '../data/oilData';

export const Testimonials: React.FC = () => {
  return (
    <section className="py-16 sm:py-24 bg-cream-200/60 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold-100 border border-gold-300 text-gold-800 text-xs font-bold uppercase tracking-wider mb-3">
            <Heart className="w-3.5 h-3.5 text-gold-600 fill-gold-600" />
            <span>Real Kitchen Stories</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-forest-950 tracking-tight">
            Customer Testimonials
          </h2>
          <div className="flex items-center justify-center gap-2 mt-2">
            <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-stone-200 text-stone-700">
              Sample Feedback Data
            </span>
          </div>
          <p className="mt-3 text-stone-600 text-base sm:text-lg">
            See how SS OIL is bringing authentic village taste and wellness back to everyday homes.
          </p>
          <div className="w-16 h-1 bg-gold-500 mx-auto mt-4 rounded-full" />
        </div>

        {/* 3 Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {TESTIMONIALS_DATA.map((t) => (
            <div
              key={t.id}
              className="bg-white rounded-3xl p-8 border border-cream-300/80 shadow-soft hover:shadow-card hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between relative group"
            >
              {/* Quote icon background decoration */}
              <div className="absolute top-6 right-6 text-cream-300 group-hover:text-gold-200 transition-colors">
                <Quote className="w-10 h-10 opacity-60" />
              </div>

              <div>
                {/* Star rating */}
                <div className="flex items-center gap-1 text-amber-400 mb-4">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400" />
                  ))}
                  <span className="text-xs font-bold text-stone-500 ml-1">5.0</span>
                </div>

                {/* Comment quote */}
                <p className="text-stone-700 text-sm sm:text-base leading-relaxed italic relative z-10">
                  "{t.comment}"
                </p>
              </div>

              {/* Author Info */}
              <div className="pt-6 mt-6 border-t border-cream-200">
                <div className="flex items-center gap-3.5">
                  <img
                    src={t.avatar}
                    alt={t.author}
                    className="w-12 h-12 rounded-full object-cover border-2 border-gold-400/60 shadow-xs"
                  />
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h4 className="font-serif font-bold text-forest-950 text-base">
                        {t.author}
                      </h4>
                      {t.verified && (
                        <CheckCircle className="w-4 h-4 text-emerald-600 fill-emerald-100" />
                      )}
                    </div>
                    <p className="text-xs text-stone-500">{t.role} • {t.location}</p>
                    <p className="text-[11px] text-forest-700 font-medium mt-0.5">
                      Bought: {t.productPurchased}
                    </p>
                  </div>
                </div>
              </div>

            </div>
          ))}
        </div>

        {/* Aggregate Ratings Callout */}
        <div className="mt-12 bg-white/80 backdrop-blur-xs rounded-2xl p-4 sm:p-6 border border-cream-300 max-w-xl mx-auto flex items-center justify-around text-center">
          <div>
            <div className="text-2xl sm:text-3xl font-serif font-bold text-forest-900">4.9/5</div>
            <div className="text-xs text-stone-500">Overall Rating (Sample)</div>
          </div>
          <div className="h-8 w-px bg-cream-300" />
          <div>
            <div className="text-2xl sm:text-3xl font-serif font-bold text-forest-900">98.4%</div>
            <div className="text-xs text-stone-500">Would Recommend</div>
          </div>
          <div className="h-8 w-px bg-cream-300" />
          <div>
            <div className="text-2xl sm:text-3xl font-serif font-bold text-forest-900">100%</div>
            <div className="text-xs text-stone-500">Purity Guarantee</div>
          </div>
        </div>

      </div>
    </section>
  );
};
