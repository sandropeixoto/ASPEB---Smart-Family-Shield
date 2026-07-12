import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  User, 
  Calendar, 
  Briefcase, 
  ShieldAlert, 
  Sparkles, 
  ArrowRight, 
  ChevronLeft,
  Users,
  Clock,
  Heart,
  FileText
} from "lucide-react";
import { UserProfile } from "../types";

interface OnboardingProps {
  onComplete: (profile: UserProfile) => void;
  isDarkMode: boolean;
}

export default function Onboarding({ onComplete, isDarkMode }: OnboardingProps) {
  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [age, setAge] = useState<number>(35);
  const [profession, setProfession] = useState("");
  const [concern, setConcern] = useState("");

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      onComplete({
        name: name.trim() || "Protetor Familiar",
        age,
        profession,
        concern
      });
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const isNextDisabled = () => {
    if (step === 1) return !name.trim() || !age || age < 18 || age > 85;
    if (step === 2) return !profession;
    if (step === 3) return !concern;
    return false;
  };

  // Pre-configured options with beautiful icons and descriptions
  const professions = [
    {
      id: "autonomo",
      title: "Autônomo / Profissional Liberal",
      description: "Sem holerite fixo, depende 100% da própria capacidade de trabalhar.",
      icon: Clock,
      color: "from-orange-500 to-amber-500"
    },
    {
      id: "clt",
      title: "CLT / Empresa Privada",
      description: "Funcionário registrado, busca proteção extra além dos benefícios básicos.",
      icon: Briefcase,
      color: "from-emerald-500 to-teal-500"
    },
    {
      id: "servidor",
      title: "Servidor Público",
      description: "Estabilidade garantida, prioriza planejamento financeiro e sucessão.",
      icon: Users,
      color: "from-blue-500 to-indigo-500"
    },
    {
      id: "empresario",
      title: "Empresário / Sócio de Empresa",
      description: "Pró-labore variável, busca alta proteção corporativa e liquidez.",
      icon: FileText,
      color: "from-purple-500 to-pink-500"
    }
  ];

  const concerns = [
    {
      id: "incapacidade",
      title: "Incapacidade Temporária",
      description: "Ficar sem trabalhar devido a um acidente ou cirurgia e perder renda diária.",
      icon: ShieldAlert,
      color: "text-red-500 bg-red-50"
    },
    {
      id: "familia",
      title: "Segurança da Família",
      description: "Garantir o sustento dos meus filhos e companheiro(a) na minha ausência.",
      icon: Heart,
      color: "text-rose-500 bg-rose-50"
    },
    {
      id: "doencas",
      title: "Custos de Saúde (Doenças)",
      description: "Cobrir tratamentos caros e remédios de alta complexidade (Câncer, Infarto, etc).",
      icon: Sparkles,
      color: "text-amber-500 bg-amber-50"
    },
    {
      id: "beneficios",
      title: "Vantagens e Economia Diária",
      description: "Usar consultas médicas online e economizar de verdade no iFood, Uber e Farmácias.",
      icon: Sparkles,
      color: "text-emerald-500 bg-emerald-50"
    }
  ];

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
            id="onboarding-step-1"
          >
            <div className="space-y-2">
              <h2 className="text-2xl font-bold tracking-tight text-zinc-900 font-sans">
                Olá! Vamos começar com o básico 👋
              </h2>
              <p className="text-sm text-zinc-500">
                Precisamos do seu nome e idade para estimar os cálculos atuariais do plano ideal.
              </p>
            </div>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-600 uppercase tracking-wider block">
                  Como quer ser chamado?
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-zinc-400">
                    <User className="h-5 w-5" />
                  </span>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ex: João da Silva"
                    className="w-full pl-10 pr-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-aspeb-orange/50 focus:border-aspeb-orange transition text-zinc-900"
                    required
                    id="input-name"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-semibold text-zinc-600 uppercase tracking-wider">
                    Qual sua idade atual?
                  </label>
                  <span className="text-lg font-bold text-aspeb-orange font-mono">
                    {age} anos
                  </span>
                </div>
                <div className="relative flex items-center space-x-4 py-2">
                  <span className="text-xs text-zinc-400 font-mono">18</span>
                  <input
                    type="range"
                    min="18"
                    max="80"
                    value={age}
                    onChange={(e) => setAge(parseInt(e.target.value))}
                    className="flex-1 h-2 bg-zinc-200 rounded-lg appearance-none cursor-pointer accent-aspeb-orange"
                    id="slider-age"
                  />
                  <span className="text-xs text-zinc-400 font-mono">80</span>
                </div>
                <p className="text-xs text-zinc-400 text-right italic">
                  *Aceitamos contratação entre 18 e 80 anos.
                </p>
              </div>
            </div>
          </motion.div>
        );

      case 2:
        return (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
            id="onboarding-step-2"
          >
            <div className="space-y-2">
              <h2 className="text-2xl font-bold tracking-tight text-zinc-900 font-sans">
                Selecione sua ocupação atual 💼
              </h2>
              <p className="text-sm text-zinc-500">
                A profissão determina riscos específicos. Por exemplo, profissionais liberais necessitam de proteção contra afastamento médico temporário (DIT).
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {professions.map((prof) => {
                const Icon = prof.icon;
                const isSelected = profession === prof.id;
                return (
                  <button
                    key={prof.id}
                    onClick={() => setProfession(prof.id)}
                    className={`flex flex-col text-left p-4 rounded-xl border-2 transition duration-200 cursor-pointer ${
                      isSelected
                        ? "border-aspeb-orange bg-aspeb-orange/5"
                        : "border-zinc-200 hover:border-zinc-300 bg-white"
                    }`}
                    id={`btn-profession-${prof.id}`}
                  >
                    <div className={`p-2 rounded-lg bg-gradient-to-br ${prof.color} text-white mb-3 w-10 h-10 flex items-center justify-center`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <span className="font-semibold text-sm text-zinc-900">
                      {prof.title}
                    </span>
                    <span className="text-xs text-zinc-400 mt-1 line-clamp-2">
                      {prof.description}
                    </span>
                  </button>
                );
              })}
            </div>
          </motion.div>
        );

      case 3:
        return (
          <motion.div
            key="step3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
            id="onboarding-step-3"
          >
            <div className="space-y-2">
              <h2 className="text-2xl font-bold tracking-tight text-zinc-900 font-sans">
                Qual sua maior preocupação hoje? 🛡️
              </h2>
              <p className="text-sm text-zinc-500">
                Nosso algoritmo inteligente usará isso para desenhar suas coberturas iniciais recomendadas.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-3">
              {concerns.map((con) => {
                const Icon = con.icon;
                const isSelected = concern === con.id;
                return (
                  <button
                    key={con.id}
                    onClick={() => setConcern(con.id)}
                    className={`flex items-start text-left p-4 rounded-xl border-2 transition duration-200 cursor-pointer ${
                      isSelected
                        ? "border-aspeb-orange bg-aspeb-orange/5"
                        : "border-zinc-200 hover:border-zinc-300 bg-white"
                    }`}
                    id={`btn-concern-${con.id}`}
                  >
                    <div className={`p-3 rounded-xl mr-4 shrink-0 ${con.color}`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <div>
                      <span className="font-semibold text-sm text-zinc-900 block">
                        {con.title}
                      </span>
                      <span className="text-xs text-zinc-500 mt-1 block">
                        {con.description}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-xl mx-auto" id="onboarding-container">
      {/* Visual Header / Brand Signature */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-50 text-aspeb-orange text-xs font-semibold uppercase tracking-wider mb-3 animate-pulse">
          <Sparkles className="h-3 w-3" />
          Simulador Oficial ASPEB
        </div>
        <h1 className="text-3xl font-extrabold text-zinc-900 tracking-tight font-sans">
          Proteção Familiar Inteligente
        </h1>
        <p className="text-sm text-zinc-500 mt-1">
          Simule coberturas ideais e ative um clube de benefícios real
        </p>
      </div>

      {/* Main card */}
      <div className="bg-white border border-zinc-200 rounded-3xl shadow-xl overflow-hidden p-6 md:p-8 relative">
        
        {/* Step indicators */}
        <div className="flex items-center gap-2 mb-6" id="onboarding-steps-indicator">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`h-2 rounded-full transition-all duration-300 ${
                s === step
                  ? "w-8 bg-aspeb-orange"
                  : s < step
                  ? "w-2 bg-aspeb-orange/30"
                  : "w-2 bg-zinc-200"
              }`}
            />
          ))}
          <span className="ml-auto text-xs font-semibold text-zinc-400 uppercase tracking-widest">
            Passo {step} de 3
          </span>
        </div>

        {/* Dynamic content rendering */}
        <div className="min-h-[300px]">
          <AnimatePresence mode="wait">
            {renderStep()}
          </AnimatePresence>
        </div>

        {/* Footer actions */}
        <div className="flex items-center justify-between border-t border-zinc-100 pt-6 mt-8">
          {step > 1 ? (
            <button
              onClick={handleBack}
              className="flex items-center text-sm font-semibold text-zinc-600 hover:text-zinc-900 transition cursor-pointer"
              id="btn-onboarding-back"
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Voltar
            </button>
          ) : (
            <div />
          )}

          <button
            onClick={handleNext}
            disabled={isNextDisabled()}
            className={`flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-bold shadow-lg transition duration-200 cursor-pointer ${
              isNextDisabled()
                ? "bg-zinc-100 text-zinc-400 cursor-not-allowed shadow-none"
                : "bg-aspeb-orange hover:bg-aspeb-orange-hover text-white shadow-orange-500/10"
            }`}
            id="btn-onboarding-next"
          >
            {step === 3 ? "Simular Meu Plano" : "Avançar"}
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
