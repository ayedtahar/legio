/* ============================================================
   MONDE — relief, ciel, lumière, végétation, poussière
   ============================================================ */
let renderer, scene, camera, SC, H;
const SOLEIL=new THREE.Vector3();

const PALETTES={
  ete:{ herbe:['#4E6B2C','#5D7A31','#6B8538','#4A5F27','#7A8A3E'], terre:'#6B5634', ciel:'#5D8FC9', horizon:'#D9D2BD', brume:'#C9C3AE', monts:'#6F7C8C', arbre:['#2F4A1F','#3A5626','#46602C'] },
  sec:{ herbe:['#8C8048','#9A8C50','#A69858','#7F7442','#B0A162'], terre:'#8A7048', ciel:'#6E9BCF', horizon:'#E6D9BC', brume:'#D8CCB0', monts:'#8A8578', arbre:['#4C5A2E','#5A6634','#66703A'] }
};

function initMonde(sc){
  SC=sc; H=sc.relief;
  renderer=new THREE.WebGLRenderer({ antialias:true, powerPreference:'high-performance' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,1.5));
  renderer.setSize(innerWidth,innerHeight);
  renderer.toneMapping=THREE.ACESFilmicToneMapping; renderer.toneMappingExposure=1.05;
  document.getElementById('scene').appendChild(renderer.domElement);
  scene=new THREE.Scene();
  const pal=PALETTES[sc.saison];
  scene.fog=new THREE.FogExp2(new THREE.Color(pal.brume), sc.brume);
  camera=new THREE.PerspectiveCamera(70, innerWidth/innerHeight, .05, 5000);
  scene.add(camera);

  const s=sc.soleil; SOLEIL.set(Math.sin(s.az)*Math.cos(s.el), Math.sin(s.el), Math.cos(s.az)*Math.cos(s.el)).normalize();
  const sun=new THREE.DirectionalLight(0xFFF1DA, 2.4); sun.position.copy(SOLEIL).multiplyScalar(100); scene.add(sun);
  scene.add(new THREE.HemisphereLight(new THREE.Color(pal.ciel), new THREE.Color(pal.terre), 1.15));

  ciel(pal); terrain(pal); monts(pal); vegetation(pal);
  initPoussiere(); initTraits();
  addEventListener('resize',()=>{ camera.aspect=innerWidth/innerHeight; camera.updateProjectionMatrix(); renderer.setSize(innerWidth,innerHeight); });
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
  const p=g.attributes.position, col=new Float32Array(p.count*3);
  const herbes=pal.herbe.map(c=>new THREE.Color(c)), terre=new THREE.Color(pal.terre), c=new THREE.Color();
  for(let i=0;i<p.count;i++){
    const x=p.getX(i), z=p.getZ(i), y=H(x,z); p.setY(i,y);
    const n=fbm(x*.01+40,z*.01+40,3), n2=bruit(x*.08,z*.08);
    const k=Math.floor(clamp(n,0,.999)*herbes.length);
    c.copy(herbes[k]).lerp(herbes[(k+1)%herbes.length], n2*.5);
    const pente=Math.abs(H(x+2,z)-H(x-2,z))+Math.abs(H(x,z+2)-H(x,z-2));
    c.lerp(terre, clamp(pente*.18 + Math.max(0,fbm(x*.02+9,z*.02+2)-.62)*1.6, 0, .7));
    col[i*3]=c.r; col[i*3+1]=c.g; col[i*3+2]=c.b;
  }
  g.setAttribute('color', new THREE.BufferAttribute(col,3)); g.computeVertexNormals();
  const m=new THREE.MeshLambertMaterial({ vertexColors:true });
  /* grain de détail : de près, le sol n'est pas une couleur unie */
  m.onBeforeCompile=(sh)=>{
    sh.vertexShader=sh.vertexShader.replace('#include <common>','#include <common>\nvarying vec3 vW;')
      .replace('#include <worldpos_vertex>','#include <worldpos_vertex>\nvW=(modelMatrix*vec4(transformed,1.)).xyz;');
    sh.fragmentShader=sh.fragmentShader.replace('#include <common>',`#include <common>
      varying vec3 vW;
      float h21(vec2 p){ return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453); }
      float vn(vec2 p){ vec2 i=floor(p),f=fract(p); f=f*f*(3.-2.*f);
        return mix(mix(h21(i),h21(i+vec2(1,0)),f.x),mix(h21(i+vec2(0,1)),h21(i+vec2(1,1)),f.x),f.y); }`)
      .replace('#include <color_fragment>',`#include <color_fragment>
        float g=vn(vW.xz*3.1)*.5+vn(vW.xz*11.)*.3+vn(vW.xz*.7)*.2;
        diffuseColor.rgb*=.78+.44*g;`);
  };
  scene.add(new THREE.Mesh(g,m));
}

function monts(pal){
  const g=new THREE.CylinderGeometry(2600,2600,1,96,6,true), p=g.attributes.position;
  for(let i=0;i<p.count;i++){
    const x=p.getX(i), z=p.getZ(i), a=Math.atan2(z,x), y0=p.getY(i);
    const h= y0>0 ? 60+260*fbm(Math.cos(a)*3+5, Math.sin(a)*3+5, 5) : -40;
    p.setY(i,h);
  }
  g.computeVertexNormals();
  const m=new THREE.MeshLambertMaterial({ color:new THREE.Color(pal.monts), side:THREE.BackSide });
  scene.add(new THREE.Mesh(g,m));
}

function vegetation(pal){
  /* touffes d'herbe et de chaumes, en triangles croisés */
  const tg=new THREE.BufferGeometry(), pos=[], cl=[];
  for(let k=0;k<3;k++){ const a=k*Math.PI/3, cx=Math.cos(a)*.18, cz=Math.sin(a)*.18;
    pos.push(-cx*.6,0,-cz*.6, cx*.6,0,cz*.6, cx*.2,.36,cz*.2);
    cl.push(.8,.8,.7, .8,.8,.7, 1.35,1.3,1.05); }
  tg.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));
  tg.setAttribute('color',new THREE.Float32BufferAttribute(cl,3)); tg.computeVertexNormals();
  const N=90000, herbe=new THREE.InstancedMesh(tg,new THREE.MeshLambertMaterial({vertexColors:true, side:THREE.DoubleSide}),N);
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
  const T=new THREE.InstancedMesh(tronc,new THREE.MeshLambertMaterial({color:0x4A3826}),nb);
  const F=new THREE.InstancedMesh(houp,new THREE.MeshLambertMaterial({color:0xffffff, flatShading:true}),nb);
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
  const mesh=new THREE.InstancedMesh(mergeGeo([g,pointe]), new THREE.MeshLambertMaterial({color:0x8A7652}), 700);
  mesh.frustumCulled=false; scene.add(mesh);
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
