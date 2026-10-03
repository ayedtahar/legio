/* ============================================================
   RESSOURCES — ciel HDRI et sols photographiques
   Tout vient de Poly Haven, en CC0 : voir fetch-assets.sh.
   Les fichiers sont lus par le réseau, donc la page doit être
   servie en http:// — un file:// se heurte à la politique
   d'origine du navigateur. Voir serve.sh.
   ============================================================ */
const RES={ ciel:null, ibl:null, sol:null, horizon:null, poses:null, sq:null, pret:false };

/* Les poses cuites : une colonne de quatre texels par os, une ligne par image.
   Le shader y lit la matrice de l'os, donc des milliers d'hommes peuvent jouer
   des animations différentes en un seul appel de dessin. */
async function chargerPoses(){
  try{
    const [sq,bin]=await Promise.all([
      fetch('assets/anim/squelette.json').then(r=>r.ok?r.json():Promise.reject(r.status)),
      fetch('assets/anim/poses.bin').then(r=>r.ok?r.arrayBuffer():Promise.reject(r.status))
    ]);
    const t=new THREE.DataTexture(new Float32Array(bin), sq.largeur, sq.hauteur, THREE.RGBAFormat, THREE.FloatType);
    t.minFilter=t.magFilter=THREE.NearestFilter;  /* on interpole nous-mêmes entre deux images */
    t.generateMipmaps=false; t.needsUpdate=true;
    RES.poses=t; RES.sq=sq;
    RES.clip={}; for(const c of sq.clips) RES.clip[c.nom]=c;
  }catch(e){
    /* Sans la cuisson, on fabrique une pose unique faite d'identités : les
       hommes restent en T, mais rien ne casse et le message est clair. */
    console.warn('poses absentes (lance outils/cuire.sh) — les hommes resteront en T :',e);
    const nOs=20, largeur=nOs*4, d=new Float32Array(largeur*4);
    for(let b=0;b<nOs;b++){ const o=b*16; d[o]=1; d[o+5]=1; d[o+10]=1; d[o+15]=1; }
    const t=new THREE.DataTexture(d,largeur,1,THREE.RGBAFormat,THREE.FloatType);
    t.minFilter=t.magFilter=THREE.NearestFilter; t.generateMipmaps=false; t.needsUpdate=true;
    RES.poses=t;
    RES.sq={ os:[], largeur, hauteur:1, ips:30, clips:[{nom:'repos',ligne0:0,images:1,duree:1}] };
    RES.clip={ idle:RES.sq.clips[0] };
  }
}

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

  gest.onLoad=()=>{ chargerPoses().then(()=>{ RES.pret=true; pret(); }); };
  gest.onError=(u)=>{ console.warn('ressource manquante :',u); };
}

/* Répétition des cartes du sol : une tuile tous les T mètres. */
function tuiler(set,T,etendue){
  const r=etendue/T;
  for(const k in set){ set[k].repeat.set(r,r); set[k].needsUpdate=true; }
}
