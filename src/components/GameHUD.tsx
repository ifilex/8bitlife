import React from 'react';
import { PlayerState, SpecialAbility } from '../types/game';
import { soundEngine } from '../utils/audio';
import { 
  Heart, 
  Zap, 
  DollarSign, 
  Sparkles, 
  Briefcase, 
  Cloud, 
  Share2, 
  Settings, 
  HelpCircle, 
  Save, 
  TrendingUp 
} from 'lucide-react';

interface GameHUDProps {
  player: PlayerState;
  onOpenTalents: () => void;
  onOpenCareerLifestyle: () => void;
  onOpenCloudSync: () => void;
  onOpenSocialShare: () => void;
  onOpenSettings: () => void;
  onOpenHelp: () => void;
  onCastAbility: (ability: SpecialAbility) => void;
  isAutoSaving?: boolean;
}

export const GameHUD: React.FC<GameHUDProps> = ({
  player,
  onOpenTalents,
  onOpenCareerLifestyle,
  onOpenCloudSync,
  onOpenSocialShare,
  onOpenSettings,
  onOpenHelp,
  onCastAbility,
  isAutoSaving = false,
}) => {
  const xpPct = Math.min(100, Math.round((player.xp / player.nextLevelXp) * 100));
  const hpPct = Math.min(100, Math.round((player.hp / player.maxHp) * 100));

  return (
    <header id="game-hud" className="w-full bg-slate-900 border-b-4 border-yellow-500 shadow-xl px-3 py-2.5 flex flex-col gap-2.5 z-40 select-none">
      {/* Upper Row: Player info, stats, money, quick actions */}
      <div className="flex flex-wrap items-center justify-between gap-2.5">
        {/* Left: Avatar & Identity */}
        <div className="flex items-center gap-2.5">
          {/* Avatar Box */}
          <div className="w-12 h-12 bg-slate-950 border-2 border-yellow-400 rounded-xl flex items-center justify-center text-2xl shadow-inner relative">
            <span>🧙‍♂️</span>
            <div className="absolute -bottom-1.5 -right-1.5 bg-yellow-400 text-black font-pixel text-[8px] font-bold px-1 rounded-full shadow">
              Nv.{player.level}
            </div>
          </div>

          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <h2 className="font-pixel text-xs text-white">{player.name}</h2>
              <span className="text-[10px] text-slate-400 font-pixel">({player.career?.title || 'Estudiante'})</span>
            </div>

            {/* Health and XP Bars */}
            <div className="flex items-center gap-2 mt-1">
              {/* HP Bar */}
              <div className="flex items-center gap-1">
                <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
                <div className="w-16 sm:w-20 h-2 bg-slate-950 rounded-full border border-slate-700 overflow-hidden">
                  <div
                    className="h-full bg-rose-500 transition-all duration-300"
                    style={{ width: `${hpPct}%` }}
                  />
                </div>
                <span className="text-[9px] font-pixel text-slate-300">{player.hp}/{player.maxHp}</span>
              </div>

              {/* XP Bar */}
              <div className="hidden sm:flex items-center gap-1">
                <Zap className="w-3.5 h-3.5 text-sky-400 fill-sky-400" />
                <div className="w-16 sm:w-20 h-2 bg-slate-950 rounded-full border border-slate-700 overflow-hidden">
                  <div
                    className="h-full bg-sky-400 transition-all duration-300"
                    style={{ width: `${xpPct}%` }}
                  />
                </div>
                <span className="text-[9px] font-pixel text-slate-300">{xpPct}%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Center: Money & Finances */}
        <div className="flex items-center gap-3 bg-slate-950/80 px-3.5 py-1.5 rounded-xl border-2 border-slate-800">
          <div className="flex flex-col">
            <span className="text-[9px] font-pixel text-slate-400">DINERO EN BANCO:</span>
            <div className="flex items-center gap-1 text-emerald-400 font-pixel text-sm sm:text-base font-bold">
              <DollarSign className="w-4 h-4" />
              <span>{player.money.toLocaleString()}</span>
            </div>
          </div>

          <div className="hidden md:flex flex-col border-l border-slate-800 pl-3">
            <span className="text-[9px] font-pixel text-slate-400">SALARIO BASE:</span>
            <span className="text-yellow-400 font-pixel text-xs">
              +${player.salary.toLocaleString()}
            </span>
          </div>

          {player.debt > 0 && (
            <div className="flex flex-col border-l border-slate-800 pl-3 text-rose-400">
              <span className="text-[9px] font-pixel">DEUDA:</span>
              <span className="font-pixel text-xs">-${player.debt.toLocaleString()}</span>
            </div>
          )}

          {/* Auto-Save Pulsing Indicator */}
          <div className="flex items-center gap-1 text-[10px] font-pixel text-slate-400" title="Guardado automático local y en nube activo">
            <Save className={`w-3.5 h-3.5 ${isAutoSaving ? 'text-emerald-400 animate-spin' : 'text-slate-500'}`} />
            <span className="hidden xl:inline text-[8px] text-emerald-400">AUTO-SAVE</span>
          </div>
        </div>

        {/* Right: Quick Action Modals Trigger Buttons */}
        <div className="flex items-center gap-1.5">
          {/* Talent Tree Button */}
          <button
            id="hud-btn-talents"
            onClick={() => {
              soundEngine.playSelect();
              onOpenTalents();
            }}
            className="relative px-2.5 py-1.5 bg-yellow-500 hover:bg-yellow-400 text-slate-950 font-pixel text-[10px] font-bold rounded-lg pixel-btn flex items-center gap-1"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">TALENTOS</span>
            {player.talentPoints > 0 && (
              <span className="absolute -top-2 -right-2 bg-rose-600 text-white font-pixel text-[8px] px-1.5 py-0.5 rounded-full border border-white animate-bounce">
                +{player.talentPoints}
              </span>
            )}
          </button>

          {/* Career & Lifestyle Button */}
          <button
            id="hud-btn-career"
            onClick={() => {
              soundEngine.playSelect();
              onOpenCareerLifestyle();
            }}
            className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-pixel text-[10px] rounded-lg border border-slate-700 flex items-center gap-1"
          >
            <Briefcase className="w-3.5 h-3.5 text-teal-400" />
            <span className="hidden sm:inline">CARRERA</span>
          </button>

          {/* Cloud Sync Button */}
          <button
            id="hud-btn-cloud"
            onClick={() => {
              soundEngine.playSelect();
              onOpenCloudSync();
            }}
            className="px-2.5 py-1.5 bg-sky-600 hover:bg-sky-500 text-white font-pixel text-[10px] rounded-lg pixel-btn flex items-center gap-1"
            title="Sincronizar en la nube"
          >
            <Cloud className="w-3.5 h-3.5" />
            <span className="hidden lg:inline">NUBE</span>
          </button>

          {/* Social Share Button */}
          <button
            id="hud-btn-share"
            onClick={() => {
              soundEngine.playSelect();
              onOpenSocialShare();
            }}
            className="px-2.5 py-1.5 bg-purple-600 hover:bg-purple-500 text-white font-pixel text-[10px] rounded-lg pixel-btn flex items-center gap-1"
            title="Compartir puntuación"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span className="hidden lg:inline">COMPARTIR</span>
          </button>

          {/* Help Button */}
          <button
            id="hud-btn-help"
            onClick={() => {
              soundEngine.playSelect();
              onOpenHelp();
            }}
            className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg"
            title="Ayuda y manual"
          >
            <HelpCircle className="w-4 h-4" />
          </button>

          {/* Settings Button */}
          <button
            id="hud-btn-settings"
            onClick={() => {
              soundEngine.playSelect();
              onOpenSettings();
            }}
            className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg"
            title="Ajustes de juego"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Lower Row: Attribute Chips & Special Abilities Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-slate-800/80">
        {/* RPG Attributes Display */}
        <div className="flex items-center gap-1.5 text-[10px] font-pixel">
          <span className="text-slate-400 mr-1 hidden sm:inline">STATS:</span>
          <span className="px-1.5 py-0.5 rounded bg-blue-950/80 text-blue-300 border border-blue-800" title="Inteligencia">
            INT {player.attributes.int}
          </span>
          <span className="px-1.5 py-0.5 rounded bg-amber-950/80 text-amber-300 border border-amber-800" title="Carisma">
            CHA {player.attributes.cha}
          </span>
          <span className="px-1.5 py-0.5 rounded bg-emerald-950/80 text-emerald-300 border border-emerald-800" title="Vitalidad / Salud">
            VIT {player.attributes.vit}
          </span>
          <span className="px-1.5 py-0.5 rounded bg-purple-950/80 text-purple-300 border border-purple-800" title="Suerte">
            LCK {player.attributes.lck}
          </span>
          <span className="px-1.5 py-0.5 rounded bg-pink-950/80 text-pink-300 border border-pink-800" title="Creatividad">
            CRE {player.attributes.cre}
          </span>
        </div>

        {/* Active Special Abilities Cast Bar */}
        <div className="flex items-center gap-1.5">
          <span className="text-[9px] font-pixel text-yellow-400 mr-1">HABILIDADES:</span>
          {player.specialAbilities.map(ability => {
            const isReady = ability.currentCooldown === 0;

            return (
              <button
                key={ability.id}
                id={`btn-ability-${ability.id}`}
                onClick={() => {
                  if (isReady) {
                    onCastAbility(ability);
                  } else {
                    soundEngine.playDamage();
                  }
                }}
                disabled={!isReady}
                className={`px-2 py-0.5 rounded font-pixel text-[9px] flex items-center gap-1 transition-all ${
                  isReady
                    ? 'bg-amber-400 hover:bg-amber-300 text-black font-bold pixel-btn shadow'
                    : 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed'
                }`}
                title={ability.description}
              >
                <Sparkles className="w-2.5 h-2.5" />
                <span>{ability.name}</span>
                {!isReady && <span>({ability.currentCooldown}t)</span>}
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
