import React, { useRef, useState, useEffect } from 'react';
import { BoardTile, PlayerState, TileType } from '../types/game';
import { BOARD_TILES } from '../data/boardData';
import { 
  DollarSign, 
  GraduationCap, 
  GitFork, 
  Briefcase, 
  HelpCircle, 
  TrendingUp, 
  Heart, 
  Dices, 
  Cross, 
  Trophy, 
  Flag,
  ZoomIn,
  ZoomOut,
  Crosshair,
  Info
} from 'lucide-react';

interface VirtualBoardProps {
  player: PlayerState;
  onTileClick?: (tile: BoardTile) => void;
}

export const VirtualBoard: React.FC<VirtualBoardProps> = ({ player, onTileClick }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [selectedTile, setSelectedTile] = useState<BoardTile | null>(null);

  const currentTile = BOARD_TILES.find(t => t.id === player.currentTileId) || BOARD_TILES[0];

  // Auto-center on current player's tile when it changes
  const centerOnPlayer = () => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    setPan({
      x: centerX - currentTile.x * zoom,
      y: centerY - currentTile.y * zoom,
    });
  };

  useEffect(() => {
    centerOnPlayer();
  }, [player.currentTileId]);

  // Touch and mouse dragging handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPan({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      setIsDragging(true);
      setDragStart({
        x: e.touches[0].clientX - pan.x,
        y: e.touches[0].clientY - pan.y,
      });
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || e.touches.length !== 1) return;
    setPan({
      x: e.touches[0].clientX - dragStart.x,
      y: e.touches[0].clientY - dragStart.y,
    });
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  const handleZoom = (delta: number) => {
    setZoom(prev => Math.min(1.8, Math.max(0.6, prev + delta)));
  };

  // Render icon according to tile type
  const getTileIcon = (type: TileType) => {
    switch (type) {
      case 'start': return <Flag className="w-5 h-5 text-white" />;
      case 'payday': return <DollarSign className="w-5 h-5 text-yellow-300" />;
      case 'crossroad': return <GitFork className="w-5 h-5 text-amber-300 animate-pulse" />;
      case 'graduation': return <GraduationCap className="w-5 h-5 text-sky-300" />;
      case 'career': return <Briefcase className="w-5 h-5 text-emerald-300" />;
      case 'investment': return <TrendingUp className="w-5 h-5 text-purple-300" />;
      case 'lifestyle': return <Heart className="w-5 h-5 text-rose-300" />;
      case 'casino': return <Dices className="w-5 h-5 text-amber-400" />;
      case 'hospital': return <Cross className="w-5 h-5 text-red-400" />;
      case 'retirement': return <Trophy className="w-5 h-5 text-yellow-400" />;
      default: return <HelpCircle className="w-5 h-5 text-blue-300" />;
    }
  };

  const getTileColor = (type: TileType, isCurrent: boolean) => {
    if (isCurrent) return 'bg-amber-400 border-white ring-4 ring-yellow-400 animate-pulse text-black';
    switch (type) {
      case 'start': return 'bg-emerald-600 border-emerald-300 text-white';
      case 'payday': return 'bg-yellow-500 border-yellow-200 text-slate-950 font-bold';
      case 'crossroad': return 'bg-amber-600 border-amber-300 text-white';
      case 'graduation': return 'bg-blue-600 border-blue-300 text-white';
      case 'career': return 'bg-teal-600 border-teal-300 text-white';
      case 'investment': return 'bg-purple-600 border-purple-300 text-white';
      case 'lifestyle': return 'bg-pink-600 border-pink-300 text-white';
      case 'casino': return 'bg-red-600 border-red-300 text-white';
      case 'hospital': return 'bg-rose-700 border-rose-300 text-white';
      case 'retirement': return 'bg-gradient-to-r from-yellow-500 to-amber-600 border-yellow-200 text-black font-bold';
      default: return 'bg-indigo-700 border-indigo-400 text-white';
    }
  };

  return (
    <div 
      id="virtual-board-container"
      ref={containerRef}
      className="relative w-full h-[480px] md:h-[580px] bg-slate-950 border-4 border-slate-700 rounded-2xl overflow-hidden cursor-grab active:cursor-grabbing select-none shadow-2xl touch-pan"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Background Pixel Grid Pattern */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage: `radial-gradient(#64748b 1px, transparent 1px)`,
          backgroundSize: '24px 24px',
        }}
      />

      {/* Floating HUD Controls */}
      <div className="absolute top-3 right-3 z-30 flex items-center gap-1.5 bg-slate-900/90 backdrop-blur p-1.5 rounded-xl border-2 border-slate-700 shadow-lg">
        <button
          id="btn-board-zoom-in"
          onClick={() => handleZoom(0.2)}
          className="p-1.5 bg-slate-800 hover:bg-slate-700 text-yellow-400 rounded-lg transition-all active:scale-95"
          title="Acercar mapa"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        <button
          id="btn-board-zoom-out"
          onClick={() => handleZoom(-0.2)}
          className="p-1.5 bg-slate-800 hover:bg-slate-700 text-yellow-400 rounded-lg transition-all active:scale-95"
          title="Alejar mapa"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
        <button
          id="btn-board-center"
          onClick={centerOnPlayer}
          className="p-1.5 bg-yellow-500 hover:bg-yellow-400 text-slate-950 rounded-lg transition-all active:scale-95 font-bold flex items-center gap-1 text-xs px-2"
          title="Centrar en tu posición"
        >
          <Crosshair className="w-3.5 h-3.5" />
          <span className="hidden sm:inline font-pixel text-[10px]">MI POSICIÓN</span>
        </button>
      </div>

      {/* Touch Pan Hint */}
      <div className="absolute bottom-3 left-3 z-30 pointer-events-none bg-slate-900/80 backdrop-blur px-2.5 py-1 rounded-lg border border-slate-700 text-[10px] font-pixel text-slate-300 flex items-center gap-1.5">
        <Info className="w-3 h-3 text-yellow-400" />
        <span>Arrastra para mover el mapa • Toca casillas</span>
      </div>

      {/* Interactive Board Canvas / SVG World */}
      <div
        className="absolute transition-transform duration-75"
        style={{
          transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
          transformOrigin: '0 0',
          width: '1200px',
          height: '800px',
        }}
      >
        {/* Connecting Paths (Roads) */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
          <defs>
            <linearGradient id="roadGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#334155" />
              <stop offset="100%" stopColor="#475569" />
            </linearGradient>
            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#000" />
            </filter>
          </defs>

          {BOARD_TILES.map(tile => {
            return tile.nextTiles.map(nextId => {
              const nextTile = BOARD_TILES.find(t => t.id === nextId);
              if (!nextTile) return null;
              
              const isBranch = tile.nextTiles.length > 1;

              return (
                <g key={`path-${tile.id}-${nextId}`}>
                  {/* Outer Road Stroke */}
                  <line
                    x1={tile.x + 36}
                    y1={tile.y + 36}
                    x2={nextTile.x + 36}
                    y2={nextTile.y + 36}
                    stroke="#1e293b"
                    strokeWidth="20"
                    strokeLinecap="round"
                  />
                  {/* Inner Paved Road */}
                  <line
                    x1={tile.x + 36}
                    y1={tile.y + 36}
                    x2={nextTile.x + 36}
                    y2={nextTile.y + 36}
                    stroke={isBranch ? '#d97706' : '#475569'}
                    strokeWidth="12"
                    strokeLinecap="round"
                  />
                  {/* Dashed Road Center Line */}
                  <line
                    x1={tile.x + 36}
                    y1={tile.y + 36}
                    x2={nextTile.x + 36}
                    y2={nextTile.y + 36}
                    stroke="#f8fafc"
                    strokeWidth="2"
                    strokeDasharray="6,6"
                  />
                </g>
              );
            });
          })}
        </svg>

        {/* Decorative Pixel Elements */}
        <div className="absolute top-[30px] left-[50px] font-pixel text-slate-700 text-xs select-none pointer-events-none">
          🌲 🌲 🏠 🌲
        </div>
        <div className="absolute top-[480px] left-[150px] font-pixel text-slate-700 text-xs select-none pointer-events-none">
          🏡 🚗 🌳 🌳
        </div>
        <div className="absolute top-[180px] left-[780px] font-pixel text-slate-700 text-xs select-none pointer-events-none">
          🏢 🏢 💼 🏙️
        </div>
        <div className="absolute top-[420px] left-[520px] font-pixel text-amber-500 text-xs select-none pointer-events-none">
          🏝️ 🏆 🏖️ 🌴
        </div>

        {/* Tiles */}
        {BOARD_TILES.map(tile => {
          const isCurrent = player.currentTileId === tile.id;
          const isNextFork = currentTile.nextTiles.includes(tile.id) && currentTile.nextTiles.length > 1;

          return (
            <div
              key={tile.id}
              onClick={() => {
                setSelectedTile(tile);
                onTileClick?.(tile);
              }}
              className={`absolute cursor-pointer transition-all duration-300 rounded-xl border-2 flex flex-col items-center justify-center p-1.5 text-center shadow-lg ${getTileColor(
                tile.type,
                isCurrent
              )} ${isNextFork ? 'ring-4 ring-emerald-400 animate-bounce' : ''}`}
              style={{
                left: `${tile.x}px`,
                top: `${tile.y}px`,
                width: '72px',
                height: '72px',
                zIndex: isCurrent ? 25 : 10,
              }}
            >
              {/* Tile Icon */}
              <div className="mb-0.5">{getTileIcon(tile.type)}</div>

              {/* Tile Label */}
              <span className="font-pixel text-[8px] leading-tight line-clamp-2 px-0.5">
                {tile.label}
              </span>

              {/* Number Badge */}
              <div className="absolute -top-2 -left-2 w-4 h-4 rounded-full bg-slate-900 border border-slate-700 text-white font-pixel text-[7px] flex items-center justify-center">
                {tile.id}
              </div>

              {/* Fork choice indicator */}
              {isNextFork && (
                <div className="absolute -bottom-3 bg-emerald-500 text-black font-pixel text-[7px] px-1 py-0.5 rounded font-bold whitespace-nowrap shadow">
                  ELEGIR AQUÍ
                </div>
              )}
            </div>
          );
        })}

        {/* Animated Player Piece (Retro Convertible Car / Avatar) */}
        <div
          id="player-pawn"
          className="absolute z-30 transition-all duration-700 ease-out pointer-events-none"
          style={{
            left: `${currentTile.x + 36}px`,
            top: `${currentTile.y + 36}px`,
            transform: 'translate(-50%, -50%)',
          }}
        >
          {/* Pulsing Target Aura */}
          <div className="absolute inset-0 -m-3 rounded-full bg-yellow-400/30 animate-ping" />

          {/* Retro Car / Player Sprite Box */}
          <div className="relative flex flex-col items-center">
            {/* Player Name Pill */}
            <div className="bg-slate-900 text-yellow-300 font-pixel text-[8px] px-2 py-0.5 rounded-full border border-yellow-400 shadow-md mb-1 whitespace-nowrap">
              {player.name} (Nv.{player.level})
            </div>

            {/* Pixel Car Body */}
            <div className="relative w-11 h-7 bg-red-600 rounded-md border-2 border-yellow-300 shadow-2xl flex items-center justify-center">
              {/* Windshield */}
              <div className="absolute top-1 left-2 w-5 h-2 bg-sky-300/80 rounded-sm border border-white" />
              {/* Driver Head */}
              <div className="w-3.5 h-3.5 rounded-full bg-amber-200 border border-black flex items-center justify-center text-[7px]">
                😎
              </div>
              {/* Wheels */}
              <div className="absolute -bottom-1 left-1 w-2.5 h-2 bg-slate-950 rounded border border-slate-700" />
              <div className="absolute -bottom-1 right-1 w-2.5 h-2 bg-slate-950 rounded border border-slate-700" />
            </div>
          </div>
        </div>
      </div>

      {/* Selected Tile Inspector Modal / Drawer */}
      {selectedTile && (
        <div className="absolute bottom-3 left-3 right-3 md:left-auto md:right-3 md:w-80 z-40 bg-slate-900/95 backdrop-blur border-2 border-yellow-500 rounded-xl p-3 shadow-2xl animate-fade-in">
          <div className="flex items-start justify-between mb-1">
            <div className="flex items-center gap-2">
              <span className="p-1 rounded bg-slate-800">{getTileIcon(selectedTile.type)}</span>
              <div>
                <h4 className="font-pixel text-xs text-yellow-400">{selectedTile.label}</h4>
                <span className="text-[10px] text-slate-400 uppercase font-silkscreen">
                  Casilla #{selectedTile.id} • Tipo: {selectedTile.type}
                </span>
              </div>
            </div>
            <button
              onClick={() => setSelectedTile(null)}
              className="text-slate-400 hover:text-white font-pixel text-xs p-1"
            >
              ✕
            </button>
          </div>
          <p className="text-xs text-slate-200 mt-2 leading-relaxed">
            {selectedTile.description}
          </p>
          {selectedTile.branchPrompt && (
            <div className="mt-2 p-1.5 bg-amber-950/60 border border-amber-600/60 rounded text-[11px] text-amber-200">
              ⚡ <strong>Encrucijada:</strong> Permite bifurcación de camino al pasar por aquí.
            </div>
          )}
        </div>
      )}
    </div>
  );
};
