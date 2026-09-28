import express from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '5mb' }));

// Cloud saves data store
const SAVES_DIR = path.join(process.cwd(), '.data');
const SAVES_FILE = path.join(SAVES_DIR, 'cloud_saves.json');

function ensureSavesDir() {
  if (!fs.existsSync(SAVES_DIR)) {
    try {
      fs.mkdirSync(SAVES_DIR, { recursive: true });
    } catch (e) {
      console.warn('Could not create saves dir, using memory store:', e);
    }
  }
}

let cloudSavesMemory: Record<string, any> = {};

function loadSaves(): Record<string, any> {
  ensureSavesDir();
  if (fs.existsSync(SAVES_FILE)) {
    try {
      const data = fs.readFileSync(SAVES_FILE, 'utf-8');
      return JSON.parse(data);
    } catch (e) {
      console.error('Error reading saves file:', e);
    }
  }
  return cloudSavesMemory;
}

function saveSaves(saves: Record<string, any>) {
  cloudSavesMemory = saves;
  ensureSavesDir();
  try {
    fs.writeFileSync(SAVES_FILE, JSON.stringify(saves, null, 2), 'utf-8');
  } catch (e) {
    console.warn('Could not write saves file, using memory only:', e);
  }
}

// API Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', game: '8-Bit Game of Life RPG' });
});

// Save game to cloud
app.post('/api/cloud-save', (req, res) => {
  try {
    const { syncCode, gameState, playerName } = req.body;
    if (!gameState) {
      return res.status(400).json({ error: 'Falta información del estado de juego' });
    }

    const code = (syncCode || 'LIFE-' + Math.random().toString(36).substring(2, 7).toUpperCase()).toUpperCase().trim();
    const saves = loadSaves();

    saves[code] = {
      code,
      playerName: playerName || gameState.player?.name || 'Aventurero',
      savedAt: new Date().toISOString(),
      level: gameState.player?.level || 1,
      money: gameState.player?.money || 0,
      career: gameState.player?.career?.title || 'Estudiante',
      gameState,
    };

    saveSaves(saves);
    res.json({ success: true, syncCode: code, message: 'Partida sincronizada en la nube con éxito' });
  } catch (err: any) {
    console.error('Save error:', err);
    res.status(500).json({ error: 'Error al guardar en la nube' });
  }
});

// Load game from cloud
app.get('/api/cloud-load/:code', (req, res) => {
  try {
    const code = req.params.code.toUpperCase().trim();
    const saves = loadSaves();
    const save = saves[code];

    if (!save) {
      return res.status(404).json({ error: 'Código de sincronización no encontrado en la nube' });
    }

    res.json({ success: true, data: save });
  } catch (err: any) {
    console.error('Load error:', err);
    res.status(500).json({ error: 'Error al cargar de la nube' });
  }
});

// List recent public highscores or hall of fame
app.get('/api/hall-of-fame', (req, res) => {
  try {
    const saves = loadSaves();
    const records = Object.values(saves)
      .map((s: any) => ({
        code: s.code,
        playerName: s.playerName,
        level: s.level,
        money: s.money,
        career: s.career,
        savedAt: s.savedAt,
      }))
      .sort((a, b) => (b.money || 0) - (a.money || 0))
      .slice(0, 10);

    res.json({ success: true, records });
  } catch (err) {
    res.json({ success: true, records: [] });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`8-Bit Game of Life Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
