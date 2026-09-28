import React, { useState } from 'react';
import { PlayerState } from '../types/game';
import { calculateNetWorth } from '../utils/gameState';
import { soundEngine } from '../utils/audio';
import { Trophy, Share2, Copy, Check, ExternalLink, Sparkles } from 'lucide-react';

interface SocialShareModalProps {
  player: PlayerState;
  onClose: () => void;
}

export const SocialShareModal: React.FC<SocialShareModalProps> = ({ player, onClose }) => {
  const [copied, setCopied] = useState(false);
  const netWorth = calculateNetWorth(player);

  const getHonoraryTitle = () => {
    if (netWorth > 1000000) return '🏆 MAGNATE PIXELADO LEGENDARIO';
    if (netWorth > 500000) return '🎩 MILLONARIO DE ÉLITE';
    if (netWorth > 200000) return '💼 EMPRESARIO PRÓSPERO';
    if (netWorth > 50000) return '🌟 AVENTURERO TRIUNFANTE';
    return '🌱 SOÑADOR INQUEBRANTABLE';
  };

  const title = getHonoraryTitle();
  const shareText = `🎮 ¡Mi carrera en 8-Bit Life RPG: El Juego de la Vida!
👤 Jugador: ${player.name}
💼 Profesión: ${player.career?.title || 'Aventurero'}
💰 Fortuna Neta: $${netWorth.toLocaleString()}
⭐ Nivel RPG: ${player.level}
🏆 Título: ${title}
¡Juega tú también y crea tu propio destino retro! #8BitLifeRPG #GameOfLife`;

  const handleShareTwitter = () => {
    soundEngine.playSelect();
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`;
    window.open(url, '_blank');
  };

  const handleShareWhatsApp = () => {
    soundEngine.playSelect();
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`;
    window.open(url, '_blank');
  };

  const handleShareTelegram = () => {
    soundEngine.playSelect();
    const url = `https://t.me/share/url?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(shareText)}`;
    window.open(url, '_blank');
  };

  const handleNativeShare = async () => {
    soundEngine.playSelect();
    if (navigator.share) {
      try {
        await navigator.share({
          title: '8-Bit Life RPG - Mi Puntuación',
          text: shareText,
          url: window.location.href,
        });
      } catch (err) {}
    } else {
      handleCopyClipboard();
    }
  };

  const handleCopyClipboard = () => {
    navigator.clipboard.writeText(shareText);
    soundEngine.playCoin();
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div id="social-share-modal" className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/85 backdrop-blur-sm animate-fade-in select-none">
      <div className="bg-slate-950 border-4 border-yellow-400 rounded-2xl w-full max-w-md shadow-2xl p-5 flex flex-col items-center">
        {/* Header */}
        <div className="flex items-center gap-2 mb-3">
          <div className="p-2 bg-yellow-400 rounded-lg text-black font-bold">
            <Trophy className="w-6 h-6 animate-bounce" />
          </div>
          <div>
            <span className="text-[10px] font-pixel text-yellow-400 uppercase tracking-widest block">
              TARJETA DE PUNTUACIÓN
            </span>
            <h3 className="font-pixel text-sm text-white font-bold">¡COMPARTIR EN REDES!</h3>
          </div>
        </div>

        {/* 8-Bit Pixel Achievement Card */}
        <div className="w-full bg-slate-900 border-4 border-yellow-500 rounded-xl p-4 mb-4 shadow-xl relative overflow-hidden">
          {/* Subtle Scanlines */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-yellow-500/5 to-transparent pointer-events-none" />

          <div className="text-center mb-3">
            <span className="font-pixel text-[10px] text-yellow-300 tracking-wider">
              {title}
            </span>
            <h4 className="font-pixel text-base text-white mt-1">
              {player.name}
            </h4>
            <span className="text-xs text-slate-400 font-pixel">
              {player.career?.title || 'Aventurero'} • Nivel {player.level}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 bg-slate-950/80 p-3 rounded-lg border border-slate-800 text-xs font-pixel mb-2">
            <div>
              <span className="text-[9px] text-slate-400 block">FORTUNA NETA:</span>
              <span className="text-emerald-400 font-bold text-sm">
                ${netWorth.toLocaleString()}
              </span>
            </div>
            <div>
              <span className="text-[9px] text-slate-400 block">TURNOS:</span>
              <span className="text-sky-300 font-bold text-sm">
                {player.turnsPlayed}
              </span>
            </div>
            <div>
              <span className="text-[9px] text-slate-400 block">TÍTULO ACADÉMICO:</span>
              <span className={player.hasDegree ? 'text-sky-400' : 'text-slate-500'}>
                {player.hasDegree ? '✓ Graduado' : 'Sin Grado'}
              </span>
            </div>
            <div>
              <span className="text-[9px] text-slate-400 block">TALENTOS:</span>
              <span className="text-amber-400 font-bold">
                {player.unlockedTalents.length} Habilidades
              </span>
            </div>
          </div>

          <div className="text-center text-[10px] text-slate-400 font-silkscreen mt-2">
            8-BIT LIFE RPG • AIS-DEV
          </div>
        </div>

        {/* Share Buttons */}
        <div className="w-full flex flex-col gap-2 mb-4">
          <div className="grid grid-cols-3 gap-2">
            <button
              id="btn-share-twitter"
              onClick={handleShareTwitter}
              className="py-2.5 px-2 bg-slate-900 hover:bg-slate-800 border-2 border-slate-700 hover:border-sky-400 text-sky-400 rounded-lg font-pixel text-[10px] flex items-center justify-center gap-1 pixel-btn"
            >
              <span>𝕏 TWITTER</span>
            </button>
            <button
              id="btn-share-whatsapp"
              onClick={handleShareWhatsApp}
              className="py-2.5 px-2 bg-slate-900 hover:bg-slate-800 border-2 border-slate-700 hover:border-emerald-400 text-emerald-400 rounded-lg font-pixel text-[10px] flex items-center justify-center gap-1 pixel-btn"
            >
              <span>WHATSAPP</span>
            </button>
            <button
              id="btn-share-telegram"
              onClick={handleShareTelegram}
              className="py-2.5 px-2 bg-slate-900 hover:bg-slate-800 border-2 border-slate-700 hover:border-blue-400 text-blue-400 rounded-lg font-pixel text-[10px] flex items-center justify-center gap-1 pixel-btn"
            >
              <span>TELEGRAM</span>
            </button>
          </div>

          <div className="flex gap-2">
            <button
              id="btn-share-native"
              onClick={handleNativeShare}
              className="flex-1 py-2.5 bg-yellow-400 hover:bg-yellow-300 text-black rounded-lg font-pixel text-xs font-bold pixel-btn flex items-center justify-center gap-1.5"
            >
              <Share2 className="w-4 h-4" />
              COMPARTIR DIRECTO
            </button>
            <button
              id="btn-share-copy"
              onClick={handleCopyClipboard}
              className="px-3 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg font-pixel text-xs flex items-center justify-center gap-1"
              title="Copiar texto resumen"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <button
          id="btn-close-share-modal"
          onClick={() => {
            soundEngine.playCancel();
            onClose();
          }}
          className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg font-pixel text-xs"
        >
          CERRAR
        </button>
      </div>
    </div>
  );
};
