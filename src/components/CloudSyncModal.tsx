import React, { useState } from 'react';
import { PlayerState, GameDifficulty } from '../types/game';
import { soundEngine } from '../utils/audio';
import { Cloud, Upload, Download, Copy, Check, RefreshCw, FileText } from 'lucide-react';

interface CloudSyncModalProps {
  player: PlayerState;
  difficulty: GameDifficulty;
  currentSyncCode: string;
  onClose: () => void;
  onLoadedState: (loadedPlayer: PlayerState, difficulty: GameDifficulty, code: string) => void;
}

export const CloudSyncModal: React.FC<CloudSyncModalProps> = ({
  player,
  difficulty,
  currentSyncCode,
  onClose,
  onLoadedState,
}) => {
  const [syncCode, setSyncCode] = useState(currentSyncCode || 'LIFE-' + Math.random().toString(36).substring(2, 6).toUpperCase());
  const [inputLoadCode, setInputLoadCode] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [copied, setCopied] = useState(false);

  const handleCloudSave = async () => {
    setIsSaving(true);
    setStatusMessage(null);
    try {
      const response = await fetch('/api/cloud-save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          syncCode,
          playerName: player.name,
          gameState: {
            player,
            difficulty,
            timestamp: Date.now(),
          },
        }),
      });

      const data = await response.json();
      if (response.ok && data.success) {
        soundEngine.playSuccess();
        setStatusMessage({
          type: 'success',
          text: `¡Partida guardada con éxito en la nube! Tu código es: ${data.syncCode}`,
        });
        setSyncCode(data.syncCode);
      } else {
        throw new Error(data.error || 'Error al guardar en el servidor');
      }
    } catch (err: any) {
      soundEngine.playDamage();
      setStatusMessage({
        type: 'error',
        text: err.message || 'No se pudo sincronizar en la nube. Verifica tu conexión.',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleCloudLoad = async () => {
    const code = inputLoadCode.trim().toUpperCase();
    if (!code) return;

    setIsLoading(true);
    setStatusMessage(null);
    try {
      const response = await fetch(`/api/cloud-load/${code}`);
      const data = await response.json();

      if (response.ok && data.success && data.data?.gameState?.player) {
        soundEngine.playSuccess();
        const loadedPlayer = data.data.gameState.player;
        const loadedDifficulty = data.data.gameState.difficulty || 'normal';
        setStatusMessage({
          type: 'success',
          text: `¡Partida de "${loadedPlayer.name}" cargada correctamente!`,
        });
        setTimeout(() => {
          onLoadedState(loadedPlayer, loadedDifficulty, code);
          onClose();
        }, 800);
      } else {
        throw new Error(data.error || 'Código no encontrado');
      }
    } catch (err: any) {
      soundEngine.playDamage();
      setStatusMessage({
        type: 'error',
        text: err.message || 'Código de sincronización inválido o expirado.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(syncCode);
    setCopied(true);
    soundEngine.playCoin();
    setTimeout(() => setCopied(false), 2000);
  };

  const handleExportJson = () => {
    const payload = {
      player,
      difficulty,
      exportedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `8bit_life_${player.name.replace(/\s+/g, '_')}.json`;
    a.click();
    soundEngine.playCoin();
  };

  return (
    <div id="cloud-sync-modal" className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/85 backdrop-blur-sm animate-fade-in select-none">
      <div className="bg-slate-950 border-4 border-sky-400 rounded-2xl w-full max-w-lg shadow-2xl p-5">
        <div className="flex items-center justify-between border-b-2 border-slate-800 pb-3 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-sky-500 rounded-lg text-black font-bold">
              <Cloud className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-pixel text-sky-400 uppercase tracking-widest block">
                SINCRONIZACIÓN EN LA NUBE
              </span>
              <h3 className="font-pixel text-sm text-white font-bold">Multi-Dispositivo 8-Bit</h3>
            </div>
          </div>

          <button
            id="btn-close-cloud-sync"
            onClick={() => {
              soundEngine.playCancel();
              onClose();
            }}
            className="text-slate-400 hover:text-white font-pixel text-xs p-1"
          >
            ✕
          </button>
        </div>

        {/* Status notification */}
        {statusMessage && (
          <div
            className={`p-3 rounded-xl mb-4 text-xs font-pixel leading-relaxed flex items-center gap-2 ${
              statusMessage.type === 'success'
                ? 'bg-emerald-950/80 border border-emerald-500 text-emerald-300'
                : 'bg-rose-950/80 border border-rose-500 text-rose-300'
            }`}
          >
            {statusMessage.text}
          </div>
        )}

        {/* SECTION 1: SAVE TO CLOUD */}
        <div className="bg-slate-900 border-2 border-slate-800 rounded-xl p-3.5 mb-4">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-pixel text-xs text-yellow-400 flex items-center gap-1.5">
              <Upload className="w-4 h-4 text-sky-400" /> GUARDAR EN LA NUBE
            </h4>
            <span className="text-[10px] text-slate-400 font-pixel">
              Auto-guardado activo ✓
            </span>
          </div>

          <p className="text-xs text-slate-300 mb-3">
            Sube tu partida actual a los servidores y usa tu código secreto para continuar en tu celular, tablet u otra computadora.
          </p>

          <div className="flex items-center gap-2 mb-3">
            <div className="flex-1 bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 font-pixel text-xs text-sky-300 tracking-wider">
              {syncCode}
            </div>
            <button
              id="btn-copy-sync-code"
              onClick={handleCopyCode}
              className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-pixel flex items-center gap-1"
              title="Copiar código"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>

          <button
            id="btn-trigger-cloud-save"
            onClick={handleCloudSave}
            disabled={isSaving}
            className="w-full py-2.5 px-3 bg-sky-500 hover:bg-sky-400 text-black font-pixel text-xs rounded-lg font-bold pixel-btn transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isSaving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
            {isSaving ? 'SINCRONIZANDO...' : 'GUARDAR AHORA EN LA NUBE'}
          </button>
        </div>

        {/* SECTION 2: LOAD FROM CLOUD */}
        <div className="bg-slate-900 border-2 border-slate-800 rounded-xl p-3.5 mb-4">
          <h4 className="font-pixel text-xs text-yellow-400 flex items-center gap-1.5 mb-2">
            <Download className="w-4 h-4 text-emerald-400" /> CARGAR DESDE LA NUBE
          </h4>
          <p className="text-xs text-slate-300 mb-3">
            Ingresa el código de 6 caracteres para recuperar tu partida desde cualquier otro dispositivo:
          </p>

          <div className="flex gap-2">
            <input
              type="text"
              id="input-cloud-code"
              value={inputLoadCode}
              onChange={e => setInputLoadCode(e.target.value.toUpperCase())}
              placeholder="EJ: LIFE-7A9B"
              className="flex-1 bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 font-pixel text-xs text-white placeholder-slate-600 uppercase focus:outline-none focus:border-sky-400"
            />
            <button
              id="btn-trigger-cloud-load"
              onClick={handleCloudLoad}
              disabled={isLoading || !inputLoadCode.trim()}
              className="py-2 px-4 bg-emerald-500 hover:bg-emerald-400 text-black font-pixel text-xs rounded-lg font-bold pixel-btn transition-all disabled:opacity-50 flex items-center gap-1.5"
            >
              {isLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
              CARGAR
            </button>
          </div>
        </div>

        {/* SECTION 3: BACKUP FILE EXPORT */}
        <div className="flex justify-between items-center text-xs text-slate-400 pt-2 border-t border-slate-800">
          <span>Respaldo en archivo local:</span>
          <button
            id="btn-export-json-file"
            onClick={handleExportJson}
            className="flex items-center gap-1 text-slate-300 hover:text-yellow-400 font-pixel text-[10px]"
          >
            <FileText className="w-3.5 h-3.5" /> Descargar .JSON
          </button>
        </div>
      </div>
    </div>
  );
};
