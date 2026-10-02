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
