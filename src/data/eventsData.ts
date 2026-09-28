import { RandomEvent } from '../types/game';

export const RANDOM_EVENTS: RandomEvent[] = [
  {
    id: 'startup_pitch',
    title: 'Ronda de Inversión Semilla',
    description: 'Un grupo de inversores ángeles te escucha durante 3 minutos. ¿Cómo enfocas tu propuesta?',
    category: 'career',
    choices: [
      {
        text: 'Presentación Técnica Impecable (Prueba de INT)',
        reqStat: 'int',
        reqStatVal: 7,
        successChance: 0.75,
        onSuccess: {
          text: '¡Los inversores quedan fascinados por tu arquitectura! Consigues $25,000 y +200 XP.',
          moneyChange: 25000,
          xpChange: 200,
          statBoost: { stat: 'int', amount: 1 },
        },
        onFail: {
          text: 'Demasiado tecnicismo sin visión comercial. Te rechazan con amabilidad. Ganas experiencia (+80 XP).',
          xpChange: 80,
          hpChange: -10,
        },
      },
      {
        text: 'Carisma & Visión Disruptiva (Prueba de CHA)',
        reqStat: 'cha',
        reqStatVal: 7,
        successChance: 0.7,
        onSuccess: {
          text: '¡Tu carisma cautiva a la sala! Firman un cheque de $30,000 para tu proyecto.',
          moneyChange: 30000,
          xpChange: 250,
          statBoost: { stat: 'cha', amount: 1 },
        },
        onFail: {
          text: 'Vieron promesas vacías sin sustento. Pierdes tiempo y $1,500 en catering.',
          moneyChange: -1500,
          xpChange: 50,
        },
      },
    ],
  },
  {
    id: 'crypto_bull',
    title: 'Euforia en el Mercado Cripto',
    description: 'Una nueva moneda digital basada en gatitos pixelados sube un 400% en las últimas 24 horas.',
    category: 'luck',
    choices: [
      {
        text: 'Invertir $5,000 en el pico (Prueba de Suerte - LCK)',
        reqStat: 'lck',
        reqStatVal: 6,
        successChance: 0.55,
        onSuccess: {
          text: '¡Vendes justo a tiempo en la cresta de la ola! Obtienes $18,000 netos (+350 XP).',
          moneyChange: 18000,
          xpChange: 350,
        },
        onFail: {
          text: '¡Ocurre un "rug pull"! La moneda se desploma a cero. Pierdes los $5,000.',
          moneyChange: -5000,
          xpChange: 40,
          hpChange: -15,
        },
      },
      {
        text: 'Quedarse al margen y observar con prudencia',
        onSuccess: {
          text: 'Evitas el riesgo y mantienes tu paz mental (+15 HP, +50 XP).',
          xpChange: 50,
          hpChange: 15,
        },
      },
    ],
  },
  {
    id: 'open_source_bounty',
    title: 'Falla Crítica de Ciberseguridad',
    description: 'Descubres una vulnerabilidad de día cero en un protocolo bancario global.',
    category: 'career',
    choices: [
      {
        text: 'Reportar responsablemente a la entidad (Prueba de INT)',
        reqStat: 'int',
        reqStatVal: 8,
        successChance: 0.85,
        onSuccess: {
          text: '¡Te premian con una recompensa ética de $20,000 y una medalla de honor (+300 XP)!',
          moneyChange: 20000,
          xpChange: 300,
          statBoost: { stat: 'int', amount: 1 },
        },
        onFail: {
          text: 'El reporte fue confuso y no pudieron reproducirlo. Te envían una camiseta de agradecimiento (+60 XP).',
          xpChange: 60,
        },
      },
      {
        text: 'Monetizarlo con un consultor privado (Prueba de CHA)',
        reqStat: 'cha',
        reqStatVal: 8,
        successChance: 0.6,
        onSuccess: {
          text: 'Negocias un contrato de consultoría exclusiva por $35,000.',
          moneyChange: 35000,
          xpChange: 220,
        },
        onFail: {
          text: 'Desconfían de tus intenciones y te investigan. Gastas $4,000 en abogados.',
          moneyChange: -4000,
          hpChange: -20,
        },
      },
    ],
  },
  {
    id: 'health_wellness_retreat',
    title: 'Seminario de Alto Rendimiento',
    description: 'Te invitan a un retiro en la montaña para recargar energías y aprender biohacking.',
    category: 'lifestyle',
    choices: [
      {
        text: 'Inscribirse en el programa completo ($3,000)',
        onSuccess: {
          text: '¡Vuelves renovado y lleno de energía vital! (+40 HP máx, +2 Vitalidad, +150 XP).',
          moneyChange: -3000,
          xpChange: 150,
          hpChange: 40,
          statBoost: { stat: 'vit', amount: 2 },
        },
      },
      {
        text: 'Hacer senderismo por tu cuenta gratis',
        reqStat: 'vit',
        reqStatVal: 6,
        successChance: 0.75,
        onSuccess: {
          text: 'Respiras aire puro y despejas tu mente (+20 HP, +80 XP).',
          xpChange: 80,
          hpChange: 20,
        },
        onFail: {
          text: 'Tropezaste con una raíz pixelada y te torciste el tobillo (-15 HP, -$500 en vendaje).',
          moneyChange: -500,
          hpChange: -15,
        },
      },
    ],
  },
  {
    id: 'art_competition',
    title: 'Bienal Internacional de Creatividad',
    description: 'Se abre la convocatoria para presentar una obra o diseño interactivo pionero.',
    category: 'opportunity',
    choices: [
      {
        text: 'Presentar una pieza vanguardista (Prueba de CRE)',
        reqStat: 'cre',
        reqStatVal: 7,
        successChance: 0.75,
        onSuccess: {
          text: '¡Ganas el primer premio de la crítica! Obtienes $22,000 y +300 XP.',
          moneyChange: 22000,
          xpChange: 300,
          statBoost: { stat: 'cre', amount: 2 },
        },
        onFail: {
          text: 'El jurado consideró tu obra "demasiado abstracta para esta era". Ganas experiencia (+90 XP).',
          xpChange: 90,
        },
      },
      {
        text: 'Asistir únicamente como espectador y networking',
        onSuccess: {
          text: 'Conoces a personas inspiradoras en el cóctel de inauguración (+1 Carisma, +70 XP).',
          xpChange: 70,
          statBoost: { stat: 'cha', amount: 1 },
        },
      },
    ],
  },
  {
    id: 'tax_audit',
    title: 'Revisión Anual del Fisco',
    description: 'El departamento de hacienda solicita justificar tus deducciones y movimientos bancarios.',
    category: 'crisis',
    choices: [
      {
        text: 'Revisar cuentas con tu propia Inteligencia (Prueba INT)',
        reqStat: 'int',
        reqStatVal: 8,
        successChance: 0.8,
        onSuccess: {
          text: '¡Tus libros contables son impecables! Te devuelven $4,000 en deducciones a favor.',
          moneyChange: 4000,
          xpChange: 150,
        },
        onFail: {
          text: 'Olvidaste declarar un comprobante. Tienes que pagar una sanción de $6,500.',
          moneyChange: -6500,
          hpChange: -15,
        },
      },
      {
        text: 'Contratar un gestor fiscal de élite ($2,000)',
        onSuccess: {
          text: 'El asesor resuelve el expediente en minutos y te ahorra problemas (-$2,000, +80 XP).',
          moneyChange: -2000,
          xpChange: 80,
        },
      },
    ],
  },
];
