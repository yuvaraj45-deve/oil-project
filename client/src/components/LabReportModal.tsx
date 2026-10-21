import React from 'react';
import { X, ShieldCheck, Award, FileText, CheckCircle2, Download, Printer } from 'lucide-react';
import { LabReport } from '../types';

interface LabReportModalProps {
  report: LabReport | null;
  productName: string;
  onClose: () => void;
}

export const LabReportModal: React.FC<LabReportModalProps> = ({
  report,
  productName,
  onClose,
}) => {
  if (!report) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="min-h-screen px-4 text-center flex items-center justify-center p-4">
        <div className="inline-block w-full max-w-2xl my-8 text-left align-middle transition-all transform bg-white rounded-3xl shadow-2xl overflow-hidden relative border border-gold-300">
          
          {/* Certificate Header Banner */}
          <div className="bg-forest-950 text-cream-100 p-6 sm:p-8 relative border-b border-gold-500/30">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-full bg-forest-900 hover:bg-forest-800 text-stone-300 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-full bg-gold-500 text-forest-950 flex items-center justify-center font-bold">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold tracking-widest text-gold-400 bg-forest-900 px-2 py-0.5 rounded">
                  Certificate of Purity & Analysis
                </span>
                <h3 className="font-serif text-xl sm:text-2xl font-bold text-white mt-0.5">
                  SS OIL Quality Assurance Laboratory
                </h3>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between text-xs text-cream-200/80 pt-2 border-t border-forest-800/80 gap-2">
              <span>Product: <strong>{productName}</strong></span>
              <span>Batch ID: <strong className="text-gold-300 font-mono">{report.batchNumber}</strong></span>
              <span>Test Date: <strong>{report.testedDate}</strong></span>
            </div>
          </div>

          {/* Certificate Body */}
          <div className="p-6 sm:p-8 space-y-6 bg-cream-50/50">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-forest-900 flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-gold-600" />
                  Gas Chromatography & Purity Parameters
                </span>
                <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> All Standards Passed
                </span>
              </div>

              {/* Lab Parameters Table */}
              <div className="rounded-2xl border border-cream-300 bg-white overflow-hidden shadow-xs">
                <table className="w-full text-xs text-left">
                  <thead className="bg-cream-100/80 border-b border-cream-200 text-stone-600 font-semibold uppercase tracking-wider text-[10px]">
                    <tr>
                      <th className="py-2.5 px-4">Chemical Parameter</th>
                      <th className="py-2.5 px-4">Observed Result</th>
                      <th className="py-2.5 px-4">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-cream-200 text-stone-700 font-medium">
                    <tr>
                      <td className="py-2.5 px-4">Acid Value (FFA)</td>
                      <td className="py-2.5 px-4 font-mono font-semibold">{report.acidValue}</td>
                      <td className="py-2.5 px-4 text-emerald-700 font-bold">✓ PASS</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 px-4">Peroxide Value</td>
                      <td className="py-2.5 px-4 font-mono font-semibold">{report.peroxideValue}</td>
                      <td className="py-2.5 px-4 text-emerald-700 font-bold">✓ PASS</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 px-4">Hexane Chemical Solvents</td>
                      <td className="py-2.5 px-4 font-mono font-semibold text-forest-900">{report.hexaneResidue}</td>
                      <td className="py-2.5 px-4 text-emerald-700 font-bold">✓ ZERO RESIDUE</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 px-4">Free Fatty Acids</td>
                      <td className="py-2.5 px-4 font-mono font-semibold">{report.freeFattyAcids}</td>
                      <td className="py-2.5 px-4 text-emerald-700 font-bold">✓ EXTRA VIRGIN</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 px-4">Iodine Value</td>
                      <td className="py-2.5 px-4 font-mono font-semibold">{report.iodineValue}</td>
                      <td className="py-2.5 px-4 text-emerald-700 font-bold">✓ GENUINE</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 px-4">Natural Vitamin E (Tocopherols)</td>
                      <td className="py-2.5 px-4 font-mono font-semibold text-gold-700">{report.tocopherolVitaminE}</td>
                      <td className="py-2.5 px-4 text-emerald-700 font-bold">✓ RETAINED</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Seals and Disclaimers */}
            <div className="p-4 rounded-2xl bg-cream-100 border border-cream-300 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <Award className="w-8 h-8 text-gold-500 shrink-0" />
                <div className="text-xs">
                  <span className="font-bold text-forest-950 block">Certified Unadulterated</span>
                  <span className="text-stone-500">{report.certification} • Zero Mineral Oil or Animal Fats</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => alert(`Certificate for ${report.batchNumber} downloaded (sample mode).`)}
                  className="px-3.5 py-1.5 rounded-xl bg-forest-900 text-cream-100 text-xs font-semibold hover:bg-forest-800 transition-colors flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download PDF</span>
                </button>
              </div>
            </div>

          </div>

          <div className="p-4 bg-cream-100 border-t border-cream-200 text-center text-[11px] text-stone-500">
            Testing conducted at accredited NABL / FSSAI standards laboratory. Batch verified safe for direct human consumption.
          </div>

        </div>
      </div>
    </div>
  );
};
