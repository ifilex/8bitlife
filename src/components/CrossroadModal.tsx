import React from 'react';
import { BoardTile } from '../types/game';
import { BOARD_TILES } from '../data/boardData';
import { soundEngine } from '../utils/audio';
import { GitFork, GraduationCap, Briefcase, Heart, Compass } from 'lucide-react';

interface CrossroadModalProps {
  currentTile: BoardTile;
  onSelectBranch: (targetTileId: number) => void;
}

export const CrossroadModal: React.FC<CrossroadModalProps> = ({
  currentTile,
  onSelectBranch,
}) => {
  const branchIds = currentTile.nextTiles;

  const getBranchIcon = (tileId: number) => {
    if (tileId === 2) return <GraduationCap className="w-6 h-6 text-sky-400" />;
    if (tileId === 8) return <Briefcase className="w-6 h-6 text-emerald-400" />;
    if (tileId === 16) return <Heart className="w-6 h-6 text-rose-400" />;
    if (tileId === 20) return <Compass className="w-6 h-6 text-amber-400" />;
    return <GitFork className="w-6 h-6 text-yellow-400" />;
  };

  return (
    <div id="crossroad-modal" className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/85 backdrop-blur-sm animate-fade-in select-none">
      <div className="bg-slate-950 border-4 border-amber-400 rounded-2xl w-full max-w-lg shadow-2xl p-5">
        <div className="flex items-center gap-2 mb-3 border-b-2 border-slate-800 pb-2.5">
          <div className="p-2 bg-amber-500 rounded-lg text-black font-bold">
            <GitFork className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <span className="text-[10px] font-pixel text-amber-400 uppercase tracking-widest block">
              ¡GRAN ENCRUCIJADA DE LA VIDA!
            </span>
            <h3 className="font-pixel text-sm text-white font-bold">{currentTile.label}</h3>
          </div>
        </div>

        <p className="text-slate-300 text-sm mb-4 leading-relaxed bg-slate-900 p-3 rounded-xl border border-slate-800">
          {currentTile.branchPrompt || currentTile.description}
        </p>

        <div className="flex flex-col gap-3">
          {branchIds.map(targetId => {
            const targetTile = BOARD_TILES.find(t => t.id === targetId);
            const branchName = currentTile.branchNames?.[targetId] || targetTile?.label || `Camino #${targetId}`;

            return (
              <button
                key={targetId}
                id={`btn-choose-branch-${targetId}`}
                onClick={() => {
                  soundEngine.playSelect();
                  onSelectBranch(targetId);
                }}
                className="w-full text-left p-4 rounded-xl border-2 bg-slate-900 hover:bg-slate-800 border-slate-700 hover:border-yellow-400 transition-all flex items-center justify-between group active:scale-[0.98] pixel-btn"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-slate-800 rounded-lg border border-slate-700 group-hover:border-yellow-400">
                    {getBranchIcon(targetId)}
                  </div>
                  <div>
                    <h4 className="font-pixel text-xs text-yellow-300 group-hover:text-yellow-400">
                      {branchName}
                    </h4>
                    <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">
                      {targetTile?.description}
                    </p>
                  </div>
                </div>

                <span className="font-pixel text-xs text-amber-400 group-hover:translate-x-1 transition-transform">
                  ▶ ELEGIR
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
