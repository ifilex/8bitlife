import React, { useState } from 'react';
import { soundEngine } from '../utils/audio';
import { BookOpen, GitFork, Sparkles, TrendingUp, DollarSign, Trophy } from 'lucide-react';

interface HelpModalProps {
  onClose: () => void;
}

export const HelpModal: React.FC<HelpModalProps> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState<'basics' | 'rpg' | 'talents' | 'retirement'>('basics');

  return (
    <div id="help-modal" className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/85 backdrop-blur-sm animate-fade-in select-none">
      <div className="bg-slate-950 border-4 border-yellow-500 rounded-2xl w-full max-w-3xl max-h-[88vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-slate-900 px-4 py-3 border-b-2 border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-yellow-400" />
            <h3 className="font-pixel text-xs sm:text-sm text-yellow-400">
              MANUAL DE INSTRUCCIONES 8-BIT
            </h3>
          </div>
          <button
            id="btn-close-help"
            onClick={() => {
              soundEngine.playCancel();
              onClose();
            }}
            className="text-slate-400 hover:text-white font-pixel text-xs px-2 py-1 bg-slate-800 rounded"
          >
            ✕ CERRAR
          </button>
        </div>

        {/* Subnav Tabs */}
        <div className="flex border-b border-slate-800 bg-slate-900/60 p-1 gap-1">
          {[
            { id: 'basics' as const, label: 'TABLERO & RULETA' },
            { id: 'rpg' as const, label: 'SISTEMA RPG' },
            { id: 'talents' as const, label: 'ÁRBOL DE TALENTOS' },
            { id: 'retirement' as const, label: 'JUBILACIÓN' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => {
                soundEngine.playSelect();
                setActiveTab(tab.id);
              }}
              className={`flex-1 py-2 font-pixel text-[10px] rounded-lg transition-all ${
                activeTab === tab.id
                  ? 'bg-yellow-400 text-black font-bold shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="p-4 sm:p-5 overflow-y-auto flex-1 text-slate-200 text-xs leading-relaxed flex flex-col gap-4">
          {activeTab === 'basics' && (
            <div className="flex flex-col gap-3">
              <h4 className="font-pixel text-xs text-yellow-400">CÓMO SE JUEGA:</h4>
              <p>
                1. <strong>Girar la Ruleta:</strong> En cada turno, pulsa el botón de girar o toca la ruleta para obtener un número del 1 al 10. Tu coche o avatar avanzará esa cantidad de casillas por el tablero interactivo.
              </p>
              <p>
                2. <strong>Encrucijadas (Forks):</strong> Al llegar a casillas de bifurcación (como elegir entre la Universidad o el Mercado Laboral Directo, o Vida de Familia vs Nómada Digital), tú decides qué camino tomar.
              </p>
              <p>
                3. <strong>Días de Pago:</strong> En cada casilla dorada de cobro, recibes tu salario base, los dividendos de tus inversiones y los bonos pasivos de tus talentos desbloqueados.
              </p>
              <p>
                4. <strong>Casillas Especiales:</strong> Visita casinos para minijuegos de dados, adopta mascotas para aumentar tu vitalidad, compra viviendas y protege tu salud en la clínica.
              </p>
            </div>
          )}

          {activeTab === 'rpg' && (
            <div className="flex flex-col gap-3">
              <h4 className="font-pixel text-xs text-sky-400">ATRIBUTOS & NIVELES RPG:</h4>
              <p>
                A diferencia del juego de mesa tradicional, cada personaje posee estadísticas de rol que determinan el éxito en los eventos aleatorios:
              </p>
              <ul className="list-disc pl-5 space-y-1.5 text-slate-300">
                <li><strong>INT (Inteligencia):</strong> Clave para resolver hackathones, patentes, deducciones fiscales y carreras de alta tecnología.</li>
                <li><strong>CHA (Carisma):</strong> Facilita negociar rondas de inversión, convencer a jurados y expandir tu red de contactos.</li>
                <li><strong>VIT (Vitalidad):</strong> Tu salud y resistencia al estrés ante emergencias o viajes.</li>
                <li><strong>LCK (Suerte):</strong> Aumenta los golpes de fortuna en el casino y los despegues de criptoactivos.</li>
                <li><strong>CRE (Creatividad):</strong> Premia la resolución lateral de problemas e ideas vanguardistas.</li>
              </ul>
              <p className="bg-slate-900 p-2.5 rounded-lg border border-slate-800 text-yellow-300">
                ⭐ <strong>Subir de Nivel:</strong> Ganar XP en eventos restaura tu salud y te otorga <strong>+2 Puntos de Talento</strong> para gastar en el Árbol.
              </p>
            </div>
          )}

          {activeTab === 'talents' && (
            <div className="flex flex-col gap-3">
              <h4 className="font-pixel text-xs text-amber-400">ÁRBOL DE TALENTOS & HABILIDADES:</h4>
              <p>
                Personaliza la progresión de tu personaje invirtiendo Puntos de Talento (PT) en 3 ramas:
              </p>
              <ul className="list-disc pl-5 space-y-1.5 text-slate-300">
                <li><strong>Rama Finanzas:</strong> Aumenta salarios, intereses bancarios y desbloquea la habilidad activa <em>"Inversión Ángel"</em> (duplica tu próximo sueldo).</li>
                <li><strong>Rama Sabiduría:</strong> Incrementa tu INT, otorga patentes automáticas y desbloquea <em>"Consultoría Express"</em> (dinero inmediato según tu INT).</li>
                <li><strong>Rama Estilo de Vida:</strong> Potencia la vitalidad, reduce estrés y desbloquea <em>"Golpe de Suerte"</em> (fuerza un 10 en la ruleta).</li>
              </ul>
            </div>
          )}

          {activeTab === 'retirement' && (
            <div className="flex flex-col gap-3">
              <h4 className="font-pixel text-xs text-emerald-400">RETIRO & PUNTUACIÓN MAGNA:</h4>
              <p>
                Al alcanzar la última casilla ("Villa de Jubilación Dorada"), se calcula tu <strong>Fortuna Neta</strong>:
              </p>
              <div className="bg-slate-900 p-3 rounded-lg border border-slate-800 font-pixel text-[11px] text-center text-yellow-300">
                Dinero en Efectivo + Valor de Inversiones + Valor de Casa - Deudas Acumuladas
              </div>
              <p>
                ¡Obtén títulos honorarios según tu éxito, comparte tu tarjeta de logros en redes sociales y sincroniza tu récord en el Salón de la Fama!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
