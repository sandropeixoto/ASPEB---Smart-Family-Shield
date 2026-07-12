import { Coverage, Benefit, UserProfile } from "../types";

export const getAgeMultiplier = (age: number): number => {
  if (age <= 30) return 1.0;
  if (age <= 40) return 1.15;
  if (age <= 50) return 1.35;
  if (age <= 60) return 1.75;
  return 2.5;
};

export const INITIAL_COVERAGES: Omit<Coverage, "value" | "recommendedValue">[] = [
  {
    id: "morte",
    name: "Morte Qualquer Causa",
    shortDescription: "Proteção financeira para seus beneficiários em caso de falecimento do titular.",
    description: "Garante o pagamento de um capital segurado livre de impostos e inventários para sua família ou beneficiários indicados, assegurando a manutenção do padrão de vida e o futuro de quem você ama. Seguro garantido pela Icatu Seguros.",
    min: 10000,
    max: 150000,
    step: 10000,
    baseRatePerUnit: 1.25, // R$ 1,25 por R$ 10.000 de cobertura
    unitSize: 10000,
    unitLabel: "R$",
    icon: "Heart"
  },
  {
    id: "invalidez",
    name: "Invalidez por Acidente (IPA)",
    shortDescription: "Amparo financeiro caso você sofra invalidez permanente total ou parcial.",
    description: "Caso você sofra um acidente pessoal que resulte na perda definitiva, total ou parcial, do uso de membros ou órgãos, você recebe a indenização diretamente para custear tratamentos, adaptações ou suprir a falta de renda de forma digna. Seguro garantido pela Icatu Seguros.",
    min: 10000,
    max: 150000,
    step: 10000,
    baseRatePerUnit: 0.85, // R$ 0,85 por R$ 10.000 de cobertura
    unitSize: 10000,
    unitLabel: "R$",
    icon: "Accessibility"
  }
];

export const INITIAL_BENEFITS: Benefit[] = [
  {
    id: "consultas_matriz",
    title: "Consultas Gratuitas na Matriz",
    provider: "Consultórios Próprios ASPEB",
    description: "Direito a até 9 consultas anuais totalmente pagas pela ASPEB nas especialidades disponíveis nos consultórios de nossa Matriz em Belém/PA.",
    cost: 15.00,
    estimatedSavings: 450.00, // Baseado em economia média anual de consultas particulares
    icon: "Activity",
    tag: "Saúde",
    isSelected: true
  },
  {
    id: "saude_rede",
    title: "Rede Conveniada de Saúde",
    provider: "+1.000 Credenciados no Brasil",
    description: "Acesso a consultas médicas e odontológicas com até 50% de desconto em uma ampla rede nacional de clínicas e laboratórios parceiros da ASPEB.",
    cost: 12.00,
    estimatedSavings: 180.00, // Economia anual estimada de exames e consultas externas
    icon: "PlusCircle",
    tag: "Saúde",
    isSelected: true
  },
  {
    id: "funeral",
    title: "Assistência Funeral Familiar",
    provider: "Icatu Assistência 24h",
    description: "Amparo completo para o sepultamento ou cremação, cobrindo o titular, cônjuge e filhos de até 21 anos em qualquer lugar do Brasil.",
    cost: 9.50,
    estimatedSavings: 3500.00, // Custo médio de um funeral evitado por completo
    icon: "ShieldAlert",
    tag: "Segurança",
    isSelected: true
  },
  {
    id: "sorteios",
    title: "Sorteios Mensais R$ 12.000",
    provider: "Icatu Capitalização",
    description: "Concorra automaticamente a 4 prêmios mensais de R$ 12.000,00 cada. Sorteios semanais lastreados por Título de Capitalização via Loteria Federal.",
    cost: 8.00,
    estimatedSavings: 12000.00, // Valor máximo do prêmio de sorteio mensal
    icon: "Award",
    tag: "Prêmios",
    isSelected: true
  },
  {
    id: "farmacia",
    title: "Desconto em Farmácias",
    provider: "+15.000 Farmácias Credenciadas",
    description: "Até 80% de desconto em medicamentos de marca e genéricos na rede Droga Raia, Drogasil, Pague Menos e outras farmácias parceiras.",
    cost: 4.90,
    estimatedSavings: 60.00, // Economia estimada com remédios de uso frequente
    icon: "Pills",
    tag: "Economia",
    isSelected: false
  },
  {
    id: "app_aspeb",
    title: "Aplicativo ASPEB Cliente",
    provider: "Disponível para iOS e Android",
    description: "Sua carteirinha digital sempre à mão, consulta fácil à Rede Credenciada próxima, extratos e novidades no app de forma intuitiva.",
    cost: 0.00,
    estimatedSavings: 15.00, // Comodidade, sem cobrança extra de emissão física
    icon: "Smartphone",
    tag: "Tecnologia",
    isSelected: false
  }
];

export const getRecommendations = (profile: UserProfile) => {
  // Configurando valores recomendados com base na idade e profissão do associado
  const recommendations: { [id: string]: number } = {
    morte: 50000,
    invalidez: 50000
  };

  const preselectedBenefits = ["consultas_matriz", "saude_rede", "funeral", "sorteios"];

  if (profile.profession === "autonomo") {
    recommendations.invalidez = 80000; // Autônomo depende mais de sua integridade física
  } else if (profile.profession === "clt") {
    recommendations.morte = 60000;
  } else if (profile.profession === "empresario") {
    recommendations.morte = 120000;
    recommendations.invalidez = 100000;
  } else if (profile.profession === "servidor") {
    recommendations.morte = 80000;
    recommendations.invalidez = 80000;
  }

  // Ajustes de preocupação do associado
  if (profile.concern === "incapacidade") {
    recommendations.invalidez = Math.max(recommendations.invalidez, 90000);
  } else if (profile.concern === "familia") {
    recommendations.morte = Math.max(recommendations.morte, 100000);
  } else if (profile.concern === "doencas" || profile.concern === "saude") {
    // Foco especial na rede de saúde
    if (!preselectedBenefits.includes("saude_rede")) {
      preselectedBenefits.push("saude_rede");
    }
  }

  // Balanceamento por idade para manter custo baixo
  if (profile.age > 55) {
    recommendations.morte = Math.min(recommendations.morte, 50000);
    recommendations.invalidez = Math.min(recommendations.invalidez, 40000);
  }

  return {
    coverages: recommendations,
    preselectedBenefits
  };
};

export const calculateSingleCoverageCost = (
  id: string,
  value: number,
  age: number
): number => {
  const template = INITIAL_COVERAGES.find((c) => c.id === id);
  if (!template || value <= 0) return 0;

  const ageMultiplier = getAgeMultiplier(age);
  const units = value / template.unitSize;
  const rawCost = units * template.baseRatePerUnit;

  return Number((rawCost * ageMultiplier).toFixed(2));
};
