import React, { useEffect } from 'react';
import { PlayerState } from '../types/game';
import { calculateNetWorth } from '../utils/gameState';
import { soundEngine } from '../utils/audio';
import confetti from 'canvas-confetti';
import { Trophy, Share2, RotateCcw, Cloud, Sparkles, Award } from 'lucide-react';

interface RetirementModalProps {
  player: PlayerState;
  onRestart: () => void;
  onOpenSocialShare: () => void;
  onOpenCloudSync: () => void;
}

export const RetirementModal: React.FC<RetirementModalProps> = ({
  player,
  onRestart,
  onOpenSocialShare,
  onOpenCloudSync,
}) => {
  const netWorth = calculateNetWorth(player);

  useEffect(() => {
    soundEngine.playVictory();
    // Fire festive confetti
    confetti({
      particleCount: 120,
      spread: 80,
      origin: { y: 0.6 },
    });
  }, []);

  const getRankBadge = () => {
    if (netWorth > 1000000) return { title: 'MAGNATE LEGENDARIO', color: 'text-amber-400', grade: 'SSS' };
    if (netWorth > 500000) return { title: 'EMPRESARIO DE ÉLITE', color: 'text-yellow-400', grade: 'SS' };
    if (netWorth > 250000) return { title: 'CAPITALISTA PRÓSPERO', color: 'text-sky-400', grade: 'S' };
    if (netWorth > 100000) return { title: 'JUBILADO ACOMODADO', color: 'text-emerald-400', grade: 'A' };
    return { title: 'AVENTURERO PERSISTENTE', color: 'text-purple-400', grade: 'B' };
  };

  const rank = getRankBadge();

  return (
    <div id="retirement-victory-screen" className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/90 backdrop-blur-md animate-fade-in select-none">
      <div className="bg-slate-950 border-4 border-yellow-400 rounded-3xl w-full max-w-xl shadow-2xl p-6 flex flex-col items-center text-center relative overflow-hidden">
        {/* Glow effect */}
        <div className="absolute top-0 w-full h-32 bg-gradient-to-b from-yellow-500/20 to-transparent pointer-events-none" />

        <div className="p-3 bg-yellow-400 rounded-2xl text-black font-bold mb-3 shadow-lg animate-bounce">
          <Trophy className="w-10 h-10" />
        </div>

        <span className="font-pixel text-xs text-yellow-400 uppercase tracking-widest mb-1">
          ¡HAS LLEGADO AL FINAL DEL TABLERO!
        </span>
        <h2 className="font-pixel text-xl sm:text-2xl text-white font-black mb-2">
          VILLA DE JUBILACIÓN DORADA
        </h2>

        {/* Rank Grade Badge */}
        <div className="flex items-center gap-3 my-3 px-4 py-2 bg-slate-900 border-2 border-yellow-500 rounded-2xl">
          <div className="font-pixel text-2xl text-yellow-400 font-bold">
            {rank.grade}
          </div>
          <div className="text-left">
            <span className="text-[10px] font-pixel text-slate-400 block">RANGO FINAL:</span>
            <span className={`font-pixel text-xs ${rank.color} font-bold`}>
              {rank.title}
            </span>
          </div>
        </div>

        {/* Financial Recap Table */}
        <div className="w-full bg-slate-900/90 border-2 border-slate-800 rounded-xl p-4 mb-4 text-xs font-pixel grid grid-cols-2 gap-3 text-left">
          <div className="p-2 bg-slate-950/80 rounded-lg border border-slate-800">
            <span className="text-[9px] text-slate-400 block">DINERO EN EFECTIVO:</span>
            <span className="text-emerald-400 font-bold">${player.money.toLocaleString()}</span>
          </div>
          <div className="p-2 bg-slate-950/80 rounded-lg border border-slate-800">
            <span className="text-[9px] text-slate-400 block">INVERSIONES:</span>
            <span className="text-yellow-400 font-bold">
              ${player.investments.reduce((acc, i) => acc + i.investedAmount, 0).toLocaleString()}
            </span>
          </div>
          <div className="p-2 bg-slate-950/80 rounded-lg border border-slate-800">
            <span className="text-[9px] text-slate-400 block">CARRERA CULMINADA:</span>
            <span className="text-sky-400 font-bold">{player.career?.title || 'Aventurero'}</span>
          </div>
          <div className="p-2 bg-slate-950/80 rounded-lg border border-slate-800">
            <span className="text-[9px] text-slate-400 block">NIVEL RPG LOGRADO:</span>
            <span className="text-pink-400 font-bold">Nivel {player.level} ({player.unlockedTalents.length} talentos)</span>
          </div>
        </div>

        {/* Grand Net Worth Banner */}
        <div className="w-full bg-gradient-to-r from-yellow-500/20 via-amber-500/30 to-yellow-500/20 border-2 border-yellow-400 rounded-xl p-3 mb-5">
          <span className="font-pixel text-[10px] text-yellow-300 uppercase block mb-0.5">
            FORTUNA NETA DEFINITIVA
          </span>
          <span className="font-pixel text-xl sm:text-2xl text-yellow-400 font-black">
            ${netWorth.toLocaleString()}
          </span>
        </div>

        {/* Action Buttons */}
        <div className="w-full flex flex-col gap-2.5">
          <button
            id="btn-victory-share-social"
            onClick={onOpenSocialShare}
            className="w-full py-3 px-4 bg-yellow-400 hover:bg-yellow-300 text-black font-pixel text-xs font-bold rounded-xl pixel-btn shadow-lg flex items-center justify-center gap-2"
          >
            <Share2 className="w-4 h-4" /> COMPARTIR MI PUNTUACIÓN EN REDES
          </button>

          <div className="grid grid-cols-2 gap-2">
            <button
              id="btn-victory-cloud-save"
              onClick={onOpenCloudSync}
              className="py-2.5 px-3 bg-sky-600 hover:bg-sky-500 text-white font-pixel text-[10px] font-bold rounded-xl pixel-btn flex items-center justify-center gap-1.5"
            >
              <Cloud className="w-4 h-4" /> REGISTRAR EN NUBE
            </button>
            <button
              id="btn-victory-restart"
              onClick={onRestart}
              className="py-2.5 px-3 bg-slate-800 hover:bg-slate-700 text-slate-200 font-pixel text-[10px] font-bold rounded-xl flex items-center justify-center gap-1.5"
            >
              <RotateCcw className="w-4 h-4" /> JUGAR OTRA VEZ
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
