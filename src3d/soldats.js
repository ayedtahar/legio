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

function piece(geo, col, part=0, tint=0, mat=M_LAINE, os=0){
  return { g:geo.index?geo.toNonIndexed():geo, col:new THREE.Color(col), part, tint, mat, os };
}

/* ---------- le squelette ----------
   Les vingt os retenus du squelette Mixamo. Chaque pièce est attachée à un seul
   os : elle ne se déforme pas, elle suit. C'est de la peau rigide — mais c'est
   du mouvement capturé sur un acteur, et l'œil lit le mouvement avant la forme. */
const O_HANCHE=0, O_EPINE=1, O_EPINE1=2, O_EPINE2=3, O_COU=4, O_TETE=5,
      O_EPAULE_G=6, O_BRAS_G=7, O_AVBRAS_G=8, O_MAIN_G=9,
      O_EPAULE_D=10, O_BRAS_D=11, O_AVBRAS_D=12, O_MAIN_D=13,
      O_CUISSE_G=14, O_JAMBE_G=15, O_PIED_G=16,
      O_CUISSE_D=17, O_JAMBE_D=18, O_PIED_D=19;

/* Pose de repos, en T. Recopiée de la cuisson pour que le modèle existe même
   sans les animations ; si elles sont là, c'est la vraie qui sert. */
const REPOS_T=[[0,1.040,0.021],[0,1.142,0.022],[0,1.243,0.012],[0,1.334,-0.002],[0,1.500,-0.027],[0,1.596,-0.010],
  [0.046,1.443,-0.028],[0.152,1.438,-0.050],[0.430,1.438,-0.050],[0.713,1.438,-0.050],
  [-0.046,1.443,-0.028],[-0.152,1.438,-0.050],[-0.430,1.438,-0.050],[-0.713,1.438,-0.050],
  [0.082,0.972,0.005],[0.082,0.529,0.008],[0.082,0.084,-0.022],
  [-0.082,0.972,0.005],[-0.082,0.529,0.008],[-0.082,0.084,-0.022]];
const repos=()=> (RES.sq&&RES.sq.repos&&RES.sq.repos.length===20) ? RES.sq.repos : REPOS_T;

/* un membre : tronc de cône tendu d'un os à l'autre */
function membre(a,b,r0,r1,seg=7){
  const A=new THREE.Vector3(a[0],a[1],a[2]), d=new THREE.Vector3(b[0],b[1],b[2]).sub(A);
  const h=Math.max(.02,d.length());
  const g=new THREE.CylinderGeometry(r1,r0,h,seg);
  g.translate(0,h/2,0);
  g.applyQuaternion(new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0,1,0), d.normalize()));
  g.translate(A.x,A.y,A.z);
  return g;
}
/* un point entre deux os, en fraction */
const entre=(a,b,t)=>[a[0]+(b[0]-a[0])*t, a[1]+(b[1]-a[1])*t, a[2]+(b[2]-a[2])*t];
const bx=(w,h,d,x,y,z)=>new THREE.BoxGeometry(w,h,d).translate(x,y,z);
const cy=(rt,rb,h,x,y,z,s=8)=>new THREE.CylinderGeometry(rt,rb,h,s).translate(x,y,z);
const sp=(r,x,y,z,s=8)=>new THREE.SphereGeometry(r,s,Math.max(5,s*.6|0)).translate(x,y,z);

function assembler(pieces){
  const pos=[], nor=[], col=[], part=[], tint=[], mat=[], osi=[];
  for(const p of pieces){
    const a=p.g.attributes, n=a.position.count;
    pos.push(...a.position.array); nor.push(...a.normal.array);
    for(let i=0;i<n;i++){ col.push(p.col.r,p.col.g,p.col.b); part.push(p.part); tint.push(p.tint); mat.push(p.mat); osi.push(p.os); }
  }
  const g=new THREE.BufferGeometry();
  g.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));
  g.setAttribute('normal',new THREE.Float32BufferAttribute(nor,3));
  g.setAttribute('color',new THREE.Float32BufferAttribute(col,3));
  g.setAttribute('part',new THREE.Float32BufferAttribute(part,1));
  g.setAttribute('tintable',new THREE.Float32BufferAttribute(tint,1));
  g.setAttribute('matiere',new THREE.Float32BufferAttribute(mat,1));
  g.setAttribute('os',new THREE.Float32BufferAttribute(osi,1));
  return g;
}

const PEAU='#B98A66', BLANC='#ECE6DC', BRONZE='#A07E3C', FER='#C4C4C8', CUIR='#4A321C';

function modeleLegionnaire(crete){
  const R=repos(), P=[];
  /* bras armé = côté droit du squelette (x négatif), bouclier = côté gauche.
     C'est la convention des animations Mixamo « sword and shield ». */

  /* ---- jambes ---- */
  for(const [cu,ja,pi] of [[O_CUISSE_G,O_JAMBE_G,O_PIED_G],[O_CUISSE_D,O_JAMBE_D,O_PIED_D]]){
    P.push(piece(membre(R[cu],R[ja],.088,.062),PEAU,0,0,M_CHAIR,cu));
    P.push(piece(membre(R[ja],R[pi],.062,.046),PEAU,0,0,M_CHAIR,ja));
    /* lanières de la caliga : trois traits sombres qui rompent la jambe nue */
    for(let k=0;k<3;k++){ const q=entre(R[ja],R[pi],.3+k*.22);
      P.push(piece(cy(.056,.056,.022,q[0],q[1],q[2],7),CUIR,0,0,M_CUIR,ja)); }
    P.push(piece(bx(.115,.075,.25,R[pi][0],R[pi][1]-.02,R[pi][2]+.055),CUIR,0,0,M_CUIR,pi));
  }

  /* ---- tunique, ceinturon, pteruges ---- */
  P.push(piece(cy(.2,.26,.34,0,.92,.012,12),BLANC,0,1,M_LAINE,O_HANCHE));
  for(let i=0;i<10;i++){ const a=i/10*Math.PI*2;
    P.push(piece(bx(.075,.17,.028,Math.cos(a)*.205,1.03,.012+Math.sin(a)*.205),CUIR,0,0,M_CUIR,O_HANCHE)); }
  P.push(piece(cy(.208,.208,.06,0,1.12,.015,12),CUIR,0,0,M_CUIR,O_HANCHE));

  /* ---- cotte de mailles : le bas suit le bassin, le haut la poitrine ---- */
  P.push(piece(cy(.2,.228,.2,0,1.21,.012,12),'#6E6C68',0,0,M_FER,O_EPINE1));
  P.push(piece(cy(.188,.206,.24,0,1.40,-.004,12),'#6E6C68',0,0,M_FER,O_EPINE2));
  P.push(piece(cy(.224,.198,.09,0,1.48,-.012,12),'#64625E',0,0,M_FER,O_EPINE2));
  P.push(piece(sp(.1,R[O_EPAULE_G][0]*2.2,1.442,-.04,8),'#64625E',0,0,M_FER,O_EPAULE_G));
  P.push(piece(sp(.1,R[O_EPAULE_D][0]*2.2,1.442,-.04,8),'#64625E',0,0,M_FER,O_EPAULE_D));

  /* ---- cou, focale, tête ---- */
  P.push(piece(cy(.062,.062,.1,0,1.52,-.022,8),PEAU,0,0,M_CHAIR,O_COU));
  P.push(piece(cy(.09,.09,.055,0,1.498,-.022,10),'#8E2016',0,0,M_LAINE,O_COU));
  P.push(piece(sp(.105,0,1.655,-.004,10),PEAU,0,0,M_CHAIR,O_TETE));

  /* ---- la galea ---- */
  const T=O_TETE;
  P.push(piece(new THREE.SphereGeometry(.128,14,8,0,Math.PI*2,0,Math.PI/2).translate(0,1.672,-.004),BRONZE,0,0,M_BRONZE,T));
  P.push(piece(cy(.131,.134,.034,0,1.665,-.004,14),BRONZE,0,0,M_BRONZE,T));
  P.push(piece(new THREE.BoxGeometry(.235,.028,.14).rotateX(-.55).translate(0,1.615,-.125),BRONZE,0,0,M_BRONZE,T));
  for(const s2 of [-1,1])
    P.push(piece(new THREE.BoxGeometry(.026,.145,.1).rotateZ(s2*.13).translate(s2*.114,1.585,.03),BRONZE,0,0,M_BRONZE,T));
  P.push(piece(cy(.022,.03,.06,0,1.817,-.004,6),BRONZE,0,0,M_BRONZE,T));
  if(crete) P.push(piece(bx(.05,.1,.36,0,1.847,-.004),'#9E1B14',0,0,M_LAINE,T));

  /* ---- bras ---- */
  for(const [br,av,ma,part] of [[O_BRAS_G,O_AVBRAS_G,O_MAIN_G,4],[O_BRAS_D,O_AVBRAS_D,O_MAIN_D,3]]){
    P.push(piece(membre(R[br],entre(R[br],R[av],.55),.075,.058),BLANC,part,1,M_LAINE,br));
    P.push(piece(membre(entre(R[br],R[av],.55),R[av],.058,.05),PEAU,part,0,M_CHAIR,br));
    P.push(piece(membre(R[av],R[ma],.05,.04),PEAU,part,0,M_CHAIR,av));
    P.push(piece(sp(.047,R[ma][0],R[ma][1],R[ma][2],6),PEAU,part,0,M_CHAIR,ma));
  }

  /* ---- le glaive, dans la main droite ---- */
  const D=R[O_MAIN_D], sx=Math.sign(D[0])||-1;
  P.push(piece(bx(.1,.034,.034,D[0]+sx*.03,D[1],D[2]),CUIR,3,0,M_CUIR,O_MAIN_D));
  P.push(piece(sp(.03,D[0]-sx*.055,D[1],D[2],6),BRONZE,3,0,M_BRONZE,O_MAIN_D));
  P.push(piece(bx(.5,.02,.046,D[0]+sx*.33,D[1],D[2]),FER,3,0,M_FER,O_MAIN_D));
  P.push(piece(new THREE.ConeGeometry(.026,.1,4).rotateZ(sx>0?-Math.PI/2:Math.PI/2).translate(D[0]+sx*.63,D[1],D[2]),FER,3,0,M_FER,O_MAIN_D));

  /* ---- le scutum ----
     Accroché à l'avant-bras, pas à la main : la main vrille sur son axe d'une
     animation à l'autre et emporterait le bouclier à plat. L'avant-bras, lui,
     ne tourne guère — et c'est bien sur lui que le scutum pèse. */
  const G=entre(R[O_AVBRAS_G],R[O_MAIN_G],.55);
  const courbe=(r,h,dy)=>new THREE.CylinderGeometry(r,r,h,16,1,true,-.56,1.12).translate(G[0],G[1]+dy,G[2]-.24);
  P.push(piece(courbe(.62,1.06,0),BLANC,5,2,M_BOIS,O_AVBRAS_G));
  P.push(piece(courbe(.627,.04,.51),BRONZE,5,0,M_BRONZE,O_AVBRAS_G));
  P.push(piece(courbe(.627,.04,-.51),BRONZE,5,0,M_BRONZE,O_AVBRAS_G));
  P.push(piece(bx(.04,.92,.02,G[0],G[1],G[2]+.39),BRONZE,5,0,M_BRONZE,O_AVBRAS_G));
  P.push(piece(sp(.08,G[0],G[1],G[2]+.4,10),BRONZE,5,0,M_BRONZE,O_AVBRAS_G));
  return assembler(P);
}

function modeleGaulois(){
  const R=repos(), P=[];
  /* ---- jambes en braies ---- */
  for(const [cu,ja,pi] of [[O_CUISSE_G,O_JAMBE_G,O_PIED_G],[O_CUISSE_D,O_JAMBE_D,O_PIED_D]]){
    P.push(piece(membre(R[cu],R[ja],.095,.07),'#6A5A3F',0,0,M_LAINE,cu));
    P.push(piece(membre(R[ja],R[pi],.07,.05),'#6A5A3F',0,0,M_LAINE,ja));
    P.push(piece(bx(.115,.075,.25,R[pi][0],R[pi][1]-.02,R[pi][2]+.055),CUIR,0,0,M_CUIR,pi));
  }
  /* ---- tunique longue, sans armure ---- */
  P.push(piece(cy(.21,.27,.4,0,.95,.015,12),BLANC,0,1,M_LAINE,O_HANCHE));
  P.push(piece(cy(.218,.218,.05,0,1.13,.015,12),CUIR,0,0,M_CUIR,O_HANCHE));
  P.push(piece(cy(.2,.215,.22,0,1.22,.012,12),BLANC,0,1,M_LAINE,O_EPINE1));
  P.push(piece(cy(.19,.205,.26,0,1.41,-.004,12),BLANC,0,1,M_LAINE,O_EPINE2));
  for(const e of [O_EPAULE_G,O_EPAULE_D])
    P.push(piece(sp(.098,R[e][0]*2.2,1.442,-.04,8),BLANC,0,1,M_LAINE,e));
  /* ---- cou, torque, tête, chevelure ---- */
  P.push(piece(cy(.064,.064,.1,0,1.52,-.022,8),PEAU,0,0,M_CHAIR,O_COU));
  P.push(piece(new THREE.TorusGeometry(.075,.014,6,14).rotateX(Math.PI/2).translate(0,1.49,-.022),'#C9A13A',0,0,M_BRONZE,O_COU));
  P.push(piece(sp(.108,0,1.652,-.004,10),PEAU,0,0,M_CHAIR,O_TETE));
  P.push(piece(new THREE.SphereGeometry(.118,10,6,0,Math.PI*2,0,Math.PI*.58).translate(0,1.66,-.016),'#8A5A2A',0,0,M_CHAIR,O_TETE));
  P.push(piece(bx(.19,.2,.05,0,1.59,-.095),'#8A5A2A',0,0,M_CHAIR,O_TETE));
  P.push(piece(bx(.1,.022,.025,0,1.615,.09),'#7A4E24',0,0,M_CHAIR,O_TETE));
  for(const s2 of [-1,1]) P.push(piece(bx(.025,.06,.02,s2*.05,1.59,.09),'#7A4E24',0,0,M_CHAIR,O_TETE));
  /* ---- bras nus ---- */
  for(const [br,av,ma,part] of [[O_BRAS_G,O_AVBRAS_G,O_MAIN_G,4],[O_BRAS_D,O_AVBRAS_D,O_MAIN_D,3]]){
    P.push(piece(membre(R[br],R[av],.075,.055),PEAU,part,0,M_CHAIR,br));
    P.push(piece(membre(R[av],R[ma],.055,.042),PEAU,part,0,M_CHAIR,av));
    P.push(piece(sp(.047,R[ma][0],R[ma][1],R[ma][2],6),PEAU,part,0,M_CHAIR,ma));
  }
  /* ---- longue épée ---- */
  const D=R[O_MAIN_D], sx=Math.sign(D[0])||-1;
  P.push(piece(bx(.12,.034,.034,D[0]+sx*.03,D[1],D[2]),CUIR,3,0,M_CUIR,O_MAIN_D));
  P.push(piece(bx(.8,.02,.046,D[0]+sx*.48,D[1],D[2]),'#B8B8BC',3,0,M_FER,O_MAIN_D));
  P.push(piece(new THREE.ConeGeometry(.026,.1,4).rotateZ(sx>0?-Math.PI/2:Math.PI/2).translate(D[0]+sx*.93,D[1],D[2]),'#B8B8BC',3,0,M_FER,O_MAIN_D));
  /* ---- bouclier ovale ---- */
  const G=entre(R[O_AVBRAS_G],R[O_MAIN_G],.55);
  const ov=new THREE.CylinderGeometry(.5,.5,.035,18).rotateX(Math.PI/2).scale(.62,1.16,1).translate(G[0],G[1],G[2]+.16);
  P.push(piece(ov,BLANC,5,2,M_BOIS,O_AVBRAS_G));
  P.push(piece(bx(.035,.95,.02,G[0],G[1],G[2]+.18),'#5A4426',5,0,M_BOIS,O_AVBRAS_G));
  P.push(piece(sp(.07,G[0],G[1],G[2]+.19,8),BRONZE,5,0,M_BRONZE,O_AVBRAS_G));
  return assembler(P);
}

/* ---------- modèles lointains : quelques volumes suffisent à cent pas ---------- */
function modeleLoin(gaulois){
  const R=repos(), P=[];
  for(const [cu,ja,pi] of [[O_CUISSE_G,O_JAMBE_G,O_PIED_G],[O_CUISSE_D,O_JAMBE_D,O_PIED_D]]){
    P.push(piece(membre(R[cu],R[pi],.095,.06,5),gaulois?'#6A5A3F':PEAU,0,0,gaulois?M_LAINE:M_CHAIR,cu));
  }
  P.push(piece(cy(.21,.26,.34,0,.95,.012,7),BLANC,0,1,M_LAINE,O_HANCHE));
  P.push(piece(cy(.2,.225,.42,0,1.33,0,7),gaulois?BLANC:'#6E6C68',0,gaulois?1:0,gaulois?M_LAINE:M_FER,O_EPINE2));
  P.push(piece(sp(.1,0,1.65,-.004,6),PEAU,0,0,M_CHAIR,O_TETE));
  P.push(piece(sp(.125,0,1.7,-.004,6),gaulois?'#8A5A2A':BRONZE,0,0,gaulois?M_CHAIR:M_BRONZE,O_TETE));
  for(const [br,ma,part] of [[O_BRAS_G,O_MAIN_G,4],[O_BRAS_D,O_MAIN_D,3]])
    P.push(piece(membre(R[br],R[ma],.072,.045,5),gaulois?PEAU:BLANC,part,gaulois?0:1,gaulois?M_CHAIR:M_LAINE,br));
  const D=R[O_MAIN_D], sx=Math.sign(D[0])||-1;
  P.push(piece(bx(gaulois?.8:.5,.02,.046,D[0]+sx*(gaulois?.48:.33),D[1],D[2]),FER,3,0,M_FER,O_MAIN_D));
  const G=entre(R[O_AVBRAS_G],R[O_MAIN_G],.55);
  P.push(piece(gaulois
      ? bx(.05,1.1,.6,G[0],G[1],G[2]+.16)
      : new THREE.CylinderGeometry(.62,.62,1.06,6,1,true,-.56,1.12).translate(G[0],G[1],G[2]-.24),
    BLANC,5,2,M_BOIS,O_AVBRAS_G));
  return assembler(P);
}

/* ---------- le shader commun ----------
   La pose ne se calcule plus : elle se lit. Une texture porte, pour chaque
   image de chaque clip, la matrice de chacun des vingt os. Le sommet va y
   chercher celle de son os et s'y transporte. Un seul appel de dessin suffit
   donc à quatre mille hommes jouant des animations différentes.
   iAnim = (première ligne du clip, nombre d'images, avancement 0..1, —)
   iCbt  = (coup, garde) : la surcouche de combat, en attendant les clips
   ---------------------------------------------------------------- */
const GLSL_ANIM=`
attribute vec3 iPos; attribute vec2 iRot; attribute vec4 iAnim; attribute vec2 iCbt;
attribute vec3 iTint; attribute vec3 iTint2;
attribute float part; attribute float tintable; attribute float matiere; attribute float os;
uniform sampler2D uPoses;
uniform float uThrust;
uniform vec3 uEpauleG;
uniform vec3 uEpauleD;
uniform vec3 uAvBrasG;
vec3 rX(vec3 v,float a){ float c=cos(a),s=sin(a); return vec3(v.x,c*v.y-s*v.z,s*v.y+c*v.z); }
vec3 rY(vec3 v,float a){ float c=cos(a),s=sin(a); return vec3(c*v.x+s*v.z,v.y,-s*v.x+c*v.z); }

mat4 pose(int ligne,int o){
  int x=o*4;
  return mat4(texelFetch(uPoses,ivec2(x  ,ligne),0),
              texelFetch(uPoses,ivec2(x+1,ligne),0),
              texelFetch(uPoses,ivec2(x+2,ligne),0),
              texelFetch(uPoses,ivec2(x+3,ligne),0));
}

vec3 anim(vec3 v,bool P){
  /* Surcouche de combat, appliquée dans la pose de repos : l'estoc fait pivoter
     le bras armé autour de son épaule, la garde lève le bouclier. Elle saute
     dès que de vrais clips d'attaque et de parade seront cuits. */
  if(part>2.5){
    bool bouclier = part>3.5;
    vec3 pv = bouclier ? uEpauleG : uEpauleD;
    float a = bouclier ? -iCbt.y*1.0 : -iCbt.x*mix(1.5,0.4,uThrust);
    v = P ? rX(v-pv,a)+pv : rX(v,a);
    if(P && !bouclier && iCbt.x>0.) v.z += iCbt.x*.34*uThrust;
  }

  /* la pose : deux images encadrantes, mêlées */
  float n=max(1.,iAnim.y);
  float fr=clamp(iAnim.z,0.,0.9999)*(n-1.);
  float f0=floor(fr);
  int l0=int(iAnim.x+f0), l1=int(iAnim.x+min(f0+1.,n-1.));
  int o=int(os+.5);
  mat4 A=pose(l0,o), B=pose(l1,o);
  float t=fr-f0;

  if(part>4.5){
    /* Le scutum ne prend que le déplacement de l'avant-bras, pas sa rotation.
       Le poignet vrille d'un clip à l'autre et coucherait le bouclier à plat
       comme un plateau ; or un scutum reste debout, quoi que fasse la main. */
    vec3 dA=(A*vec4(uAvBrasG,1.)).xyz-uAvBrasG;
    vec3 dB=(B*vec4(uAvBrasG,1.)).xyz-uAvBrasG;
    if(P) v+=mix(dA,dB,t);
  } else {
    v = P ? mix((A*vec4(v,1.)).xyz,(B*vec4(v,1.)).xyz,t)
          : normalize(mix(mat3(A)*v,mat3(B)*v,t));
  }

  float d=iRot.y;
  if(d>0.){ v=rX(v,-d*1.48); if(P) v.y+=d*.13; }
  v=rY(v,iRot.x);
  if(P) v+=iPos;
  return v;
}`;
function patchSoldat(mat, thrust, avecMatiere){
  mat.onBeforeCompile=(sh)=>{
    const R=repos();
    sh.uniforms.uThrust={ value:thrust };
    sh.uniforms.uPoses={ value:RES.poses };
    sh.uniforms.uEpauleG={ value:new THREE.Vector3(R[O_BRAS_G][0],R[O_BRAS_G][1],R[O_BRAS_G][2]) };
    sh.uniforms.uEpauleD={ value:new THREE.Vector3(R[O_BRAS_D][0],R[O_BRAS_D][1],R[O_BRAS_D][2]) };
    sh.uniforms.uAvBrasG={ value:new THREE.Vector3(R[O_AVBRAS_G][0],R[O_AVBRAS_G][1],R[O_AVBRAS_G][2]) };
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

/* ---------- quel clip, pour quel homme ----------
   La simulation ne sait pas qu'elle anime : elle dit « il marche à telle
   allure », et c'est ici qu'on traduit en clip. */
const POSE={ repos:null, marche:null, course:null };
function initPoses(){
  const c=RES.clip||{};
  POSE.repos  = c.idle || c.repos || Object.values(c)[0];
  POSE.marche = c.walk || POSE.repos;
  POSE.course = c.run  || POSE.marche;
}
function clipDe(s){
  const m=s.marche||0;
  if(m>.55) return POSE.course;
  if(m>.05) return POSE.marche;
  return POSE.repos;
}

/* deux niveaux de détail : les hommes proches de la caméra reçoivent le modèle fin */
const LOD_PRES=38;
class Lot{
  constructor(geo,N,thrust){
    const g=new THREE.InstancedBufferGeometry();
    for(const k of ['position','normal','color','part','tintable','matiere','os']) g.setAttribute(k,geo.attributes[k]);
    const A=(n)=>new THREE.InstancedBufferAttribute(new Float32Array(N*n),n).setUsage(THREE.DynamicDrawUsage);
    this.a={ iPos:A(3), iRot:A(2), iAnim:A(4), iCbt:A(2), iTint:A(3), iTint2:A(3) };
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
    const c=clipDe(s);
    /* chacun entre dans le cycle à son heure : sans ce décalage, cent hommes
       lèvent le même pied à la même image et la cohorte devient une horloge. */
    const ph=((M.t/c.duree)+s.phase*.159)%1;
    a.iAnim.setXYZW(i, c.ligne0, c.images, ph, 0);
    a.iCbt.setXY(i, s.coup||0, s.garde||0);
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
