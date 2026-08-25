/* ============================================================
   LEGIO X EQVESTRIS — campagne de Gaule et guerre civile, 58–45 av. J.-C.
   Un écran, une décision. Le grade décide de ce que tu vois.
   ============================================================ */

const STATS = [
  { k:'virtus',     n:'Virtus',     i:'gladius',  d:'courage au fer' },
  { k:'disciplina', n:'Disciplina', i:'galea',    d:'tenue du rang, endurance' },
  { k:'scientia',   n:'Scientia',   i:'volumen',  d:'métier, terrain, lettres' },
  { k:'auctoritas', n:'Auctoritas', i:'laurea',   d:'poids auprès des hommes' },
  { k:'gratia',     n:'Gratia',     i:'manus',    d:'faveur des chefs' },
  { k:'valetudo',   n:'Valetudo',   i:'caduceus', d:'santé, blessures' }
];

/* portée : ce que tu vois et ce que tu peux ordonner */
const PORTEE = ['soldat','sousoff','centurion','superieur'];
const PORTEE_N = {
  soldat:    { n:'Rang',       vue:'ton contubernium et vingt pas de poussière' },
  sousoff:   { n:'Principal',  vue:'ta centurie, les enseignes voisines' },
  centurion: { n:'Centurion',  vue:'ta cohorte et ses appuis' },
  superieur: { n:'État-major', vue:'toute la ligne, les réserves, le terrain' }
};

const RANKS = [
  { n:'Tiro',                fr:'recrue au tirocinium',                 p:'soldat',    pay:0 },
  { n:'Miles Gregarius',     fr:'légionnaire de rang',                  p:'soldat',    pay:225 },
  { n:'Immunis',             fr:'spécialiste, exempt de corvées',       p:'soldat',    pay:225 },
  { n:'Tesserarius',         fr:'officier du mot de passe',             p:'soldat',    pay:337 },
  { n:'Optio',               fr:'adjoint du centurion, solde double',   p:'sousoff',   pay:450 },
  { n:'Centurio',            fr:'quatre-vingts hommes, premier rang',   p:'centurion', pay:3750 },
  { n:'Pilus Prior',         fr:'centurion commandant de cohorte',      p:'centurion', pay:5000 },
  { n:'Primus Pilus',        fr:'premier centurion de la légion',       p:'superieur', pay:15000 },
  { n:'Praefectus Fabrum',   fr:'préfet du génie — rang équestre',      p:'superieur', pay:20000 }
];

/* promotion : jeux de seuils ALTERNATIFS — il suffit d'en satisfaire un.
   Structurés en données pour être affichés en barres de progression. */
const PROMO = [
  { to:1, seuils:[{disciplina:22}],
    why:'sacramentum prêté, tirocinium achevé' },
  { to:2, seuils:[{scientia:42},{disciplina:48}],
    why:'une compétence que le camp te reconnaît' },
  { to:3, seuils:[{disciplina:50, auctoritas:42}],
    why:'on te confie la tessère et les sentinelles' },
  { to:4, seuils:[{virtus:52, auctoritas:55, gratia:45}],
    why:'le centurion te veut derrière le rang, bâton en main' },
  { to:5, seuils:[{virtus:62, auctoritas:62, gratia:57, disciplina:54}],
    why:'le légat a signé : tu porteras le cep de vigne' },
  { to:6, seuils:[{auctoritas:70, gratia:66, scientia:54}],
    why:'une cohorte entière manœuvre à ta voix' },
  { to:7, seuils:[{virtus:74, auctoritas:78, gratia:78}],
    why:'premier centurion de la légion — après toi, le légat' },
  { to:8, seuils:[{scientia:76, gratia:84}],
    why:'le proconsul te confie le génie ; l’ordre équestre s’ouvre' }
];
PROMO.forEach(p => { p.req = s => p.seuils.some(j => Object.keys(j).every(k => (s[k]||0) >= j[k])); });

const ORIGINES = [
  { n:'Fils de vétéran de Marius',
    d:'Ton père a marché contre les Cimbres. Il t’a laissé un gladius et des vieux qui se souviennent de son nom.',
    s:{ virtus:38, disciplina:40, scientia:22, auctoritas:30, gratia:34, valetudo:84 }, p:200 },
  { n:'Colon de Gaule cisalpine',
    d:'Un lopin de terre lourde près de Crémone. La marche et la faim ne t’apprendront rien de neuf.',
    s:{ virtus:34, disciplina:44, scientia:26, auctoritas:28, gratia:20, valetudo:92 }, p:120 },
  { n:'Prolétaire de la Subure',
    d:'Né dans une insula de Rome. Aucun bien, aucun nom, mais tu lis un homme avant qu’il ait parlé.',
    s:{ virtus:32, disciplina:28, scientia:28, auctoritas:38, gratia:32, valetudo:76 }, p:60 },
  { n:'Fils de décurion municipal',
    d:'Ton père siège à la curie d’une petite ville d’Italie. Tu as eu un grammairien, et cela se verra.',
    s:{ virtus:24, disciplina:32, scientia:46, auctoritas:26, gratia:42, valetudo:74 }, p:900 },
  { n:'Chevalier désargenté',
    d:'Ordre équestre, fortune fondue. Tu sers pour la refaire, sous le mépris des rangs.',
    s:{ virtus:28, disciplina:24, scientia:38, auctoritas:44, gratia:48, valetudo:78 }, p:2500 }
];

const VULNERA = [
  { n:'Balafre au visage',              e:{gratia:-2},                d:'La joue ouverte du sourcil à la mâchoire.' },
  { n:'Épaule droite raide',            e:{virtus:-4},                d:'Le bras ne monte plus au-dessus de l’horizontale.' },
  { n:'Jambe percée',                   e:{disciplina:-4},            d:'Elle porte, mais elle ne court plus vingt milles.' },
  { n:'Côtes ressoudées de travers',    e:{disciplina:-3,virtus:-2},  d:'Le souffle manque au bout d’une heure de combat.' },
  { n:'Main gauche à trois doigts',     e:{virtus:-3,disciplina:-2},  d:'Le bouclier tient par la courroie et l’habitude.' },
  { n:'Œil gauche perdu',               e:{scientia:-4,virtus:-2},    d:'On perd la profondeur, et on ne s’y fait jamais.' },
  { n:'Trait de fronde dans le crâne',  e:{scientia:-3,auctoritas:-2},d:'Des maux de tête qui durent trois jours.' },
  { n:'Tendon du poignet sectionné',    e:{virtus:-4,disciplina:-2},  d:'Le glaive se tient autrement, moins bien.' }
];
