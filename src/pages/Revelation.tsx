import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';

/**
 * RÉVÉLATION — jeu de personnalité.
 * Dix choix purement visuels (émoticônes). Aucun texte à lire avant de jouer.
 * Chaque option score sur cinq axes : Authenticité, Transgression,
 * Introversion, Contrôle, Hédonisme. À la fin, un portrait en 15 points.
 *
 * Le barème ci-dessous est volontairement centralisé et facile à ajuster :
 * scores au format [Authenticité, Transgression, Introversion, Contrôle, Hédonisme].
 */

type Scores = [number, number, number, number, number];

interface Option {
  emoji: string;
  label: string;
  scores: Scores;
}

interface Dimension {
  key: string;
  options: Option[];
}

const AXES = ['Authenticité', 'Transgression', 'Introversion', 'Contrôle', 'Hédonisme'] as const;

const DIMENSIONS: Dimension[] = [
  {
    key: 'fruit',
    options: [
      { emoji: '🍊', label: 'Orange', scores: [0, 0, 0, 2, 0] },
      { emoji: '🍎', label: 'Pomme', scores: [0, 0, 0, 3, 0] },
      { emoji: '🥭', label: 'Mangue', scores: [3, 1, 0, 0, 3] },
      { emoji: '🍇', label: 'Raisin', scores: [2, 0, 2, 0, 1] },
    ],
  },
  {
    key: 'eau',
    options: [
      { emoji: '🌊', label: 'Océan', scores: [1, 1, 0, 0, 2] },
      { emoji: '🏞️', label: 'Lac', scores: [1, 0, 3, 2, 0] },
      { emoji: '💦', label: 'Rivière', scores: [2, 0, 1, 1, 1] },
      { emoji: '🌧️', label: 'Pluie', scores: [1, 0, 3, 0, 1] },
    ],
  },
  {
    key: 'objet',
    options: [
      { emoji: '🔪', label: 'Couteau', scores: [1, 3, 0, 2, 0] },
      { emoji: '📖', label: 'Livre', scores: [2, 0, 3, 1, 0] },
      { emoji: '🪞', label: 'Miroir', scores: [3, 0, 2, 0, 1] },
      { emoji: '🔑', label: 'Clé', scores: [1, 1, 1, 3, 1] },
    ],
  },
  {
    key: 'couleur',
    options: [
      { emoji: '🔴', label: 'Rouge', scores: [1, 2, 0, 0, 3] },
      { emoji: '🔵', label: 'Bleu', scores: [1, 0, 2, 2, 0] },
      { emoji: '⚫', label: 'Noir', scores: [2, 3, 2, 1, 0] },
      { emoji: '🟡', label: 'Jaune', scores: [2, 0, 0, 0, 3] },
    ],
  },
  {
    key: 'sport',
    options: [
      { emoji: '🥊', label: 'Boxe', scores: [1, 3, 0, 2, 1] },
      { emoji: '🎾', label: 'Tennis', scores: [1, 1, 0, 3, 1] },
      { emoji: '🏊', label: 'Natation', scores: [1, 0, 2, 2, 1] },
      { emoji: '🧗', label: 'Escalade', scores: [3, 1, 1, 2, 2] },
    ],
  },
  {
    key: 'substance',
    options: [
      { emoji: '🍺', label: 'Alcool', scores: [0, 2, 0, 0, 3] },
      { emoji: '🌿', label: 'Joint', scores: [1, 3, 1, 0, 3] },
      { emoji: '☕', label: 'Café', scores: [1, 0, 1, 3, 1] },
      { emoji: '💧', label: 'Eau', scores: [3, 0, 1, 2, 0] },
    ],
  },
  {
    key: 'forme',
    options: [
      { emoji: '⬜', label: 'Carré', scores: [1, 0, 1, 3, 0] },
      { emoji: '⭕', label: 'Cercle', scores: [3, 0, 1, 1, 1] },
      { emoji: '🔺', label: 'Triangle', scores: [1, 2, 0, 3, 1] },
      { emoji: '🌀', label: 'Spirale', scores: [2, 1, 3, 0, 1] },
    ],
  },
  {
    key: 'animal',
    options: [
      { emoji: '🦁', label: 'Lion', scores: [2, 1, 0, 3, 2] },
      { emoji: '🦊', label: 'Renard', scores: [1, 3, 1, 1, 1] },
      { emoji: '🕊️', label: 'Colombe', scores: [3, 0, 1, 0, 1] },
      { emoji: '🐦‍⬛', label: 'Corbeau', scores: [2, 2, 3, 1, 0] },
    ],
  },
  {
    key: 'endroit',
    options: [
      { emoji: '⛰️', label: 'Montagne', scores: [2, 1, 2, 2, 0] },
      { emoji: '🏖️', label: 'Plage', scores: [1, 0, 0, 0, 3] },
      { emoji: '🌲', label: 'Forêt', scores: [3, 0, 3, 0, 1] },
      { emoji: '🏙️', label: 'Ville', scores: [1, 2, 0, 1, 3] },
    ],
  },
  {
    key: 'periode',
    options: [
      { emoji: '👶', label: 'Enfance', scores: [3, 0, 1, 0, 2] },
      { emoji: '🧒', label: 'Adolescence', scores: [1, 3, 1, 0, 3] },
      { emoji: '🧑', label: 'Âge adulte', scores: [1, 0, 0, 3, 1] },
      { emoji: '👴', label: 'Vieillesse', scores: [3, 0, 2, 1, 0] },
    ],
  },
];

/* ------------------------------------------------------------------ */
/*  Génération du portrait                                            */
/* ------------------------------------------------------------------ */

const STATEMENTS: Record<(typeof AXES)[number], { high: string[]; low: string[] }> = {
  Authenticité: {
    high: [
      'Tu ne joues pas un rôle : ce que tu montres, c’est ce que tu es.',
      'La sincérité passe avant le confort, même quand elle dérange.',
      'Tu cherches le vrai, chez les autres comme en toi-même.',
      'Les masques t’ennuient ; tu préfères les gens à nu.',
    ],
    low: [
      'Tu te protèges derrière une image soigneusement construite.',
      'Tu montres ce qu’il faut montrer, jamais tout.',
      'L’adaptation est ton art : tu deviens ce que la situation réclame.',
      'Tu gardes une part de toi inaccessible, même aux proches.',
    ],
  },
  Transgression: {
    high: [
      'Les règles sont pour toi des suggestions, rarement des limites.',
      'Tu es attiré par ce qui dérange, ce qui brûle, ce qui transgresse.',
      'L’interdit ne te repousse pas : il t’appelle.',
      'Tu préfères provoquer le désordre que subir l’ennui.',
    ],
    low: [
      'Tu respectes le cadre : il te rassure plus qu’il ne t’enferme.',
      'Tu évites les ruptures brutales et les conflits inutiles.',
      'La stabilité vaut plus à tes yeux que le frisson.',
      'Tu construis lentement plutôt que de tout renverser.',
    ],
  },
  Introversion: {
    high: [
      'Ton vrai territoire, c’est l’intérieur : tu vis beaucoup en dedans.',
      'Le silence te recharge ; la foule te vide.',
      'Tu réfléchis avant de parler, et souvent tu choisis de te taire.',
      'La solitude n’est pas un manque pour toi, c’est un refuge.',
    ],
    low: [
      'Tu existes au contact des autres : ils sont ton énergie.',
      'Tu penses tout haut, tu vis dehors, tu avances en parlant.',
      'Le mouvement et le bruit te stimulent plus qu’ils ne t’épuisent.',
      'Tu vas vers le monde sans hésiter à occuper l’espace.',
    ],
  },
  Contrôle: {
    high: [
      'Tu tiens fermement la barre : le laisser-aller t’angoisse.',
      'Tu planifies, tu anticipes, tu maîtrises ce qui peut l’être.',
      'La discipline est ta colonne vertébrale.',
      'Tu préfères diriger que d’être dirigé.',
    ],
    low: [
      'Tu te laisses porter par le courant sans chercher à le dompter.',
      'Tu improvises mieux que tu ne planifies.',
      'Lâcher prise ne te fait pas peur : tu fais confiance au hasard.',
      'Tu vis l’instant plutôt que de l’organiser.',
    ],
  },
  Hédonisme: {
    high: [
      'Le plaisir n’est pas un luxe pour toi, c’est un moteur.',
      'Tu cours après l’intensité, la saveur, la sensation.',
      'Tu sais jouir de l’instant sans culpabilité.',
      'La vie se savoure ; tu refuses de t’en priver.',
    ],
    low: [
      'Tu te méfies des plaisirs faciles et des excès.',
      'Ta satisfaction vient de l’effort plus que de la jouissance.',
      'La sobriété te ressemble plus que la fête.',
      'Tu diffères le plaisir au nom de quelque chose de plus grand.',
    ],
  },
};

const ARCHETYPES: Record<(typeof AXES)[number], { high: string; low: string }> = {
  Authenticité: { high: 'L’Âme Nue', low: 'Le Caméléon' },
  Transgression: { high: 'Le Feu Sauvage', low: 'Le Gardien' },
  Introversion: { high: 'Le Monde Intérieur', low: 'Le Rayonnant' },
  Contrôle: { high: 'L’Architecte', low: 'Le Courant Libre' },
  Hédonisme: { high: 'Le Vivant', low: 'L’Ascète' },
};

interface AxisResult {
  axis: (typeof AXES)[number];
  level: number; // 0..1
}

function computeLevels(answers: Option[]): AxisResult[] {
  // Plage réaliste : pour chaque axe, somme des min et max possibles
  // selon les options réellement proposées, afin de normaliser sur 0..1.
  return AXES.map((axis, a) => {
    let score = 0;
    let min = 0;
    let max = 0;
    DIMENSIONS.forEach((dim, d) => {
      const vals = dim.options.map((o) => o.scores[a]);
      min += Math.min(...vals);
      max += Math.max(...vals);
      score += answers[d].scores[a];
    });
    const level = max === min ? 0.5 : (score - min) / (max - min);
    return { axis, level };
  });
}

function buildPortrait(levels: AxisResult[]): string[] {
  const points: string[] = [];
  levels.forEach(({ axis, level }) => {
    const side = level >= 0.5 ? 'high' : 'low';
    const pool = STATEMENTS[axis][side];
    // L’intensité décale le point d’entrée pour varier les formulations.
    const intensity = side === 'high' ? level : 1 - level;
    const offset = Math.min(pool.length - 3, Math.floor(intensity * pool.length));
    const start = Math.max(0, offset);
    points.push(...pool.slice(start, start + 3));
  });
  // Entrelacement : un point par axe à tour de rôle, pour éviter les blocs.
  const interleaved: string[] = [];
  for (let i = 0; i < 3; i++) {
    for (let a = 0; a < AXES.length; a++) {
      interleaved.push(points[a * 3 + i]);
    }
  }
  return interleaved.slice(0, 15);
}

function buildTitle(levels: AxisResult[]): { name: string; tagline: string } {
  const ranked = [...levels].sort(
    (x, y) => Math.abs(y.level - 0.5) - Math.abs(x.level - 0.5),
  );
  const top = ranked[0];
  const second = ranked[1];
  const name = ARCHETYPES[top.axis][top.level >= 0.5 ? 'high' : 'low'];
  const tagline = ARCHETYPES[second.axis][second.level >= 0.5 ? 'high' : 'low'];
  return { name, tagline };
}

/* ------------------------------------------------------------------ */
/*  Utilitaires                                                       */
/* ------------------------------------------------------------------ */

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/* ------------------------------------------------------------------ */
/*  Composant                                                         */
/* ------------------------------------------------------------------ */

export default function Revelation() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Option[]>([]);
  const [finished, setFinished] = useState(false);
  // Ordre des options figé par partie (mélangé une seule fois).
  const [shuffledDims, setShuffledDims] = useState<Dimension[]>(() =>
    DIMENSIONS.map((d) => ({ ...d, options: shuffle(d.options) })),
  );

  const levels = useMemo(
    () => (finished ? computeLevels(answers) : []),
    [finished, answers],
  );
  const portrait = useMemo(() => (finished ? buildPortrait(levels) : []), [finished, levels]);
  const title = useMemo(() => (finished ? buildTitle(levels) : null), [finished, levels]);

  const choose = (option: Option) => {
    const next = [...answers, option];
    setAnswers(next);
    if (step + 1 >= DIMENSIONS.length) {
      setFinished(true);
    } else {
      setStep(step + 1);
    }
  };

  const restart = () => {
    setStep(0);
    setAnswers([]);
    setFinished(false);
    setShuffledDims(DIMENSIONS.map((d) => ({ ...d, options: shuffle(d.options) })));
  };

  /* ----------------------------- Résultat ----------------------------- */
  if (finished && title) {
    return (
      <div className="min-h-screen bg-gradient-hero flex flex-col items-center px-4 py-12">
        <div className="w-full max-w-xl animate-fade-up">
          <p className="text-center text-sm uppercase tracking-[0.3em] text-muted-foreground">
            Révélation
          </p>
          <h1 className="mt-3 text-center text-4xl sm:text-5xl font-display text-gradient">
            {title.name}
          </h1>
          <p className="mt-2 text-center text-lg text-muted-foreground italic">
            teinté de « {title.tagline} »
          </p>

          {/* Axes */}
          <div className="mt-8 space-y-3">
            {levels.map(({ axis, level }) => (
              <div key={axis}>
                <div className="flex justify-between text-xs font-medium text-foreground/70">
                  <span>{axis}</span>
                  <span>{Math.round(level * 100)}%</span>
                </div>
                <div className="mt-1 h-2 rounded-full bg-muted overflow-hidden">
                  <div
                    className="h-full bg-gradient-gold rounded-full transition-all duration-700"
                    style={{ width: `${Math.round(level * 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Portrait */}
          <ol className="mt-10 space-y-3">
            {portrait.map((point, i) => (
              <li
                key={i}
                className="flex gap-3 rounded-2xl bg-card/70 p-4 shadow-soft animate-fade-up"
                style={{ animationDelay: `${i * 60}ms` }}
              >
                <span className="font-display text-xl text-primary leading-none">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span className="text-foreground/90 leading-snug">{point}</span>
              </li>
            ))}
          </ol>

          <div className="mt-10 flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={restart}
              className="rounded-full bg-gradient-warm px-8 py-3 font-medium text-primary-foreground shadow-glow transition-transform hover:scale-105"
            >
              Rejouer
            </button>
            <Link
              to="/"
              className="rounded-full border border-border px-8 py-3 text-center font-medium text-foreground/70 transition-colors hover:bg-muted"
            >
              Retour
            </Link>
          </div>
        </div>
      </div>
    );
  }

  /* ----------------------------- Jeu ----------------------------- */
  const dim = shuffledDims[step];

  return (
    <div className="min-h-screen bg-gradient-hero flex flex-col items-center justify-center px-4 py-10">
      {/* Progression */}
      <div className="w-full max-w-md mb-10">
        <div className="flex gap-1.5">
          {DIMENSIONS.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 flex-1 rounded-full transition-colors duration-300 ${
                i < step ? 'bg-primary' : i === step ? 'bg-primary/50' : 'bg-muted'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Choix */}
      <div
        key={dim.key}
        className="grid grid-cols-2 gap-4 sm:gap-6 w-full max-w-md animate-scale-in"
      >
        {dim.options.map((option) => (
          <button
            key={option.label}
            onClick={() => choose(option)}
            aria-label={option.label}
            className="aspect-square rounded-3xl bg-card shadow-card flex items-center justify-center text-6xl sm:text-7xl transition-all duration-200 hover:scale-110 hover:shadow-glow active:scale-95"
          >
            {option.emoji}
          </button>
        ))}
      </div>

      <p className="mt-10 text-xs uppercase tracking-[0.3em] text-muted-foreground">
        {step + 1} / {DIMENSIONS.length}
      </p>
    </div>
  );
}
