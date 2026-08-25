/* ============================================================
   MOTEUR
   ============================================================ */

let S = null;               /* état de partie */
const CLE = 'cvrsvs_militiae_v1';

/* ---------- utilitaires ---------- */
const clamp = (v,a=0,b=100)=>Math.max(a,Math.min(b,v));
const rnd   = (a,b)=>a+Math.floor(Math.random()*(b-a+1));
const chance= (p)=>Math.random()*100<p;
const pick  = (arr)=>arr[Math.floor(Math.random()*arr.length)];

function romain(n){
  if(n<=0) return '—';
  const t=[[1000,'M'],[900,'CM'],[500,'D'],[400,'CD'],[100,'C'],[90,'XC'],[50,'L'],[40,'XL'],[10,'X'],[9,'IX'],[5,'V'],[4,'IV'],[1,'I']];
  let r=''; for(const [v,s] of t){ while(n>=v){ r+=s; n-=v; } } return r;
}
function annEcrite(an){ return Math.abs(an)+' av. J.-C.'; }
function auc(an){ return romain(754+an)+' a.u.c.'; }

/* ---------- effets sur l'état ---------- */
/* rendements décroissants : une recrue progresse vite, un vétéran arrache
   chaque point. On ne peut pas exceller partout — il faut choisir un profil. */
function facteurProgres(v){
  if(v<40) return 1;
  if(v<55) return 0.72;
  if(v<68) return 0.48;
  if(v<78) return 0.30;
  if(v<86) return 0.17;
  return 0.08;
}
function attenuer(v,n){
  const brut=n*facteurProgres(v);
  const ent=Math.floor(brut);
  return ent + (Math.random() < (brut-ent) ? 1 : 0);
}
function bump(s,attr,n){
  if(n===0) return null;
  if(n>0) n=attenuer(s[attr],n);
  if(n===0) return null;
  const av=s[attr]; s[attr]=clamp(s[attr]+n);
  const d=s[attr]-av; if(d===0) return null;
  const A=ATTRS.find(a=>a.id===attr);
  return (A?A.nom:attr)+' '+(d>0?'+':'')+d;
}
function favor(s,pid,n){
  const p=P[pid]; if(!p) return null;
  if(!(pid in s.patrons)) return null;
  if(n>0) n=attenuer(Math.max(0,s.patrons[pid]), n);
  if(n===0) return null;
  s.patrons[pid]=clamp(s.patrons[pid]+n,-100,100);
  return p.nom+' '+(n>0?'+':'')+n;
}
function hasPatron(s,pid,seuil){ return (s.patrons[pid]||0)>=seuil; }
function vivant(s,pid){ return pid in s.patrons; }
function superieurDirect(s){
  const dispo=Object.keys(s.patrons).filter(k=>k!=='caesar');
  return dispo.length? pick(dispo) : 'caesar';
}

const VULNERA=[
  {n:'Balafre au visage',            e:{ingenium:-2},   d:'La joue ouverte du sourcil à la mâchoire.'},
  {n:'Épaule droite raide',          e:{virtus:-3},     d:'Le bras ne monte plus au-dessus de l’horizontale.'},
  {n:'Jambe percée',                 e:{disciplina:-3}, d:'Elle porte, mais elle ne court plus vingt milles.'},
  {n:'Trois côtes ressoudées de travers',e:{disciplina:-2,virtus:-1},d:'Le souffle manque au bout d’une heure de combat.'},
  {n:'Main gauche à trois doigts',   e:{virtus:-2,disciplina:-1}, d:'Le bouclier tient par la courroie et l’habitude.'},
  {n:'Œil gauche perdu',             e:{scientia:-3,virtus:-1}, d:'On perd la profondeur, et on ne s’y fait jamais.'},
  {n:'Trait de fronde dans le crâne',e:{ingenium:-3,scientia:-2}, d:'Des maux de tête qui durent trois jours.'},
  {n:'Tendon du poignet sectionné',  e:{virtus:-3,disciplina:-1}, d:'Le glaive se tient autrement, moins bien.'}
];
function addVulnus(s){
  const dispo=VULNERA.filter(v=>!s.vulnera.some(x=>x.n===v.n));
  if(!dispo.length){ s.valetudo=clamp(s.valetudo-12); return 'Ancienne blessure rouverte'; }
  const v=pick(dispo); s.vulnera.push(v);
  for(const k in v.e) s[k]=clamp(s[k]+v.e[k]);
  return 'Blessure : '+v.n;
}

/* ---------- application d'un bloc d'effets ---------- */
function appliquer(eff, extra){
  const out=[];
  if(!eff) return out;
  for(const k in eff){
    const v=eff[k];
    if(k==='unit'){
      for(const uk in v){
        S.unit[uk]=clamp(S.unit[uk]+v[uk]);
        out.push({t:v[uk]>0?'up':'dn', s:'Unité · '+UNIT_LABEL[uk]+' '+(v[uk]>0?'+':'')+v[uk]});
      }
    } else if(k==='favor'){
      for(const pid in v){ const r=favor(S,pid,v[pid]); if(r) out.push({t:v[pid]>0?'up':'dn', s:r}); }
    } else if(k==='peculium'){
      let n = typeof v==='string' ? Math.round(evalStip(v)) : v;
      S.peculium=Math.max(0,S.peculium+n);
      out.push({t:n>0?'up':'dn', s:(n>0?'+':'')+n+' deniers'});
    } else if(k==='fama'){
      const n = v>0 ? attenuer(S.fama, v) : v;
      if(n===0) continue;
      S.fama=clamp(S.fama+n); out.push({t:n>0?'up':'dn', s:'Fama '+(n>0?'+':'')+n});
    } else if(k==='valetudo'||k==='valetudoEff'){
      S.valetudo=clamp(S.valetudo+v); out.push({t:v>0?'up':'dn', s:'Santé '+(v>0?'+':'')+v});
    } else if(ATTRS.some(a=>a.id===k)){
      const r=bump(S,k,v); if(r) out.push({t:v>0?'up':'dn', s:r});
    }
  }
  if(extra){
    if(extra.pertes) out.push(...pertesUnite(extra.pertes));
    if(extra.blessure && chance(extra.blessure*100)) out.push({t:'dn', s:addVulnus(S)});
    if(extra.candidature) { S.candidature+=extra.candidature; out.push({t:'up', s:'Candidature appuyée'}); }
    if(extra.karma) S.karma+=extra.karma;
    if(extra.soigne){ S.vulnera=S.vulnera.filter(()=>!chance(30)); }
    if(extra.favorRand){
      const ids=Object.keys(S.patrons).filter(k=>k!=='caesar');
      if(ids.length){ const r=favor(S,pick(ids),extra.favorRand); if(r) out.push({t:extra.favorRand>0?'up':'dn', s:r}); }
    }
  }
  return out;
}
const UNIT_LABEL={cohaesio:'cohésion',fatigatio:'fatigue',experientia:'expérience',fides:'fidélité',effectif:'effectif'};
function evalStip(str){
  const stip=S.grade.stip||225;
  const m=str.match(/^(-?)stip\*([\d.]+)$/);
  if(!m) return 0;
  return (m[1]==='-'?-1:1)*stip*parseFloat(m[2]);
}
function pertesUnite(pct){
  const out=[];
  const perdu=Math.max(1,Math.round(S.unit.effectif*pct/100));
  S.unit.effectif=Math.max(1,S.unit.effectif-perdu);
  S.unit.cohaesio=clamp(S.unit.cohaesio-Math.round(pct/3));
  out.push({t:'dn', s:'Pertes : '+perdu+' hommes ('+pct+'%)'});
  /* les camarades meurent avec l'unité */
  const vivants=S.commilitones.filter(c=>c.vivant);
  vivants.forEach(c=>{
    if(chance(pct*0.55)){
      c.vivant=false; c.mort={an:S.annee, lieu:S.lieu||'—'};
      out.push({t:'dn', s:'† '+c.nom+' — '+c.role});
      S.unit.fides=clamp(S.unit.fides-4);
    }
  });
  return out;
}

/* ---------- test de résolution ---------- */
function resoudre(test, dcBase){
  if(!test) return {niv:'succes', score:0, dc:0};
  const attr = test.brut ? (S[test.attr]||0) : (S[test.attr]||0);
  let uf;
  if(test.unit){ uf = S.unit[test.unit]||0; if(test.inv) uf = 100-uf; }
  else uf = Math.round((S.unit.cohaesio + S.unit.experientia)/2);
  const malus = (100-S.valetudo)*0.15 + S.unit.fatigatio*0.06;
  const jet = rnd(0,100);
  const score = 18 + 0.55*attr + 0.22*uf + 0.30*jet - malus;
  const dc = (dcBase||50) + (test.dc||0);
  let niv;
  if(score >= dc+22) niv='crit';
  else if(score >= dc) niv='succes';
  else niv='echec';
  return {niv, score:Math.round(score), dc:Math.round(dc), jet};
}

/* ---------- options visibles selon le grade ---------- */
function optsVisibles(opts){
  const sc=S.grade.scope;
  return opts.filter(o=>{
    if(!o.scopes) return true;
    if(o.scopes.includes('*')) return true;
    return o.scopes.includes(sc);
  }).map(o=>{
    let bloque=null;
    if(o.req){
      for(const k in o.req) if((S[k]||0) < o.req[k]){
        const A=ATTRS.find(a=>a.id===k);
        bloque=(A?A.nom:k)+' '+o.req[k]+' requis';
      }
    }
    return {...o, bloque};
  });
}

/* ---------- création du personnage ---------- */
const PRAENOMINA=['Lucius','Marcus','Gaius','Quintus','Publius','Titus','Sextus','Aulus','Gnaeus','Decimus','Servius','Manius'];
const NOMINA=['Valerius','Cornelius','Fabius','Sempronius','Terentius','Aemilius','Vibius','Petronius','Rutilius','Salvius','Munatius','Oppius','Baebius','Trebius','Naevius','Aufidius'];
const COGNOMINA=['Rufus','Severus','Longinus','Crispus','Niger','Priscus','Celsus','Varus','Sabinus','Maximus','Silvanus','Frugi','Bassus','Tuscus','Marcellus','Gallus'];
const COMMILITONES_ROLES=[
  {role:'de ton contubernium',   traits:['ne parle jamais avant la troisième coupe','a été berger chez les Marses','ronfle et le nie']},
  {role:'porte-outils du rang',  traits:['sait ferrer un cheval et recoudre un homme','joue aux dés et perd toujours','récite du Ennius en marchant']},
  {role:'de ton contubernium',   traits:['a une femme à Aquilée et deux enfants','le plus rapide de la centurie à monter la tente','ne sait pas nager']},
  {role:'ton voisin de rang',    traits:['engagé le même jour que toi','a peur des orages et pas des Gaulois','écrit les lettres des illettrés']}
];

function nouveauPersonnage(nom, origineId){
  const O=ORIGINES.find(o=>o.id===origineId)||ORIGINES[0];
  const s={
    nom, origine:O.id, originNom:O.nom,
    annee:-58, saison:'ver', turn:0,
    gradeId:'miles', grade:G.miles,
    virtus:26, disciplina:26, scientia:22, auctoritas:22, ingenium:24,
    fama:5, peculium:O.peculium, valetudo:100, aetas:rnd(18,23), stipendia:0,
    vulnera:[], legion:'Legio X Equestris', faction:'caesar', eques:O.id==='eques',
    patrons:{}, vacances:0, candidature:0, karma:0,
    batailles:0, decorations:[], commilitones:[], toursDansGrade:0,
    unit:{ type:'contubernium', nominal:8, effectif:8, cohaesio:45, fatigatio:10, experientia:15, fides:40 },
    log:[], mort:null, fin:null, tempus:2, faites:[], queue:[], etape:null, bat:null,
    lieu:'Genava, sur le Rhône', modeDur:true
  };
  for(const k in O.bonus) s[k]=clamp(s[k]+O.bonus[k]);
  /* patrons de départ */
  s.patrons.caesar = 4;
  s.patrons.balventius = 20;
  s.patrons.labienus = 3;
  if(O.id==='municipal'){ s.patrons.cicero = 22; }
  if(O.id==='eques'){ s.patrons.labienus = 18; s.patrons.crassus = 14; }
  if(O.id==='veteran'){ s.patrons.balventius = 34; }
  /* camarades */
  const usedN=new Set();
  COMMILITONES_ROLES.forEach(r=>{
    let n; do{ n=pick(PRAENOMINA)+' '+pick(COGNOMINA); }while(usedN.has(n)); usedN.add(n);
    s.commilitones.push({ nom:n, role:r.role, trait:pick(r.traits), vivant:true, grade:'Miles' });
  });
  return s;
}

/* ---------- patrons : arrivées, départs, morts ---------- */
function majPatrons(){
  PATRONS.forEach(p=>{
    if(p.arrivee && S.annee>=p.arrivee.annee && !(p.id in S.patrons)){
      S.patrons[p.id]=p.fav||0;
      journal(p.nom+' rejoint l’état-major.','y');
    }
    if(p.mort && S.annee>=p.mort.annee && (p.id in S.patrons)){
      delete S.patrons[p.id];
      journal('† '+p.nom+' — '+(p.id==='crassus'?'tué à Carrhes':'tombé au service'),'r');
    }
    if(p.depart && S.annee>=p.depart.annee && (p.id in S.patrons)){
      delete S.patrons[p.id];
      journal(p.nom+' quitte l’armée des Gaules.','');
    }
  });
  /* bascule de 49 */
  if(S.annee>=-49 && S.faction==='caesar' && (S.patrons.labienus!==undefined)){
    const f=S.patrons.labienus;
    delete S.patrons.labienus;
    journal('T. Labienus passe à Pompée. Neuf ans de service auprès de César, et il part.','r');
    if(f>45){ S.fama=clamp(S.fama-6); journal('Ton nom était lié au sien. On te regarde.','r'); }
  }
}

/* ---------- promotions ---------- */
const CURSUS={
  tiro:['miles'], miles:['immunis'], immunis:['tesserarius'],
  tesserarius:['optio','signifer'], signifer:['optio','aquilifer'], aquilifer:['centurio'],
  optio:['centurio'], centurio:['pilus_prior'], pilus_prior:['primi_ordinis'],
  primi_ordinis:['primipilus'], primipilus:['praef_fabrum','tribunus'],
  praef_fabrum:['tribunus'], tribunus:['legatus'], legatus:[], praef_equit:['tribunus']
};
/* attrs : liste de jeux d'exigences ALTERNATIFS — il suffit d'en satisfaire un.
   Chaque grade a la ou les portes que l'histoire lui connaît :
   l'immunis est un spécialiste, le signifer tient la caisse d'épargne de la
   centurie autant que l'enseigne, le préfet des ouvriers est un ingénieur. */
const SEUILS={
  immunis:      {fama:8,  favor:6,  attrs:[{disciplina:32},{scientia:34},{ingenium:36}]},
  tesserarius:  {fama:16, favor:13, attrs:[{disciplina:40,auctoritas:30},{scientia:44,disciplina:34}]},
  optio:        {fama:26, favor:22, attrs:[{auctoritas:42,disciplina:42},{auctoritas:38,ingenium:46}]},
  signifer:     {fama:26, favor:22, attrs:[{virtus:44,disciplina:40},{virtus:40,ingenium:44}]},
  aquilifer:    {fama:40, favor:38, attrs:[{virtus:54,disciplina:50}]},
  centurio:     {fama:38, favor:34, attrs:[{virtus:48,auctoritas:48},{auctoritas:52,scientia:46},{virtus:52,ingenium:48}]},
  pilus_prior:  {fama:48, favor:42, attrs:[{auctoritas:56,virtus:50},{auctoritas:52,scientia:54}]},
  primi_ordinis:{fama:62, favor:58, favorDe:'caesar', attrs:[{auctoritas:66,virtus:58},{auctoritas:61,scientia:63},{auctoritas:61,ingenium:63}]},
  primipilus:   {fama:78, favor:76, favorDe:'caesar', attrs:[{auctoritas:79,virtus:69,disciplina:67},{auctoritas:75,virtus:65,scientia:71}]},
  praef_fabrum: {fama:70, favor:70, favorDe:'caesar', attrs:[{scientia:79,ingenium:63},{scientia:75,disciplina:71}]},
  tribunus:     {fama:76, favor:74, favorDe:'caesar', eques:true, attrs:[{ingenium:69,scientia:69,auctoritas:73},{ingenium:77,auctoritas:75}]},
  legatus:      {fama:88, favor:88, favorDe:'caesar', eques:true, attrs:[{auctoritas:80,scientia:76,ingenium:72}]}
};
/* Le cursus romain se parcourait lentement : on servait des années dans un
   grade avant d'être proposé au suivant. Sans cela, une bonne saison suffirait
   à traverser toute l'échelle. */
const TEMPS_MIN={ miles:1, immunis:2, tesserarius:3, optio:3, signifer:3, aquilifer:4,
  centurio:4, pilus_prior:5, primi_ordinis:6, primipilus:6, praef_fabrum:5, tribunus:6, legatus:8 };

function meilleurPatron(){
  let best=null, v=-999;
  for(const pid in S.patrons){ if(S.patrons[pid]>v){ v=S.patrons[pid]; best=pid; } }
  return {pid:best, fav:v};
}
function candidatsPromotion(){
  const suite=CURSUS[S.gradeId]||[];
  const mp=meilleurPatron();
  return suite.filter(gid=>{
    const req=SEUILS[gid]; if(!req) return false;
    if((S.toursDansGrade||0) < (TEMPS_MIN[gid]||3)) return false;
    if(req.eques && !S.eques) return false;
    if(S.fama < req.fama - S.candidature*3) return false;
    const ok = req.attrs.some(jeu => Object.keys(jeu).every(k => (S[k]||0) >= jeu[k]));
    if(!ok) return false;
    const fav = req.favorDe ? (S.patrons[req.favorDe]!==undefined ? S.patrons[req.favorDe] : -100) : mp.fav;
    if(fav < req.favor - S.candidature*4) return false;
    return true;
  });
}
function promouvoir(gid){
  const g=G[gid];
  S.gradeId=gid; S.grade=g; S.vacances=Math.max(0,S.vacances-1); S.candidature=0; S.toursDansGrade=0;
  if(gid==='primipilus'){ S.eques=true; journal('Le primipilat te vaut l’inscription à l’ordre équestre.','y'); }
  const u=UNITES[g.unite];
  if(u && S.unit.type!==g.unite){
    S.unit={ type:g.unite, nominal:u.nominal, effectif:Math.round(u.nominal*0.9),
      cohaesio:clamp(S.unit.cohaesio-6), fatigatio:S.unit.fatigatio,
      experientia:clamp(S.unit.experientia-4), fides:clamp(S.unit.fides-10) };
  }
  journal('PROMOTION — '+g.nom,'y');
}

/* ---------- journal ---------- */
function journal(txt,cls){
  S.log.unshift({t:txt, c:cls||'', d:SAISONS.find(x=>x.id===S.saison).nom+' '+Math.abs(S.annee)});
  if(S.log.length>130) S.log.pop();
}

/* ---------- construction du tour ---------- */
function construireTour(){
  const ch=chroniqueAt(S.annee,S.saison);
  S.lieu = ch? ch.lieu : S.lieu;
  S.chron = ch;
  S.queue=[];
  if(ch && ch.recit) S.queue.push({t:'recit'});
  S.queue.push({t:'ordres'});
  if(ch && ch.evenement) S.queue.push({t:'ev', id:ch.evenement});
  else if(chance(72)) S.queue.push({t:'alea'});
  if(ch && ch.bataille){
    let bid=ch.bataille;
    if(S.faction==='pompee' && bid==='pharsale') bid='pharsale_pomp';
    if(BATAILLES[bid]) S.queue.push({t:'bat', id:bid});
  }
  S.queue.push({t:'bilan'});
  S.tempus=2; S.faites=[];
  suivant();
}
function suivant(){
  if(!S.queue.length){ avancerSaison(); return; }
  S.etape=S.queue.shift();
  if(S.etape.t==='alea'){
    const dispo=ALEA.filter(e=>!e.cond || e.cond(S));
    if(!dispo.length){ suivant(); return; }
    const total=dispo.reduce((a,e)=>a+(e.poids||5),0);
    let r=Math.random()*total, choisi=dispo[0];
    for(const e of dispo){ r-=(e.poids||5); if(r<=0){ choisi=e; break; } }
    S.etape={t:'ev', ev:choisi};
  }
  if(S.etape.t==='ev' && S.etape.id==='fin'){ finPartie('carriere'); return; }
  if(S.etape.t==='ev' && S.etape.id) S.etape.ev=EVENEMENTS[S.etape.id];
  if(S.etape.t==='bat'){ S.bat={ id:S.etape.id, ph:0, perf:0, hist:[] }; S.batailles++; }
  if(S.etape.t==='bilan'){ bilan(); return; }
  render();
}

/* ---------- fin de tour ---------- */
function bilan(){
  const out=[];
  /* solde */
  const paie=Math.round((S.grade.stip||225)/3);
  S.peculium+=paie;
  /* récupération */
  if(S.saison==='hiberna'){ S.valetudo=clamp(S.valetudo+rnd(6,14)); S.unit.fatigatio=clamp(S.unit.fatigatio-rnd(14,24)); }
  else { S.valetudo=clamp(S.valetudo+rnd(1,5)); S.unit.fatigatio=clamp(S.unit.fatigatio-rnd(3,8)); }
  /* recomplètement */
  if(S.unit.effectif < S.unit.nominal){
    const r=Math.min(S.unit.nominal-S.unit.effectif, Math.ceil(S.unit.nominal*(S.saison==='hiberna'?0.14:0.05)));
    if(r>0){
      S.unit.effectif+=r;
      S.unit.experientia=clamp(S.unit.experientia-Math.round(r/S.unit.nominal*22));
      out.push(r+' recrue'+(r>1?'s':'')+' incorporée'+(r>1?'s':''));
    }
  }
  /* fatigue chronique */
  if(S.unit.fatigatio>80){ S.unit.fides=clamp(S.unit.fides-4); out.push('Épuisement : la fidélité s’effrite.'); }
  if(S.valetudo<25) out.push('Ta santé est mauvaise. Une saison de plus et tu ne tiendras pas.');
  /* patrons */
  majPatrons();
  /* la réputation suit l’ancienneté, la conduite et l’opinion de l’unité */
  const cible = Math.min(58, Math.round(14 + S.stipendia*1.7 + (S.unit.fides-50)*0.22 + S.decorations.length*5 + S.grade.ordre*1.6));
  if(S.fama < cible){ S.fama=clamp(S.fama+rnd(1,3)); }
  else if(S.fama > cible+22){ S.fama=clamp(S.fama-1); }
  /* vacances d’officiers */
  if(chance(26)) S.vacances++;
  /* promotion */
  const cands=candidatsPromotion();
  if(S.vacances>0 && cands.length){
    S.etape={t:'promo', cands};
    S.bilanNotes=out; render(); return;
  }
  S.bilanNotes=out;
  S.etape={t:'bilanAff'};
  render();
}
function avancerSaison(){
  S.turn++; S.toursDansGrade=(S.toursDansGrade||0)+1;
  const ordre=['ver','aestas','hiberna'];
  let i=ordre.indexOf(S.saison);
  if(i===2){ S.saison='ver'; S.annee++; S.aetas++; S.stipendia++; }
  else S.saison=ordre[i+1];
  if(S.valetudo<=0){ mourir('Ta santé a cédé avant l’ennemi.'); return; }
  const ch=chroniqueAt(S.annee,S.saison);
  if(!ch){ finPartie('survie'); return; }
  sauver();
  construireTour();
}

/* ---------- mort et fin ---------- */
function mourir(cause){
  S.mort={ cause, an:S.annee, sa:S.saison, lieu:S.lieu };
  journal('† '+cause,'r');
  sauver(); render();
}
function finPartie(type){
  S.fin={ type };
  sauver(); render();
}

/* ---------- sauvegarde ---------- */
function sauver(){ try{ localStorage.setItem(CLE, JSON.stringify(S)); }catch(e){} }
function charger(){
  try{
    const raw=localStorage.getItem(CLE); if(!raw) return null;
    const s=JSON.parse(raw); s.grade=G[s.gradeId]; return s;
  }catch(e){ return null; }
}
function effacer(){ try{ localStorage.removeItem(CLE); }catch(e){} }
