/* ============================================================
   EMBLÈMES — silhouettes pleines, lisibles à 18 px
   ============================================================ */
const ICONS = {

/* aigle légionnaire de face, ailes déployées */
aquila:`<circle cx="32" cy="11" r="5.5"/><path d="M36 8l7 3-7 3z"/>
<path d="M28 15h8l-1.5 30h-5z"/>
<path d="M28.5 45h7l-3.5 11z"/>
<path d="M29 18C22 12 13 7 4 5c2 9 7 15 13 19-5-.5-9-1.5-13-3 4 8 11 13 19 15l7-3z"/>
<path d="M35 18c7-6 16-11 25-13-2 9-7 15-13 19 5-.5 9-1.5 13-3-4 8-11 13-19 15l-7-3z"/>
<rect x="19" y="56" width="26" height="5" rx="2"/>`,

/* couronne de laurier */
laurea:`<path d="M32 60C16 53 8 39 8 25c0-7 2-13 5-17 2 6.5.8 12-1 16.5 4-3 9-3 13 .5-5 2-8.5 5.5-10 10.5 4.5-3.5 9.5-4 13.5-1.5-5 3-8 7.5-8.5 13 4-4 9-5.5 13.5-3.5-5 4-7.5 9.5-6.5 16z"/>
<path d="M32 60c16-7 24-21 24-35 0-7-2-13-5-17-2 6.5-.8 12 1 16.5-4-3-9-3-13 .5 5 2 8.5 5.5 10 10.5-4.5-3.5-9.5-4-13.5-1.5 5 3 8 7.5 8.5 13-4-4-9-5.5-13.5-3.5 5 4 7.5 9.5 6.5 16z"/>`,

/* casque à cimier */
galea:`<path d="M32 8c-10 0-17 7-17 16v6h6v-6c0-6.4 5-11 11-11s11 4.6 11 11v6h6v-6c0-9-7-16-17-16z"/>
<path d="M29 2h6v8h-6z"/>
<path d="M24 10h16c3 0 5 1.6 5 4H19c0-2.4 2-4 5-4z"/>
<path d="M15 30h8v14c0 4-1.8 6-4 6s-4-2-4-6z"/>
<path d="M41 30h8v14c0 4-1.8 6-4 6s-4-2-4-6z"/>
<path d="M25 28h14v12c0 6-3 10-7 10s-7-4-7-10z"/>
<rect x="23" y="24" width="18" height="6" rx="2"/>`,

/* caducée */
caduceus:`<rect x="29.5" y="6" width="5" height="52" rx="2.5"/>
<circle cx="32" cy="7" r="5"/>
<path d="M20 14c4-5 9-5 12 0-4-2-8-1.6-12 0z"/>
<path d="M44 14c-4-5-9-5-12 0 4-2 8-1.6 12 0z"/>
<path d="M24 20c-5 2-6 8-1 11s10 3 10 7-5 5-10 8-4 10 1 11" fill="none" stroke-width="6" stroke-linecap="round"/>
<path d="M40 20c5 2 6 8 1 11s-10 3-10 7 5 5 10 8 4 10-1 11" fill="none" stroke-width="6" stroke-linecap="round"/>`,

/* denier */
nummus:`<circle cx="32" cy="32" r="26"/>
<circle cx="32" cy="32" r="21" fill="#16120D"/>
<circle cx="32" cy="28" r="8"/>
<path d="M18 48c2.5-8 7.5-12 14-12s11.5 4 14 12z"/>`,

/* poignée de main */
manus:`<path d="M4 30c0-3 2.4-5 5.4-5H24l-6-6c-2-2-2-5 0-7s5-2 7 0l10 10h5v18h-8l-8 8c-2 2-5 2-7 0l-8-8c-.6-.6-1-1.6-1-2.6z"/>
<path d="M60 30c0-3-2.4-5-5.4-5H40l6-6c2-2 2-5 0-7s-5-2-7 0L29 22h-5v18h8l8 8c2 2 5 2 7 0l8-8c.6-.6 1-1.6 1-2.6z"/>`,

/* glaive */
gladius:`<path d="M32 2 23 16v24h18V16z"/>
<rect x="12" y="40" width="40" height="7" rx="2.5"/>
<rect x="28.5" y="46" width="7" height="12"/>
<circle cx="32" cy="59" r="5"/>`,

/* bouclier */
scutum:`<path d="M32 2C22 2 14 5 10 8v32c0 11 10 18 22 22 12-4 22-11 22-22V8c-4-3-12-6-22-6z"/>
<path d="M32 12v40M14 32h36" stroke="#16120D" stroke-width="3.5" fill="none"/>
<circle cx="32" cy="32" r="8" fill="#16120D"/>
<circle cx="32" cy="32" r="3.5"/>`,

/* balance */
libra:`<rect x="29" y="8" width="6" height="46" rx="2"/>
<rect x="16" y="54" width="32" height="6" rx="2"/>
<circle cx="32" cy="8" r="5"/>
<rect x="8" y="15" width="48" height="5" rx="2.5"/>
<path d="M14 20 4 34h20z"/><path d="M50 20 40 34h20z"/>
<path d="M4 34c0 5 4.5 8.5 10 8.5S24 39 24 34z" fill="#16120D" stroke="currentColor" stroke-width="3"/>
<path d="M40 34c0 5 4.5 8.5 10 8.5S60 39 60 34z" fill="#16120D" stroke="currentColor" stroke-width="3"/>`,

/* rouleau */
volumen:`<rect x="12" y="10" width="40" height="44" rx="3"/>
<path d="M20 20h24M20 28h24M20 36h24M20 44h16" stroke="#16120D" stroke-width="3.5" fill="none" stroke-linecap="round"/>
<circle cx="12" cy="10" r="6"/><circle cx="12" cy="54" r="6"/>
<circle cx="52" cy="10" r="6"/><circle cx="52" cy="54" r="6"/>`,

/* temple */
templum:`<path d="M32 4 4 20h56z"/>
<rect x="6" y="21" width="52" height="5"/>
<rect x="10" y="27" width="7" height="24"/><rect x="21" y="27" width="7" height="24"/>
<rect x="32" y="27" width="7" height="24"/><rect x="43" y="27" width="7" height="24"/>
<rect x="4" y="52" width="56" height="7" rx="2"/>`,

/* vexillum */
vexillum:`<rect x="27" y="4" width="5" height="56" rx="2"/>
<circle cx="29.5" cy="5" r="5"/>
<path d="M32 10h26v28H32z"/>
<path d="M32 38h26l-5 8H32z"/>
<path d="M40 20h10M40 28h10" stroke="#16120D" stroke-width="3.5" fill="none" stroke-linecap="round"/>`,

/* chevrons de promotion */
chevron:`<path d="M32 6 56 30h-12L32 18 20 30H8z"/><path d="M32 26 56 50h-12L32 38 20 50H8z"/>`,

/* cadenas */
sera:`<rect x="12" y="28" width="40" height="30" rx="5"/>
<path d="M20 28v-8c0-6.6 5.4-12 12-12s12 5.4 12 12v8h-7v-8c0-2.8-2.2-5-5-5s-5 2.2-5 5v8z"/>
<circle cx="32" cy="40" r="5" fill="#16120D"/><rect x="29.5" y="42" width="5" height="9" rx="2" fill="#16120D"/>`,

/* enseigne de centurie */
signum:`<rect x="29" y="6" width="6" height="54" rx="2"/>
<circle cx="32" cy="6" r="6"/>
<rect x="16" y="14" width="32" height="6" rx="3"/>
<circle cx="32" cy="30" r="9"/><circle cx="32" cy="30" r="4" fill="#16120D"/>
<circle cx="32" cy="46" r="7"/><circle cx="32" cy="46" r="3" fill="#16120D"/>`,

/* nota */
nota_i:`<circle cx="32" cy="32" r="27"/>
<circle cx="32" cy="19" r="4.5" fill="#16120D"/>
<rect x="28" y="27" width="8" height="22" rx="3" fill="#16120D"/>`,

check:`<path d="M10 33 26 49 54 16" fill="none" stroke-width="9" stroke-linecap="round" stroke-linejoin="round"/>`,

/* sablier */
clepsydra:`<rect x="12" y="4" width="40" height="6" rx="3"/><rect x="12" y="54" width="40" height="6" rx="3"/>
<path d="M18 10c0 12 14 18 14 22s-14 10-14 22h28c0-12-14-18-14-22s14-10 14-22z"/>
<path d="M24 50c2-6 6-9 8-9s6 3 8 9z" fill="#16120D"/>`,

/* buste */
capita:`<circle cx="32" cy="32" r="27"/>
<circle cx="32" cy="24" r="9" fill="#16120D"/>
<path d="M15 50c3-10 9-14 17-14s14 4 17 14z" fill="#16120D"/>`
};

/* ---------- scènes gravées (viewBox large) ---------- */
const SCENES = {
castra:`<defs><linearGradient id="ciel" x1="0" y1="0" x2="0" y2="1">
  <stop offset="0" stop-color="#3B3020"/><stop offset="1" stop-color="#15100A"/></linearGradient></defs>
<rect width="400" height="150" fill="url(#ciel)"/>
<path d="M0 78c40-16 70-6 108-16 34-9 58 4 96-6 34-9 66 6 96-4 40-13 70 2 100-6v104H0z" fill="#221A10" opacity=".85"/>
<path d="M0 96c46-12 78 2 120-8 40-9 70 8 112-2 42-10 78 6 120-6 20-6 34-2 48-6v76H0z" fill="#1A1409"/>
<g fill="#0E0A05">
  <rect x="30" y="86" width="340" height="8"/>
  <g>${[46,86,126,166,206,246,286,326].map(x=>`<path d="M${x} 94V72l5-6 5 6v22z"/>`).join('')}</g>
  <rect x="58" y="52" width="34" height="44"/><path d="M52 54h46l-8-10H60z"/>
  <rect x="300" y="52" width="34" height="44"/><path d="M294 54h46l-8-10h-30z"/>
  <rect x="170" y="66" width="58" height="30"/><path d="M164 68h70l-10-12h-50z"/>
</g>
<g fill="#6B1E1E">
  <path d="M70 30h16v22l-8-5-8 5z"/><path d="M312 30h16v22l-8-5-8 5z"/>
</g>
<g fill="#C79A45" opacity=".55">
  <rect x="76" y="24" width="4" height="10"/><rect x="318" y="24" width="4" height="10"/>
</g>
<g fill="#2A2114" opacity=".7">
  <path d="M0 110h400v40H0z"/>
</g>`,

acies:`<defs><linearGradient id="ciel2" x1="0" y1="0" x2="0" y2="1">
  <stop offset="0" stop-color="#3A2418"/><stop offset="1" stop-color="#160E08"/></linearGradient></defs>
<rect width="400" height="150" fill="url(#ciel2)"/>
<path d="M0 74c50-20 84 4 130-8 44-11 76 10 124-2 44-11 90 8 146-8v94H0z" fill="#221410" opacity=".8"/>
<g fill="#120A06">
  ${[...Array(13)].map((_,i)=>`<path d="M${8+i*31} 150v-34c0-7 5-12 11-12s11 5 11 12v34z"/>`).join('')}
</g>
<g stroke="#0C0704" stroke-width="4" stroke-linecap="round">
  ${[...Array(12)].map((_,i)=>`<line x1="${22+i*31}" y1="106" x2="${16+i*31}" y2="40"/>`).join('')}
</g>
<g fill="#0C0704">
  <rect x="186" y="26" width="7" height="90" rx="2"/>
  <circle cx="189.5" cy="24" r="9"/>
  <rect x="168" y="42" width="44" height="8" rx="3"/>
</g>
<g fill="#6B1E1E"><path d="M196 54h34v26l-17-8-17 8z"/></g>
<g fill="#C79A45" opacity=".45"><circle cx="189.5" cy="24" r="5"/></g>`
};
function scene(nom){
  const s=SCENES[nom]||SCENES.castra;
  return `<svg class="scene" viewBox="0 0 400 150" preserveAspectRatio="xMidYMid slice" aria-hidden="true">${s}</svg>`;
}

function icone(nom, cls){
  const p=ICONS[nom]; if(!p) return '';
  return `<svg class="ic ${cls||''}" viewBox="0 0 64 64" aria-hidden="true">${p}</svg>`;
}

/* ---------- noms romains ---------- */
const PRAENOMINA=['Lucius','Marcus','Gaius','Quintus','Publius','Titus','Sextus','Aulus','Gnaeus','Decimus','Servius','Manius'];
const NOMINA=['Valerius','Cornelius','Fabius','Sempronius','Terentius','Aemilius','Vibius','Petronius','Rutilius','Salvius','Munatius','Oppius','Baebius','Naevius','Aufidius','Varro'];
const COGNOMINA=['Rufus','Severus','Longinus','Crispus','Niger','Priscus','Celsus','Varus','Sabinus','Maximus','Silvanus','Bassus','Tuscus','Marcellus','Gallus','Frugi'];
function nomRomain(){
  const p=PRAENOMINA[Math.floor(Math.random()*PRAENOMINA.length)];
  const n=NOMINA[Math.floor(Math.random()*NOMINA.length)];
  const c=COGNOMINA[Math.floor(Math.random()*COGNOMINA.length)];
  return p+' '+n+' '+c;
}
