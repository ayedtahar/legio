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
