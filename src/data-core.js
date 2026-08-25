/* ============================================================
   CVRSVS MILITIAE — données de base
   Rome, 58–45 av. J.-C. — légions de C. Iulius Caesar
   ============================================================ */

const SAISONS = [
  { id:'ver',     nom:'Ver',     fr:'Printemps', desc:'Le camp se réveille, on rassemble le blé et les recrues.' },
  { id:'aestas',  nom:'Aestas',  fr:'Été',       desc:'Saison de la guerre. On marche.' },
  { id:'hiberna', nom:'Hiberna', fr:'Quartiers d’hiver', desc:'On s’enterre dans les camps, on compte les morts et les vivants.' }
];

/* ---------- attributs ---------- */
const ATTRS = [
  { id:'virtus',     nom:'Virtus',     fr:'Courage au fer',     desc:'Ta valeur devant l’ennemi, et ce que les autres croient de toi quand la ligne plie.' },
  { id:'disciplina', nom:'Disciplina', fr:'Tenue et endurance', desc:'La marche de vingt milles sous trente kilos, l’ordre exécuté sans discuter.' },
  { id:'scientia',   nom:'Scientia',   fr:'Art militaire',      desc:'Terrain, ravitaillement, ordre de bataille. Ce qui ouvre les options que les autres ne voient pas.' },
  { id:'auctoritas', nom:'Auctoritas', fr:'Ascendant',          desc:'Ce qui fait qu’un ordre de toi est exécuté avant d’être compris.' },
  { id:'ingenium',   nom:'Ingenium',   fr:'Entregent',          desc:'Lire une salle, placer un mot, se faire un patron. Rome se gagne aussi ainsi.' }
];

/* ---------- cursus ---------- */
/* scope : ce que tu VOIS et COMMANDES en bataille */
const GRADES = [
  { id:'tiro',        nom:'Tiro',                     court:'TIRO',      scope:'soldat',    unite:'contubernium', stip:150,   ordre:0,
    desc:'Recrue. On te reprend ta pique de bois quand tu sais t’en servir.' },
  { id:'miles',       nom:'Miles gregarius',          court:'MILES',     scope:'soldat',    unite:'contubernium', stip:225,   ordre:1,
    desc:'Légionnaire de rang. Huit hommes, une tente, une meule, une mule.' },
  { id:'immunis',     nom:'Immunis',                  court:'IMMVNIS',   scope:'soldat',    unite:'contubernium', stip:225,   ordre:2,
    desc:'Spécialiste dispensé de corvées : arpenteur, forgeron, scribe du camp.' },
  { id:'tesserarius', nom:'Tesserarius',              court:'TESSERAR.', scope:'soldat',    unite:'contubernium', stip:337,   ordre:3,
    desc:'Tu portes la tessère du mot de passe et tu réponds des sentinelles.' },
  { id:'signifer',    nom:'Signifer',                 court:'SIGNIFER',  scope:'sousoff',   unite:'centuria',     stip:450,   ordre:4,
    desc:'Tu portes l’enseigne de la centurie et tu tiens la caisse d’épargne des hommes.' },
  { id:'optio',       nom:'Optio centuriae',          court:'OPTIO',     scope:'sousoff',   unite:'centuria',     stip:450,   ordre:4,
    desc:'Second du centurion, à l’arrière du rang, bâton en main : nul ne recule.' },
  { id:'aquilifer',   nom:'Aquilifer',                court:'AQVILIFER', scope:'sousoff',   unite:'legio',        stip:450,   ordre:5,
    desc:'Tu portes l’aigle de la légion. Là où elle va, la légion suit ou meurt.' },
  { id:'centurio',    nom:'Centurio',                 court:'CENTVRIO',  scope:'centurion', unite:'centuria',     stip:3750,  ordre:6,
    desc:'Quatre-vingts hommes. Tu marches au premier rang, à droite. C’est là qu’on meurt.' },
  { id:'pilus_prior', nom:'Centurio pilus prior',     court:'PILVS PR.', scope:'centurion', unite:'cohors',       stip:5000,  ordre:7,
    desc:'Centurion supérieur : la cohorte entière manœuvre à ta voix.' },
  { id:'primi_ordinis',nom:'Centurio primi ordinis',  court:'PRIMI ORD.',scope:'superieur', unite:'cohors',       stip:7500,  ordre:8,
    desc:'Centurion de la première cohorte. Tu sièges au conseil de guerre.' },
  { id:'primipilus',  nom:'Primus pilus',             court:'PRIMIPILVS',scope:'superieur', unite:'legio',        stip:15000, ordre:9,
    desc:'Premier centurion de la légion. Après toi, il n’y a que le légat — et César.' },
  { id:'praef_fabrum',nom:'Praefectus fabrum',        court:'PRAEF. FAB.',scope:'superieur',unite:'legio',        stip:20000, ordre:10,
    desc:'Chef du génie et de l’intendance du proconsul. Rang équestre.' },
  { id:'tribunus',    nom:'Tribunus militum',         court:'TRIBVNVS',  scope:'superieur', unite:'legio',        stip:24000, ordre:11,
    desc:'Tribun de la légion. On te confie des cohortes, parfois une aile entière.' },
  { id:'praef_equit', nom:'Praefectus equitum',       court:'PRAEF. EQ.',scope:'superieur', unite:'ala',          stip:24000, ordre:11,
    desc:'Tu commandes la cavalerie alliée. Vitesse, reconnaissance, poursuite.' },
  { id:'legatus',     nom:'Legatus legionis',         court:'LEGATVS',   scope:'superieur', unite:'legio',        stip:40000, ordre:12,
    desc:'Légat. Une légion entière répond de toi devant le proconsul.' }
];
const G = {}; GRADES.forEach(g => G[g.id] = g);

const SCOPE_LABEL = {
  soldat:    { nom:'Rang',       vue:'ton contubernium et vingt pas de poussière' },
  sousoff:   { nom:'Principal',  vue:'ta centurie, les enseignes voisines' },
  centurion: { nom:'Centurion',  vue:'ta cohorte et ses appuis' },
  superieur: { nom:'État-major', vue:'toute la ligne, les réserves, le terrain' }
};

const UNITES = {
  contubernium:{ nom:'Contubernium', nominal:8,   fr:'8 hommes, une tente' },
  centuria:    { nom:'Centuria',     nominal:80,  fr:'80 hommes' },
  cohors:      { nom:'Cohors',       nominal:480, fr:'6 centuries' },
  legio:       { nom:'Legio',        nominal:4800,fr:'10 cohortes' },
  ala:         { nom:'Ala',          nominal:500, fr:'cavalerie alliée' }
};

/* ---------- patrons ---------- */
/* faction en 49 : 'caesar' | 'pompee' | 'mort' | 'neutre'          */
const PATRONS = [
  { id:'caesar', nom:'C. Iulius Caesar', titre:'Proconsul des Gaules', supreme:true, fav:10,
    trait:'Retient les noms des centurions comme d’autres retiennent les dettes.', faction49:'caesar' },
  { id:'labienus', nom:'T. Labienus', titre:'Legatus pro praetore', fav:5,
    trait:'Le plus dur des légats, le plus habile aussi. Ambitieux jusqu’à l’os.', faction49:'pompee' },
  { id:'balventius', nom:'T. Balventius', titre:'Primus pilus, LEG. X', fav:20, mentor:true,
    trait:'Vingt-huit ans de service. Il t’apprendra tout, s’il te juge digne.', faction49:'caesar', mort:{annee:-54} },
  { id:'crassus', nom:'P. Licinius Crassus', titre:'Legatus, fils du triumvir', fav:0,
    trait:'Jeune, brillant, riche. Il part pour la Parthie en 54.', faction49:'mort', mort:{annee:-53} },
  { id:'cicero', nom:'Q. Tullius Cicero', titre:'Legatus', fav:0,
    trait:'Frère de l’orateur. Pédant, courageux, susceptible.', faction49:'neutre', depart:{annee:-51} },
  { id:'antonius', nom:'M. Antonius', titre:'Quaestor, puis Legatus', fav:0, arrivee:{annee:-52},
    trait:'Boit, joue, se bat comme un dieu. On le suit sans savoir pourquoi.', faction49:'caesar' },
  { id:'trebonius', nom:'C. Trebonius', titre:'Legatus', fav:0,
    trait:'Méthodique, ingénieur de siège. Ce qu’il assiège tombe.', faction49:'caesar' },
  { id:'sabinus', nom:'Q. Titurius Sabinus', titre:'Legatus', fav:0,
    trait:'Crédule sous le vernis. Il écoute trop les Gaulois qui parlent bien.', faction49:'mort', mort:{annee:-54} },
  { id:'scaeva', nom:'M. Cassius Scaeva', titre:'Centurio, LEG. VI', fav:0, arrivee:{annee:-48},
    trait:'Cent vingt trous dans son bouclier à Dyrrachium. Il vit encore.', faction49:'caesar' }
];
const P = {}; PATRONS.forEach(p => P[p.id] = p);

/* ---------- origines du personnage ---------- */
const ORIGINES = [
  { id:'colonus', nom:'Colon de Cisalpine', pick:'Fils de colon, Gaule cisalpine',
    desc:'Ta famille a reçu un lopin près de Crémone. Terre lourde, hivers durs, latin rugueux.',
    bonus:{ disciplina:+8, virtus:+4 }, peculium:120, note:'La marche et la faim ne t’apprendront rien de neuf.' },
  { id:'urbain', nom:'Prolétaire de Rome', pick:'Prolétaire de la Subure',
    desc:'Né dans une insula de la Subure. Tu sais lire un homme avant qu’il ait parlé.',
    bonus:{ ingenium:+9, virtus:+3 }, peculium:60, note:'Aucun bien, aucun nom, mais toutes les ficelles.' },
  { id:'municipal', nom:'Notable municipal', pick:'Fils de décurion municipal',
    desc:'Ton père siège à la curie d’une petite ville d’Italie. Tu as eu un grammairien.',
    bonus:{ scientia:+8, ingenium:+5 }, peculium:900, note:'Tu commences avec un patron qui te doit une politesse.' },
  { id:'veteran', nom:'Fils de vétéran de Marius', pick:'Fils de vétéran marianiste',
    desc:'Ton père a marché contre les Cimbres. Il t’a laissé un gladius et une réputation.',
    bonus:{ virtus:+9, disciplina:+5 }, peculium:200, note:'Les vieux du camp connaissaient ton père.' },
  { id:'eques', nom:'Jeune chevalier', pick:'Chevalier romain désargenté',
    desc:'Ordre équestre, mais la fortune familiale a fondu. Tu sers pour la refaire.',
    bonus:{ auctoritas:+9, ingenium:+6, disciplina:-3 }, peculium:2500, note:'Le tribunat t’est ouvert — le mépris des rangs aussi.' }
];

/* ---------- actions de tour ---------- */
const ACTIONS = [
  { id:'exercitatio', nom:'Exercitatio armorum', desc:'Pieu de bois, gladius de plomb, jusqu’au dégoût.',
    eff:'Virtus, Disciplina · fatigue', cout:1,
    apply:(s)=>{ const r=[]; r.push(bump(s,'virtus',rnd(1,3))); r.push(bump(s,'disciplina',rnd(0,2)));
      s.unit.experientia=clamp(s.unit.experientia+rnd(1,3)); s.unit.fatigatio=clamp(s.unit.fatigatio+rnd(3,7));
      r.push('Unité : expérience +'); return r; } },

  { id:'instruire', nom:'Instruire l’unité', desc:'Tu les fais manœuvrer jusqu’à ce que l’ordre précède la pensée.',
    eff:'Cohésion, expérience, Auctoritas', cout:1, minScope:['sousoff','centurion','superieur'],
    apply:(s)=>{ const r=[]; s.unit.cohaesio=clamp(s.unit.cohaesio+rnd(2,5)); s.unit.experientia=clamp(s.unit.experientia+rnd(2,4));
      s.unit.fatigatio=clamp(s.unit.fatigatio+rnd(2,5)); r.push('Unité : cohésion et expérience +'); r.push(bump(s,'auctoritas',rnd(2,5))); return r; } },


  { id:'contubernium', nom:'Tenir ton contubernium', desc:'Huit hommes, une tente. Répartir les corvées, arbitrer, veiller à ce que chacun mange.',
    eff:'Auctoritas, cohésion, fidélité', cout:1, maxScope:['soldat'],
    apply:(s)=>{ const r=[]; r.push(bump(s,'auctoritas',rnd(2,4)));
      s.unit.cohaesio=clamp(s.unit.cohaesio+rnd(2,4)); s.unit.fides=clamp(s.unit.fides+rnd(2,5));
      if(chance(30)) s.fama=clamp(s.fama+attenuer(s.fama,1));
      r.push('Unité : cohésion et fidélité +'); return r; } },

  { id:'munera', nom:'Munera castrorum', desc:'Fossé, palissade, latrines, four. Le camp romain se bâtit chaque soir.',
    eff:'Disciplina · faveur du supérieur', cout:1,
    apply:(s)=>{ const r=[]; r.push(bump(s,'disciplina',rnd(1,3))); s.unit.fatigatio=clamp(s.unit.fatigatio+rnd(4,8));
      const pid=superieurDirect(s); r.push(favor(s,pid,rnd(2,5)));
      r.push(bump(s,'auctoritas',rnd(0,1)));
      if(chance(28)){ s.fama=clamp(s.fama+attenuer(s.fama,1)); } return r; } },

  { id:'studium', nom:'Studium rei militaris', desc:'Écouter les vieux, lire les commentaires, refaire les batailles sur le sable.',
    eff:'Scientia', cout:1,
    apply:(s)=>{ const r=[]; let g=rnd(2,4); if(hasPatron(s,'balventius',30)) g+=2; if(s.origine==='municipal') g+=1;
      r.push(bump(s,'scientia',g)); return r; } },

  { id:'cura', nom:'Cura commilitonum', desc:'Vin pour les blessés, cotisation funéraire, une lettre écrite pour l’illettré.',
    eff:'Fides de l’unité, Fama · coûte', cout:1,
    apply:(s)=>{ const r=[]; const c=Math.min(s.peculium, 15+s.grade.ordre*10); s.peculium-=c;
      s.unit.fides=clamp(s.unit.fides+rnd(3,6));
      if(chance(35)){ s.fama=clamp(s.fama+attenuer(s.fama,1)); }
      r.push(bump(s,'auctoritas',rnd(0,2)));
      r.push('Unité : fidélité +'); r.push('-'+c+' deniers'); return r; } },

  { id:'ambitio', nom:'Ambitio', desc:'Se faire voir. Un présent bien placé, un service rendu à qui compte.',
    eff:'Faveur d’un patron, Ingenium · coûte', cout:1, cible:'patron',
    apply:(s,pid)=>{ const r=[]; const c=Math.min(s.peculium, 40+s.grade.ordre*25); s.peculium-=c;
      let g=rnd(3,7)+Math.floor(s.ingenium/18); if(c<20) g=Math.floor(g/2);
      r.push(favor(s,pid,g)); r.push(bump(s,'ingenium',rnd(0,2))); r.push('-'+c+' deniers'); return r; } },

  { id:'praeda', nom:'Praeda et negotium', desc:'Revendre le butin, prêter à intérêt aux camarades, racheter des captifs.',
    eff:'Peculium · risque de Fama', cout:1,
    apply:(s)=>{ const r=[]; const g=rnd(30,90)+s.grade.ordre*35+Math.floor(s.ingenium*1.5);
      s.peculium+=g; r.push('+'+g+' deniers');
      if(chance(22)){ s.fama=clamp(s.fama-rnd(2,4)); r.push('On jase : Fama -'); } return r; } },

  { id:'quies', nom:'Quies', desc:'Dormir, manger, laisser les plaies se fermer.',
    eff:'Santé + · fatigue -', cout:1,
    apply:(s)=>{ const r=[]; s.valetudo=clamp(s.valetudo+rnd(6,13)); s.unit.fatigatio=clamp(s.unit.fatigatio-rnd(8,16));
      r.push('Santé +, fatigue -'); return r; } },

  { id:'explorare', nom:'Explorare', desc:'Sortir avec les éclaireurs, lire le pays avant qu’il te lise.',
    eff:'Scientia, faveur · danger', cout:1, saison:['ver','aestas'],
    apply:(s)=>{ const r=[]; r.push(bump(s,'scientia',rnd(1,3))); r.push(favor(s,'caesar',rnd(1,3)));
      if(chance(20)){ const d=rnd(5,14); s.valetudo=clamp(s.valetudo-d); r.push('Embuscade : santé -'+d);
        if(chance(35)) r.push(addVulnus(s)); }
      else { r.push(bump(s,'virtus',1)); } return r; } }
];
