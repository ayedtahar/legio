/* ============================================================
   JEU — le joueur, l'interface, la boucle
   soldat / sousoff / centurion : vue subjective dans le rang
   superieur : vue d'ensemble, on dispose des cohortes
   ============================================================ */
const J={ role:'soldat', s:null, pv:100, pv0:100, stam:1, yaw:Math.PI, pitch:0, bloc:0, blocVis:0,
  tEstoc:0, tUmbo:0, aEstoc:0, aUmbo:0, aPila:0, pila:2, tues:0, coups:0, parades:0, lourd:false, mort:false, tMort:0,
  dans:0, total:0, hors:0, unite:null, rang:1, nom:'', camp:false, st:null, cle:{}, souris:{g:false,d:false},
  verrou:false, secousse:0, flash:0, cam:{ x:0, z:20, d:110, a:Math.PI, p:.62 }, sel:[], tAide:0 };
let ETAT='menu', VIEW=null, dernierT=0, SCN=null;
const $=(id)=>document.getElementById(id);

/* ---------- lancement ---------- */
function demarrer(id, rang, st, nom, camp){
  SCN=SCENARIOS[id]; ETAT='chargement';
  J.rang=rang; J.role=RANGS[rang].p; J.st=st; J.nom=nom; J.camp=camp;
  J.pv=J.pv0=Math.max(25,st.valetudo); J.pila=2;
  $('menu').hidden=true;
  /* le ciel et les sols sont des photographies : il faut les attendre */
  $('brief').innerHTML=`<div class="carte"><div class="sur">${SCN.an} av. J.-C. · ${SCN.lieu}</div>
    <h1>${SCN.n}</h1><p>On dresse le terrain…</p>
    <div class="jg"><div class="jg-b"><i id="chg" style="width:4%"></i></div></div></div>`;
  $('brief').hidden=false;
  chargerRessources(SCN, ()=>{
    ETAT='brief';
    initMonde(SCN); deployer(SCN); M.cx0=0; M.cz0=0;
    placerJoueur();
    reconstruireGrille();
    ecrireRendu();
    montrerBrief();
    requestAnimationFrame(boucle);
  }, (p)=>{ const b=$('chg'); if(b) b.style.width=Math.round(4+p*96)+'%'; });
}
function placerJoueur(){
  const coh=M.unites.filter(u=>u.side==='R'&&u.legion===0);
  if(J.role==='superieur'){
    coh.forEach(u=>u.joueur=true); J.sel=[coh[1]];
    J.cam.x=coh[1].cx; J.cam.z=coh[1].cz-10; J.cam.a=Math.PI; J.cam.d=110;
    return;
  }
  const u=coh[2]; J.unite=u;
  if(J.role==='centurion') u.joueur=true;
  const r = J.role==='sousoff'?1:0, c = J.role==='centurion'?u.cols-2:Math.floor(u.cols/2);
  const s=u.soldats.find(x=>x.r===r&&x.c===c);
  s.joueur=true; s.hp=9999; s.invisible=true; J.s=s; J.yaw=u.yaw;
}

/* ---------- entrées ---------- */
addEventListener('keydown',(e)=>{
  if(e.repeat) return;
  J.cle[e.code]=true;
  if(ETAT==='brief' && (e.code==='Enter'||e.code==='Space')){ e.preventDefault(); entrer(); return; }
  if(ETAT!=='jeu') return;
  if(e.code==='KeyM'){ crier(null, basculerSon()?'Son coupé':'Son rétabli'); }
  if(e.code==='KeyH'){ $('aide').classList.toggle('on'); }
  if(J.role==='superieur') return toucheChef(e);
  if(J.mort) return;
  if(e.code==='Space'){ e.preventDefault(); umbo(); }
  if(e.code==='KeyF') pilum();
  const u=J.unite;
  if(J.role==='sousoff'||J.role==='centurion'){
    if(e.code==='KeyR'){ if(releve(u)){ son('sifflet'); crier('Relève !','Tu fais tourner les rangs : le premier passe derrière.'); } else crier(null,'Trop tôt pour une nouvelle relève.'); }
    if(e.code==='KeyT'){ ordonner(u,'serrez'); son('sifflet'); crier('Ordines servate !','Serrez les rangs !'); }
  }
  if(J.role==='centurion'){
    const o={Digit1:'tenir',Digit2:'avancer',Digit3:'pila',Digit4:'charger',Digit5:'reculer'}[e.code];
    if(o){ ordonner(u,o); annonceOrdre(o); }
  }
});
addEventListener('keyup',(e)=>{ J.cle[e.code]=false; });
addEventListener('mousedown',(e)=>{
  if(ETAT!=='jeu') return;
  initSon();
  if(J.role==='superieur') return sourisChef(e,true);
  if(!J.verrou){ renderer.domElement.requestPointerLock(); return; }
  if(e.button===0){ J.souris.g=true; estoc(); }
  if(e.button===2) J.souris.d=true;
});
addEventListener('mouseup',(e)=>{ if(e.button===0) J.souris.g=false; if(e.button===2) J.souris.d=false; if(J.role==='superieur') sourisChef(e,false); });
addEventListener('contextmenu',(e)=>{ if(ETAT==='jeu') e.preventDefault(); });
addEventListener('mousemove',(e)=>{
  if(ETAT!=='jeu') return;
  if(J.role==='superieur') return deplacerChef(e);
  if(!J.verrou||J.mort) return;
  J.yaw-=e.movementX*.0022; J.pitch=clamp(J.pitch-e.movementY*.0022,-1.1,1.0);
});
addEventListener('wheel',(e)=>{ if(ETAT==='jeu'&&J.role==='superieur'){ J.cam.d=clamp(J.cam.d*(1+Math.sign(e.deltaY)*.12),25,420); } },{passive:true});
document.addEventListener('pointerlockchange',()=>{
  J.verrou=document.pointerLockElement===renderer.domElement;
  if(!J.verrou && ETAT==='jeu' && J.role!=='superieur' && !M.fin) pause(true);
});

function entrer(){
  initSon(); $('brief').hidden=true; ETAT='jeu'; dernierT=performance.now();
  if(J.role!=='superieur') renderer.domElement.requestPointerLock();
  son('cornu');
  crier(SCN.n, ROLES[J.role].d, true);
}
function pause(on){
  if(on){ ETAT='pause'; $('pause').hidden=false; }
  else { $('pause').hidden=true; ETAT='jeu'; dernierT=performance.now(); if(J.role!=='superieur') renderer.domElement.requestPointerLock(); }
}

/* ---------- gestes du légionnaire ---------- */
function devantJoueur(r, cone){
  const s=J.s, fx=Math.sin(J.yaw), fz=Math.cos(J.yaw); let best=null, bd=r;
  voisins(s.x,s.z,r,(o)=>{ if(o.u.side===s.u.side||!o.vivant) return;
    const dx=o.x-s.x, dz=o.z-s.z, d=Math.hypot(dx,dz); if(d>r||d<.01) return;
    if((dx*fx+dz*fz)/d<cone) return; if(d<bd){ bd=d; best=o; } });
  return best;
}
function estoc(){
  if(J.mort||J.tEstoc>0||J.stam<.08) return;
  J.tEstoc=.62; J.aEstoc=1; J.stam-=.06; J.coupEstoc=.12;
}
function resoudreEstoc(){
  {
    if(J.mort||!J.s) return;
    const o=devantJoueur(2.25,.78); if(!o){ return; }
    const dx=J.s.x-o.x, dz=J.s.z-o.z, l=Math.hypot(dx,dz)||1;
    const face=(Math.sin(o.yaw)*dx+Math.cos(o.yaw)*dz)/l>.35;
    const ouvert=o.etat===1||o.stagger>0||o.epingle||o.fuite;
    let p= ouvert?.95 : face ? (.42+.25*J.stam)*(o.u.T.def<.6?.8:1.1) : .9;
    if(Math.random()<p){
      const dmg=ouvert&&o.etat===1?2:1; o.hp-=dmg; poussiere(o.x,o.y,o.z,1,true); son('frappe');
      if(o.hp<=0) tuer(o,J.s); else { o.stagger=.5; o.etat=0; }
      marqueur(true);
    } else { son('parade',o.x,o.z); marqueur(false); if(Math.random()<.3) o.cd=Math.min(o.cd,.2); }
  }
}
function umbo(){
  if(J.mort||J.tUmbo>0||J.stam<.1) return;
  J.tUmbo=1.1; J.aUmbo=1; J.stam-=.1; J.coupUmbo=.09;
}
function resoudreUmbo(){
  {
    const s=J.s; if(!s) return; const fx=Math.sin(J.yaw), fz=Math.cos(J.yaw); let n=0;
    voisins(s.x,s.z,2,(o)=>{ if(o.u.side===s.u.side||!o.vivant) return;
      const dx=o.x-s.x, dz=o.z-s.z, d=Math.hypot(dx,dz); if(d>1.9||(dx*fx+dz*fz)/d<.55) return;
      o.stagger=1.1; o.etat=0; o.coup=0; o.x+=dx/d*.7; o.z+=dz/d*.7; n++; });
    son(n?'bouclier':'parade', s.x, s.z);
  }
}
function pilum(){
  if(J.mort||J.pila<=0||J.aPila>0) return;
  J.pila--; J.aPila=1;
  const s=J.s, cp=Math.cos(J.pitch), v=23;
  const dir={ x:Math.sin(J.yaw)*cp, y:Math.sin(J.pitch)+.12, z:Math.cos(J.yaw)*cp };
  lancerTrait(s,null,{ x:s.x+dir.x*20, y:s.y, z:s.z+dir.z*20, vx:dir.x*v, vy:dir.y*v, vz:dir.z*v });
}
function frapperJoueur(a, dmg, trait){
  if(J.mort||!J.s) return;
  if(a){
    const dx=a.x-J.s.x, dz=a.z-J.s.z, l=Math.hypot(dx,dz)||1;
    const front=(dx*Math.sin(J.yaw)+dz*Math.cos(J.yaw))/l;
    if(J.bloc>.6 && front>.3 && J.stam>.02){ J.stam=Math.max(0,J.stam-(trait?.04:.07)); J.secousse=.25; J.parades++; son('bouclier'); return; }
  }
  J.pv-=dmg; J.coups++; J.flash=1; J.secousse=.4; son('blesse');
  if(dmg>=14) J.lourd=true;
  if(J.pv<=0){ J.pv=0; tuer(J.s,a); }
}
function mortJoueur(){
  J.mort=true; J.tMort=0; crier(null,'Tu es tombé.',true);
  document.exitPointerLock&&document.exitPointerLock();
}

function majJoueur(dt){
  const s=J.s; if(!s) return;
  J.tEstoc=Math.max(0,J.tEstoc-dt); J.tUmbo=Math.max(0,J.tUmbo-dt);
  if(J.coupEstoc>0 && (J.coupEstoc-=dt)<=0) resoudreEstoc();
  if(J.coupUmbo>0 && (J.coupUmbo-=dt)<=0) resoudreUmbo();
  J.aEstoc=Math.max(0,J.aEstoc-dt*3.2); J.aUmbo=Math.max(0,J.aUmbo-dt*2.6); J.aPila=Math.max(0,J.aPila-dt*1.6);
  J.flash=Math.max(0,J.flash-dt*1.6); J.secousse=Math.max(0,J.secousse-dt);
  if(J.mort){ J.tMort+=dt; if(J.tMort>3.5 && !M.fin) finBataille('tombe'); return; }
  J.bloc = J.souris.d && J.stam>0 ? 1 : 0;
  J.blocVis+=(J.bloc-J.blocVis)*Math.min(1,dt*12);
  const k=J.cle;
  let ax=0, az=0;
  if(k.KeyW||k.ArrowUp) az+=1; if(k.KeyS||k.ArrowDown) az-=1;
  if(k.KeyA||k.ArrowLeft) ax-=1; if(k.KeyD||k.ArrowRight) ax+=1;
  const course=(k.ShiftLeft||k.ShiftRight) && J.stam>.15 && az>0 && !J.bloc;
  let v = J.bloc?1.0 : course?3.9 : 1.75;
  const fx=Math.sin(J.yaw), fz=Math.cos(J.yaw), rx=-Math.cos(J.yaw), rz=Math.sin(J.yaw);
  let wx=(fx*az+rx*ax), wz=(fz*az+rz*ax); const l=Math.hypot(wx,wz); if(l>0){ wx=wx/l*v; wz=wz/l*v; }
  else if(!s.u.routing && !devantJoueur(2.6,-1)){
    /* le rang te porte : sans ordre de tes jambes, tu suis ta place dans la formation */
    const p=slot(s.u,s.r,s.c), dx=p.x-s.x, dz=p.z-s.z, d=Math.hypot(dx,dz);
    if(d>.4){ const sp=Math.min(s.u.ordre==='charger'?3.4:1.9, d*1.5); wx=dx/d*sp; wz=dz/d*sp; }
  }
  let sx=0, sz=0;
  voisins(s.x,s.z,1.2,(o)=>{ if(o===s||!o.vivant) return; const ex=s.x-o.x, ez=s.z-o.z, e2=ex*ex+ez*ez, lim=o.u.side===s.u.side?.7:1.0;
    if(e2<lim*lim&&e2>1e-6){ const e=Math.sqrt(e2); sx+=ex/e*(lim-e)*5; sz+=ez/e*(lim-e)*5; } });
  const a=Math.min(1,dt*10);
  s.vx+=(wx+sx-s.vx)*a; s.vz+=(wz+sz-s.vz)*a;
  s.x+=s.vx*dt; s.z+=s.vz*dt; s.y=H(s.x,s.z); s.yaw=J.yaw;
  const sp=Math.hypot(s.vx,s.vz); s.marche=Math.min(1,sp/1.5); s.phase+=dt*sp*3.3;
  /* souffle : la course et le fer coûtent, le repos rend */
  const engage=!!devantJoueur(2,.3);
  J.stam=clamp(J.stam + dt*(course?-.09:J.bloc?-.01:engage?.012:.05));
  /* tenir son rang */
  const p=slot(s.u,s.r,s.c), dslot=Math.hypot(p.x-s.x,p.z-s.z);
  J.total+=dt; if(dslot<3.5||engage) J.dans+=dt;
  if(dslot>9 && !s.u.routing){ J.hors+=dt; if(J.hors>3){ J.hors=-10; crier('In ordinem !','Tu as quitté le rang. Reviens à ta place.'); } } else if(J.hors>0) J.hors=0;
  if(s.u.routing && !J.fuiteVue){ J.fuiteVue=true; crier('Fuga !','Ta cohorte rompt. Sauve ta peau — ou tiens seul.',true); }
}

/* ---------- l'arme en main ---------- */
function construireArmes(){
  const g=new THREE.Group();
  /* Ce sont les deux objets que le joueur a sous le nez en permanence : c'est là
     que la matière doit se voir. Le bronze et le fer sont des métaux — ils
     réfléchissent le ciel ; la planche peinte et le cuir ne réfléchissent rien. */
  const M_=(c,r,me,d)=>ombre(new THREE.MeshStandardMaterial({color:c, roughness:r, metalness:me, side:d?THREE.DoubleSide:THREE.FrontSide}));
  const rouge=M_(0x8E2016,.78,0,true), bronze=M_(0xA07E3C,.34,.95),
        fer=M_(0xC8C8CC,.22,.95), cuir=M_(0x4A321C,.86,0), peau=M_(0xB98A66,.72,0);
  const bouclier=new THREE.Group();
  const sc=new THREE.Mesh(new THREE.CylinderGeometry(.62,.62,1.06,16,1,true,Math.PI-.56,1.12),rouge); sc.position.z=.62; bouclier.add(sc);
  const um=new THREE.Mesh(new THREE.SphereGeometry(.08,10,8),bronze); um.position.z=-.01; bouclier.add(um);
  const sp=new THREE.Mesh(new THREE.BoxGeometry(.045,.95,.02),bronze); sp.position.z=.005; bouclier.add(sp);
  const orle=new THREE.Mesh(new THREE.BoxGeometry(.66,.03,.04),bronze); orle.position.set(0,.53,.12); bouclier.add(orle);
  bouclier.rotation.y=.25;
  g.add(bouclier);
  const glaive=new THREE.Group();
  const lame=new THREE.Mesh(new THREE.BoxGeometry(.042,.01,.46),fer); lame.position.z=-.28; glaive.add(lame);
  const pointe=new THREE.Mesh(new THREE.ConeGeometry(.025,.1,4),fer); pointe.rotation.x=-Math.PI/2; pointe.position.z=-.56; glaive.add(pointe);
  const garde=new THREE.Mesh(new THREE.BoxGeometry(.11,.03,.04),cuir); garde.position.z=-.04; glaive.add(garde);
  const poignee=new THREE.Mesh(new THREE.CylinderGeometry(.018,.018,.1,6),cuir); poignee.rotation.x=Math.PI/2; poignee.position.z=.03; glaive.add(poignee);
  const pommeau=new THREE.Mesh(new THREE.SphereGeometry(.03,8,6),bronze); pommeau.position.z=.09; glaive.add(pommeau);
  const main=new THREE.Mesh(new THREE.BoxGeometry(.08,.08,.11),peau); main.position.z=.03; glaive.add(main);
  const bras=new THREE.Mesh(new THREE.BoxGeometry(.08,.08,.35),peau); bras.position.set(.02,-.03,.25); glaive.add(bras);
  g.add(glaive);
  const pil=new THREE.Group();
  const h=new THREE.Mesh(new THREE.CylinderGeometry(.016,.016,1.4,6),cuir); h.rotation.x=Math.PI/2; pil.add(h);
  const f2=new THREE.Mesh(new THREE.CylinderGeometry(.007,.007,.6,4),fer); f2.rotation.x=Math.PI/2; f2.position.z=-.95; pil.add(f2);
  g.add(pil);
  camera.add(g);
  VIEW={ g, bouclier, glaive, pil };
}
function majArmes(dt,t){
  if(!VIEW) return;
  const v=VIEW, b=J.blocVis, e=Math.sin(Math.min(1,J.aEstoc)*Math.PI), u=Math.sin(Math.min(1,J.aUmbo)*Math.PI);
  const bob=J.s?Math.sin(J.s.phase)*.015*J.s.marche:0;
  v.bouclier.position.set(lerp(-.62,-.2,b), lerp(-.62,-.32,b)+bob, lerp(-.7,-.52,b)-u*.35);
  v.bouclier.rotation.set(0, lerp(.75,.12,b), lerp(.08,0,b));
  v.glaive.position.set(lerp(.34,.4,b), -.36+bob*1.3+e*.08, -.46-e*.5);
  v.glaive.rotation.set(.12+e*.05, .18-e*.16, -.25);
  /* le pilum n'apparaît qu'au lancer : bras armé au-dessus de l'épaule, puis il part */
  v.pil.visible=J.aPila>0;
  const lp=1-J.aPila;
  v.pil.position.set(.3, .12-lp*.1, -.3-lp*1.6); v.pil.rotation.set(.18-lp*.15, -.05, 0);
  v.g.visible=!J.mort;
}

/* ---------- caméra ---------- */
function majCamera(dt){
  if(J.role==='superieur'){
    const k=J.cle, c=J.cam, sp=c.d*.9*dt;
    const fx=Math.sin(c.a), fz=Math.cos(c.a);
    if(k.KeyW||k.ArrowUp){ c.x+=fx*sp; c.z+=fz*sp; } if(k.KeyS||k.ArrowDown){ c.x-=fx*sp; c.z-=fz*sp; }
    if(k.KeyA||k.ArrowLeft){ c.x+=fz*sp; c.z-=fx*sp; } if(k.KeyD||k.ArrowRight){ c.x-=fz*sp; c.z+=fx*sp; }
    if(k.KeyQ) c.a+=dt*1.2; if(k.KeyE) c.a-=dt*1.2;
    c.x=clamp(c.x,-600,600); c.z=clamp(c.z,-600,600);
    const y=H(c.x,c.z);
    camera.position.set(c.x-fx*c.d*Math.cos(c.p), y+c.d*Math.sin(c.p), c.z-fz*c.d*Math.cos(c.p));
    camera.lookAt(c.x,y,c.z);
  } else {
    const s=J.s;
    let h=1.62+Math.sin(s.phase*2)*.03*s.marche;
    const sh=J.secousse*.04;
    if(J.mort){ h=lerp(1.62,.35,Math.min(1,J.tMort*1.5)); }
    camera.position.set(s.x+rand(-sh,sh), s.y+h+rand(-sh,sh), s.z+rand(-sh,sh));
    camera.rotation.order='YXZ'; camera.rotation.set(J.pitch, J.yaw+Math.PI, J.mort?Math.min(1,J.tMort)*.9:0);
  }
  /* le dôme peint suivait l'œil ; le panorama HDRI, lui, est déjà à l'infini */
  if(camera.userData.ciel) camera.userData.ciel.position.copy(camera.position);
}

/* ---------- commandement : la vue d'ensemble ---------- */
const RAY=new THREE.Raycaster(), NDC=new THREE.Vector2();
let glisse=null;
function solSous(e){
  NDC.set(e.clientX/innerWidth*2-1, -(e.clientY/innerHeight)*2+1); RAY.setFromCamera(NDC,camera);
  const o=RAY.ray.origin, d=RAY.ray.direction;
  for(let t=0;t<3000;t+=1.5){ const x=o.x+d.x*t, y=o.y+d.y*t, z=o.z+d.z*t; if(y<=H(x,z)) return {x,z}; }
  return null;
}
function sourisChef(e,down){
  if(!down){ glisse=null; return; }
  if(e.target!==renderer.domElement) return;
  if(e.button===1){ glisse={x:e.clientX}; return; }
  const p=solSous(e); if(!p) return;
  if(e.button===0){
    let best=null, bd=26;
    for(const u of M.unites){ if(!u.joueur||u.routing) continue; const d=Math.hypot(u.cx-p.x,u.cz-p.z); if(d<bd){ bd=d; best=u; } }
    if(e.shiftKey){ if(best && !J.sel.includes(best)) J.sel.push(best); }
    else J.sel=best?[best]:[];
  }
  if(e.button===2 && J.sel.length){
    const cx=J.sel.reduce((a,u)=>a+u.cx,0)/J.sel.length, cz=J.sel.reduce((a,u)=>a+u.cz,0)/J.sel.length;
    for(const u of J.sel) ordonner(u,'deplacer',{ x:p.x+(u.cx-cx), z:p.z+(u.cz-cz) });
    son('cornu');
  }
}
function deplacerChef(e){ if(glisse){ J.cam.a-=(e.clientX-glisse.x)*.005; glisse.x=e.clientX; } }
function toucheChef(e){
  const o={Digit1:'tenir',Digit2:'avancer',Digit3:'pila',Digit4:'charger',Digit5:'reculer',KeyR:'releve',KeyT:'serrez'}[e.code];
  if(e.code==='KeyG'){ for(const u of J.sel){ const n=plusProche(u); if(n) u.yawC=Math.atan2(n.u.cx-u.cx,n.u.cz-u.cz); } crier(null,'Les cohortes font face à l’ennemi le plus proche.'); return; }
  if(e.code==='KeyX'){ J.sel=M.unites.filter(u=>u.joueur&&!u.routing); return; }
  if(e.code==='Escape'){ pause(true); return; }
  if(o && J.sel.length){ for(const u of J.sel) ordonner(u,o); annonceOrdre(o); }
}
function annonceOrdre(o){
  const T={ tenir:['Consistite !','Tenez la position.'], avancer:['Signa inferte !','En avant, au pas.'], pila:['Pila… iacite !','Lancez les pila !'],
    charger:['Gladios ! Ad eos !','Chargez !'], reculer:['Pedem referte !','Reculez en ordre.'], releve:['Relève !','Les rangs tournent.'], serrez:['Ordines servate !','Serrez les rangs.'] }[o];
  if(T){ crier(T[0],T[1]); son(o==='releve'||o==='serrez'?'sifflet':'cornu'); }
}

/* ---------- annonces ---------- */
function annonce(u,k){
  const moi = (J.unite===u) || (J.role==='superieur' && u.joueur);
  if(k==='fuite'){ if(Math.random()<.6||moi) crier('Fugiunt !',`${u.nom} : l’ennemi rompt et s’enfuit.`); return; }
  if(k==='deroute'){ crier('Fuga !',`${u.nom} rompt.`, moi); son('cornu'); return; }
  if(!moi) return;
  if(J.role==='centurion' && J.unite===u && k!=='releve') return;
  if(k==='pila'){ crier('Pila… iacite !', J.role==='soldat'?'Lance ton pilum — touche F !':'La cohorte lance ses pila.'); son('cornu'); }
  if(k==='charge'){ crier('Gladios ! Ad eos !','Glaive au poing — on charge !'); son('cornu'); }
  if(k==='halte'){ crier('Consistite !','Halte à mi-course : on reprend son souffle, on reforme les rangs.'); }
  if(k==='releve'){ son('sifflet');
    if(J.s&&J.s.u===u) crier('Relève !', J.s.r===0?'Tu passes au premier rang. À toi.':'Tu passes derrière par l’intervalle. Souffle.');
    else crier('Relève !','Les rangs tournent.'); }
}
let tCri=0;
function crier(lat, fr, fort){
  const box0=$('cris'), cle=(lat||'')+'|'+(fr||'');
  for(const c of box0.children) if(c.dataset.cle===cle && !c.classList.contains('vieux')) return;
  const el=document.createElement('div'); el.dataset.cle=cle; el.className='cri'+(fort?' fort':'');
  el.innerHTML=(lat?`<b>${lat}</b>`:'')+(fr?`<span>${fr}</span>`:'');
  const box=$('cris'); box.prepend(el); while(box.children.length>4) box.lastChild.remove();
  setTimeout(()=>el.classList.add('vieux'),5500); setTimeout(()=>el.remove(),7000);
}
function marqueur(ok){ const m=$('marque'); m.className=ok?'ok':'ko'; void m.offsetWidth; m.classList.add('on'); }

/* ---------- interface ---------- */
function majHUD(){
  const t=Math.floor(M.t), m=Math.floor(t/60), s=t%60;
  $('temps').textContent=`${m}:${String(s).padStart(2,'0')}`;
  if(J.role!=='superieur'){
    $('pv').style.width=clamp(J.pv/J.pv0)*100+'%'; $('pvn').textContent=Math.round(J.pv);
    $('st').style.width=clamp(J.stam)*100+'%';
    $('pila').textContent='▮'.repeat(J.pila)+'▯'.repeat(2-J.pila);
    const u=J.unite; $('moral').style.width=clamp(u.moral/1.1)*100+'%';
    $('ordre').textContent=libOrdre(u);
    $('flash').style.opacity=J.flash*.85;
    $('reticule').style.opacity=J.mort?0:1;
  } else majChef();
  const R=M.unites.filter(u=>u.side==='R'), E=M.unites.filter(u=>u.side==='E');
  const vR=R.reduce((a,u)=>a+u.soldats.filter(s=>s.vivant&&!s.fuite).length,0), vE=E.reduce((a,u)=>a+u.soldats.filter(s=>s.vivant&&!s.fuite).length,0);
  $('forces').innerHTML=`<i class="r"></i>${vR} <i class="e"></i>${vE}`;
}
function libOrdre(u){ if(u.routing) return 'en déroute'; return {tenir:'tient',avancer:'avance',charger:'charge',combat:'au contact',reculer:'recule',deplacer:'manœuvre'}[u.ordre]||u.ordre; }
function majChef(){
  const L=$('labels'); let h='';
  const v=new THREE.Vector3();
  for(const u of M.unites){
    if(!u.joueur&&!(u.side==='E'&&!u.routing)) continue;
    const viv=u.soldats.filter(s=>s.vivant&&!s.fuite).length; if(!viv) continue;
    v.set(u.cx,H(u.cx,u.cz)+6,u.cz).project(camera); if(v.z>1) continue;
    const x=(v.x*.5+.5)*innerWidth, y=(-v.y*.5+.5)*innerHeight;
    if(u.side==='E'){ h+=`<div class="lab e" style="left:${x}px;top:${y}px"><i style="width:${clamp(u.moral/1.1)*100}%"></i></div>`; continue; }
    const sel=J.sel.includes(u), num=(u.nom.split('coh. ')[1]||'');
    h+=`<div class="lab ${sel?'sel':''} ${u.routing?'fuite':''}" style="left:${x}px;top:${y}px"><b>${num}</b>${sel?`<span>${libOrdre(u)} · ${viv}</span>`:''}<i style="width:${clamp(u.moral/1.1)*100}%"></i></div>`;
  }
  L.innerHTML=h;
  $('selinfo').textContent=J.sel.length?`${J.sel.length} cohorte${J.sel.length>1?'s':''} sélectionnée${J.sel.length>1?'s':''}`:'Aucune cohorte sélectionnée';
}
let tMini=0;
function majMini(dt){
  if((tMini-=dt)>0) return; tMini=.2;
  const cv=$('mini'), x=cv.getContext('2d'), W=cv.width, S=W/560;
  x.clearRect(0,0,W,W); x.fillStyle='rgba(20,14,8,.75)'; x.fillRect(0,0,W,W);
  const px=(wx)=>W/2+wx*S, pz=(wz)=>W/2+wz*S; /* Romains en bas, l'ennemi en haut */
  for(const u of M.unites){
    const viv=u.soldats.filter(s=>s.vivant&&!s.fuite); if(!viv.length) continue;
    let cx=0,cz=0; for(const s of viv){ cx+=s.x; cz+=s.z; } cx/=viv.length; cz/=viv.length;
    x.save(); x.translate(px(cx),pz(cz)); x.rotate(u.yaw);
    const w=u.cols*u.sx*S*Math.sqrt(viv.length/u.n0), d=u.rows*u.sz*S;
    x.globalAlpha=u.routing?.35:.4+.6*clamp(u.moral);
    x.fillStyle=u.side==='R'?'#C4443A':'#B8A88A';
    if(u.routing){ x.strokeStyle=x.fillStyle; x.strokeRect(-w/2,-d/2,w,d); } else x.fillRect(-w/2,-d/2,w,d);
    if(J.sel.includes(u)){ x.globalAlpha=1; x.strokeStyle='#F2DFA6'; x.lineWidth=1.5; x.strokeRect(-w/2-2,-d/2-2,w+4,d+4); }
    x.restore();
  }
  x.globalAlpha=1;
  const cp=J.role==='superieur'?{x:J.cam.x,z:J.cam.z}:J.s;
  if(cp){ x.fillStyle='#F2DFA6'; x.beginPath(); x.arc(px(cp.x),pz(cp.z),3.5,0,7); x.fill();
    const a=J.role==='superieur'?J.cam.a:J.yaw; x.strokeStyle='#F2DFA6'; x.beginPath(); x.moveTo(px(cp.x),pz(cp.z)); x.lineTo(px(cp.x+Math.sin(a)*22),pz(cp.z+Math.cos(a)*22)); x.stroke(); }
}

/* ---------- rendu des soldats ---------- */
function ecrireRendu(){
  for(const k in M.armees) M.armees[k].debut();
  const c=camera.position, f=camera.getWorldDirection(TMP);
  /* le modèle fin va aux hommes proches, devant la caméra */
  const cx=c.x+f.x*LOD_PRES*.6, cz=c.z+f.z*LOD_PRES*.6;
  for(const s of M.soldats) s.ar.ecrire(s, cx, cz);
  for(const k in M.armees) M.armees[k].envoyer();
}
const TMP=new THREE.Vector3();

/* ---------- boucle ---------- */
function boucle(now){
  requestAnimationFrame(boucle);
  let dt=Math.min(.05,(now-dernierT)/1000); dernierT=now;
  if(ETAT==='jeu' && !M.fin){
    majSim(dt);
    if(J.role!=='superieur') majJoueur(dt);
    majMini(dt);
    if(AC){ let n=0; const c=camera.position; voisins(c.x,c.z,30,(o)=>{ if(o.cible&&o.etat>0) n++; }); ambiance(Math.min(1,n/60)); }
  } else if(ETAT==='jeu' && M.fin && J.mort){ majJoueur(dt); }
  majPoussiere(ETAT==='jeu'?dt:0);
  ecrireRendu();
  if(J.role!=='superieur'){ majArmes(dt); }
  if(!(ETAT==='brief'&&J.role!=='superieur')) majCamera(dt);
  if(ETAT==='jeu') majHUD();
  csm.update();
  composer.render();
}

/* ---------- briefing ---------- */
function montrerBrief(){
  const role=ROLES[J.role];
  if(J.role!=='superieur'){ construireArmes(); majCamera(0); }
  else majCamera(0);
  const touches = J.role==='superieur'
    ? `<li><kbd>clic</kbd> choisir une cohorte · <kbd>Maj+clic</kbd> en ajouter · <kbd>X</kbd> toute la légion</li>
       <li><kbd>clic droit</kbd> déplacer vers ce point · <kbd>G</kbd> faire face à l’ennemi</li>
       <li><kbd>1</kbd> tenir · <kbd>2</kbd> avancer · <kbd>3</kbd> pila · <kbd>4</kbd> charger · <kbd>5</kbd> reculer · <kbd>R</kbd> relève · <kbd>T</kbd> serrer</li>
       <li><kbd>ZQSD</kbd>/<kbd>WASD</kbd> déplacer la vue · <kbd>Q</kbd>/<kbd>E</kbd> tourner (A/E en AZERTY) · molette : zoom</li>`
    : `<li><kbd>souris</kbd> regarder · <kbd>ZQSD</kbd>/<kbd>WASD</kbd> marcher · <kbd>Maj</kbd> courir</li>
       <li><kbd>clic gauche</kbd> estoc · <kbd>clic droit</kbd> (maintenu) bouclier levé · <kbd>Espace</kbd> coup d’umbo · <kbd>F</kbd> lancer le pilum</li>
       ${J.role!=='soldat'?`<li><kbd>R</kbd> relève · <kbd>T</kbd> serrer les rangs${J.role==='centurion'?' · <kbd>1</kbd> tenir · <kbd>2</kbd> avancer · <kbd>3</kbd> pila · <kbd>4</kbd> charger · <kbd>5</kbd> reculer':''}</li>`:''}
       <li>Lis l’homme d’en face : quand il <b>arme son coup</b>, lève le bouclier — puis frappe pendant qu’il est découvert.</li>`;
  $('brief').innerHTML=`<div class="carte">
    <div class="sur">${SCN.an} av. J.-C. · ${SCN.lieu}</div>
    <h1>${SCN.n}</h1>
    <p>${SCN.brief}</p>
    <div class="role"><b>${RANGS[J.rang].n} — ${role.n}</b><span>${role.d}</span></div>
    <ul>${touches}<li><kbd>H</kbd> aide · <kbd>M</kbd> son · <kbd>Échap</kbd> pause</li></ul>
    ${J.camp?`<p class="avert">Bataille de campagne : ce que tu y perds, tu le perds pour de bon. On peut y mourir.</p>`:''}
    <button onclick="entrer()">Entrer en ligne</button></div>`;
  $('brief').hidden=false;
  $('hud').className='hud '+(J.role==='superieur'?'chef':'fps');
  $('aide').innerHTML=`<ul>${touches}</ul>`;
}

/* ---------- fin ---------- */
function finBataille(type){
  if(M.fin) return; M.fin=type; ETAT='fin';
  document.exitPointerLock&&document.exitPointerLock();
  const R=M.unites.filter(u=>u.side==='R'), E=M.unites.filter(u=>u.side==='E');
  const mR=R.reduce((a,u)=>a+u.morts,0), mE=E.reduce((a,u)=>a+u.morts,0);
  const fps=J.role!=='superieur';
  const disc=fps&&J.total?J.dans/J.total:1;
  const gagne=type==='victoire';
  const e={};
  const add=(k,n)=>{ n=Math.round(n); if(n) e[k]=(e[k]||0)+n; };
  if(fps){
    add('virtus', Math.min(12, J.tues*1.6 + J.parades*.25));
    add('disciplina', clamp((disc-.55)*14,-4,7));
    if(J.role!=='soldat') add('auctoritas', (J.unite.routing?-4:3) + (gagne?2:0));
    add('gratia', gagne?2:type==='defaite'?-1:0);
    const perte=Math.round(J.pv0-J.pv); if(perte) e.valetudo=-perte;
    if(J.lourd && J.pv>0) e.vulnus=1;
  } else {
    const leg=R.filter(u=>u.joueur), rompues=leg.filter(u=>u.routing).length;
    add('scientia', gagne?6:2); add('auctoritas', (gagne?5:0)-rompues*2); add('gratia', gagne?6:type==='defaite'?-4:0);
    e.valetudo=-Math.round(rand(2,6));
  }
  const titre={victoire:'Victoire',defaite:'Défaite',indecis:'Indécis',tombe:'Tombé'}[type];
  const perso = type==='tombe' ? 'Tu ne sais pas d’où est venu le coup. Le ciel, puis les sandales des autres.'
    : fps ? (J.unite.routing ? 'Ta cohorte a rompu. Tu en es sorti.' : 'Tu es encore debout quand la poussière retombe.')
    : (gagne ? 'Tes cohortes tiennent le champ.' : 'Tes cohortes n’ont pas suffi.');
  const histo={ bibracte:'Les Helvètes rejetés sur leurs chariots, la migration brisée. Sur trois cent soixante-huit mille partis, César dira qu’il en rentra cent dix mille.',
    pharsale:'Pompée rentre sous sa tente, puis s’enfuit vers l’Égypte, où on l’assassinera sur la plage.',
    munda:'Trente mille morts, dont Labienus. « J’ai souvent combattu pour la victoire ; à Munda, j’ai combattu pour ma vie. »' }[SCN===SCENARIOS.bibracte?'bibracte':SCN===SCENARIOS.pharsale?'pharsale':'munda'];
  const recit=`${perso}<br><br>${gagne?histo:'Ailleurs sur le champ, la journée a suivi son cours.'}`;
  const eff=Object.entries(e).filter(([k])=>k!=='vulnus').map(([k,v])=>`<span class="${v>0?'g':'p'}">${v>0?'+':''}${v} ${k[0].toUpperCase()+k.slice(1)}</span>`).join('')+(e.vulnus?'<span class="p">Blessure qui laissera une trace</span>':'');
  $('fin').innerHTML=`<div class="carte">
    <div class="sur">${SCN.n} · ${Math.floor(M.t/60)} min ${Math.floor(M.t%60)} s</div>
    <h1 class="${type}">${titre}</h1>
    <p>${recit}</p>
    <div class="bilan">
      ${fps?`<div><b>${J.tues}</b><span>abattus de ta main</span></div><div><b>${J.coups}</b><span>coups reçus</span></div><div><b>${J.parades}</b><span>coups parés</span></div><div><b>${Math.round(disc*100)} %</b><span>du temps dans le rang</span></div>`:''}
      <div><b>${mR}</b><span>morts romains</span></div><div><b>${mE}</b><span>morts ennemis</span></div>
    </div>
    <div class="eff">${eff}</div>
    ${J.camp?`<button onclick="retourCampagne()">${J.pv<=0?'Voir la pierre':'Retour au camp'}</button>`
            :`<button onclick="location.reload()">Rejouer</button><button class="sombre" onclick="location.href=location.pathname">Une autre bataille</button>`}
  </div>`;
  $('fin').hidden=false;
  J.resultat={ e, recit, issue:titre, mort:J.pv<=0&&fps };
}
function retourCampagne(){
  try{ localStorage.setItem('legio_acies_res', JSON.stringify({ ev:SCN.ev, ...J.resultat })); }catch(e){}
  location.href='index.html';
}

/* ---------- menu ---------- */
function menu(){
  const q=new URLSearchParams(location.search);
  if(q.get('b') && SCENARIOS[q.get('b')]){
    let st=null, rang=+q.get('g')||1, nom='', camp=false;
    if(q.get('camp')){ try{ const S=JSON.parse(localStorage.getItem('cvrsvs_v3')); if(S){ st=S.s; rang=S.rank; nom=S.nom; camp=true; } }catch(e){} }
    if(!st) st={ virtus:50, disciplina:50, scientia:40, auctoritas:45, gratia:40, valetudo:100 };
    return demarrer(q.get('b'), rang, st, nom, camp);
  }
  let g=1;
  const rendreMenu=()=>{
    $('menu').innerHTML=`<div class="carte">
      <div class="sur">Legio X Equestris</div><h1>Acies</h1>
      <p>Une bataille en temps réel, en trois dimensions. Des milliers d’hommes sur le terrain, chacun se bat pour lui — et ton grade décide de ta place.</p>
      <div class="grades">${[1,4,5,7].map(r=>`<button class="${r===g?'on':''}" data-g="${r}"><b>${RANGS[r].n}</b><span>${ROLES[RANGS[r].p].n}</span></button>`).join('')}</div>
      <p class="role-d">${ROLES[RANGS[g].p].d}</p>
      <div class="batailles">${Object.entries(SCENARIOS).map(([k,s])=>`<button data-b="${k}"><b>${s.n}</b><span>${s.an} av. J.-C. · ${s.lieu}</span><em>contre ${s.ennemi==='gaulois'?'les Gaulois':'les légions de Pompée'}</em></button>`).join('')}</div>
      <a class="retour" href="index.html">‹ Retour à la carrière</a></div>`;
    $('menu').querySelectorAll('[data-g]').forEach(b=>b.onclick=()=>{ g=+b.dataset.g; rendreMenu(); });
    $('menu').querySelectorAll('[data-b]').forEach(b=>b.onclick=()=>{
      const st={ soldat:{virtus:50,disciplina:52,scientia:36,auctoritas:40,gratia:36,valetudo:100}, sousoff:{virtus:60,disciplina:58,scientia:46,auctoritas:60,gratia:55,valetudo:100},
                 centurion:{virtus:66,disciplina:60,scientia:56,auctoritas:70,gratia:66,valetudo:100}, superieur:{virtus:72,disciplina:64,scientia:74,auctoritas:80,gratia:80,valetudo:100} }[RANGS[g].p];
      demarrer(b.dataset.b, g, st, '', false); });
  };
  rendreMenu();
}
/* acies.js est injecté par le module qui charge three.js : quand il s'exécute,
   DOMContentLoaded est déjà passé. */
if(document.readyState==='loading') addEventListener('DOMContentLoaded', menu); else menu();
