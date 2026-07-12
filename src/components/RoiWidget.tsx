import React from "react";
import { Coverage, Benefit } from "../types";
import { 
  Sparkles, 
  HelpCircle, 
  ChevronRight, 
  TrendingUp, 
  Percent, 
  CheckCircle,
  PiggyBank
} from "lucide-react";

interface RoiWidgetProps {
  coverages: Coverage[];
  benefits: Benefit[];
  ageMultiplier: number;
  onCheckout: () => void;
}

export default function RoiWidget({ coverages, benefits, ageMultiplier, onCheckout }: RoiWidgetProps) {
  // 1. Calculate insurance cost
  const totalInsuranceCost = coverages.reduce((sum, coverage) => {
    const units = coverage.value / coverage.unitSize;
    const rawCost = units * coverage.baseRatePerUnit;
    return sum + (rawCost * ageMultiplier);
  }, 0);

  // 2. Calculate selected benefits cost
  const selectedBenefits = benefits.filter(b => b.isSelected);
  const totalBenefitsCost = selectedBenefits.reduce((sum, b) => sum + b.cost, 0);

  // 3. Total monthly premium (cost)
  const totalCost = totalInsuranceCost + totalBenefitsCost;

  // 4. Calculate estimated savings
  const totalSavings = selectedBenefits.reduce((sum, b) => sum + b.estimatedSavings, 0);

  // 5. Net balance
  const netSavings = totalSavings - totalCost;
  const isSelfPaying = netSavings > 0;

  // 6. Leverage index: how many R$ returned for each R$ spent
  const returnPerReaisSpent = totalCost > 0 ? (totalSavings / totalCost) : 0;

  const formatCurrency = (val: number): string => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL"
    }).format(val);
  };

  return (
    <div 
      className="bg-white border border-zinc-200/80 rounded-3xl p-6 shadow-lg space-y-6 sticky top-6"
      id="roi-widget-container"
    >
      {/* Widget Header */}
      <div className="flex items-center justify-between border-b border-zinc-100 pb-4">
        <div>
          <h3 className="font-extrabold text-base text-zinc-900 font-sans">
            Resumo Financeiro e ROI
          </h3>
          <p className="text-xs text-zinc-400 mt-0.5">
            Demonstração do custo-benefício real do plano
          </p>
        </div>
        <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
          <PiggyBank className="h-5 w-5" />
        </div>
      </div>

      {/* Main Stats Display */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-zinc-50 p-3.5 rounded-xl border border-zinc-100">
          <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider block">
            Mensalidade Total
          </span>
          <span className="text-lg font-black text-zinc-900 font-mono block mt-1">
            {formatCurrency(totalCost)}
          </span>
          <span className="text-[9px] text-zinc-400 mt-1 block">
            Seguro + Clube
          </span>
        </div>

        <div className="bg-emerald-500/5 p-3.5 rounded-xl border border-emerald-500/10">
          <span className="text-[10px] text-emerald-600 font-bold uppercase tracking-wider block">
            Economia Estimada
          </span>
          <span className="text-lg font-black text-emerald-600 font-mono block mt-1">
            {formatCurrency(totalSavings)}
          </span>
          <span className="text-[9px] text-emerald-500/70 mt-1 block font-medium">
            Com as Vantagens do Clube
          </span>
        </div>
      </div>

      {/* Interactive ROI Visual Bar */}
      <div className="space-y-2">
        <div className="flex justify-between text-xs font-semibold">
          <span className="text-zinc-500">Relação Custo vs Economia</span>
          <span className={`font-mono font-bold ${isSelfPaying ? "text-emerald-600" : "text-amber-500"}`}>
            {isSelfPaying ? "Plano se Paga Sozinho!" : `${Math.round((totalSavings / (totalCost || 1)) * 100)}% de Retorno`}
          </span>
        </div>
        
        {/* Dynamic bar */}
        <div className="h-3.5 bg-zinc-100 rounded-full overflow-hidden flex p-0.5">
          {totalCost > 0 || totalSavings > 0 ? (
            <>
              <div 
                className="h-full rounded-full bg-aspeb-orange transition-all duration-300"
                style={{ width: `${Math.min(100, (totalCost / (totalCost + totalSavings || 1)) * 100)}%` }}
                title={`Custo: ${formatCurrency(totalCost)}`}
              />
              <div 
                className="h-full rounded-full bg-emerald-500 transition-all duration-300 ml-0.5 flex-1"
                style={{ width: `${Math.min(100, (totalSavings / (totalCost + totalSavings || 1)) * 100)}%` }}
                title={`Economia: ${formatCurrency(totalSavings)}`}
              />
            </>
          ) : (
            <div className="w-full h-full bg-zinc-200 rounded-full" />
          )}
        </div>

        <div className="flex justify-between text-[9px] text-zinc-400 font-medium">
          <span className="flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-aspeb-orange inline-block" /> Mensalidade
          </span>
          <span className="flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-emerald-500 inline-block" /> Economia do Clube
          </span>
        </div>
      </div>

      {/* ROI ROI ROI Explainer Card */}
      <div className={`p-4 rounded-2xl border-2 transition duration-200 ${
        isSelfPaying 
          ? "bg-emerald-500/5 border-emerald-500/20" 
          : "bg-aspeb-orange/5 border-aspeb-orange/20"
      }`}>
        <div className="flex gap-3">
          <div className={`p-2 rounded-xl shrink-0 h-10 w-10 flex items-center justify-center ${
            isSelfPaying ? "bg-emerald-100 text-emerald-600" : "bg-orange-100 text-aspeb-orange"
          }`}>
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <h4 className="font-extrabold text-xs text-zinc-900 uppercase tracking-wider">
              {isSelfPaying ? "O seu plano sai de graça!" : "Excelente Custo-Benefício!"}
            </h4>
            
            <p className="text-xs text-zinc-600 mt-1 leading-relaxed font-sans">
              {isSelfPaying ? (
                <>
                  Ao aproveitar <strong>{formatCurrency(totalSavings)}</strong> em benefícios, sua mensalidade de <strong>{formatCurrency(totalCost)}</strong> é totalmente absorvida pela economia real obtida.
                </>
              ) : (
                <>
                  Seu plano custa <strong>{formatCurrency(totalCost)}</strong>, mas as vantagens ativadas economizam <strong>{formatCurrency(totalSavings)}</strong> em exames e consultas que você faria de qualquer forma. Seu custo real residual é baixíssimo!
                </>
              )}
            </p>

            {returnPerReaisSpent > 0 && (
              <div className="mt-3 inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white border border-zinc-100 text-[10px] font-bold text-zinc-800">
                <TrendingUp className="h-3 w-3 text-emerald-500" />
                Retorno: R$ {returnPerReaisSpent.toFixed(1)} economizados para cada R$ 1 investido
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Selected list summary helper */}
      <div className="border-t border-zinc-100 pt-4 space-y-2">
        <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider block">
          Benefícios & Coberturas Ativas
        </span>
        <div className="max-h-[140px] overflow-y-auto space-y-1.5 pr-1 font-sans text-xs scrollbar-thin">
          {coverages.map((c) => {
            if (c.value === 0) return null;
            return (
              <div key={c.id} className="flex justify-between text-zinc-600">
                <span className="flex items-center gap-1 truncate">
                  <span className="h-1.5 w-1.5 rounded-full bg-aspeb-orange" /> {c.name}
                </span>
                <span className="font-semibold font-mono text-zinc-900 shrink-0">
                  {formatCurrency(c.value)}
                </span>
              </div>
            );
          })}
          {selectedBenefits.map((b) => (
            <div key={b.id} className="flex justify-between text-emerald-600">
              <span className="flex items-center gap-1 truncate">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> + {b.title}
              </span>
              <span className="font-semibold shrink-0">Ativo</span>
            </div>
          ))}
          {coverages.every(c => c.value === 0) && selectedBenefits.length === 0 && (
            <p className="text-[11px] text-zinc-400 italic">Nenhuma cobertura ou benefício selecionado ainda.</p>
          )}
        </div>
      </div>

      {/* Submit Action Button */}
      <button
        onClick={onCheckout}
        disabled={totalCost === 0}
        className={`w-full py-4 px-6 rounded-2xl text-sm font-black uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg transition duration-200 cursor-pointer ${
          totalCost === 0
            ? "bg-zinc-100 text-zinc-400 cursor-not-allowed shadow-none"
            : "bg-aspeb-orange hover:bg-aspeb-orange-hover text-white shadow-orange-500/20 hover:scale-[1.01]"
        }`}
        id="btn-roi-submit-checkout"
      >
        Solicitar Ativação
        <ChevronRight className="h-4.5 w-4.5" />
      </button>

      <p className="text-[10px] text-center text-zinc-400 italic">
        *Contratação fácil com suporte humano via WhatsApp. Sem carências ocultas.
      </p>
    </div>
  );
}
