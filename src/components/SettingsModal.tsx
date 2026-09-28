import React from 'react';
import { GameSettings, GameDifficulty } from '../types/game';
import { soundEngine } from '../utils/audio';
import { Settings, Volume2, VolumeX, Music, Monitor, Zap } from 'lucide-react';

interface SettingsModalProps {
  settings: GameSettings;
  onUpdateSettings: (newSettings: Partial<GameSettings>) => void;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  settings,
  onUpdateSettings,
  onClose,
}) => {
  return (
    <div id="settings-modal" className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/85 backdrop-blur-sm animate-fade-in select-none">
      <div className="bg-slate-950 border-4 border-yellow-500 rounded-2xl w-full max-w-md shadow-2xl p-5 flex flex-col gap-4">
        {/* Header */}
        <div className="flex items-center justify-between border-b-2 border-slate-800 pb-2.5">
          <div className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-yellow-400" />
            <h3 className="font-pixel text-sm text-yellow-400">AJUSTES RETRO</h3>
          </div>
          <button
            id="btn-close-settings"
            onClick={() => {
              soundEngine.playCancel();
              onClose();
            }}
            className="text-slate-400 hover:text-white font-pixel text-xs p-1"
          >
            ✕
          </button>
        </div>

        {/* SFX Audio */}
        <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {settings.soundMuted ? (
              <VolumeX className="w-5 h-5 text-rose-400" />
            ) : (
              <Volume2 className="w-5 h-5 text-emerald-400" />
            )}
            <div>
              <h4 className="font-pixel text-xs text-white">EFECTOS DE SONIDO (SFX)</h4>
              <span className="text-[10px] text-slate-400">Sonidos de ruleta, pasos y monedas</span>
            </div>
          </div>
          <button
            id="btn-toggle-sfx"
            onClick={() => {
              const muted = !settings.soundMuted;
              soundEngine.setSoundMuted(muted);
              onUpdateSettings({ soundMuted: muted });
              if (!muted) soundEngine.playCoin();
            }}
            className={`px-3 py-1.5 rounded-lg font-pixel text-[10px] font-bold ${
              settings.soundMuted ? 'bg-slate-800 text-slate-400' : 'bg-emerald-500 text-black'
            }`}
          >
            {settings.soundMuted ? 'SILENCIADO' : 'ACTIVO'}
          </button>
        </div>

        {/* Chiptune Music */}
        <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Music className={`w-5 h-5 ${settings.musicMuted ? 'text-slate-500' : 'text-sky-400 animate-pulse'}`} />
            <div>
              <h4 className="font-pixel text-xs text-white">MÚSICA CHIPTUNE BGM</h4>
              <span className="text-[10px] text-slate-400">Banda sonora 8-bit nostálgica</span>
            </div>
          </div>
          <button
            id="btn-toggle-music"
            onClick={() => {
              const muted = !settings.musicMuted;
              soundEngine.setMusicMuted(muted);
              onUpdateSettings({ musicMuted: muted });
            }}
            className={`px-3 py-1.5 rounded-lg font-pixel text-[10px] font-bold ${
              settings.musicMuted ? 'bg-slate-800 text-slate-400' : 'bg-sky-500 text-black'
            }`}
          >
            {settings.musicMuted ? 'SILENCIADO' : 'SONANDO'}
          </button>
        </div>

        {/* CRT Scanline Filter Toggle */}
        <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Monitor className="w-5 h-5 text-amber-400" />
            <div>
              <h4 className="font-pixel text-xs text-white">FILTRO CRT SCANLINES</h4>
              <span className="text-[10px] text-slate-400">Líneas de televisor de tubo clásico</span>
            </div>
          </div>
          <button
            id="btn-toggle-crt"
            onClick={() => {
              soundEngine.playSelect();
              onUpdateSettings({ crtEffect: !settings.crtEffect });
            }}
            className={`px-3 py-1.5 rounded-lg font-pixel text-[10px] font-bold ${
              settings.crtEffect ? 'bg-amber-400 text-black' : 'bg-slate-800 text-slate-400'
            }`}
          >
            {settings.crtEffect ? 'ACTIVADO' : 'DESACTIVADO'}
          </button>
        </div>

        {/* Difficulty Setting */}
        <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
          <span className="font-pixel text-xs text-white block mb-2">DIFICULTAD DE LA PARTIDA:</span>
          <div className="grid grid-cols-3 gap-2">
            {(['easy', 'normal', 'hard'] as GameDifficulty[]).map(diff => (
              <button
                key={diff}
                onClick={() => {
                  soundEngine.playSelect();
                  onUpdateSettings({ difficulty: diff });
                }}
                className={`py-1.5 px-2 rounded-lg font-pixel text-[9px] uppercase border ${
                  settings.difficulty === diff
                    ? 'bg-yellow-400 text-black border-yellow-300 font-bold'
                    : 'bg-slate-950 text-slate-400 border-slate-800'
                }`}
              >
                {diff === 'easy' ? 'Novato' : diff === 'normal' ? 'Normal' : 'Hardcore'}
              </button>
            ))}
          </div>
        </div>

        <button
          id="btn-save-and-close-settings"
          onClick={() => {
            soundEngine.playSelect();
            onClose();
          }}
          className="w-full py-2.5 bg-yellow-400 hover:bg-yellow-300 text-black font-pixel text-xs font-bold rounded-xl pixel-btn"
        >
          GUARDAR Y SALIR
        </button>
      </div>
    </div>
  );
};
