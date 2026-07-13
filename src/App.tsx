import React, { useState, useEffect } from "react";
import { motion, AnimatePresence, useScroll, useTransform, useSpring } from "motion/react";
import { 
  Heart,
  Phone,
  Shield,
  ArrowRight,
  ArrowUp,
  ChevronDown,
  Award,
  Activity,
  Check,
  CheckCircle2,
  MapPin,
  Sparkles,
  Smartphone,
  Download,
  RotateCcw,
  Menu,
  X,
  PiggyBank,
  Percent,
  Star,
  Users,
  Accessibility,
  Pill,
  PlusCircle,
  ShieldAlert,
  Info
} from "lucide-react";

import { UserProfile, Coverage, Benefit, SimulationResult } from "./types";
import { 
  INITIAL_COVERAGES, 
  INITIAL_BENEFITS, 
  getRecommendations, 
  getAgeMultiplier 
} from "./data/insuranceData";

import Onboarding from "./components/Onboarding";
import CoverageSlider from "./components/CoverageSlider";
import BenefitCard from "./components/BenefitCard";
import RoiWidget from "./components/RoiWidget";
import CheckoutModal from "./components/CheckoutModal";
import PastSimulations from "./components/PastSimulations";
import ScrollReveal from "./components/ScrollReveal";

export default function App() {
  // Framer Motion scroll hooks for scroll progress and parallax
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  const { scrollY } = useScroll();
  const heroParallaxY = useTransform(scrollY, [0, 600], [0, 50]);
  const heroOpacity = useTransform(scrollY, [0, 600], [1, 0.85]);

  // Global States
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [coverages, setCoverages] = useState<Coverage[]>([]);
  const [benefits, setBenefits] = useState<Benefit[]>([]);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState<boolean>(false);
  const [lastCheckoutResult, setLastCheckoutResult] = useState<SimulationResult | null>(null);
  const [detailsItem, setDetailsItem] = useState<{
    type: "coverage" | "benefit";
    id: string;
    title: string;
    description: string;
    icon: string;
    tag?: string;
    provider?: string;
    cost?: number;
    estimatedSavings?: number;
    min?: number;
    max?: number;
  } | null>(null);
  
  // Navigation & Interactive UI States
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [showBackToTop, setShowBackToTop] = useState<boolean>(false);

  // Monitor scroll for Back to Top visibility
  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 500);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  // Initialize coverages and benefits silently
  useEffect(() => {
    // If not onboarded yet, keep empty or initialize templates
    setCoverages(INITIAL_COVERAGES.map(c => ({ ...c, value: 0 })));
    setBenefits(INITIAL_BENEFITS.map(b => ({ ...b, isSelected: false })));
  }, []);

  // Onboarding completion -> load recommendations
  const handleOnboardingComplete = (userProfile: UserProfile) => {
    setProfile(userProfile);
    
    // Calculate recommendations based on profile
    const recs = getRecommendations(userProfile);

    // Map coverages with values & recommendedValues
    const mappedCoverages = INITIAL_COVERAGES.map((covTemplate) => {
      const recValue = recs.coverages[covTemplate.id] ?? 0;
      return {
        ...covTemplate,
        value: recValue,
        recommendedValue: recValue
      } as Coverage;
    });

    // Map benefits with preselected status
    const mappedBenefits = INITIAL_BENEFITS.map((b) => ({
      ...b,
      isSelected: recs.preselectedBenefits.includes(b.id)
    }));

    setCoverages(mappedCoverages);
    setBenefits(mappedBenefits);
    
    // Smooth scroll to simulator options
    setTimeout(() => {
      document.getElementById("simulator-sandbox")?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const handleShowCoverageDetails = (cov: Coverage) => {
    setDetailsItem({
      type: "coverage",
      id: cov.id,
      title: cov.name,
      description: cov.description,
      icon: cov.icon,
      min: cov.min,
      max: cov.max
    });
  };

  const handleShowBenefitDetails = (b: Benefit) => {
    setDetailsItem({
      type: "benefit",
      id: b.id,
      title: b.title,
      description: b.description,
      icon: b.icon,
      tag: b.tag,
      provider: b.provider,
      cost: b.cost,
      estimatedSavings: b.estimatedSavings
    });
  };

  // Live recalculations for sliders
  const handleCoverageChange = (id: string, newValue: number) => {
    setCoverages((prev) =>
      prev.map((c) => (c.id === id ? { ...c, value: newValue } : c))
    );
  };

  // Live recalculations for benefits cards
  const handleBenefitToggle = (id: string) => {
    setBenefits((prev) =>
      prev.map((b) => (b.id === id ? { ...b, isSelected: !b.isSelected } : b))
    );
  };

  // Reset entire simulator to onboarding screen
  const handleReset = () => {
    if (window.confirm("Deseja realmente iniciar uma nova simulação e redefinir o perfil?")) {
      setProfile(null);
      setCoverages(INITIAL_COVERAGES.map(c => ({ ...c, value: 0 })));
      setBenefits(INITIAL_BENEFITS.map(b => ({ ...b, isSelected: false })));
      setLastCheckoutResult(null);
      document.getElementById("simulador-secao")?.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Load a previously saved quote simulation
  const handleLoadSavedSimulation = (sim: SimulationResult) => {
    setProfile(sim.profile);
    
    const recs = getRecommendations(sim.profile);

    const loadedCoverages = INITIAL_COVERAGES.map((covTemplate) => {
      const savedVal = sim.coverages[covTemplate.id] ?? 0;
      const recVal = recs.coverages[covTemplate.id] ?? 0;
      return {
        ...covTemplate,
        value: savedVal,
        recommendedValue: recVal
      } as Coverage;
    });

    const loadedBenefits = INITIAL_BENEFITS.map((b) => ({
      ...b,
      isSelected: sim.benefits.includes(b.id)
    }));

    setCoverages(loadedCoverages);
    setBenefits(loadedBenefits);
    setLastCheckoutResult(null);
    
    setTimeout(() => {
      document.getElementById("simulator-sandbox")?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  // Checkout success handler
  const handleCheckoutSuccess = (result: SimulationResult) => {
    setLastCheckoutResult(result);
  };

  // Smooth scroll helper
  const scrollToId = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setIsMenuOpen(false);
  };

  // Helper variables for ROI summary
  const ageMultiplier = profile ? getAgeMultiplier(profile.age) : 1.0;
  
  const totalInsuranceCost = coverages.reduce((sum, coverage) => {
    const units = coverage.value / coverage.unitSize;
    const rawCost = units * coverage.baseRatePerUnit;
    return sum + (rawCost * ageMultiplier);
  }, 0);

  const selectedBenefits = benefits.filter(b => b.isSelected);
  const totalBenefitsCost = selectedBenefits.reduce((sum, b) => sum + b.cost, 0);
  const totalCost = totalInsuranceCost + totalBenefitsCost;
  const totalSavings = selectedBenefits.reduce((sum, b) => sum + b.estimatedSavings, 0);

  // For PastSimulations dynamic updates
  const currentQuoteData = {
    totalCost,
    totalSavings,
    coverages: coverages.reduce((acc, c) => ({ ...acc, [c.id]: c.value }), {}),
    benefits: selectedBenefits.map(b => b.id)
  };

  // FAQs Array
  const faqs = [
    {
      q: "O plano tem carência?",
      a: "Não para o clube de benefícios e descontos de saúde! Você pode usar as consultas e exames logo após a ativação. Para coberturas específicas de seguro de vida, consulte as condições simples da apólice."
    },
    {
      q: "Como funciona o desconto nas consultas?",
      a: "Basta apresentar sua carteira digital no aplicativo ASPEB ou agendar diretamente nas clínicas conveniadas para obter o valor exclusivo de associado."
    },
    {
      q: "Posso incluir dependentes?",
      a: "Sim! O titular pode adicionar cônjuge, filhos e outros dependentes sob condições especiais para estender a proteção familiar e as vantagens de saúde."
    },
    {
      q: "Como são realizados os sorteios?",
      a: "Os sorteios de R$ 20 mil são realizados no último sábado de cada mês com base na extração da Loteria Federal."
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-zinc-900 font-sans antialiased selection:bg-orange-500 selection:text-white">
      
      {/* Scroll Progress Indicator Bar */}
      <motion.div 
        className="fixed top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 z-50 origin-left shadow-sm"
        style={{ scaleX }}
        id="scroll-progress-bar"
      />

      {/* HEADER / NAVIGATION */}
      <header className="border-b border-zinc-200/80 bg-white/90 backdrop-blur-md sticky top-0 z-40 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          
          {/* Logo Brand Signature */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <img 
              src="https://www.aspeb.com.br/wp-content/uploads/2025/11/ASPEB-MARCA-1990.png" 
              alt="ASPEB Benefícios" 
              className="h-10 sm:h-12 w-auto object-contain"
            />
          </div>

          {/* Desktop Navigation Link Menu */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-zinc-600">
            <button onClick={() => scrollToId("inicio")} className="hover:text-aspeb-orange transition">Início</button>
            <button onClick={() => scrollToId("saude")} className="hover:text-aspeb-orange transition">Rede Saúde</button>
            <button onClick={() => scrollToId("beneficios")} className="hover:text-aspeb-orange transition">Clube de Vantagens</button>
            <button onClick={() => scrollToId("simulador-secao")} className="hover:text-aspeb-orange transition">Simulador</button>
            <button onClick={() => scrollToId("faq")} className="hover:text-aspeb-orange transition">FAQ</button>
          </nav>

          {/* Header Right Actions */}
          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={() => scrollToId("simulador-secao")}
              className="px-5 py-2.5 bg-aspeb-orange hover:bg-aspeb-orange-hover text-white text-xs font-black uppercase tracking-wider rounded-xl transition shadow-md shadow-orange-500/10 cursor-pointer"
            >
              Simular Meu Plano
            </button>
          </div>

          {/* Mobile Menu Icon Toggle */}
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-xl text-zinc-600 hover:bg-zinc-100 transition"
            aria-label="Abrir Menu"
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation Drawer */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t border-zinc-100 bg-white overflow-hidden"
            >
              <div className="px-4 py-4 space-y-3 flex flex-col text-sm font-bold text-zinc-700">
                <button onClick={() => scrollToId("inicio")} className="text-left py-2 hover:text-aspeb-orange transition">Início</button>
                <button onClick={() => scrollToId("saude")} className="text-left py-2 hover:text-aspeb-orange transition">Rede Saúde</button>
                <button onClick={() => scrollToId("beneficios")} className="text-left py-2 hover:text-aspeb-orange transition">Clube de Vantagens</button>
                <button onClick={() => scrollToId("simulador-secao")} className="text-left py-2 hover:text-aspeb-orange transition">Simulador</button>
                <button onClick={() => scrollToId("faq")} className="text-left py-2 hover:text-aspeb-orange transition">FAQ</button>
                
                <button
                  onClick={() => scrollToId("simulador-secao")}
                  className="w-full text-center py-3 bg-aspeb-orange text-white rounded-xl text-xs font-black uppercase tracking-wider transition shadow-md"
                >
                  Simular Agora
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* SECTION 1: HERO SECTION */}
      <section id="inicio" className="relative bg-gradient-to-b from-white via-orange-50/20 to-slate-50 py-16 md:py-24 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Hero Left Content */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-orange-100/80 text-aspeb-orange text-xs font-extrabold uppercase tracking-wider">
              <Sparkles className="h-4 w-4" /> Parceria de Saúde e Proteção Familiar
            </span>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-zinc-950 font-sans tracking-tight leading-tight">
              A tranquilidade que sua família merece, com <span className="text-aspeb-orange">benefícios reais</span> para hoje.
            </h1>
            
            <p className="text-base sm:text-lg text-zinc-600 font-sans max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              A ASPEB une o melhor clube de benefícios de saúde com a proteção financeira que sua família precisa. Simule e monte seu plano sob medida em apenas 1 minuto.
            </p>

            {/* Quick trust metrics checklist */}
            <div className="flex flex-wrap justify-center lg:justify-start gap-x-6 gap-y-2 text-sm font-semibold text-zinc-700 pt-2">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4.5 w-4.5 text-emerald-500 shrink-0" /> Consultas de R$ 35,00
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4.5 w-4.5 text-emerald-500 shrink-0" /> Sem carência de saúde
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4.5 w-4.5 text-emerald-500 shrink-0" /> Sorteios de R$ 20 mil
              </span>
            </div>

            {/* Dual CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4">
              <button
                onClick={() => scrollToId("simulador-secao")}
                className="w-full sm:w-auto px-8 py-4 bg-aspeb-orange hover:bg-aspeb-orange-hover text-white text-sm font-black uppercase tracking-wider rounded-2xl shadow-lg shadow-orange-500/20 transition hover:scale-[1.01] flex items-center justify-center gap-2 cursor-pointer"
              >
                Simular Meu Plano
                <ArrowRight className="h-4.5 w-4.5" />
              </button>
              
              <a
                href="https://wa.me/5591981119888"
                target="_blank"
                rel="noreferrer"
                className="w-full sm:w-auto px-8 py-4 bg-white border-2 border-zinc-200 hover:border-zinc-300 text-zinc-700 text-sm font-black uppercase tracking-wider rounded-2xl transition flex items-center justify-center gap-2"
              >
                <Phone className="h-4 w-4 text-emerald-500" />
                Falar com Consultor
              </a>
            </div>
          </div>

          {/* Hero Right Visual Showcase */}
          <div className="lg:col-span-5 relative flex justify-center">
            {/* Visual badge card stacked with subtle parallax */}
            <motion.div 
              style={{ y: heroParallaxY, opacity: heroOpacity }}
              className="relative w-full max-w-sm bg-white border border-zinc-200/80 rounded-3xl p-6 shadow-2xl space-y-6"
            >
              
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-orange-100 text-aspeb-orange rounded-2xl">
                  <Heart className="h-6 w-6" />
                </div>
                <div>
                  <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider block">Solução Especial</span>
                  <span className="font-extrabold text-base text-zinc-900 block font-sans">ASPEB Cuidado Ativo</span>
                </div>
              </div>

              <div className="space-y-3.5 border-t border-zinc-100 pt-4 text-xs text-zinc-600">
                <div className="flex justify-between items-center bg-zinc-50 p-3 rounded-xl border border-zinc-100/50">
                  <span className="font-semibold text-zinc-700">Clínica Matriz Belém</span>
                  <span className="font-bold text-aspeb-orange">Incluso</span>
                </div>
                <div className="flex justify-between items-center bg-zinc-50 p-3 rounded-xl border border-zinc-100/50">
                  <span className="font-semibold text-zinc-700">Consultas de Saúde</span>
                  <span className="font-black text-emerald-600">Apenas R$ 35,00</span>
                </div>
                <div className="flex justify-between items-center bg-zinc-50 p-3 rounded-xl border border-zinc-100/50">
                  <span className="font-semibold text-zinc-700">Sorteio Loteria Federal</span>
                  <span className="font-bold text-zinc-800">R$ 20.000,00/mês</span>
                </div>
              </div>

              {/* Action */}
              <button 
                onClick={() => scrollToId("simulador-secao")}
                className="w-full py-3 px-4 bg-zinc-900 hover:bg-zinc-800 text-white rounded-xl text-xs font-extrabold uppercase tracking-widest transition flex items-center justify-center gap-1.5"
              >
                Experimentar Simulador
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </motion.div>
            
            {/* Ambient background blur */}
            <div className="absolute -z-10 -bottom-10 right-10 h-72 w-72 bg-orange-400/10 rounded-full blur-3xl" />
          </div>

        </div>
      </section>

      {/* SECTION 2: PROVA SOCIAL & AUTORIDADE */}
      <section className="bg-white border-y border-zinc-100 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center divide-y sm:divide-y-0 sm:divide-x divide-zinc-100">
            
            <ScrollReveal className="py-4 sm:py-0" delay={0}>
              <span className="block text-4xl font-black text-aspeb-orange font-mono">
                +30 Anos
              </span>
              <span className="block text-sm font-extrabold text-zinc-900 mt-1 uppercase tracking-wider">
                De atuação sólida
              </span>
              <span className="block text-xs text-zinc-400 mt-1">
                Liderança no mercado da Região Norte
              </span>
            </ScrollReveal>

            <ScrollReveal className="py-6 sm:py-0" delay={0.15}>
              <span className="block text-4xl font-black text-aspeb-orange font-mono">
                +100 Mil
              </span>
              <span className="block text-sm font-extrabold text-zinc-900 mt-1 uppercase tracking-wider">
                Associados Protegidos
              </span>
              <span className="block text-xs text-zinc-400 mt-1">
                Famílias cuidadas com compromisso real
              </span>
            </ScrollReveal>

            <ScrollReveal className="py-4 sm:py-0" delay={0.3}>
              <span className="block text-4xl font-black text-aspeb-orange font-mono">
                100% Humano
              </span>
              <span className="block text-sm font-extrabold text-zinc-900 mt-1 uppercase tracking-wider">
                Sem Robôs ou Demoras
              </span>
              <span className="block text-xs text-zinc-400 mt-1">
                Atendimento rápido via WhatsApp e escritórios
              </span>
            </ScrollReveal>

          </div>
        </div>
      </section>

      {/* SECTION 3: DESTAQUE ESPECIAL - SAÚDE (O Maior Valor Percebido) */}
      <section id="saude" className="py-16 md:py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <ScrollReveal className="text-center max-w-3xl mx-auto space-y-3">
            <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 text-xs font-black uppercase tracking-widest">
              Cuidados Imediatos
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-zinc-950 font-sans tracking-tight">
              Saúde de qualidade sem pesar no seu bolso
            </h2>
            <p className="text-sm sm:text-base text-zinc-500 font-sans leading-relaxed">
              Diferente dos seguros tradicionais, a ASPEB oferece benefícios práticos que você usa desde o primeiro dia de adesão, sem carências para agendamentos.
            </p>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Card 1: Consultas R$ 35 */}
            <ScrollReveal className="flex" delay={0}>
              <div className="bg-white border border-zinc-200/60 p-8 rounded-3xl shadow-sm hover:shadow-md transition flex flex-col justify-between space-y-6 w-full">
                <div className="space-y-4">
                  <div className="h-12 w-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center font-bold">
                    <Activity className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-black text-zinc-950 font-sans">
                    Consultas Médicas de R$ 35,00
                  </h3>
                  <p className="text-xs text-zinc-500 leading-relaxed font-sans">
                    Acesse consultas de clínico geral e especialistas nas melhores clínicas conveniadas por um valor extremamente acessível de associado.
                  </p>
                </div>
                <div className="border-t border-zinc-100 pt-4 flex items-center justify-between text-xs font-bold text-zinc-800">
                  <span>Clínicas em Belém e Região</span>
                  <span className="text-emerald-600 font-mono">R$ 35,00 fixo</span>
                </div>
              </div>
            </ScrollReveal>

            {/* Card 2: Exames até 70% Off */}
            <ScrollReveal className="flex" delay={0.15}>
              <div className="bg-white border border-zinc-200/60 p-8 rounded-3xl shadow-sm hover:shadow-md transition flex flex-col justify-between space-y-6 w-full">
                <div className="space-y-4">
                  <div className="h-12 w-12 bg-orange-50 text-aspeb-orange rounded-2xl flex items-center justify-center font-bold">
                    <Percent className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-black text-zinc-950 font-sans">
                    Até 70% de Desconto em Exames
                  </h3>
                  <p className="text-xs text-zinc-500 leading-relaxed font-sans">
                    Economize significativamente em exames laboratoriais (sangue, urina) e exames de imagem nas redes credenciadas de alto padrão.
                  </p>
                </div>
                <div className="border-t border-zinc-100 pt-4 flex items-center justify-between text-xs font-bold text-zinc-800">
                  <span>Laboratórios renomados</span>
                  <span className="text-aspeb-orange font-mono">Até 70% Off</span>
                </div>
              </div>
            </ScrollReveal>

            {/* Card 3: Clínica Matriz Privilegiada */}
            <ScrollReveal className="flex" delay={0.3}>
              <div className="bg-white border border-zinc-200/60 p-8 rounded-3xl shadow-sm hover:shadow-md transition flex flex-col justify-between space-y-6 w-full">
                <div className="space-y-4">
                  <div className="h-12 w-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center font-bold">
                    <MapPin className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-black text-zinc-950 font-sans">
                    Clínica Matriz e Ampla Rede
                  </h3>
                  <p className="text-xs text-zinc-500 leading-relaxed font-sans">
                    Conte com nossa infraestrutura própria em Belém e uma rede que se estende por toda a região metropolitana para sua conveniência.
                  </p>
                </div>
                <div className="border-t border-zinc-100 pt-4 flex items-center justify-between text-xs font-bold text-zinc-800">
                  <span>Atendimento Facilitado</span>
                  <span className="text-blue-600">Localização Central</span>
                </div>
              </div>
            </ScrollReveal>

          </div>

          {/* Quick interactive quote trigger */}
          <ScrollReveal delay={0.1}>
            <div className="bg-gradient-to-r from-orange-500 to-amber-600 p-8 rounded-3xl text-white flex flex-col md:flex-row justify-between items-center gap-6 shadow-xl">
              <div className="space-y-1 text-center md:text-left">
                <h4 className="font-extrabold text-lg sm:text-xl font-sans">
                  Quer saber o quanto você economiza por mês na sua saúde?
                </h4>
                <p className="text-xs text-white/85">
                  Utilize nosso simulador interativo abaixo para calcular o retorno financeiro do clube.
                </p>
              </div>
              <button 
                onClick={() => scrollToId("simulador-secao")}
                className="px-6 py-3.5 bg-white text-aspeb-orange text-xs font-black uppercase tracking-wider rounded-xl hover:bg-zinc-50 transition shrink-0 shadow-lg cursor-pointer"
              >
                Iniciar Simulação
              </button>
            </div>
          </ScrollReveal>

        </div>
      </section>

      {/* SECTION 4: OS BENEFÍCIOS REAIS (O Clube de Vantagens) */}
      <section id="beneficios" className="py-16 md:py-24 bg-white border-b border-zinc-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          
          <ScrollReveal className="text-center max-w-3xl mx-auto space-y-3">
            <span className="px-3 py-1 rounded-full bg-orange-100 text-aspeb-orange text-xs font-black uppercase tracking-widest">
              Vantagens Integradas
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-zinc-950 font-sans tracking-tight">
              Os Benefícios do Clube ASPEB
            </h2>
            <p className="text-sm sm:text-base text-zinc-500 leading-relaxed font-sans">
              Mais do que proteção nas horas difíceis, trazemos facilidades e economias diárias para você, seu bolso e sua família inteira.
            </p>
          </ScrollReveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            
            {/* Benefit item 1 */}
            <ScrollReveal className="space-y-3 p-6 bg-slate-50 rounded-2xl border border-zinc-100" delay={0}>
              <div className="p-2.5 bg-white text-aspeb-orange rounded-xl inline-block shadow-sm">
                <Heart className="h-5 w-5" />
              </div>
              <h4 className="font-extrabold text-sm text-zinc-950">Descontos em Farmácias</h4>
              <p className="text-xs text-zinc-500 leading-relaxed">
                Até 60% de desconto em medicamentos de uso contínuo e genéricos na Drogasil, Extrafarma e Pague Menos.
              </p>
            </ScrollReveal>

            {/* Benefit item 2 */}
            <ScrollReveal className="space-y-3 p-6 bg-slate-50 rounded-2xl border border-zinc-100" delay={0.1}>
              <div className="p-2.5 bg-white text-aspeb-orange rounded-xl inline-block shadow-sm">
                <Award className="h-5 w-5" />
              </div>
              <h4 className="font-extrabold text-sm text-zinc-950">Sorteios Loteria Federal</h4>
              <p className="text-xs text-zinc-500 leading-relaxed">
                Concorra mensalmente a prêmios em dinheiro de até R$ 20.000,00 emitidos e liquidados pela Loteria Federal.
              </p>
            </ScrollReveal>

            {/* Benefit item 3 */}
            <ScrollReveal className="space-y-3 p-6 bg-slate-50 rounded-2xl border border-zinc-100" delay={0.2}>
              <div className="p-2.5 bg-white text-aspeb-orange rounded-xl inline-block shadow-sm">
                <Shield className="h-5 w-5" />
              </div>
              <h4 className="font-extrabold text-sm text-zinc-950">Seguro de Vida Icatu</h4>
              <p className="text-xs text-zinc-500 leading-relaxed">
                Segurança financeira para sua família através do respaldo da Icatu Seguros, com indenizações flexíveis.
              </p>
            </ScrollReveal>

            {/* Benefit item 4 */}
            <ScrollReveal className="space-y-3 p-6 bg-slate-50 rounded-2xl border border-zinc-100" delay={0.3}>
              <div className="p-2.5 bg-white text-aspeb-orange rounded-xl inline-block shadow-sm">
                <CheckCircle2 className="h-5 w-5" />
              </div>
              <h4 className="font-extrabold text-sm text-zinc-950">Urgência Odontológica</h4>
              <p className="text-xs text-zinc-500 leading-relaxed">
                Tenha suporte rápido e alívio imediato para dores e acidentes bucais através de clínicas odontológicas parceiras.
              </p>
            </ScrollReveal>

          </div>

        </div>
      </section>

      {/* SECTION 5: O SIMULADOR INTERATIVO (A Ferramenta de Conversão) */}
      <section id="simulador-secao" className="py-16 md:py-24 bg-gradient-to-b from-slate-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <ScrollReveal className="text-center max-w-3xl mx-auto space-y-3">
            <span className="px-3 py-1 rounded-full bg-orange-100 text-aspeb-orange text-xs font-black uppercase tracking-widest">
              Faça Você Mesmo
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-zinc-950 font-sans tracking-tight">
              Simule e Monte seu Plano de Proteção ASPEB
            </h2>
            <p className="text-sm sm:text-base text-zinc-500 leading-relaxed font-sans">
              Responda rápido para obter uma recomendação inteligente baseada no seu perfil. Ajuste as coberturas e escolha as vantagens para ver as economias amortizarem o plano.
            </p>
          </ScrollReveal>

          <ScrollReveal className="min-h-[480px]" id="simulador-sandbox-wrapper" delay={0.15}>
            <AnimatePresence mode="wait">
              
              {/* If no profile is onboarded, show the Onboarding step */}
              {!profile ? (
                <motion.div
                  key="onboarding-container"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.3 }}
                >
                  <Onboarding onComplete={handleOnboardingComplete} isDarkMode={false} />
                </motion.div>
              ) : (
                
                // Active Simulator Sandbox with Sliders & Widgets
                <motion.div
                  key="simulator-sandbox-view"
                  id="simulator-sandbox"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-8"
                >
                  
                  {/* Hello Header Banner */}
                  <div className="p-6 bg-orange-500/5 rounded-3xl border border-orange-500/10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div className="space-y-1">
                      <h3 className="text-lg font-extrabold text-zinc-950 font-sans">
                        Seu Plano Recomendado, {profile.name}! 🌟
                      </h3>
                      <p className="text-xs text-zinc-600 leading-relaxed font-sans max-w-3xl">
                        Com base na sua idade de <strong>{profile.age} anos</strong>, profissão <strong>{profile.profession === "autonomo" ? "Autônoma" : profile.profession === "clt" ? "CLT" : "Servidor Público"}</strong> e preocupação principal de <strong>{profile.concern === "saude" ? "Saúde & Consultas" : profile.concern === "morte" ? "Segurança Familiar" : "Invalidez & Acidentes"}</strong>, selecionamos as coberturas ideais abaixo. Você pode personalizar tudo à vontade!
                      </p>
                    </div>
                    <div className="flex gap-2 shrink-0">
                      <button
                        onClick={handleReset}
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-zinc-200 bg-white text-xs font-bold hover:bg-zinc-50 transition cursor-pointer shadow-sm"
                        id="btn-restart-simulation"
                        title="Redefinir Perfil"
                      >
                        <RotateCcw className="h-3.5 w-3.5 text-zinc-500" />
                        <span>Novo Perfil</span>
                      </button>
                    </div>
                  </div>

                  {/* 2 Column Sandbox Grid */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    
                    {/* Left & Mid section: sliders and benefits */}
                    <div className="lg:col-span-2 space-y-8">
                      
                      {/* Sliders list */}
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-extrabold text-sm text-zinc-900 uppercase tracking-wider">
                            1. Coberturas Financeiras (Seguro de Vida)
                          </h4>
                          <p className="text-xs text-zinc-400 mt-0.5">
                            Arraste para aumentar as indenizações garantidas.
                          </p>
                        </div>

                        <div className="grid grid-cols-1 gap-4">
                          {coverages.map((cov) => (
                            <CoverageSlider
                              key={cov.id}
                              coverage={cov}
                              onChange={handleCoverageChange}
                              onShowDetails={handleShowCoverageDetails}
                              ageMultiplier={ageMultiplier}
                            />
                          ))}
                        </div>
                      </div>

                      {/* Benefits list */}
                      <div className="space-y-4 pt-4">
                        <div>
                          <h4 className="font-extrabold text-sm text-zinc-900 uppercase tracking-wider">
                            2. Clube de Vantagens & Cuidados de Saúde
                          </h4>
                          <p className="text-xs text-zinc-400 mt-0.5">
                            Ative as vantagens de consultas médicas, medicamentos and sorteios.
                          </p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {benefits.map((benefit) => (
                            <BenefitCard
                              key={benefit.id}
                              benefit={benefit}
                              onToggle={handleBenefitToggle}
                              onShowDetails={handleShowBenefitDetails}
                            />
                          ))}
                        </div>
                      </div>

                    </div>

                    {/* Right column: ROI Widget and past simulation records */}
                    <div className="space-y-6">
                      
                      <RoiWidget
                        coverages={coverages}
                        benefits={benefits}
                        ageMultiplier={ageMultiplier}
                        onCheckout={() => setIsCheckoutOpen(true)}
                      />

                      <PastSimulations
                        currentQuote={currentQuoteData}
                        profile={profile}
                        onLoadSimulation={handleLoadSavedSimulation}
                      />

                    </div>

                  </div>

                </motion.div>
              )}

            </AnimatePresence>
          </ScrollReveal>

        </div>
      </section>

      {/* SECTION 6: APLICATIVO ASPEB (Tecnologia na Palma da Mão) */}
      <section className="py-16 md:py-24 bg-white border-y border-zinc-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* App left content */}
          <ScrollReveal className="lg:col-span-7 space-y-6" delay={0}>
            <span className="px-3 py-1 rounded-full bg-orange-100 text-aspeb-orange text-xs font-black uppercase tracking-widest">
              ASPEB Mobile
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-zinc-950 font-sans tracking-tight">
              Tudo o que você precisa na palma da sua mão
            </h2>
            <p className="text-sm sm:text-base text-zinc-500 leading-relaxed font-sans">
              O aplicativo oficial ASPEB oferece agilidade para você usufruir da sua saúde e vantagens com total autonomia. <strong>Já incluso gratuitamente para todos os planos e associados!</strong>
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
              <div className="flex gap-3">
                <div className="p-1.5 h-8 w-8 bg-orange-50 text-aspeb-orange rounded-lg shrink-0 flex items-center justify-center">
                  <Check className="h-5 w-5" />
                </div>
                <div>
                  <h5 className="font-bold text-sm text-zinc-900">Carteira Digital</h5>
                  <p className="text-xs text-zinc-400 mt-0.5">Atendimento rápido nas clínicas apresentando sua carteira virtual.</p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="p-1.5 h-8 w-8 bg-orange-50 text-aspeb-orange rounded-lg shrink-0 flex items-center justify-center">
                  <Check className="h-5 w-5" />
                </div>
                <div>
                  <h5 className="font-bold text-sm text-zinc-900">Guia de Clínicas e Credenciados</h5>
                  <p className="text-xs text-zinc-400 mt-0.5">Encontre consultórios, laboratórios e parceiros em Belém instantaneamente.</p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="p-1.5 h-8 w-8 bg-orange-50 text-aspeb-orange rounded-lg shrink-0 flex items-center justify-center">
                  <Check className="h-5 w-5" />
                </div>
                <div>
                  <h5 className="font-bold text-sm text-zinc-900">Histórico de Sorteios</h5>
                  <p className="text-xs text-zinc-400 mt-0.5">Consulte seu número da sorte e acompanhe os sorteios da Loteria Federal.</p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="p-1.5 h-8 w-8 bg-orange-50 text-aspeb-orange rounded-lg shrink-0 flex items-center justify-center">
                  <Check className="h-5 w-5" />
                </div>
                <div>
                  <h5 className="font-bold text-sm text-zinc-900">Suporte WhatsApp Integrado</h5>
                  <p className="text-xs text-zinc-400 mt-0.5">Suporte e atendimento humanizado para resolver qualquer dúvida com agilidade.</p>
                </div>
              </div>
            </div>

            {/* Action store badges links */}
            <div className="flex flex-wrap items-center gap-4 pt-4">
              <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest block w-full">Disponível em breve para:</span>
              <div className="flex items-center gap-3 bg-zinc-50 border border-zinc-150 px-4 py-2.5 rounded-2xl">
                <Smartphone className="h-5 w-5 text-zinc-600" />
                <div className="text-left">
                  <span className="block text-[9px] text-zinc-400 uppercase tracking-wider font-semibold">Download para</span>
                  <span className="block text-xs font-bold text-zinc-700">iOS & Android</span>
                </div>
              </div>
            </div>

          </ScrollReveal>

          {/* App right visual mockup */}
          <ScrollReveal className="lg:col-span-5 flex justify-center" delay={0.2} yOffset={55}>
            <div className="relative border-4 border-zinc-900 rounded-[3rem] p-3 w-[260px] h-[520px] bg-white shadow-2xl overflow-hidden shrink-0">
              {/* Phone ear speaker & camera notch */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-zinc-900 rounded-b-2xl z-20 flex items-center justify-center">
                <span className="h-1.5 w-1.5 bg-zinc-700 rounded-full" />
              </div>
              
              {/* Phone Content Screen */}
              <div className="h-full w-full bg-slate-50 rounded-[2.6rem] overflow-y-auto p-4 pt-8 space-y-4 font-sans text-xs select-none">
                {/* Header */}
                <div className="flex justify-between items-center pb-2 border-b border-zinc-100">
                  <img src="https://www.aspeb.com.br/wp-content/uploads/2025/11/ICON-ASPEB.png" alt="Favicon" className="h-6 w-6" />
                  <span className="font-bold text-aspeb-orange font-mono">ASPEB APP</span>
                </div>

                {/* Digital Card */}
                <div className="p-4 bg-gradient-to-br from-aspeb-orange to-orange-600 rounded-2xl text-white space-y-3 shadow-md relative overflow-hidden">
                  <div className="space-y-1">
                    <span className="text-[8px] uppercase tracking-wider font-semibold opacity-75">Carteira de Associado</span>
                    <span className="font-black block text-sm">MIGUEL C. PINTO</span>
                  </div>
                  <div className="flex justify-between text-[9px] opacity-90">
                    <span>Plano: Cuidado Ativo</span>
                    <span className="font-mono">ID: 346.123-A</span>
                  </div>
                  <div className="absolute -bottom-4 -right-4 h-16 w-16 bg-white/10 rounded-full blur-xl" />
                </div>

                {/* Quick actions mockup */}
                <div className="space-y-2">
                  <span className="font-bold text-[10px] text-zinc-400 uppercase tracking-wider block">Serviços Rápidos</span>
                  <div className="grid grid-cols-2 gap-2 text-center text-[10px]">
                    <div className="p-2 bg-white border border-zinc-100 rounded-xl space-y-1">
                      <Heart className="h-4 w-4 mx-auto text-rose-500" />
                      <span className="font-bold text-zinc-700 block">Clínicas</span>
                    </div>
                    <div className="p-2 bg-white border border-zinc-100 rounded-xl space-y-1">
                      <Percent className="h-4 w-4 mx-auto text-emerald-500" />
                      <span className="font-bold text-zinc-700 block">Descontos</span>
                    </div>
                  </div>
                </div>

                {/* Consultation tracker */}
                <div className="p-3 bg-white border border-zinc-150 rounded-2xl space-y-1.5">
                  <div className="flex justify-between items-center text-[9px] font-bold">
                    <span className="text-zinc-600">Última Consulta</span>
                    <span className="text-emerald-500 bg-emerald-50 px-1.5 py-0.5 rounded">R$ 35,00</span>
                  </div>
                  <p className="font-bold text-zinc-800 text-[10px]">Clínica Geral • Matriz Belém</p>
                </div>
              </div>
            </div>
          </ScrollReveal>

        </div>
      </section>

      {/* SECTION 7: FAQ (Quebrando Objeções Finais) */}
      <section id="faq" className="py-16 md:py-24 bg-slate-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <ScrollReveal className="text-center space-y-3">
            <span className="px-3 py-1 rounded-full bg-orange-100 text-aspeb-orange text-xs font-black uppercase tracking-widest">
              Suporte Informativo
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-zinc-950 font-sans tracking-tight">
              Dúvidas Frequentes
            </h2>
            <p className="text-sm sm:text-base text-zinc-500 leading-relaxed font-sans">
              Esclareça suas principais dúvidas sobre o clube de benefícios ASPEB.
            </p>
          </ScrollReveal>

          <ScrollReveal className="space-y-4" delay={0.15}>
            {faqs.map((faq, index) => (
              <div 
                key={index}
                className="bg-white border border-zinc-200/60 rounded-2xl overflow-hidden shadow-sm transition"
              >
                <button
                  onClick={() => setActiveFaq(activeFaq === index ? null : index)}
                  className="w-full p-5 text-left font-extrabold text-sm sm:text-base text-zinc-900 flex justify-between items-center cursor-pointer hover:bg-slate-50/50 transition"
                  id={`btn-faq-toggle-${index}`}
                >
                  <span>{faq.q}</span>
                  <ChevronDown className={`h-5 w-5 text-zinc-400 transition-transform duration-200 ${activeFaq === index ? "rotate-180" : ""}`} />
                </button>
                
                <AnimatePresence>
                  {activeFaq === index && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="border-t border-zinc-100/50 bg-slate-50/30"
                    >
                      <p className="p-5 text-xs sm:text-sm text-zinc-600 leading-relaxed font-sans">
                        {faq.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </ScrollReveal>

        </div>
      </section>

      {/* SECTION 8: RODAPÉ INSTITUCIONAL (Footer Legal) */}
      <footer className="bg-zinc-950 text-zinc-400 py-16 font-sans">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
            
            {/* Footer main info */}
            <div className="md:col-span-5 space-y-4">
              <img 
                src="https://www.aspeb.com.br/wp-content/uploads/2025/11/ASPEB-MARCA-1990.png" 
                alt="ASPEB Benefícios" 
                className="h-12 w-auto object-contain brightness-0 invert"
              />
              <p className="text-xs text-zinc-500 leading-relaxed max-w-sm">
                ASPEB Benefícios oferece soluções inteligentes em clube de vantagens, assistência de saúde facilitada e proteção para famílias em toda a Região Norte.
              </p>
            </div>

            {/* Links columns */}
            <div className="md:col-span-3 space-y-3">
              <h5 className="text-white font-extrabold text-xs uppercase tracking-widest">Nossos Serviços</h5>
              <ul className="text-xs space-y-2 text-zinc-500">
                <li><button onClick={() => scrollToId("saude")} className="hover:text-aspeb-orange transition">Consultas Médicas</button></li>
                <li><button onClick={() => scrollToId("saude")} className="hover:text-aspeb-orange transition">Desconto em Exames</button></li>
                <li><button onClick={() => scrollToId("beneficios")} className="hover:text-aspeb-orange transition">Descontos em Farmácias</button></li>
                <li><button onClick={() => scrollToId("beneficios")} className="hover:text-aspeb-orange transition">Seguro de Vida Integrado</button></li>
              </ul>
            </div>

            {/* Contacts Column */}
            <div className="md:col-span-4 space-y-3">
              <h5 className="text-white font-extrabold text-xs uppercase tracking-widest">Atendimento Humano</h5>
              <ul className="text-xs space-y-2 text-zinc-500">
                <li className="flex items-center gap-1.5">
                  <Phone className="h-4 w-4 text-aspeb-orange shrink-0" />
                  <span>Belém: (91) 3212-1990</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <Phone className="h-4 w-4 text-emerald-500 shrink-0" />
                  <span>WhatsApp: (91) 98111-9888</span>
                </li>
                <li>Email: atendimento@aspeb.com.br</li>
                <li>Sede: Av. Governador José Malcher, Belém - PA</li>
              </ul>
            </div>

          </div>

          {/* Legal Partnering Disclaimer */}
          <div className="border-t border-zinc-900 pt-8 text-[10px] sm:text-xs text-zinc-600 space-y-3 leading-relaxed">
            <p>
              <strong>ASPEB Benefícios</strong> - CNPJ: 34.612.338/0001-38. Sede Administrativa: Av. Governador José Malcher, Belém - PA.
            </p>
            <p>
              *As coberturas securitárias de Morte Individual e Invalidez Permanente por Acidente são garantidas pela Icatu Seguros S/A (CNPJ 42.283.770/0001-86), inscrita sob autorização SUSEP. A ASPEB atua como estipulante e intermediadora de planos coletivos, de acordo com as diretrizes vigentes.
            </p>
            <p className="text-center pt-4 text-[11px] text-zinc-500">
              &copy; {new Date().getFullYear()} ASPEB Benefícios. Todos os direitos reservados.
            </p>
          </div>

        </div>
      </footer>

      {/* SECURE CHECKOUT DIALOG MODAL */}
      <AnimatePresence>
        {isCheckoutOpen && profile && (
          <CheckoutModal
            isOpen={isCheckoutOpen}
            onClose={() => setIsCheckoutOpen(false)}
            profile={profile}
            coverages={coverages}
            benefits={benefits}
            ageMultiplier={ageMultiplier}
            onSuccess={handleCheckoutSuccess}
          />
        )}
      </AnimatePresence>

      {/* SERVICE DETAILS MODAL */}
      <AnimatePresence>
        {detailsItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDetailsItem(null)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm"
              id="details-backdrop"
            />

            {/* Modal Box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", duration: 0.4 }}
              className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-zinc-200 overflow-hidden z-10 flex flex-col"
              id="details-modal"
            >
              {/* Header Visual with icon */}
              <div className="p-6 pb-4 border-b border-zinc-100 flex items-start justify-between gap-4 bg-gradient-to-r from-orange-50/50 via-white to-transparent">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-aspeb-orange/10 text-aspeb-orange rounded-2xl flex items-center justify-center shrink-0">
                    {/* Render suitable icon */}
                    {detailsItem.icon === "Heart" && <Heart className="h-6 w-6 stroke-[2]" />}
                    {detailsItem.icon === "Accessibility" && <Accessibility className="h-6 w-6 stroke-[2]" />}
                    {detailsItem.icon === "Activity" && <Activity className="h-6 w-6 stroke-[2]" />}
                    {detailsItem.icon === "Pills" && <Pill className="h-6 w-6 stroke-[2]" />}
                    {detailsItem.icon === "PlusCircle" && <PlusCircle className="h-6 w-6 stroke-[2]" />}
                    {detailsItem.icon === "ShieldAlert" && <ShieldAlert className="h-6 w-6 stroke-[2]" />}
                    {detailsItem.icon === "Award" && <Award className="h-6 w-6 stroke-[2]" />}
                    {detailsItem.icon === "Smartphone" && <Smartphone className="h-6 w-6 stroke-[2]" />}
                    {detailsItem.icon === "Phone" && <Phone className="h-6 w-6 stroke-[2]" />}
                    {!["Heart", "Accessibility", "Activity", "Pills", "PlusCircle", "ShieldAlert", "Award", "Smartphone", "Phone"].includes(detailsItem.icon) && <Info className="h-6 w-6 stroke-[2]" />}
                  </div>
                  <div>
                    {detailsItem.tag && (
                      <span className="text-[10px] font-bold text-aspeb-orange bg-orange-50 px-2 py-0.5 rounded-full border border-orange-100 mb-1 inline-block uppercase">
                        {detailsItem.tag}
                      </span>
                    )}
                    <h3 className="font-extrabold text-lg text-zinc-900 font-sans tracking-tight leading-tight">
                      {detailsItem.title}
                    </h3>
                    {detailsItem.provider && (
                      <p className="text-[11px] text-zinc-400 font-medium mt-0.5">
                        Parceiro: <span className="font-bold text-zinc-600">{detailsItem.provider}</span>
                      </p>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => setDetailsItem(null)}
                  className="p-1.5 rounded-full hover:bg-zinc-100 text-zinc-400 hover:text-zinc-700 transition cursor-pointer shrink-0"
                  aria-label="Fechar detalhes"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Scrollable Content */}
              <div className="p-6 space-y-5 max-h-[60vh] overflow-y-auto">
                {/* Description */}
                <div className="space-y-2">
                  <h4 className="font-extrabold text-xs text-zinc-400 uppercase tracking-wider font-sans">
                    Como Funciona / Descrição
                  </h4>
                  <p className="text-sm text-zinc-600 leading-relaxed font-sans">
                    {detailsItem.description}
                  </p>
                </div>

                {/* Specific details for Coverages */}
                {detailsItem.type === "coverage" && (
                  <div className="space-y-3 pt-3 border-t border-zinc-100">
                    <h4 className="font-extrabold text-xs text-zinc-400 uppercase tracking-wider font-sans">
                      Destaques da Cobertura
                    </h4>
                    <ul className="space-y-2.5 text-xs text-zinc-600 font-sans">
                      <li className="flex items-start gap-2">
                        <Check className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5 stroke-[3]" />
                        <span><strong>Proteção Integral Icatu:</strong> Respaldado por uma das maiores corporações de previdência e vida do Brasil.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5 stroke-[3]" />
                        <span><strong>Isenção de Impostos:</strong> O capital é pago de forma direta e rápida, livre de inventários judiciais (ITCMD).</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5 stroke-[3]" />
                        <span><strong>Valores Customizáveis:</strong> Flexibilidade para simular coberturas entre {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 }).format(detailsItem.min || 10000)} e {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 }).format(detailsItem.max || 150000)} mensais.</span>
                      </li>
                    </ul>
                  </div>
                )}

                {/* Specific details for Benefits */}
                {detailsItem.type === "benefit" && (
                  <div className="space-y-4 pt-3 border-t border-zinc-100">
                    
                    {/* Key points */}
                    <div className="space-y-2.5">
                      <h4 className="font-extrabold text-xs text-zinc-400 uppercase tracking-wider font-sans">
                        Por que ativar este benefício?
                      </h4>
                      <ul className="space-y-2.5 text-xs text-zinc-600 font-sans">
                        {detailsItem.id === "consultas_matriz" && (
                          <>
                            <li className="flex items-start gap-2">
                              <Check className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5 stroke-[3]" />
                              <span>Economia garantida com consultas de clínica geral totalmente inclusas.</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <Check className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5 stroke-[3]" />
                              <span>Especialidades disponíveis na sede própria da ASPEB em Belém.</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <Check className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5 stroke-[3]" />
                              <span>Até 9 consultas anuais por associado titular.</span>
                            </li>
                          </>
                        )}
                        {detailsItem.id === "saude_rede" && (
                          <>
                            <li className="flex items-start gap-2">
                              <Check className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5 stroke-[3]" />
                              <span>Consultas e exames em clínicas particulares credenciadas por valores reduzidos.</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <Check className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5 stroke-[3]" />
                              <span>Atendimento odontológico de emergência e tratamento de rotina.</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <Check className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5 stroke-[3]" />
                              <span>Rede credenciada em constante expansão com cobertura em Belém e Região Norte.</span>
                            </li>
                          </>
                        )}
                        {detailsItem.id === "funeral" && (
                          <>
                            <li className="flex items-start gap-2">
                              <Check className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5 stroke-[3]" />
                              <span>Cobertura familiar completa de taxas de cemitério, caixão, flores e traslado.</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <Check className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5 stroke-[3]" />
                              <span>Atendimento de plantão 24 horas por telefone para orientação e agilização imediata.</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <Check className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5 stroke-[3]" />
                              <span>Sem limite de distância de traslado de corpo dentro do território nacional.</span>
                            </li>
                          </>
                        )}
                        {detailsItem.id === "sorteios" && (
                          <>
                            <li className="flex items-start gap-2">
                              <Check className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5 stroke-[3]" />
                              <span>Participação automática vinculada ao número do seu plano ativo.</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <Check className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5 stroke-[3]" />
                              <span>Título de capitalização lastreado pela Icatu Seguros com sorteio oficial.</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <Check className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5 stroke-[3]" />
                              <span>Valores pagos diretamente na conta corrente do titular sem complicação.</span>
                            </li>
                          </>
                        )}
                        {detailsItem.id === "farmacia" && (
                          <>
                            <li className="flex items-start gap-2">
                              <Check className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5 stroke-[3]" />
                              <span>Desconto imediato direto no caixa apresentando sua carteira digital ASPEB.</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <Check className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5 stroke-[3]" />
                              <span>Válido para remédios de uso contínuo, genéricos e produtos de higiene credenciados.</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <Check className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5 stroke-[3]" />
                              <span>Parceria com Droga Raia, Drogasil, Pague Menos, Extrafarma e muito mais.</span>
                            </li>
                          </>
                        )}
                        {detailsItem.id === "telemedicina" && (
                          <>
                            <li className="flex items-start gap-2">
                              <Check className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5 stroke-[3]" />
                              <span>Consultas ilimitadas sem coparticipação com clínicos gerais e pediatras de plantão.</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <Check className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5 stroke-[3]" />
                              <span>Evite prontos-socorros lotados e tenha suporte de saúde seguro da sua casa.</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <Check className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5 stroke-[3]" />
                              <span>Receituário e atestados com assinatura digital aceitos em todas as farmácias nacionais.</span>
                            </li>
                          </>
                        )}
                        {!["consultas_matriz", "saude_rede", "funeral", "sorteios", "farmacia", "telemedicina"].includes(detailsItem.id) && (
                          <li className="flex items-start gap-2">
                            <Check className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5 stroke-[3]" />
                            <span>Vantagem exclusiva e economia direta no orçamento familiar mensal.</span>
                          </li>
                        )}
                      </ul>
                    </div>

                    {/* Financial stats of benefit */}
                    <div className="bg-zinc-50 rounded-2xl p-4 border border-zinc-150 grid grid-cols-2 gap-4">
                      <div>
                        <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider block">
                          Custo do Serviço
                        </span>
                        <span className="text-sm font-extrabold text-zinc-700 font-sans block mt-0.5">
                          {detailsItem.cost === 0 ? "Incluso no Plano" : `+ R$ ${detailsItem.cost?.toFixed(2).replace(".", ",")}`}
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] text-emerald-600 font-bold uppercase tracking-wider block">
                          Economia Estimada/ano
                        </span>
                        <span className="text-base font-black text-emerald-600 font-mono block mt-0.5">
                          R$ {detailsItem.estimatedSavings?.toFixed(2).replace(".", ",")}
                        </span>
                      </div>
                    </div>

                  </div>
                )}
              </div>

              {/* Footer CTA */}
              <div className="p-6 bg-zinc-50 border-t border-zinc-100 flex justify-end gap-3 rounded-b-3xl">
                <button
                  onClick={() => setDetailsItem(null)}
                  className="px-6 py-2.5 bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-bold uppercase tracking-wider rounded-xl transition cursor-pointer"
                >
                  Entendi
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* FLOATING BACK TO TOP BUTTON */}
      <AnimatePresence>
        {showBackToTop && (
          <motion.button
            key="back-to-top"
            initial={{ opacity: 0, scale: 0.5, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.5, y: 30 }}
            whileHover={{ scale: 1.1, translateY: -2 }}
            whileTap={{ scale: 0.9 }}
            onClick={scrollToTop}
            className="fixed bottom-6 right-6 p-3.5 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 text-white rounded-full shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/30 border border-emerald-400/20 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-offset-2 z-40 cursor-pointer"
            aria-label="Voltar ao topo"
            title="Voltar ao topo"
          >
            <ArrowUp className="h-5 w-5 stroke-[2.5]" />
          </motion.button>
        )}
      </AnimatePresence>

    </div>
  );
}
