import React, { useState, useEffect, useRef } from 'react';
import { 
  PlayerState, 
  GameDifficulty, 
  CharacterClassId, 
  BoardTile, 
  RandomEvent, 
  Career, 
  Lifestyle, 
  Investment, 
  TalentNode, 
  SpecialAbility, 
  GameSettings 
} from './types/game';
import { BOARD_TILES } from './data/boardData';
import { RANDOM_EVENTS } from './data/eventsData';
import { TALENTS_TREE, UNLOCKABLE_ABILITIES } from './data/talentsData';
import { 
  createNewPlayer, 
  saveGameToLocal, 
  loadGameFromLocal, 
  checkLevelUp, 
  calculateNetWorth 
} from './utils/gameState';
import { soundEngine } from './utils/audio';

// Components
import { StartMenu } from './components/StartMenu';
import { VirtualBoard } from './components/VirtualBoard';
import { RouletteSpinner } from './components/RouletteSpinner';
import { GameHUD } from './components/GameHUD';
import { HistoryLog } from './components/HistoryLog';
import { TalentTreeModal } from './components/TalentTreeModal';
import { CareerLifestyleModal } from './components/CareerLifestyleModal';
import { EventModal } from './components/EventModal';
import { CrossroadModal } from './components/CrossroadModal';
import { CasinoModal } from './components/CasinoModal';
import { CloudSyncModal } from './components/CloudSyncModal';
import { SocialShareModal } from './components/SocialShareModal';
import { SettingsModal } from './components/SettingsModal';
import { HelpModal } from './components/HelpModal';
import { RetirementModal } from './components/RetirementModal';

export default function App() {
  const [gameState, setGameState] = useState<'menu' | 'playing'>('menu');
  const [player, setPlayer] = useState<PlayerState>(() => {
    const saved = loadGameFromLocal();
    return saved?.player || createNewPlayer('Aventurero', 'hacker', 'normal');
  });
  const [hasSavedGame, setHasSavedGame] = useState<boolean>(() => {
    return loadGameFromLocal() !== null;
  });

  const [settings, setSettings] = useState<GameSettings>({
    difficulty: 'normal',
    soundMuted: false,
    musicMuted: false,
    sfxVolume: 0.6,
    musicVolume: 0.35,
    crtEffect: false,
    animationSpeed: 'normal',
  });

  const [syncCode, setSyncCode] = useState<string>(() => {
    const saved = loadGameFromLocal();
    return saved?.syncCode || 'LIFE-' + Math.random().toString(36).substring(2, 6).toUpperCase();
  });

  // Turn execution state
  const [isMoving, setIsMoving] = useState(false);
  const [isAutoSaving, setIsAutoSaving] = useState(false);
  const [luckyRollActive, setLuckyRollActive] = useState(false);
  const [doubleSalaryActive, setDoubleSalaryActive] = useState(false);

  // Modals state
  const [talentsModalOpen, setTalentsModalOpen] = useState(false);
  const [careerModalOpen, setCareerModalOpen] = useState(false);
  const [cloudSyncModalOpen, setCloudSyncModalOpen] = useState(false);
  const [socialShareModalOpen, setSocialShareModalOpen] = useState(false);
  const [settingsModalOpen, setSettingsModalOpen] = useState(false);
  const [helpModalOpen, setHelpModalOpen] = useState(false);
  const [currentEvent, setCurrentEvent] = useState<RandomEvent | null>(null);
  const [currentCrossroad, setCurrentCrossroad] = useState<BoardTile | null>(null);
  const [casinoModalOpen, setCasinoModalOpen] = useState(false);

  // Trigger auto-save whenever player changes during active game
  useEffect(() => {
    if (gameState === 'playing') {
      setIsAutoSaving(true);
      saveGameToLocal(player, settings.difficulty, syncCode);
      setHasSavedGame(true);
      const timer = setTimeout(() => setIsAutoSaving(false), 600);
      return () => clearTimeout(timer);
    }
  }, [player, gameState, settings.difficulty, syncCode]);

  // Start background music when entering game if not muted
  useEffect(() => {
    if (gameState === 'playing' && !settings.musicMuted) {
      soundEngine.startBgm();
    } else {
      soundEngine.stopBgm();
    }
  }, [gameState, settings.musicMuted]);

  // Handle start new game
  const handleStartNewGame = (name: string, classId: CharacterClassId, difficulty: GameDifficulty) => {
    const newPlayer = createNewPlayer(name, classId, difficulty);
    const newSync = 'LIFE-' + Math.random().toString(36).substring(2, 6).toUpperCase();
    setSettings(prev => ({ ...prev, difficulty }));
    setPlayer(newPlayer);
    setSyncCode(newSync);
    setGameState('playing');
    saveGameToLocal(newPlayer, difficulty, newSync);
  };

  // Resume saved game
  const handleResumeGame = () => {
    const saved = loadGameFromLocal();
    if (saved) {
      setPlayer(saved.player);
      setSettings(prev => ({ ...prev, difficulty: saved.difficulty || 'normal' }));
      setSyncCode(saved.syncCode || syncCode);
      setGameState('playing');
    }
  };

  // Process Tile Landing Action
  const handleTileAction = (tile: BoardTile, updatedPlayer: PlayerState) => {
    let p = { ...updatedPlayer };

    switch (tile.type) {
      case 'payday': {
        soundEngine.playCoin();
        let baseSalary = p.salary;
        
        // Talent bonus (e.g. +10% from 'fin_1')
        if (p.unlockedTalents.includes('fin_1')) {
          baseSalary = Math.round(baseSalary * 1.1);
        }

        // Active Ability: Inversión Ángel (doubles salary)
        if (doubleSalaryActive) {
          baseSalary *= 2;
          setDoubleSalaryActive(false);
        }

        // Passive investment yields
        const investmentYield = p.investments.reduce((acc, inv) => {
          return acc + Math.round(inv.investedAmount * (inv.turnYieldPercent / 100));
        }, 0);

        // Patent royalties from talent kno_3
        const patentRoyalties = p.unlockedTalents.includes('kno_3') ? 3500 : 0;

        // Rent expense from lifestyle
        const rent = p.lifestyle.costPerTurn;

        const totalGain = baseSalary + investmentYield + patentRoyalties - rent;
        p.money += totalGain;
        p.xp += 120;

        p.historyLog = [
          {
            id: 'pay_' + Date.now(),
            text: `💰 ¡DÍA DE COBRO! Ganaste $${totalGain.toLocaleString()} (Sueldo: $${baseSalary.toLocaleString()}, Inversiones: $${investmentYield.toLocaleString()}, Renta: -$${rent.toLocaleString()}).`,
            type: 'money',
            timestamp: Date.now(),
          },
          ...p.historyLog.slice(0, 25),
        ];
        break;
      }

      case 'graduation': {
        soundEngine.playVictory();
        p.hasDegree = true;
        p.money += 10000;
        p.xp += 400;
        p.historyLog = [
          {
            id: 'grad_' + Date.now(),
            text: '🎓 ¡GRADUACIÓN UNIVERSITARIA! Obtuviste tu título profesional y bono de honor de $10,000.',
            type: 'level',
            timestamp: Date.now(),
          },
          ...p.historyLog.slice(0, 25),
        ];
        break;
      }

      case 'event': {
        const randomEv = RANDOM_EVENTS[Math.floor(Math.random() * RANDOM_EVENTS.length)];
        setCurrentEvent(randomEv);
        break;
      }

      case 'career': {
        setCareerModalOpen(true);
        break;
      }

      case 'investment': {
        setCareerModalOpen(true);
        break;
      }

      case 'lifestyle': {
        setCareerModalOpen(true);
        break;
      }

      case 'casino': {
        setCasinoModalOpen(true);
        break;
      }

      case 'hospital': {
        soundEngine.playSuccess();
        p.hp = p.maxHp;
        p.money = Math.max(0, p.money - 800);
        p.historyLog = [
          {
            id: 'hosp_' + Date.now(),
            text: '🏥 Chequeo de salud completado. Tu vitalidad y energía están al 100% (-$800).',
            type: 'info',
            timestamp: Date.now(),
          },
          ...p.historyLog.slice(0, 25),
        ];
        break;
      }

      case 'retirement': {
        p.isRetired = true;
        break;
      }

      default:
        break;
    }

    const { leveledUp, updatedPlayer: lvlPlayer } = checkLevelUp(p);
    if (leveledUp) {
      soundEngine.playLevelUp();
    }
    setPlayer(lvlPlayer);
  };

  // Step by step movement animation along the board
  const movePlayerSteps = async (steps: number) => {
    setIsMoving(true);
    let curId = player.currentTileId;
    let remainingSteps = steps;
    let tempPlayer = { ...player };

    while (remainingSteps > 0) {
      const curTile = BOARD_TILES.find(t => t.id === curId);
      if (!curTile || curTile.nextTiles.length === 0) {
        // Reached end of board (Retirement)
        break;
      }

      // Check if current tile is a crossroad / fork with choices!
      if (curTile.nextTiles.length > 1) {
        setCurrentCrossroad(curTile);
        setIsMoving(false);
        return; // Pauses movement for user branch choice
      }

      const nextId = curTile.nextTiles[0];
      curId = nextId;
      tempPlayer.currentTileId = curId;
      setPlayer({ ...tempPlayer });
      soundEngine.playStep();

      remainingSteps--;
      await new Promise(r => setTimeout(r, 260));
    }

    // Finished stepping
    tempPlayer.turnsPlayed += 1;
    // Decrement ability cooldowns
    tempPlayer.specialAbilities = tempPlayer.specialAbilities.map(ab => ({
      ...ab,
      currentCooldown: Math.max(0, ab.currentCooldown - 1),
    }));

    setLuckyRollActive(false);
    setIsMoving(false);

    const finalTile = BOARD_TILES.find(t => t.id === curId) || BOARD_TILES[0];
    handleTileAction(finalTile, tempPlayer);
  };

  // When player chooses a branch at crossroad
  const handleBranchSelected = (targetTileId: number) => {
    setCurrentCrossroad(null);
    let p = { ...player, currentTileId: targetTileId, turnsPlayed: player.turnsPlayed + 1 };
    soundEngine.playStep();
    setPlayer(p);
    const targetTile = BOARD_TILES.find(t => t.id === targetTileId) || BOARD_TILES[0];
    handleTileAction(targetTile, p);
  };

  // Cast Special Ability
  const handleCastAbility = (ability: SpecialAbility) => {
    if (ability.currentCooldown > 0) return;

    soundEngine.playTalentUnlock();
    let p = { ...player };

    // Set cooldown
    p.specialAbilities = p.specialAbilities.map(a =>
      a.id === ability.id ? { ...a, currentCooldown: a.cooldownTurns } : a
    );

    if (ability.id === 'focus') {
      p.hp = Math.min(p.maxHp, p.hp + 25);
      p.xp += 100;
      p.historyLog = [
        {
          id: 'ab_' + Date.now(),
          text: '⚡ Concentración Mental activada: +25 HP restaurados y +100 XP.',
          type: 'info',
          timestamp: Date.now(),
        },
        ...p.historyLog.slice(0, 25),
      ];
    } else if (ability.id === 'lucky_spin') {
      setLuckyRollActive(true);
      p.historyLog = [
        {
          id: 'ab_' + Date.now(),
          text: '✨ ¡Golpe de Suerte activado! Tu próxima tirada de ruleta sacará un 10 garantizado.',
          type: 'info',
          timestamp: Date.now(),
        },
        ...p.historyLog.slice(0, 25),
      ];
    } else if (ability.id === 'express_consulting') {
      const reward = p.attributes.int * 1800;
      p.money += reward;
      p.historyLog = [
        {
          id: 'ab_' + Date.now(),
          text: `💻 Consultoría Express: Asesoraste a clientes y ganaste $${reward.toLocaleString()} (INT x $1,800).`,
          type: 'money',
          timestamp: Date.now(),
        },
        ...p.historyLog.slice(0, 25),
      ];
    } else if (ability.id === 'angel_investor') {
      setDoubleSalaryActive(true);
      p.historyLog = [
        {
          id: 'ab_' + Date.now(),
          text: '📈 Inversión Ángel activada: Tu próximo día de cobro pagará el doble.',
          type: 'info',
          timestamp: Date.now(),
        },
        ...p.historyLog.slice(0, 25),
      ];
    }

    const { leveledUp, updatedPlayer } = checkLevelUp(p);
    if (leveledUp) soundEngine.playLevelUp();
    setPlayer(updatedPlayer);
  };

  // Unlock Talent from Talent Tree
  const handleUnlockTalent = (node: TalentNode) => {
    let p = { ...player };
    p.talentPoints -= node.cost;
    p.unlockedTalents.push(node.id);

    // Attribute boosts from talents
    if (node.id === 'kno_1') p.attributes.int += 3;
    if (node.id === 'life_1') p.attributes.cha += 3;
    if (node.id === 'life_2') {
      p.maxHp += 30;
      p.hp = p.maxHp;
    }

    // Unlock special ability if present
    const newAbility = UNLOCKABLE_ABILITIES[node.id];
    if (newAbility && !p.specialAbilities.some(a => a.id === newAbility.id)) {
      p.specialAbilities.push({ ...newAbility });
    }

    p.historyLog = [
      {
        id: 'tlt_' + Date.now(),
        text: `🌟 Talento Desbloqueado: "${node.name}" (${node.description})`,
        type: 'level',
        timestamp: Date.now(),
      },
      ...p.historyLog.slice(0, 25),
    ];

    setPlayer(p);
  };

  // Event Resolution
  const handleEventResolve = (outcome: any) => {
    let p = { ...player };
    if (outcome.moneyChange) p.money = Math.max(0, p.money + outcome.moneyChange);
    if (outcome.xpChange) p.xp += outcome.xpChange;
    if (outcome.hpChange) p.hp = Math.max(5, Math.min(p.maxHp, p.hp + outcome.hpChange));
    if (outcome.statBoost) {
      p.attributes[outcome.statBoost.stat as keyof typeof p.attributes] += outcome.statBoost.amount;
    }

    p.historyLog = [
      {
        id: 'ev_' + Date.now(),
        text: `🎲 ${outcome.text}`,
        type: outcome.moneyChange ? 'money' : 'event',
        timestamp: Date.now(),
      },
      ...p.historyLog.slice(0, 25),
    ];

    const { leveledUp, updatedPlayer } = checkLevelUp(p);
    if (leveledUp) soundEngine.playLevelUp();
    setPlayer(updatedPlayer);

    setTimeout(() => {
      setCurrentEvent(null);
    }, 1800);
  };

  return (
    <div className={`min-h-screen bg-slate-950 text-slate-100 flex flex-col relative font-sans ${settings.crtEffect ? 'crt-overlay' : ''}`}>
      {/* 1. START MENU */}
      {gameState === 'menu' && (
        <StartMenu
          onStartNewGame={handleStartNewGame}
          onResumeGame={handleResumeGame}
          onOpenCloudLoad={() => setCloudSyncModalOpen(true)}
          onOpenHelp={() => setHelpModalOpen(true)}
          onOpenSettings={() => setSettingsModalOpen(true)}
          hasSavedGame={hasSavedGame}
        />
      )}

      {/* 2. ACTIVE BOARD GAMEPLAY */}
      {gameState === 'playing' && (
        <div className="flex-1 flex flex-col relative">
          {/* Top HUD */}
          <GameHUD
            player={player}
            onOpenTalents={() => setTalentsModalOpen(true)}
            onOpenCareerLifestyle={() => setCareerModalOpen(true)}
            onOpenCloudSync={() => setCloudSyncModalOpen(true)}
            onOpenSocialShare={() => setSocialShareModalOpen(true)}
            onOpenSettings={() => setSettingsModalOpen(true)}
            onOpenHelp={() => setHelpModalOpen(true)}
            onCastAbility={handleCastAbility}
            isAutoSaving={isAutoSaving}
          />

          {/* Main Play Area: Virtual Board & Controls Sidebar */}
          <main className="flex-1 p-3 sm:p-4 max-w-7xl w-full mx-auto flex flex-col lg:flex-row gap-4">
            {/* Left/Center: Interactive Touch Virtual Board */}
            <div className="flex-1 flex flex-col gap-3">
              <VirtualBoard
                player={player}
                onTileClick={tile => soundEngine.playSelect()}
              />
            </div>

            {/* Right: Controls, Roulette Wheel & History Log */}
            <aside className="w-full lg:w-80 flex flex-col gap-4">
              {/* Retro Roulette Spinner */}
              <RouletteSpinner
                onSpinComplete={result => movePlayerSteps(result)}
                disabled={isMoving || player.isRetired}
                luckyActive={luckyRollActive}
              />

              {/* Status / History Log */}
              <HistoryLog
                logs={player.historyLog}
                turnsPlayed={player.turnsPlayed}
              />
            </aside>
          </main>
        </div>
      )}

      {/* 3. MODALS */}
      {/* Talent Tree Modal */}
      {talentsModalOpen && (
        <TalentTreeModal
          player={player}
          onClose={() => setTalentsModalOpen(false)}
          onUnlockTalent={handleUnlockTalent}
        />
      )}

      {/* Career, Lifestyle & Investment Hub */}
      {careerModalOpen && (
        <CareerLifestyleModal
          player={player}
          onClose={() => setCareerModalOpen(false)}
          onSelectCareer={career => {
            setPlayer(prev => ({
              ...prev,
              career,
              salary: career.salary,
              historyLog: [
                {
                  id: 'c_' + Date.now(),
                  text: `💼 Nuevo puesto laboral: ${career.title} (Sueldo: $${career.salary.toLocaleString()})`,
                  type: 'career',
                  timestamp: Date.now(),
                },
                ...prev.historyLog.slice(0, 25),
              ],
            }));
            setCareerModalOpen(false);
          }}
          onSelectLifestyle={lifestyle => {
            setPlayer(prev => ({
              ...prev,
              lifestyle,
              historyLog: [
                {
                  id: 'l_' + Date.now(),
                  text: `🏡 Mudanza a: ${lifestyle.title} (Costo: $${lifestyle.costPerTurn.toLocaleString()}/turno)`,
                  type: 'info',
                  timestamp: Date.now(),
                },
                ...prev.historyLog.slice(0, 25),
              ],
            }));
            setCareerModalOpen(false);
          }}
          onBuyInvestment={investment => {
            setPlayer(prev => ({
              ...prev,
              money: prev.money - investment.investedAmount,
              investments: [...prev.investments, investment],
              historyLog: [
                {
                  id: 'inv_' + Date.now(),
                  text: `📈 Inversión adquirida: ${investment.name} por $${investment.investedAmount.toLocaleString()}`,
                  type: 'money',
                  timestamp: Date.now(),
                },
                ...prev.historyLog.slice(0, 25),
              ],
            }));
          }}
          onBuyPet={(petName, cost) => {
            setPlayer(prev => ({
              ...prev,
              money: prev.money - cost,
              pets: [...prev.pets, petName],
              maxHp: prev.maxHp + 15,
              hp: prev.hp + 15,
              historyLog: [
                {
                  id: 'pet_' + Date.now(),
                  text: `🐾 ¡Adoptaste a ${petName}! Tu salud y felicidad aumentan.`,
                  type: 'info',
                  timestamp: Date.now(),
                },
                ...prev.historyLog.slice(0, 25),
              ],
            }));
          }}
        />
      )}

      {/* RPG Random Event Dialog */}
      {currentEvent && (
        <EventModal
          event={currentEvent}
          player={player}
          onResolve={handleEventResolve}
        />
      )}

      {/* Crossroads Fork Selection Dialog */}
      {currentCrossroad && (
        <CrossroadModal
          currentTile={currentCrossroad}
          onSelectBranch={handleBranchSelected}
        />
      )}

      {/* Casino Minigame Modal */}
      {casinoModalOpen && (
        <CasinoModal
          player={player}
          onClose={() => setCasinoModalOpen(false)}
          onWin={amt => {
            setPlayer(prev => ({
              ...prev,
              money: prev.money + amt,
              historyLog: [
                {
                  id: 'cas_' + Date.now(),
                  text: `🎰 ¡Jackpot en el Casino! Ganaste +$${amt.toLocaleString()}`,
                  type: 'money',
                  timestamp: Date.now(),
                },
                ...prev.historyLog.slice(0, 25),
              ],
            }));
          }}
          onLoss={amt => {
            setPlayer(prev => ({
              ...prev,
              money: Math.max(0, prev.money - amt),
              historyLog: [
                {
                  id: 'cas_l_' + Date.now(),
                  text: `🎲 Suerte esquiva en el casino: perdiste -$${amt.toLocaleString()}`,
                  type: 'money',
                  timestamp: Date.now(),
                },
                ...prev.historyLog.slice(0, 25),
              ],
            }));
          }}
        />
      )}

      {/* Cloud Sync Dialog */}
      {cloudSyncModalOpen && (
        <CloudSyncModal
          player={player}
          difficulty={settings.difficulty}
          currentSyncCode={syncCode}
          onClose={() => setCloudSyncModalOpen(false)}
          onLoadedState={(loadedPlayer, loadedDifficulty, code) => {
            setPlayer(loadedPlayer);
            setSettings(prev => ({ ...prev, difficulty: loadedDifficulty }));
            setSyncCode(code);
            setGameState('playing');
          }}
        />
      )}

      {/* Social Score Share Dialog */}
      {socialShareModalOpen && (
        <SocialShareModal
          player={player}
          onClose={() => setSocialShareModalOpen(false)}
        />
      )}

      {/* Retro Settings Dialog */}
      {settingsModalOpen && (
        <SettingsModal
          settings={settings}
          onUpdateSettings={newS => setSettings(prev => ({ ...prev, ...newS }))}
          onClose={() => setSettingsModalOpen(false)}
        />
      )}

      {/* Instruction Manual / Rules Dialog */}
      {helpModalOpen && (
        <HelpModal onClose={() => setHelpModalOpen(false)} />
      )}

      {/* Retirement / Victory Screen */}
      {player.isRetired && (
        <RetirementModal
          player={player}
          onRestart={() => {
            setGameState('menu');
            setPlayer(createNewPlayer('Aventurero', 'hacker', settings.difficulty));
          }}
          onOpenSocialShare={() => setSocialShareModalOpen(true)}
          onOpenCloudSync={() => setCloudSyncModalOpen(true)}
        />
      )}
    </div>
  );
}
