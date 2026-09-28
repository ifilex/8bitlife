import React from 'react';
import { GameLogEntry } from '../types/game';
import { History, DollarSign, Star, Info, Briefcase } from 'lucide-react';

interface HistoryLogProps {
  logs: GameLogEntry[];
  turnsPlayed: number;
}

export const HistoryLog: React.FC<HistoryLogProps> = ({ logs, turnsPlayed }) => {
  const getLogIcon = (type: string) => {
    switch (type) {
      case 'money': return <DollarSign className="w-3.5 h-3.5 text-emerald-400" />;
      case 'level': return <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />;
      case 'career': return <Briefcase className="w-3.5 h-3.5 text-teal-400" />;
      default: return <Info className="w-3.5 h-3.5 text-sky-400" />;
    }
  };

  return (
    <div id="game-history-log" className="w-full bg-slate-900/90 border-2 border-slate-700 rounded-xl p-3 shadow-lg flex flex-col gap-2">
      <div className="flex items-center justify-between border-b border-slate-800 pb-1.5">
        <div className="flex items-center gap-1.5">
          <History className="w-4 h-4 text-slate-400" />
          <span className="font-pixel text-[10px] text-slate-300">REGISTRO DE VIDA</span>
        </div>
        <span className="font-pixel text-[10px] text-yellow-400">
          Turno #{turnsPlayed}
        </span>
      </div>

      <div className="flex flex-col gap-1.5 max-h-36 overflow-y-auto pr-1">
        {logs.length === 0 ? (
          <span className="text-slate-500 text-xs italic">El viaje acaba de comenzar...</span>
        ) : (
          logs.slice(0, 15).map(entry => (
            <div
              key={entry.id}
              className="flex items-start gap-1.5 text-xs text-slate-300 leading-snug bg-slate-950/60 p-1.5 rounded border border-slate-800/80"
            >
              <span className="mt-0.5 shrink-0">{getLogIcon(entry.type)}</span>
              <span className="flex-1">{entry.text}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
