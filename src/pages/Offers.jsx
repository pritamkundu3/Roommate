import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Tag, Copy, Check, ArrowRight, Sparkles } from 'lucide-react';
import { OFFERS } from '../data/hotels';

export default function Offers() {
  const [copiedCode, setCopiedCode] = useState('');

  const handleCopy = (code) => {
    navigator.clipboard?.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(''), 1800);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-navy text-white rounded-2xl px-6 py-7 mb-7 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-accent uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            Curated Deals
          </span>
          <h1 className="font-display font-bold text-2xl sm:text-3xl mt-1">
            Exclusive Offers & Promo Codes
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1">
            Copy any promo code below and apply it at checkout for instant savings.
          </p>
        </div>
        <Link
          to="/hotels"
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg bg-accent hover:bg-accent-hover text-white text-xs sm:text-sm font-semibold shrink-0"
        >
          Browse Hotels
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {OFFERS.map((offer) => {
          const isCopied = copiedCode === offer.code;
          return (
            <div
              key={offer.code}
              className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="px-2.5 py-0.5 rounded-full bg-accent-light text-accent text-[11px] font-bold">
                    {offer.badge}
                  </span>
                  <span className="text-[11px] text-slate-400">
                    Valid till {offer.validTill}
                  </span>
                </div>

                <h2 className="font-display font-bold text-lg text-navy">
                  {offer.title}
                </h2>
                <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                  {offer.description}
                </p>

                <div className="mt-4 text-[11px] text-slate-500 space-y-1">
                  <p>• Min. booking subtotal: ₹{offer.minAmount.toLocaleString('en-IN')}</p>
                  <p>• Max discount: ₹{offer.maxDiscount.toLocaleString('en-IN')}</p>
                </div>
              </div>

              <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between gap-2">
                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 border border-dashed border-slate-300 font-mono text-xs font-bold text-navy">
                  <Tag className="w-3.5 h-3.5 text-accent" />
                  {offer.code}
                </div>

                <button
                  type="button"
                  onClick={() => handleCopy(offer.code)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-navy hover:bg-navy-700 text-white text-xs font-semibold transition-colors"
                >
                  {isCopied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      Copied
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      Copy Code
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
