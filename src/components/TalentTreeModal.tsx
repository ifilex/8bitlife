import React from 'react';
import { PlayerState, TalentNode } from '../types/game';
import { TALENTS_TREE, UNLOCKABLE_ABILITIES } from '../data/talentsData';
import { soundEngine } from '../utils/audio';
import { 
  Sparkles, 
  Lock, 
  Check, 
  Zap, 
  PiggyBank, 
  TrendingUp, 
  DollarSign, 
  Percent, 
  BookOpen, 
  Cpu, 
  Award, 
  GraduationCap, 
  Terminal, 
  Smile, 
  Shield, 
  Users, 
  Sun 
} from 'lucide-react';

interface TalentTreeModalProps {
  player: PlayerState;
  onClose: () => void;
  onUnlockTalent: (talent: TalentNode) => void;
}

export const TalentTreeModal: React.FC<TalentTreeModalProps> = ({
  player,
  onClose,
  onUnlockTalent,
}) => {
  const financeNodes = TALENTS_TREE.filter(t => t.branch === 'finance');
  const knowledgeNodes = TALENTS_TREE.filter(t => t.branch === 'knowledge');
  const lifestyleNodes = TALENTS_TREE.filter(t => t.branch === 'lifestyle');

  const getNodeIcon = (iconName: string) => {
    switch (iconName) {
      case 'PiggyBank': return <PiggyBank className="w-5 h-5" />;
      case 'TrendingUp': return <TrendingUp className="w-5 h-5" />;
      case 'DollarSign': return <DollarSign className="w-5 h-5" />;
      case 'Percent': return <Percent className="w-5 h-5" />;
      case 'Zap': return <Zap className="w-5 h-5 text-amber-300 animate-pulse" />;
      case 'BookOpen': return <BookOpen className="w-5 h-5" />;
      case 'Cpu': return <Cpu className="w-5 h-5" />;
      case 'Award': return <Award className="w-5 h-5" />;
      case 'GraduationCap': return <GraduationCap className="w-5 h-5" />;
      case 'Terminal': return <Terminal className="w-5 h-5 text-sky-300 animate-pulse" />;
      case 'Smile': return <Smile className="w-5 h-5" />;
      case 'Shield': return <Shield className="w-5 h-5" />;
      case 'Users': return <Users className="w-5 h-5" />;
      case 'Sun': return <Sun className="w-5 h-5" />;
      default: return <Sparkles className="w-5 h-5" />;
    }
  };

  const handleUnlock = (node: TalentNode) => {
    if (player.talentPoints < node.cost) {
      soundEngine.playDamage();
      return;
    }
    if (node.reqNodeId && !player.unlockedTalents.includes(node.reqNodeId)) {
      soundEngine.playDamage();
      return;
    }
    soundEngine.playTalentUnlock();
    onUnlockTalent(node);
  };

  const renderBranch = (title: string, color: string, nodes: TalentNode[]) => {
    return (
      <div className="flex-1 bg-slate-900/90 border-2 border-slate-700 rounded-xl p-3 flex flex-col">
        <div className="flex items-center gap-2 mb-3 pb-2 border-b border-slate-700">
          <div className={`w-3 h-3 rounded-full ${color}`} />
          <h4 className="font-pixel text-xs text-white uppercase tracking-wider">{title}</h4>
        </div>

        <div className="flex flex-col gap-3 flex-1">
          {nodes.map((node, index) => {
            const isUnlocked = player.unlockedTalents.includes(node.id);
            const canUnlock =
              !isUnlocked &&
              player.talentPoints >= node.cost &&
              (!node.reqNodeId || player.unlockedTalents.includes(node.reqNodeId));
            const isLockedPrereq = node.reqNodeId && !player.unlockedTalents.includes(node.reqNodeId);
            const isAbility = Boolean(UNLOCKABLE_ABILITIES[node.id]);

            return (
              <div
                key={node.id}
                className={`relative rounded-xl p-3 border-2 transition-all flex flex-col justify-between ${
                  isUnlocked
                    ? 'bg-emerald-950/40 border-emerald-500 shadow-md shadow-emerald-950'
                    : canUnlock
                    ? 'bg-slate-800 border-yellow-400 hover:border-yellow-300 hover:shadow-lg'
                    : 'bg-slate-900/60 border-slate-800 opacity-70'
                }`}
              >
                {/* Connecting visual link line if not first */}
                {index > 0 && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-0.5 h-3 bg-slate-600 z-0" />
                )}

                <div className="flex items-start justify-between gap-2 mb-1.5 z-10">
                  <div className="flex items-center gap-2">
                    <div
                      className={`p-2 rounded-lg border ${
                        isUnlocked
                          ? 'bg-emerald-800 text-emerald-100 border-emerald-400'
                          : canUnlock
                          ? 'bg-amber-600 text-amber-100 border-yellow-300'
                          : 'bg-slate-800 text-slate-400 border-slate-700'
                      }`}
                    >
                      {getNodeIcon(node.icon)}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-pixel text-[11px] text-white font-bold">
                          {node.name}
                        </span>
                        {isAbility && (
                          <span className="font-pixel text-[8px] px-1 py-0.5 bg-yellow-400 text-black rounded font-bold">
                            HABILIDAD
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-yellow-300 font-pixel">
                        Coste: {node.cost} PT
                      </span>
                    </div>
                  </div>

                  {isUnlocked && (
                    <span className="flex items-center gap-1 text-[10px] text-emerald-400 font-pixel bg-emerald-950 px-1.5 py-0.5 rounded border border-emerald-600">
                      <Check className="w-3 h-3" /> ACTIVO
                    </span>
                  )}
                  {isLockedPrereq && (
                    <span className="flex items-center gap-1 text-[9px] text-slate-400 font-pixel">
                      <Lock className="w-3 h-3" /> Bloqueado
                    </span>
                  )}
                </div>

                <p className="text-xs text-slate-300 mt-1 leading-relaxed z-10">
                  {node.description}
                </p>

                {/* Unlock Action Button */}
                {!isUnlocked && (
                  <div className="mt-3 pt-2 border-t border-slate-700/50 flex justify-end z-10">
                    <button
                      id={`btn-unlock-${node.id}`}
                      onClick={() => handleUnlock(node)}
                      disabled={!canUnlock}
                      className={`px-3 py-1.5 rounded-lg font-pixel text-[10px] uppercase font-bold transition-all pixel-btn ${
                        canUnlock
                          ? 'bg-yellow-400 hover:bg-yellow-300 text-black cursor-pointer shadow-md'
                          : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                      }`}
                    >
                      {canUnlock ? `Aprender (${node.cost} PT)` : isLockedPrereq ? 'Requiere anterior' : 'Faltan PT'}
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div id="talent-tree-modal" className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-950 border-4 border-yellow-500 rounded-2xl w-full max-w-5xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-slate-900 px-4 py-3 border-b-2 border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow-500 rounded-lg text-slate-950">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-pixel text-sm text-yellow-400">ÁRBOL DE TALENTOS & HABILIDADES</h3>
              <p className="text-xs text-slate-400">
                Mejora tus atributos y desbloquea poderes especiales para cambiar tu destino.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="bg-slate-800 px-3 py-1.5 rounded-xl border border-yellow-400/50 flex items-center gap-2">
              <span className="font-pixel text-xs text-yellow-300">Puntos de Talento (PT):</span>
              <span className="font-pixel text-sm text-white font-bold bg-yellow-500 text-black px-2 py-0.5 rounded">
                {player.talentPoints}
              </span>
            </div>

            <button
              id="btn-close-talent-tree"
              onClick={() => {
                soundEngine.playCancel();
                onClose();
              }}
              className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg font-pixel text-xs px-3 transition-all"
            >
              ✕ CERRAR
            </button>
          </div>
        </div>

        {/* Tree Content: 3 Branches */}
        <div className="p-4 overflow-y-auto flex-1 flex flex-col md:flex-row gap-4">
          {renderBranch('Finanzas & Riqueza', 'bg-amber-400', financeNodes)}
          {renderBranch('Sabiduría & Tecnología', 'bg-sky-400', knowledgeNodes)}
          {renderBranch('Estilo de Vida & Carisma', 'bg-pink-400', lifestyleNodes)}
        </div>

        {/* Footer info banner */}
        <div className="bg-slate-900/80 px-4 py-2.5 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <span>💡 Consejo: Ganas +2 Puntos de Talento cada vez que subes de Nivel de Vida.</span>
          <span className="font-pixel text-[10px] text-yellow-400">
            Talentos aprendidos: {player.unlockedTalents.length} / {TALENTS_TREE.length}
          </span>
        </div>
      </div>
    </div>
  );
};
