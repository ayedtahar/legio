/* ============================================================
   RÉSERVE — événements de camp, utilisables dans plusieurs chapitres.
   `ch` : chapitres où l'événement peut tomber.
   ============================================================ */
const COMMUNS = [

{ ch:['helvetii','belgae','oceanus','atuatuca'], t:'Les dés sous la tente', lieu:'Tente huit, après l’extinction',
  x:`Le jeu est interdit par le règlement et pratiqué chaque soir. Ce soir la partie est grosse : un vétéran joue trois mois de solde contre un marchand syrien qui suit l’armée et qui n’a pas l’air de perdre souvent.`,
  nota:`Les dés étaient formellement interdits aux légionnaires, sauf pendant les Saturnales. Les graffiti et les dés plombés retrouvés dans les camps montrent l’exacte portée de cette interdiction.`,
  o:[
  { t:'Jouer',
    check:{ s:'gratia', dc:54 },
    ok:{ r:`Tu sors avec le double de ta mise et la réputation de savoir t’arrêter.`, e:{peculium:250, auctoritas:4} },
    ko:{ r:`Tu perds. Puis tu perds encore en essayant de te refaire, ce qui est la partie la plus prévisible de la soirée.`, e:{peculium:-300} } },
  { t:'Repérer comment triche le Syrien',
    need:{ s:'scientia', min:40 },
    res:{ r:`Dés pipés au mercure. Tu le dis à voix haute. Le marchand quitte le camp cette nuit-là sans son chariot, et l’argent revient à qui de droit.`, e:{scientia:6, auctoritas:11} } },
  { t:'Faire cesser la partie et verser les mises à la caisse funéraire',
    p:'sousoff',
    res:{ r:`Tu ramasses les dés et l’argent. Personne ne discute et deux hommes te remercient le lendemain, discrètement.`, e:{disciplina:7, auctoritas:6, gratia:3} } }
  ]},

{ ch:['belgae','oceanus','atuatuca','vercingetorix','finis'], t:'Le convoi de blé', lieu:'Quarante milles en pays mal tenu',
  x:`On te charge d’escorter deux cents chariots sur quarante milles. Une cavalerie ennemie rôde et sait exactement où passer.`,
  nota:`Le ravitaillement fut la contrainte permanente des campagnes de César : il n’engageait presque jamais sans une base de vivres à portée. Les convois étaient la cible privilégiée des Gaulois, qui refusaient la bataille rangée.`,
  o:[
  { t:'Marcher lentement, en formation serrée autour des chariots',
    res:{ r:`Trois jours au lieu de deux, et deux cents chariots à l’arrivée. Le camp mange.`, e:{disciplina:7, gratia:6, valetudo:-3} } },
  { t:'Envoyer des éclaireurs loin devant et adapter l’itinéraire',
    check:{ s:'scientia', dc:52 },
    ok:{ r:`Tes éclaireurs signalent un rassemblement au gué prévu. Tu passes douze milles plus au nord par un chemin de bergers. Rien ne se passe, ce qui est le meilleur rapport d’escorte possible.`, e:{scientia:8, gratia:7} },
    ko:{ r:`L’itinéraire de contournement est impraticable pour des chariots. Tu perds une journée et tu reviens sur le gué.`, e:{valetudo:-4, gratia:-4} } },
  { t:'Acheter le renseignement à un marchand de sel qui passe chaque semaine',
    res:{ r:`Deux cents deniers à un homme qui sait tout et ne risque rien. Son information est meilleure que celle qu’on paie en sang.`, e:{scientia:6, gratia:5, peculium:-200} } }
  ]},

{ ch:['helvetii','belgae','oceanus','atuatuca','vercingetorix'], t:'Le vieux primipile', lieu:'Sous la tente du premier centurion',
  x:`T. Balventius, primipile, vingt-huit ans de service, deux fois décoré. Il te fait venir sous sa tente et te fait asseoir, ce qui n’arrive jamais.`,
  nota:`Balventius est un personnage réel : César le cite comme <span class="lat">primipilus</span> de l’année précédente, gravement blessé à Atuatuca en 54. Les primipilaires formaient l’ossature technique de l’armée et transmettaient un savoir qui n’était écrit nulle part.`,
  o:[
  { t:'L’écouter jusqu’au bout',
    res:{ r:`Il parle deux heures de choses très concrètes : où placer un homme qui a peur, comment reconnaître qu’une ligne va céder trois minutes avant qu’elle cède, pourquoi on ne court jamais devant ses propres hommes sauf une fois par carrière.`, e:{scientia:11, auctoritas:6, gratia:5} } },
  { t:'Lui demander comment on tient quand on a peur',
    res:{ r:`Il répond que personne ne tient : on fait les gestes, et les gestes tiennent l’homme. Puis il te montre lesquels, lentement, deux fois.`, e:{virtus:10, scientia:5, auctoritas:4} } },
  { t:'Lui demander de te faire entrer dans la première cohorte',
    check:{ s:'gratia', dc:58 },
    ok:{ r:`Il te regarde longtemps. « Je verrai. » Deux mois plus tard, ton nom est sur une liste où il n’aurait pas dû être.`, e:{gratia:13, auctoritas:4} },
    ko:{ r:`« Demande-le encore dans trois ans. » Il ne se fâche pas, ce qui est pire.`, e:{gratia:-6} } }
  ]},

{ ch:['belgae','oceanus','atuatuca','vercingetorix','finis','rubico'], t:'Deux hommes se sont battus', lieu:'Devant ta tente',
  x:`Coups portés au camp, ce qui est un délit grave. L’un est un vétéran indiscipliné mais excellent au combat ; l’autre une jeune recrue qui a raison sur le fond. Le règlement prévoit la bastonnade pour les deux.`,
  nota:`Polybe décrit la <span class="lat">fustuarium</span> : le condamné était battu par ses propres camarades. La discipline romaine reposait sur ce principe — la punition venait du groupe, pas seulement du chef.`,
  o:[
  { t:'Appliquer le règlement aux deux, également',
    res:{ r:`Bastonnade publique. La justice aveugle est impopulaire et tient une unité mieux que la justice clairvoyante.`, e:{disciplina:8, auctoritas:5, gratia:4} } },
  { t:'Les mettre au même contubernium et à la même corvée pendant un mois',
    res:{ r:`Un mois de latrines à deux. Au bout de trois semaines ils se couvrent mutuellement devant toi. C’est la plus vieille méthode de l’armée romaine et elle marche encore.`, e:{auctoritas:12, scientia:4} } },
  { t:'Fermer les yeux',
    check:{ s:'auctoritas', dc:58 },
    ok:{ r:`Tu n’as rien vu. Ils règlent cela entre eux et l’affaire meurt. Un officier qui voit tout ne commande rien.`, e:{auctoritas:8, disciplina:-3} },
    ko:{ r:`Le tribun de service, lui, a vu. C’est toi qu’on interroge sur ta manière de tenir ton monde.`, e:{gratia:-9, auctoritas:-5} } }
  ]},

{ ch:['helvetii','belgae','oceanus','atuatuca','vercingetorix','finis'], t:'Une lettre d’Italie', lieu:'Arrivée du courrier',
  x:`Le courrier a mis quatre mois. Il y a une lettre pour toi, écrite par un scribe public au nom de quelqu’un qui ne sait pas écrire.`,
  nota:`Les tablettes de Vindolanda, en Bretagne, ont conservé ce type de correspondance : nouvelles de famille, demandes de chaussettes et de sous-vêtements, invitations d’anniversaire. La vie ordinaire d’une armée d’occupation.`,
  o:[
  { t:'La lire tout de suite',
    check:{ s:'valetudo', dc:40 },
    ok:{ r:`Des nouvelles ordinaires : la récolte, un mariage, un procès de voisinage. Tu la relis trois fois et tu la ranges dans ton coffre. Cela suffit à tenir un hiver.`, e:{valetudo:10, auctoritas:3} },
    ko:{ r:`Une mort. Vieille de quatre mois, à laquelle tu ne peux rien, et dont personne ici ne peut parler avec toi.`, e:{valetudo:-7} } },
  { t:'Envoyer la moitié de ta solde avec le prochain convoi du questeur',
    res:{ r:`Le convoi prend une commission et arrive à peu près sûrement. Chez toi, cela change tout.`, e:{peculium:-300, valetudo:7, auctoritas:3} } },
  { t:'Écrire les lettres des illettrés de ta centurie pendant trois soirs',
    need:{ s:'scientia', min:38 },
    res:{ r:`Vingt-deux lettres. Tu apprends sur ces hommes en trois soirs ce que six ans de rang ne t’avaient pas appris.`, e:{auctoritas:12, scientia:4} } }
  ]},

{ ch:['oceanus','atuatuca','vercingetorix','finis','rubico','ultima'], t:'Le contractant', lieu:'Magasin du camp',
  x:`Un fournisseur de l’armée — blé, cuir, ferraille — te propose une commission régulière contre des réceptions complaisantes. La somme est sérieuse. Le procédé est universel et sanctionné de mort quand il est découvert, ce qui n’arrive presque jamais.`,
  nota:`Les <span class="lat">publicani</span> adjudicataires des marchés militaires formaient une puissance financière considérable, avec des protections jusqu’au Sénat. Corrompre l’officier de réception était la pratique normale, pas l’exception.`,
  o:[
  { t:'Accepter',
    res:{ r:`L’arrangement dure des années et ne se voit jamais. Tu deviens un homme aisé, avec des cuirs un peu minces sur les épaules de tes hommes.`, e:{peculium:2200, auctoritas:-9, gratia:4} } },
  { t:'Refuser et le dénoncer au questeur',
    res:{ r:`Il est chassé, ses stocks confisqués et redistribués. Trois officiers supérieurs qui étaient dans l’arrangement savent maintenant ton nom.`, e:{virtus:5, auctoritas:11, gratia:-11} } },
  { t:'Refuser sans faire d’histoire',
    res:{ r:`Tu dis non, poliment, et l’affaire s’arrête là. Il ira voir le centurion d’à côté, qui dira oui.`, e:{disciplina:5, scientia:3} } }
  ]},

{ ch:['helvetii','belgae','oceanus','vercingetorix','finis'], t:'Le valetudinarium', lieu:'Infirmerie du camp',
  x:`L’hôpital du camp est plein : dysenterie, fièvres, blessures anciennes. Le médecin manque de vinaigre, de bandes et d’un homme pour tenir les registres.`,
  nota:`Les <span class="lat">valetudinaria</span> légionnaires sont les premiers hôpitaux militaires organisés connus : pavillons à chambres, salle d’opération, égout. L’armée romaine perdait davantage d’hommes par maladie que par le fer, et le savait.`,
  o:[
  { t:'Fournir sur ta bourse ce qui manque',
    res:{ r:`Vinaigre, toile, miel, et un scribe payé un mois. Les morts de fièvre baissent d’un tiers ce trimestre. Personne ne fait le lien, sauf le médecin.`, e:{peculium:-300, auctoritas:13} } },
  { t:'Démontrer que les fièvres viennent du site et faire déplacer le camp',
    need:{ s:'scientia', min:48 },
    res:{ r:`Chiffres à l’appui, tu obtiens un déplacement d’un demi-mille sur un versant sec. C’est de la médecine sans médecine, et cela sauve plus d’hommes qu’une victoire.`, e:{scientia:11, gratia:8, auctoritas:9} } },
  { t:'Prendre ton tour de garde auprès des mourants',
    res:{ r:`Trois nuits. On ne fait rien d’autre que rester là, et c’est apparemment tout ce qu’on demande.`, e:{auctoritas:9, valetudo:-3} } }
  ]},

{ ch:['belgae','oceanus','atuatuca','vercingetorix','finis','rubico','ultima'], t:'Vingt milles avant midi', lieu:'Colonne de marche',
  x:`Marche forcée. Trente kilos par homme. César marche parfois plus vite que ses propres nouvelles, et c’est ce qui l’a fait gagner plus souvent que ses batailles.`,
  nota:`La vitesse de marche fut son arme principale : il fit soixante-dix milles en trois jours pour atteindre le camp de Cicéron, et surprit Pompée à Brindes en couvrant l’Italie plus vite qu’aucune nouvelle.`,
  o:[
  { t:'Marcher en tête avec ton paquetage complet',
    res:{ r:`Un officier qui porte ce que portent ses hommes n’a pas besoin de leur parler.`, e:{disciplina:7, auctoritas:12, valetudo:-5} } },
  { t:'Fermer la colonne et ramasser les traînards',
    res:{ r:`Personne ne se perd, personne ne reste. Le poste de serre-file est le moins glorieux et le plus utile de la colonne.`, e:{auctoritas:10, disciplina:5, valetudo:-3} } },
  { t:'Faire charger meules et pieux sur les mulets, contre le règlement',
    p:'sousoff',
    check:{ s:'scientia', dc:56 },
    ok:{ r:`Ton unité arrive fraîche et personne ne pose de question puisque cela a marché.`, e:{scientia:7, auctoritas:9, valetudo:3} },
    ko:{ r:`Le convoi de mulets prend du retard et ton unité arrive après les autres, sans son matériel de fortification.`, e:{gratia:-8, auctoritas:-4} } }
  ]},

{ ch:['helvetii','belgae','oceanus','atuatuca','vercingetorix'], t:'Un présage', lieu:'Devant l’autel du camp',
  x:`Les poulets sacrés refusent de manger avant le départ, ce qui est un présage détestable. Le camp le sait avant midi.`,
  nota:`Un ancêtre de Claudius Pulcher, dont les poulets refusaient l’augure avant une bataille navale, les fit jeter à la mer : « qu’ils boivent, puisqu’ils ne veulent pas manger ». Il perdit la bataille, et Rome ne l’oublia jamais.`,
  o:[
  { t:'Payer un second sacrifice de ta bourse',
    res:{ r:`Tu obtiens un présage favorable au second essai. C’est du théâtre, tes hommes le savent, et cela marche parce que c’est du théâtre partagé.`, e:{auctoritas:9, gratia:3, peculium:-120} } },
  { t:'Manger toi-même la ration des poulets devant la centurie',
    check:{ s:'auctoritas', dc:56 },
    ok:{ r:`On rit et l’on n’en parle plus.`, e:{auctoritas:11, virtus:4} },
    ko:{ r:`Personne ne rit. Il y a des jours où l’armée romaine est très pieuse, et tu viens d’en trouver un.`, e:{auctoritas:-9, gratia:-4} } },
  { t:'Prendre le présage au sérieux et faire vérifier le terrain',
    res:{ r:`Tu traites l’angoisse comme un renseignement : si les hommes sentent quelque chose, c’est peut-être qu’il y a quelque chose. Tu fais reconnaître deux milles de plus.`, e:{scientia:7, disciplina:4} } }
  ]},

{ ch:['atuatuca','vercingetorix','finis','rubico','ultima'], t:'Le jour de la solde', lieu:'Devant les enseignes',
  x:`Trois fois l’an, le questeur paie devant les enseignes. On retient la nourriture, l’équipement, les vêtements, la caisse funéraire, et une part obligatoire déposée à l’enseigne.`,
  nota:`Le dépôt obligatoire aux enseignes servait autant d’épargne que de garantie contre la désertion : un homme qui partait perdait tout ce qu’il avait accumulé.`,
  o:[
  { t:'Vérifier les retenues ligne par ligne pour ton unité',
    need:{ s:'scientia', min:44 },
    res:{ r:`Tu trouves deux erreurs et une retenue indue sur des bottes jamais livrées. Le questeur corrige de mauvaise grâce. Tes hommes touchent onze deniers de plus, ce qui est énorme.`, e:{scientia:6, auctoritas:14, gratia:-4} } },
  { t:'Déposer ta propre solde à l’enseigne plutôt que la dépenser',
    res:{ r:`L’argent qui dort à l’enseigne est celui qu’on retrouve à la démobilisation. Peu d’hommes ont la patience de le faire.`, e:{disciplina:5, peculium:200} } },
  { t:'La dépenser comme les autres',
    res:{ r:`Le vin est bon et le lendemain la bourse est vide. Tes hommes t’ont vu boire avec eux, ce qui compte davantage que tu ne le crois.`, e:{auctoritas:8, valetudo:4, peculium:-150} } }
  ]}
];

/* ---- branche pompéienne : deux événements, puis la fin ---- */
const POMPEE = {
id:'victis', n:'Victis', sub:'Du côté du Sénat', y0:-48, y1:-48, len:2,
events:[
{ at:0, t:'Pharsale, aile pompéienne', lieu:'Plaine de l’Énipeus', guerre:true,
  x:`Tu es du côté du Sénat, des consulaires et des sept mille cavaliers. En face, il y a les hommes avec qui tu as pris Alésia.<br><br>Toute votre cavalerie doit tourner leur droite. Elle part, superbe — et se heurte à six cohortes surgies de nulle part qui, au lieu de lancer leurs pila, les pointent au visage.`,
  vue:{ soldat:'Tu vois la cavalerie revenir. Pas se replier : revenir en désordre.',
        sousoff:'Vos archers sont découverts. Ils vont être massacrés.',
        centurion:'La droite ennemie n’a pas été tournée. Tout le plan reposait là-dessus.',
        superieur:'Pompée quitte la ligne et rentre à sa tente. Devant tout le monde.' },
  nota:`Pompée se retira sous sa tente et resta assis sans parler jusqu’à ce que les Césariens forcent le camp. César perdit deux cents hommes ; l’armée sénatoriale, six mille, dont la plupart après la rupture de la ligne.`,
  o:[
  { t:'Tenir le flanc découvert avec ce que tu as',
    res:{ r:`Tu refuses le flanc et tu tiens assez pour que l’aile ne soit pas roulée d’un coup. Cela ne sauvera pas la bataille ; cela sauve ta cohorte.`, e:{virtus:9, auctoritas:10, valetudo:-10} } },
  { t:'Décrocher tout de suite vers le camp',
    res:{ r:`Tu sors du piège avant qu’il se referme. Tu es de ceux qui rentreront au camp en ordre, et le camp tombera quand même.`, e:{scientia:6, valetudo:-4, auctoritas:-4} } }
  ]},
{ t:'Le choix du vaincu', lieu:'Colline au-dessus du champ',
  x:`Le camp est pris avec ses tables dressées. Vingt-quatre mille hommes se rendent. César a fait crier qu’il épargne tous les citoyens et qu’il ne veut aucune vengeance.<br><br>Certains le croient. D’autres passent en Afrique pour continuer trois ans encore.`,
  nota:`La <span class="lat">clementia Caesaris</span> fut une politique délibérée et efficace : beaucoup de pardonnés servirent ensuite sous ses enseignes. Quatorze des sénateurs qu’il épargna à Pharsale se trouvaient parmi ses assassins aux ides de mars.`,
  o:[
  { t:'Te rendre et accepter la clémence',
    res:{ r:`Tu déposes les armes. On ne t’insulte pas, on ne te fouille même pas. César t’accueille, te rend un grade — un cran plus bas — et ne mentionnera plus jamais l’affaire. C’est cela qui est difficile à supporter.`, e:{gratia:6, auctoritas:-8}, choix:'venia' } },
  { t:'Passer en Afrique et continuer la guerre',
    note:'Trois ans encore. Il n’y aura au bout ni Caton, ni Labienus, ni camp.',
    res:{ r:`Tu embarques à Corcyre avec Labienus. Il reste l’Afrique puis l’Espagne, et à la fin de ces trois ans il n’y aura plus rien de ce pour quoi tu es parti.`, e:{virtus:8, auctoritas:6, valetudo:-8}, choix:'afrique' } }
  ]}
]};
