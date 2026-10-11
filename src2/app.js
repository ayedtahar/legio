/* ============================================================
   MOTEUR + INTERFACE
   ============================================================ */
const $=(id)=>document.getElementById(id);
const clamp=(v,a=0,b=100)=>Math.max(a,Math.min(b,v));
const rnd=(n)=>Math.floor(Math.random()*n);
const pick=(a)=>a[Math.floor(Math.random()*a.length)];
const esc=(s)=>String(s).replace(/[<>&]/g,c=>({'<':'&lt;','>':'&gt;','&':'&amp;'}[c]));
const CLE='cvrsvs_v3';

let S=null;
let V={ nota:false, res:null, promo:null, onglet:'castra' };

function melange(a){ const x=[...a]; for(let i=x.length-1;i>0;i--){ const j=rnd(i+1); [x[i],x[j]]=[x[j],x[i]]; } return x; }
function romain(n){ if(n<=0) return '—';
  const t=[[1000,'M'],[900,'CM'],[500,'D'],[400,'CD'],[100,'C'],[90,'XC'],[50,'L'],[40,'XL'],[10,'X'],[9,'IX'],[5,'V'],[4,'IV'],[1,'I']];
  let r=''; for(const [v,s] of t){ while(n>=v){ r+=s; n-=v; } } return r; }
function lapid(s){ return s.toUpperCase().replace(/U/g,'V').split(' ').join('&nbsp;·&nbsp;'); }

function facteurProgres(v){
  if(v<40) return 1; if(v<55) return .70; if(v<68) return .46;
  if(v<78) return .28; if(v<86) return .16; return .07;
}
function attenuer(v,n){ const b=n*facteurProgres(v), e=Math.floor(b); return e+(Math.random()<(b-e)?1:0); }

/* ---------- séquence ---------- */
function construireSeq(ph){
  const fixes=ph.events.filter(e=>e.at!==undefined);
  const libres=melange(ph.events.filter(e=>e.at===undefined));
  const reserve=melange(COMMUNS.filter(e=>e.ch.includes(ph.id) && !S.vus.includes(e.t)));
  const seq=new Array(ph.len).fill(null);
  fixes.forEach(e=>{ let i=Math.min(e.at,ph.len-1),g=0;
    while(seq[i]&&g<ph.len){ i=(i+1)%ph.len; g++; } seq[i]=e; });
  const pool=[...libres,...reserve]; let pi=0;
  for(let i=0;i<ph.len;i++) if(!seq[i]&&pi<pool.length) seq[i]=pool[pi++];
  return seq.filter(Boolean);
}
function chapitre(){ return S.pompee?POMPEE:PHASES[S.ch]; }
function evenement(){ return S.seq[S.t]; }
function annee(){ const p=chapitre(); return p.y0+Math.round((S.t/Math.max(1,p.len-1))*(p.y1-p.y0)); }
function portee(){ return RANKS[S.rank].p; }
function totalEv(){ return PHASES.reduce((a,p)=>a+p.len,0); }
function faitEv(){ let n=0; for(let i=0;i<S.ch;i++) n+=PHASES[i].len; return n+S.t; }

/* ---------- création ---------- */
function nouvelle(o){
  S={ nom:nomRomain(), orig:o.n, s:{...o.s}, peculium:o.p, rank:1, ch:0, seq:[], t:0,
      vulnera:[], dona:[], log:[], notas:[], liens:{}, vus:[], fin:null, pompee:false, finPromo:null };
  S.seq=construireSeq(PHASES[0]);
  S.log.push({ y:PHASES[0].y0, t:`Sacramentum — ${o.n}` });
  V={ nota:false, res:null, promo:null, onglet:'castra' };
  sauver(); rendre();
}

/* ---------- options ---------- */
function etatOption(o){
  const pi=PORTEE.indexOf(portee()), oi=PORTEE.indexOf(o.p||'soldat');
  if(oi>pi+1) return {cache:true};
  if(oi>pi) return {verrou:PORTEE_N[o.p].n+' requis'};
  if(o.need){ const st=STATS.find(x=>x.k===o.need.s);
    if((S.s[o.need.s]||0)<o.need.min) return {verrou:`${st.n} ${o.need.min}`}; }
  return {};
}
function proba(c){ return Math.round(clamp((S.s[c.s]+25-c.dc+1)/26,0,1)*100); }

/* Aperçu d'une option : on annonce le PRIX, jamais la récompense.
   Un homme sait d'avance si une chose est dangereuse, coûteuse ou sans retour.
   Il ne sait pas qu'elle lui vaudra onze points de courage : cela, il faut le
   lire dans ce qu'on lui décrit — et le découvrir après. */
function apercu(o){
  const out=[];
  const a=(o.res&&o.res.e)||{}, b=(o.ok&&o.ok.e)||{}, c=(o.ko&&o.ko.e)||{};
  const val=Math.min(a.valetudo||0, b.valetudo||0, c.valetudo||0);
  const pec=(a.peculium||0)+(b.peculium||0);
  const blessure=a.vulnus||b.vulnus||c.vulnus;

  if(o.check){
    const p=proba(o.check);
    const mot = p>=78?'tu t’en crois capable' : p>=55?'c’est jouable'
              : p>=32?'c’est incertain'      : 'c’est au-delà de toi';
    out.push({c:'pari', i:'clepsydra', t:mot});
  }
  if(blessure)      out.push({c:'perte', i:'gladius', t:'blessure certaine'});
  else if(val<=-15) out.push({c:'perte', i:'gladius', t:'tu peux y rester'});
  else if(val<=-8)  out.push({c:'perte', i:'gladius', t:'sanglant'});
  else if(val<=-3)  out.push({c:'perte', i:'gladius', t:'rude'});

  if((a.valetudo||0)>0 || (o.res&&o.res.soin)) out.push({c:'gain', i:'caduceus', t:'tu y reprendras des forces'});
  if(pec>0)  out.push({c:'gain',  i:'nummus', t:'cela rapporte'});
  if(pec<0)  out.push({c:'perte', i:'nummus', t:'cela coûte'});
  if(o.res&&o.res.choix) out.push({c:'pari', i:'libra', t:'sans retour'});
  if(!out.length) out.push({c:'verrou', i:'signum', t:'sans danger'});
  return out;
}

/* L'emblème dit la NATURE de l'acte, la teinte dit son PRIX.
   Ni l'un ni l'autre ne révèle ce que l'action rapporte. */
const ACTES=[
  /* argent et marchandise */
  [/pay|achet|rachet|vend|bours|deniers|solde|prix|commission|spécul|butin|part|investi|redistribu|lot/i,'nummus'],
  /* écrit, calcul, savoir */
  [/écri|lettre|registre|compt|rédig|consign|list|grec|vérifi|apprend|étudi|instrui|nager|lire|testament|croquis|carte/i,'volumen'],
  /* parole */
  [/dis|dire|parl|répond|expliq|discours|plaid|object|propos|demand|négoci|trait|sond|serment|signal|crier|cri|rameut|interpell|convainc|prêt|écout|répliqu|suppli/i,'signum'],
  /* justice, décision, commandement formel */
  [/juge|arbitr|tranch|partag|règl|sanction|interdi|ordonn|appliqu|exécut|désign|refus|accept|décid|congé|rendre|assum|couvrir dans/i,'libra'],
  /* tenir, protéger, encadrer */
  [/tenir|tiens|rang|serr|gard|couvr|form|carré|cercle|rempart|poste|attend|investir|rester|maintien|reformer|rassembl|relev|protég|épargn|sauv/i,'scutum'],
  /* agir au fer */
  [/charg|sort|aller|cherch|mont|saut|franch|pouss|frapp|attaqu|assaut|porter l|lanc|jeter|forcer|décal|face|flanc|enfonc|poursuiv|corrig|abord|abattre|prendre la tête|first/i,'gladius'],
  /* génie et travail */
  [/creus|bâti|pont|terrass|fortif|galerie|ouvrag|répar|équip|barqu|dériv|mine|sappe|travail|doubl|exercice|palissad|camp/i,'templum'],
  /* soin et repos */
  [/soign|repos|panse|blessé|médec|dormir|fournir|eau|malade|hiver/i,'caduceus'],
  /* mouvement et reconnaissance */
  [/march|colonn|convoi|escort|reconna|éclaireur|itinérair|embarqu|passer|travers|rentr|suivre|partir|fuir|décroch/i,'vexillum'],
  /* faveur et présence */
  [/voir des officiers|faire voir|dîner|présent|se fondre|ne rien|se taire|fermer les yeux|laisser|mêler/i,'laurea']
];
function emblemeActe(t){
  for(const [re,ic] of ACTES) if(re.test(t)) return ic;
  return 'laurea';
}
function styleChoix(o){
  const a=(o.res&&o.res.e)||{}, b=(o.ok&&o.ok.e)||{}, c=(o.ko&&o.ko.e)||{};
  const val=Math.min(a.valetudo||0, b.valetudo||0, c.valetudo||0);
  const blessure=a.vulnus||b.vulnus||c.vulnus;
  let cls='vert';
  if(blessure||val<=-12) cls='rouge';
  else if(val<=-3||o.check) cls='bleu';
  return { cls, ic: (o.res&&o.res.choix) ? 'libra' : emblemeActe(o.t) };
}

/* ---------- résolution ---------- */
function choisir(i){
  const ev=evenement(), o=ev.o[i], et=etatOption(o);
  if(et.cache||et.verrou) return;
  let res=o.res, ok=true, parie=false;
  if(o.check){ parie=true; ok=(S.s[o.check.s]+rnd(26))>=o.check.dc; res=ok?o.ok:o.ko; }
  appliquer(ev, o.t, res, parie, ok);
}
/* applique un résultat à la carrière — commun aux choix et aux batailles jouées en temps réel */
function appliquer(ev, libelle, res, parie, ok){
  const e=res.e||{}, notes=[], avant={...S.s};
  STATS.forEach(st=>{ if(!e[st.k]) return;
    let d=e[st.k]; if(d>0&&st.k!=='valetudo') d=attenuer(S.s[st.k],d);
    S.s[st.k]=clamp(S.s[st.k]+d); });
  if(e.peculium) S.peculium=Math.max(0,S.peculium+e.peculium);
  if(e.vulnus){ const v=blesser(); if(v) notes.push({c:'perte', i:'gladius', t:v.n}); }
  if(res.soin&&S.vulnera.length){ const v=S.vulnera.shift();
    for(const k in v.e) S.s[k]=clamp(S.s[k]-v.e[k]); notes.push({c:'gain', i:'caduceus', t:'Cicatrisé : '+v.n}); }
  if(e.dona&&!S.dona.includes(e.dona)){ S.dona.push(e.dona); notes.push({c:'gain', i:'laurea', t:e.dona}); }
  if(res.lien) for(const k in res.lien) S.liens[k]=(S.liens[k]||0)+res.lien[k];

  const eff=[];
  STATS.forEach(st=>{ const d=S.s[st.k]-avant[st.k];
    if(d) eff.push({c:d>0?'gain':'perte', i:st.i, t:`${d>0?'+':''}${d} ${st.n}`}); });
  if(e.peculium) eff.push({c:e.peculium>0?'gain':'perte', i:'nummus', t:`${e.peculium>0?'+':''}${e.peculium} deniers`});
  eff.push(...notes);

  S.log.push({ y:annee(), t:`${ev.t} — ${libelle}` });
  if(!S.vus.includes(ev.t)) S.vus.push(ev.t);
  if(ev.nota && !S.notas.some(n=>n.t===ev.t)) S.notas.push({ t:ev.t, x:ev.nota, y:annee() });

  V.res={ x:res.r, eff, parie, ok, nota:ev.nota, mort:S.s.valetudo<=0, choix:res.choix||null };
  V.nota=false; sauver(); rendre();
}
function blesser(){
  const libres=VULNERA.filter(v=>!S.vulnera.some(x=>x.n===v.n));
  if(!libres.length){ S.s.valetudo=clamp(S.s.valetudo-10); return null; }
  const v=pick(libres); S.vulnera.push(v);
  for(const k in v.e) S.s[k]=clamp(S.s[k]+v.e[k]);
  return v;
}

/* ---------- suite ---------- */
function suite(){
  const r=V.res;
  if(r.mort){ finir('mort'); return; }
  if(r.choix){
    if(r.choix==='missio'||r.choix==='missio_riche'){ finir(r.choix); return; }
    if(r.choix==='afrique'){ finir('victis'); return; }
    if(r.choix==='pompee'){ S.pompee=true; S.seq=construireSeq(POMPEE); S.t=0; V.res=null; sauver(); rendre(); return; }
    if(r.choix==='venia'){
      S.pompee=false; S.rank=Math.max(1,S.rank-1);
      S.ch=PHASES.length-1; S.seq=construireSeq(PHASES[S.ch]); S.t=0;
      S.log.push({ y:-48, t:'Rendu et pardonné — grade réduit' });
      V.res=null; sauver(); rendre(); return; }
  }
  V.res=null;
  if(S.t+1<S.seq.length){
    S.t++;
    S.peculium=Math.max(0, S.peculium + Math.round(RANKS[S.rank].pay/3) - (S.rank<4?55:25));
    sauver(); rendre(); return;
  }
  let r2=S.rank;
  while(r2<RANKS.length-1){ const g=PROMO.find(p=>p.to===r2+1); if(g&&g.req(S.s)) r2++; else break; }

  /* Dernier chapitre : la carrière s'arrête ici. Un grade dont les conditions
     sont réunies après la dernière décision ne s'exerce jamais — on le
     mentionne à la démobilisation, on ne l'attribue pas. */
  if(S.pompee || S.ch+1>=PHASES.length){
    S.finPromo = r2>S.rank ? r2 : null;
    finir(S.pompee?'victis':'carriere'); return;
  }

  const promu=r2>S.rank, de=S.rank;
  if(promu) S.log.push({ y:annee(), t:`Promotion : ${RANKS[r2].n}` });
  S.rank=r2;
  V.promo={ promu, de, a:r2, suivant:PHASES[S.ch+1] };
  sauver(); rendre();
}
function chapitreSuivant(){
  S.ch++; S.seq=construireSeq(PHASES[S.ch]); S.t=0;
  S.s.valetudo=clamp(S.s.valetudo + 8 + Math.round((S.s.disciplina||0)/14));
  V.promo=null; V.onglet='castra'; sauver(); rendre();
}
function finir(type){ S.fin={ type, an:annee() }; sauver(); rendre(); }
function onglet(o){ V.onglet=o; rendre(); window.scrollTo(0,0); }

function sauver(){ try{ localStorage.setItem(CLE,JSON.stringify(S)); }catch(e){} }
function charger(){ try{ const r=localStorage.getItem(CLE); return r?JSON.parse(r):null; }catch(e){ return null; } }
function effacer(){ try{ localStorage.removeItem(CLE); }catch(e){} }
function recommencer(){ effacer(); S=null; V={nota:false,res:null,promo:null,onglet:'castra'}; rendre(); }

/* ============================================================
   RENDU
   ============================================================ */
function rendre(){
  if(!S) return coque(ecranIntro(), false);
  if(S.fin) return coque(ecranFin(), false);
  if(V.promo) return coque(ecranPromo(), false);
  const ec = { castra:ecranCastra, campagne:ecranCampagne, acta:ecranActa,
               nota:ecranNota, cursus:ecranCursus }[V.onglet] || ecranCastra;
  coque(ec(), true);
}

function coque(html, nav){
  const ph = S && !S.fin ? chapitre() : null;
  $('app').innerHTML=`
  <div class="app">
    <div class="banniere">
      <div class="aigle">${icone('aquila')}</div>
      <div class="titre">LEGIO X EQVESTRIS</div>
      <div class="sous-titre">Gaule &amp; guerre civile · 58–45</div>
      ${ph?`<div class="banniere-legende">${esc(ph.n)} · ${esc(ph.sub)}</div>`:
           `<div class="banniere-legende">De la recrue au primipile</div>`}
    </div>
    ${html}
    ${nav?barreNav():''}
  </div>`;
}

const ONGLETS=[
  {id:'castra',   n:'Castra',   i:'templum'},
  {id:'campagne', n:'Campagne', i:'volumen'},
  {id:'acta',     n:'Acta',     i:'libra'},
  {id:'nota',     n:'Nota',     i:'signum'},
  {id:'cursus',   n:'Cursus',   i:'capita'}
];
function barreNav(){
  return `<div class="nav">${ONGLETS.map(o=>`
    <button class="nav-b ${V.onglet===o.id?'on':''}" onclick="onglet('${o.id}')">
      ${icone(o.i)}<span>${o.n}</span>
    </button>`).join('')}</div>`;
}

/* ---------- bandeaux communs ---------- */
function barrePerso(){
  const R=RANKS[S.rank], pct=Math.round(faitEv()/totalEv()*100);
  return `<div class="cadre"><div class="perso">
    <div class="portrait">${icone('capita')}<div class="grade-ecu">${romain(S.rank)}</div></div>
    <div class="perso-c">
      <div class="perso-n">${esc(S.nom||S.orig)}</div>
      <div class="perso-g">${icone('laurea')}${esc(R.n)}</div>
      <div class="xp">
        <div class="xp-b"><i style="width:${pct}%"></i></div>
        <div class="xp-n">${faitEv()} / ${totalEv()}</div>
      </div>
    </div>
    <div class="vexille">
      <div class="vexille-t">LEG·X</div>${icone('aquila')}
      <div class="vexille-n">EQVEST</div>
    </div>
  </div></div>`;
}
function bandeauAttrs(){
  return `<div class="attrs">${STATS.map(st=>{
    const v=S.s[st.k], bas=(st.k==='valetudo'&&v<35), haut=v>=75;
    return `<div class="at ${bas?'bas':''} ${haut?'haut':''}">
      ${icone(st.i)}
      <div class="at-n">${st.n}</div>
      <div class="at-v">${v}</div>
    </div>`;
  }).join('')}</div>
  <div class="cadre"><div class="perso" style="padding:9px 14px;gap:10px;">
    <div style="display:flex;align-items:center;gap:7px;flex:1;">
      ${icone('nummus')}<span style="font-family:var(--data);font-size:13px;color:var(--or-vif);">${S.peculium.toLocaleString('fr-FR')}</span>
      <span style="font-family:var(--caps);font-size:9px;letter-spacing:.16em;color:var(--gris-2);">DENIERS</span>
    </div>
    <div style="display:flex;align-items:center;gap:7px;">
      ${icone('scutum')}<span style="font-family:var(--caps);font-size:10px;letter-spacing:.13em;color:var(--or);">${PORTEE_N[portee()].n}</span>
    </div>
  </div></div>`;
}

/* ---------- CASTRA : l'événement ---------- */
function ecranCastra(){
  const ev=evenement(), r=V.res, ph=chapitre();
  return `
  ${barrePerso()}
  ${bandeauAttrs()}
  <div class="cadre ${ev.guerre?'guerre':''}">
    <div class="cadre-t">${ev.guerre?'Acies':'Castra'} · ${romain(S.t+1)} / ${romain(S.seq.length)}</div>
    <div class="cadre-b">
      <div class="grav">
        ${scene(ev.guerre?'acies':'castra')}
        <div class="grav-l">${esc(ev.lieu||ph.sub)}</div>
      </div>
      <div class="ev-t">${ev.t}</div>
      <div class="ev-l">${Math.abs(annee())} av. J.-C.</div>
      <div class="ev-x">${ev.x}</div>
      ${ev.vue&&ev.vue[portee()]?`<div class="vue">
        <b>${icone('scutum')}Ce que tu vois — ${PORTEE_N[portee()].n}</b>
        <span>${esc(ev.vue[portee()])}</span></div>`:''}
      ${r?blocResultat(r):(ACIES[ev.t]?blocAcies(ev):'')+blocChoix(ev)}
    </div>
  </div>`;
}
/* batailles jouables en temps réel (bataille.html) */
const ACIES={ 'Bibracte':'bibracte', 'Pharsale — la quatrième ligne':'pharsale', 'Munda':'munda' };
function blocAcies(ev){
  return `<button class="acies-b" onclick="sauver();location.href='bataille.html?b=${ACIES[ev.t]}&camp=1'">
    <div class="medaille">${icone('gladius')}</div>
    <div class="ch-c"><div class="ch-t">Combattre en temps réel</div>
      <div class="ch-note">Entre dans la bataille en 3D, à ta place de ${esc(RANKS[S.rank].n)} : ${esc(PORTEE_N[portee()].vue)}.</div>
      <div class="puces"><span class="puce perte">${icone('gladius')}on peut y mourir</span></div></div>
    <div class="ch-fl">›</div></button>
    <div class="acies-ou">ou décider en un geste</div>`;
}
function retourAcies(){
  let r=null; try{ r=JSON.parse(localStorage.getItem('legio_acies_res')); localStorage.removeItem('legio_acies_res'); }catch(e){}
  if(!r||!S||S.fin||V.res) return;
  const ev=evenement(); if(!ev||ev.t!==r.ev) return;
  appliquer(ev, `Combattu en ligne — ${r.issue}`, { r:r.recit, e:r.e }, false, true);
}
function blocChoix(ev){
  return `<div class="choix">${ev.o.map((o,i)=>{
    const et=etatOption(o); if(et.cache) return '';
    const st=styleChoix(o), ap=apercu(o);
    return `<button class="ch ${et.verrou?'':st.cls}" ${et.verrou?'disabled':''} onclick="choisir(${i})">
      <div class="medaille">${icone(et.verrou?'sera':st.ic)}</div>
      <div class="ch-c">
        <div class="ch-t">${esc(o.t)}</div>
        ${o.note?`<div class="ch-note">${esc(o.note)}</div>`:''}
        <div class="puces">${et.verrou
          ? `<span class="puce verrou">${icone('sera')}${esc(et.verrou)}</span>`
          : ap.map(a=>`<span class="puce ${a.c}">${icone(a.i)}${esc(a.t)}</span>`).join('')}</div>
      </div>
      <div class="ch-fl">›</div>
    </button>`;
  }).join('')}</div>`;
}
function blocResultat(r){
  return `<div class="res">
    ${r.parie?`<div class="verdict ${r.ok?'ok':'ko'}">${icone(r.ok?'check':'gladius')}${r.ok?'Réussi':'Manqué'}</div>`:''}
    <div class="res-x">${r.x}</div>
    ${r.eff.length?`<div class="res-e">${r.eff.map(e=>`<span class="puce ${e.c}">${icone(e.i)}${esc(e.t)}</span>`).join('')}</div>`:''}
    ${r.nota?`<div class="nota">
      <button class="nota-b" onclick="V.nota=!V.nota;rendre()">${icone('nota_i')}${V.nota?'Masquer la nota':'Nota historica'}</button>
      ${V.nota?`<div class="nota-x">${r.nota}</div>`:''}
    </div>`:''}
    <div class="cta-w">${icone('laurea')}
      <button class="cta" onclick="suite()">${r.mort?'Voir la pierre':'Poursuivre'}</button>
      ${icone('laurea')}</div>
  </div>`;
}

/* ---------- CAMPAGNE ---------- */
function ecranCampagne(){
  return `${barrePerso()}
  <div class="cadre"><div class="cadre-t">Carte de campagne</div><div class="cadre-b">
    ${PHASES.map((p,i)=>{
      const etat = i<S.ch?'fait' : i===S.ch?'ici' : 'suiv';
      const ic = i<S.ch?'check' : i===S.ch?'vexillum' : 'sera';
      return `<div class="rail-l ${etat}">
        <div class="rail-p">${icone(ic)}</div>
        <div class="rail-c">
          <div class="rail-t">${esc(p.n)}</div>
          <div class="rail-d">${i===S.ch?`En cours · ${romain(S.t+1)}/${romain(p.len)}`:esc(p.sub)}</div>
          ${i===S.ch?`<div style="margin-top:6px;"><div class="exig-b"><i style="width:${Math.round((S.t+1)/p.len*100)}%"></i></div></div>`:''}
        </div>
        <div class="ligne-v">${Math.abs(p.y0)}${p.y1!==p.y0?'–'+Math.abs(p.y1):''}</div>
      </div>`;
    }).join('')}
  </div></div>`;
}

/* ---------- ACTA ---------- */
function ecranActa(){
  return `${barrePerso()}
  <div class="cadre"><div class="cadre-t">Acta diurna · ${S.log.length} entrées</div><div class="cadre-b">
    <div class="log">${[...S.log].reverse().map(l=>
      `<div><span class="y">${Math.abs(l.y)} av. J.-C.</span> — ${esc(l.t)}</div>`).join('')}</div>
  </div></div>`;
}

/* ---------- NOTA ---------- */
function ecranNota(){
  return `${barrePerso()}
  <div class="cadre"><div class="cadre-t">Nota historica · ${S.notas.length}</div><div class="cadre-b">
    ${S.notas.length? [...S.notas].reverse().map(n=>`
      <div style="padding:11px 0;border-bottom:1px solid rgba(122,96,49,.2);">
        <div class="ligne-t" style="display:flex;align-items:center;gap:8px;">${icone('signum')}${esc(n.t)}</div>
        <div class="nota-x" style="margin-top:7px;">${n.x}</div>
      </div>`).join('')
      : `<div class="vide">Les notes s’accumulent au fil des décisions.</div>`}
  </div></div>`;
}

/* ---------- CURSUS ---------- */
function ecranCursus(){
  const suiv=S.rank+1<RANKS.length?PROMO.find(p=>p.to===S.rank+1):null;
  let jeu=null, manque=[];
  if(suiv){
    jeu = suiv.seuils.map(j=>({j, n:Object.keys(j).filter(k=>(S.s[k]||0)<j[k]).length}))
           .sort((a,b)=>a.n-b.n)[0].j;
    manque=Object.entries(jeu);
  }
  return `${barrePerso()}
  <div class="cadre"><div class="cadre-t">Cursus honorum</div><div class="cadre-b">
    ${RANKS.map((R,i)=>{
      const etat=i<S.rank?'fait':i===S.rank?'ici':i===S.rank+1?'suiv':'';
      if(i>S.rank+2) return '';
      return `<div class="rail-l ${etat}">
        <div class="rail-p">${icone(i<S.rank?'check':i===S.rank?'laurea':i===S.rank+1?'chevron':'sera')}</div>
        <div class="rail-c">
          <div class="rail-t">${esc(R.n)}</div>
          <div class="rail-d">${i===S.rank?'Grade actuel':(i===S.rank+1?'Grade suivant':esc(R.fr))}</div>
        </div>
        <div class="ligne-v">${R.pay?R.pay.toLocaleString('fr-FR')+' d.':''}</div>
      </div>`;
    }).join('')}
  </div></div>

  ${suiv?`<div class="cadre"><div class="cadre-t">Pour devenir ${esc(RANKS[S.rank+1].n)}</div><div class="cadre-b">
    <p class="ev-x" style="font-size:16px;margin-bottom:12px;font-style:italic;color:var(--gris);">${esc(suiv.why)}</p>
    ${manque.map(([k,seuil])=>{
      const st=STATS.find(x=>x.k===k), v=S.s[k]||0, ok=v>=seuil;
      return `<div class="exig">
        <div class="exig-t">${icone(st.i)}<span class="exig-n">Atteindre ${st.n} ${seuil}</span>
          <span class="exig-v ${ok?'ok':''}"><b>${v}</b> / ${seuil}</span></div>
        <div class="exig-b ${ok?'ok':''}"><i style="width:${Math.min(100,Math.round(v/seuil*100))}%"></i></div>
      </div>`;
    }).join('')}
    ${suiv.seuils.length>1?`<p class="hint" style="margin-top:12px;text-align:left;">Une autre voie existe : ${suiv.seuils.filter(j=>j!==jeu).map(j=>Object.entries(j).map(([k,v])=>STATS.find(x=>x.k===k).n+' '+v).join(' + ')).join(' · ')}</p>`:''}
  </div></div>`:''}

  <div class="cadre"><div class="cadre-t">Attributs</div><div class="cadre-b">
    ${STATS.map(st=>`<div class="exig">
      <div class="exig-t">${icone(st.i)}<span class="exig-n">${st.n}<span style="color:var(--gris-2);font-style:italic;font-size:13.5px;"> — ${st.d}</span></span>
        <span class="exig-v"><b>${S.s[st.k]}</b></span></div>
      <div class="exig-b"><i style="width:${clamp(S.s[st.k])}%"></i></div>
    </div>`).join('')}
  </div></div>

  ${(S.dona.length||S.vulnera.length)?`<div class="cadre"><div class="cadre-t">Corps et honneurs</div><div class="cadre-b">
    ${S.dona.map(d=>`<div class="ligne">${icone('laurea')}<div class="ligne-c"><div class="ligne-t">${esc(d)}</div>
      <div class="ligne-d">Dona militaria</div></div></div>`).join('')}
    ${S.vulnera.map(v=>`<div class="ligne">${icone('gladius')}<div class="ligne-c"><div class="ligne-t" style="color:var(--rouge);">${esc(v.n)}</div>
      <div class="ligne-d">${esc(v.d)}</div></div></div>`).join('')}
  </div></div>`:''}`;
}

/* ---------- PROMOTION ---------- */
function ecranPromo(){
  const p=V.promo, g=PROMO.find(x=>x.to===p.a);
  return `
  ${barrePerso()}
  <div class="cadre"><div class="promo">
    ${p.promu?`
      ${icone('chevron','gros')}
      <div class="promo-de">${esc(RANKS[p.de].n)} devient</div>
      <div class="promo-a">${lapid(RANKS[p.a].n)}</div>
      <div class="promo-w">${esc(g?g.why:'')}</div>
      <div class="promo-w" style="margin-top:14px;color:var(--or);font-style:normal;font-size:15px;">
        Ta vue passe à <b>${PORTEE_N[RANKS[p.a].p].n}</b> — tu vois désormais ${esc(PORTEE_N[RANKS[p.a].p].vue)}.
      </div>`
    :`
      ${icone('laurea','gros')}
      <div class="promo-de">Tu restes</div>
      <div class="promo-a" style="background:linear-gradient(180deg,#9C8C6E,#6E6249);-webkit-background-clip:text;background-clip:text;">${lapid(RANKS[S.rank].n)}</div>
      <div class="promo-w">Le camp n’a pas encore vu ce qu’il attend. Consulte le <b style="color:var(--or);">Cursus</b> pour savoir ce qui manque.</div>`}
  </div></div>
  <div class="cadre"><div class="cadre-t">Quartiers d’hiver</div><div class="cadre-b">
    <p class="ev-x" style="font-size:16px;font-style:italic;color:var(--gris);">On recoud ce qui avait été recousu vite. Le chapitre suivant s’ouvre : <b style="color:var(--or-vif);font-style:normal;">${esc(p.suivant.n)}</b> — ${esc(p.suivant.sub)}.</p>
    <div class="cta-w" style="margin-left:0;margin-right:0;">${icone('laurea')}
      <button class="cta" onclick="chapitreSuivant()">Reprendre la marche</button>${icone('laurea')}</div>
  </div></div>`;
}

/* ---------- ACCUEIL ---------- */
function ecranIntro(){
  const sv=charger();
  return `
  <div class="cadre"><div class="cadre-b" style="padding-top:15px;">
    <p class="ev-x">Tu t’engages pour seize ans dans la dixième légion, sous un proconsul de quarante-deux ans qui vient d’obtenir la Gaule et qui a des dettes considérables. Il s’appelle Caius Iulius Caesar.</p>
    <p class="ev-x">Une décision par écran, cinquante-quatre en tout — et <strong>ce que tu vois du champ dépend de ton grade</strong>. Un légionnaire voit vingt pas de poussière ; un primipile voit la ligne entière.</p>
    <p class="ev-x" style="color:var(--gris-2);font-style:italic;">Le prix d’une décision t’est annoncé ; jamais ce qu’elle te rapporte. Il faut lire pour le savoir. On peut mourir.</p>
  </div></div>
  <div class="cadre"><div class="cadre-t">Ton origine</div><div class="cadre-b">
    ${ORIGINES.map((o,i)=>`
      <button class="orig-l" onclick="nouvelle(ORIGINES[${i}])">
        <div class="medaille">${icone(['galea','volumen','manus','signum','laurea'][i]||'signum')}</div>
        <div style="flex:1;">
          <div class="orig-n">${esc(o.n)}</div>
          <div class="orig-d">${esc(o.d)}</div>
          <div class="orig-e">${STATS.filter(s=>s.k!=='valetudo').map(s=>s.n.slice(0,4).toUpperCase()+' '+o.s[s.k]).join(' · ')}</div>
        </div>
        <div class="ch-fl">›</div>
      </button>`).join('')}
    ${sv&&!sv.fin?`<div class="cta-w" style="margin-left:0;margin-right:0;">
      <button class="cta sombre" onclick="S=charger();V.onglet='castra';rendre()">Reprendre la partie en cours</button></div>`:''}
    <p class="hint" style="margin-top:14px;">La partie se sauvegarde dans ce navigateur.</p>
  </div></div>
  <div class="cadre guerre"><div class="cadre-t">Acies</div><div class="cadre-b">
    <p class="ev-x" style="margin-top:0;">Une bataille en temps réel, en trois dimensions : des milliers d’hommes sur le terrain. Légionnaire, tu combats au premier rang ; centurion, ta cohorte manœuvre à ta voix ; primipile, tu disposes de la légion.</p>
    <div class="cta-w" style="margin-left:0;margin-right:0;">${icone('gladius')}<button class="cta" onclick="location.href='bataille.html'">Entrer dans une bataille</button>${icone('gladius')}</div>
  </div></div>`;
}

/* ---------- FIN ---------- */
function ecranFin(){
  const t=S.fin.type, R=RANKS[S.rank];
  let titre, texte;
  if(t==='mort'){ titre='D&nbsp;&nbsp;&nbsp;&nbsp;M';
    texte=`Mort en service, l’an ${Math.abs(S.fin.an)} avant l’ère, sous les enseignes de la Dixième.`; }
  else if(t==='missio'){ titre='MISSIO';
    texte=`Tu as quitté l’armée au Rubicon, avec ta solde et sans ta part des guerres civiles. Douze ans plus tard, quand on parlera de César dans ta ville, tu diras que tu as servi en Gaule et l’on ne te croira qu’à moitié.`; }
  else if(t==='missio_riche'){ titre='MISSIO&nbsp;·&nbsp;HONESTA';
    texte=`Congé régulier obtenu en Campanie, avec les terres et la prime. Tu as vu la Sambre, Alésia et Pharsale, et tu es sorti debout avec des biens — ce que quatre-vingt-dix hommes sur cent n’ont pas fait.`; }
  else if(t==='victis'){ titre='VICTIS';
    texte=`Tu es resté du côté du Sénat. Il n’y a plus de Sénat qui commande des armées, plus de Caton, plus de Labienus. On ne t’a pas proscrit : on t’a oublié, ce qui prend plus longtemps.`; }
  else { titre='MISSIO&nbsp;·&nbsp;HONESTA';
    const o=S.rank;
    const h = o>=7?'Le primipilat achevé, tu passes dans l’ordre équestre. Ton fils portera l’anneau d’or sans avoir marché.'
      : o>=5?'Le centurionat te vaut une terre, une clientèle et le droit qu’on te salue dans ta ville.'
      : o>=4?'Le grade de principal double ta prime et te vaut un lot correct.'
      : 'Le lot ordinaire du légionnaire : de la terre, et de la terre qu’il faut défricher.';
    texte=`Mars 45 : Munda est la dernière bataille. Devant la table des questeurs, on lit ton dossier à voix haute.<br><br>${h}<br><br>Dans onze mois, aux ides de mars, l’homme que tu as suivi treize ans sera tué au pied de la statue de Pompée par soixante sénateurs, dont quatorze qu’il avait épargnés à Pharsale. Tu l’apprendras par un colporteur, en labourant.`; }
  const ans=Math.max(1,58-Math.abs(S.fin.an)+1);
  return `
  <div class="stone">
    <div class="st-l dm">${titre}</div>
    <div class="st-l big">${lapid(S.nom||R.n)}</div>
    <div class="st-l">${lapid(R.n)}</div>
    <div class="st-l">LEG&nbsp;·&nbsp;X&nbsp;·&nbsp;EQVESTRIS</div>
    <div class="st-l">STIPENDIORVM&nbsp;·&nbsp;${romain(ans)}</div>
    ${S.dona.length?`<div class="st-l">${S.dona.map(d=>lapid(d)).join('&nbsp;&nbsp;')}</div>`:''}
    <div class="st-l">${t==='mort'?'H&nbsp;·&nbsp;S&nbsp;·&nbsp;E':'V&nbsp;·&nbsp;S&nbsp;·&nbsp;L&nbsp;·&nbsp;M'}</div>
    <div class="st-f">${texte}</div>
  </div>
  ${bandeauAttrs()}
  <div class="cadre"><div class="cadre-t">États de service</div><div class="cadre-b">
    ${S.finPromo?`<div class="ligne">${icone('chevron')}<div class="ligne-c">
      <div class="ligne-t" style="color:var(--or-vif);">${esc(RANKS[S.finPromo].n)}</div>
      <div class="ligne-d">Tu en remplissais les conditions à ta démobilisation. Le grade a été porté sur ton dossier ; tu ne l’auras jamais exercé.</div>
    </div></div>`:''}
    <div class="ligne">${icone('capita')}<div class="ligne-c"><div class="ligne-t">${esc(S.orig)}</div>
      <div class="ligne-d">Origine</div></div></div>
    <div class="ligne">${icone('nummus')}<div class="ligne-c"><div class="ligne-t">${S.peculium.toLocaleString('fr-FR')} deniers</div>
      <div class="ligne-d">Peculium à la démobilisation</div></div></div>
    ${S.vulnera.map(v=>`<div class="ligne">${icone('gladius')}<div class="ligne-c">
      <div class="ligne-t" style="color:var(--rouge);">${esc(v.n)}</div><div class="ligne-d">${esc(v.d)}</div></div></div>`).join('')}
  </div></div>
  <div class="cadre"><div class="cadre-t">Nota recueillies · ${S.notas.length}</div><div class="cadre-b">
    <div class="log">${S.notas.map(n=>`<div><span class="y">${Math.abs(n.y)}</span> — ${esc(n.t)}</div>`).join('')||'—'}</div>
  </div></div>
  <div class="cta-w">${icone('laurea')}<button class="cta" onclick="recommencer()">Une autre carrière</button>${icone('laurea')}</div>`;
}

window.addEventListener('DOMContentLoaded',()=>{
  const s=charger(); if(s&&!s.fin) S=s;
  if(S) retourAcies();
  rendre();
});
