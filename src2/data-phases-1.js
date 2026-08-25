/* ============================================================
   CHAPITRES I – III  ·  58 – 56 av. J.-C.
   o[].p = portée minimale (soldat par défaut)
   ============================================================ */

const PHASES = [

/* ==================== I. SACRAMENTVM ==================== */
{
id:'sacramentum', n:'Sacramentum', sub:'Genava, sur le Rhône', y0:-58, y1:-58, len:5,
events:[

{ at:0, t:'Probatio', lieu:'Bureau du tribun, camp de Genava',
  x:`Le tribun mesure ta taille, vérifie tes dents, contrôle que tu es citoyen romain. Puis vient le <span class="lat">sacramentum</span> : le serment qui te lie pour seize ans. On te donne trois pièces d’argent, le <span class="lat">viaticum</span>, et un numéro dans un rôle.`,
  nota:`La <span class="lat">probatio</span> contrôlait la taille, la santé et la citoyenneté. Le service légionnaire sous César durait seize ans ; Auguste le portera à vingt. Sur dix engagés, trois ne verront pas la fin.`,
  o:[
  { t:'Présenter la lettre de recommandation de ton patron',
    note:'On te classe avant d’avoir rien fait — et les autres recrues le voient.',
    res:{ r:`Le tribun la lit sans hâte, hoche la tête, inscrit ton nom à part. Un nom noté à part, c’est déjà un pas. Les hommes du rang, eux, ont remarqué.`, e:{gratia:9, auctoritas:-4} } },
  { t:'Prêter serment le premier, à voix forte',
    res:{ r:`Ta voix porte au-dessus des autres. Le centurion instructeur te regarde une seconde de trop. Les recrues aussi.`, e:{disciplina:6, auctoritas:6} } },
  { t:'Ne rien tenter, te fondre dans le rang',
    res:{ r:`Personne ne retient ton nom. C’est souvent la meilleure façon de survivre au premier mois.`, e:{valetudo:5, disciplina:3} } }
  ]},

{ t:'Ad palum', lieu:'Terrain d’exercice',
  x:`Six heures par jour contre un poteau de bois, avec un bouclier d’osier et un glaive de bois deux fois plus lourds que les vrais. <em>Pointe, ne taille pas.</em> C’est la seule leçon, répétée mille fois.`,
  nota:`L’entraînement au <span class="lat">palus</span> employait des armes de bois au double du poids réel. La doctrine romaine privilégiait l’estoc : deux pouces de fer dans le ventre suffisent, et l’estoc découvre moins le flanc que le coup de taille.`,
  o:[
  { t:'Doubler ta ration d’exercice, le soir, seul',
    res:{ r:`Tes mains saignent, mais ton poignet apprend l’angle. Le corps retient ce que la tête oublie.`, e:{virtus:8, scientia:3, valetudo:-3} } },
  { t:'Payer une amphore de vin au campidoctor',
    res:{ r:`Il corrige ta garde en dix minutes, ce que six mois ne t’auraient pas appris. Tout s’achète au camp, même le savoir.`, e:{scientia:8, virtus:4, peculium:-40} } },
  { t:'Apprendre à nager avec les Cisalpins du contubernium',
    res:{ r:`Le Rhône est glacé et personne ne t’a demandé de le traverser. Un jour, quelqu’un le fera.`, e:{scientia:6, auctoritas:5, valetudo:-2} } }
  ]},

{ t:'Gradus militaris', lieu:'Route de la Province',
  x:`Vingt milles en cinq heures, avec trente kilos sur l’épaule : armes, pieu, meule, outils, rations de seize jours. On appelle cela une <span class="lat">mulus Marianus</span> — une mule de Marius. Un homme de ton contubernium s’effondre au quatorzième mille.`,
  nota:`Végèce donne le pas militaire à vingt milles romains — environ vingt-neuf kilomètres — en cinq heures d’été, chargé. Marius avait fait porter le barda par l’homme plutôt que par le train, doublant la vitesse de marche des légions.`,
  o:[
  { t:'Le porter, quitte à finir vidé',
    check:{ s:'valetudo', dc:64 },
    ok:{ r:`Tu le traînes jusqu’au camp. Le contubernium n’oublie pas ce genre de dette : huit hommes, une tente, une meule — et désormais une créance sur toi qui joue dans l’autre sens.`, e:{auctoritas:11, valetudo:-5} },
    ko:{ r:`Vous tombez tous les deux au dix-septième mille. Le campidoctor vous fait finir la marche en courant, sous les yeux de la colonne.`, e:{auctoritas:5, valetudo:-9, disciplina:-3} } },
  { t:'Rester au pas, ne pas rompre le rang',
    note:'Il sera ramassé par la voiture des bagages. Et il le saura.',
    res:{ r:`L’instructeur note ta tenue. L’homme est ramassé par le train, vivant, et ne te regardera plus jamais tout à fait pareil.`, e:{disciplina:9, auctoritas:-6} } },
  { t:'Forcer l’allure et doubler la tête de colonne',
    check:{ s:'virtus', dc:56 },
    ok:{ r:`Tu arrives dans les premiers, presque sec. Le tribun demande ton nom au centurion, qui le lui donne.`, e:{virtus:7, gratia:6, valetudo:-3} },
    ko:{ r:`Tu craques au dernier mille et termines cassé en deux, à vomir sur le bas-côté. Le camp voit tout, toujours.`, e:{valetudo:-7, auctoritas:-5} } }
  ]},

{ t:'Le compte du signifer', lieu:'Sous l’enseigne de la centurie',
  x:`Première solde. Le <span class="lat">signifer</span> tient le registre : sur tes soixante-quinze deniers du quadrimestre, il retient le blé, les bottes, le foin, la literie, la caisse des Saturnales et la contribution funéraire. Reste dix-sept.`,
  nota:`Des papyrus de solde retrouvés en Égypte détaillent ces retenues — <span class="lat">in victum, caligas, fascias, saturnalicium</span>. Le signifer gérait aussi la caisse d’épargne obligatoire de la centurie : c’était le trésorier autant que le porte-enseigne.`,
  o:[
  { t:'Contester le compte ligne par ligne',
    check:{ s:'scientia', dc:48 },
    ok:{ r:`Tu relèves une erreur sur le foin. Le signifer corrige, sec, et te déteste désormais avec précision.`, e:{peculium:45, scientia:5, gratia:-7} },
    ko:{ r:`Tu t’emmêles dans les chiffres. Il te fait répéter devant la file entière. Rire général.`, e:{auctoritas:-7, gratia:-4} } },
  { t:'Payer et te taire',
    res:{ r:`Tu signes. C’est ainsi que fonctionne l’armée : ce n’est pas ton argent, c’est un dépôt qu’on te rendra si tu vis.`, e:{disciplina:5} } },
  { t:'Proposer de tenir le registre à sa place les soirs de garde',
    need:{ s:'scientia', min:34 },
    res:{ r:`Il te tend le stylet en haussant les épaules. Le <span class="lat">tabularium</span> est une porte, et tu viens d’y mettre le pied.`, e:{scientia:10, gratia:7} } }
  ]},

{ t:'Le bizutage du contubernium', lieu:'Tente huit, deuxième centurie',
  x:`Huit hommes, une tente, une meule, une mule. Ils ont vidé ton sac pendant ta garde et attendent de voir ce que tu feras de ton bol brisé.`,
  nota:`Le <span class="lat">contubernium</span> — huit hommes partageant tente et repas — était l’unité de vie réelle du légionnaire. On y mangeait, on y dormait, on y mourait ensemble ; la cohésion de la légion se fabriquait à cette échelle.`,
  o:[
  { t:'Trouver qui a fait le coup et le corriger devant les autres',
    check:{ s:'virtus', dc:52 },
    ok:{ r:`Tu le mets à terre en trois échanges et tu lui tends la main. La tente a sa réponse : on peut compter sur toi, et il ne faut pas te chercher.`, e:{virtus:6, auctoritas:9, valetudo:-3} },
    ko:{ r:`Tu te trompes d’homme. Il te rend coup pour coup et la tente entière rit de toi pendant six semaines.`, e:{auctoritas:-9, valetudo:-4} } },
  { t:'Rire, partager ton vin et n’en plus parler',
    res:{ r:`Tu paies une tournée sur ton viatique. Au matin, ton bol est remplacé par un autre, volé à la centurie voisine. C’est de l’amitié, à leur manière.`, e:{auctoritas:7, gratia:-2, peculium:-30} } },
  { t:'Le signaler au tesserarius',
    note:'Le règlement te donne raison. Sept hommes te donneront tort pendant seize ans.',
    res:{ r:`L’affaire est traitée, deux hommes sont punis, et tu dors désormais dans une tente où personne ne te parle. Le règlement a été appliqué.`, e:{disciplina:8, auctoritas:-12} } }
  ]},

{ t:'La question du blé', lieu:'Magasin du camp',
  x:`Le blé livré par le contractant est coupé de son et d’ivraie. Tout le monde le sait, personne ne le dit : le fournisseur a des protections jusque chez les tribuns.`,
  nota:`L’approvisionnement passait par des <span class="lat">publicani</span> adjudicataires. La fraude sur la qualité était endémique, et les officiers touchaient souvent une commission pour fermer les yeux.`,
  o:[
  { t:'Le signaler au centurion',
    res:{ r:`Il te regarde longuement. « Je sais. » Puis il fait remplacer le lot pour ta centurie seulement, et tu comprends d’un coup comment fonctionne réellement une armée.`, e:{scientia:6, gratia:-4, auctoritas:5} } },
  { t:'Trier le grain toi-même et apprendre à reconnaître l’ivraie',
    res:{ r:`Trois soirs à trier. Tu sais désormais ce qu’un lot vaut d’un coup d’œil — un savoir qui servira longtemps.`, e:{scientia:7, valetudo:-2} } },
  { t:'Racheter du bon grain aux marchands qui suivent l’armée',
    res:{ r:`Tu paies et tu manges correctement. Deux hommes de la tente te demandent de leur en prendre aussi.`, e:{valetudo:7, auctoritas:4, peculium:-60} } }
  ]}
]},

/* ==================== II. HELVETII ==================== */
{
id:'helvetii', n:'Helvetii', sub:'La première campagne', y0:-58, y1:-58, len:6,
events:[

{ at:0, t:'Le rempart de Genève', lieu:'Rive gauche du Rhône',
  x:`Le proconsul est arrivé de Rome en huit jours — on dit qu’il a crevé des chevaux. Il n’a qu’une légion : la tienne. Il fait couper le pont et bâtir dix-neuf milles de rempart contre trois cent mille Helvètes qui veulent traverser.`,
  nota:`César décrit lui-même cet ouvrage : dix-neuf milles de muraille et de fossé de seize pieds, bâtis en quelques semaines. Le génie fut son arme la plus constante — plus décisive, en Gaule, que le glaive.`,
  o:[
  { t:'Prendre le pieu et creuser sans lever la tête',
    res:{ r:`Fossé, palissade, redoutes. Tu ne sais toujours pas te battre, mais tu sais bâtir un mur en une nuit, et cela tuera plus de Gaulois que ton glaive.`, e:{disciplina:8, scientia:4, valetudo:-3} } },
  { t:'Te faire affecter aux équipes d’arpentage',
    need:{ s:'scientia', min:38 },
    res:{ r:`On te met à la corde et à la <span class="lat">groma</span>. Tracer un camp est un métier ; tu l’apprends de l’homme qui l’exerce depuis vingt ans.`, e:{scientia:11, gratia:5} } },
  { t:'Te porter volontaire pour les postes avancés',
    check:{ s:'virtus', dc:50 },
    ok:{ r:`Trois nuits à guetter sur la rive. Tu vois les premiers Helvètes de ta vie, à cinquante pas, qui te regardent aussi.`, e:{virtus:7, scientia:4, valetudo:-2} },
    ko:{ r:`Une sortie nocturne te surprend au poste. Tu t’en tires en courant, ce qui est raisonnable et qu’on ne te pardonnera pas tout de suite.`, e:{valetudo:-6, auctoritas:-5} } }
  ]},

{ at:2, t:'Bibracte', lieu:'Pente au-dessus de la plaine éduenne', guerre:true,
  x:`Ils ont contourné le rempart par le pays séquane. Nous les suivons depuis quinze jours. Ce matin, César a fait retirer tous les chevaux du champ, à commencer par le sien : <em>que nul n’ait d’espoir dans la fuite.</em><br><br>La colline est derrière nous. Les Helvètes montent en phalange, boucliers imbriqués.`,
  vue:{ soldat:'Tu vois trois rangs de boucliers gaulois et la buée de leur souffle.',
        sousoff:'Ta centurie est en deuxième ligne. Les hommes serrent trop les coudes.',
        centurion:'Ta cohorte tient le centre-droit. La pente joue pour nous.',
        superieur:'Toute la première ligne est engagée. La deuxième attend à cinquante pas.' },
  nota:`Le <span class="lat">pilum</span> avait une hampe de fer doux qui pliait à l’impact : il ne pouvait être renvoyé, et il condamnait le bouclier qu’il traversait. À Bibracte, les Helvètes durent jeter des boucliers cloués deux à deux et combattre à découvert.`,
  o:[
  { t:'Lancer à vingt-cinq pas, au commandement',
    note:'Deux fois plus mortel. Et plus rien entre eux et toi si le rang flanche.',
    check:{ s:'disciplina', dc:54 },
    ok:{ r:`La volée part à bout portant. La phalange s’ouvre comme un fruit : les boucliers percés se collent, les Helvètes les jettent et se battent à découvert.`, e:{disciplina:6, virtus:5, gratia:4} },
    ko:{ r:`Deux hommes lancent trop tôt, le reste suit en désordre. La volée s’éparpille et la phalange arrive presque intacte sur les boucliers.`, e:{valetudo:-7, auctoritas:-4} } },
  { t:'Lancer tôt, sûrement, garder le rang',
    res:{ r:`Volée propre à soixante pas. Moins d’effet, mais le rang n’a pas bougé d’un pouce et le second pilum reste en main.`, e:{disciplina:6, virtus:2} } },
  { t:'Décaler la cohorte pour prendre la phalange en écharpe',
    p:'centurion', need:{ s:'scientia', min:48 },
    res:{ r:`Tu fais glisser la cohorte de vingt pas sur la droite pendant qu’ils montent. La volée les prend de biais, sur le flanc non couvert. Un légat te montre du doigt à César.`, e:{scientia:7, auctoritas:6, gratia:10} } },
  { t:'Faire face à droite quand les Boïens tombent sur le flanc',
    p:'sousoff',
    check:{ s:'auctoritas', dc:58 },
    ok:{ r:`Une vingtaine d’hommes pivotent avec toi. Le petit front improvisé tient assez longtemps pour que la troisième ligne arrive. César ordonnera la même manœuvre trois minutes plus tard.`, e:{auctoritas:10, virtus:6, gratia:7, valetudo:-4} },
    ko:{ r:`Tu pivotes ; peu te suivent. On te bouscule, tu perds ton bouclier et l’on te ramasse dix pas en arrière.`, e:{valetudo:-10, auctoritas:-4, vulnus:1} } }
  ]},

{ t:'Les chariots', lieu:'Laager helvète, à la nuit', guerre:true,
  x:`Le combat a duré de la septième heure au soir sans qu’un seul Helvète montre le dos. La nuit tombée, ils se replient sur leur <span class="lat">laager</span> : des milliers de chariots rangés en muraille, où les femmes tendent des javelots par-dessous.`,
  vue:{ soldat:'Tu ne sens plus tes bras. On te tend une outre d’eau tiède.',
        sousoff:'Les enseignes sont regroupées. Il manque un homme sur dix.',
        centurion:'La cohorte peut encore donner une heure, pas deux.',
        superieur:'Forcer cette nuit, ou attendre le jour et la reddition.' },
  nota:`Sur trois cent soixante-huit mille partis, César dit qu’il en rentra cent dix mille. Il les renvoya reconstruire leurs villages : un pays vide se serait rempli de Germains, et il valait mieux des Helvètes vaincus qu’un vide à la frontière.`,
  o:[
  { t:'Forcer le laager dans la nuit',
    note:'Le butin est réel. Ce qui se passe entre les timons ne se raconte pas au camp.',
    res:{ r:`On arrache les chariots à la main sous les javelots lancés à bout portant par des gens qui n’ont plus rien à perdre. Le camp est pris avant l’aube.`, e:{virtus:6, peculium:220, valetudo:-8, auctoritas:3} } },
  { t:'Investir et attendre le jour',
    res:{ r:`On dort en armes, à cent pas. Au matin, ce qui reste se rend. Tes hommes sont tous vivants et la part de butin est maigre.`, e:{disciplina:6, valetudo:3, peculium:70} } },
  { t:'Poster des piquets sur les routes du nord',
    p:'centurion',
    res:{ r:`Six mille Verbigènes tentent de gagner le Rhin dans la nuit ; tes piquets les cueillent. César apprend qu’un officier avait prévu ce qu’il n’avait pas ordonné.`, e:{scientia:7, gratia:11} } }
  ]},

{ at:4, t:'Arioviste', lieu:'Plaine d’Alsace, près du Rhin', guerre:true,
  x:`À Besançon, la panique a pris l’armée : les marchands racontaient la taille des Germains, leur regard qu’on ne peut soutenir. Des tribuns demandaient des congés en pleurant.<br><br>César a dit qu’il partirait avec la Dixième seule, s’il le fallait, et qu’elle lui servirait de garde. Ta légion en est encore ivre d’orgueil. Ils chargent si vite qu’il n’y a pas de place pour lancer les <span class="lat">pila</span>.`,
  vue:{ soldat:'Un homme énorme, torse nu, saute sur les boucliers devant toi.',
        sousoff:'Ta centurie recule d’un pas sous le choc. Un pas seulement.',
        centurion:'Le choc est frontal partout. Leur aile gauche est la plus mince.',
        superieur:'César commande en personne l’aile droite, face au point faible.' },
  nota:`Les prêtresses germaines avaient tiré les sorts : Arioviste ne devait pas combattre avant la nouvelle lune. César attaqua donc immédiatement. Le <span class="lat">gladius</span>, arme de vingt pouces faite pour la pointe, se révéla supérieur dans la presse à l’épée longue germaine.`,
  o:[
  { t:'Jeter la hampe et prendre le glaive dans le même mouvement',
    res:{ r:`Tu es au fer avant qu’il t’atteigne. Vingt pouces, dans la presse, à hauteur de ventre. L’arme fait son travail.`, e:{virtus:8, valetudo:-4} } },
  { t:'Reculer d’un pas pour laisser retomber ceux qui sautent',
    need:{ s:'scientia', min:40 },
    res:{ r:`Le rang s’ouvre d’un pas, le Germain tombe dans le vide entre les boucliers, et trois pointes le trouvent avant qu’il touche terre. Un vieux te tape sur le casque en riant.`, e:{scientia:7, virtus:4, auctoritas:4} } },
  { t:'Porter l’effort sur leur aile gauche',
    p:'centurion',
    check:{ s:'auctoritas', dc:60 },
    ok:{ r:`Tu pousses là où c’est mou. L’aile gauche germanique se replie sur ses chariots et la ligne entière commence à se tordre.`, e:{auctoritas:8, scientia:5, gratia:9} },
    ko:{ r:`L’effort s’enlise. Ta cohorte est en pointe et prend des coups des deux côtés à la fois.`, e:{valetudo:-9, auctoritas:-5, vulnus:1} } },
  { t:'Ouvrir les intervalles pour laisser passer la réserve',
    p:'sousoff',
    res:{ r:`Les centuries s’écartent en quinconce, la réserve de Crassus passe au travers et prend le combat. Les hommes épuisés s’asseyent littéralement sur place.`, e:{disciplina:8, auctoritas:6, gratia:4} } }
  ]},

{ t:'Jusqu’au Rhin', lieu:'Cinq milles de poursuite', guerre:true,
  x:`Ils cassent et fuient vers le fleuve. Arioviste trouve une barque et passe ; ses deux femmes et une de ses filles meurent dans la fuite. La cavalerie fait le reste.`,
  nota:`César écrit que la poursuite se fit sur cinquante milles jusqu’au Rhin. Les chiffres qu’il donne — quatre-vingt mille morts — sont ceux d’un homme qui rédige son propre rapport pour le Sénat et l’opinion romaine.`,
  o:[
  { t:'Poursuivre jusqu’au fleuve sans regarder derrière',
    res:{ r:`Vous atteignez la rive. Ce qui se passe entre l’eau et le rang, on n’en parle pas au camp. Le butin, si.`, e:{virtus:4, peculium:280, valetudo:-4} } },
  { t:'Rassembler ton monde et rentrer en ordre',
    note:'Moins de butin. Les vétérans remarquent autre chose.',
    res:{ r:`Tu ramènes tes hommes complets, en rang, avec leurs armes. Un centurion de la première cohorte te regarde passer et retient ton visage.`, e:{auctoritas:9, disciplina:6, gratia:3} } }
  ]},

{ t:'Le premier hiver', lieu:'Quartiers d’hiver, chez les Séquanes',
  x:`Des baraques de bois à la place des tentes, un four, une infirmerie. On répare, on recoud, on enterre proprement ceux qu’on avait enterrés vite. Les lettres d’Italie arrivent par paquets de trois mois.`,
  nota:`Les <span class="lat">hiberna</span> occupaient plus de la moitié de l’année. C’est là que se faisait l’essentiel de la vie militaire : réparation, instruction, comptes, et l’intrigue de camp qui décidait des carrières.`,
  o:[
  { t:'Refaire ton équipement de fond en comble',
    res:{ r:`Cotte recloutée, semelles, courroies, fourreau. Un hiver d’atelier qui vaudra cher au printemps.`, e:{disciplina:5, valetudo:8, peculium:-70} } },
  { t:'Passer l’hiver à te faire voir des officiers',
    res:{ r:`Dîners, chasses, parties de dés perdues à propos. Un hiver bien employé vaut deux batailles pour un cursus.`, e:{gratia:11, auctoritas:-3, peculium:-150} } },
  { t:'Écouter les vieux refaire les batailles sur le sable',
    res:{ r:`Ils te montrent où placer un homme qui a peur, et comment reconnaître qu’une ligne va céder trois minutes avant qu’elle cède.`, e:{scientia:9, auctoritas:4} } },
  { t:'Soigner réellement tes blessures',
    res:{ r:`Trois mois sans marcher. Le médecin grec de la légion recoud correctement ce qui avait été recousu vite.`, e:{valetudo:20, gratia:-3}, soin:1 } }
  ]}
]},

/* ==================== III. BELGAE ==================== */
{
id:'belgae', n:'Belgae', sub:'Le pays des Belges et l’Océan', y0:-57, y1:-56, len:6,
events:[

{ at:0, t:'Le camp sur l’Aisne', lieu:'Chez les Rèmes',
  x:`Deux légions neuves sont arrivées de Cisalpine. Les vétérans les regardent comme on regarde du blé vert. Les Belges se sont ligués : on parle de trois cent mille hommes en armes.<br><br>Le camp sur l’Axona est un ouvrage de manuel : fossé de dix-huit pieds, deux redoutes, un pont gardé.`,
  nota:`César ne livrait bataille que sur un terrain qu’il avait fabriqué. Le camp romain, retranché chaque soir même en marche, était moins un abri qu’une pièce de manœuvre : il permettait de refuser le combat jusqu’au moment choisi.`,
  o:[
  { t:'Tenir le gué et interdire le passage',
    check:{ s:'virtus', dc:54 },
    ok:{ r:`Le gué reste romain. Ils s’y écrasent par vagues, en aveugle, et rebroussent.`, e:{virtus:7, gratia:6, valetudo:-3} },
    ko:{ r:`Un groupe passe cent pas plus bas pendant que tu regardes le gué. On te le fait remarquer, et pas doucement.`, e:{gratia:-6, valetudo:-5} } },
  { t:'Reconnaître la rive avant de te poster',
    res:{ r:`Tu trouves deux passages à sec en aval que personne n’avait signalés, et tu les fais garnir avant de tenir le tien.`, e:{scientia:9, gratia:6} } },
  { t:'Fortifier ton poste avant toute chose',
    p:'sousoff',
    res:{ r:`Fossé, pieux, une nuit de travail. Au matin, l’attaque bute sur un ouvrage qui n’existait pas la veille.`, e:{disciplina:7, auctoritas:6, valetudo:-3} } }
  ]},

{ at:1, t:'La Sambre — sac à terre', lieu:'Sabis, chez les Nerviens', guerre:true,
  x:`Le pire jour de la guerre des Gaules. Nous bâtissions le camp au-dessus de la rivière, sacs à terre, quand soixante mille Nerviens sont sortis du bois d’un seul coup.<br><br>Pas de ligne, pas de trompettes, pas d’ordre reçu. César fait dresser l’étendard rouge et court d’un point à l’autre en parlant à qui il croise.`,
  vue:{ soldat:'Ton casque est sur ton sac, à trente pas, sous le sac d’un autre.',
        sousoff:'Tes hommes sont éparpillés sur trois cents pas de chantier.',
        centurion:'Aucun ordre ne viendra. C’est toi qui commandes, maintenant, et pour de bon.',
        superieur:'Deux légions sont coupées. On ne voit rien de l’aile gauche.' },
  nota:`César raconte qu’il n’eut le temps ni de faire sonner, ni de donner le mot d’ordre, ni de ranger la ligne : chaque homme se forma sur l’enseigne la plus proche. C’est cette capacité à se recomposer sans ordre qui distinguait une légion d’une foule armée.`,
  o:[
  { t:'Te ranger à la première enseigne venue, pas à la tienne',
    note:'La règle est de rejoindre sa propre centurie. La règle vaut moins qu’une minute.',
    res:{ r:`Tu te ranges sous une enseigne inconnue, avec des hommes que tu ne connais pas — et le front existe. C’est exactement ce que la légion sait faire et que rien d’autre au monde ne sait faire.`, e:{disciplina:8, virtus:5, valetudo:-4} } },
  { t:'Perdre trente secondes à lacer casque et découvrir le bouclier',
    res:{ r:`Trente secondes. Tu arrives au rang équipé comme il faut quand la moitié se bat tête nue. Cela se paiera à la troisième heure de combat.`, e:{scientia:5, valetudo:9, auctoritas:-3} } },
  { t:'Rameuter à la voix tout ce qui passe',
    p:'sousoff',
    check:{ s:'auctoritas', dc:60 },
    ok:{ r:`Ta voix porte au-dessus du bruit. Cent cinquante hommes de quatre centuries différentes se rangent sur toi. Il y a désormais un front là où il n’y avait qu’un chantier.`, e:{auctoritas:13, gratia:9, virtus:4, valetudo:-4} },
    ko:{ r:`Tu cries dans un vacarme où l’on ne s’entend pas à cinq pas. Tu finis par te battre avec trois hommes, dos à un chariot.`, e:{valetudo:-10, vulnus:1} } }
  ]},

{ at:2, t:'La Douzième meurt', lieu:'Aile gauche, Sabis', guerre:true,
  x:`La XII a tous ses centurions à terre, son porte-aigle de la quatrième cohorte tué, l’enseigne perdue, le primipile Sextius Baculus percé de coups au point de ne plus tenir debout.<br><br>Les rangs se sont tassés les uns dans les autres : les hommes ne peuvent plus lever le bras.`,
  vue:{ soldat:'Devant toi, un rang de dos. Personne ne frappe plus, la presse est trop forte.',
        sousoff:'L’enseigne de la centurie voisine est à terre. Personne ne la relève.',
        centurion:'La XII est un bloc compressé qui ne combat plus. Elle va se faire égorger sur place.',
        superieur:'César a pris un bouclier à un homme du dernier rang et est entré dans la ligne à pied.' },
  nota:`Sextius Baculus, primipile de la XII, survécut à ce jour et reparaîtra deux fois dans les <span class="lat">Commentarii</span>, chaque fois blessé et chaque fois debout. César dit qu’il fit lui-même ouvrir les rangs pour que les hommes pussent se servir de leur glaive.`,
  o:[
  { t:'Aller chercher l’enseigne tombée',
    note:'Tu la relèveras. Tu prendras un coup en le faisant : c’est certain, pas probable.',
    res:{ r:`Tu la relèves et tu la portes en avant de trois pas. Trois pas, et deux cents hommes qui se croyaient morts se remettent à frapper. Une pointe t’ouvre l’épaule au passage. On te fera raconter cela pendant vingt ans.`, e:{virtus:11, auctoritas:14, gratia:12, valetudo:-12, vulnus:1} } },
  { t:'Élargir les rangs pour qu’on puisse frapper',
    need:{ s:'scientia', min:46 },
    res:{ r:`Tu fais ouvrir les rangs et reculer les enseignes pour donner de l’air. Les hommes retrouvent la place de leur bras droit. C’est précisément ce que César ordonne à l’autre bout de la ligne, au même instant.`, e:{scientia:11, auctoritas:9, gratia:10, valetudo:-3} } },
  { t:'Tenir le rang et frapper ce qui vient',
    res:{ r:`Tu tiens ta place dans la presse et tu frappes dans les intervalles. Rien d’héroïque : la ligne existe encore à la fin de l’heure grâce à trois cents hommes qui ont fait exactement cela.`, e:{disciplina:8, virtus:4, valetudo:-7} } },
  { t:'Faire relever les blessés pendant que la X revient à revers',
    p:'centurion',
    note:'Aucun avantage tactique. Six cents hommes vivront.',
    res:{ r:`Tu détaches deux centuries pour tirer les blessés de la presse pendant que le reste avance. La XII s’en souviendra ; le rapport de bataille, non.`, e:{auctoritas:12, gratia:-3, valetudo:-4} } }
  ]},

{ t:'Cinquante-trois mille têtes', lieu:'Oppidum des Aduatuques',
  x:`Les Aduatuques ont rendu leurs armes par-dessus le mur, puis tenté une sortie la nuit venue avec les armes cachées. Au matin, César a vendu la ville entière : cinquante-trois mille têtes, adjugées d’un seul lot au marchand qui suit l’armée.`,
  nota:`Le chiffre est de César lui-même. Les marchands d’esclaves suivaient les armées et achetaient en gros sur le champ ; le produit était réparti entre le général, le trésor et les hommes. C’était une part normale de la solde.`,
  o:[
  { t:'Prendre ta part et n’y plus penser',
    res:{ r:`Ta part est comptée et versée. C’est la guerre, c’est le droit de la guerre, ils ont violé leur serment. Toutes ces phrases sont vraies.`, e:{peculium:420, valetudo:-2} } },
  { t:'Racheter une famille de ta part et l’affranchir',
    note:'Personne ne comprendra. Toi non plus, tout à fait.',
    res:{ r:`Tu paies le prix du lot pour trois personnes et tu les fais inscrire libres au registre. Tes hommes te regardent différemment — pas plus mal, différemment.`, e:{peculium:-350, auctoritas:11, gratia:-4} } },
  { t:'Racheter le lot des forgerons pour le revendre en Cisalpine',
    check:{ s:'scientia', dc:52 },
    ok:{ r:`Les artisans valent quatre fois le prix du lot commun sur les marchés du Pô. Tu spécules sur des gens, et tu es très bon à cela.`, e:{peculium:900, scientia:4, auctoritas:-4} },
    ko:{ r:`Le convoi est pillé sur la route de l’Italie. Tu perds ta mise et le reste.`, e:{peculium:-400} } }
  ]},

{ t:'Les faux de marine', lieu:'Golfe du Morbihan', guerre:true,
  x:`Les navires vénètes sont plus hauts que les nôtres, en chêne, chevillés au fer, à voiles de cuir. L’éperon ne peut rien contre eux. Décimus Brutus a fait forger des faux emmanchées sur de longues perches, pour couper les drisses : un navire sans voile est un rocher.`,
  nota:`César décrit précisément ce stratagème. Le vent tomba pendant l’action, immobilisant les deux cent vingt vaisseaux vénètes sous les yeux de l’armée massée sur les falaises. Ce fut la première bataille navale romaine sur l’Océan.`,
  o:[
  { t:'Manœuvrer à la perche et couper',
    res:{ r:`La faux mord, on souque à six, la vergue tombe avec la voile de cuir. Le navire devient un ponton et l’on monte dedans.`, e:{disciplina:6, scientia:4, peculium:140, valetudo:-3} } },
  { t:'Aborder de force sans couper la voile',
    check:{ s:'virtus', dc:62 },
    ok:{ r:`Tu montes à la corde sous les traits, en cotte de mailles, sur un pont plus haut d’un homme. Ceux qui te suivent ne l’oublieront pas.`, e:{virtus:9, auctoritas:8, peculium:180, valetudo:-5} },
    ko:{ r:`On te repousse du bastingage. Deux hommes tombent entre les coques et ne remontent pas.`, e:{valetudo:-9, auctoritas:-5, vulnus:1} } },
  { t:'Attendre la bascule du vent avant d’engager',
    p:'centurion', need:{ s:'scientia', min:50 },
    res:{ r:`Tu lis le calme qui vient et tu retiens tes navires vingt minutes. Le vent tombe : deux cent vingt vaisseaux s’immobilisent devant nous. On les prend un par un jusqu’au soir.`, e:{scientia:10, gratia:12, peculium:300} } }
  ]},

{ t:'Le sort des Vénètes', lieu:'Camp de la Loire',
  x:`La flotte prise, la nation se rend. César décide de faire un exemple parce qu’ils ont saisi des ambassadeurs : il fait exécuter tout le sénat vénète et vendre le reste.`,
  nota:`César justifie la sévérité par la violation du droit d’ambassade. Cicéron, dans une lettre privée, s’inquiétera de ce que son frère Quintus sert sous un homme qui traite ainsi des peuples qui se rendent.`,
  o:[
  { t:'Exécuter les ordres sans commentaire',
    res:{ r:`C’est fait. Le butin est distribué. Le camp n’en parle pas et n’en parlera plus.`, e:{disciplina:5, peculium:200, auctoritas:-3} } },
  { t:'Faire retirer les enfants du lot avant la vente',
    p:'sousoff',
    note:'Cela ne les sauve pas. Cela les sépare autrement.',
    res:{ r:`Tu obtiens du questeur qu’on les vende à part, aux domaines et non aux mines. C’est une différence de dix ans d’espérance de vie, et personne au camp ne comprend pourquoi tu t’en soucies.`, e:{auctoritas:9, scientia:3, peculium:120} } },
  { t:'Objecter au conseil qu’un peuple massacré en arme dix autres',
    p:'centurion',
    check:{ s:'scientia', dc:66 },
    ok:{ r:`Tu le dis calmement, sans emphase. César t’écoute jusqu’au bout, ne change rien, et retient ton nom. Les officiers qui pensent avant de parler sont rares.`, e:{scientia:7, auctoritas:7, gratia:8} },
    ko:{ r:`Tu passes pour un homme au cœur tendre devant vingt officiers. Le mot circulera plus vite que tu ne le voudrais.`, e:{gratia:-9, auctoritas:-5} } }
  ]},

{ t:'Le partage du monde', lieu:'Quartiers d’hiver, vallée de la Loire',
  x:`À Lucques, ce printemps, César, Pompée et Crassus se sont partagé le monde comme trois hommes partagent une succession : l’Espagne à l’un, la Syrie à l’autre, et cinq années de plus en Gaule pour le nôtre.`,
  nota:`La conférence de Lucques, en avril 56, prorogea le commandement de César de cinq ans. Elle scella aussi le sort de Crassus, qui partit pour la Parthie et y mourut à Carrhes trois ans plus tard.`,
  o:[
  { t:'Faire tes comptes : cinq ans de solde et de butin',
    res:{ r:`Tu calcules ce que cinq ans rapportent si tu vis, et ce qu’ils coûtent si tu meurs. Le second chiffre est plus facile à établir.`, e:{scientia:5, peculium:180} } },
  { t:'Écrire à ta famille de placer l’argent en terre plutôt qu’en prêts',
    res:{ r:`La terre survit aux guerres civiles ; les créances, non. Ton correspondant exécute. Dans huit ans, tu seras l’un des rares du camp à posséder encore ce qu’il possédait.`, e:{scientia:6, peculium:200} } },
  { t:'Sonder discrètement les officiers sur ce qu’ils feront si cela tourne mal',
    check:{ s:'gratia', dc:58 },
    ok:{ r:`Tu apprends que Labienus a des terres dans le Picénum, pays de Pompée, et qu’il y écrit souvent. C’est un détail. Dans sept ans, ce sera le détail.`, e:{scientia:7, gratia:4}, lien:{labienus:1} },
    ko:{ r:`Ta curiosité se voit. On te fait dire, par un tiers, qu’un bon soldat ne s’occupe pas de politique.`, e:{gratia:-8, auctoritas:-3} } }
  ]}
]},
