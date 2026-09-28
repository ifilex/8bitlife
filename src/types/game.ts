export type CharacterClassId = 'hacker' | 'entrepreneur' | 'artist' | 'athlete';

export interface Attributes {
  int: number; // Inteligencia / Conocimiento
  cha: number; // Carisma / Relaciones
  vit: number; // Vitalidad / Salud
  lck: number; // Suerte / Fortuna
  cre: number; // Creatividad / Innovación
}

export type TileType = 
  | 'start' 
  | 'crossroad' 
  | 'payday' 
  | 'event' 
  | 'career' 
  | 'investment' 
  | 'lifestyle' 
  | 'casino' 
  | 'hospital' 
  | 'graduation' 
  | 'retirement';

export interface BoardTile {
  id: number;
  label: string;
  type: TileType;
  x: number; // Canvas grid coordinates
  y: number;
  description: string;
  nextTiles: number[]; // Allows branching paths
  branchPrompt?: string; // Optional prompt when choosing at fork
  branchNames?: Record<number, string>; // Labels for branches
}

export interface Career {
  id: string;
  title: string;
  category: 'tech' | 'business' | 'creative' | 'science' | 'adventurer';
  salary: number;
  reqDegree: boolean;
  minLevel: number;
  perk: string;
  icon: string;
}

export interface Lifestyle {
  id: string;
  title: string;
  costPerTurn: number;
  happinessBonus: number;
  description: string;
  icon: string;
}

export interface SpecialAbility {
  id: string;
  name: string;
  description: string;
  cooldownTurns: number;
  currentCooldown: number;
  energyCost: number;
  icon: string;
}

export interface TalentNode {
  id: string;
  name: string;
  branch: 'finance' | 'knowledge' | 'lifestyle';
  description: string;
  cost: number;
  reqNodeId?: string;
  icon: string;
}

export type GameDifficulty = 'easy' | 'normal' | 'hard';

export interface Investment {
  id: string;
  name: string;
  investedAmount: number;
  turnYieldPercent: number; // Passive earnings each payday
  riskLevel: 'low' | 'med' | 'high';
}

export interface PlayerState {
  name: string;
  classId: CharacterClassId;
  level: number;
  xp: number;
  nextLevelXp: number;
  hp: number;
  maxHp: number;
  energy: number;
  maxEnergy: number;
  money: number;
  debt: number;
  salary: number;
  hasDegree: boolean;
  career: Career | null;
  lifestyle: Lifestyle;
  married: boolean;
  spouseName?: string;
  children: number;
  house: { name: string; value: number } | null;
  pets: string[];
  investments: Investment[];
  attributes: Attributes;
  unlockedTalents: string[];
  talentPoints: number;
  specialAbilities: SpecialAbility[];
  currentTileId: number;
  turnsPlayed: number;
  isRetired: boolean;
  historyLog: GameLogEntry[];
  luckyRollActive?: boolean; // Forced 10 next spin
}

export interface GameLogEntry {
  id: string;
  text: string;
  type: 'money' | 'level' | 'event' | 'career' | 'info';
  timestamp: number;
}

export interface RandomEventChoice {
  text: string;
  reqStat?: keyof Attributes;
  reqStatVal?: number;
  successChance?: number; // 0 to 1
  onSuccess: {
    text: string;
    moneyChange?: number;
    xpChange?: number;
    hpChange?: number;
    statBoost?: { stat: keyof Attributes; amount: number };
  };
  onFail?: {
    text: string;
    moneyChange?: number;
    xpChange?: number;
    hpChange?: number;
  };
}

export interface RandomEvent {
  id: string;
  title: string;
  description: string;
  category: 'career' | 'lifestyle' | 'crisis' | 'luck' | 'opportunity';
  choices: RandomEventChoice[];
  imageType?: string;
}

export interface GameSettings {
  difficulty: GameDifficulty;
  soundMuted: boolean;
  musicMuted: boolean;
  sfxVolume: number;
  musicVolume: number;
  crtEffect: boolean;
  animationSpeed: 'normal' | 'fast';
}
