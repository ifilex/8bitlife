import React, { useState } from 'react';
import { PlayerState } from '../types/game';
import { soundEngine } from '../utils/audio';
import { Dices, Trophy, DollarSign } from 'lucide-react';

interface CasinoModalProps {
  player: PlayerState;
  onClose: () => void;
  onWin: (amount: number) => void;
  onLoss: (amount: number) => void;
}

export const CasinoModal: React.FC<CasinoModalProps> = ({
  player,
  onClose,
  onWin,
  onLoss,
}) => {
  const [betAmount, setBetAmount] = useState<number>(Math.min(player.money, 2000));
  const [isRolling, setIsRolling] = useState(false);
  const [diceResults, setDiceResults] = useState<[number, number] | null>(null);
  const [outcomeMessage, setOutcomeMessage] = useState<string | null>(null);

  const handleRoll = (predictedSumType: 'high' | 'low' | 'seven') => {
    if (isRolling || player.money < betAmount || betAmount <= 0) return;
    setIsRolling(true);
    setOutcomeMessage(null);
    soundEngine.playSelect();

    // Roll animation ticks
    let ticks = 0;
    const interval = setInterval(() => {
      soundEngine.playSpinnerTick();
      setDiceResults([
        Math.floor(Math.random() * 6) + 1,
        Math.floor(Math.random() * 6) + 1,
      ]);
      ticks++;
      if (ticks > 8) {
        clearInterval(interval);
        finalizeRoll(predictedSumType);
      }
    }, 120);
  };

  const finalizeRoll = (predictedSumType: 'high' | 'low' | 'seven') => {
    const d1 = Math.floor(Math.random() * 6) + 1;
    const d2 = Math.floor(Math.random() * 6) + 1;
    const sum = d1 + d2;
    setDiceResults([d1, d2]);
    setIsRolling(false);

    let won = false;
    let multiplier = 2;

    if (predictedSumType === 'high' && sum >= 8) {
      won = true;
    } else if (predictedSumType === 'low' && sum <= 6) {
      won = true;
    } else if (predictedSumType === 'seven' && sum === 7) {
      won = true;
      multiplier = 4; // High jackpot for exactly 7
    }

    if (won) {
      const prize = betAmount * multiplier;
      soundEngine.playVictory();
      setOutcomeMessage(`¡GANASTE! Los dados sumaron ${sum}. Premio: +$${prize.toLocaleString()}`);
      onWin(prize);
    } else {
      soundEngine.playDamage();
      setOutcomeMessage(`¡La casa gana! Los dados sumaron ${sum}. Pierdes -$${betAmount.toLocaleString()}`);
      onLoss(betAmount);
    }
  };

  return (
    <div id="casino-modal" className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/85 backdrop-blur-sm animate-fade-in select-none">
      <div className="bg-slate-950 border-4 border-red-500 rounded-2xl w-full max-w-md shadow-2xl p-5 flex flex-col items-center text-center">
        {/* Header */}
        <div className="flex items-center gap-2 mb-3">
          <div className="p-2 bg-red-600 rounded-lg text-white">
            <Dices className="w-6 h-6 animate-spin" />
          </div>
          <h3 className="font-pixel text-sm text-yellow-400">CASINO PIXELADO 8-BIT</h3>
        </div>

        <p className="text-xs text-slate-300 mb-4">
          Apuesta a la suma de 2 dados: Bajo (2-6), Siete Dorado (7), o Alto (8-12).
        </p>

        {/* Dice Visual Box */}
        <div className="w-full bg-slate-900 border-2 border-slate-800 rounded-xl p-4 mb-4 flex items-center justify-center gap-4">
          <div className="w-16 h-16 bg-white rounded-lg border-4 border-slate-700 flex items-center justify-center text-3xl font-pixel text-slate-900 shadow-inner">
            {diceResults ? diceResults[0] : '?'}
          </div>
          <span className="font-pixel text-xl text-yellow-400">+</span>
          <div className="w-16 h-16 bg-white rounded-lg border-4 border-slate-700 flex items-center justify-center text-3xl font-pixel text-slate-900 shadow-inner">
            {diceResults ? diceResults[1] : '?'}
          </div>
        </div>

        {/* Bet selector */}
        <div className="w-full bg-slate-900/60 p-2.5 rounded-xl border border-slate-800 mb-4 flex items-center justify-between text-xs">
          <span className="font-pixel text-[10px] text-slate-400">Tu Apuesta:</span>
          <div className="flex items-center gap-1">
            {[1000, 2500, 5000].map(amt => (
              <button
                key={amt}
                onClick={() => setBetAmount(Math.min(player.money, amt))}
                disabled={player.money < amt}
                className={`px-2 py-1 rounded font-pixel text-[9px] border ${
                  betAmount === amt
                    ? 'bg-yellow-400 text-black border-yellow-300 font-bold'
                    : 'bg-slate-800 text-slate-300 border-slate-700'
                }`}
              >
                ${amt.toLocaleString()}
              </button>
            ))}
          </div>
        </div>

        {/* Outcome Message */}
        {outcomeMessage && (
          <div className="w-full p-2.5 mb-4 rounded-lg bg-slate-900 border border-yellow-400 text-xs font-pixel text-yellow-300 animate-bounce">
            {outcomeMessage}
          </div>
        )}

        {/* Action Buttons */}
        <div className="grid grid-cols-3 gap-2 w-full mb-4">
          <button
            id="btn-casino-low"
            onClick={() => handleRoll('low')}
            disabled={isRolling || player.money < betAmount}
            className="py-2.5 px-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-pixel text-[9px] pixel-btn font-bold disabled:opacity-50"
          >
            BAJO (2-6)<br /><span className="text-[7px]">Paga x2</span>
          </button>
          <button
            id="btn-casino-seven"
            onClick={() => handleRoll('seven')}
            disabled={isRolling || player.money < betAmount}
            className="py-2.5 px-2 bg-amber-500 hover:bg-amber-400 text-black rounded-lg font-pixel text-[9px] pixel-btn font-bold disabled:opacity-50"
          >
            ★ 7 EXACTO ★<br /><span className="text-[7px]">Paga x4</span>
          </button>
          <button
            id="btn-casino-high"
            onClick={() => handleRoll('high')}
            disabled={isRolling || player.money < betAmount}
            className="py-2.5 px-2 bg-red-600 hover:bg-red-500 text-white rounded-lg font-pixel text-[9px] pixel-btn font-bold disabled:opacity-50"
          >
            ALTO (8-12)<br /><span className="text-[7px]">Paga x2</span>
          </button>
        </div>

        <button
          id="btn-casino-exit"
          onClick={() => {
            soundEngine.playCancel();
            onClose();
          }}
          className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg font-pixel text-xs"
        >
          SALIR DEL CASINO
        </button>
      </div>
    </div>
  );
};
