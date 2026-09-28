/**
 * 8-Bit Chiptune Synthesizer Engine
 * Pure Web Audio API - zero external assets, 100% retro authentic
 */

class ChiptuneAudioEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private isMusicMuted: boolean = false;
  private sfxVol: number = 0.6;
  private musicVol: number = 0.35;
  private bgmInterval: number | null = null;
  private isBgmPlaying: boolean = false;

  private initContext() {
    if (!this.ctx) {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioContextClass) {
        this.ctx = new AudioContextClass();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setSoundMuted(muted: boolean) {
    this.isMuted = muted;
  }

  public setMusicMuted(muted: boolean) {
    this.isMusicMuted = muted;
    if (muted) {
      this.stopBgm();
    } else if (this.isBgmPlaying) {
      this.startBgm();
    }
  }

  public setVolumes(sfx: number, music: number) {
    this.sfxVol = Math.max(0, Math.min(1, sfx));
    this.musicVol = Math.max(0, Math.min(1, music));
  }

  // Generic tone generator with retro envelope
  private playTone(
    freq: number,
    type: OscillatorType,
    duration: number,
    gainLevel: number = 0.2,
    pitchEnd?: number
  ) {
    if (this.isMuted) return;
    try {
      this.initContext();
      if (!this.ctx) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
      if (pitchEnd) {
        osc.frequency.exponentialRampToValueAtTime(Math.max(20, pitchEnd), this.ctx.currentTime + duration);
      }

      const totalGain = gainLevel * this.sfxVol;
      gain.gain.setValueAtTime(totalGain, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + duration);
    } catch (e) {
      // Audio autoplay policy catch
    }
  }

  // SFX: Select / Menu click
  public playSelect() {
    this.playTone(660, 'square', 0.08, 0.25, 880);
  }

  // SFX: Back / Cancel
  public playCancel() {
    this.playTone(320, 'square', 0.09, 0.25, 200);
  }

  // SFX: Coin collected (Mario style B5 -> E6)
  public playCoin() {
    if (this.isMuted) return;
    this.playTone(987.77, 'square', 0.08, 0.3); // B5
    setTimeout(() => {
      this.playTone(1318.51, 'square', 0.28, 0.35); // E6
    }, 60);
  }

  // SFX: Step movement on board
  public playStep() {
    this.playTone(440, 'triangle', 0.06, 0.2, 330);
  }

  // SFX: Roulette spinner tick
  public playSpinnerTick(pitchModifier: number = 1) {
    this.playTone(550 * pitchModifier, 'square', 0.03, 0.2, 400 * pitchModifier);
  }

  // SFX: Level Up fanfare
  public playLevelUp() {
    if (this.isMuted) return;
    const notes = [261.63, 329.63, 392.00, 523.25, 659.25]; // C4, E4, G4, C5, E5
    notes.forEach((freq, idx) => {
      setTimeout(() => {
        this.playTone(freq, 'square', 0.18, 0.3);
      }, idx * 90);
    });
  }

  // SFX: Talent unlock chime
  public playTalentUnlock() {
    if (this.isMuted) return;
    const notes = [440, 554.37, 659.25, 880]; // A4, C#5, E5, A5
    notes.forEach((freq, idx) => {
      setTimeout(() => {
        this.playTone(freq, 'triangle', 0.25, 0.35);
      }, idx * 110);
    });
  }

  // SFX: Damage / Loss / Negative event
  public playDamage() {
    if (this.isMuted) return;
    this.playTone(220, 'sawtooth', 0.15, 0.3, 110);
    setTimeout(() => {
      this.playTone(140, 'sawtooth', 0.25, 0.35, 70);
    }, 80);
  }

  // SFX: Success / Win event
  public playSuccess() {
    if (this.isMuted) return;
    const notes = [523.25, 659.25, 783.99, 1046.50];
    notes.forEach((freq, idx) => {
      setTimeout(() => {
        this.playTone(freq, 'square', 0.12, 0.3);
      }, idx * 75);
    });
  }

  // SFX: Full victory fanfare for retirement
  public playVictory() {
    if (this.isMuted) return;
    const melody = [
      { f: 523.25, d: 0.15, p: 0 },
      { f: 523.25, d: 0.15, p: 150 },
      { f: 523.25, d: 0.15, p: 300 },
      { f: 523.25, d: 0.35, p: 450 },
      { f: 415.30, d: 0.35, p: 750 },
      { f: 466.16, d: 0.35, p: 1050 },
      { f: 523.25, d: 0.50, p: 1350 },
      { f: 659.25, d: 0.60, p: 1800 },
    ];
    melody.forEach(n => {
      setTimeout(() => {
        this.playTone(n.f, 'square', n.d, 0.4);
      }, n.p);
    });
  }

  // Looping 8-Bit Background Chiptune Melody
  public startBgm() {
    this.isBgmPlaying = true;
    if (this.isMusicMuted || this.bgmInterval !== null) return;
    this.initContext();

    // Classic catchy NES-style 8-bar loop
    const melodySeq = [
      261.63, 293.66, 329.63, 392.00,  // C4, D4, E4, G4
      329.63, 261.63, 392.00, 523.25,  // E4, C4, G4, C5
      440.00, 392.00, 329.63, 261.63,  // A4, G4, E4, C4
      293.66, 329.63, 293.66, 0,       // D4, E4, D4, rest
      261.63, 329.63, 392.00, 440.00,  // C4, E4, G4, A4
      523.25, 440.00, 392.00, 329.63,  // C5, A4, G4, E4
      349.23, 392.00, 440.00, 493.88,  // F4, G4, A4, B4
      523.25, 0, 523.25, 0             // C5 rest C5
    ];

    const bassSeq = [
      130.81, 130.81, 164.81, 196.00,
      130.81, 130.81, 196.00, 196.00,
      110.00, 110.00, 146.83, 164.81,
      98.00,  98.00,  130.81, 98.00,
      130.81, 164.81, 196.00, 220.00,
      130.81, 164.81, 196.00, 164.81,
      174.61, 174.61, 220.00, 246.94,
      130.81, 130.81, 130.81, 130.81
    ];

    let noteIdx = 0;
    const stepTimeMs = 190;

    this.bgmInterval = window.setInterval(() => {
      if (this.isMusicMuted || !this.isBgmPlaying) return;
      try {
        if (!this.ctx) this.initContext();
        if (!this.ctx) return;

        const mFreq = melodySeq[noteIdx % melodySeq.length];
        const bFreq = bassSeq[noteIdx % bassSeq.length];

        if (mFreq > 0) {
          this.playTone(mFreq, 'square', 0.12, 0.12 * this.musicVol);
        }
        if (bFreq > 0) {
          this.playTone(bFreq, 'triangle', 0.16, 0.20 * this.musicVol);
        }
        noteIdx++;
      } catch (e) {}
    }, stepTimeMs);
  }

  public stopBgm() {
    if (this.bgmInterval !== null) {
      clearInterval(this.bgmInterval);
      this.bgmInterval = null;
    }
  }

  public toggleBgm() {
    if (this.isBgmPlaying) {
      this.isBgmPlaying = false;
      this.stopBgm();
    } else {
      this.isBgmPlaying = true;
      this.startBgm();
    }
  }
}

export const soundEngine = new ChiptuneAudioEngine();
