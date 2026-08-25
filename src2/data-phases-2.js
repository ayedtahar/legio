/* ==================== IV. OCEANVS ==================== */
{
id:'oceanus', n:'Oceanus', sub:'Le Rhin et la Bretagne', y0:-55, y1:-54, len:6,
events:[

{ at:0, t:'La parole donnée', lieu:'Confluent de la Meuse et du Rhin',
  x:`Quatre cent mille Germains ont passé le Rhin. Leurs chefs sont venus au camp sous couvert de trêve ; César les a fait arrêter, puis a lancé l’armée sur un camp resté sans chefs.<br><br>Il n’y a pas eu de bataille. Il y a eu ce qui suit une bataille, mais sans la bataille.`,
  nota:`À Rome, Caton demanda au Sénat qu’on livrât César aux Germains pour expier la violation de la foi jurée. La motion échoua. César, dans ses <span class="lat">Commentarii</span>, présente l’arrestation comme une réponse à une embuscade germaine.`,
  o:[
  { t:'Faire ton office sans commentaire',
    res:{ r:`Tu fais ce qu’on te dit. Tu n’es ni le premier ni le dernier, et cela ne console de rien.`, e:{disciplina:5, valetudo:-2, auctoritas:-2} } },
  { t:'Laisser passer les non-combattants dans ton secteur',
    note:'Un quart d’heure les yeux ailleurs. Quelques centaines de personnes.',
    res:{ r:`Tu détournes les yeux pendant un quart d’heure. Personne ne saura jamais combien sont passés, ni que c’était toi. Deux hommes de ta tente l’ont vu.`, e:{auctoritas:10, gratia:-6} } },
  { t:'Consigner par écrit les circonstances exactes de l’arrestation des chefs',
    need:{ s:'scientia', min:44 },
    res:{ r:`Tu rédiges un mémoire exact, daté, que tu gardes. Tu ne l’utiliseras jamais. Il existe, et il t’arrive d’y penser.`, e:{scientia:8, gratia:-4} } }
  ]},

{ at:1, t:'Dix jours de pont', lieu:'Rive gauche du Rhin',
  x:`Il aurait pu passer sur les barques des Ubiens. Il a jugé cela indigne du peuple romain.<br><br>Le génie plante des pieux jumelés en biais dans le courant, entretoisés, lestés par la poussée du fleuve lui-même : plus l’eau pousse, plus le pont serre.`,
  nota:`César consacre à ce pont une description technique de plusieurs paragraphes — la plus détaillée de tout l’ouvrage. Dix jours de la coupe du bois au passage. Il resta dix-huit jours en Germanie, ne combattit personne, et détruisit le pont derrière lui. Le message était l’ouvrage.`,
  o:[
  { t:'Travailler à la charpente jour et nuit',
    res:{ r:`Tu apprends à assembler une pile sous un courant de six pieds par seconde. Ce savoir-là ne se perd pas.`, e:{scientia:9, disciplina:5, valetudo:-4} } },
  { t:'Demander à l’architecte comment tient l’assemblage',
    need:{ s:'scientia', min:42 },
    res:{ r:`Il te dessine le principe sur une tablette de cire : les pieux inclinés à contre-courant, la poussée qui verrouille l’ouvrage au lieu de l’emporter. Tu gardes la tablette.`, e:{scientia:12, gratia:5} } },
  { t:'Passer le premier sur le tablier quand il est achevé',
    res:{ r:`Tu marches sur le Rhin. Personne dans ta famille n’a jamais vu ce fleuve, et personne ne te croira.`, e:{virtus:5, auctoritas:6} } }
  ]},

{ at:2, t:'L’aigle de la Dixième', lieu:'Côte de Bretagne', guerre:true,
  x:`Les navires ne peuvent aborder à cause des hauts-fonds : il faut sauter dans l’eau jusqu’à la poitrine, en armes, sous les traits et les chars. Personne ne bouge.<br><br>Alors le porte-aigle de la Dixième saute le premier : <em>« Sautez, soldats, si vous ne voulez pas livrer l’aigle à l’ennemi ! »</em>`,
  vue:{ soldat:'L’eau est plus froide que tout ce que tu connais.',
        sousoff:'Ta centurie hésite une seconde entière. Une seconde, c’est très long.',
        centurion:'Le débarquement se joue dans les quinze prochaines secondes.',
        superieur:'Les navires longs peuvent venir prendre le flanc breton à la rame.' },
  nota:`Le mot est rapporté par César lui-même, qui ne nomme pas le porte-aigle. Perdre une aigle était le déshonneur absolu d’une légion — celles de Crassus, perdues à Carrhes, ne seront récupérées qu’en 20 av. J.-C., par la diplomatie.`,
  o:[
  { t:'Sauter dans la seconde qui suit',
    res:{ r:`Tu es dans l’eau avec lui, et les autres suivent parce qu’on ne laisse pas une aigle seule. On te citera avec les premiers.`, e:{virtus:9, auctoritas:8, gratia:8, valetudo:-4} } },
  { t:'Organiser les barques pour repêcher ceux qui coulent',
    note:'Une cotte de mailles pèse dix kilos. Beaucoup ne savent pas nager.',
    res:{ r:`Tu détaches les chaloupes et les esquifs de reconnaissance. Une quarantaine d’hommes te doivent la vie sans savoir ton nom.`, e:{scientia:7, auctoritas:10, valetudo:-2} } },
  { t:'Faire venir les navires longs prendre les Bretons de flanc',
    p:'centurion',
    res:{ r:`Frondes, arcs et scorpions à bout portant depuis la mer. Les chars bretons décrochent, et la plage devient praticable.`, e:{scientia:8, gratia:9} } }
  ]},

{ t:'Les chars', lieu:'Au-delà de la Tamise', guerre:true,
  x:`Le char breton n’est pas une machine de choc : il court le long du front en jetant des traits, le guerrier saute à terre pour combattre, le conducteur se tient à portée pour le reprendre.<br><br>Cela combine la vitesse du cavalier et la fermeté du fantassin, et nos hommes n’ont jamais vu cela.`,
  vue:{ soldat:'Tu passes tes journées à fourrager en armes.',
        sousoff:'On te confie la garde des fourrageurs de trois centuries.',
        centurion:'Tes détachements rentrent toujours incomplets.',
        superieur:'Il faut choisir entre nourrir l’armée et la garder groupée.' },
  nota:`César consacre au char breton une description admirative : c’était une tactique qu’aucun peuple continental ne pratiquait plus. Il ne parvint jamais à la contrer autrement qu’en refusant de disperser ses hommes.`,
  o:[
  { t:'Fourrager en formation serrée, quitte à rapporter moins',
    note:'La faim est moins mortelle que les chars.',
    res:{ r:`On rentre tous les soirs avec tout le monde et la moitié du grain nécessaire. Les hommes grognent et rentrent.`, e:{disciplina:7, auctoritas:6, valetudo:-3} } },
  { t:'Tendre une embuscade aux embusqueurs',
    check:{ s:'scientia', dc:60 },
    ok:{ r:`Tu laisses un détachement bien visible et bien lent, et tu couches deux centuries dans le fossé de la haie. Les chars entrent dedans. On en prend neuf avec les attelages.`, e:{scientia:9, virtus:5, gratia:9, peculium:200} },
    ko:{ r:`Ils ne mordent pas — ou plutôt, ils mordent ailleurs, et c’est ton détachement-appât qui prend tout.`, e:{auctoritas:-8, valetudo:-7, vulnus:1} } },
  { t:'Traiter avec les Trinovantes contre Cassivellaunos',
    p:'centurion',
    res:{ r:`Ils haïssent Cassivellaunos, qui a tué leur roi. Ils livrent du blé, des otages et l’emplacement de son oppidum. La guerre change de nature en une conversation.`, e:{scientia:6, gratia:11} } }
  ]},

{ t:'La flotte brisée', lieu:'Camp naval, côte du Kent',
  x:`Une marée de pleine lune, que personne n’avait prévue, a jeté les navires de transport les uns sur les autres. Quarante sont perdus, le reste est à réparer.`,
  nota:`Les Romains, gens de Méditerranée, ne connaissaient pas les grandes marées de l’Atlantique. César perdit deux fois sa flotte pour cette raison. Rome décréta vingt jours d’actions de grâces pour une expédition qui ne rapporta ni province ni butin.`,
  o:[
  { t:'Tirer les navires à sec et réparer, dix jours durant',
    res:{ r:`Dix jours de charpente sur une plage, sans dormir. On sauve ce qui peut l’être et l’on rembarque à l’étroit.`, e:{disciplina:6, scientia:5, valetudo:-5} } },
  { t:'Dire aux hommes ce qu’ils ont fait, pas ce qu’ils n’ont pas gagné',
    p:'sousoff',
    res:{ r:`Tu leur dis qu’aucune armée du monde n’a passé cet Océan, que leurs petits-fils le raconteront, et que le blé, lui, est en Gaule. Ils rient. Cela suffit.`, e:{auctoritas:11, disciplina:3} } },
  { t:'Payer une tournée sur ta propre bourse',
    res:{ r:`Deux amphores et une nuit. Les hommes savent d’où vient le vin, et c’est tout l’intérêt.`, e:{auctoritas:9, peculium:-140} } }
  ]},

{ t:'Un homme libre d’un peuple libre', lieu:'Portus Itius',
  x:`Dumnorix l’Éduen refuse d’embarquer et s’enfuit avec sa cavalerie en criant qu’il est un homme libre d’un peuple libre. César interrompt l’embarquement et détache la cavalerie avec ordre de le ramener — ou de le tuer s’il résiste.`,
  nota:`César rapporte la phrase de Dumnorix : <span class="lat">se liberum liberaeque civitatis esse</span>. Il fut rattrapé et tué. Six ans plus tard, les Éduens basculeront dans la révolte de Vercingétorix.`,
  o:[
  { t:'Faire partie du détachement',
    res:{ r:`On le rattrape à six milles. Il se bat, il crie sa phrase jusqu’au bout, et il meurt. Le détachement rentre en silence.`, e:{virtus:4, gratia:8, auctoritas:-5} } },
  { t:'Rester à l’embarquement et le mener proprement',
    res:{ r:`Tu fais embarquer ta part de la légion en bon ordre pendant que d’autres courent après un cavalier. C’est le travail.`, e:{disciplina:7, gratia:3} } },
  { t:'Suggérer qu’un Éduen mort vaut moins qu’un Éduen otage',
    p:'sousoff',
    check:{ s:'scientia', dc:62 },
    ok:{ r:`On ne te suit pas, mais l’argument est retenu — et il resservira dans deux ans, quand les Éduens basculeront et qu’on cherchera pourquoi.`, e:{scientia:8, gratia:6} },
    ko:{ r:`On te répond que la décision est prise et que ton avis n’était pas demandé.`, e:{gratia:-5} } }
  ]}
]},

/* ==================== V. ATVATVCA ==================== */
{
id:'atuatuca', n:'Atuatuca', sub:'Le désastre, et ce qui suit', y0:-54, y1:-53, len:5,
events:[

{ at:0, t:'Quinze cohortes', lieu:'Camp d’hiver d’Atuatuca',
  x:`La récolte a manqué : les huit légions sont dispersées en huit camps, à cent milles les uns des autres. C’est là qu’Ambiorix a frappé.<br><br>Sabinus a cru à sa parole et fait sortir quinze cohortes. Elles sont mortes dans un défilé, jusqu’à la dernière ou presque. Cotta est tombé le visage fracassé, en refusant de parlementer.`,
  nota:`C’est la plus lourde défaite de César en Gaule : environ six mille hommes. Il jura de ne pas se raser ni se couper les cheveux avant de l’avoir vengée. Les <span class="lat">Commentarii</span> chargent Sabinus et innocentent Cotta, qui avait voulu rester dans le camp.`,
  o:[
  { t:'Écouter les survivants et retenir la leçon',
    res:{ r:`Ils sont sept. Ils racontent la colonne étirée dans le défilé, l’ordre de former le cercle donné trop tard, les bagages abandonnés qui ont désorganisé le rang. Tu retiens tout.`, e:{scientia:10, valetudo:-2, auctoritas:3} } },
  { t:'Faire jurer à ta tente de ne jamais parlementer en campagne',
    res:{ r:`Un serment de huit hommes sous une tente, sans témoin. Ce genre de chose ne vaut rien et tient parfois mieux que le règlement.`, e:{auctoritas:9, disciplina:5} } },
  { t:'Vérifier toi-même les défenses de ton propre camp',
    res:{ r:`Tu passes trois nuits à contrôler les postes, les réserves d’eau, les issues. On te trouve pénible. Dans six semaines, on ne te trouvera plus pénible.`, e:{disciplina:8, scientia:5, valetudo:-3} } }
  ]},

{ at:1, t:'Pullo et Vorenus', lieu:'Camp de Q. Cicéron, chez les Nerviens', guerre:true,
  x:`Deux centurions de la première cohorte, Titus Pullo et Lucius Vorenus, se disputent depuis des années le premier rang. Aujourd’hui, Pullo sort du rempart en criant à Vorenus qu’il n’a plus d’excuse pour douter de sa valeur.<br><br>Vorenus le suit, parce qu’il ne peut pas faire autrement. Tout le camp est monté sur le rempart pour regarder.`,
  vue:{ soldat:'Deux hommes seuls contre une ligne gauloise. Personne ne détourne les yeux.',
        sousoff:'C’est absurde et c’est la chose la plus romaine que tu aies vue.',
        centurion:'Tu connais les deux. Tu sais exactement pourquoi ils font cela.',
        superieur:'Deux officiers de la première cohorte hors du rempart. Si tu les perds, tu perds plus que deux hommes.' },
  nota:`César nomme les deux centurions et raconte l’épisode en détail : Pullo cloué au sol par un trait dans le baudrier, Vorenus revenant le chercher, tombant à son tour, et Pullo relevé le tirant en arrière. Ils rentrèrent vivants tous les deux. C’est l’un des rares passages où César s’attarde sur des individus du rang.`,
  o:[
  { t:'Les couvrir avec tout ce qui peut tirer du rempart',
    res:{ r:`Frondeurs, archers, tout ce qui a un bras. Ils rentrent tous les deux, sous une pluie de traits qui vient de tes hommes. Le camp entier a vu qui les couvrait.`, e:{auctoritas:9, gratia:6, scientia:3} } },
  { t:'Sortir les chercher',
    note:'Tu les ramèneras. Tu y laisseras quelque chose : c’est certain.',
    res:{ r:`Tu franchis le rempart avec une poignée d’hommes et tu ramènes les deux centurions par le col, sous les yeux du camp entier et de la moitié de la Gaule. Ton avant-bras est ouvert jusqu’à l’os. Il n’y a pas d’autre monnaie que celle-là dans une légion.`, e:{virtus:12, auctoritas:15, gratia:10, valetudo:-13, vulnus:1} } },
  { t:'Interdire la sortie et les faire rentrer sous peine de sanction',
    p:'centurion',
    note:'Deux centurions vivants valent mieux qu’une légende. Tu seras le seul à le penser aujourd’hui.',
    res:{ r:`Tu les rappelles au nom du légat, devant six mille hommes. Ils obéissent en te haïssant. Le camp te trouve mesquin et Quintus Cicéron te trouve solide.`, e:{disciplina:9, gratia:10, auctoritas:-8} } }
  ]},

{ t:'Le message', lieu:'Camp assiégé, neuvième jour',
  x:`Il faut prévenir César, à cent milles. Tous les messagers envoyés ont été pris et torturés en vue du rempart. Un cavalier nervien à notre solde propose d’essayer, avec la lettre roulée dans la courroie de son javelot.`,
  nota:`César rapporte que la lettre fut écrite en caractères grecs pour être illisible aux Gaulois si elle était prise, et que le javelot resta fiché deux jours dans une tour avant qu’on le remarque.`,
  o:[
  { t:'Payer le Nervien sur ta propre bourse et le lâcher de nuit',
    res:{ r:`Il passe. Le javelot arrivera fiché dans une tour du camp de César, où il restera deux jours avant qu’on le remarque. Mais il arrivera.`, e:{gratia:11, auctoritas:6, peculium:-200} } },
  { t:'Écrire la lettre en caractères grecs',
    need:{ s:'scientia', min:48 },
    res:{ r:`Du latin transcrit en lettres grecques : illisible pour un Gaulois qui lit le latin, immédiat pour un Romain lettré. La précaution paraît mineure jusqu’au jour où elle ne l’est plus.`, e:{scientia:9, gratia:8} } },
  { t:'Sortir toi-même de nuit avec la lettre',
    check:{ s:'virtus', dc:68 },
    ok:{ r:`Trois nuits à travers les Ardennes, dans un manteau gaulois, en évitant les feux. Quand tu arrives, César lit la lettre debout et fait sonner le départ dans l’heure.`, e:{virtus:9, scientia:6, gratia:16, auctoritas:8, valetudo:-10} },
    ko:{ r:`Tu es repéré au deuxième jour et tu passes une semaine à ramper vers le camp le plus proche, sans lettre et sans bottes.`, e:{valetudo:-14, gratia:-5, vulnus:1} } }
  ]},

{ t:'Le pays offert au pillage', lieu:'Forêt des Ardennes',
  x:`César a fait proclamer que le pays des Éburons est ouvert à qui veut. Des Gaulois, des Germains, des marchands, des gens sans nom affluent pour piller.<br><br>Ce n’est pas une guerre, c’est une battue. On brûle les fermes, on coupe le blé sur pied, on comble les puits. Ambiorix s’échappe toujours, avec quatre cavaliers.`,
  nota:`César écrit vouloir que la nation des Éburons cesse d’exister. C’est l’un des rares passages où il décrit une politique d’extermination délibérée. Ambiorix ne fut jamais pris.`,
  o:[
  { t:'Participer aux colonnes de destruction',
    res:{ r:`Méthodique, et ce n’est pas la guerre. Le butin est maigre : il n’y a plus rien à prendre chez des gens qu’on a déjà pris.`, e:{disciplina:3, peculium:180, auctoritas:-6, valetudo:-2} } },
  { t:'Rester au camp et renforcer la garde',
    note:'Un camp à demi vide au milieu d’un pays qu’on saccage est une cible.',
    res:{ r:`Deux mille Sugambres se présentent devant Atuatuca. Le rempart est garni parce que tu l’as voulu. Le vieux primipile Baculus, malade au lit depuis cinq jours, se lève pour tenir la porte et te dit deux mots que tu répéteras toute ta vie.`, e:{scientia:8, virtus:5, gratia:9, auctoritas:7} } },
  { t:'Racheter des captifs aux pillards pour les revendre',
    check:{ s:'gratia', dc:56 },
    ok:{ r:`Tu achètes bas à des Germains pressés et tu revends haut aux marchands qui remontent vers le Rhin. C’est laid et c’est très rentable.`, e:{peculium:700, auctoritas:-6} },
    ko:{ r:`Les Germains te reprennent la marchandise et ton argent à trois milles du camp. Tu rentres à pied.`, e:{peculium:-300, valetudo:-6} } }
  ]},

{ t:'Carrhes', lieu:'Quartiers d’hiver, Gaule du Nord',
  x:`La nouvelle est arrivée de Syrie avec deux mois de retard. Crassus, sept légions, anéanties par les archers parthes. Trente mille Romains. On dit qu’ils ont coulé de l’or fondu dans la bouche du triumvir.<br><br>Ils étaient trois à se partager le monde. Ils ne sont plus que deux, et il n’y a plus rien entre eux.`,
  nota:`Carrhes, juin 53. Julia, fille de César et femme de Pompée, était morte en couches l’année précédente. Avec Crassus disparaît le dernier arbitre, et avec Julia le dernier lien de famille.`,
  o:[
  { t:'Écouter ce qui se dit au camp',
    res:{ r:`Les vétérans disent que cela finira mal et qu’ils suivront César. Les jeunes tribuns de bonne famille disent le contraire, à voix basse. Tu sais désormais qui pense quoi.`, e:{scientia:7, gratia:3} } },
  { t:'Dire tout haut que tu sers la République, pas un homme',
    note:'C’est courageux. Cela se répétera, et déformé.',
    res:{ r:`Tu le dis sans provocation, devant des gens qui ne pensent pas comme toi. On te respecte pour la franchise et l’on te classe.`, e:{disciplina:6, auctoritas:8, gratia:-9}, lien:{labienus:2} } },
  { t:'Dire simplement que tu sers César',
    res:{ r:`La moitié du camp pense pareil et l’autre moitié le pense sans le dire. Ton nom monte d’un cran sur une liste que tu ne verras jamais.`, e:{gratia:11, auctoritas:3}, lien:{caesar:2} } }
  ]}
]},

/* ==================== VI. VERCINGETORIX ==================== */
{
id:'vercingetorix', n:'Vercingetorix', sub:'Toute la Gaule se lève', y0:-52, y1:-52, len:7,
events:[

{ at:0, t:'Avaricum', lieu:'Oppidum des Bituriges', guerre:true,
  x:`Un jeune Arverne a compris ce qu’aucun n’avait compris : ne pas nous livrer bataille, brûler devant nous. Vingt villes des Bituriges ont brûlé en un jour, par la main de leurs habitants.<br><br>Ils ont supplié d’épargner Avaricum. Nous sommes devant, dans la boue, à la ration de vingt jours qui en dure quarante. La terrasse monte : vingt-cinq pieds de haut, trois cents de large.`,
  vue:{ soldat:'Tu portes des fascines depuis trois semaines. Pas de pain depuis dix jours.',
        sousoff:'Tes hommes tiennent par habitude. Ils ne se plaignent pas, et c’est mauvais signe.',
        centurion:'Tu peux exiger le double de travail, ou les ménager pour l’assaut.',
        superieur:'César a proposé de lever le siège. Les légions ont supplié qu’on n’en fasse rien.' },
  nota:`Le <span class="lat">murus gallicus</span> — poutres croisées, pierres et terre, cloué de fiches de fer — résistait au bélier parce que le bois amortissait, et au feu parce que la pierre protégeait. La seule réponse romaine était la terrasse. César dit que ses hommes refusèrent qu’on levât le siège plutôt que de perdre l’honneur.`,
  o:[
  { t:'Pousser le travail sans relâche',
    res:{ r:`La terrasse monte de dix pieds en trois jours. Les hommes dorment sur le chantier, en armes, et il faut les enjamber pour circuler.`, e:{disciplina:8, gratia:6, valetudo:-6} } },
  { t:'Aller chercher du grain dans la campagne brûlée',
    check:{ s:'scientia', dc:58 },
    ok:{ r:`Tu trouves des silos enterrés que les Bituriges avaient oubliés. Deux jours de blé pour la légion, et un nom que les hommes retiennent.`, e:{scientia:8, auctoritas:12, valetudo:4} },
    ko:{ r:`Quarante milles de cendres, deux hommes perdus à la cavalerie gauloise, et le retour à vide devant des gens qui espéraient.`, e:{auctoritas:-8, valetudo:-7} } },
  { t:'Contre-miner leurs galeries',
    p:'centurion', need:{ s:'scientia', min:52 },
    res:{ r:`Tu fais creuser à leur rencontre et l’on se bat sous terre, à la lampe, au couteau, dans un boyau où deux hommes ne passent pas de front. La terrasse cesse de s’affaisser.`, e:{scientia:11, virtus:6, gratia:8, valetudo:-5} } }
  ]},

{ at:1, t:'La nuit du feu', lieu:'Terrasse d’Avaricum', guerre:true,
  x:`Vers minuit, une fumée sort de la terrasse : ils l’ont minée et enflammée par-dessous. Au même instant, ils sortent des deux portes.<br><br>Un Gaulois, debout devant la porte, reçoit les boules de suif que la foule lui passe et les jette au feu. Un trait le tue. Un autre prend sa place sur son corps. Puis un autre.`,
  vue:{ soldat:'La terrasse brûle sous tes pieds.',
        sousoff:'La tour de siège de ta centurie est en flammes.',
        centurion:'Sauver l’ouvrage, ou sauver les hommes.',
        superieur:'Vingt-cinq jours de travail brûlent, et les légions arrivent en désordre.' },
  nota:`César décrit ces hommes se relayant devant la porte comme un spectacle qu’il juge digne d’être rapporté, bien qu’il s’agisse d’ennemis. C’est l’un des rares moments d’admiration explicite des <span class="lat">Commentarii</span>.`,
  o:[
  { t:'Sauver l’ouvrage à tout prix',
    note:'Toute la nuit, à découvert, contre le feu et les Gaulois à la fois.',
    res:{ r:`Au matin la terrasse tient encore et il n’y a plus de nuit à donner. Tu as les mains brûlées jusqu’aux poignets.`, e:{virtus:8, disciplina:6, gratia:9, valetudo:-9} } },
  { t:'Retirer les hommes, laisser brûler, reconstruire demain',
    res:{ r:`Tu décroches proprement. On perd trois jours de terrasse et pas un homme. Le lendemain, elle remonte plus vite qu’elle n’avait monté.`, e:{auctoritas:9, scientia:4, gratia:-4} } },
  { t:'Monter dans la première vague quand l’assaut vient, sous la pluie',
    check:{ s:'virtus', dc:62 },
    ok:{ r:`Le vingt-septième jour, une averse : les gardes se sont abrités. Tu es sur le parapet avant qu’ils comprennent. La récompense est réelle, et la nuit qui suit ne l’est pas moins.`, e:{virtus:9, gratia:8, peculium:400, valetudo:-6} },
    ko:{ r:`L’échelle bascule. Tu tombes de douze pieds sur des pierres, avec ton bouclier sur la figure.`, e:{valetudo:-12, vulnus:1} } }
  ]},

{ at:2, t:'Gergovie', lieu:'Plateau arverne', guerre:true,
  x:`César monte une démonstration pour prendre le camp gaulois du flanc, avec <strong>ordre formel de ne pas aller plus loin</strong>. Le camp est pris presque sans coup férir.<br><br>Puis l’élan emporte tout : trois cohortes continuent de monter vers le mur de la ville.`,
  vue:{ soldat:'Tu montes dans un chemin creux, courbé, depuis une heure.',
        sousoff:'Le camp gaulois est devant, presque vide. Et la pente continue.',
        centurion:'L’ordre est clair : prendre le camp et s’arrêter là.',
        superieur:'La feinte a marché au-delà du calcul. C’est exactement le moment dangereux.' },
  nota:`Seule défaite ouverte de César en Gaule : sept cents morts, dont quarante-six centurions. Le centurion Lucius Fabius atteignit le parapet en criant qu’il aurait la couronne murale ; il y monta et n’en redescendit pas. César blâma publiquement l’indiscipline de ses hommes, puis, voyant l’effet, les consola de leur courage.`,
  o:[
  { t:'Prendre le camp et t’arrêter, comme ordonné',
    check:{ s:'disciplina', dc:60 },
    ok:{ r:`Tu tiens tes hommes sur la ligne exacte que César a désignée pendant que les cohortes voisines montent vers le mur. Demain, on comptera quarante-six centurions morts, et aucun n’est à toi.`, e:{disciplina:10, auctoritas:8, gratia:12} },
    ko:{ r:`Le camp pris, l’élan emporte tout. Tes hommes sont déjà cinquante pas plus haut quand tu cries de t’arrêter.`, e:{auctoritas:-7, valetudo:-8, gratia:-6} } },
  { t:'Monter vers le mur avec les autres',
    note:'Contre les ordres. On monte, on ne redescend pas tous.',
    res:{ r:`Tu montes. Un centurion atteint le parapet et crie qu’il aura la couronne murale ; il n’en redescendra pas. Toi si, avec une gloire douteuse et le nom dans le mauvais rapport.`, e:{virtus:7, auctoritas:5, gratia:-12, valetudo:-12, vulnus:1} } },
  { t:'Faire sonner la retraite pour ton secteur avant l’ordre général',
    p:'centurion',
    res:{ r:`Les hommes t’en veulent une heure et te bénissent le lendemain. Tu es de ceux qui ramènent leur monde.`, e:{auctoritas:11, scientia:6, gratia:9} } },
  { t:'Tenir un point d’appui pour couvrir la descente des autres',
    p:'sousoff',
    note:'Trois cohortes passeront derrière toi. Tu paieras le passage.',
    res:{ r:`Tu tiens un rocher avec vingt hommes pendant que trois cohortes refluent derrière toi. Vous en descendez neuf. Ceux qui sont passés savent ce qu’ils te doivent, et le disent — c’est ainsi qu’on devient quelqu’un dans une légion.`, e:{virtus:11, auctoritas:16, gratia:8, valetudo:-14, vulnus:1} } }
  ]},

{ t:'Après Gergovie', lieu:'Camp arverne',
  x:`Sept cents morts, dont quarante-six centurions. César rassemble l’armée et fait un discours qui blâme les hommes pour leur indiscipline — puis, voyant l’effet, les console de leur courage.<br><br>Il y a des places vides partout.`,
  nota:`Le nombre de centurions tombés — quarante-six — dit où se tenaient les centurions dans un assaut romain : au premier rang, à droite. Le taux de pertes des officiers de rang était structurellement supérieur à celui des hommes.`,
  o:[
  { t:'Prendre publiquement ta part de la faute',
    res:{ r:`Tu dis devant les hommes que l’ordre était clair et que tu ne l’as pas fait respecter assez fort. Personne n’attendait cela. C’est le genre de phrase qui fait qu’on te suivra à Alésia.`, e:{auctoritas:12, gratia:6} } },
  { t:'Te taire et remettre l’unité au travail',
    res:{ r:`Exercice, fossé, inspection d’armes. Au bout de quatre jours les hommes ont autre chose en tête. C’est la vieille méthode et elle fonctionne.`, e:{disciplina:8, auctoritas:-4, valetudo:-2} } },
  { t:'Présenter à César trois de tes meilleurs hommes pour les places vides',
    p:'sousoff',
    note:'Le moment est cynique et il ne reviendra pas.',
    res:{ r:`Tu donnes trois noms avec leurs états de service, sans un mot sur toi. César en promeut deux sur-le-champ. Tu viens de te faire deux centurions qui te doivent tout.`, e:{gratia:10, auctoritas:11, scientia:3} } }
  ]},

{ at:4, t:'Alésia — les lignes', lieu:'Oppidum des Mandubiens', guerre:true,
  x:`Onze milles de contrevallation vers l’intérieur, quatorze de circonvallation vers l’extérieur. Deux fossés dont l’un noyé. Des <span class="lat">cippi</span>, des <span class="lat">lilia</span>, des <span class="lat">stimuli</span> — pieux ferrés cachés sous la terre battue. Vingt-trois redoutes.<br><br>Quatre-vingt mille hommes enfermés dedans. Une armée de secours qu’on annonce à un quart de million derrière nous. Et nous entre les deux, sur une bande de terre de nos propres mains.`,
  vue:{ soldat:'Tu creuses depuis cinq semaines. Tes mains ne se ferment plus complètement.',
        sousoff:'Ta centurie garde vingt pas de rempart, dos à dos.',
        centurion:'Ta cohorte est étirée sur deux cents pas. Il n’y a pas de réserve.',
        superieur:'Labienus tient un secteur, Antoine l’autre. La réserve mobile est de six cohortes pour tout le dispositif.' },
  nota:`Les fouilles de Napoléon III puis les campagnes des années 1990 ont retrouvé les fossés, les trous de <span class="lat">lilia</span> et des <span class="lat">stimuli</span> de fer, confirmant la description de César presque pièce par pièce — un cas rare de texte antique validé par l’archéologie.`,
  o:[
  { t:'Creuser, et creuser encore',
    res:{ r:`Cinq semaines de terrassement pour vingt-cinq milles d’ouvrages. Aucune bataille de l’Antiquité n’a été gagnée à la pelle à ce point.`, e:{disciplina:9, scientia:5, valetudo:-6} } },
  { t:'Dégarnir la face intérieure pour renforcer l’extérieure',
    p:'sousoff', need:{ s:'scientia', min:54 },
    res:{ r:`Tu paries que Vercingétorix mettra une heure à combler ses propres pièges, et tu joues l’heure. Le pari est bon : la face extérieure tient parce que tu l’as doublée.`, e:{scientia:12, auctoritas:8, gratia:10, valetudo:-3} } },
  { t:'Faire passer de l’eau aux Mandubiens chassés entre les deux lignes',
    note:'Vercingétorix les a chassés. César refuse de les prendre. Ils meurent entre nous.',
    res:{ r:`Des outres roulées dans le fossé, la nuit, par deux hommes sûrs. Cela ne sauve personne, en toute rigueur. Tes hommes t’ont vu le faire.`, e:{auctoritas:12, gratia:-7} } },
  { t:'Déplacer ton secteur de travail hors de vue des Mandubiens',
    p:'centurion',
    note:'Ce n’est pas de la pitié. Un homme qui regarde cela dix jours ne se bat pas pareil.',
    res:{ r:`Tu changes ton chantier de côté. C’est de la conservation d’effectif et personne n’a besoin de savoir que tu y as pensé autrement.`, e:{auctoritas:8, scientia:6, disciplina:3} } }
  ]},

{ at:5, t:'Le mont Réa', lieu:'Camp nord, Alésia', guerre:true,
  x:`Ils ont trouvé le point faible : un camp au nord, sur une pente que le terrain empêche d’enfermer proprement. Soixante mille hommes triés y montent à couvert et attaquent à midi.<br><br>La <span class="lat">testudo</span> gauloise avance sous les traits ; ils démantèlent le rempart à mains nues.`,
  vue:{ soldat:'Le rempart s’écroule à dix pas sur ta gauche.',
        sousoff:'Les hommes du camp voisin refluent à travers ta position.',
        centurion:'Le secteur nord va tomber. C’est une question de minutes.',
        superieur:'César envoie Labienus avec six cohortes et l’ordre de tenir, ou de sortir s’il ne peut plus tenir.' },
  nota:`César descendit en personne, reconnaissable à son <span class="lat">paludamentum</span> écarlate qu’il portait au combat pour être vu de loin. La cavalerie germaine à sa solde sortit par une porte dérobée et prit l’armée de secours à revers. Soixante-quatorze enseignes gauloises furent ramassées sur le champ.`,
  o:[
  { t:'Boucher la brèche avec ce que tu as sous la main',
    note:'Blessés, valets, toi. Dix minutes de plus que ce n’aurait dû tenir.',
    res:{ r:`Ça tient dix minutes de plus que cela n’aurait dû, et ces dix minutes-là décident du siège. Tu ne peux plus lever le bras droit quand la relève arrive.`, e:{virtus:12, auctoritas:14, gratia:13, valetudo:-13, vulnus:1} } },
  { t:'Décrocher du camp et te reformer en rase campagne',
    p:'centurion', need:{ s:'scientia', min:56 },
    res:{ r:`Tu abandonnes le camp et tu ramasses en te repliant tout ce qui traîne de cohortes. En rase campagne, avec un front, la légion redevient la légion — et ce sont eux qui sont mal placés. C’est ce que Labienus fait au même moment, avec trente-neuf cohortes.`, e:{scientia:12, auctoritas:10, gratia:12, valetudo:-6} } },
  { t:'Tenir ta position exacte quoi qu’il arrive à côté',
    check:{ s:'disciplina', dc:64 },
    ok:{ r:`Tu ne bouges pas d’un pouce. Le flot passe à côté de toi et te laisse sur une île. Quand la contre-attaque arrive, ton îlot est le point d’appui dont elle avait besoin.`, e:{disciplina:10, virtus:7, gratia:8, valetudo:-7} },
    ko:{ r:`Tenir sans appui, c’est être enveloppé. Tu combats sur quatre côtés pendant vingt minutes.`, e:{valetudo:-15, vulnus:1, auctoritas:-4} } }
  ]},

{ t:'La reddition', lieu:'Devant le tribunal de César',
  x:`Vercingétorix convoque son conseil et dit qu’il n’a pas fait cette guerre pour lui mais pour la liberté commune. Il sort à cheval, en armes de parade, fait le tour du tribunal et met bas ses armes aux pieds de César, sans un mot.<br><br>Chaque légionnaire recevra un captif.`,
  nota:`Il resta six ans dans une cellule du Tullianum avant d’être étranglé après le triomphe de 46. César rendit les captifs éduens et arvernes sans rançon, pour raison politique : il lui fallait ces deux peuples tranquilles derrière lui.`,
  o:[
  { t:'Prendre ta part de captifs et la vendre',
    res:{ r:`Un homme, un captif. Les marchands qui suivent l’armée achètent au prix du bétail. Ta part est faite.`, e:{peculium:700, auctoritas:-3} } },
  { t:'Rendre ton captif à son peuple',
    note:'Aucun avantage. Sept cents deniers perdus.',
    res:{ r:`Tu le renvoies chez les Mandubiens. Le geste ne coûte qu’à toi, et deux de tes hommes font la même chose sans rien dire.`, e:{auctoritas:11, scientia:3} } },
  { t:'Demander la garde du captif Vercingétorix jusqu’en Cisalpine',
    p:'centurion',
    check:{ s:'gratia', dc:70 },
    ok:{ r:`Six semaines de route avec un homme qui a failli renvoyer Rome au-delà des Alpes, et qui ne dit presque rien. Tu apprends sur la guerre des choses qu’aucun manuel ne contient.`, e:{scientia:13, gratia:8, auctoritas:5} },
    ko:{ r:`La mission est donnée à un tribun de meilleure naissance. On te remercie de ta proposition.`, e:{gratia:-3} } }
  ]}
]},
