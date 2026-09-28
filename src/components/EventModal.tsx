import React, { useState } from 'react';
import { RandomEvent, RandomEventChoice, PlayerState, Attributes } from '../types/game';
import { soundEngine } from '../utils/audio';
import { Sparkles, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';

interface EventModalProps {
  event: RandomEvent;
  player: PlayerState;
  onResolve: (outcome: {
    text: string;
    moneyChange?: number;
    xpChange?: number;
    hpChange?: number;
    statBoost?: { stat: keyof Attributes; amount: number };
  }) => void;
}

export const EventModal: React.FC<EventModalProps> = ({
  event,
  player,
  onResolve,
}) => {
  const [selectedChoice, setSelectedChoice] = useState<RandomEventChoice | null>(null);
  const [resolution, setResolution] = useState<{
    success: boolean;
    text: string;
    moneyChange?: number;
    xpChange?: number;
    hpChange?: number;
  } | null>(null);

  const handleMakeChoice = (choice: RandomEventChoice) => {
    soundEngine.playSelect();
    setSelectedChoice(choice);

    let isSuccess = true;
    if (choice.reqStat && choice.reqStatVal) {
      const playerVal = player.attributes[choice.reqStat] || 0;
      // Formula: base chance + player bonus
      const bonus = (playerVal - choice.reqStatVal) * 0.1;
      const finalChance = Math.max(0.15, Math.min(0.95, (choice.successChance ?? 0.6) + bonus));
      isSuccess = Math.random() < finalChance;
    } else if (choice.successChance !== undefined) {
      isSuccess = Math.random() < choice.successChance;
    }

    if (isSuccess || !choice.onFail) {
      soundEngine.playSuccess();
      setResolution({
        success: true,
        text: choice.onSuccess.text,
        moneyChange: choice.onSuccess.moneyChange,
        xpChange: choice.onSuccess.xpChange,
        hpChange: choice.onSuccess.hpChange,
      });
      onResolve({
        ...choice.onSuccess,
      });
    } else {
      soundEngine.playDamage();
      setResolution({
        success: false,
        text: choice.onFail.text,
        moneyChange: choice.onFail.moneyChange,
        xpChange: choice.onFail.xpChange,
        hpChange: choice.onFail.hpChange,
      });
      onResolve({
        ...choice.onFail,
      });
    }
  };

  return (
    <div id="event-dialog-modal" className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/80 backdrop-blur-sm animate-fade-in select-none">
      <div className="bg-slate-950 border-4 border-yellow-400 rounded-2xl w-full max-w-xl shadow-2xl p-5 relative overflow-hidden">
        {/* Retro Header Banner */}
        <div className="flex items-center gap-2 mb-3 border-b-2 border-slate-800 pb-2.5">
          <div className="p-2 bg-yellow-400 rounded-lg text-black font-bold">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-pixel text-yellow-400 uppercase tracking-widest block">
              EVENTO ALEATORIO RPG
            </span>
            <h3 className="font-pixel text-sm text-white font-bold">{event.title}</h3>
          </div>
        </div>

        {/* Event Narrative Body */}
        <div className="bg-slate-900 border-2 border-slate-800 rounded-xl p-3.5 mb-4 text-slate-200 text-sm leading-relaxed">
          {event.description}
        </div>

        {/* Choice Buttons or Resolution Outcome */}
        {!resolution ? (
          <div className="flex flex-col gap-2.5">
            <span className="font-pixel text-[10px] text-slate-400 uppercase">
              Elige tu decisión:
            </span>
            {event.choices.map((choice, idx) => {
              const hasStatReq = Boolean(choice.reqStat && choice.reqStatVal);
              const playerStat = choice.reqStat ? player.attributes[choice.reqStat] : 0;
              const meetsReq = playerStat >= (choice.reqStatVal || 0);

              return (
                <button
                  key={idx}
                  id={`btn-event-choice-${idx}`}
                  onClick={() => handleMakeChoice(choice)}
                  className="w-full text-left p-3 rounded-xl border-2 bg-slate-900 hover:bg-slate-800 border-slate-700 hover:border-yellow-400 transition-all flex flex-col justify-between group active:scale-[0.98] pixel-btn"
                >
                  <span className="font-pixel text-xs text-yellow-300 group-hover:text-yellow-400">
                    ▶ {choice.text}
                  </span>

                  {hasStatReq && (
                    <div className="flex items-center gap-2 mt-1.5 text-[10px] font-pixel">
                      <span className={meetsReq ? 'text-emerald-400' : 'text-amber-400'}>
                        {choice.reqStat?.toUpperCase()}: Tu valor {playerStat} / Req {choice.reqStatVal}
                      </span>
                      <span className="text-slate-500">
                        ({meetsReq ? 'Alta probabilidad' : 'Bajo éxito'})
                      </span>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        ) : (
          <div className="bg-slate-900/90 border-2 border-slate-700 rounded-xl p-4 flex flex-col items-center text-center animate-fade-in">
            {resolution.success ? (
              <CheckCircle className="w-10 h-10 text-emerald-400 mb-2" />
            ) : (
              <XCircle className="w-10 h-10 text-rose-500 mb-2" />
            )}

            <h4 className="font-pixel text-xs text-white mb-2">
              {resolution.success ? '¡ÉXITO ROTUNDO!' : 'LECCIÓN APRENDIDA...'}
            </h4>

            <p className="text-sm text-slate-200 mb-4">{resolution.text}</p>

            {/* Modifiers Pill */}
            <div className="flex flex-wrap gap-2 justify-center mb-4">
              {resolution.moneyChange !== undefined && resolution.moneyChange !== 0 && (
                <span
                  className={`font-pixel text-[11px] px-2.5 py-1 rounded border ${
                    resolution.moneyChange > 0
                      ? 'bg-emerald-950 text-emerald-300 border-emerald-500'
                      : 'bg-rose-950 text-rose-300 border-rose-500'
                  }`}
                >
                  {resolution.moneyChange > 0 ? '+' : ''}${resolution.moneyChange.toLocaleString()}
                </span>
              )}
              {resolution.xpChange !== undefined && resolution.xpChange > 0 && (
                <span className="font-pixel text-[11px] px-2.5 py-1 rounded border bg-sky-950 text-sky-300 border-sky-500">
                  +{resolution.xpChange} XP
                </span>
              )}
              {resolution.hpChange !== undefined && resolution.hpChange !== 0 && (
                <span
                  className={`font-pixel text-[11px] px-2.5 py-1 rounded border ${
                    resolution.hpChange > 0
                      ? 'bg-emerald-950 text-emerald-300 border-emerald-500'
                      : 'bg-rose-950 text-rose-300 border-rose-500'
                  }`}
                >
                  {resolution.hpChange > 0 ? '+' : ''}{resolution.hpChange} HP
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
