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
