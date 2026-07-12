import React, { useState, useEffect } from "react";
import { SimulationResult } from "../types";
import { 
  FolderOpen, 
  Trash2, 
  Play, 
  Calendar, 
  Sparkles, 
  Coins, 
  Heart,
  PlusCircle,
  PiggyBank
} from "lucide-react";

interface PastSimulationsProps {
  currentQuote: {
    totalCost: number;
    totalSavings: number;
    coverages: { [id: string]: number };
    benefits: string[];
  };
  profile: any;
  onLoadSimulation: (sim: SimulationResult) => void;
}

export default function PastSimulations({ currentQuote, profile, onLoadSimulation }: PastSimulationsProps) {
  const [savedQuotes, setSavedQuotes] = useState<SimulationResult[]>([]);
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    loadQuotes();
  }, []);

  const loadQuotes = () => {
    const raw = localStorage.getItem("nano_saved_quotes");
    if (raw) {
      try {
        setSavedQuotes(JSON.parse(raw));
      } catch (e) {
        console.error("Error loading quotes", e);
      }
    }
  };

  const handleSaveCurrent = () => {
    if (!profile) return;
    
    const newQuote: SimulationResult = {
      id: "QUO-" + Math.floor(Math.random() * 90000 + 10000),
      date: new Date().toLocaleDateString("pt-BR"),
      profile,
      coverages: currentQuote.coverages,
      benefits: currentQuote.benefits,
      totalPremium: currentQuote.totalCost - currentQuote.benefits.length * 10, // approximate split
      totalBenefitsCost: currentQuote.benefits.length * 10,
      totalSavings: currentQuote.totalSavings,
      netCost: currentQuote.totalCost,
      paymentMethod: "pix"
    };

    const updated = [newQuote, ...savedQuotes].slice(0, 5); // Limit to last 5
    localStorage.setItem("nano_saved_quotes", JSON.stringify(updated));
    setSavedQuotes(updated);
    
    setSuccessMsg("Simulação salva com sucesso!");
    setTimeout(() => setSuccessMsg(""), 3000);
  };

  const handleDeleteQuote = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = savedQuotes.filter(q => q.id !== id);
    localStorage.setItem("nano_saved_quotes", JSON.stringify(updated));
    setSavedQuotes(updated);
  };

  const formatCurrency = (val: number): string => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL"
    }).format(val);
  };

  return (
    <div className="bg-white border border-zinc-200/80 rounded-3xl p-6 shadow-lg space-y-4" id="past-simulations-container">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FolderOpen className="h-5 w-5 text-aspeb-orange" />
          <h3 className="font-extrabold text-sm text-zinc-900 uppercase tracking-wider font-sans">
            Minhas Simulações Salvas
          </h3>
        </div>

        <button
          onClick={handleSaveCurrent}
          disabled={!profile}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
            !profile 
              ? "bg-zinc-100 text-zinc-400 cursor-not-allowed" 
              : "bg-aspeb-orange hover:bg-aspeb-orange-hover text-white shadow-sm"
          }`}
          id="btn-save-current-simulation"
        >
          <PlusCircle className="h-3.5 w-3.5" /> Salvar Atual
        </button>
      </div>

      {successMsg && (
        <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 text-xs font-bold rounded-lg text-center">
          {successMsg}
        </div>
      )}

      {savedQuotes.length === 0 ? (
        <div className="text-center py-6 border-2 border-dashed border-zinc-150 rounded-2xl">
          <Calendar className="h-8 w-8 text-zinc-350 mx-auto mb-2" />
          <p className="text-xs text-zinc-400 font-medium">
            Nenhuma simulação anterior salva localmente.
          </p>
          <p className="text-[10px] text-zinc-450 mt-1 italic max-w-[240px] mx-auto leading-relaxed">
            Clique em "Salvar Atual" para guardar seu plano ativo neste navegador.
          </p>
        </div>
      ) : (
        <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1 scrollbar-thin">
          {savedQuotes.map((sim) => (
            <div
              key={sim.id}
              onClick={() => onLoadSimulation(sim)}
              className="p-3.5 bg-zinc-50 hover:bg-orange-50/40 border border-zinc-100 rounded-xl flex items-center justify-between gap-4 transition duration-150 cursor-pointer group"
              id={`saved-quote-item-${sim.id}`}
            >
              <div className="space-y-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-xs text-zinc-900 truncate">
                    {sim.profile.name} ({sim.profile.age} anos)
                  </span>
                  <span className="text-[9px] font-mono text-zinc-400 bg-white border border-zinc-200 px-1 py-0.2 rounded font-bold shrink-0">
                    {sim.id}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-[10px] text-zinc-400">
                  <span className="flex items-center gap-1">
                    <Coins className="h-3.5 w-3.5" /> {formatCurrency(sim.netCost)}/mês
                  </span>
                  <span className="flex items-center gap-1 font-semibold text-emerald-600">
                    <PiggyBank className="h-3.5 w-3.5" /> + {formatCurrency(sim.totalSavings)} economia
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1 shrink-0">
                <button
                  className="p-1.5 rounded-lg bg-white border border-zinc-250 text-aspeb-orange hover:bg-orange-50 transition opacity-80 group-hover:opacity-100"
                  title="Recarregar esta simulação"
                >
                  <Play className="h-3 w-3 fill-current" />
                </button>
                <button
                  onClick={(e) => handleDeleteQuote(sim.id, e)}
                  className="p-1.5 rounded-lg bg-white border border-zinc-250 text-red-500 hover:bg-red-50 transition opacity-80 group-hover:opacity-100"
                  title="Apagar simulação"
                >
                  <Trash2 className="h-3 w-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
