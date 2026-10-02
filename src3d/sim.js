/* ============================================================
   SIMULATION — formations, pila, mêlée, fatigue, moral, déroute
   Le combat antique est une suite de duels dans un rang qui tient
   ou qui casse : chaque homme se bat pour lui, l'unité vit ou meurt
   par son moral. On meurt surtout dans la déroute.
   ============================================================ */
const TYPES={
  legion:  { modele:'leg', hp:3, att:.40, def:.48, vit:1.35, course:3.3, cd:[1.0,2.0], armer:.32, pila:true,  perte:2.0, moral:1.0 },
  pompeien:{ modele:'leg', hp:3, att:.40, def:.48, vit:1.35, course:3.3, cd:[1.0,2.0], armer:.32, pila:true,  perte:2.3, moral:1.0 },
  gaulois: { modele:'gau', hp:2, att:.42, def:.74, vit:1.5,  course:3.7, cd:[.85,1.8], armer:.5,  jav:true,   perte:2.9, moral:1.1 }
};
const M={ t:0, unites:[], soldats:[], traits:[], fin:null, armees:{}, sc:null, cote:'R', journal:[], signa:[] };
const TEINTES={
  cesar:  { t:['#A3281C','#982318','#AD3020'], b:['#8E2016','#9A2A1A'] },
  pompee: { t:['#D8CFC0','#CFC5B2','#E0D8CA'], b:['#3E5A8A','#36507E','#46638F'] },
  gaulois:{ t:['#7A5C2E','#5E6B3A','#8A3A22','#4E5A6E','#9A7A4A','#6A4A5A','#7E6E52','#3E4A2E'], b:['#5A3A20','#3E5A3A','#8A2A1E','#2E3E5E','#B08A4A','#4A2A2A','#6E5A3A'] }
};
const col=(h,k=1)=>new THREE.Color(h).multiplyScalar(k);

/* ---------- grille spatiale ---------- */
const CEL=2.5, GW=720, GO=900;
const cStart=new Int32Array(GW*GW+1), cCount=new Int32Array(GW*GW);
let cOrdre=new Int32Array(16000);
function cellule(x,z){ const ix=Math.max(0,Math.min(GW-1,((x+GO)/CEL)|0)), iz=Math.max(0,Math.min(GW-1,((z+GO)/CEL)|0)); return iz*GW+ix; }
function reconstruireGrille(){
  cCount.fill(0); const S=M.soldats;
  if(cOrdre.length<S.length) cOrdre=new Int32Array(S.length*2);
  for(let i=0;i<S.length;i++){ const s=S[i]; if(!s.vivant||s.cache){ s.cel=-1; continue; } s.cel=cellule(s.x,s.z); cCount[s.cel]++; }
  let a=0; for(let i=0;i<GW*GW;i++){ cStart[i]=a; a+=cCount[i]; } cStart[GW*GW]=a;
  cCount.fill(0);
  for(let i=0;i<S.length;i++){ const s=S[i]; if(s.cel<0) continue; cOrdre[cStart[s.cel]+cCount[s.cel]++]=i; }
}
function voisins(x,z,r,f){
  const n=Math.ceil(r/CEL), c0=cellule(x,z), ix=c0%GW, iz=(c0/GW)|0;
  for(let dz=-n;dz<=n;dz++){ const z2=iz+dz; if(z2<0||z2>=GW) continue;
    for(let dx=-n;dx<=n;dx++){ const x2=ix+dx; if(x2<0||x2>=GW) continue;
      const c=z2*GW+x2; for(let k=cStart[c];k<cStart[c+1];k++) f(M.soldats[cOrdre[k]]); } }
}
function ennemiProche(s,r){
  let best=null, bd=r*r;
  voisins(s.x,s.z,r,(o)=>{ if(o.u.side===s.u.side) return;
    /* dans un rang, on ne fait face qu'à un ou deux hommes : le joueur aussi */
    if(o.joueur && s.cible!==o && M.attJp>=2) return;
    const dx=o.x-s.x, dz=o.z-s.z, d=dx*dx+dz*dz; if(d<bd){ bd=d; best=o; } });
  return best;
}

/* ---------- création ---------- */
function creerUnite(o){
  const T=TYPES[o.type];
  const u={ id:M.unites.length, side:o.side, type:o.type, T, nom:o.nom, rows:o.rows, cols:o.cols, sx:o.sx, sz:o.sz,
    cx:o.x, cz:o.z, yaw:o.yaw, yawC:o.yaw, ordre:o.ordre||'tenir', but:null, moral:T.moral*(o.moralK||1), soldats:[],
    ligne:o.ligne||1, legion:o.legion||0, joueur:false, pilaFait:false, javFait:false, routing:false, melee:0,
    morts:0, mortsP:0, tReleve:0, tCombat:0, attend:!!o.attend, hpK:o.hpK||1, signum:null, insigne:o.insigne };
  const ar=M.armees[T.modele==='leg'?(o.side==='R'?'cesar':'pompee'):'gaulois'];
  const pal=TEINTES[o.teinte];
  for(let r=0;r<u.rows;r++) for(let c=0;c<u.cols;c++){
    const s={ u, r, c, x:0, z:0, y:0, vx:0, vz:0, yaw:u.yaw, hp:Math.round(T.hp*u.hpK), vivant:true, chute:0,
      phase:Math.random()*6.3, marche:0, coup:0, garde:0, etat:0, tc:0, cd:rand(.2,1.5), cible:null, tch:Math.random()*.3,
      stam:1, pila:T.pila?1:0, jav:T.jav?1:0, lancer:-1, stagger:0, epingle:false, cache:false, fuite:false, joueur:false, tue:0, cel:-1 };
    const p=slot(u,r,c); s.x=p.x+rand(-.25,.25); s.z=p.z+rand(-.25,.25); s.y=H(s.x,s.z);
    s.ar=ar; s.t1=col(pick(pal.t),rand(.85,1.12)); s.t2=col(pick(pal.b),rand(.85,1.1));
    u.soldats.push(s); M.soldats.push(s);
  }
  u.n0=u.soldats.length;
  if(T.modele==='leg') u.signum=creerSignum(u, o.aigle);
  M.unites.push(u); return u;
}
function slot(u,r,c){
  const lx=(c-(u.cols-1)/2)*u.sx, lz=((u.rows-1)/2-r)*u.sz;
  const s=Math.sin(u.yaw), k=Math.cos(u.yaw);
  return { x:u.cx+lx*k+lz*s, z:u.cz-lx*s+lz*k };
}
function avant(u){ return { x:Math.sin(u.yaw), z:Math.cos(u.yaw) }; }

/* enseignes : un signum par cohorte, l'aigle sur la première */
function creerSignum(u, aigle){
  const g=new THREE.Group();
  const bois=ombre(new THREE.MeshStandardMaterial({color:0x4A3420, roughness:.9, metalness:0}));
  const or=ombre(new THREE.MeshStandardMaterial({color:0xC9A13A, roughness:.26, metalness:1}));
  const pourpre=ombre(new THREE.MeshStandardMaterial({color:u.side==='R'?0x8E1A12:0x2E4A7A, roughness:.82, metalness:0, side:THREE.DoubleSide}));
  const hampe=new THREE.Mesh(new THREE.CylinderGeometry(.025,.025,3.4,6),bois); hampe.position.y=1.7; g.add(hampe);
  if(aigle){
    const a=new THREE.Mesh(new THREE.ConeGeometry(.12,.3,6),or); a.position.y=3.55; g.add(a);
    const ailes=new THREE.Mesh(new THREE.BoxGeometry(.6,.12,.04),or); ailes.position.y=3.6; ailes.rotation.z=.15; g.add(ailes);
  } else {
    for(let i=0;i<4;i++){ const d=new THREE.Mesh(new THREE.CylinderGeometry(.09,.09,.03,12),or); d.rotation.x=Math.PI/2; d.position.y=2.4+i*.24; g.add(d); }
    const m=new THREE.Mesh(new THREE.ConeGeometry(.05,.2,4),or); m.position.y=3.5; g.add(m);
  }
  const v=new THREE.Mesh(new THREE.PlaneGeometry(.55,.45),pourpre); v.position.set(0,aigle?3.1:3.25,.02); g.add(v);
  const barre=new THREE.Mesh(new THREE.CylinderGeometry(.015,.015,.62,4),bois); barre.rotation.z=Math.PI/2; barre.position.y=aigle?3.34:3.48; g.add(barre);
  scene.add(g); M.signa.push({u,g}); return g;
}

function deployer(sc){
  M.sc=sc;
  const lp=modeleLegionnaire(false), ll=modeleLoin(false);
  M.armees.cesar=new Armee(lp, ll, 2400, 1);
  M.armees.pompee=new Armee(lp, ll, sc.ennemi==='pompeien'?2600:1, 1);
  M.armees.gaulois=new Armee(modeleGaulois(), modeleLoin(true), sc.ennemi==='gaulois'?4400:1, 0);
  legions('R', sc.romains.z, Math.PI, sc.romains.legions, 'cesar', false, 1);
  const E=sc.ennemis;
  if(E.type==='gaulois'){
    const bandes=E.bandes, avantN=Math.ceil(bandes*.62), arr=bandes-avantN;
    for(let i=0;i<bandes;i++){
      const devant=i<avantN, k=devant?i-(avantN-1)/2:(i-avantN)-(arr-1)/2;
      creerUnite({ side:'E', type:'gaulois', teinte:'gaulois', nom:'Bande '+(i+1), rows:9, cols:26, sx:1.05, sz:1.2,
        x:k*34+rand(-3,3), z:E.z-(devant?0:30)+rand(-4,4), yaw:0, ordre:'avancer', ligne:devant?1:2 });
    }
  } else {
    legions('E', E.z, 0, E.legions, 'pompee', E.attend, E.fort?1.15:1);
  }
}
function legions(side, z0, yaw, n, teinte, attend, k){
  const dir=yaw===0?-1:1; /* la profondeur va vers l'arrière de chaque armée */
  for(let l=0;l<n;l++){
    const lx=(l-(n-1)/2)*156;
    const lignes=[[-54,-18,18,54],[-36,0,36],[-36,0,36]];
    lignes.forEach((xs,li)=>xs.forEach((x,ci)=>{
      creerUnite({ side, type:side==='R'?'legion':'pompeien', teinte, nom:`Leg. ${['X','VIII','IX','VII'][l]||l} · coh. ${romainN(li===0?ci+1:li===1?ci+5:ci+8)}`,
        rows:7, cols:16, sx:1.25, sz:1.6, x:lx+x, z:z0+dir*li*26, yaw, ligne:li+1, legion:l, attend, moralK:k, hpK:1,
        aigle:li===0&&ci===1 });
    }));
  }
}
function romainN(n){ return ['','I','II','III','IV','V','VI','VII','VIII','IX','X'][n]||n; }

/* ---------- ordres ---------- */
function ordonner(u, ordre, but){
  if(u.routing) return;
  if(ordre==='pila'){ jeterPila(u); return; }
  if(ordre==='releve'){ releve(u); return; }
  if(ordre==='serrez'){ u.moral=Math.min(u.T.moral*1.1,u.moral+.08); compacter(u,true); return; }
  u.ordre=ordre; u.but=but||null;
  if(but){ const a=Math.atan2(but.x-u.cx,but.z-u.cz); if(ordre!=='reculer') u.yawC=a; }
}
function releve(u){
  if(M.t-u.tReleve<18) return false;
  u.tReleve=M.t;
  const parC={};
  for(const s of u.soldats) if(s.vivant&&!s.fuite){ (parC[s.c]=parC[s.c]||[])[s.r]=s; }
  for(const c in parC){ const a=parC[c][0], b=parC[c][1]; if(a&&b){ a.r=1; b.r=0; a.cible=null; a.etat=0; } }
  return true;
}
function jeterPila(u){
  if(u.pilaFait) return; u.pilaFait=true;
  for(const s of u.soldats) if(s.vivant && s.r<=1 && s.pila>0 && !s.joueur) s.lancer=M.t+rand(0,.7);
  annonce(u,'pila');
}
function jeterJav(u){
  if(u.javFait) return; u.javFait=true;
  for(const s of u.soldats) if(s.vivant && s.r<=2 && s.jav>0) s.lancer=M.t+rand(0,1.2);
}
function cibleTrait(s){
  /* une cible au hasard dans le front adverse le plus proche */
  let best=null, bd=40*40;
  voisins(s.x+Math.sin(s.yaw)*22, s.z+Math.cos(s.yaw)*22, 16, (o)=>{
    if(o.u.side===s.u.side||Math.random()<.6) return;
    const d=(o.x-s.x)**2+(o.z-s.z)**2; if(d<bd&&d>36){ bd=d; best=o; } });
  return best;
}
function lancerTrait(s, cible, opts={}){
  const x0=s.x, z0=s.z, y0=s.y+1.9;
  let tx, ty, tz;
  if(cible){ tx=cible.x+cible.vx*.8+rand(-1.2,1.2); tz=cible.z+cible.vz*.8+rand(-1.2,1.2); ty=H(tx,tz)+1; }
  else { tx=opts.x; ty=opts.y; tz=opts.z; }
  const d=Math.hypot(tx-x0,tz-z0), T=clamp(d/21,.5,1.9);
  M.traits.push({ x:x0, y:y0, z:z0, vx:(tx-x0)/T, vz:(tz-z0)/T, vy:(ty-y0+4.9*T*T)/T, side:s.u.side, de:s, jav:!s.u.T.pila, t:0, plante:-1 });
  if(opts.vx!==undefined){ const tr=M.traits[M.traits.length-1]; tr.vx=opts.vx; tr.vy=opts.vy; tr.vz=opts.vz; }
  son('trait', s.x, s.z);
}
function majTraits(dt){
  const L=M.traits, mesh=TRAITS.mesh, Mx=new THREE.Matrix4(), q=new THREE.Quaternion(), v=new THREE.Vector3(), z=new THREE.Vector3(0,0,1), p=new THREE.Vector3(), un=new THREE.Vector3(1,1,1);
  for(let i=L.length-1;i>=0;i--){
    const t=L[i];
    if(t.plante>=0){ t.plante+=dt; if(t.plante>14){ L.splice(i,1); } continue; }
    t.t+=dt; t.vy-=9.8*dt; t.x+=t.vx*dt; t.y+=t.vy*dt; t.z+=t.vz*dt;
    const g=H(t.x,t.z);
    if(t.y<=g+1.2 && t.vy<0){
      let touche=null;
      voisins(t.x,t.z,1.2,(o)=>{ if(!touche && o.u.side!==t.side && Math.hypot(o.x-t.x,o.z-t.z)<.75) touche=o; });
      if(touche){
        const pTue = t.jav ? .16 : touche.u.T.modele==='gau' ? .42 : .2;
        if(Math.random()<pTue || (touche.joueur && false)) { if(touche.joueur) frapperJoueur(t.de, 22, true); else tuer(touche, t.de); poussiere(t.x,g,t.z,1,true); }
        else if(touche.joueur){ frapperJoueur(t.de, 12, true); }
        else if(!t.jav){ touche.epingle=true; touche.garde=0; }
        L.splice(i,1); continue;
      }
      if(t.y<=g+.15){ t.plante=0; t.y=g+.6; poussiere(t.x,g,t.z,.4); }
    }
  }
  for(let i=0;i<Math.min(L.length,700);i++){
    const t=L[i]; v.set(t.vx,t.plante>=0?-Math.abs(t.vx)*.3-5:t.vy,t.vz).normalize(); q.setFromUnitVectors(z,v);
    p.set(t.x,t.y,t.z); Mx.compose(p,q,un); mesh.setMatrixAt(i,Mx);
  }
  Mx.makeTranslation(0,-999,0); for(let i=L.length;i<Math.min(700,(TRAITS.n||0));i++) mesh.setMatrixAt(i,Mx);
  TRAITS.n=L.length; mesh.instanceMatrix.needsUpdate=true;
}

/* ---------- la mort ---------- */
function tuer(d, a){
  if(!d.vivant) return;
  d.vivant=false; d.chute=.01; d.cible=null; d.u.morts++;
  if(a){ a.tue++; if(a.joueur){ J.tues++; son('tue', d.x, d.z); } }
  poussiere(d.x,d.y,d.z,1.2,true); poussiere(d.x,d.y,d.z,1.4);
  if(d.joueur) mortJoueur();
}
function frapper(a, d){
  if(!d.vivant) return;
  if(d.joueur){ frapperJoueur(a, rand(6,12)); return; }
  const dx=a.x-d.x, dz=a.z-d.z, l=Math.hypot(dx,dz)||1;
  const face=(Math.sin(d.yaw)*dx+Math.cos(d.yaw)*dz)/l;
  let p=a.u.T.att*(.55+.45*a.stam);
  let def= face>.3 ? d.u.T.def : 1.25;
  if(d.epingle) def=Math.min(1.1,def+.35);
  if(d.etat===1) def*=1.3;
  if(d.stagger>0) def*=1.45;
  if(d.fuite) def=1.6;
  if(a.y>d.y+.5) p*=1.15;
  if(a.u.joueur && J.role==='superieur') p*=1.05;
  p*=def;
  if(Math.random()<p){ d.hp--; poussiere(d.x,d.y,d.z,1,true); if(d.hp<=0) tuer(d,a); else { d.stagger=.35; son('coup',d.x,d.z); } }
  else son('parade',d.x,d.z);
}

/* ---------- pas de simulation ---------- */
let tIA=0, tMoral=0, tCompact=0;
function majSim(dt){
  M.t+=dt;
  for(const e of M.sc.evenements) if(!e.fait && M.t>=e.t){ e.fait=true; evenement(e); }
  if((tIA-=dt)<=0){ tIA=.4; for(const u of M.unites) ia(u); }
  for(const u of M.unites) majUnite(u,dt);
  reconstruireGrille();
  M.attJp=M.attJ||0; M.attJ=0;
  for(const s of M.soldats){ majSoldat(s,dt); if(s.cible&&s.cible.joueur&&s.vivant) M.attJ++; }
  majTraits(dt);
  if((tMoral-=dt)<=0){ tMoral=.5; for(const u of M.unites) moral(u); }
  if((tCompact-=dt)<=0){ tCompact=1; for(const u of M.unites) compacter(u); verifierFin(); }
  for(const sg of M.signa){ const u=sg.u, vs=u.soldats.filter(s=>s.vivant&&!s.fuite);
    if(u.routing||!vs.length){ sg.g.visible=!u.routing&&vs.length>0; if(u.routing&&vs.length){ sg.g.visible=true; const s=vs[0]; sg.g.position.set(s.x,s.y,s.z); } continue; }
    let x=0,z=0,n=0; for(const s of vs) if(s.r===1||s.r===2){ x+=s.x; z+=s.z; n++; }
    if(n){ sg.g.position.set(x/n,H(x/n,z/n),z/n); } sg.g.rotation.y=u.yaw; }
}

function majUnite(u,dt){
  if(u.routing) return;
  const T=u.T;
  u.yaw+=clamp(angDiff(u.yaw,u.yawC),-.35*dt,.35*dt);
  let eng=0, viv=0; for(const s of u.soldats) if(s.vivant&&!s.fuite){ viv++; if(s.cible&&s.etat>0||s.cible&&Math.hypot(s.cible.x-s.x,s.cible.z-s.z)<1.8) eng++; }
  u.viv=viv; u.melee=viv?eng/viv:0;
  if(u.melee>.12 && u.ordre!=='reculer' && u.ordre!=='deplacer'){ u.ordre='combat'; u.tCombat+=dt; }
  const f=avant(u);
  let v=0;
  if(u.ordre==='avancer') v=T.vit;
  else if(u.ordre==='charger') v=T.course;
  else if(u.ordre==='reculer') v=-T.vit*.75;
  else if(u.ordre==='combat'){
    const adv=u.adv; if(adv){ const d=u.moral-adv.moral; v= d>.18?.28 : d<-.2?-.22 : 0; }
    if(u.melee<.04 && !u.joueur) u.ordre='tenir';
  }
  else if(u.ordre==='deplacer' && u.but){
    const dx=u.but.x-u.cx, dz=u.but.z-u.cz, d=Math.hypot(dx,dz);
    if(d<1.5){ u.ordre='tenir'; u.but=null; }
    else { const s=Math.min(T.vit*1.3,d); u.cx+=dx/d*s*dt; u.cz+=dz/d*s*dt; }
    return;
  }
  /* l'unité n'avance pas plus vite que son premier rang : les places restent devant les hommes, pas dans l'ennemi */
  if(v>0){
    let fx=0, fz=0, n=0; for(const s of u.soldats) if(s.vivant&&!s.fuite&&s.r===0){ fx+=s.x; fz+=s.z; n++; }
    if(n){ const p=slot(u,0,(u.cols-1)/2), lead=(p.x-fx/n)*f.x+(p.z-fz/n)*f.z; if(lead>2.2) v=0; else if(lead>1.2) v*=.4; }
  }
  if(u.but && (u.ordre==='avancer'||u.ordre==='charger')){
    const dx=u.but.x-u.cx, dz=u.but.z-u.cz, d=Math.hypot(dx,dz);
    if(d<2){ u.but=null; if(u.ordre==='avancer') u.ordre='tenir'; }
    else { u.cx+=dx/d*v*dt; u.cz+=dz/d*v*dt; return; }
  }
  u.cx+=f.x*v*dt; u.cz+=f.z*v*dt;
}

function majSoldat(s,dt){
  if(!s.vivant){ if(s.chute<1) s.chute=Math.min(1,s.chute+dt*2.4); return; }
  if(s.cache) return;
  const u=s.u, T=u.T;
  if(s.stagger>0) s.stagger-=dt;
  /* lancer de pilum ou de javelot programmé */
  if(s.lancer>0 && M.t>=s.lancer){ s.lancer=-1; const c=cibleTrait(s); if(c){ lancerTrait(s,c); s.coup=1; } s.pila=0; s.jav=0; }

  if(s.joueur){ combatAuto(s,dt,true); return; }

  let tx, tz, vit=T.vit;
  if(u.routing||s.fuite){
    s.fuite=true; s.cible=null; s.etat=0; s.garde=0;
    const f=avant(u); tx=s.x-f.x*20+rand(-6,6); tz=s.z-f.z*20+rand(-6,6); vit=4.3*(.6+.4*s.stam);
    if(Math.hypot(s.x-M.cx0,s.z-M.cz0)>380){ s.cache=true; return; }
  } else {
    if((s.tch-=dt)<=0){
      s.tch=.25+Math.random()*.15;
      const enCombat=u.ordre==='combat'||u.ordre==='charger';
      const r = s.r<=1&&enCombat ? 5 : u.poursuite ? 12 : 1.9;
      const e=ennemiProche(s,r);
      s.cible = e && (s.r<=1 || Math.hypot(e.x-s.x,e.z-s.z)<1.9 || u.poursuite) ? e : null;
    }
    if(s.cible && (!s.cible.vivant || s.cible.cache)) s.cible=null;
    if(s.cible){
      const dx=s.cible.x-s.x, dz=s.cible.z-s.z, d=Math.hypot(dx,dz)||1;
      if(d>7) s.cible=null;
      else { tx=s.cible.x-dx/d*1.05; tz=s.cible.z-dz/d*1.05; vit=d>2?T.course*.8:T.vit; }
    }
    if(!s.cible){ const p=slot(u,s.r,s.c); tx=p.x; tz=p.z;
      if(u.ordre==='charger') vit=T.course; }
  }
  /* pilotage : rejoindre le point visé, s'écarter des voisins */
  let dx=tx-s.x, dz=tz-s.z; const d=Math.hypot(dx,dz);
  let wx=0, wz=0;
  if(d>.05){ const sp=Math.min(vit*(.6+.4*s.stam), d*2.2); wx=dx/d*sp; wz=dz/d*sp; }
  let sx=0, sz=0;
  voisins(s.x,s.z,1,(o)=>{ if(o===s) return; const ex=s.x-o.x, ez=s.z-o.z, e2=ex*ex+ez*ez;
    const lim=o.u.side===s.u.side?.62:.85; if(e2<lim*lim&&e2>1e-6){ const e=Math.sqrt(e2), k=(lim-e)/lim; sx+=ex/e*k*3; sz+=ez/e*k*3; } });
  const a=Math.min(1,dt*7);
  s.vx+= (wx+sx-s.vx)*a; s.vz+=(wz+sz-s.vz)*a;
  s.x+=s.vx*dt; s.z+=s.vz*dt; s.y=H(s.x,s.z);
  const sp=Math.hypot(s.vx,s.vz);
  s.marche=Math.min(1,sp/1.3); s.phase+=dt*sp*3.3;
  /* cap : vers l'adversaire, sinon vers la marche, sinon vers l'avant de l'unité */
  let yc=u.yaw;
  if(s.cible) yc=Math.atan2(s.cible.x-s.x,s.cible.z-s.z);
  else if(s.fuite||sp>.8) yc=Math.atan2(s.vx,s.vz);
  s.yaw+=angDiff(s.yaw,yc)*Math.min(1,dt*6);
  if(sp>2.5 && Math.random()<dt*.6) poussiere(s.x,s.y,s.z,.8);
  combatAuto(s,dt,false);
}

function combatAuto(s,dt,joueur){
  const T=s.u.T, c=s.cible;
  const engage = c && c.vivant && Math.hypot(c.x-s.x,c.z-s.z)<1.65;
  if(engage){ s.stam=Math.max(.15,s.stam-dt*.012); if(Math.random()<dt*.25) poussiere(s.x,s.y,s.z,.9); }
  else s.stam=Math.min(1,s.stam+dt*.02);
  if(joueur) return;
  if(engage && s.stagger<=0 && !s.fuite){
    if(s.etat===0){ s.cd-=dt; s.coup*=.9; s.garde+=(1-s.garde)*Math.min(1,dt*6);
      if(s.cd<=0){ s.etat=1; s.tc=T.armer; } }
    else if(s.etat===1){ s.tc-=dt; s.coup=-(1-s.tc/T.armer); s.garde*=.9;
      if(s.tc<=0){ s.etat=2; s.tc=.22; frapper(s,c); } }
    else { s.tc-=dt; s.coup=Math.max(0,s.tc/.22);
      if(s.tc<=0){ s.etat=0; s.cd=rand(T.cd[0],T.cd[1])*(1.5-.5*s.stam); } }
  } else {
    if(s.etat===1 && c && c.vivant && s.stagger<=0){ s.tc-=dt; s.coup=-(1-s.tc/T.armer); if(s.tc<=0){ s.etat=0; s.cd=.4; } }
    else { s.etat=0; s.coup*=.88; }
    s.garde*=.95;
    if(s.coup>.05 && s.coup<.2) s.coup=0;
  }
}

/* ---------- moral ---------- */
function moral(u){
  if(u.routing) return;
  const pertes=u.morts-u.mortsP; u.mortsP=u.morts;
  const viv=u.soldats.filter(s=>s.vivant&&!s.fuite).length;
  let flanc=0, eng=0, adv={};
  for(const s of u.soldats){ if(!s.vivant||!s.cible) continue; eng++;
    const dx=s.cible.x-s.x, dz=s.cible.z-s.z, l=Math.hypot(dx,dz)||1;
    const f=(Math.sin(u.yaw)*dx+Math.cos(u.yaw)*dz)/l; if(f<-.25) flanc++;
    adv[s.cible.u.id]=(adv[s.cible.u.id]||0)+1; }
  let best=null, bn=0; for(const k in adv) if(adv[k]>bn){ bn=adv[k]; best=M.unites[k]; } u.adv=best;
  let dm=-pertes/u.n0*u.T.perte;
  if(eng && flanc/eng>.2) dm-=.04*(flanc/eng);
  for(const o of M.unites) if(o!==u && o.side===u.side && o.routing && !o.vuDeroute?.[u.id] && Math.hypot(o.cx-u.cx,o.cz-u.cz)<70){
    dm-=.06; o.vuDeroute=o.vuDeroute||{}; o.vuDeroute[u.id]=true; }
  /* une ligne qui se sait soutenue tient mieux : la triplex acies est faite pour cela */
  if(u.T.modele==='leg' && M.unites.some(o=>o!==u&&o.side===u.side&&!o.routing&&o.ligne>u.ligne&&Math.hypot(o.cx-u.cx,o.cz-u.cz)<45)) dm+=.006;
  if(viv/u.n0<.4) dm-=.015;
  if(!eng && !pertes) dm+=.006;
  if(u.joueur && J.role!=='soldat') dm*=.85;
  u.moral=Math.min(u.T.moral*1.15, u.moral+dm);
  if(u.moral<.12 || viv<6){ deroute(u); }
}
function deroute(u){
  if(u.routing) return;
  u.routing=true; u.ordre='fuite';
  for(const s of u.soldats) if(s.vivant) s.fuite=true;
  if(u.side==='R') annonce(u,'deroute'); else annonce(u,'fuite');
  for(const o of M.unites) if(o.side!==u.side && !o.routing && Math.hypot(o.cx-u.cx,o.cz-u.cz)<60 && !o.joueur){ o.poursuite=true; setTimeout(()=>{o.poursuite=false;},12000); }
}

/* ---------- rangs : on comble les trous vers l'avant ---------- */
function compacter(u, fort){
  if(u.routing) return;
  const grid={};
  for(const s of u.soldats) if(s.vivant&&!s.fuite) grid[s.r*1000+s.c]=s;
  for(let c=0;c<u.cols;c++) for(let r=0;r<u.rows-1;r++){
    if(grid[r*1000+c]) continue;
    for(let r2=r+1;r2<u.rows;r2++){ const s=grid[r2*1000+c]; if(s){ delete grid[r2*1000+c]; s.r=r; grid[r*1000+c]=s; break; } }
  }
  /* une colonne vide au premier rang : on resserre depuis les colonnes voisines */
  if(fort||Math.random()<.3) for(let c=0;c<u.cols;c++){
    if(grid[c]) continue;
    for(const dc of [1,-1,2,-2]){ const c2=c+dc; if(c2<0||c2>=u.cols) continue;
      let src=null, rs=-1; for(let r=u.rows-1;r>0;r--) if(grid[r*1000+c2]){ src=grid[r*1000+c2]; rs=r; break; }
      if(src){ delete grid[rs*1000+c2]; src.c=c; src.r=0; grid[c]=src; break; } }
  }
}

/* ---------- intelligence des unités ---------- */
function plusProche(u, filtre){
  let best=null, bd=1e9;
  for(const o of M.unites){ if(o.side===u.side||o.routing||!o.viv&&o.viv!==undefined) continue; if(filtre&&!filtre(o)) continue;
    const d=Math.hypot(o.cx-u.cx,o.cz-u.cz); if(d<bd){ bd=d; best=o; } }
  return best?{u:best,d:bd-(u.rows*u.sz+best.rows*best.sz)/2}:null;
}
function ia(u){
  if(u.routing) return;
  const e=plusProche(u); if(!e) { if(u.ordre!=='tenir') u.ordre='tenir'; return; }
  if(u.joueur){ /* l'unité du joueur combat d'elle-même au contact, mais ne bouge que sur ordre */
    if(J.role==='soldat'||J.role==='sousoff'){ /* sous le commandement de l'IA de centurion */ }
    else return;
  }
  const a=Math.atan2(e.u.cx-u.cx,e.u.cz-u.cz);
  if(e.d<150 && Math.abs(angDiff(u.yaw,a))>.35 && u.ordre!=='combat') u.yawC=a;
  if(u.ordre==='combat'){ releveAuto(u); return; }
  if(u.type==='gaulois'){
    if(e.d<30 && !u.javFait) jeterJav(u);
    if(e.d<42){ u.ordre='charger'; u.but=null; }
    else if(u.ligne===1||e.d<120){ u.ordre='avancer'; u.but=null; }
    else { u.ordre='avancer'; }
    return;
  }
  /* légions, des deux camps */
  if(u.ligne>1){
    const devant=M.unites.find(o=>o.side===u.side&&!o.routing&&o.ligne<u.ligne&&o.legion===u.legion&&Math.abs(o.cx-u.cx)<30&&o.viv>o.n0*.5&&o.moral>.5);
    const menace=e.d<70 && (!devant || Math.hypot(e.u.cx-u.cx,e.u.cz-u.cz)<Math.hypot(e.u.cx-devant.cx,e.u.cz-devant.cz)-10);
    if(devant && !menace){
      const f=avant(devant); const but={ x:devant.cx-f.x*26*(u.ligne-devant.ligne)+(u.cx-devant.cx)*.0, z:devant.cz-f.z*26*(u.ligne-devant.ligne) };
      but.x=u.cx; /* garder son intervalle */
      const d=Math.hypot(but.x-u.cx,but.z-u.cz);
      if(d>8){ u.ordre='deplacer'; u.but=but; u.yawC=devant.yaw; } else if(u.ordre==='deplacer') u.ordre='tenir';
      return;
    }
    if(!devant){ u.ligne=1; }
  }
  if(u.attend && e.d>9){ u.ordre='tenir'; if(e.d<22&&!u.pilaFait) jeterPila(u); return; }
  if(e.d<24 && !u.pilaFait && u.T.pila) jeterPila(u);
  const ennemiVient = e.u.ordre==='avancer'||e.u.ordre==='charger';
  if(e.d<15){ if(u.ordre!=='charger') annonce(u,'charge'); u.ordre='charger'; u.but=null; }
  else if(ennemiVient && u.side==='R' && M.sc.romains.tient!==false && e.d<90){ u.ordre='tenir'; }
  else if(e.d<60 && !u.pilaFait){ u.ordre='avancer'; }
  else { u.ordre='avancer'; }
  /* à mi-course, les vétérans reprennent leur souffle */
  if(u.side==='R' && M.sc.ennemis.attend && e.d<75 && e.d>50 && !u.halte){ u.halte=M.t; }
  if(u.halte && M.t-u.halte<6 && e.d>40){ u.ordre='tenir'; if(M.t-u.halte<.5) annonce(u,'halte'); }
}
function releveAuto(u){
  if(u.T.modele!=='leg'||u.joueur&&J.role==='centurion') return;
  if(u.tCombat<20) return;
  let st=0,n=0; for(const s of u.soldats) if(s.vivant&&s.r===0){ st+=s.stam; n++; }
  if(n && st/n<.62 && releve(u)) annonce(u,'releve');
}

/* ---------- événements de scénario ---------- */
function evenement(e){
  if(e.type==='flanc'){
    for(let i=0;i<e.bandes;i++){
      const u=creerUnite({ side:'E', type:'gaulois', teinte:'gaulois', nom:'Boïens '+(i+1), rows:9, cols:22, sx:1.05, sz:1.2,
        x:e.x+rand(-8,8), z:e.z+(i-(e.bandes-1)/2)*30, yaw:-Math.PI/2, ordre:'avancer', ligne:1 });
      u.yawC=u.yaw;
    }
    crier(e.msg[0], e.msg[1], true);
  }
}

function verifierFin(){
  if(M.fin) return;
  const vivantes=(side)=>M.unites.filter(u=>u.side===side&&!u.routing&&u.soldats.some(s=>s.vivant&&!s.fuite));
  const R=vivantes('R'), E=vivantes('E');
  const evAVenir=M.sc.evenements.some(e=>!e.fait);
  if(!E.length && !evAVenir) return finBataille('victoire');
  if(!R.length) return finBataille('defaite');
  if(M.t>M.sc.duree){
    const fr=R.reduce((a,u)=>a+u.viv,0), fe=E.reduce((a,u)=>a+u.viv,0);
    finBataille(fr>fe*1.2?'victoire':fe>fr*1.2?'defaite':'indecis');
  }
}
