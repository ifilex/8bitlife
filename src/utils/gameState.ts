import { 
  PlayerState, 
  GameDifficulty, 
  CharacterClassId, 
  Career, 
  Investment, 
  GameLogEntry 
} from '../types/game';
import { CHARACTER_ARCHETYPES } from '../data/characters';
import { CAREERS_LIST, LIFESTYLES_LIST } from '../data/careers';
import { INITIAL_SPECIAL_ABILITIES } from '../data/talentsData';

const LOCAL_STORAGE_KEY = '8bit_life_rpg_save_v1';

export function createNewPlayer(name: string, classId: CharacterClassId, difficulty: GameDifficulty): PlayerState {
  const archetype = CHARACTER_ARCHETYPES.find(a => a.id === classId) || CHARACTER_ARCHETYPES[0];
  
  let startingMoney = archetype.startingMoney;
  let maxHp = 100;
  if (difficulty === 'easy') {
    startingMoney += 8000;
    maxHp = 120;
  } else if (difficulty === 'hard') {
    startingMoney = Math.max(2000, startingMoney - 4000);
    maxHp = 80;
  }

  const defaultCareer: Career = CAREERS_LIST[0]; // Becario
  const defaultLifestyle = LIFESTYLES_LIST[0]; // Frugal

  return {
    name: name.trim() || 'Héroe Pixel',
    classId,
    level: 1,
    xp: 0,
    nextLevelXp: 250,
    hp: maxHp,
    maxHp,
    energy: 100,
    maxEnergy: 100,
    money: startingMoney,
    debt: 0,
    salary: defaultCareer.salary,
    hasDegree: false,
    career: defaultCareer,
    lifestyle: defaultLifestyle,
    married: false,
    children: 0,
    house: null,
    pets: [],
    investments: [],
    attributes: { ...archetype.startingAttributes },
    unlockedTalents: [],
    talentPoints: 1, // Start with 1 TP
    specialAbilities: [...INITIAL_SPECIAL_ABILITIES],
    currentTileId: 0,
    turnsPlayed: 0,
    isRetired: false,
    historyLog: [
      {
        id: 'init_1',
        text: `¡Bienvenido a 8-Bit Life RPG, ${name || 'Aventurero'}! Tu odisea comienza en la casilla de Salida.`,
        type: 'info',
        timestamp: Date.now(),
      }
    ],
  };
}

export function calculateNetWorth(player: PlayerState): number {
  const investmentsTotal = player.investments.reduce((sum, inv) => sum + inv.investedAmount, 0);
  const houseValue = player.house ? player.house.value : 0;
  return player.money + investmentsTotal + houseValue - player.debt;
}

export function checkLevelUp(player: PlayerState): { leveledUp: boolean; updatedPlayer: PlayerState } {
  let p = { ...player };
  let leveled = false;

  while (p.xp >= p.nextLevelXp) {
    p.xp -= p.nextLevelXp;
    p.level += 1;
    p.nextLevelXp = Math.floor(p.nextLevelXp * 1.35);
    p.talentPoints += 2; // +2 Talent Points per level
    p.hp = p.maxHp;
    p.energy = p.maxEnergy;
    leveled = true;

    p.historyLog = [
      {
        id: 'lvl_' + Date.now() + Math.random(),
        text: `⭐ ¡NIVEL ${p.level} ALCANZADO! Recibes +2 Puntos de Talento y tu salud se restaura al máximo.`,
        type: 'level',
        timestamp: Date.now(),
      },
      ...p.historyLog.slice(0, 30),
    ];
  }

  return { leveledUp: leveled, updatedPlayer: p };
}

export function saveGameToLocal(player: PlayerState, difficulty: GameDifficulty, syncCode?: string): void {
  try {
    const payload = {
      player,
      difficulty,
      syncCode: syncCode || 'LIFE-RETRO',
      savedAt: Date.now(),
    };
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(payload));
  } catch (e) {
    console.warn('LocalStorage save error:', e);
  }
}

export function loadGameFromLocal(): { player: PlayerState; difficulty: GameDifficulty; syncCode: string } | null {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (e) {
    return null;
  }
}

export function clearLocalSave(): void {
  try {
    localStorage.removeItem(LOCAL_STORAGE_KEY);
  } catch (e) {}
}
