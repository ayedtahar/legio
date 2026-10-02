/* ===== src3d/noyau.js ===== */
/* ============================================================
   LEGIO — ACIES : la bataille en temps réel
   noyau : outils, bruit, scénarios
   Repère : x latéral, z profondeur, y hauteur (mètres).
   Les Romains font face aux z négatifs.
   ============================================================ */
'use strict';
const rand=(a,b)=>a+Math.random()*(b-a);
const clamp=(v,a=0,b=1)=>Math.max(a,Math.min(b,v));
const lerp=(a,b,t)=>a+(b-a)*t;
const pick=(a)=>a[Math.floor(Math.random()*a.length)];
const angDiff=(a,b)=>{ let d=b-a; while(d>Math.PI) d-=2*Math.PI; while(d<-Math.PI) d+=2*Math.PI; return d; };
const sigm=(x)=>1/(1+Math.exp(-x));

/* bruit de valeur 2D, déterministe */
function hash2(x,y){ let h=x*374761393+y*668265263; h=(h^(h>>>13))*1274126177; return ((h^(h>>>16))>>>0)/4294967295; }
function bruit(x,y){
  const xi=Math.floor(x), yi=Math.floor(y), xf=x-xi, yf=y-yi;
  const u=xf*xf*(3-2*xf), v=yf*yf*(3-2*yf);
  const a=hash2(xi,yi), b=hash2(xi+1,yi), c=hash2(xi,yi+1), d=hash2(xi+1,yi+1);
  return lerp(lerp(a,b,u),lerp(c,d,u),v);
}
function fbm(x,y,o=4){ let s=0,a=.5,f=1; for(let i=0;i<o;i++){ s+=a*bruit(x*f,y*f); f*=2.03; a*=.5; } return s; }

/* ---------- les batailles ----------
   relief(x,z) : hauteur du terrain
   romains : position de la ligne · ennemis : bandes ou cohortes adverses
   evenements : ce qui arrive en cours de bataille */
const SCENARIOS={
bibracte:{
  n:'Bibracte', an:58, ev:'Bibracte', lieu:'Pente au-dessus de la plaine éduenne',
  ennemi:'gaulois', saison:'ete', ciel:'kloofendal_48d_partly_cloudy_puresky_2k.hdr',
  brief:'Les Helvètes montent vers vous en phalange, boucliers imbriqués. César a fait renvoyer tous les chevaux, à commencer par le sien : que nul n’ait d’espoir dans la fuite. Vous tenez la pente.',
  relief:(x,z)=> 22*sigm((z-30)/42) + 9*Math.exp(-((x+380)**2+(z+260)**2)/90000) + 3*fbm(x*.006+3,z*.006+7) - 1.5,
  soleil:{ az:-.9, el:.42 }, brume:.0011,
  romains:{ z:46, legions:2 },
  ennemis:{ type:'gaulois', z:-55, bandes:12, rangs:2 },
  evenements:[
    { t:95, type:'flanc', x:300, z:-10, bandes:5, msg:['Boii et Tulingi !','Quinze mille Boïens et Tulinges tombent sur le flanc droit.'] }
  ],
  duree:480 },
pharsale:{
  n:'Pharsale', an:48, ev:'Pharsale — la quatrième ligne', lieu:'Plaine de l’Énipeus, Thessalie',
  ennemi:'pompeien', saison:'sec', ciel:'kloofendal_43d_clear_puresky_2k.hdr',
  brief:'En face, les légions de Pompée — des Romains, armés comme vous. Elles ont reçu l’ordre de ne pas bouger et d’attendre votre charge : vous aurez deux fois la distance à courir. Les vétérans savent qu’il faut s’arrêter à mi-course pour reprendre son souffle.',
  relief:(x,z)=> 2.2*fbm(x*.004,z*.004) + 6*Math.exp(-((x-500)**2+(z+420)**2)/160000),
  soleil:{ az:.7, el:.55 }, brume:.0013,
  romains:{ z:50, legions:2 },
  ennemis:{ type:'pompeien', z:-50, legions:2, attend:true },
  evenements:[],
  duree:480 },
munda:{
  n:'Munda', an:45, ev:'Munda', lieu:'Bétique, sous la colline',
  ennemi:'pompeien', saison:'sec', ciel:'qwantani_afternoon_puresky_2k.hdr',
  brief:'Ils tiennent la hauteur et n’ont nulle part où aller : des vétérans, des transfuges, des proscrits sans pardon possible. Il faudra monter, et pousser. César a mis pied à terre.',
  relief:(x,z)=> 26*sigm((-z-40)/38) + 3*fbm(x*.005+11,z*.005+5) + 12*Math.exp(-((x+420)**2+(z+380)**2)/120000),
  soleil:{ az:.3, el:.32 }, brume:.0014,
  romains:{ z:45, legions:2 },
  ennemis:{ type:'pompeien', z:-45, legions:2, attend:true, fort:true },
  evenements:[],
  duree:480 }
};

/* ---------- grades ---------- */
const RANGS=[
  { n:'Tiro', p:'soldat' },{ n:'Miles Gregarius', p:'soldat' },{ n:'Immunis', p:'soldat' },{ n:'Tesserarius', p:'soldat' },
  { n:'Optio', p:'sousoff' },{ n:'Centurio', p:'centurion' },{ n:'Pilus Prior', p:'centurion' },
  { n:'Primus Pilus', p:'superieur' },{ n:'Praefectus Fabrum', p:'superieur' }
];
const ROLES={
  soldat:   { n:'Au rang',          d:'Tu es un homme du premier rang. Tu vois l’homme d’en face, tes deux voisins, et rien d’autre.' },
  sousoff:  { n:'Optio',            d:'Tu combats dans le rang et tu tiens la cohorte : la relève et le serrement des rangs sont à toi.' },
  centurion:{ n:'Centurion',        d:'Tu combats au premier rang et ta cohorte manœuvre à ta voix.' },
  superieur:{ n:'Primipile',        d:'Tu vois toute la légion d’en haut et tu disposes de ses dix cohortes.' }
};

/* ===== src3d/ressources.js ===== */
/* ============================================================
   RESSOURCES — ciel HDRI et sols photographiques
   Tout vient de Poly Haven, en CC0 : voir fetch-assets.sh.
   Les fichiers sont lus par le réseau, donc la page doit être
   servie en http:// — un file:// se heurte à la politique
   d'origine du navigateur. Voir serve.sh.
   ============================================================ */
const RES={ ciel:null, ibl:null, sol:null, horizon:null, pret:false };

/* La brume doit avoir la couleur du ciel qu'on lui a donné, sinon le lointain
   se décolle du fond. On relève donc la bande d'horizon du panorama. */
function couleurHorizon(hdr){
  const { data, width, height }=hdr.image;
  /* le panorama arrive en demi-flottants : les flottants simples ne se filtrent
     pas partout, on garde donc le format d'origine et on décode à la main. */
  const demi=hdr.type===THREE.HalfFloatType;
  const v=(i)=>demi?THREE.DataUtils.fromHalfFloat(data[i]):data[i];
  let r=0,g=0,b=0,n=0;
  for(let y=Math.floor(height*.46); y<Math.floor(height*.54); y++)
    for(let x=0;x<width;x+=3){ const i=(y*width+x)*4; r+=v(i); g+=v(i+1); b+=v(i+2); n++; }
  r/=n; g/=n; b/=n;
  /* approximation du rendu : compression des hautes lumières puis gamma */
  const f=(v)=>Math.pow(v/(1+v),1/2.2);
  return new THREE.Color(f(r),f(g),f(b));
}

function chargerRessources(sc, pret, avance){
  creerRenderer();
  const max=renderer.capabilities.getMaxAnisotropy();
  const gest=new THREE.LoadingManager();
  let n=0; const total=7;
  gest.onProgress=()=>avance && avance(Math.min(1,++n/total));

  const tl=new THREE.TextureLoader(gest);
  const carte=(f,srgb)=>{
    const t=tl.load('assets/sol/'+f);
    t.wrapS=t.wrapT=THREE.RepeatWrapping;
    t.anisotropy=max;
    if(srgb) t.colorSpace=THREE.SRGBColorSpace;
    return t;
  };
  /* arm = occlusion ambiante (R), rugosité (V), métal (B) en une seule image */
  RES.sol={
    herbe:{ map:carte('aerial_grass_rock_diff_2k.jpg',true), nor:carte('aerial_grass_rock_nor_gl_2k.jpg'), arm:carte('aerial_grass_rock_arm_2k.jpg') },
    terre:{ map:carte('brown_mud_dry_diff_2k.jpg',true),     nor:carte('brown_mud_dry_nor_gl_2k.jpg'),     arm:carte('brown_mud_dry_arm_2k.jpg') }
  };

  new RGBELoader(gest).load('assets/ciel/'+sc.ciel,(hdr)=>{
    hdr.mapping=THREE.EquirectangularReflectionMapping;
    RES.ciel=hdr;
    RES.horizon=couleurHorizon(hdr);
    const pm=new THREE.PMREMGenerator(renderer);
    pm.compileEquirectangularShader();
    RES.ibl=pm.fromEquirectangular(hdr).texture;
    pm.dispose();
  });

  gest.onLoad=()=>{ RES.pret=true; pret(); };
  gest.onError=(u)=>{ console.warn('ressource manquante :',u); };
}

/* Répétition des cartes du sol : une tuile tous les T mètres. */
function tuiler(set,T,etendue){
  const r=etendue/T;
  for(const k in set){ set[k].repeat.set(r,r); set[k].needsUpdate=true; }
}

/* ===== src3d/monde.js ===== */
/* ============================================================
   MONDE — relief, ciel, lumière, végétation, poussière
   ============================================================ */
let renderer, scene, camera, SC, H, csm, composer, passeFXAA;
const SOLEIL=new THREE.Vector3();

/* Le soleil projette ses ombres par cascades : une carte serrée près de l'œil,
   une plus large au loin. Sans quoi, à l'échelle d'un champ de bataille, soit
   l'ombre est grossière de près, soit elle s'arrête à vingt pas.
   CSM remplace onBeforeCompile ; on enchaîne pour garder le nôtre. */
function ombre(m){
  const mien=m.onBeforeCompile;
  csm.setupMaterial(m);
  const sien=m.onBeforeCompile;
  m.onBeforeCompile=function(sh,r){ sien.call(this,sh,r); if(mien) mien.call(this,sh,r); };
  return m;
}

const NEUTRE=new THREE.Color(1,1,1);
const PALETTES={
  ete:{ herbe:['#4E6B2C','#5D7A31','#6B8538','#4A5F27','#7A8A3E'], terre:'#6B5634', ciel:'#5D8FC9', horizon:'#D9D2BD', brume:'#C9C3AE', monts:'#6F7C8C', arbre:['#2F4A1F','#3A5626','#46602C'] },
  sec:{ herbe:['#8C8048','#9A8C50','#A69858','#7F7442','#B0A162'], terre:'#8A7048', ciel:'#6E9BCF', horizon:'#E6D9BC', brume:'#D8CCB0', monts:'#8A8578', arbre:['#4C5A2E','#5A6634','#66703A'] }
};

function creerRenderer(){
  if(renderer) return renderer;
  /* pas d'antialias matériel : la chaîne de post-traitement rend hors écran,
     et c'est la passe FXAA qui adoucit les bords. */
  renderer=new THREE.WebGLRenderer({ antialias:false, powerPreference:'high-performance' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,1.5));
  renderer.setSize(innerWidth,innerHeight);
  renderer.toneMapping=THREE.ACESFilmicToneMapping; renderer.toneMappingExposure=.95;
  renderer.shadowMap.enabled=true; renderer.shadowMap.type=THREE.PCFSoftShadowMap;
  document.getElementById('scene').appendChild(renderer.domElement);
  return renderer;
}

function initMonde(sc){
  SC=sc; H=sc.relief;
  creerRenderer();
  scene=new THREE.Scene();
  const pal=PALETTES[sc.saison];
  scene.fog=new THREE.FogExp2(RES.horizon||new THREE.Color(pal.brume), sc.brume);
  camera=new THREE.PerspectiveCamera(70, innerWidth/innerHeight, .08, 5000);
  scene.add(camera);

  const s=sc.soleil; SOLEIL.set(Math.sin(s.az)*Math.cos(s.el), Math.sin(s.el), Math.cos(s.az)*Math.cos(s.el)).normalize();

  /* Le panorama photographique sert deux fois : fond de ciel, et lumière
     d'ambiance. C'est lui qui donne aux bronzes et aux cuirs leur matière —
     une HemisphereLight ne sait pas faire ça. */
  if(RES.ciel){ scene.background=RES.ciel; }
  else scene.background=new THREE.Color(pal.horizon);
  /* Le ciel sert de lumière d'appoint, pas de lumière principale : à pleine
     intensité il remplit les ombres et le champ devient plat. */
  if(RES.ibl){ scene.environment=RES.ibl; scene.environmentIntensity=.3; }

  /* Le soleil est bas sur l'horizon : au sol, son cosinus d'incidence vaut à
     peine 0,4. À intensité comparable, le ciel l'emporte et l'ombre s'efface —
     il faut donc le pousser bien au-delà pour que l'ombre existe. */
  csm=new CSM({ parent:scene, camera, cascades:3, maxFar:340, mode:'practical',
    shadowMapSize:2048, lightDirection:SOLEIL.clone().negate(), lightIntensity:7.5/Math.max(.35,Math.sin(s.el)+.2),
    lightFar:2500, lightMargin:260, shadowBias:-0.00035 });
  csm.fade=true;
  for(const l of csm.lights) l.color.set(0xFFF1DA);

  if(!RES.ciel) ciel(pal);
  terrain(pal); monts(pal); vegetation(pal);
  initPoussiere(); initTraits();
  initComposer();
  addEventListener('resize',redimensionner);
}

function initComposer(){
  composer=new EffectComposer(renderer);
  composer.addPass(new RenderPass(scene,camera));
  /* un voile léger sur les métaux au soleil, pas un halo de néon */
  composer.addPass(new UnrealBloomPass(new THREE.Vector2(innerWidth,innerHeight), .10, .6, 1.05));
  composer.addPass(new OutputPass());
  passeFXAA=new ShaderPass(FXAAShader);
  composer.addPass(passeFXAA);
  majTaille();
}
function majTaille(){
  const r=renderer.getPixelRatio();
  composer.setSize(innerWidth,innerHeight);
  passeFXAA.material.uniforms.resolution.value.set(1/(innerWidth*r),1/(innerHeight*r));
}
function redimensionner(){
  camera.aspect=innerWidth/innerHeight; camera.updateProjectionMatrix();
  renderer.setSize(innerWidth,innerHeight);
  majTaille();
  if(csm) csm.updateFrustums();
}

function ciel(pal){
  const g=new THREE.SphereGeometry(4000,32,16);
  const m=new THREE.ShaderMaterial({ side:THREE.BackSide, depthWrite:false, fog:false,
    uniforms:{ zen:{value:new THREE.Color(pal.ciel)}, hor:{value:new THREE.Color(pal.horizon)}, sol:{value:SOLEIL} },
    vertexShader:`varying vec3 vd; void main(){ vd=normalize(position); gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.); }`,
    fragmentShader:`uniform vec3 zen,hor,sol; varying vec3 vd;
      void main(){ float e=max(vd.y,0.); vec3 c=mix(hor,zen,pow(e,.55));
        float s=max(dot(vd,sol),0.); c+=vec3(1.,.85,.6)*(pow(s,600.)*4.+pow(s,12.)*.25);
        c=mix(c,hor*.85,smoothstep(0.,-.15,vd.y));
        gl_FragColor=vec4(c,1.);
        #include <colorspace_fragment>
      }` });
  const sk=new THREE.Mesh(g,m); sk.renderOrder=-1; scene.add(sk);
  camera.userData.ciel=sk;
}

function terrain(pal){
  const T=1800, N=260;
  const g=new THREE.PlaneGeometry(T,T,N,N); g.rotateX(-Math.PI/2);
  const p=g.attributes.position, col=new Float32Array(p.count*3), mel=new Float32Array(p.count);
  const herbes=pal.herbe.map(c=>new THREE.Color(c)), c=new THREE.Color();
  for(let i=0;i<p.count;i++){
    const x=p.getX(i), z=p.getZ(i), y=H(x,z); p.setY(i,y);
    /* la teinte reste peinte à la main : c'est elle qui donne à la Gaule son vert
       et à la Bétique son jaune, par-dessus la même photographie d'herbe. */
    const n=fbm(x*.01+40,z*.01+40,3), n2=bruit(x*.08,z*.08);
    const k=Math.floor(clamp(n,0,.999)*herbes.length);
    c.copy(herbes[k]).lerp(herbes[(k+1)%herbes.length], n2*.5);
    /* la teinte vient multiplier une photographie déjà sombre : on la ramène
       autour de 1 pour qu'elle colore sans éteindre. */
    c.lerp(NEUTRE,.38).multiplyScalar(2.05);
    col[i*3]=c.r; col[i*3+1]=c.g; col[i*3+2]=c.b;
    /* la terre nue affleure sur les pentes et par plaques */
    const pente=Math.abs(H(x+2,z)-H(x-2,z))+Math.abs(H(x,z+2)-H(x,z-2));
    mel[i]=clamp(pente*.22 + Math.max(0,fbm(x*.02+9,z*.02+2)-.60)*1.9, 0, .92);
  }
  g.setAttribute('color', new THREE.BufferAttribute(col,3));
  g.setAttribute('melange', new THREE.BufferAttribute(mel,1));
  g.computeVertexNormals();

  const S=RES.sol, h=S.herbe, t=S.terre;
  tuiler(h,6,T); tuiler(t,6,T);
  const m=new THREE.MeshStandardMaterial({
    vertexColors:true, map:h.map, normalMap:h.nor, aoMap:h.arm, roughnessMap:h.arm,
    metalness:0, roughness:1, normalScale:new THREE.Vector2(1.15,1.15) });

  m.onBeforeCompile=(sh)=>{
    sh.uniforms.terreMap={ value:t.map };
    sh.uniforms.terreArm={ value:t.arm };
    sh.vertexShader=sh.vertexShader
      .replace('#include <common>','#include <common>\nattribute float melange;\nvarying float vMel;')
      .replace('#include <begin_vertex>','#include <begin_vertex>\nvMel=melange;');
    sh.fragmentShader=sh.fragmentShader
      .replace('#include <common>','#include <common>\nuniform sampler2D terreMap;\nuniform sampler2D terreArm;\nvarying float vMel;')
      /* La tuile se répète tous les six mètres et le damier se voit de loin. On
         relit donc la même image à une autre échelle, pivotée d'un quart de tour
         et décalée : les deux grilles ne coïncident plus et le motif se perd. */
      .replace('#include <map_fragment>',`
        vec2 uvB=vMapUv.yx*0.1737+vec2(0.37,0.11);
        vec4 hA=texture2D(map,vMapUv), hB=texture2D(map,uvB);
        vec4 tA=texture2D(terreMap,vMapUv), tB=texture2D(terreMap,uvB);
        vec4 solC=mix(mix(hA,hB,0.38), mix(tA,tB,0.38), vMel);
        diffuseColor*=solC;`)
      .replace('#include <roughnessmap_fragment>',`
        float roughnessFactor=roughness*mix(texture2D(roughnessMap,vRoughnessMapUv).g, texture2D(terreArm,vRoughnessMapUv).g, vMel);`)
      .replace('#include <aomap_fragment>',`
        float ao=mix(texture2D(aoMap,vAoMapUv).r, texture2D(terreArm,vAoMapUv).r, vMel);
        reflectedLight.indirectDiffuse*=(ao-1.0)*aoMapIntensity+1.0;`);
  };

  const sol=new THREE.Mesh(g,ombre(m));
  sol.receiveShadow=true;
  scene.add(sol);
}

function monts(pal){
  const g=new THREE.CylinderGeometry(2600,2600,1,96,6,true), p=g.attributes.position;
  for(let i=0;i<p.count;i++){
    const x=p.getX(i), z=p.getZ(i), a=Math.atan2(z,x), y0=p.getY(i);
    const h= y0>0 ? 60+260*fbm(Math.cos(a)*3+5, Math.sin(a)*3+5, 5) : -40;
    p.setY(i,h);
  }
  g.computeVertexNormals();
  /* les lointains ne reçoivent pas d'ombre : ils sont au-delà des cascades */
  const m=new THREE.MeshStandardMaterial({ color:new THREE.Color(pal.monts).multiplyScalar(.5), side:THREE.BackSide, roughness:1, metalness:0 });
  scene.add(new THREE.Mesh(g,m));
}

function vegetation(pal){
  /* touffes d'herbe et de chaumes, en triangles croisés */
  const tg=new THREE.BufferGeometry(), pos=[], cl=[];
  for(let k=0;k<3;k++){ const a=k*Math.PI/3, cx=Math.cos(a)*.18, cz=Math.sin(a)*.18;
    pos.push(-cx*.6,0,-cz*.6, cx*.6,0,cz*.6, cx*.2,.36,cz*.2);
    cl.push(.62,.62,.55, .62,.62,.55, 1.0,.98,.8); }
  tg.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));
  tg.setAttribute('color',new THREE.Float32BufferAttribute(cl,3)); tg.computeVertexNormals();
  const N=90000, herbe=new THREE.InstancedMesh(tg,ombre(new THREE.MeshStandardMaterial({vertexColors:true, side:THREE.DoubleSide, roughness:.92, metalness:0})),N);
  herbe.receiveShadow=true;
  const M=new THREE.Matrix4(), q=new THREE.Quaternion(), e=new THREE.Euler(), sc=new THREE.Vector3(), pp=new THREE.Vector3(), c=new THREE.Color();
  const herbes=pal.herbe.map(x=>new THREE.Color(x));
  for(let i=0;i<N;i++){
    const r=Math.sqrt(Math.random())*520, a=Math.random()*Math.PI*2, x=Math.cos(a)*r, z=Math.sin(a)*r*1.1;
    pp.set(x,H(x,z),z); e.set(rand(-.15,.15),Math.random()*6.3,rand(-.15,.15)); q.setFromEuler(e);
    const s=rand(.45,1.1); sc.set(s*1.4,s*rand(.5,1.1),s*1.4);
    M.compose(pp,q,sc); herbe.setMatrixAt(i,M);
    herbe.setColorAt(i, c.copy(pick(herbes)).multiplyScalar(rand(.85,1.25)));
  }
  herbe.frustumCulled=false; scene.add(herbe);

  /* bois et bosquets : plus denses en Gaule, épars au sud */
  const nb=SC.saison==='ete'?900:320;
  const tronc=new THREE.CylinderGeometry(.18,.32,1,6); tronc.translate(0,.5,0);
  const houp=new THREE.IcosahedronGeometry(1,1);
  const T=new THREE.InstancedMesh(tronc,ombre(new THREE.MeshStandardMaterial({color:0x4A3826, roughness:.95, metalness:0})),nb);
  const F=new THREE.InstancedMesh(houp,ombre(new THREE.MeshStandardMaterial({color:0xffffff, flatShading:true, roughness:.9, metalness:0})),nb);
  T.castShadow=F.castShadow=true; T.receiveShadow=F.receiveShadow=true;
  const arbres=pal.arbre.map(x=>new THREE.Color(x));
  let i=0, essais=0;
  while(i<nb && essais++<nb*30){
    const cx=rand(-850,850), cz=rand(-850,850);
    const bois=fbm(cx*.004+17,cz*.004+3,3);
    if(bois<(SC.saison==='ete'?.52:.6)) continue;
    if(Math.abs(cx)<420 && cz>-260 && cz<220) continue; /* le champ de bataille reste dégagé */
    const y=H(cx,cz), h=rand(4,9)*(SC.saison==='ete'?1.2:.8);
    pp.set(cx,y,cz); q.identity(); sc.set(1,h*.55,1); M.compose(pp,q,sc); T.setMatrixAt(i,M);
    pp.set(cx,y+h*.55+h*.28,cz); e.set(0,Math.random()*6,0); q.setFromEuler(e);
    const w=h*rand(.32,.45); sc.set(w,h*.36,w); M.compose(pp,q,sc); F.setMatrixAt(i,M);
    F.setColorAt(i,c.copy(pick(arbres)).multiplyScalar(rand(.8,1.15)));
    i++;
  }
  T.count=F.count=i; scene.add(T,F);
}

/* ---------- poussière et sang ---------- */
let POUSS;
function texRonde(){
  const cv=document.createElement('canvas'); cv.width=cv.height=64;
  const x=cv.getContext('2d'), g=x.createRadialGradient(32,32,0,32,32,32);
  g.addColorStop(0,'rgba(255,255,255,1)'); g.addColorStop(.5,'rgba(255,255,255,.45)'); g.addColorStop(1,'rgba(255,255,255,0)');
  x.fillStyle=g; x.fillRect(0,0,64,64);
  const t=new THREE.CanvasTexture(cv); return t;
}
function initPoussiere(){
  const N=2600, g=new THREE.BufferGeometry();
  const pos=new Float32Array(N*3), col=new Float32Array(N*3), siz=new Float32Array(N);
  g.setAttribute('position',new THREE.BufferAttribute(pos,3).setUsage(THREE.DynamicDrawUsage));
  g.setAttribute('color',new THREE.BufferAttribute(col,3).setUsage(THREE.DynamicDrawUsage));
  g.setAttribute('taille',new THREE.BufferAttribute(siz,1).setUsage(THREE.DynamicDrawUsage));
  const m=new THREE.PointsMaterial({ size:1, map:texRonde(), transparent:true, depthWrite:false, vertexColors:true, opacity:.55, sizeAttenuation:true });
  m.onBeforeCompile=(sh)=>{
    sh.vertexShader=sh.vertexShader.replace('uniform float size;','uniform float size; attribute float taille;')
      .replace('gl_PointSize = size;','gl_PointSize = size*taille;');
  };
  const pts=new THREE.Points(g,m); pts.frustumCulled=false; scene.add(pts);
  POUSS={ N, pos, col, siz, g, vie:new Float32Array(N), v:new Float32Array(N*3), k:0, tailleMax:new Float32Array(N) };
  for(let i=0;i<N;i++) pos[i*3+1]=-999;
}
const C_POUSS=new THREE.Color('#B9A47E'), C_SANG=new THREE.Color('#5A0E0A');
function poussiere(x,y,z,force=1,sang=false){
  const P=POUSS, i=P.k=(P.k+1)%P.N;
  P.pos[i*3]=x+rand(-.4,.4); P.pos[i*3+1]=y+(sang?1.2:.2); P.pos[i*3+2]=z+rand(-.4,.4);
  const c=sang?C_SANG:C_POUSS;
  P.col[i*3]=c.r; P.col[i*3+1]=c.g; P.col[i*3+2]=c.b;
  P.vie[i]=sang?.7:rand(2.5,4.5);
  P.tailleMax[i]=sang?.35:rand(2.5,5)*force;
  P.v[i*3]=rand(-.5,.5)*(sang?3:1); P.v[i*3+1]=sang?rand(.5,2):rand(.3,.9); P.v[i*3+2]=rand(-.5,.5)*(sang?3:1);
}
function majPoussiere(dt){
  const P=POUSS;
  for(let i=0;i<P.N;i++){
    if(P.vie[i]<=0) continue;
    P.vie[i]-=dt;
    if(P.vie[i]<=0){ P.pos[i*3+1]=-999; continue; }
    P.pos[i*3]+=P.v[i*3]*dt; P.pos[i*3+1]+=P.v[i*3+1]*dt; P.pos[i*3+2]+=P.v[i*3+2]*dt;
    if(P.tailleMax[i]<1) P.v[i*3+1]-=9*dt;
    const t=P.vie[i]; P.siz[i]=P.tailleMax[i]*(P.tailleMax[i]<1?1:clamp(t*.6,0,1)*(1.4-t*.12));
  }
  P.g.attributes.position.needsUpdate=true; P.g.attributes.color.needsUpdate=true; P.g.attributes.taille.needsUpdate=true;
}

/* ---------- pila et javelots en vol ---------- */
let TRAITS;
function initTraits(){
  const g=new THREE.CylinderGeometry(.018,.018,2.0,4); g.rotateX(Math.PI/2);
  const pointe=new THREE.ConeGeometry(.03,.25,4); pointe.rotateX(Math.PI/2); pointe.translate(0,0,1.1);
  const mesh=new THREE.InstancedMesh(mergeGeo([g,pointe]), ombre(new THREE.MeshStandardMaterial({color:0x8A7652, roughness:.72, metalness:.15})), 700);
  mesh.frustumCulled=false; mesh.castShadow=true; scene.add(mesh);
  TRAITS={ mesh, l:[] };
  const M=new THREE.Matrix4().makeTranslation(0,-999,0); for(let i=0;i<700;i++) mesh.setMatrixAt(i,M);
}
function mergeGeo(list){
  const pos=[], nor=[];
  for(const g0 of list){ const g=g0.index?g0.toNonIndexed():g0;
    pos.push(...g.attributes.position.array); nor.push(...g.attributes.normal.array); }
  const g=new THREE.BufferGeometry();
  g.setAttribute('position',new THREE.Float32BufferAttribute(pos,3)); g.setAttribute('normal',new THREE.Float32BufferAttribute(nor,3));
  return g;
}

/* ===== src3d/soldats.js ===== */
/* ============================================================
   SOLDATS — modèles construits pièce à pièce, rendus par instances.
   Chaque homme : position, cap, chute, pas, coup, bouclier — animés
   dans le shader, pour que des milliers bougent à la fois.
   pièce : 0 corps · 1 jambe g · 2 jambe d · 3 bras armé · 4 bouclier
   teinte : 0 fixe · 1 tunique (iTint) · 2 bouclier (iTint2)
   ============================================================ */
/* matière : ce qui décide si une pièce réfléchit le ciel ou l'absorbe.
   C'est elle, plus que la forme, qui sépare un bronze d'une laine. */
const M_CHAIR=0, M_LAINE=1, M_CUIR=2, M_FER=3, M_BRONZE=4, M_BOIS=5;

function piece(geo, col, part=0, tint=0, mat=M_LAINE){
  return { g:geo.index?geo.toNonIndexed():geo, col:new THREE.Color(col), part, tint, mat };
}
const bx=(w,h,d,x,y,z)=>new THREE.BoxGeometry(w,h,d).translate(x,y,z);
const cy=(rt,rb,h,x,y,z,s=8)=>new THREE.CylinderGeometry(rt,rb,h,s).translate(x,y,z);
const sp=(r,x,y,z,s=8)=>new THREE.SphereGeometry(r,s,Math.max(5,s*.6|0)).translate(x,y,z);

function assembler(pieces){
  const pos=[], nor=[], col=[], part=[], tint=[], mat=[];
  for(const p of pieces){
    const a=p.g.attributes, n=a.position.count;
    pos.push(...a.position.array); nor.push(...a.normal.array);
    for(let i=0;i<n;i++){ col.push(p.col.r,p.col.g,p.col.b); part.push(p.part); tint.push(p.tint); mat.push(p.mat); }
  }
  const g=new THREE.BufferGeometry();
  g.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));
  g.setAttribute('normal',new THREE.Float32BufferAttribute(nor,3));
  g.setAttribute('color',new THREE.Float32BufferAttribute(col,3));
  g.setAttribute('part',new THREE.Float32BufferAttribute(part,1));
  g.setAttribute('tintable',new THREE.Float32BufferAttribute(tint,1));
  g.setAttribute('matiere',new THREE.Float32BufferAttribute(mat,1));
  return g;
}

const PEAU='#B98A66', BLANC='#ECE6DC', BRONZE='#A07E3C', FER='#C4C4C8', CUIR='#4A321C';

function modeleLegionnaire(crete){
  const P=[];
  /* jambes : caliga, mollet, cuisse. Des troncs de cône plutôt que des boîtes :
     c'est le galbe qui fait qu'un homme n'est pas un jouet. */
  for(const [s,part] of [[-1,1],[1,2]]){
    P.push(piece(bx(.115,.07,.24,s*.09,.035,.03),CUIR,part,0,M_CUIR));
    P.push(piece(cy(.052,.075,.42,s*.09,.28,0,7),PEAU,part,0,M_CHAIR));
    P.push(piece(cy(.078,.062,.38,s*.09,.65,0,7),PEAU,part,0,M_CHAIR));
    /* lanières de la caliga : trois traits sombres qui rompent la jambe nue */
    for(let k=0;k<3;k++) P.push(piece(cy(.056+k*.004,.056+k*.004,.022,s*.09,.13+k*.08,0,7),CUIR,part,0,M_CUIR));
  }
  P.push(piece(cy(.2,.27,.34,0,.9,0,12),BLANC,0,1,M_LAINE));
  /* pteruges : les lanières de cuir qui battent sous la cotte. Elles cassent la
     silhouette en tonneau, et c'est ce qu'on reconnaît d'un légionnaire de loin. */
  for(let i=0;i<10;i++){ const a=i/10*Math.PI*2;
    P.push(piece(bx(.075,.17,.028,Math.cos(a)*.205,1.0,Math.sin(a)*.205),CUIR,0,0,M_CUIR)); }
  P.push(piece(cy(.208,.208,.06,0,1.09,0,12),CUIR,0,0,M_CUIR));
  P.push(piece(cy(.185,.225,.44,0,1.33,0,12),'#6E6C68',0,0,M_FER));
  /* épaulières, puis l'épaule elle-même : sans elle, le bras part d'un trou et
     le buste reste un tonneau. Le pivot du bras est à x=±.27, y=1.45. */
  P.push(piece(cy(.222,.2,.09,0,1.49,0,12),'#64625E',0,0,M_FER));
  for(const s of [-1,1]) P.push(piece(sp(.108,s*.2,1.45,0,8),'#64625E',0,0,M_FER));
  P.push(piece(cy(.062,.062,.09,0,1.58,0,8),PEAU,0,0,M_CHAIR));
  P.push(piece(cy(.088,.088,.055,0,1.555,0,10),'#8E2016',0,0,M_LAINE));
  P.push(piece(sp(.105,0,1.67,.01),PEAU,0,0,M_CHAIR));
  /* la galea : calotte, bourrelet frontal, couvre-nuque incliné, couvre-joues */
  P.push(piece(new THREE.SphereGeometry(.128,14,8,0,Math.PI*2,0,Math.PI/2).translate(0,1.685,0),BRONZE,0,0,M_BRONZE));
  P.push(piece(cy(.131,.134,.034,0,1.678,0,14),BRONZE,0,0,M_BRONZE));
  P.push(piece(new THREE.BoxGeometry(.235,.028,.14).rotateX(.55).translate(0,1.628,-.115),BRONZE,0,0,M_BRONZE));
  for(const s of [-1,1])
    P.push(piece(new THREE.BoxGeometry(.026,.145,.1).rotateZ(s*.13).translate(s*.114,1.598,.035),BRONZE,0,0,M_BRONZE));
  P.push(piece(cy(.022,.03,.06,0,1.83,0,6),BRONZE,0,0,M_BRONZE));
  if(crete){ P.push(piece(bx(.36,.1,.05,0,1.86,0),'#9E1B14',0,0,M_LAINE)); }
  /* bras armé et glaive */
  P.push(piece(cy(.062,.055,.3,.27,1.33,0,7),BLANC,3,1,M_LAINE));
  P.push(piece(cy(.05,.042,.28,.27,1.07,.05,7),PEAU,3,0,M_CHAIR));
  P.push(piece(sp(.047,.27,.93,.1,6),PEAU,3,0,M_CHAIR));
  P.push(piece(bx(.1,.03,.03,.27,.93,.14),CUIR,3,0,M_CUIR));
  P.push(piece(bx(.045,.02,.55,.27,.93,.43),FER,3,0,M_FER));
  P.push(piece(new THREE.ConeGeometry(.026,.09,4).rotateX(-Math.PI/2).translate(.27,.93,.75),FER,3,0,M_FER));
  /* bras gauche et scutum */
  P.push(piece(cy(.05,.044,.5,-.27,1.25,.05,7),PEAU,4,0,M_CHAIR));
  const courbe=(r,h,y)=>new THREE.CylinderGeometry(r,r,h,16,1,true,-.56,1.12).translate(-.14,y,-.2);
  P.push(piece(courbe(.62,1.06,.88),BLANC,4,2,M_BOIS));
  P.push(piece(courbe(.627,.04,1.39),BRONZE,4,0,M_BRONZE));
  P.push(piece(courbe(.627,.04,.37),BRONZE,4,0,M_BRONZE));
  P.push(piece(bx(.04,.92,.02,-.14,.88,.43),BRONZE,4,0,M_BRONZE));
  P.push(piece(sp(.08,-.14,.88,.44,10),BRONZE,4,0,M_BRONZE));
  return assembler(P);
}

function modeleGaulois(){
  const P=[];
  for(const [s,part] of [[-1,1],[1,2]]){
    P.push(piece(bx(.11,.07,.22,s*.09,.035,.03),CUIR,part,0,M_CUIR));
    P.push(piece(cy(.058,.082,.82,s*.09,.45,0,7),'#6A5A3F',part,0,M_LAINE));
  }
  P.push(piece(cy(.21,.27,.42,0,.95,0,12),BLANC,0,1,M_LAINE));
  P.push(piece(cy(.2,.22,.42,0,1.33,0,12),BLANC,0,1,M_LAINE));
  P.push(piece(cy(.218,.218,.05,0,1.12,0,12),CUIR,0,0,M_CUIR));
  P.push(piece(new THREE.TorusGeometry(.075,.014,6,14).rotateX(Math.PI/2).translate(0,1.56,0),'#C9A13A',0,0,M_BRONZE));
  P.push(piece(sp(.108,0,1.66,.01),PEAU,0,0,M_CHAIR));
  const chev=new THREE.SphereGeometry(.118,10,6,0,Math.PI*2,0,Math.PI*.58).translate(0,1.675,-.012);
  P.push(piece(chev,'#8A5A2A',0,0,M_CHAIR));
  P.push(piece(bx(.19,.2,.05,0,1.6,-.085),'#8A5A2A',0,0,M_CHAIR));
  P.push(piece(bx(.1,.022,.025,0,1.625,.1),'#7A4E24',0,0,M_CHAIR));
  P.push(piece(bx(.025,.06,.02,-.05,1.6,.1),'#7A4E24',0,0,M_CHAIR));
  P.push(piece(bx(.025,.06,.02,.05,1.6,.1),'#7A4E24',0,0,M_CHAIR));
  /* bras nu et longue épée */
  P.push(piece(cy(.064,.056,.3,.27,1.33,0,7),PEAU,3,0,M_CHAIR));
  P.push(piece(cy(.052,.044,.28,.27,1.07,.05,7),PEAU,3,0,M_CHAIR));
  P.push(piece(sp(.047,.27,.93,.1,6),PEAU,3,0,M_CHAIR));
  P.push(piece(bx(.12,.03,.03,.27,.93,.14),CUIR,3,0,M_CUIR));
  P.push(piece(bx(.045,.02,.85,.27,.93,.58),'#B8B8BC',3,0,M_FER));
  P.push(piece(new THREE.ConeGeometry(.026,.1,4).rotateX(-Math.PI/2).translate(.27,.93,1.05),'#B8B8BC',3,0,M_FER));
  /* bouclier ovale */
  P.push(piece(cy(.052,.046,.5,-.27,1.25,.05,7),PEAU,4,0,M_CHAIR));
  const ov=new THREE.CylinderGeometry(.5,.5,.035,18).rotateX(Math.PI/2).scale(.62,1.16,1).translate(-.12,.92,.36);
  P.push(piece(ov,BLANC,4,2,M_BOIS));
  P.push(piece(bx(.035,.95,.02,-.12,.92,.38),'#5A4426',4,0,M_BOIS));
  P.push(piece(sp(.07,-.12,.92,.39,8),BRONZE,4,0,M_BRONZE));
  return assembler(P);
}

/* ---------- modèles lointains : quelques boîtes suffisent à cent pas ---------- */
function modeleLoin(gaulois){
  const P=[];
  for(const [s,part] of [[-1,1],[1,2]]) P.push(piece(bx(.12,.85,.14,s*.09,.43,0),gaulois?'#6A5A3F':PEAU,part,0,gaulois?M_LAINE:M_CHAIR));
  P.push(piece(bx(.44,.4,.3,0,.98,0),BLANC,0,1,M_LAINE));
  P.push(piece(bx(.4,.42,.26,0,1.36,0),gaulois?BLANC:'#6E6C68',0,gaulois?1:0,gaulois?M_LAINE:M_FER));
  P.push(piece(bx(.2,.22,.2,0,1.67,0),PEAU,0,0,M_CHAIR));
  P.push(piece(bx(.24,.1,.24,0,1.8,0),gaulois?'#8A5A2A':BRONZE,0,0,gaulois?M_CHAIR:M_BRONZE));
  P.push(piece(bx(.1,.55,.11,.27,1.2,.03),gaulois?PEAU:BLANC,3,gaulois?0:1,gaulois?M_CHAIR:M_LAINE));
  P.push(piece(bx(.045,.02,gaulois?.85:.55,.27,.93,gaulois?.58:.43),FER,3,0,M_FER));
  P.push(piece(bx(gaulois?.6:.66,gaulois?1.1:1.06,.05,-.14,.9,.4),BLANC,4,2,M_BOIS));
  return assembler(P);
}

/* ---------- le shader commun ---------- */
const GLSL_ANIM=`
attribute vec3 iPos; attribute vec2 iRot; attribute vec4 iAnim; attribute vec3 iTint; attribute vec3 iTint2;
attribute float part; attribute float tintable; attribute float matiere;
uniform float uThrust;
vec3 rX(vec3 v,float a){ float c=cos(a),s=sin(a); return vec3(v.x,c*v.y-s*v.z,s*v.y+c*v.z); }
vec3 rY(vec3 v,float a){ float c=cos(a),s=sin(a); return vec3(c*v.x+s*v.z,v.y,-s*v.x+c*v.z); }
vec3 anim(vec3 v,bool P){
  if(part>.5&&part<2.5){ vec3 pv=vec3(0.,.85,0.); float a=(part<1.5?1.:-1.)*sin(iAnim.x)*.6*iAnim.y; v=P?rX(v-pv,a)+pv:rX(v,a); }
  else if(part>2.5&&part<3.5){
    vec3 pv=vec3(.27,1.45,0.); float t=iAnim.z;
    float a = t<0. ? -t*mix(2.7,.7,uThrust) : -t*mix(1.5,.3,uThrust);
    v=P?rX(v-pv,a)+pv:rX(v,a);
    if(P&&t>0.) v.z+=t*.38*uThrust;
  }
  else if(part>3.5){ float b=iAnim.w; if(P){ float b1=min(b,1.); v.y+=b1*.16; v.z+=b1*.1+max(b-1.,0.)*.4; v.x+=b1*.1; } }
  float d=iRot.y;
  if(d>0.){ v=rX(v,-d*1.48); if(P) v.y+=d*.13; }
  v=rY(v,iRot.x);
  if(P) v+=iPos;
  return v;
}`;
/* avecMatiere : seul le matériau éclairé lit la matière ; celui qui n'écrit que
   la profondeur n'en a que faire, et déclarer la varying des deux côtés
   obligerait à patcher aussi son fragment. */
function patchSoldat(mat, thrust, avecMatiere){
  mat.onBeforeCompile=(sh)=>{
    sh.uniforms.uThrust={ value:thrust };
    sh.vertexShader=sh.vertexShader
      .replace('#include <common>','#include <common>\n'+GLSL_ANIM+(avecMatiere?'\nvarying float vMat;':''))
      .replace('#include <beginnormal_vertex>','vec3 objectNormal = anim(vec3( normal ),false);')
      .replace('#include <begin_vertex>','vec3 transformed = anim(vec3( position ),true);'+(avecMatiere?'\nvMat=matiere;':''))
      .replace('#include <color_vertex>','#include <color_vertex>\n vColor.rgb *= mix(vec3(1.), tintable>1.5?iTint2:iTint, step(.5,tintable));');
    if(!avecMatiere) return;
    sh.fragmentShader=sh.fragmentShader
      .replace('#include <common>',`#include <common>
        varying float vMat;
        /* chair · laine · cuir · fer · bronze · bois peint */
        float rugosite(float m){
          if(m<0.5) return 0.66; if(m<1.5) return 0.93; if(m<2.5) return 0.76;
          if(m<3.5) return 0.43; if(m<4.5) return 0.34; return 0.74; }
        float metal(float m){
          if(m<2.5) return 0.0; if(m<3.5) return 0.88; if(m<4.5) return 1.0; return 0.0; }`)
      /* la cotte de mailles n'est pas un miroir : des milliers d'anneaux la
         brouillent. On lui rend ce grain par un bruit fin sur la rugosité. */
      .replace('#include <roughnessmap_fragment>',`
        float roughnessFactor=rugosite(vMat);
        if(vMat>2.5&&vMat<3.5){
          vec2 q=gl_FragCoord.xy*0.37;
          roughnessFactor+=0.17*fract(sin(dot(floor(q),vec2(12.9898,78.233)))*43758.5453);
        }`)
      .replace('#include <metalnessmap_fragment>','float metalnessFactor=metal(vMat);');
  };
}

/* deux niveaux de détail : les hommes proches de la caméra reçoivent le modèle fin */
const LOD_PRES=38;
class Lot{
  constructor(geo,N,thrust){
    const g=new THREE.InstancedBufferGeometry();
    for(const k of ['position','normal','color','part','tintable','matiere']) g.setAttribute(k,geo.attributes[k]);
    const A=(n)=>new THREE.InstancedBufferAttribute(new Float32Array(N*n),n).setUsage(THREE.DynamicDrawUsage);
    this.a={ iPos:A(3), iRot:A(2), iAnim:A(4), iTint:A(3), iTint2:A(3) };
    for(const k in this.a) g.setAttribute(k,this.a[k]);
    g.instanceCount=0;
    /* rugosité et métal viennent de l'attribut « matiere », pièce par pièce */
    const m=new THREE.MeshStandardMaterial({ vertexColors:true, side:THREE.DoubleSide, roughness:.74, metalness:.5 });
    patchSoldat(m, thrust, true);
    ombre(m);
    this.mesh=new THREE.Mesh(g,m); this.mesh.frustumCulled=false;
    /* l'homme est déformé dans le shader ; sans la même déformation sur la carte
       de profondeur, son ombre resterait plantée en T au milieu du champ. */
    const dm=new THREE.MeshDepthMaterial({ depthPacking:THREE.RGBADepthPacking, side:THREE.DoubleSide });
    patchSoldat(dm, thrust);
    this.mesh.customDepthMaterial=dm;
    this.mesh.castShadow=true; this.mesh.receiveShadow=true;
    scene.add(this.mesh);
    this.g=g; this.n=0;
  }
  ecrire(s){
    const i=this.n++, a=this.a;
    a.iPos.setXYZ(i,s.x,s.y,s.z); a.iRot.setXY(i,s.yaw,s.chute);
    a.iAnim.setXYZW(i,s.phase,s.marche,s.coup,s.garde);
    a.iTint.setXYZ(i,s.t1.r,s.t1.g,s.t1.b); a.iTint2.setXYZ(i,s.t2.r,s.t2.g,s.t2.b);
    return i;
  }
  envoyer(){ this.g.instanceCount=this.n; for(const k in this.a){ this.a[k].needsUpdate=true; } }
}
class Armee{
  constructor(geoPres, geoLoin, N, thrust){
    this.pres=new Lot(geoPres, Math.min(N,900), thrust);
    this.loin=new Lot(geoLoin, N, thrust);
    this.N=N; this.npres=Math.min(N,900);
    /* ombre portée : une tache sombre sous chaque homme */
    const og=new THREE.InstancedBufferGeometry();
    const disque=new THREE.CircleGeometry(.5,10).rotateX(-Math.PI/2);
    og.index=disque.index; og.setAttribute('position',disque.attributes.position); og.setAttribute('uv',disque.attributes.uv);
    this.oPos=new THREE.InstancedBufferAttribute(new Float32Array(N*3),3).setUsage(THREE.DynamicDrawUsage);
    this.oRot=new THREE.InstancedBufferAttribute(new Float32Array(N*2),2).setUsage(THREE.DynamicDrawUsage);
    og.setAttribute('iPos',this.oPos); og.setAttribute('iRot',this.oRot); og.instanceCount=0;
    /* le soleil donne maintenant la vraie ombre portée ; cette tache ne sert
       plus qu'au contact au sol, que la carte d'ombre est trop lâche pour rendre. */
    const om=new THREE.MeshBasicMaterial({ color:0x000000, transparent:true, opacity:.16, depthWrite:false, map:texRonde() });
    om.onBeforeCompile=(sh)=>{
      sh.vertexShader=sh.vertexShader.replace('#include <common>','#include <common>\nattribute vec3 iPos; attribute vec2 iRot;')
        .replace('#include <begin_vertex>','vec3 transformed=position*vec3(1.+iRot.y*1.2,1.,1.+iRot.y*.6)+iPos+vec3(0.,.04,0.);');
    };
    this.ombre=new THREE.Mesh(og,om); this.ombre.frustumCulled=false; this.ombre.renderOrder=1; scene.add(this.ombre);
    this.og=og; this.no=0;
  }
  debut(){ this.pres.n=0; this.loin.n=0; this.no=0; }
  ecrire(s, cx, cz){
    if(s.cache||s.invisible) return;
    const d2=(s.x-cx)**2+(s.z-cz)**2;
    if(d2<LOD_PRES*LOD_PRES && this.pres.n<this.npres) this.pres.ecrire(s); else this.loin.ecrire(s);
    if(d2<160*160){ const i=this.no++; this.oPos.setXYZ(i,s.x,s.y,s.z); this.oRot.setXY(i,s.yaw,s.chute); }
  }
  envoyer(){ this.pres.envoyer(); this.loin.envoyer(); this.og.instanceCount=this.no; this.oPos.needsUpdate=this.oRot.needsUpdate=true; }
}

/* ===== src3d/sim.js ===== */
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

/* ===== src3d/son.js ===== */
/* ============================================================
   SON — tout est synthétisé : fer, bois, traits, cornu, sifflet,
   et la rumeur de la mêlée qui monte avec le combat.
   ============================================================ */
let AC=null, BRUIT=null, AMB=null, MAITRE=null, MUET=false, nbSons=0;
function initSon(){
  if(AC) return;
  try{ AC=new (window.AudioContext||window.webkitAudioContext)(); }catch(e){ return; }
  MAITRE=AC.createGain(); MAITRE.gain.value=MUET?0:.7; MAITRE.connect(AC.destination);
  const n=AC.sampleRate*2; BRUIT=AC.createBuffer(1,n,AC.sampleRate);
  const d=BRUIT.getChannelData(0); let b=0; for(let i=0;i<n;i++){ const w=Math.random()*2-1; b=.97*b+.03*w; d[i]=w*.6+b*3; }
  const src=AC.createBufferSource(); src.buffer=BRUIT; src.loop=true;
  const f=AC.createBiquadFilter(); f.type='lowpass'; f.frequency.value=520;
  AMB=AC.createGain(); AMB.gain.value=.02;
  src.connect(f); f.connect(AMB); AMB.connect(MAITRE); src.start();
  setInterval(()=>{ nbSons=0; },250);
}
function basculerSon(){ MUET=!MUET; if(MAITRE) MAITRE.gain.value=MUET?0:.7; return MUET; }
function ambiance(intensite){ if(AMB) AMB.gain.setTargetAtTime(.02+intensite*.35, AC.currentTime, .4); }

function enveloppe(g,t,a,dur,v){ g.gain.setValueAtTime(0,t); g.gain.linearRampToValueAtTime(v,t+a); g.gain.exponentialRampToValueAtTime(.0001,t+dur); }
function salve(freq,q,dur,v,type='bandpass',delai=0){
  const t=AC.currentTime+delai, s=AC.createBufferSource(); s.buffer=BRUIT; s.playbackRate.value=rand(.8,1.2);
  const f=AC.createBiquadFilter(); f.type=type; f.frequency.value=freq; f.Q.value=q;
  const g=AC.createGain(); enveloppe(g,t,.004,dur,v);
  s.connect(f); f.connect(g); g.connect(MAITRE); s.start(t, Math.random()); s.stop(t+dur+.05);
}
function ton(freq,dur,v,type='sine',delai=0,glisse){
  const t=AC.currentTime+delai, o=AC.createOscillator(); o.type=type; o.frequency.setValueAtTime(freq,t);
  if(glisse) o.frequency.exponentialRampToValueAtTime(glisse,t+dur);
  const g=AC.createGain(); enveloppe(g,t,.01,dur,v); o.connect(g); g.connect(MAITRE); o.start(t); o.stop(t+dur+.05);
}
function son(k, x, z){
  if(!AC||MUET) return;
  let v=1;
  if(x!==undefined){ const d=Math.hypot(x-camera.position.x, z-camera.position.z); if(d>70) return; v=1/(1+d*.12); }
  if(k!=='cornu'&&k!=='sifflet'&&k!=='blesse'&&k!=='bouclier'&&k!=='frappe'){ if(nbSons>7) return; nbSons++; }
  switch(k){
    case 'coup': salve(2600,6,.12,.5*v); ton(rand(850,1200),.18,.08*v,'triangle'); break;
    case 'parade': salve(380,2,.1,.6*v,'lowpass'); break;
    case 'trait': salve(1800,1.5,.5,.15*v); break;
    case 'tue': salve(220,1,.25,.7*v,'lowpass'); break;
    case 'bouclier': salve(300,1.2,.16,1,'lowpass'); salve(2400,5,.1,.35); break;
    case 'frappe': salve(260,1,.12,.8,'lowpass'); ton(1400,.12,.1,'triangle'); break;
    case 'blesse': salve(160,1,.3,1.2,'lowpass'); ton(90,.25,.3,'sine'); break;
    case 'cornu': { const t=AC.currentTime;
      for(const [f,vv] of [[110,.18],[165,.1],[220,.06]]){ const o=AC.createOscillator(); o.type='sawtooth'; o.frequency.value=f;
        const lp=AC.createBiquadFilter(); lp.type='lowpass'; lp.frequency.value=700;
        const g=AC.createGain(); g.gain.setValueAtTime(0,t); g.gain.linearRampToValueAtTime(vv,t+.15); g.gain.setValueAtTime(vv,t+.9); g.gain.linearRampToValueAtTime(0,t+1.3);
        o.connect(lp); lp.connect(g); g.connect(MAITRE); o.start(t); o.stop(t+1.4); } break; }
    case 'sifflet': ton(2500,.16,.12,'sine'); ton(2500,.22,.12,'sine',.24); break;
  }
}

/* ===== src3d/jeu.js ===== */
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

