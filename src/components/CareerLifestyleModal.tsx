import React, { useState } from 'react';
import { PlayerState, Career, Lifestyle, Investment } from '../types/game';
import { CAREERS_LIST, LIFESTYLES_LIST } from '../data/careers';
import { soundEngine } from '../utils/audio';
import { 
  Briefcase, 
  Home, 
  TrendingUp, 
  Check, 
  DollarSign, 
  GraduationCap, 
  ShieldCheck, 
  Plus, 
  Dog, 
  Heart,
  Building
} from 'lucide-react';

interface CareerLifestyleModalProps {
  player: PlayerState;
  onClose: () => void;
  onSelectCareer: (career: Career) => void;
  onSelectLifestyle: (lifestyle: Lifestyle) => void;
  onBuyInvestment: (investment: Investment) => void;
  onBuyPet: (petName: string, cost: number) => void;
}

const AVAILABLE_INVESTMENTS = [
  { id: 'tech_fund', name: 'Fondo Indexado S&P 500 Pixel', cost: 5000, yieldPct: 8, risk: 'low' as const },
  { id: 'crypto_stake', name: 'Nodo Validador Cripto', cost: 10000, yieldPct: 15, risk: 'med' as const },
  { id: 'real_estate_share', name: 'Fracción de Inmueble en Renta', cost: 20000, yieldPct: 12, risk: 'low' as const },
  { id: 'ai_startup_angel', name: 'Inversión Ángel en Startup IA', cost: 35000, yieldPct: 25, risk: 'high' as const },
];

export const CareerLifestyleModal: React.FC<CareerLifestyleModalProps> = ({
  player,
  onClose,
  onSelectCareer,
  onSelectLifestyle,
  onBuyInvestment,
  onBuyPet,
}) => {
  const [activeTab, setActiveTab] = useState<'career' | 'lifestyle' | 'investments'>('career');

  return (
    <div id="career-lifestyle-modal" className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-950 border-4 border-yellow-500 rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header Tabs */}
        <div className="bg-slate-900 px-4 py-3 border-b-2 border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              id="tab-btn-career"
              onClick={() => {
                soundEngine.playSelect();
                setActiveTab('career');
              }}
              className={`px-3 py-1.5 rounded-lg font-pixel text-xs flex items-center gap-1.5 transition-all ${
                activeTab === 'career'
                  ? 'bg-yellow-400 text-black font-bold shadow'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <Briefcase className="w-4 h-4" /> CARRERA
            </button>
            <button
              id="tab-btn-lifestyle"
              onClick={() => {
                soundEngine.playSelect();
                setActiveTab('lifestyle');
              }}
              className={`px-3 py-1.5 rounded-lg font-pixel text-xs flex items-center gap-1.5 transition-all ${
                activeTab === 'lifestyle'
                  ? 'bg-yellow-400 text-black font-bold shadow'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <Home className="w-4 h-4" /> ESTILO DE VIDA
            </button>
            <button
              id="tab-btn-investments"
              onClick={() => {
                soundEngine.playSelect();
                setActiveTab('investments');
              }}
              className={`px-3 py-1.5 rounded-lg font-pixel text-xs flex items-center gap-1.5 transition-all ${
                activeTab === 'investments'
                  ? 'bg-yellow-400 text-black font-bold shadow'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <TrendingUp className="w-4 h-4" /> INVERSIONES
            </button>
          </div>

          <button
            id="btn-close-career-modal"
            onClick={() => {
              soundEngine.playCancel();
              onClose();
            }}
            className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg font-pixel text-xs px-3"
          >
            ✕ CERRAR
          </button>
        </div>

        {/* Tab Contents */}
        <div className="p-4 overflow-y-auto flex-1">
          {/* TAB 1: CAREER */}
          {activeTab === 'career' && (
            <div>
              <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800 mb-4 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-pixel">Puesto Actual</span>
                  <h4 className="font-pixel text-sm text-yellow-400">
                    {player.career?.title || 'Sin Carrera'}
                  </h4>
                  <span className="text-xs text-emerald-400 font-bold">
                    Salario base: ${player.career?.salary.toLocaleString()} / día de cobro
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-700 text-center">
                    <span className="text-[9px] text-slate-400 block font-pixel">Título Universitario</span>
                    <span className={`text-xs font-pixel font-bold ${player.hasDegree ? 'text-sky-400' : 'text-slate-500'}`}>
                      {player.hasDegree ? '✓ GRADUADO' : '✗ NO TIENE'}
                    </span>
                  </div>
                </div>
              </div>

              <h4 className="font-pixel text-xs text-slate-300 mb-3">MERCADO LABORAL DISPONIBLE:</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {CAREERS_LIST.map(career => {
                  const isCurrent = player.career?.id === career.id;
                  const degreeMet = !career.reqDegree || player.hasDegree || player.unlockedTalents.includes('kno_4');
                  const levelMet = player.level >= career.minLevel;
                  const canChoose = degreeMet && levelMet;

                  return (
                    <div
                      key={career.id}
                      className={`p-3 rounded-xl border-2 transition-all flex flex-col justify-between ${
                        isCurrent
                          ? 'bg-emerald-950/40 border-emerald-500'
                          : canChoose
                          ? 'bg-slate-900 border-slate-700 hover:border-yellow-400'
                          : 'bg-slate-900/40 border-slate-800 opacity-60'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <h5 className="font-pixel text-xs text-white font-bold">{career.title}</h5>
                          <span className="font-pixel text-xs text-emerald-400">
                            ${career.salary.toLocaleString()}
                          </span>
                        </div>
                        <p className="text-xs text-slate-300 mb-2">{career.perk}</p>
                        <div className="flex items-center gap-2 text-[10px] text-slate-400 font-pixel">
                          <span>Nivel mín: {career.minLevel}</span>
                          {career.reqDegree && (
                            <span className={degreeMet ? 'text-sky-400' : 'text-rose-400'}>
                              • Req. Universidad
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="mt-3 pt-2 border-t border-slate-800 flex justify-end">
                        {isCurrent ? (
                          <span className="text-[10px] font-pixel text-emerald-400 flex items-center gap-1">
                            <Check className="w-3 h-3" /> PUESTO ACTUAL
                          </span>
                        ) : (
                          <button
                            id={`btn-apply-career-${career.id}`}
                            onClick={() => {
                              soundEngine.playSuccess();
                              onSelectCareer(career);
                            }}
                            disabled={!canChoose}
                            className={`px-3 py-1 rounded font-pixel text-[10px] uppercase font-bold pixel-btn ${
                              canChoose
                                ? 'bg-yellow-400 hover:bg-yellow-300 text-black cursor-pointer'
                                : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                            }`}
                          >
                            {canChoose ? 'Aceptar Puesto' : !degreeMet ? 'Falta Título' : 'Falta Nivel'}
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 2: LIFESTYLE & HOUSING */}
          {activeTab === 'lifestyle' && (
            <div className="flex flex-col gap-5">
              <div>
                <h4 className="font-pixel text-xs text-slate-300 mb-3">SELECCIONAR NIVEL DE VIDA:</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {LIFESTYLES_LIST.map(life => {
                    const isCurrent = player.lifestyle.id === life.id;

                    return (
                      <div
                        key={life.id}
                        className={`p-3 rounded-xl border-2 flex flex-col justify-between ${
                          isCurrent
                            ? 'bg-pink-950/40 border-pink-500 shadow-md'
                            : 'bg-slate-900 border-slate-700 hover:border-pink-400'
                        }`}
                      >
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <h5 className="font-pixel text-xs text-white font-bold">{life.title}</h5>
                            <span className="font-pixel text-xs text-pink-400">
                              -${life.costPerTurn.toLocaleString()} / turno
                            </span>
                          </div>
                          <p className="text-xs text-slate-300 mb-2">{life.description}</p>
                          <div className="text-[10px] text-emerald-400 font-pixel">
                            +{life.happinessBonus} Felicidad & vitalidad
                          </div>
                        </div>

                        <div className="mt-3 pt-2 border-t border-slate-800 flex justify-end">
                          {isCurrent ? (
                            <span className="text-[10px] font-pixel text-pink-400 flex items-center gap-1">
                              <Check className="w-3 h-3" /> ESTILO VIGENTE
                            </span>
                          ) : (
                            <button
                              id={`btn-select-lifestyle-${life.id}`}
                              onClick={() => {
                                soundEngine.playCoin();
                                onSelectLifestyle(life);
                              }}
                              className="px-3 py-1 bg-pink-500 hover:bg-pink-400 text-black font-pixel text-[10px] font-bold rounded pixel-btn"
                            >
                              Mudarse Aquí
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Pets adoption section */}
              <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
                <div className="flex items-center justify-between mb-2">
                  <h5 className="font-pixel text-xs text-yellow-400 flex items-center gap-1.5">
                    <Dog className="w-4 h-4 text-amber-400" /> REFUGIO DE MASCOTAS 8-BIT
                  </h5>
                  <span className="text-[10px] font-pixel text-slate-400">
                    Mascotas actuales: {player.pets.length > 0 ? player.pets.join(', ') : 'Ninguna'}
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {['Perro Corgi Pixel ($2,500)', 'Gato Ninja ($2,000)', 'Loro Políglota ($1,800)'].map(petStr => {
                    const [petName, costStr] = petStr.split(' (');
                    const cost = parseInt(costStr.replace('$', '').replace(')', '').replace(',', ''));
                    const alreadyHas = player.pets.includes(petName);

                    return (
                      <button
                        key={petName}
                        id={`btn-buy-pet-${petName.toLowerCase().replace(/\s+/g, '-')}`}
                        onClick={() => {
                          if (player.money >= cost && !alreadyHas) {
                            soundEngine.playSuccess();
                            onBuyPet(petName, cost);
                          } else {
                            soundEngine.playDamage();
                          }
                        }}
                        disabled={alreadyHas || player.money < cost}
                        className={`px-3 py-1.5 rounded-lg font-pixel text-[10px] border flex items-center gap-1 transition-all ${
                          alreadyHas
                            ? 'bg-slate-800 text-slate-500 border-slate-700'
                            : player.money >= cost
                            ? 'bg-amber-500/20 text-amber-300 border-amber-500 hover:bg-amber-500/30'
                            : 'bg-slate-900 text-slate-600 border-slate-800'
                        }`}
                      >
                        {alreadyHas ? '✓ En Casa' : `Adoptar ${petName} (${costStr}`}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: INVESTMENTS */}
          {activeTab === 'investments' && (
            <div>
              <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800 mb-4 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-pixel">Portafolio Actual</span>
                  <h4 className="font-pixel text-sm text-yellow-400">
                    {player.investments.length} Activos Adquiridos
                  </h4>
                  <span className="text-xs text-slate-300">
                    Valor total invertido: ${player.investments.reduce((acc, i) => acc + i.investedAmount, 0).toLocaleString()}
                  </span>
                </div>
              </div>

              <h4 className="font-pixel text-xs text-slate-300 mb-3">OPORTUNIDADES DE COMPRA:</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {AVAILABLE_INVESTMENTS.map(inv => {
                  const canAfford = player.money >= inv.cost;

                  return (
                    <div key={inv.id} className="p-3 rounded-xl border-2 bg-slate-900 border-slate-700 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <h5 className="font-pixel text-xs text-white font-bold">{inv.name}</h5>
                          <span className="font-pixel text-xs text-emerald-400">
                            +{inv.yieldPct}% / cobro
                          </span>
                        </div>
                        <div className="text-xs text-slate-300 mb-1">
                          Precio de entrada: <strong>${inv.cost.toLocaleString()}</strong>
                        </div>
                        <span className="text-[10px] font-pixel text-slate-400">
                          Riesgo: {inv.risk.toUpperCase()}
                        </span>
                      </div>

                      <div className="mt-3 pt-2 border-t border-slate-800 flex justify-end">
                        <button
                          id={`btn-buy-investment-${inv.id}`}
                          onClick={() => {
                            if (canAfford) {
                              soundEngine.playCoin();
                              onBuyInvestment({
                                id: inv.id + '_' + Date.now(),
                                name: inv.name,
                                investedAmount: inv.cost,
                                turnYieldPercent: inv.yieldPct,
                                riskLevel: inv.risk,
                              });
                            } else {
                              soundEngine.playDamage();
                            }
                          }}
                          disabled={!canAfford}
                          className={`px-3 py-1 rounded font-pixel text-[10px] uppercase font-bold pixel-btn ${
                            canAfford
                              ? 'bg-yellow-400 hover:bg-yellow-300 text-black cursor-pointer'
                              : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                          }`}
                        >
                          {canAfford ? 'Invertir Ahora' : 'Fondos Insuficientes'}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
