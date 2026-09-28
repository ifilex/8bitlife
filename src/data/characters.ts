import { CharacterClassId, Attributes } from '../types/game';

export interface CharacterArchetype {
  id: CharacterClassId;
  name: string;
  title: string;
  description: string;
  startingAttributes: Attributes;
  startingMoney: number;
  perkDescription: string;
  badgeColor: string;
  spriteColor: string;
}

export const CHARACTER_ARCHETYPES: CharacterArchetype[] = [
  {
    id: 'hacker',
    name: 'Ciber-Mago',
    title: 'Especialista en Algoritmos & Redes',
    description: 'Domina los misterios del código. Aprende más rápido y destaca en profesiones de alta tecnología.',
    startingAttributes: { int: 8, cha: 3, vit: 4, lck: 5, cre: 6 },
    startingMoney: 12000,
    perkDescription: '+25% de XP en eventos tecnológicos y +2 INT inicial.',
    badgeColor: '#3b82f6',
    spriteColor: '#06b6d4',
  },
  {
    id: 'entrepreneur',
    name: 'Mercader Digital',
    title: 'Estratega de Negocios & Ventas',
    description: 'Posee olfato para las oportunidades de mercado y carisma para negociar acuerdos lucrativos.',
    startingAttributes: { int: 5, cha: 8, vit: 5, lck: 6, cre: 4 },
    startingMoney: 18000,
    perkDescription: '+15% de dinero en cada día de cobro y +2 CHA inicial.',
    badgeColor: '#eab308',
    spriteColor: '#f59e0b',
  },
  {
    id: 'artist',
    name: 'Bardo Creativo',
    title: 'Visionario del Diseño & Arte',
    description: 'Crea obras que conmueven al mundo. Supera la rutina con soluciones laterales inesperadas.',
    startingAttributes: { int: 4, cha: 6, vit: 4, lck: 7, cre: 9 },
    startingMoney: 10000,
    perkDescription: '+50% de probabilidad de eventos afortunados y +3 CRE inicial.',
    badgeColor: '#ec4899',
    spriteColor: '#a855f7',
  },
  {
    id: 'athlete',
    name: 'Paladín Urbano',
    title: 'Atleta de Alto Rendimiento',
    description: 'Cuerpo sano, mente disciplinada. Resiste el estrés de la vida moderna y protege su salud.',
    startingAttributes: { int: 4, cha: 5, vit: 9, lck: 5, cre: 3 },
    startingMoney: 14000,
    perkDescription: '+50 HP/Energía máxima y reduce pérdidas en emergencias.',
    badgeColor: '#10b981',
    spriteColor: '#22c55e',
  },
];
