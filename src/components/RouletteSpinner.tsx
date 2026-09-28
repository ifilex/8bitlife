import React, { useState, useEffect, useRef } from 'react';
import { soundEngine } from '../utils/audio';
import { Sparkles } from 'lucide-react';

interface RouletteSpinnerProps {
  onSpinComplete: (result: number) => void;
  disabled?: boolean;
  luckyActive?: boolean;
}

const WEDGES = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
const WEDGE_COLORS = [
  '#ef4444', // 1 Red
  '#3b82f6', // 2 Blue
  '#10b981', // 3 Green
  '#f59e0b', // 4 Amber
  '#8b5cf6', // 5 Purple
  '#06b6d4', // 6 Cyan
  '#ec4899', // 7 Pink
  '#84cc16', // 8 Lime
  '#f97316', // 9 Orange
  '#eab308', // 10 Gold
];

export const RouletteSpinner: React.FC<RouletteSpinnerProps> = ({
  onSpinComplete,
  disabled = false,
  luckyActive = false,
}) => {
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [currentResult, setCurrentResult] = useState<number | null>(null);
  const animFrameRef = useRef<number | null>(null);

  const startSpin = () => {
    if (isSpinning || disabled) return;

    soundEngine.playSelect();
    setIsSpinning(true);
    setCurrentResult(null);

    // If luckyActive, force 10; otherwise pick 1 to 10
    const targetNumber = luckyActive ? 10 : Math.floor(Math.random() * 10) + 1;
    const targetWedgeIndex = WEDGES.indexOf(targetNumber);

    // Each wedge covers 36 degrees (360 / 10).
    // Pointer is at the top (270 or 90 deg relative)
    const wedgeAngle = 360 / WEDGES.length;
    // Calculate angle so targetWedge lands at top pointer (angle 270)
    const targetWedgeAngle = targetWedgeIndex * wedgeAngle + wedgeAngle / 2;
    // Spin at least 4-6 full rotations
    const totalExtraRotations = 360 * (5 + Math.floor(Math.random() * 2));
    const finalAngle = rotation + totalExtraRotations + (360 - (targetWedgeAngle % 360));

    const startTime = performance.now();
    const duration = 2400; // ms
    const initialRotation = rotation;
    let lastTickAngle = initialRotation;

    const animate = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(1, elapsed / duration);
      
      // Quintic ease-out for realistic deceleration
      const easeOut = 1 - Math.pow(1 - progress, 4);
      const currentAngle = initialRotation + (finalAngle - initialRotation) * easeOut;

      setRotation(currentAngle);

      // Play tick sound when passing wedges
      if (Math.abs(currentAngle - lastTickAngle) >= 36) {
        soundEngine.playSpinnerTick(1 + (1 - progress) * 0.5);
        lastTickAngle = currentAngle;
      }

      if (progress < 1) {
        animFrameRef.current = requestAnimationFrame(animate);
      } else {
        setIsSpinning(false);
        setCurrentResult(targetNumber);
        soundEngine.playCoin();
        onSpinComplete(targetNumber);
      }
    };

    animFrameRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, []);

  return (
    <div id="roulette-spinner-container" className="flex flex-col items-center bg-slate-900 border-4 border-yellow-500 rounded-xl p-3 shadow-xl select-none">
      <div className="flex items-center justify-between w-full mb-2 px-1">
        <span className="font-pixel text-xs text-yellow-400 tracking-wider flex items-center gap-1">
          RULETA 8-BIT
          {luckyActive && <Sparkles className="w-3.5 h-3.5 text-yellow-300 animate-spin" />}
        </span>
        {luckyActive && (
          <span className="text-[10px] bg-yellow-500 text-black px-1.5 py-0.5 rounded font-pixel font-bold">
            ¡10 FORZADO!
          </span>
        )}
      </div>

      {/* Wheel Stage */}
      <div className="relative w-44 h-44 flex items-center justify-center">
        {/* Top Pointer Indicator */}
        <div className="absolute -top-1.5 z-20 w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-t-[18px] border-t-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]" />

        {/* The Rotating Circular Wheel */}
        <div
          className="w-40 h-40 rounded-full border-4 border-slate-950 relative overflow-hidden shadow-2xl transition-transform"
          style={{
            transform: `rotate(${rotation}deg)`,
            boxShadow: '0 0 15px rgba(234, 179, 8, 0.4), inset 0 0 10px rgba(0,0,0,0.8)',
          }}
        >
          {WEDGES.map((num, idx) => {
            const angle = idx * 36;
            return (
              <div
                key={num}
                className="absolute top-0 left-0 w-full h-full"
                style={{
                  transform: `rotate(${angle}deg)`,
                  transformOrigin: '50% 50%',
                }}
              >
                {/* Wedge slice triangle simulation */}
                <div
                  className="w-full h-1/2 flex items-start justify-center pt-2"
                  style={{
                    backgroundColor: WEDGE_COLORS[idx],
                    clipPath: 'polygon(50% 100%, 20% 0%, 80% 0%)',
                  }}
                >
                  <span className="font-pixel text-xs font-black text-white drop-shadow-[1px_1px_1px_rgba(0,0,0,0.9)]">
                    {num}
                  </span>
                </div>
              </div>
            );
          })}

          {/* Center Hub */}
          <div className="absolute inset-0 m-auto w-10 h-10 rounded-full bg-slate-900 border-2 border-yellow-400 flex items-center justify-center z-10 shadow-inner">
            <div className="w-4 h-4 rounded-full bg-yellow-400 animate-pulse" />
          </div>
        </div>
      </div>

      {/* Spin Button / Result Display */}
      <div className="mt-3 w-full flex flex-col items-center">
        <button
          id="btn-spin-roulette"
          onClick={startSpin}
          disabled={disabled || isSpinning}
          className={`w-full py-2 px-3 font-pixel text-xs rounded-lg uppercase tracking-wider text-black font-bold transition-all pixel-btn ${
            disabled || isSpinning
              ? 'bg-slate-700 text-slate-400 cursor-not-allowed opacity-60'
              : luckyActive
              ? 'bg-gradient-to-r from-yellow-300 via-amber-400 to-yellow-500 hover:brightness-110 active:scale-95 text-slate-950 shadow-lg shadow-yellow-500/50'
              : 'bg-emerald-400 hover:bg-emerald-300 active:scale-95'
          }`}
        >
          {isSpinning ? '¡GIRANDO...!' : '¡GIRAR RULETA!'}
        </button>

        {currentResult !== null && (
          <div className="mt-2 text-center animate-bounce">
            <span className="font-pixel text-xs text-yellow-300">
              ¡Avanzas {currentResult} {currentResult === 1 ? 'casilla' : 'casillas'}!
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
