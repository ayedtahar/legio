/* ============================================================
   INTERFACE
   ============================================================ */
const $=(id)=>document.getElementById(id);
const esc=(s)=>String(s).replace(/[<>&]/g,c=>({'<':'&lt;','>':'&gt;','&':'&amp;'}[c]));

/* ---------- règle à encoches ---------- */
function tally(v, seuil){
  const n=20, plein=Math.round(v/100*n);
  let h='<div class="tally">';
  for(let i=0;i<n;i++){
    let c='tick';
    if(i<plein) c+= (v>=80?' hi':'');
    if(i<plein && !(v>=80)) c+=' on';
    if(seuil && v<seuil && i<plein) c='tick warn';
    h+='<div class="'+c+'"></div>';
  }
  return h+'</div>';
}

/* ---------- inscription lapidaire ---------- */
function lapidaire(txt){
  return txt.toUpperCase().replace(/U/g,'V').replace(/ /g,'&nbsp;·&nbsp;');
}

/* ============================================================
   ÉCRAN DE CRÉATION
   ============================================================ */
let setupChoix={ nom:null, origine:'colonus' };
function ecranSetup(){
  const n=setupChoix.nom||(pick(PRAENOMINA)+' '+pick(NOMINA)+' '+pick(COGNOMINA));
  setupChoix.nom=n;
  const sauve=charger();
  $('app').innerHTML=`
  <div class="wrap setup">
    <div class="lapis" style="justify-content:center;text-align:center;flex-direction:column;gap:6px;">
      <div class="lapis-t">CVRSVS&nbsp;MILITIAE<small>LEGIO X EQVESTRIS · DCXCVI A.V.C. · 58 AV. J.-C.</small></div>
    </div>

    <div class="pan"><div class="pan-b">
      <p class="prose">Tu t’engages pour seize ans dans la dixième légion, sous un proconsul de quarante-deux ans qui vient d’obtenir la Gaule et qui a des dettes considérables. Il s’appelle Caius Iulius Caesar.</p>
      <p class="prose">Tu ne joueras pas un héros : tu joueras une carrière. Chaque saison, deux décisions ; chaque bataille, quelques ordres — et ce que tu vois du champ dépend de ton grade. Un légionnaire voit vingt pas de poussière. Un primipile voit la ligne entière.</p>
      <p class="prose" style="color:var(--brass-faint);font-style:italic;">Treize ans, quarante-deux saisons, dix-sept batailles. On peut y mourir.</p>
    </div></div>

    <div class="pan"><div class="pan-h">Ton nom</div><div class="pan-b">
      <div class="field">
        <label>Tria nomina</label>
        <input id="inNom" value="${esc(n)}" maxlength="46" autocomplete="off">
      </div>
      <button class="btn" onclick="tirerNom()">Tirer au sort</button>
    </div></div>

    <div class="pan"><div class="pan-h">Ton origine <em>Elle décide de ce que tu sais déjà et de qui te doit quelque chose</em></div><div class="pan-b">
      <div class="picks">
      ${ORIGINES.map(o=>`
        <button class="pick ${setupChoix.origine===o.id?'sel':''}" onclick="choixOrigine('${o.id}')">
          <div class="pick-n">${esc(o.pick)}</div>
          <div class="pick-d">${esc(o.desc)}</div>
          <div class="pick-e">${Object.entries(o.bonus).map(([k,v])=>{const A=ATTRS.find(a=>a.id===k);return (A?A.nom:k)+' '+(v>0?'+':'')+v;}).join(' · ')} · ${o.peculium} deniers</div>
        </button>`).join('')}
      </div>
    </div></div>

    <div class="btnrow center" style="justify-content:center;margin-top:26px;">
      <button class="btn prim" onclick="demarrer()">S’engager</button>
      ${sauve && !sauve.mort && !sauve.fin ? `<button class="btn" onclick="reprendre()">Reprendre la partie en cours</button>`:''}
    </div>
    <p class="hint center" style="margin-top:18px;">La partie se sauvegarde toute seule dans ce navigateur.</p>
  </div>`;
}
function tirerNom(){ setupChoix.nom=pick(PRAENOMINA)+' '+pick(NOMINA)+' '+pick(COGNOMINA); $('inNom').value=setupChoix.nom; }
function choixOrigine(id){ setupChoix.nom=$('inNom').value; setupChoix.origine=id; ecranSetup(); }
function demarrer(){
  const nom=($('inNom').value||'').trim()||setupChoix.nom;
  S=nouveauPersonnage(nom, setupChoix.origine);
  journal('Engagement dans la Legio X Equestris.','y');
  construireTour();
}
function reprendre(){ S=charger(); if(S){ if(!S.etape) construireTour(); else render(); } }

/* ============================================================
   RENDU PRINCIPAL
   ============================================================ */
function render(){
  if(!S){ ecranSetup(); return; }
  if(S.mort){ ecranMort(); return; }
  if(S.fin){ ecranFin(); return; }
  const sa=SAISONS.find(x=>x.id===S.saison);
  $('app').innerHTML=`
  <div class="wrap">
    <div class="lapis">
      <div class="lapis-t">CVRSVS&nbsp;MILITIAE<small>${lapidaire(S.legion)}</small></div>
      <div class="lapis-d">
        <b>${sa.nom}</b> · ${sa.fr} · ${annEcrite(S.annee)}<br>
        ${auc(S.annee)} · ${esc(S.lieu||'—')}
      </div>
      <div class="lapis-tools">
        <button class="btn" onclick="ecranAide()">Règles</button>
        <button class="btn dgr" onclick="abandonner()">Abandonner</button>
      </div>
    </div>

    <div class="board">
      <div class="col-left">${panFiche()}</div>
      <div class="col-mid">${panCentre()}${panLog()}</div>
      <div class="col-right">${panUnite()}${panCommilitones()}${panPatrons()}</div>
    </div>
  </div>`;
  const sc=document.querySelector('.col-mid .pan');
  if(sc && S.etape && (S.etape.t==='bat'||S.etape.t==='ev')) sc.scrollIntoView({block:'nearest'});
}

/* ---------- colonne gauche : la fiche ---------- */
function panFiche(){
  const parts=S.nom.split(' ');
  return `
  <div class="pan"><div class="pan-b">
    <div class="nomen">${esc(parts.slice(0,-1).join(' '))}<br>${esc(parts.slice(-1)[0])}</div>
    <div class="gradus">${esc(S.grade.nom)}</div>
    <div class="unitas">${esc(S.legion)} · ${esc(UNITES[S.unit.type].nom)}</div>
    <hr class="rule">
    ${ATTRS.map(a=>`
      <div class="attr" title="${esc(a.desc)}">
        <div class="attr-top"><span class="attr-n">${a.nom}</span><span class="attr-v">${S[a.id]}</span></div>
        ${tally(S[a.id])}
      </div>`).join('')}
    <hr class="rule">
    <div class="kv"><span>Fama dans la légion</span><b class="${S.fama>=60?'gold':(S.fama<20?'bad':'')}">${S.fama}</b></div>
    <div class="kv"><span>Santé</span><b class="${S.valetudo<40?'bad':(S.valetudo>85?'good':'')}">${S.valetudo}</b></div>
    <div class="kv"><span>Peculium</span><b>${S.peculium.toLocaleString('fr-FR')} d.</b></div>
    <div class="kv"><span>Stipendium annuel</span><b>${(S.grade.stip||0).toLocaleString('fr-FR')} d.</b></div>
    <div class="kv"><span>Âge · années de service</span><b>${S.aetas} · ${S.stipendia}</b></div>
    <div class="kv"><span>Batailles</span><b>${S.batailles}</b></div>
    <div class="kv"><span>Saisons dans le grade</span><b>${S.toursDansGrade||0}${prochainDelai()}</b></div>
    ${S.vulnera.length?`<hr class="rule"><div class="attr-n" style="margin-bottom:6px;">Vulnera</div><div class="vulnera">${S.vulnera.map(v=>'<div>— '+esc(v.n)+'</div>').join('')}</div>`:''}
    ${S.decorations.length?`<hr class="rule"><div class="attr-n" style="margin-bottom:6px;">Dona militaria</div><div class="vulnera" style="color:var(--bronze);">${S.decorations.map(d=>'<div>— '+esc(d)+'</div>').join('')}</div>`:''}
  </div></div>`;
}

function prochainDelai(){
  const suite=CURSUS[S.gradeId]||[]; if(!suite.length) return '';
  const mini=Math.min(...suite.map(g=>TEMPS_MIN[g]||3));
  return (S.toursDansGrade||0) < mini ? ' / '+mini : '';
}

/* ---------- colonne droite ---------- */
function panUnite(){
  const u=S.unit, def=UNITES[u.type];
  const eff=Math.round(u.effectif/u.nominal*100);
  return `
  <div class="pan"><div class="pan-h">Sous tes ordres <em>${esc(def.fr)}</em></div><div class="pan-b">
    <div class="kv"><span>Effectif</span><b class="${eff<70?'bad':(eff>=95?'good':'')}">${u.effectif} / ${u.nominal}</b></div>
    <hr class="rule" style="margin:12px 0;">
    ${[['cohaesio','Cohésion',false],['experientia','Expérience',false],['fides','Fidélité envers toi',false],['fatigatio','Fatigue',true]]
      .map(([k,l,inv])=>`
      <div class="attr">
        <div class="attr-top"><span class="attr-n">${l}</span><span class="attr-v">${u[k]}</span></div>
        ${tally(inv?100-u[k]:u[k])}
      </div>`).join('')}
    <div class="hint" style="margin-top:10px;">${SCOPE_LABEL[S.grade.scope].nom} — en bataille tu vois ${SCOPE_LABEL[S.grade.scope].vue}.</div>
  </div></div>`;
}
function panCommilitones(){
  const v=S.commilitones.filter(c=>c.vivant).length;
  return `
  <div class="pan"><div class="pan-h">Commilitones <em>${v} / ${S.commilitones.length} vivants</em></div><div class="pan-b">
    ${S.commilitones.map(c=>`
      <div class="row ${c.vivant?'':'dead'}">
        <div><div class="row-n">${esc(c.nom)}</div>
        <span class="row-s">${c.vivant?esc(c.trait):'tombé en '+Math.abs(c.mort.an)+' av. J.-C.'}</span></div>
      </div>`).join('')}
  </div></div>`;
}
function panPatrons(){
  const ids=Object.keys(S.patrons).sort((a,b)=>S.patrons[b]-S.patrons[a]);
  return `
  <div class="pan"><div class="pan-h">Patroni <em>La faveur ouvre les grades</em></div><div class="pan-b">
    ${ids.map(id=>{
      const p=P[id], f=S.patrons[id];
      return `<div class="row" title="${esc(p.trait)}">
        <div><div class="row-n">${esc(p.nom)}</div><span class="row-s">${esc(p.titre)}</span></div>
        <div class="row-v">${f>0?'+':''}${f}<span class="favbar ${f<0?'neg':''}"><i style="width:${Math.abs(f)}%"></i></span></div>
      </div>`;
    }).join('')}
    ${S.vacances>0?`<hr class="rule" style="margin:12px 0;"><div class="kv"><span>Places vacantes</span><b class="gold">${S.vacances}</b></div>`:''}
    ${exigenceProchainGrade()}
  </div></div>`;
}
function exigenceProchainGrade(){
  const suite=CURSUS[S.gradeId]||[]; if(!suite.length) return '';
  const lignes=suite.map(gid=>{
    const r=SEUILS[gid]; if(!r) return '';
    const manque=[];
    if((S.toursDansGrade||0) < (TEMPS_MIN[gid]||3)) manque.push('ancienneté');
    if(S.fama < r.fama - S.candidature*3) manque.push('fama '+S.fama+'/'+r.fama);
    const ok=r.attrs.some(j=>Object.keys(j).every(k=>(S[k]||0)>=j[k]));
    if(!ok){
      const best=r.attrs.map(j=>Object.entries(j).filter(([k,v])=>(S[k]||0)<v))
        .sort((a,b)=>a.length-b.length)[0];
      best.forEach(([k,v])=>{const A=ATTRS.find(a=>a.id===k); manque.push((A?A.nom:k)+' '+S[k]+'/'+v);});
    }
    const fav = r.favorDe ? (S.patrons[r.favorDe]!==undefined?S.patrons[r.favorDe]:-100) : meilleurPatron().fav;
    if(fav < r.favor - S.candidature*4) manque.push((r.favorDe?'faveur de César ':'faveur ')+fav+'/'+r.favor);
    if(r.eques && !S.eques) manque.push('ordre équestre');
    if(S.vacances<=0) manque.push('aucune place vacante');
    return `<div class="kv" style="align-items:flex-start;"><span style="max-width:60%;">${esc(G[gid].nom)}</span>
      <b style="text-align:right;font-size:10.5px;line-height:1.5;${manque.length?'color:var(--brass-faint)':'color:var(--aerugo)'}">${manque.length?esc(manque.join(' · ')):'conditions réunies'}</b></div>`;
  }).join('');
  return `<hr class="rule" style="margin:12px 0;"><div class="attr-n" style="margin-bottom:6px;">Pour monter</div>${lignes}`;
}

function panLog(){
  return `<div class="pan"><div class="pan-h">Acta <em>Journal de campagne</em></div><div class="pan-b">
    <div class="log">${S.log.slice(0,40).map(l=>`<div class="${l.c}"><span class="y">${esc(l.d)}</span> — ${l.t}</div>`).join('')||'<div>—</div>'}</div>
  </div></div>`;
}

/* ============================================================
   COLONNE CENTRALE — dépend de l'étape
   ============================================================ */
function panCentre(){
  const e=S.etape;
  if(!e) return '';
  switch(e.t){
    case 'recit':   return vueRecit();
    case 'ordres':  return vueOrdres();
    case 'ev':      return vueEvenement();
    case 'bat':     return vueBataille();
    case 'promo':   return vuePromotion();
    case 'bilanAff':return vueBilan();
  }
  return '';
}

function vueRecit(){
  const c=S.chron;
  return `<div class="pan"><div class="pan-h">${esc(c.titre)} <em>${esc(c.lieu)}</em></div><div class="pan-b">
    <div class="prose">${c.recit}</div>
    <div class="btnrow"><button class="btn prim" onclick="suivant();render()">Poursuivre</button></div>
  </div></div>`;
}

function vueOrdres(){
  const dispo=ACTIONS.filter(a=>{
    if(a.minScope && !a.minScope.includes(S.grade.scope)) return false;
    if(a.maxScope && !a.maxScope.includes(S.grade.scope)) return false;
    if(a.saison && !a.saison.includes(S.saison)) return false;
    return true;
  });
  const fini=S.tempus<=0;
  return `<div class="pan"><div class="pan-h">
      Emploi de la saison
      <span class="tempus">${[0,1].map(i=>`<span class="pip ${i<S.tempus?'left':'spent'}"></span>`).join('')}</span>
    </div><div class="pan-b">
    ${S.derniersEffets?blocEffets(S.derniersEffets,'Résultat'):''}
    ${fini?`<p class="prose">La saison est employée. On passe à ce qui vient.</p>
        <div class="btnrow"><button class="btn prim" onclick="finOrdres()">Poursuivre</button></div>`
      :`<p class="prose" style="margin-bottom:16px;">Deux emplois du temps, et pas un de plus. Le reste de la saison est pris par la marche, la garde et le fossé.</p>
      <div class="acts">
      ${dispo.map(a=>{
        const dejafait=S.faites.includes(a.id);
        return `<button class="act" ${dejafait?'disabled':''} onclick="lancerAction('${a.id}')">
          <div class="act-n">${esc(a.nom)}</div>
          <div class="act-d">${esc(a.desc)}</div>
          <div class="act-e">${esc(a.eff)}</div>
        </button>`;
      }).join('')}
      </div>`}
  </div></div>`;
}

function vueEvenement(){
  const ev=S.etape.ev;
  if(!ev){ return '<div class="pan"><div class="pan-b"><button class="btn prim" onclick="suivant();render()">Poursuivre</button></div></div>'; }
  if(S.etape.res){
    return `<div class="pan"><div class="pan-h">${esc(ev.titre)}</div><div class="pan-b">
      <div class="prose">${ev.texte}</div>
      ${blocResultat(S.etape.res)}
      <div class="btnrow"><button class="btn prim" onclick="suivant();render()">Poursuivre</button></div>
    </div></div>`;
  }
  const opts=optsVisibles(ev.opts);
  return `<div class="pan ${ev.decisif?'acies':''}"><div class="pan-h">${esc(ev.titre)}${ev.decisif?' <em>Décision majeure</em>':''}</div><div class="pan-b">
    <div class="prose">${ev.texte}</div>
    ${blocOptions(opts,'evChoix')}
  </div></div>`;
}

function vueBataille(){
  const B=BATAILLES[S.bat.id], ph=B.phases[S.bat.ph];
  const rail=B.phases.map((_,i)=>`<i class="${i<S.bat.ph?'done':(i===S.bat.ph?'now':'')}"></i>`).join('');
  if(S.bat.fini) return vueFinBataille(B);
  const scope=S.grade.scope;
  const opts=optsVisibles(ph.opts);
  return `<div class="pan acies">
    <div class="pan-h">${esc(B.nom)} <em>${esc(B.date)} · ${esc(B.ennemi)}</em></div>
    <div class="pan-b">
      <div class="phase-rail">${rail}</div>
      ${S.bat.ph===0?`<div class="prose" style="margin-bottom:18px;">${B.intro}</div>`:''}
      <div class="disp-h">${romain(S.bat.ph+1)}. ${esc(ph.titre)}</div>
      <div class="disp-sub">${esc(B.lieu)}</div>
      <div style="height:14px;"></div>
      <div class="prose">${ph.texte}</div>
      ${ph.vue&&ph.vue[scope]?`<div class="vue"><b>Ce que tu vois — ${SCOPE_LABEL[scope].nom}</b><br>${esc(ph.vue[scope])}</div>`:''}
      <div class="gauges">
        <div class="g-item">Effectif<b class="${S.unit.effectif/S.unit.nominal<.7?'bad':''}">${S.unit.effectif}</b></div>
        <div class="g-item">Cohésion<b class="${S.unit.cohaesio<40?'bad':(S.unit.cohaesio>75?'good':'')}">${S.unit.cohaesio}</b></div>
        <div class="g-item">Fatigue<b class="${S.unit.fatigatio>70?'bad':''}">${S.unit.fatigatio}</b></div>
        <div class="g-item">Santé<b class="${S.valetudo<40?'bad':''}">${S.valetudo}</b></div>
      </div>
      ${S.bat.res?blocResultat(S.bat.res)+`<div class="btnrow"><button class="btn prim" onclick="phaseSuivante()">${S.bat.ph+1<B.phases.length?'Phase suivante':'Fin de la bataille'}</button></div>`
        :blocOptions(opts,'batChoix')}
    </div></div>`;
}

function vueFinBataille(B){
  const p=S.bat.perf;
  let verdict, cls;
  if(p>=12){ verdict='Ta conduite sera citée dans le rapport du proconsul.'; cls='bene'; }
  else if(p>=5){ verdict='Tu as fait ce qu’on attendait de toi, et un peu plus.'; cls='bene'; }
  else if(p>=0){ verdict='Tu as tenu ta place. C’est déjà ce que beaucoup n’ont pas fait.'; cls=''; }
  else if(p>=-6){ verdict='Ta conduite a été discutée sous les tentes, et pas en bien.'; cls='ill'; }
  else { verdict='On se souviendra de ce que tu as fait ici. C’est le problème.'; cls='ill'; }
  return `<div class="pan acies"><div class="pan-h">${esc(B.nom)} — issue <em>${esc(B.issue)}</em></div><div class="pan-b">
    <div class="outcome ${cls}"><div class="outcome-t">Bilan personnel</div>
      <div class="prose" style="font-size:16.5px;">${verdict}</div>
      ${blocEffets(S.bat.bilanEff||[],'')}
    </div>
    <div class="btnrow"><button class="btn prim" onclick="suivant();render()">Quitter le champ</button></div>
  </div></div>`;
}

function vuePromotion(){
  return `<div class="pan"><div class="pan-h">Une place s’ouvre <em>Le légat a signé</em></div><div class="pan-b">
    <p class="prose">Un poste est vacant, tes états de service le supportent, et un patron a parlé pour toi. On te propose le grade. Dans une légion, on ne le propose pas deux fois.</p>
    <div class="opts">
    ${S.etape.cands.map(gid=>{
      const g=G[gid], u=UNITES[g.unite];
      return `<button class="opt" onclick="accepterPromo('${gid}')">
        <span class="opt-k">✦</span>${esc(g.nom)}
        <div class="opt-note">${esc(g.desc)}</div>
        <div class="opt-meta"><span class="gain">${esc(u.nom)} · ${u.nominal} hommes</span><span>${g.stip.toLocaleString('fr-FR')} deniers / an</span><span>Vue : ${SCOPE_LABEL[g.scope].nom}</span></div>
      </button>`;
    }).join('')}
      <button class="opt" onclick="refuserPromo()">
        <span class="opt-k">—</span>Refuser et rester à ton poste
        <div class="opt-note">On note le refus. La place ira à un autre, et l’occasion ne se représentera pas avant longtemps.</div>
      </button>
    </div>
  </div></div>`;
}

function vueBilan(){
  const sa=SAISONS.find(x=>x.id===S.saison);
  return `<div class="pan"><div class="pan-h">Fin de saison <em>${sa.nom} ${Math.abs(S.annee)} av. J.-C.</em></div><div class="pan-b">
    <p class="prose" style="font-style:italic;color:var(--brass-faint);">${esc(sa.desc)}</p>
    <div class="kv"><span>Solde versée</span><b class="gold">+${Math.round((S.grade.stip||225)/3).toLocaleString('fr-FR')} deniers</b></div>
    ${(S.bilanNotes||[]).map(n=>`<div class="kv"><span>${esc(n)}</span><b></b></div>`).join('')}
    <div class="btnrow"><button class="btn prim" onclick="avancerSaison()">Saison suivante</button></div>
  </div></div>`;
}

/* ---------- blocs réutilisables ---------- */
function blocOptions(opts, handler){
  const lettres=['A','B','C','D','E'];
  return `<div class="opts">${opts.map((o,i)=>{
    const meta=[];
    if(o.risque) meta.push('<span class="risk">Risque '+o.risque+'</span>');
    if(o.test){ const A=ATTRS.find(a=>a.id===o.test.attr); if(A) meta.push('<span>'+A.nom+' '+S[o.test.attr]+'</span>'); }
    if(o.test&&o.test.unit) meta.push('<span>Unité · '+UNIT_LABEL[o.test.unit]+'</span>');
    if(o.decide) meta.push('<span class="lock">Décision irréversible</span>');
    if(o.bloque) meta.push('<span class="lock">'+esc(o.bloque)+'</span>');
    return `<button class="opt" ${o.bloque?'disabled':''} onclick="${handler}(${i})">
      <span class="opt-k">${lettres[i]}</span>${esc(o.txt)}
      ${o.note?'<div class="opt-note">'+esc(o.note)+'</div>':''}
      <div class="opt-meta">${meta.join('')}</div>
    </button>`;
  }).join('')}</div>`;
}
function blocEffets(effs, titre){
  if(!effs||!effs.length) return '';
  return `<div class="effs">${effs.map(e=>`<span class="eff-${e.t}">${e.t==='up'?'▲':(e.t==='dn'?'▼':'·')} ${esc(e.s)}</span>`).join('')}</div>`;
}
function blocResultat(res){
  const cls=res.niv==='echec'?'ill':(res.niv==='crit'?'bene':'');
  const t=res.niv==='crit'?'Réussite éclatante':(res.niv==='succes'?'Réussite':'Échec');
  return `<div class="outcome ${cls}">
    <div class="outcome-t">${t}</div>
    <div class="prose" style="font-size:16.5px;">${res.txt}</div>
    ${blocEffets(res.effs)}
  </div>`;
}

/* ============================================================
   ACTIONS DU JOUEUR
   ============================================================ */
function lancerAction(id){
  const a=ACTIONS.find(x=>x.id===id); if(!a||S.tempus<=0) return;
  if(a.cible==='patron'){ choisirPatron(a); return; }
  const notes=a.apply(S,null)||[];
  S.tempus--; S.faites.push(id);
  S.derniersEffets=notes.filter(Boolean).map(n=>({t:/-|−/.test(n)&&!/\+/.test(n)?'dn':'up', s:n}));
  journal(a.nom,'');
  sauver(); render();
}
function choisirPatron(a){
  const ids=Object.keys(S.patrons);
  $('app').insertAdjacentHTML('beforeend',`
  <div class="wrap" id="modal" style="position:fixed;inset:0;background:rgba(8,7,5,.93);z-index:50;overflow:auto;padding-top:60px;">
    <div class="pan setup"><div class="pan-h">Auprès de qui ?</div><div class="pan-b">
      <p class="prose">Un présent, un service, une soirée bien employée. La faveur d’un homme puissant est la seule échelle qui existe.</p>
      <div class="opts">
      ${ids.map(id=>{const p=P[id];return `<button class="opt" onclick="ambitioVers('${id}')">
        <span class="opt-k">✦</span>${esc(p.nom)}
        <div class="opt-note">${esc(p.titre)} — ${esc(p.trait)}</div>
        <div class="opt-meta"><span>Faveur actuelle ${S.patrons[id]>0?'+':''}${S.patrons[id]}</span></div></button>`;}).join('')}
      </div>
      <div class="btnrow"><button class="btn" onclick="fermerModal()">Renoncer</button></div>
    </div></div>
  </div>`);
}
function fermerModal(){ const m=$('modal'); if(m) m.remove(); }
function ambitioVers(pid){
  fermerModal();
  const a=ACTIONS.find(x=>x.id==='ambitio');
  const notes=a.apply(S,pid)||[];
  S.tempus--; S.faites.push('ambitio');
  S.derniersEffets=notes.filter(Boolean).map(n=>({t:/^-/.test(n)?'dn':'up', s:n}));
  journal('Ambitio — '+P[pid].nom,'');
  sauver(); render();
}
function finOrdres(){ S.derniersEffets=null; suivant(); render(); }

/* ---------- événements ---------- */
function evChoix(i){
  const ev=S.etape.ev, opts=optsVisibles(ev.opts), o=opts[i];
  if(!o||o.bloque) return;
  const r=resoudre(o.test, 50);
  let branche = (r.niv==='crit'&&o.crit)?o.crit:(r.niv==='echec'?o.echec:o.succes);
  if(r.niv==='crit'&&!o.crit) branche=o.succes;
  const effs=appliquer(branche.eff, branche);
  if(o.decide) appliquerDecision(o.decide);
  S.etape.res={ niv:r.niv, txt:branche.txt, effs };
  journal(ev.titre+' — '+(r.niv==='echec'?'échec':'réussite'), r.niv==='echec'?'r':'g');
  if(S.valetudo<=0){ mourir('Mort des suites de tes blessures, à '+S.lieu+'.'); return; }
  sauver(); render();
}

/* ---------- décisions structurantes ---------- */
function appliquerDecision(d){
  if(d==='caesar'){ S.faction='caesar'; journal('Tu as passé le Rubicon derrière lui.','y'); }
  if(d==='pompee'){
    S.faction='pompee'; S.legion='Legio I (Pompeiana)';
    delete S.patrons.caesar;
    journal('Tu as quitté César pour le Sénat.','r');
  }
  if(d==='venia'){
    S.faction='caesar'; S.legion='Legio X Equestris';
    S.patrons.caesar=-10;
    const chaine=Object.keys(CURSUS).find(k=>CURSUS[k].includes(S.gradeId));
    if(chaine){ S.gradeId=chaine; S.grade=G[chaine]; }
    journal('Rendu et pardonné. Grade réduit d’un cran.','r');
  }
  if(d==='afrique'){ S.faction='pompee'; S.legion='Legio (Pompeiana), Africa'; }
  if(d==='missio'){ finPartie('missio'); }
  if(d==='missio_riche'){ finPartie('missio_riche'); }
}

/* ---------- bataille ---------- */
function batChoix(i){
  const B=BATAILLES[S.bat.id], ph=B.phases[S.bat.ph];
  const opts=optsVisibles(ph.opts), o=opts[i];
  if(!o||o.bloque) return;
  const r=resoudre(o.test, B.dc);
  let branche = (r.niv==='crit'&&o.crit)?o.crit:(r.niv==='echec'?o.echec:o.succes);
  if(r.niv==='crit'&&!o.crit) branche=o.succes;
  const effs=appliquer(branche.eff, branche);
  if(branche.perf) S.bat.perf+=branche.perf;
  S.unit.fatigatio=clamp(S.unit.fatigatio+rnd(5,11));
  if(o.decide) appliquerDecision(o.decide);
  /* mort au combat */
  if(branche.mort && chance(branche.mort*100)){
    S.bat.res={ niv:r.niv, txt:branche.txt, effs };
    mourir('Tué à '+B.nom+' — '+B.date); return;
  }
  if(S.valetudo<=0){ S.bat.res={niv:r.niv,txt:branche.txt,effs}; mourir('Mort de tes blessures à '+B.nom+' — '+B.date); return; }
  S.bat.res={ niv:r.niv, txt:branche.txt, effs };
  S.bat.hist.push({ph:ph.titre, niv:r.niv});
  sauver(); render();
}
function phaseSuivante(){
  const B=BATAILLES[S.bat.id];
  S.bat.res=null; S.bat.ph++;
  if(S.bat.ph>=B.phases.length) finirBataille(B);
  render();
}
function finirBataille(B){
  S.bat.fini=true;
  const p=S.bat.perf, eff=[];
  /* tenir son rang est attendu ; c'est l'acte remarquable qui fait la réputation */
  const courbe=(x)=> x<=0 ? x*1.25 : (x<=9 ? x*0.18 : 9*0.18 + (x-9)*1.55);
  const famaG=Math.round(courbe(p));
  const famaN = famaG>0 ? attenuer(S.fama, famaG) : famaG;
  if(famaN){ S.fama=clamp(S.fama+famaN); eff.push({t:famaN>0?'up':'dn', s:'Fama '+(famaN>0?'+':'')+famaN}); }
  const favG=Math.round(courbe(p)*0.85);
  if(favG && 'caesar' in S.patrons){ favor(S,'caesar',favG); eff.push({t:favG>0?'up':'dn', s:'C. Iulius Caesar '+(favG>0?'+':'')+favG}); }
  /* les batailles créent des vacances d'officiers */
  const v=Math.max(0, Math.round((B.dc-50)/7) + rnd(0,1));
  if(v){ S.vacances+=v; eff.push({t:'nt', s:v+' poste'+(v>1?'s':'')+' d’officier vacant'+(v>1?'s':'')}); }
  /* décorations */
  if(p>=14 && !S.decorations.includes('Corona civica')){
    S.decorations.push('Corona civica'); eff.push({t:'up', s:'Corona civica — pour avoir sauvé un citoyen'});
  } else if(p>=10 && S.decorations.length<5){
    const d=pick(['Torques','Phalerae','Armillae','Hasta pura','Corona aurea']).toString();
    if(!S.decorations.includes(d)){ S.decorations.push(d); eff.push({t:'up', s:'Dona militaria : '+d}); }
  }
  /* butin de victoire */
  if(B.issue.indexOf('défaite')<0){ const b=rnd(60,180)+S.grade.ordre*40; S.peculium+=b; eff.push({t:'up', s:'+'+b+' deniers de butin'}); }
  S.bat.bilanEff=eff;
  journal('Bataille de '+B.nom+' — '+(p>=5?'conduite remarquée':(p>=0?'tenu ton rang':'conduite critiquée')), p>=5?'g':(p<0?'r':''));
  sauver();
}

/* ---------- promotions ---------- */
function accepterPromo(gid){ promouvoir(gid); S.etape={t:'bilanAff'}; sauver(); render(); }
function refuserPromo(){ S.vacances=Math.max(0,S.vacances-1); S.fama=clamp(S.fama-4); journal('Promotion refusée.','r'); S.etape={t:'bilanAff'}; sauver(); render(); }

/* ---------- abandon / aide ---------- */
function abandonner(){
  if(confirm('Abandonner cette carrière et effacer la sauvegarde ?')){ effacer(); S=null; ecranSetup(); }
}
function ecranAide(){
  $('app').insertAdjacentHTML('beforeend',`
  <div class="wrap" id="modal" style="position:fixed;inset:0;background:rgba(8,7,5,.95);z-index:50;overflow:auto;padding-top:40px;">
   <div class="setup">
    <div class="pan"><div class="pan-h">Comment se joue une carrière</div><div class="pan-b">
      <p class="prose"><strong>Le temps.</strong> Trois saisons par an, de 58 à 45 av. J.-C. — quarante-deux tours. Chaque saison : deux emplois du temps, un événement, parfois une bataille.</p>
      <p class="prose"><strong>Le grade change le jeu.</strong> Ce n’est pas un titre : c’est ton champ de vision et l’éventail de tes ordres. Un <span class="lat">miles</span> voit vingt pas et décide de son propre corps. Un centurion manœuvre. Un primipile lit toute la ligne et dispose des réserves. Les options en bataille sont filtrées par ton grade — certaines ne t’apparaîtront jamais si tu ne montes pas.</p>
      <p class="prose"><strong>Les cinq attributs.</strong> ${ATTRS.map(a=>'<em>'+a.nom+'</em> — '+a.desc).join('<br>')}</p>
      <p class="prose"><strong>Monter en grade</strong> exige trois choses réunies : une place vacante (elles s’ouvrent surtout après les batailles meurtrières), des attributs et une <em>fama</em> au niveau, et un patron qui parle pour toi. Sans patron, tu resteras <span class="lat">miles</span> seize ans, ce qui était le sort de la majorité.</p>
      <p class="prose"><strong>Les patrons</strong> ont leur propre histoire : Crassus meurt en Parthie en 53, Balventius tombe en 54, Antoine arrive en 52. Et en janvier 49, Labienus passe à Pompée — si toute ta faveur reposait sur lui, tu le sentiras passer.</p>
      <p class="prose"><strong>L’unité.</strong> Cohésion, expérience, fidélité et fatigue décident autant que tes attributs. Une cohorte épuisée échoue à ce qu’une cohorte fraîche réussit. Les pertes sont définitives et tes camarades nommés peuvent mourir.</p>
      <p class="prose"><strong>La mort est réelle</strong>, en bataille comme des suites d’une blessure. Il n’y a pas de sauvegarde antérieure.</p>
      <p class="prose" style="color:var(--brass-faint);font-style:italic;">Les batailles, les dates, les unités, les noms des patrons et l’essentiel des situations sont historiques. Les dialogues attribués à César sont ceux que rapportent ses propres <span class="lat">Commentarii</span>, Suétone, Plutarque et Appien.</p>
      <div class="btnrow"><button class="btn prim" onclick="fermerModal()">Retour</button></div>
    </div></div>
   </div>
  </div>`);
}

/* ============================================================
   FINS — la pierre gravée
   ============================================================ */
function inscrNom(nom){ return nom.toUpperCase().replace(/U/g,'V').split(' ').join('&nbsp;·&nbsp;'); }

function ecranMort(){
  const m=S.mort;
  const grade=S.grade.court;
  const camarades=S.commilitones.filter(c=>c.vivant);
  $('app').innerHTML=`
  <div class="wrap">
    <div class="stone">
      <div class="stone-l dm">D&nbsp;&nbsp;&nbsp;&nbsp;M</div>
      <div class="stone-l big">${inscrNom(S.nom)}</div>
      <div class="stone-l">${grade}&nbsp;·&nbsp;${lapidaire(S.legion.replace('Legio','LEG'))}</div>
      <div class="stone-l">STIPENDIORVM&nbsp;·&nbsp;${romain(Math.max(1,S.stipendia))}</div>
      <div class="stone-l">VIXIT&nbsp;·&nbsp;ANNIS&nbsp;·&nbsp;${romain(S.aetas)}</div>
      ${S.decorations.length?`<div class="stone-l">${S.decorations.map(d=>lapidaire(d)).join('&nbsp;&nbsp;')}</div>`:''}
      <div class="stone-l">H&nbsp;·&nbsp;S&nbsp;·&nbsp;E</div>
      <div class="stone-foot">
        ${esc(m.cause)}<br><br>
        ${camarades.length ? esc(camarades.map(c=>c.nom).join(', '))+(camarades.length>1?' ont':' a')+' cotisé pour la pierre.'
          : 'Aucun de ceux avec qui tu t’es engagé n’a survécu pour cotiser à la pierre. La légion l’a payée sur la caisse.'}
      </div>
    </div>
    ${resumeCarriere()}
    <div class="btnrow center" style="justify-content:center;">
      <button class="btn prim" onclick="effacer();S=null;ecranSetup()">Une autre carrière</button>
    </div>
  </div>`;
}

function ecranFin(){
  const t=S.fin.type;
  let titre, texte, hono;
  const o=S.grade.ordre;
  if(t==='missio'){
    titre='MISSIO';
    texte=`Tu as quitté l’armée au Rubicon, avec ta solde et sans ta part des guerres civiles. Douze ans plus tard, quand on parlera de César dans ta ville, tu diras que tu as servi en Gaule et l’on ne te croira qu’à moitié.`;
  } else if(t==='missio_riche'){
    titre='MISSIO&nbsp;·&nbsp;HONESTA';
    texte=`Congé régulier obtenu à Capoue en 47, avec les terres et la prime. Tu as vu la Sambre, Alésia et Pharsale, et tu es sorti debout avec des biens — ce que quatre-vingt-dix hommes sur cent n’ont pas fait.`;
  } else if(S.faction==='pompee'){
    titre='VICTIS';
    texte=`Tu es resté du côté du Sénat jusqu’au bout. Il n’y a plus de Sénat qui commande des armées, plus de Caton, plus de Labienus. On ne t’a pas proscrit : on t’a oublié, ce qui prend plus longtemps.`;
  } else {
    titre='MISSIO&nbsp;·&nbsp;HONESTA';
    if(o>=9) hono='Le primipilat achevé, tu passes dans l’ordre équestre. Ton fils portera l’anneau d’or sans avoir marché.';
    else if(o>=6) hono='Le centurionat te vaut une terre, une clientèle et le droit de te faire appeler par ton cognomen dans ta ville.';
    else if(o>=4) hono='Le grade de principal double ta prime de démobilisation et te vaut un lot correct.';
    else hono='Le lot ordinaire du légionnaire : de la terre, et de la terre qu’il faut défricher.';
    texte=`Mars 45 : Munda est la dernière bataille. Il n’y a plus d’armée à combattre, plus de province à prendre. Devant la table des questeurs, on lit ton dossier à voix haute : les années, les campagnes, les blessures, les décorations.<br><br>${hono}<br><br>Dans onze mois, aux ides de mars, l’homme que tu as suivi pendant treize ans sera tué au pied de la statue de Pompée par soixante sénateurs, dont quatorze qu’il avait épargnés à Pharsale. Tu l’apprendras par un colporteur, en labourant.`;
  }
  $('app').innerHTML=`
  <div class="wrap">
    <div class="stone">
      <div class="stone-l dm">${titre}</div>
      <div class="stone-l big">${inscrNom(S.nom)}</div>
      <div class="stone-l">${lapidaire(S.grade.nom)}</div>
      <div class="stone-l">${lapidaire(S.legion.replace('Legio','LEG'))}</div>
      <div class="stone-l">STIPENDIORVM&nbsp;·&nbsp;${romain(Math.max(1,S.stipendia))}&nbsp;&nbsp;ANNORVM&nbsp;·&nbsp;${romain(S.aetas)}</div>
      ${S.decorations.length?`<div class="stone-l">${S.decorations.map(d=>lapidaire(d)).join('&nbsp;&nbsp;')}</div>`:''}
      <div class="stone-foot">${texte}</div>
    </div>
    ${resumeCarriere()}
    <div class="btnrow center" style="justify-content:center;">
      <button class="btn prim" onclick="effacer();S=null;ecranSetup()">Une autre carrière</button>
    </div>
  </div>`;
}

function resumeCarriere(){
  const morts=S.commilitones.filter(c=>!c.vivant);
  const vifs=S.commilitones.filter(c=>c.vivant);
  const patrons=Object.keys(S.patrons).sort((a,b)=>S.patrons[b]-S.patrons[a]).slice(0,3);
  return `
  <div class="board" style="margin-top:34px;">
    <div class="pan" style="margin-top:0;"><div class="pan-h">États de service</div><div class="pan-b">
      <div class="kv"><span>Grade atteint</span><b class="gold">${esc(S.grade.nom)}</b></div>
      <div class="kv"><span>Années de service</span><b>${S.stipendia}</b></div>
      <div class="kv"><span>Batailles livrées</span><b>${S.batailles}</b></div>
      <div class="kv"><span>Fama finale</span><b>${S.fama}</b></div>
      <div class="kv"><span>Peculium</span><b>${S.peculium.toLocaleString('fr-FR')} deniers</b></div>
      <div class="kv"><span>Blessures</span><b class="${S.vulnera.length>3?'bad':''}">${S.vulnera.length}</b></div>
      <hr class="rule">
      ${ATTRS.map(a=>`<div class="kv"><span>${a.nom}</span><b>${S[a.id]}</b></div>`).join('')}
    </div></div>
    <div class="pan" style="margin-top:0;"><div class="pan-h">Les hommes</div><div class="pan-b">
      ${vifs.length?`<div class="attr-n" style="margin-bottom:8px;">Vivants</div>${vifs.map(c=>`<div class="row"><div class="row-n">${esc(c.nom)}</div></div>`).join('')}`:''}
      ${morts.length?`<div class="attr-n" style="margin:14px 0 8px;">Tombés</div>${morts.map(c=>`<div class="row dead"><div><div class="row-n">${esc(c.nom)}</div><span class="row-s">${Math.abs(c.mort.an)} av. J.-C. · ${esc(c.mort.lieu)}</span></div></div>`).join('')}`:''}
      ${S.vulnera.length?`<div class="attr-n" style="margin:14px 0 8px;">Ce que ton corps a gardé</div><div class="vulnera">${S.vulnera.map(v=>'<div>— '+esc(v.n)+' : '+esc(v.d)+'</div>').join('')}</div>`:''}
    </div></div>
    <div class="pan" style="margin-top:0;"><div class="pan-h">Protections</div><div class="pan-b">
      ${patrons.length?patrons.map(id=>`<div class="row"><div><div class="row-n">${esc(P[id].nom)}</div><span class="row-s">${esc(P[id].titre)}</span></div><div class="row-v">${S.patrons[id]>0?'+':''}${S.patrons[id]}</div></div>`).join('')
        :'<p class="prose" style="font-size:15px;">Tu n’as eu personne pour parler de toi. C’était le cas de presque tous.</p>'}
      ${S.decorations.length?`<div class="attr-n" style="margin:14px 0 8px;">Dona militaria</div><div class="vulnera" style="color:var(--bronze);">${S.decorations.map(d=>'<div>— '+esc(d)+'</div>').join('')}</div>`:''}
      <hr class="rule">
      <div class="attr-n" style="margin-bottom:8px;">Dernières lignes du journal</div>
      <div class="log" style="max-height:190px;">${S.log.slice(0,14).map(l=>`<div class="${l.c}"><span class="y">${esc(l.d)}</span> — ${l.t}</div>`).join('')}</div>
    </div></div>
  </div>`;
}

/* ---------- démarrage ---------- */
window.addEventListener('DOMContentLoaded',()=>{
  const s=charger();
  if(s && !s.mort && !s.fin){ S=s; if(!S.etape) construireTour(); else render(); }
  else ecranSetup();
});
