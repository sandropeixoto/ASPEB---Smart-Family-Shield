import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  X, 
  CreditCard, 
  QrCode, 
  FileCheck, 
  ShieldCheck, 
  Sparkles, 
  ArrowRight,
  Loader2,
  Copy,
  CheckCircle2,
  Download
} from "lucide-react";
import { Coverage, Benefit, UserProfile, SimulationResult } from "../types";

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: UserProfile;
  coverages: Coverage[];
  benefits: Benefit[];
  ageMultiplier: number;
  onSuccess: (result: SimulationResult) => void;
}

export default function CheckoutModal({ 
  isOpen, 
  onClose, 
  profile, 
  coverages, 
  benefits, 
  ageMultiplier,
  onSuccess 
}: CheckoutModalProps) {
  const [step, setStep] = useState(1); // 1: Payment Selection & Forms, 2: Loading Processing, 3: Success Receipt
  const [paymentMethod, setPaymentMethod] = useState("pix"); // pix, card, debito
  const [isCopied, setIsCopied] = useState(false);

  // Confetti particles state
  const [confetti, setConfetti] = useState<any[]>([]);

  useEffect(() => {
    if (step === 3) {
      const particles = Array.from({ length: 75 }).map((_, i) => {
        const isCircle = Math.random() > 0.4;
        return {
          id: i,
          x: Math.random() * 100,
          y: -15,
          size: Math.random() * 8 + 5,
          shape: isCircle ? "rounded-full" : Math.random() > 0.5 ? "rounded-sm" : "rotate-45",
          color: [
            "#f97316", // ASPEB Orange
            "#fbbf24", // Amber
            "#10b981", // Emerald
            "#3b82f6", // Blue
            "#a855f7", // Purple
            "#ec4899"  // Pink
          ][Math.floor(Math.random() * 6)],
          duration: Math.random() * 2.6 + 1.8,
          delay: Math.random() * 0.4,
          rotation: Math.random() * 360,
          rotationSpeed: (Math.random() - 0.5) * 500,
          drift: (Math.random() - 0.5) * 35
        };
      });
      setConfetti(particles);
    } else {
      setConfetti([]);
    }
  }, [step]);

  // Form Fields
  const [cpf, setCpf] = useState("");
  const [phone, setPhone] = useState("");
  const [cardHolder, setCardHolder] = useState(profile.name);
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");
  const [bankName, setBankName] = useState("itau"); // for direct debit

  // Pricing calculations
  const totalInsuranceCost = coverages.reduce((sum, coverage) => {
    const units = coverage.value / coverage.unitSize;
    const rawCost = units * coverage.baseRatePerUnit;
    return sum + (rawCost * ageMultiplier);
  }, 0);

  const selectedBenefits = benefits.filter(b => b.isSelected);
  const totalBenefitsCost = selectedBenefits.reduce((sum, b) => sum + b.cost, 0);
  const baseCost = totalInsuranceCost + totalBenefitsCost;

  // Apply payment method discounts (5% off on PIX or Direct Debit)
  const discountRate = (paymentMethod === "pix" || paymentMethod === "debito") ? 0.05 : 0.0;
  const discountAmount = baseCost * discountRate;
  const finalCost = baseCost - discountAmount;
  const totalSavings = selectedBenefits.reduce((sum, b) => sum + b.estimatedSavings, 0);

  // Generate PIX code
  const pixKey = "00020126580014BR.GOV.BCB.PIX0136atendimento@aspeb.com.br5204000053039865405" + finalCost.toFixed(2) + "5802BR5915ASPEB_BENEFICIOS6009SAO_PAULO62070503***6304" + Math.floor(Math.random() * 9000 + 1000).toString(16).toUpperCase();

  const handleCopyPix = () => {
    navigator.clipboard.writeText(pixKey);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleProcessPayment = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(2); // Go to loading transition
    
    // Simulate API authorization
    setTimeout(() => {
      setStep(3); // Success Screen
      
      const result: SimulationResult = {
        id: "ASPEB-" + Math.floor(Math.random() * 900000 + 100000),
        date: new Date().toLocaleDateString("pt-BR"),
        profile,
        coverages: coverages.reduce((acc, c) => ({ ...acc, [c.id]: c.value }), {}),
        benefits: selectedBenefits.map(b => b.id),
        totalPremium: totalInsuranceCost,
        totalBenefitsCost,
        totalSavings,
        netCost: finalCost,
        paymentMethod
      };
      
      onSuccess(result);
    }, 2000);
  };

  const formatCurrency = (val: number): string => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL"
    }).format(val);
  };

  const getConcernCelebrationMessage = (): string => {
    const concernLower = profile.concern?.toLowerCase() || "";
    if (concernLower.includes("saude") || concernLower.includes("médic") || concernLower.includes("consult") || concernLower.includes("clínica")) {
      return "Com a sua adesão, você garantiu acesso imediato a consultas presenciais por apenas R$ 35,00 e até 70% de desconto em exames laboratoriais e de imagem na rede credenciada de Belém e Região. Cuidar da saúde agora cabe com folga no seu orçamento!";
    }
    if (concernLower.includes("medic") || concernLower.includes("farmac")) {
      return "Excelente escolha! A partir de agora você conta com até 60% de desconto real em medicamentos de uso contínuo e genéricos na Drogasil, Extrafarma e Pague Menos. Isso significa economia prática e garantida em todas as receitas da sua família.";
    }
    if (concernLower.includes("finance") || concernLower.includes("segur") || concernLower.includes("prote")) {
      return "Parabéns por essa importante decisão! Sua família e patrimônio agora estão sob o amparo robusto das coberturas contratadas junto à Icatu Seguros. E além da tranquilidade diária, você concorre mensalmente a prêmios em dinheiro de até R$ 20.000,00!";
    }
    if (concernLower.includes("odonto") || concernLower.includes("dente")) {
      return "Uma escolha muito inteligente! Sua saúde bucal e urgências odontológicas agora estão assistidas com agilidade e zero custos abusivos para consultas e tratamento imediato de dor em clínicas qualificadas.";
    }
    return "Você escolheu a segurança e o cuidado integral que quem você mais ama merece. Parabéns por garantir assistências de alto padrão e vantagens diárias ativas desde o primeiro dia de vigência de sua proposta!";
  };

  // Helper mask functions
  const handleCpfChange = (val: string) => {
    const cleaned = val.replace(/\D/g, "");
    let masked = cleaned;
    if (cleaned.length > 3) masked = cleaned.slice(0, 3) + "." + cleaned.slice(3);
    if (cleaned.length > 6) masked = masked.slice(0, 7) + "." + masked.slice(7);
    if (cleaned.length > 9) masked = masked.slice(0, 11) + "-" + masked.slice(11, 13);
    setCpf(masked.slice(0, 14));
  };

  const handlePhoneChange = (val: string) => {
    const cleaned = val.replace(/\D/g, "");
    let masked = cleaned;
    if (cleaned.length > 0) masked = "(" + cleaned;
    if (cleaned.length > 2) masked = masked.slice(0, 3) + ") " + masked.slice(3);
    if (cleaned.length > 7) masked = masked.slice(0, 10) + "-" + masked.slice(10, 14);
    setPhone(masked.slice(0, 15));
  };

  // Simulated PDF download of policy proposal
  const handleDownloadProposal = () => {
    const proposalContent = `
==================================================
      PROPOSTA DE ADESÃO - ASPEB BENEFÍCIOS
          CUIDADO COMPLETO PARA SUA FAMÍLIA
==================================================
ID DA PROPOSTA: ASPEB-${Math.floor(Math.random() * 900000 + 100000)}
DATA: ${new Date().toLocaleDateString("pt-BR")}
CLIENTE: ${profile.name}
IDADE: ${profile.age} anos
PROFISSÃO: ${profile.profession.toUpperCase()}
PREOCUPAÇÃO PRINCIPAL: ${profile.concern.toUpperCase()}

--------------------------------------------------
COBERTURAS SELECIONADAS (SEGURO DE VIDA ICATU):
${coverages.map(c => c.value > 0 ? `- ${c.name}: ${formatCurrency(c.value)}` : "").filter(Boolean).join("\n")}

BENEFÍCIOS ATIVOS DO CLUBE:
${selectedBenefits.map(b => `- ${b.title} (${b.provider})`).join("\n")}

--------------------------------------------------
RESUMO FINANCEIRO:
- Custo Mensal Base: ${formatCurrency(baseCost)}
- Desconto Aplicado (${paymentMethod.toUpperCase()}): ${formatCurrency(discountAmount)}
- Valor Mensal Final: ${formatCurrency(finalCost)}
- Economia Estimada Mensal com Clube: ${formatCurrency(totalSavings)}
- Saldo de Retorno Líquido: ${formatCurrency(totalSavings - finalCost)}

--------------------------------------------------
COBRANÇA SELECIONADA: ${paymentMethod.toUpperCase()}
Adesão processada com sucesso. Seja bem-vindo à ASPEB!
==================================================
`;
    const element = document.createElement("a");
    const file = new Blob([proposalContent], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = `Proposta_ASPEB_${profile.name.replace(/\s+/g, '_')}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" id="checkout-modal">
      
      {/* Dark overlay backdrop */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={step !== 2 ? onClose : undefined}
        className="absolute inset-0 bg-zinc-950/60 backdrop-blur-sm cursor-pointer"
      />

      {/* Modal Container */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        transition={{ type: "spring", duration: 0.4 }}
        className="bg-white border border-zinc-200 rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl relative z-10 max-h-[90vh] flex flex-col"
      >
        
        {/* Confetti Animation overlay */}
        {step === 3 && (
          <div className="absolute inset-0 pointer-events-none overflow-hidden z-20">
            {confetti.map((p) => (
              <motion.div
                key={p.id}
                initial={{ 
                  opacity: 1, 
                  y: `${p.y}%`, 
                  x: `${p.x}%`, 
                  rotate: p.rotation,
                  scale: 0
                }}
                animate={{ 
                  opacity: [1, 1, 0], 
                  y: "110%", 
                  x: `${p.x + p.drift}%`,
                  rotate: p.rotation + p.rotationSpeed,
                  scale: [0, 1, 0.7]
                }}
                transition={{
                  duration: p.duration,
                  delay: p.delay,
                  ease: "easeOut"
                }}
                className={`absolute ${p.shape}`}
                style={{ 
                  backgroundColor: p.color,
                  width: p.size,
                  height: p.size,
                  top: 0
                }}
              />
            ))}
          </div>
        )}
        
        {/* Top Header */}
        <div className="flex items-center justify-between p-5 border-b border-zinc-100">
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-orange-50 text-aspeb-orange rounded-lg">
              <ShieldCheck className="h-5 w-5" />
            </span>
            <span className="font-bold text-sm text-zinc-900 uppercase tracking-wider font-sans">
              Checkout Seguro ASPEB
            </span>
          </div>
          {step !== 2 && (
            <button 
              onClick={onClose}
              className="p-1.5 rounded-lg text-zinc-400 hover:bg-zinc-100 transition cursor-pointer"
              id="btn-close-checkout"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>

        {/* Scrollable Body */}
        <div className="overflow-y-auto flex-1 p-6 md:p-8 space-y-6">
          <AnimatePresence mode="wait">
            
            {/* STEP 1: Billing Options & Personal Info */}
            {step === 1 && (
              <motion.div
                key="billing-selection"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className="space-y-6"
              >
                
                {/* Order Summary banner */}
                <div className="p-4 bg-zinc-50 border border-zinc-100 rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div>
                    <h4 className="font-extrabold text-sm text-zinc-900">
                      Olá, {profile.name}!
                    </h4>
                    <p className="text-xs text-zinc-500 mt-0.5">
                      Idade: {profile.age} anos • {selectedBenefits.length} benefício(s) ativo(s)
                    </p>
                  </div>
                  
                  <div className="flex items-baseline gap-2 bg-white border border-zinc-200 px-3.5 py-1.5 rounded-xl shrink-0 shadow-sm font-mono">
                    <span className="text-[10px] text-zinc-400 uppercase font-semibold">Mensal:</span>
                    <span className="text-lg font-black text-aspeb-orange">
                      {formatCurrency(finalCost)}
                    </span>
                    {discountAmount > 0 && (
                      <span className="text-[10px] text-emerald-500 font-bold line-through ml-1">
                        {formatCurrency(baseCost)}
                      </span>
                    )}
                  </div>
                </div>

                <form onSubmit={handleProcessPayment} className="space-y-6">
                  
                  {/* Select Payment Method */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-zinc-600 uppercase tracking-wider block">
                      Forma de Cobrança Mensal (Recorrente)
                    </label>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      {/* PIX Option */}
                      <button
                        type="button"
                        onClick={() => setPaymentMethod("pix")}
                        className={`p-4 rounded-xl border-2 text-left transition flex flex-col justify-between cursor-pointer ${
                          paymentMethod === "pix"
                            ? "border-aspeb-orange bg-aspeb-orange/5"
                            : "border-zinc-200 hover:border-zinc-300 bg-white"
                        }`}
                        id="btn-pay-pix"
                      >
                        <div className="flex justify-between items-start w-full">
                          <QrCode className="h-5 w-5 text-aspeb-orange" />
                          <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded bg-emerald-100 text-[9px] font-bold text-emerald-600 uppercase">
                            -5% off
                          </span>
                        </div>
                        <div className="mt-4">
                          <span className="font-bold text-xs text-zinc-900 block">
                            PIX Recorrente
                          </span>
                          <span className="text-[10px] text-zinc-400 mt-0.5 block leading-tight">
                            Desconto aplicado no valor final.
                          </span>
                        </div>
                      </button>

                      {/* Card Option */}
                      <button
                        type="button"
                        onClick={() => setPaymentMethod("card")}
                        className={`p-4 rounded-xl border-2 text-left transition flex flex-col justify-between cursor-pointer ${
                          paymentMethod === "card"
                            ? "border-aspeb-orange bg-aspeb-orange/5"
                            : "border-zinc-200 hover:border-zinc-300 bg-white"
                        }`}
                        id="btn-pay-card"
                      >
                        <CreditCard className="h-5 w-5 text-zinc-500" />
                        <div className="mt-4">
                          <span className="font-bold text-xs text-zinc-900 block">
                            Cartão de Crédito
                          </span>
                          <span className="text-[10px] text-zinc-400 mt-0.5 block leading-tight">
                            Sem comprometer o limite total do cartão.
                          </span>
                        </div>
                      </button>

                      {/* Direct Debit Option */}
                      <button
                        type="button"
                        onClick={() => setPaymentMethod("debito")}
                        className={`p-4 rounded-xl border-2 text-left transition flex flex-col justify-between cursor-pointer ${
                          paymentMethod === "debito"
                            ? "border-aspeb-orange bg-aspeb-orange/5"
                            : "border-zinc-200 hover:border-zinc-300 bg-white"
                        }`}
                        id="btn-pay-debito"
                      >
                        <div className="flex justify-between items-start w-full">
                          <FileCheck className="h-5 w-5 text-purple-600" />
                          <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded bg-emerald-100 text-[9px] font-bold text-emerald-600 uppercase">
                            -5% off
                          </span>
                        </div>
                        <div className="mt-4">
                          <span className="font-bold text-xs text-zinc-900 block">
                            Débito Automático
                          </span>
                          <span className="text-[10px] text-zinc-400 mt-0.5 block leading-tight">
                            Desconto válido para Itaú, Bradesco e BB.
                          </span>
                        </div>
                      </button>
                    </div>
                  </div>

                  {/* Personal Contact Info (CPF & Phone) */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-zinc-500">
                        CPF (Para emissão da apólice)
                      </label>
                      <input
                        type="text"
                        placeholder="000.000.000-00"
                        value={cpf}
                        onChange={(e) => handleCpfChange(e.target.value)}
                        className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl text-sm focus:ring-2 focus:ring-orange-500 text-zinc-900"
                        required
                        id="input-cpf"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-zinc-500">
                        Telefone Celular (WhatsApp)
                      </label>
                      <input
                        type="text"
                        placeholder="(91) 99999-9999"
                        value={phone}
                        onChange={(e) => handlePhoneChange(e.target.value)}
                        className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl text-sm focus:ring-2 focus:ring-orange-500 text-zinc-900"
                        required
                        id="input-phone"
                      />
                    </div>
                  </div>

                  {/* Payment Form Block (Conditional) */}
                  <div className="border-t border-zinc-100 pt-6">
                    {paymentMethod === "pix" && (
                      <div className="p-4 bg-orange-500/5 border border-orange-500/10 rounded-2xl text-center space-y-2">
                        <p className="text-xs text-zinc-600 font-sans leading-relaxed">
                          O PIX Recorrente funciona de forma prática. Todo mês você receberá um link/lembrete PIX para realizar o pagamento. O desconto de <strong>5%</strong> é garantido em todas as parcelas!
                        </p>
                      </div>
                    )}

                    {paymentMethod === "debito" && (
                      <div className="space-y-4">
                        <div className="p-4 bg-emerald-500/5 border border-emerald-500/10 rounded-xl text-xs text-emerald-700 mb-2">
                          Desconto de <strong>5%</strong> aplicado no prêmio total em débito automático bancário.
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-zinc-500">
                              Banco de Preferência
                            </label>
                            <select
                              value={bankName}
                              onChange={(e) => setBankName(e.target.value)}
                              className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl text-sm focus:ring-2 focus:ring-orange-500 text-zinc-900"
                              id="select-bank"
                            >
                              <option value="itau">Itaú Unibanco</option>
                              <option value="bradesco">Bradesco</option>
                              <option value="bb">Banco do Brasil</option>
                              <option value="santander">Santander Brasil</option>
                            </select>
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-zinc-500">
                              Agência e Conta (com dígito)
                            </label>
                            <input
                              type="text"
                              placeholder="0001 / 12345-6"
                              className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl text-sm focus:ring-2 focus:ring-orange-500 text-zinc-900"
                              required
                              id="input-bank-info"
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {paymentMethod === "card" && (
                      <div className="space-y-4">
                        <div className="space-y-1.5">
                          <label className="text-xs font-semibold text-zinc-500">
                            Nome impresso no cartão
                          </label>
                          <input
                            type="text"
                            value={cardHolder}
                            onChange={(e) => setCardHolder(e.target.value.toUpperCase())}
                            placeholder="MIGUEL CARDOSO PINTO"
                            className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl text-sm focus:ring-2 focus:ring-orange-500 text-zinc-900"
                            required
                            id="input-cardholder"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-xs font-semibold text-zinc-500">
                            Número do cartão de crédito
                          </label>
                          <div className="relative">
                            <input
                              type="text"
                              value={cardNumber}
                              onChange={(e) => {
                                const val = e.target.value.replace(/\D/g, "").slice(0, 16);
                                const parts = val.match(/.{1,4}/g) || [];
                                setCardNumber(parts.join(" "));
                              }}
                              placeholder="4000 1234 5678 9010"
                              className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl text-sm focus:ring-2 focus:ring-orange-500 text-zinc-900"
                              required
                              id="input-cardnumber"
                            />
                            <CreditCard className="absolute right-3.5 top-3 w-5 h-5 text-zinc-400" />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-zinc-500">
                              Validade (MM/AA)
                            </label>
                            <input
                              type="text"
                              value={cardExpiry}
                              onChange={(e) => {
                                const val = e.target.value.replace(/\D/g, "").slice(0, 4);
                                if (val.length >= 2) {
                                  setCardExpiry(val.slice(0, 2) + "/" + val.slice(2));
                                } else {
                                  setCardExpiry(val);
                                }
                              }}
                              placeholder="12/29"
                              className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl text-sm focus:ring-2 focus:ring-orange-500 text-zinc-900"
                              required
                              id="input-cardexpiry"
                            />
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-zinc-500">
                              Código CVV
                            </label>
                            <input
                              type="password"
                              value={cardCvv}
                              onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, "").slice(0, 3))}
                              placeholder="***"
                              className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl text-sm focus:ring-2 focus:ring-orange-500 text-zinc-900 text-center font-mono"
                              required
                              id="input-cardcvv"
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Submission Row */}
                  <button
                    type="submit"
                    className="w-full py-4 px-6 rounded-2xl bg-aspeb-orange hover:bg-aspeb-orange-hover text-white text-sm font-black uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-orange-500/20 cursor-pointer"
                    id="btn-process-payment-submit"
                  >
                    Ativar Benefícios ASPEB
                    <ArrowRight className="h-4.5 w-4.5" />
                  </button>
                </form>
              </motion.div>
            )}

            {/* STEP 2: Processing state loading screen */}
            {step === 2 && (
              <motion.div
                key="billing-loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center py-16 space-y-4 text-center"
              >
                <div className="relative">
                  <Loader2 className="h-16 w-16 text-aspeb-orange animate-spin" />
                  <span className="absolute inset-0 flex items-center justify-center">
                    <ShieldCheck className="h-6 w-6 text-aspeb-orange" />
                  </span>
                </div>
                <div className="space-y-1">
                  <h3 className="font-extrabold text-lg text-zinc-900">
                    Processando sua adesão...
                  </h3>
                  <p className="text-xs text-zinc-400">
                    Criptografando dados e gerando termo de cobertura junto à ASPEB e parceiros.
                  </p>
                </div>
              </motion.div>
            )}

            {/* STEP 3: Success Screen */}
            {step === 3 && (
              <motion.div
                key="billing-success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-6"
              >
                <div className="flex flex-col items-center justify-center text-center space-y-4">
                  <div className="h-16 w-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center shadow-lg shadow-emerald-500/15">
                    <CheckCircle2 className="h-10 w-10 animate-bounce text-emerald-600" />
                  </div>
                  <div>
                    <h3 className="font-black text-2xl text-zinc-900 font-sans tracking-tight">
                      Parabéns, {profile.name}! 🎉
                    </h3>
                    <p className="text-xs text-emerald-600 font-black uppercase tracking-wider mt-1 flex items-center justify-center gap-1.5">
                      <Sparkles className="h-3.5 w-3.5 animate-pulse" /> Proposta Gerada com Sucesso
                    </p>
                  </div>
                </div>

                {/* Personalized Celebration Box */}
                <div className="bg-gradient-to-br from-emerald-50 to-teal-50/50 border border-emerald-100 rounded-2xl p-6 text-center space-y-3 relative overflow-hidden shadow-sm">
                  <div className="absolute top-0 right-0 p-3 opacity-10 pointer-events-none">
                    <Sparkles className="h-14 w-14 text-emerald-600" />
                  </div>
                  <p className="text-zinc-700 text-sm font-sans leading-relaxed">
                    {getConcernCelebrationMessage()}
                  </p>
                  {totalSavings > 0 && (
                    <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-100 text-xs font-extrabold text-emerald-700 mt-2">
                      <CheckCircle2 className="h-4 w-4" />
                      <span>Sua economia estimada é de {formatCurrency(totalSavings)} por mês!</span>
                    </div>
                  )}
                </div>

                {/* PIX QR CODE CONDITIONAL BOX */}
                {paymentMethod === "pix" && (
                  <div className="p-6 bg-zinc-50 border border-zinc-150 rounded-2xl flex flex-col md:flex-row items-center gap-6">
                    <div className="bg-white p-3 rounded-xl border border-zinc-200 shadow-sm shrink-0">
                      {/* Interactive mock QR Code */}
                      <svg className="w-32 h-32 text-zinc-900" viewBox="0 0 100 100">
                        <rect width="100" height="100" fill="white" />
                        <rect x="5" y="5" width="25" height="25" fill="currentColor" />
                        <rect x="10" y="10" width="15" height="15" fill="white" />
                        <rect x="70" y="5" width="25" height="25" fill="currentColor" />
                        <rect x="75" y="10" width="15" height="15" fill="white" />
                        <rect x="5" y="70" width="25" height="25" fill="currentColor" />
                        <rect x="10" y="75" width="15" height="15" fill="white" />
                        {/* Mock points */}
                        <rect x="35" y="5" width="5" height="5" fill="currentColor" />
                        <rect x="45" y="15" width="10" height="5" fill="currentColor" />
                        <rect x="60" y="20" width="5" height="15" fill="currentColor" />
                        <rect x="40" y="40" width="20" height="20" fill="currentColor" />
                        <rect x="15" y="45" width="5" height="10" fill="currentColor" />
                        <rect x="75" y="75" width="20" height="20" fill="currentColor" />
                        <rect x="45" y="75" width="15" height="5" fill="currentColor" />
                      </svg>
                    </div>
                    
                    <div className="space-y-3 flex-1 text-center md:text-left">
                      <h4 className="font-bold text-sm text-zinc-900">
                        Escaneie o código PIX acima
                      </h4>
                      <p className="text-xs text-zinc-500 font-sans leading-relaxed">
                        Abra o aplicativo do seu banco, escolha "Pagar com PIX QR Code" e escaneie. Para pagar no celular, copie o código abaixo:
                      </p>
                      
                      <button
                        onClick={handleCopyPix}
                        className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-extrabold transition cursor-pointer ${
                          isCopied 
                            ? "bg-emerald-600 text-white" 
                            : "bg-aspeb-orange hover:bg-aspeb-orange-hover text-white"
                        }`}
                        id="btn-copy-pix-key"
                      >
                        {isCopied ? (
                          <>
                            <CheckCircle2 className="h-4 w-4" /> Chave Copiada!
                          </>
                        ) : (
                          <>
                            <Copy className="h-4 w-4" /> Copiar Código PIX
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                )}

                {/* Direct Debit message */}
                {paymentMethod === "debito" && (
                  <div className="p-4 bg-purple-50 border border-purple-100 rounded-xl text-xs text-purple-700 text-center leading-relaxed">
                    A autorização de débito automático foi pré-registrada no banco <strong>{bankName.toUpperCase()}</strong>. O primeiro desconto ocorrerá após a assinatura final.
                  </div>
                )}

                {/* Detailed Receipt Summary */}
                <div className="border border-zinc-150 rounded-2xl overflow-hidden text-xs">
                  <div className="bg-zinc-50 p-4 border-b border-zinc-150 flex justify-between font-semibold text-zinc-800">
                    <span>Descrição da Apólice & Benefícios</span>
                    <span>Mensalidade</span>
                  </div>
                  
                  <div className="p-4 space-y-3 text-zinc-600 font-sans">
                    {coverages.map(c => {
                      if (c.value === 0) return null;
                      const cCost = (c.value / c.unitSize) * c.baseRatePerUnit * ageMultiplier;
                      return (
                        <div key={c.id} className="flex justify-between items-center">
                          <span>{c.name} ({formatCurrency(c.value)})</span>
                          <span className="font-mono">{formatCurrency(cCost)}</span>
                        </div>
                      );
                    })}

                    {selectedBenefits.map(b => (
                      <div key={b.id} className="flex justify-between items-center text-emerald-600">
                        <span>{b.title} (Ativo)</span>
                        <span className="font-mono">+ {formatCurrency(b.cost)}</span>
                      </div>
                    ))}

                    {discountAmount > 0 && (
                      <div className="flex justify-between items-center text-emerald-500 font-bold border-t border-zinc-100 pt-2">
                        <span>Desconto Comercial ({paymentMethod.toUpperCase()})</span>
                        <span className="font-mono">- {formatCurrency(discountAmount)}</span>
                      </div>
                    )}

                    <div className="flex justify-between items-center text-sm font-black text-zinc-900 border-t border-zinc-200 pt-3">
                      <span>Valor Final Mensal</span>
                      <span className="font-mono text-aspeb-orange">{formatCurrency(finalCost)}</span>
                    </div>
                  </div>
                </div>

                {/* Action Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                  <button
                    onClick={handleDownloadProposal}
                    className="py-3 px-5 border-2 border-zinc-200 hover:border-zinc-300 text-zinc-700 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition cursor-pointer"
                    id="btn-download-pdf"
                  >
                    <Download className="h-4 w-4" /> Baixar Proposta (.TXT)
                  </button>

                  <button
                    onClick={onClose}
                    className="py-3 px-5 bg-aspeb-orange hover:bg-aspeb-orange-hover text-white rounded-xl text-xs font-black uppercase tracking-wider flex items-center justify-center gap-1.5 transition cursor-pointer"
                    id="btn-finish-success"
                  >
                    Voltar ao Simulador
                  </button>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>

      </motion.div>
    </div>
  );
}
