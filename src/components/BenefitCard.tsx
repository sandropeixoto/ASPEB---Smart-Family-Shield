import React from "react";
import { Benefit } from "../types";
import { 
  Activity, 
  Pill, 
  PlusCircle, 
  ShieldAlert, 
  Award, 
  Smartphone,
  Phone,
  CheckCircle2, 
  Plus,
  ArrowUpRight,
  HelpCircle
} from "lucide-react";

interface BenefitCardProps {
  benefit: Benefit;
  onToggle: (id: string) => void;
  onShowDetails: (benefit: Benefit) => void;
  key?: React.Key;
}

export default function BenefitCard({ benefit, onToggle, onShowDetails }: BenefitCardProps) {
  const getIcon = () => {
    switch (benefit.icon) {
      case "Activity":
        return <Activity className="h-5 w-5" />;
      case "Pills":
        return <Pill className="h-5 w-5" />;
      case "PlusCircle":
        return <PlusCircle className="h-5 w-5" />;
      case "ShieldAlert":
        return <ShieldAlert className="h-5 w-5" />;
      case "Award":
        return <Award className="h-5 w-5" />;
      case "Smartphone":
        return <Smartphone className="h-5 w-5" />;
      case "Phone":
        return <Phone className="h-5 w-5" />;
      default:
        return <Activity className="h-5 w-5" />;
    }
  };

  const getTagColor = () => {
    switch (benefit.tag) {
      case "Saúde":
        return "bg-rose-50 text-rose-600 border-rose-100";
      case "Economia":
        return "bg-emerald-50 text-emerald-600 border-emerald-100";
      case "Segurança":
        return "bg-blue-50 text-blue-600 border-blue-100";
      case "Prêmios":
        return "bg-amber-50 text-amber-600 border-amber-100";
      case "Tecnologia":
        return "bg-purple-50 text-purple-600 border-purple-100";
      default:
        return "bg-zinc-50 text-zinc-600 border-zinc-100";
    }
  };

  return (
    <div
      onClick={() => onToggle(benefit.id)}
      className={`p-4 rounded-2xl border-2 transition duration-200 cursor-pointer relative flex flex-col justify-between ${
        benefit.isSelected
          ? "border-aspeb-orange bg-aspeb-orange/5 shadow-sm"
          : "border-zinc-200 hover:border-zinc-300 bg-white"
      }`}
      id={`benefit-card-${benefit.id}`}
    >
      <div>
        {/* Top Header Row with tags & toggle */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex gap-1.5 items-center">
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getTagColor()}`}>
              {benefit.tag}
            </span>
            <span className="text-[10px] text-zinc-400 font-medium">
              {benefit.provider}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Mais detalhes */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onShowDetails(benefit);
              }}
              className="w-7 h-7 rounded-full flex items-center justify-center bg-zinc-150 hover:bg-orange-100 text-zinc-500 hover:text-aspeb-orange transition cursor-pointer shadow-sm"
              title="Mais detalhes"
              aria-label="Saber mais detalhes"
            >
              <HelpCircle className="h-4.5 w-4.5 stroke-[2.5]" />
            </button>

            <div
              className={`w-6 h-6 rounded-full flex items-center justify-center transition ${
                benefit.isSelected
                  ? "bg-aspeb-orange text-white"
                  : "border-2 border-zinc-200 text-zinc-300"
              }`}
            >
              {benefit.isSelected ? (
                <CheckCircle2 className="h-5 w-5" />
              ) : (
                <Plus className="h-4 w-4" />
              )}
            </div>
          </div>
        </div>

        {/* Title & Icon */}
        <div className="flex items-center gap-2.5 mb-2">
          <div className={`p-2 rounded-lg ${
            benefit.isSelected 
              ? "bg-aspeb-orange/10 text-aspeb-orange" 
              : "bg-zinc-100 text-zinc-500"
          }`}>
            {getIcon()}
          </div>
          <h4 className="font-bold text-sm text-zinc-900 font-sans">
            {benefit.title}
          </h4>
        </div>

        {/* Description */}
        <p className="text-xs text-zinc-500 leading-relaxed font-sans line-clamp-3">
          {benefit.description}
        </p>
      </div>

      {/* Footer Values / Economic Highlight */}
      <div className="mt-4 pt-3 border-t border-zinc-100 flex items-center justify-between">
        <div>
          <span className="text-[10px] text-zinc-400 block uppercase font-semibold">
            Custo Mensal
          </span>
          <span className="text-xs font-bold text-zinc-700 font-mono">
            {benefit.cost === 0 ? "Incluso" : `+ R$ ${benefit.cost.toFixed(2).replace(".", ",")}`}
          </span>
        </div>

        <div className="text-right">
          <span className="text-[10px] text-emerald-600 font-bold uppercase flex items-center justify-end gap-0.5">
            Economia Estimada <ArrowUpRight className="h-3 w-3" />
          </span>
          <span className="text-sm font-black text-emerald-600 font-mono">
            R$ {benefit.estimatedSavings.toFixed(2).replace(".", ",")}
          </span>
        </div>
      </div>

      {/* Active Label Overlay */}
      {benefit.isSelected && (
        <span className="absolute -top-2.5 -right-1 flex h-4 w-4">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-4 w-4 bg-aspeb-orange"></span>
        </span>
      )}
    </div>
  );
}
