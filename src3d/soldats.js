/* ============================================================
   SOLDATS — modèles construits pièce à pièce, rendus par instances.
   Chaque homme : position, cap, chute, pas, coup, bouclier — animés
   dans le shader, pour que des milliers bougent à la fois.
   pièce : 0 corps · 1 jambe g · 2 jambe d · 3 bras armé · 4 bouclier
   teinte : 0 fixe · 1 tunique (iTint) · 2 bouclier (iTint2)
   ============================================================ */
function piece(geo, col, part=0, tint=0){ return { g:geo.index?geo.toNonIndexed():geo, col:new THREE.Color(col), part, tint }; }
const bx=(w,h,d,x,y,z)=>new THREE.BoxGeometry(w,h,d).translate(x,y,z);
const cy=(rt,rb,h,x,y,z,s=8)=>new THREE.CylinderGeometry(rt,rb,h,s).translate(x,y,z);
const sp=(r,x,y,z,s=8)=>new THREE.SphereGeometry(r,s,Math.max(5,s*.6|0)).translate(x,y,z);

function assembler(pieces){
  const pos=[], nor=[], col=[], part=[], tint=[];
  for(const p of pieces){
    const a=p.g.attributes, n=a.position.count;
    pos.push(...a.position.array); nor.push(...a.normal.array);
    for(let i=0;i<n;i++){ col.push(p.col.r,p.col.g,p.col.b); part.push(p.part); tint.push(p.tint); }
  }
  const g=new THREE.BufferGeometry();
  g.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));
  g.setAttribute('normal',new THREE.Float32BufferAttribute(nor,3));
  g.setAttribute('color',new THREE.Float32BufferAttribute(col,3));
  g.setAttribute('part',new THREE.Float32BufferAttribute(part,1));
  g.setAttribute('tintable',new THREE.Float32BufferAttribute(tint,1));
  return g;
}

const PEAU='#B98A66', BLANC='#ECE6DC', BRONZE='#A07E3C', FER='#C4C4C8', CUIR='#4A321C';

function modeleLegionnaire(crete){
  const P=[];
  for(const [s,part] of [[-1,1],[1,2]]){
    P.push(piece(bx(.11,.07,.22,s*.09,.035,.03),CUIR,part));
    P.push(piece(bx(.1,.42,.11,s*.09,.28,0),PEAU,part));
    P.push(piece(bx(.13,.36,.14,s*.09,.64,0),PEAU,part));
  }
  P.push(piece(cy(.2,.27,.32,0,.9,0,12),BLANC,0,1));
  P.push(piece(cy(.205,.205,.05,0,1.07,0,12),CUIR));
  P.push(piece(cy(.19,.215,.46,0,1.32,0,10),'#6E6C68'));
  P.push(piece(bx(.5,.08,.26,0,1.52,0),'#64625E'));
  P.push(piece(cy(.06,.06,.08,0,1.58,0,8),PEAU));
  P.push(piece(sp(.105,0,1.67,.01),PEAU));
  const casque=new THREE.SphereGeometry(.125,12,8,0,Math.PI*2,0,Math.PI/2).translate(0,1.69,0);
  P.push(piece(casque,BRONZE));
  P.push(piece(cy(.022,.03,.06,0,1.83,0,6),BRONZE));
  P.push(piece(bx(.22,.03,.09,0,1.63,-.11),BRONZE));
  P.push(piece(bx(.025,.13,.09,-.115,1.6,.04),BRONZE));
  P.push(piece(bx(.025,.13,.09,.115,1.6,.04),BRONZE));
  if(crete){ P.push(piece(bx(.36,.1,.05,0,1.86,0),'#9E1B14')); }
  /* bras armé et glaive */
  P.push(piece(bx(.1,.3,.11,.27,1.33,0),BLANC,3,1));
  P.push(piece(bx(.085,.28,.09,.27,1.07,.05),PEAU,3));
  P.push(piece(sp(.045,.27,.93,.1,6),PEAU,3));
  P.push(piece(bx(.1,.03,.03,.27,.93,.14),CUIR,3));
  P.push(piece(bx(.045,.02,.55,.27,.93,.43),FER,3));
  /* bras gauche et scutum */
  P.push(piece(bx(.09,.5,.1,-.27,1.25,.05),PEAU,4));
  const scutum=new THREE.CylinderGeometry(.62,.62,1.06,12,1,true,-.56,1.12).translate(-.14,.88,-.2);
  P.push(piece(scutum,BLANC,4,2));
  P.push(piece(bx(.04,.92,.02,-.14,.88,.43),BRONZE,4));
  P.push(piece(sp(.075,-.14,.88,.44,8),BRONZE,4));
  return assembler(P);
}

function modeleGaulois(){
  const P=[];
  for(const [s,part] of [[-1,1],[1,2]]){
    P.push(piece(bx(.11,.07,.22,s*.09,.035,.03),CUIR,part));
    P.push(piece(bx(.12,.8,.14,s*.09,.45,0),'#6A5A3F',part));
  }
  P.push(piece(cy(.21,.27,.42,0,.95,0,12),BLANC,0,1));
  P.push(piece(cy(.2,.22,.42,0,1.33,0,12),BLANC,0,1));
  P.push(piece(cy(.215,.215,.05,0,1.12,0,12),CUIR));
  P.push(piece(new THREE.TorusGeometry(.075,.014,6,14).rotateX(Math.PI/2).translate(0,1.56,0),'#C9A13A'));
  P.push(piece(sp(.108,0,1.66,.01),PEAU));
  const chev=new THREE.SphereGeometry(.118,10,6,0,Math.PI*2,0,Math.PI*.58).translate(0,1.675,-.012);
  P.push(piece(chev,'#8A5A2A'));
  P.push(piece(bx(.19,.2,.05,0,1.6,-.085),'#8A5A2A'));
  P.push(piece(bx(.1,.022,.025,0,1.625,.1),'#7A4E24'));
  P.push(piece(bx(.025,.06,.02,-.05,1.6,.1),'#7A4E24'));
  P.push(piece(bx(.025,.06,.02,.05,1.6,.1),'#7A4E24'));
  /* bras nu et longue épée */
  P.push(piece(bx(.1,.3,.11,.27,1.33,0),PEAU,3));
  P.push(piece(bx(.085,.28,.09,.27,1.07,.05),PEAU,3));
  P.push(piece(sp(.045,.27,.93,.1,6),PEAU,3));
  P.push(piece(bx(.12,.03,.03,.27,.93,.14),CUIR,3));
  P.push(piece(bx(.045,.02,.85,.27,.93,.58),'#B8B8BC',3));
  /* bouclier ovale */
  P.push(piece(bx(.09,.5,.1,-.27,1.25,.05),PEAU,4));
  const ov=new THREE.CylinderGeometry(.5,.5,.035,18).rotateX(Math.PI/2).scale(.62,1.16,1).translate(-.12,.92,.36);
  P.push(piece(ov,BLANC,4,2));
  P.push(piece(bx(.035,.95,.02,-.12,.92,.38),'#5A4426',4));
  P.push(piece(sp(.07,-.12,.92,.39,8),BRONZE,4));
  return assembler(P);
}

/* ---------- modèles lointains : quelques boîtes suffisent à cent pas ---------- */
function modeleLoin(gaulois){
  const P=[];
  for(const [s,part] of [[-1,1],[1,2]]) P.push(piece(bx(.12,.85,.14,s*.09,.43,0),gaulois?'#6A5A3F':PEAU,part));
  P.push(piece(bx(.44,.4,.3,0,.98,0),BLANC,0,1));
  P.push(piece(bx(.4,.42,.26,0,1.36,0),gaulois?BLANC:'#6E6C68',0,gaulois?1:0));
  P.push(piece(bx(.2,.22,.2,0,1.67,0),PEAU));
  P.push(piece(bx(.24,.1,.24,0,1.8,0),gaulois?'#8A5A2A':BRONZE));
  P.push(piece(bx(.1,.55,.11,.27,1.2,.03),gaulois?PEAU:BLANC,3,gaulois?0:1));
  P.push(piece(bx(.045,.02,gaulois?.85:.55,.27,.93,gaulois?.58:.43),FER,3));
  P.push(piece(bx(gaulois?.6:.66,gaulois?1.1:1.06,.05,-.14,.9,.4),BLANC,4,2));
  return assembler(P);
}

/* ---------- le shader commun ---------- */
const GLSL_ANIM=`
attribute vec3 iPos; attribute vec2 iRot; attribute vec4 iAnim; attribute vec3 iTint; attribute vec3 iTint2;
attribute float part; attribute float tintable;
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
function patchSoldat(mat, thrust){
  mat.onBeforeCompile=(sh)=>{
    sh.uniforms.uThrust={ value:thrust };
    sh.vertexShader=sh.vertexShader
      .replace('#include <common>','#include <common>\n'+GLSL_ANIM)
      .replace('#include <beginnormal_vertex>','vec3 objectNormal = anim(vec3( normal ),false);')
      .replace('#include <begin_vertex>','vec3 transformed = anim(vec3( position ),true);')
      .replace('#include <color_vertex>','#include <color_vertex>\n vColor.rgb *= mix(vec3(1.), tintable>1.5?iTint2:iTint, step(.5,tintable));');
  };
}

/* deux niveaux de détail : les hommes proches de la caméra reçoivent le modèle fin */
const LOD_PRES=38;
class Lot{
  constructor(geo,N,thrust){
    const g=new THREE.InstancedBufferGeometry();
    for(const k of ['position','normal','color','part','tintable']) g.setAttribute(k,geo.attributes[k]);
    const A=(n)=>new THREE.InstancedBufferAttribute(new Float32Array(N*n),n).setUsage(THREE.DynamicDrawUsage);
    this.a={ iPos:A(3), iRot:A(2), iAnim:A(4), iTint:A(3), iTint2:A(3) };
    for(const k in this.a) g.setAttribute(k,this.a[k]);
    g.instanceCount=0;
    const m=new THREE.MeshLambertMaterial({ vertexColors:true, side:THREE.DoubleSide });
    patchSoldat(m, thrust);
    this.mesh=new THREE.Mesh(g,m); this.mesh.frustumCulled=false; scene.add(this.mesh);
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
    const om=new THREE.MeshBasicMaterial({ color:0x000000, transparent:true, opacity:.36, depthWrite:false, map:texRonde() });
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
