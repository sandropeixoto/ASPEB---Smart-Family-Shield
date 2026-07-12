export interface UserProfile {
  age: number;
  profession: string;
  concern: string;
  name: string;
}

export interface Coverage {
  id: string;
  name: string;
  shortDescription: string;
  description: string;
  min: number;
  max: number;
  step: number;
  baseRatePerUnit: number; // rate per unit (e.g. per 100,000 or per 3,000)
  unitSize: number; // e.g. 100000 or 3000
  value: number; // current selected coverage value
  recommendedValue: number;
  unitLabel: string; // e.g. "R$"
  icon: string;
}

export interface Benefit {
  id: string;
  title: string;
  provider: string;
  description: string;
  cost: number;
  estimatedSavings: number;
  icon: string;
  tag: string;
  isSelected: boolean;
}

export interface SimulationResult {
  id: string;
  date: string;
  profile: UserProfile;
  coverages: { [id: string]: number };
  benefits: string[];
  totalPremium: number;
  totalBenefitsCost: number;
  totalSavings: number;
  netCost: number;
  paymentMethod: string;
}
