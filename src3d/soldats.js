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
