import React, { useState, useEffect } from 'react';
import { GameDifficulty, CharacterClassId, PlayerState } from '../types/game';
import { CHARACTER_ARCHETYPES } from '../data/characters';
import { soundEngine } from '../utils/audio';
import { loadGameFromLocal } from '../utils/gameState';
import { 
  Play, 
  RotateCcw, 
  Cloud, 
  HelpCircle, 
  Settings, 
  Trophy, 
  Sparkles, 
  Volume2, 
  VolumeX, 
  ShieldCheck 
} from 'lucide-react';

interface StartMenuProps {
  onStartNewGame: (name: string, classId: CharacterClassId, difficulty: GameDifficulty) => void;
  onResumeGame: () => void;
  onOpenCloudLoad: () => void;
  onOpenHelp: () => void;
  onOpenSettings: () => void;
  hasSavedGame: boolean;
}

export const StartMenu: React.FC<StartMenuProps> = ({
  onStartNewGame,
  onResumeGame,
  onOpenCloudLoad,
  onOpenHelp,
  onOpenSettings,
  hasSavedGame,
}) => {
  const [viewState, setViewState] = useState<'menu' | 'character_creator' | 'leaderboard'>('menu');
  const [selectedClass, setSelectedClass] = useState<CharacterClassId>('hacker');
  const [playerName, setPlayerName] = useState('');
  const [difficulty, setDifficulty] = useState<GameDifficulty>('normal');
  const [hallOfFame, setHallOfFame] = useState<any[]>([]);
  const [loadingHall, setLoadingHall] = useState(false);

  // Fetch hall of fame from cloud
  const fetchHallOfFame = async () => {
    setLoadingHall(true);
    try {
      const res = await fetch('/api/hall-of-fame');
      const data = await res.json();
      if (data.records) setHallOfFame(data.records);
    } catch (e) {
      setHallOfFame([]);
    } finally {
      setLoadingHall(false);
    }
  };

  const handleStartGameSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    soundEngine.playLevelUp();
    onStartNewGame(playerName, selectedClass, difficulty);
  };

  return (
    <div id="start-menu-screen" className="relative w-full min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 select-none overflow-hidden">
      {/* Background Animated Pixel Stars */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-25"
        style={{
          backgroundImage: `radial-gradient(#fbbf24 1px, transparent 1px), radial-gradient(#38bdf8 1px, transparent 1px)`,
          backgroundSize: '32px 32px, 48px 48px',
          backgroundPosition: '0 0, 16px 16px',
        }}
      />

      {/* Floating Retro Sprite Accent: Pixel Car bouncing */}
      <div className="absolute top-8 left-8 hidden lg:flex items-center gap-2 text-yellow-400 font-pixel text-xs animate-bounce">
        <span>🚗💨</span>
        <span>¡VIVE TU DESTINO!</span>
      </div>

      <div className="relative z-10 w-full max-w-xl flex flex-col items-center">
        {/* Main Logo & Title */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-yellow-500 text-black font-pixel text-[10px] rounded-full font-bold mb-3 shadow-lg">
            <Sparkles className="w-3.5 h-3.5" /> EDICIÓN RPG RETRO 8-BIT
          </div>

          <h1 className="font-pixel text-3xl sm:text-4xl text-yellow-400 tracking-wider drop-shadow-[0_4px_0_#92400e]">
            EL JUEGO DE LA VIDA
          </h1>
          <h2 className="font-silkscreen text-lg sm:text-xl text-sky-400 tracking-widest mt-1">
            ~ 8-BIT LIFE RPG ~
          </h2>
        </div>

        {/* VIEW 1: MAIN MENU BUTTONS */}
        {viewState === 'menu' && (
          <div className="w-full bg-slate-900/90 border-4 border-yellow-500 rounded-2xl p-6 shadow-2xl flex flex-col gap-3.5">
            {/* New Game Button */}
            <button
              id="btn-menu-new-game"
              onClick={() => {
                soundEngine.playSelect();
                setViewState('character_creator');
              }}
              className="w-full py-3.5 px-4 bg-yellow-400 hover:bg-yellow-300 text-black font-pixel text-xs sm:text-sm font-bold rounded-xl pixel-btn transition-all flex items-center justify-center gap-2 shadow-lg"
            >
              <Play className="w-4 h-4 fill-black" /> NUEVA PARTIDA
            </button>

            {/* Resume Button */}
            <button
              id="btn-menu-resume"
              onClick={() => {
                if (hasSavedGame) {
                  soundEngine.playSelect();
                  onResumeGame();
                } else {
                  soundEngine.playDamage();
                }
              }}
              disabled={!hasSavedGame}
              className={`w-full py-3 px-4 font-pixel text-xs font-bold rounded-xl pixel-btn transition-all flex items-center justify-center gap-2 ${
                hasSavedGame
                  ? 'bg-emerald-500 hover:bg-emerald-400 text-black cursor-pointer shadow'
                  : 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed opacity-60'
              }`}
            >
              <RotateCcw className="w-4 h-4" /> CONTINUAR PARTIDA GUARDADA
            </button>

            {/* Cloud Sync Load Button */}
            <button
              id="btn-menu-cloud-load"
              onClick={() => {
                soundEngine.playSelect();
                onOpenCloudLoad();
              }}
              className="w-full py-3 px-4 bg-sky-600 hover:bg-sky-500 text-white font-pixel text-xs font-bold rounded-xl pixel-btn transition-all flex items-center justify-center gap-2"
            >
              <Cloud className="w-4 h-4" /> CARGAR DE LA NUBE (MULTI-DISPOSITIVO)
            </button>

            {/* Hall of Fame / Leaderboard */}
            <button
              id="btn-menu-hall-of-fame"
              onClick={() => {
                soundEngine.playSelect();
                fetchHallOfFame();
                setViewState('leaderboard');
              }}
              className="w-full py-2.5 px-4 bg-purple-600 hover:bg-purple-500 text-white font-pixel text-xs font-bold rounded-xl pixel-btn transition-all flex items-center justify-center gap-2"
            >
              <Trophy className="w-4 h-4" /> SALÓN DE LA FAMA
            </button>

            {/* Secondary Option Buttons (Help, Settings) */}
            <div className="grid grid-cols-2 gap-3 mt-1">
              <button
                id="btn-menu-help"
                onClick={() => {
                  soundEngine.playSelect();
                  onOpenHelp();
                }}
                className="py-2.5 px-3 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 rounded-xl font-pixel text-[11px] flex items-center justify-center gap-1.5"
              >
                <HelpCircle className="w-4 h-4 text-sky-400" /> REGLAS & AYUDA
              </button>

              <button
                id="btn-menu-settings"
                onClick={() => {
                  soundEngine.playSelect();
                  onOpenSettings();
                }}
                className="py-2.5 px-3 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 rounded-xl font-pixel text-[11px] flex items-center justify-center gap-1.5"
              >
                <Settings className="w-4 h-4 text-amber-400" /> AJUSTES
              </button>
            </div>
          </div>
        )}

        {/* VIEW 2: CHARACTER CREATION & DIFFICULTY SELECTOR */}
        {viewState === 'character_creator' && (
          <form
            onSubmit={handleStartGameSubmit}
            className="w-full bg-slate-900/95 border-4 border-yellow-500 rounded-2xl p-5 sm:p-6 shadow-2xl flex flex-col gap-4 max-h-[88vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
              <h3 className="font-pixel text-sm text-yellow-400">CREA TU PERSONAJE</h3>
              <button
                type="button"
                onClick={() => {
                  soundEngine.playCancel();
                  setViewState('menu');
                }}
                className="text-slate-400 hover:text-white font-pixel text-xs"
              >
                ✕ VOLVER
              </button>
            </div>

            {/* Name Input */}
            <div>
              <label className="block font-pixel text-xs text-slate-300 mb-1.5">
                NOMBRE DEL AVENTURERO:
              </label>
              <input
                type="text"
                id="input-player-name"
                value={playerName}
                onChange={e => setPlayerName(e.target.value)}
                placeholder="Ej: Mario Pixel, Ada Lovelace..."
                maxLength={24}
                className="w-full bg-slate-950 border-2 border-slate-700 rounded-xl px-3 py-2.5 font-pixel text-xs text-white placeholder-slate-600 focus:outline-none focus:border-yellow-400"
              />
            </div>

            {/* Archetype / Class Selection */}
            <div>
              <label className="block font-pixel text-xs text-slate-300 mb-1.5">
                ELIGE TU ARQUETIPO INICIAL:
              </label>
              <div className="grid grid-cols-2 gap-2.5">
                {CHARACTER_ARCHETYPES.map(arch => {
                  const isSelected = selectedClass === arch.id;

                  return (
                    <div
                      key={arch.id}
                      onClick={() => {
                        soundEngine.playSelect();
                        setSelectedClass(arch.id);
                      }}
                      className={`p-3 rounded-xl border-2 cursor-pointer transition-all ${
                        isSelected
                          ? 'bg-yellow-500/20 border-yellow-400 shadow-md'
                          : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-pixel text-xs text-white font-bold">{arch.name}</span>
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: arch.badgeColor }}
                        />
                      </div>
                      <p className="text-[11px] text-slate-400 line-clamp-2 leading-tight">
                        {arch.description}
                      </p>
                      <div className="mt-2 text-[10px] font-pixel text-yellow-300">
                        {arch.perkDescription}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Difficulty Selector */}
            <div>
              <label className="block font-pixel text-xs text-slate-300 mb-1.5">
                SELECTOR DE DIFICULTAD:
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'easy' as const, label: 'NOVATO', desc: 'Más dinero inicial, eventos amigables, +25% XP' },
                  { id: 'normal' as const, label: 'VIDA REAL', desc: 'Equilibrio clásico de retos y recompensas' },
                  { id: 'hard' as const, label: 'HARDCORE', desc: 'Gastos altos, eventos despiadados, crisis' },
                ].map(d => {
                  const isCur = difficulty === d.id;

                  return (
                    <button
                      key={d.id}
                      type="button"
                      id={`btn-difficulty-${d.id}`}
                      onClick={() => {
                        soundEngine.playSelect();
                        setDifficulty(d.id);
                      }}
                      className={`p-2 rounded-xl border-2 text-center transition-all ${
                        isCur
                          ? 'bg-yellow-400 text-black border-yellow-300 font-bold shadow'
                          : 'bg-slate-950 text-slate-300 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <span className="font-pixel text-[11px] block">{d.label}</span>
                      <span className={`text-[9px] block mt-0.5 line-clamp-2 ${isCur ? 'text-slate-900' : 'text-slate-400'}`}>
                        {d.desc}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Launch Game Button */}
            <button
              type="submit"
              id="btn-submit-new-game"
              className="w-full mt-2 py-3.5 px-4 bg-emerald-400 hover:bg-emerald-300 text-black font-pixel text-xs sm:text-sm font-bold rounded-xl pixel-btn shadow-lg flex items-center justify-center gap-2"
            >
              ¡COMENZAR AVENTURA! 🎮
            </button>
          </form>
        )}

        {/* VIEW 3: LEADERBOARD / HALL OF FAME */}
        {viewState === 'leaderboard' && (
          <div className="w-full bg-slate-900/95 border-4 border-yellow-500 rounded-2xl p-6 shadow-2xl flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <div className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-yellow-400" />
                <h3 className="font-pixel text-sm text-yellow-400">SALÓN DE LA FAMA</h3>
              </div>
              <button
                onClick={() => {
                  soundEngine.playCancel();
                  setViewState('menu');
                }}
                className="text-slate-400 hover:text-white font-pixel text-xs"
              >
                ✕ VOLVER
              </button>
            </div>

            {loadingHall ? (
              <div className="p-8 text-center font-pixel text-xs text-slate-400 animate-pulse">
                Cargando registros de la nube...
              </div>
            ) : hallOfFame.length === 0 ? (
              <div className="p-6 text-center text-slate-400 text-xs">
                Aún no hay partidas públicas en la nube. ¡Sé el primero en triunfar y guardar tu récord!
              </div>
            ) : (
              <div className="flex flex-col gap-2 max-h-60 overflow-y-auto">
                {hallOfFame.map((rec, i) => (
                  <div
                    key={rec.code || i}
                    className="flex items-center justify-between p-2.5 bg-slate-950 rounded-xl border border-slate-800 text-xs font-pixel"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-yellow-400 font-bold">#{i + 1}</span>
                      <span className="text-white">{rec.playerName}</span>
                      <span className="text-slate-500 text-[10px]">({rec.career})</span>
                    </div>
                    <span className="text-emerald-400 font-bold">
                      ${(rec.money || 0).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Footer Info */}
      <div className="mt-8 text-center text-[10px] font-pixel text-slate-400">
        Inspirado en el clásico Juego de la Vida • Gráficos 8-Bit & Chiptune Audio
      </div>
    </div>
  );
};
