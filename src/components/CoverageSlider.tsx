import React from "react";
import { Coverage } from "../types";
import { 
  Heart, 
  Accessibility, 
  HelpCircle,
  Sparkles,
  RefreshCw
} from "lucide-react";

interface CoverageSliderProps {
  coverage: Coverage;
  onChange: (id: string, value: number) => void;
  onShowDetails: (coverage: Coverage) => void;
  ageMultiplier: number;
  key?: React.Key;
}

export default function CoverageSlider({ coverage, onChange, onShowDetails, ageMultiplier }: CoverageSliderProps) {
  const getIcon = () => {
    switch (coverage.icon) {
      case "Heart":
        return <Heart className="h-5 w-5 text-rose-500" />;
      case "Accessibility":
        return <Accessibility className="h-5 w-5 text-aspeb-orange" />;
      default:
        return <Heart className="h-5 w-5 text-zinc-500" />;
    }
  };

  const formatCurrency = (val: number): string => {
    if (val === 0) return "Não Contratado";
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
      maximumFractionDigits: 0
    }).format(val);
  };

  const calculateCost = () => {
    const units = coverage.value / coverage.unitSize;
    const rawCost = units * coverage.baseRatePerUnit;
    return Number((rawCost * ageMultiplier).toFixed(2));
  };

  return (
    <div 
      className="p-5 bg-white border border-zinc-200/80 rounded-2xl transition hover:shadow-md duration-200"
      id={`coverage-card-${coverage.id}`}
    >
      {/* Header Info */}
      <div className="flex items-start justify-between gap-4 mb-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-zinc-50 rounded-xl border border-zinc-150 shadow-sm flex items-center justify-center shrink-0">
            {getIcon()}
          </div>
          <div>
            <h3 className="font-bold text-sm text-zinc-900 flex items-center gap-1.5 font-sans">
              {coverage.name}
              {coverage.recommendedValue > 0 && coverage.value === coverage.recommendedValue && (
                <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-orange-100 text-aspeb-orange">
                  <Sparkles className="h-2.5 w-2.5" /> Ideal
                </span>
              )}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onShowDetails(coverage);
                }}
                className="w-6 h-6 rounded-full flex items-center justify-center bg-zinc-150 hover:bg-orange-100 text-zinc-500 hover:text-aspeb-orange transition cursor-pointer shrink-0 shadow-sm"
                title="Mais detalhes"
                aria-label="Saber mais detalhes"
              >
                <HelpCircle className="h-4 w-4 stroke-[2.5]" />
              </button>
            </h3>
            <p className="text-xs text-zinc-500 mt-0.5 line-clamp-1">
              {coverage.shortDescription}
            </p>
          </div>
        </div>

        {/* Cost Tag */}
        <div className="text-right shrink-0">
          <span className="text-xs text-zinc-400 block font-semibold uppercase tracking-wider">
            Mensalidade
          </span>
          <span className="text-base font-extrabold text-zinc-900 font-mono">
            {calculateCost() === 0 ? "Grátis" : `R$ ${calculateCost().toFixed(2).replace(".", ",")}`}
          </span>
        </div>
      </div>

      {/* Expanded Description Toggle / Hover */}
      <p className="text-[11px] text-zinc-400 bg-zinc-50/50 p-2.5 rounded-lg border border-zinc-100 mb-4 font-sans leading-relaxed">
        {coverage.description}
      </p>

      {/* Slider Value Indicator */}
      <div className="flex justify-between items-baseline mb-1">
        <span className="text-xs text-zinc-400 font-semibold uppercase">
          Capital Contratado
        </span>
        <span className="text-lg font-black text-aspeb-orange font-mono">
          {formatCurrency(coverage.value)}
        </span>
      </div>

      {/* HTML5 Range Slider */}
      <div className="relative mt-2" id={`slider-wrapper-${coverage.id}`}>
        <input
          type="range"
          min={coverage.min}
          max={coverage.max}
          step={coverage.step}
          value={coverage.value}
          onChange={(e) => onChange(coverage.id, parseInt(e.target.value))}
          className="w-full h-2 bg-zinc-200 rounded-lg appearance-none cursor-pointer accent-aspeb-orange"
          id={`range-${coverage.id}`}
        />
        
        {/* Recommended Marker */}
        {coverage.recommendedValue > 0 && (
          <div 
            className="absolute -top-1.5 h-5 w-1 bg-aspeb-orange rounded-full"
            style={{ 
              left: `${(coverage.recommendedValue / coverage.max) * 100}%`,
              transform: "translateX(-50%)"
            }}
            title={`Valor sugerido: ${formatCurrency(coverage.recommendedValue)}`}
          />
        )}
      </div>

      {/* Custom Slider Footer Tools */}
      <div className="flex items-center justify-between mt-3 text-[10px] text-zinc-400">
        <span className="font-mono">{formatCurrency(coverage.min)}</span>
        
        {/* Quick Recommendation Alignment Badge */}
        {coverage.recommendedValue > 0 && (
          <button
            onClick={() => onChange(coverage.id, coverage.recommendedValue)}
            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md border text-[10px] font-semibold transition cursor-pointer ${
              coverage.value === coverage.recommendedValue
                ? "bg-zinc-200 border-transparent text-zinc-700 font-bold"
                : "bg-white border-zinc-200 text-aspeb-orange hover:bg-orange-50"
            }`}
            id={`btn-reset-recommendation-${coverage.id}`}
            title="Ajustar cobertura para o valor sugerido"
          >
            <RefreshCw className="h-2.5 w-2.5" />
            Sugerido: {formatCurrency(coverage.recommendedValue)}
          </button>
        )}
        
        <span className="font-mono">{formatCurrency(coverage.max)}</span>
      </div>
    </div>
  );
}
