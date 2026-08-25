/* ==================== VII. FINIS GALLIAE ==================== */
{
id:'finis', n:'Finis Galliae', sub:'La fin de la Gaule, et l’attente', y0:-51, y1:-50, len:5,
events:[

{ at:0, t:'Uxellodunum', lieu:'Oppidum des Cadurques', guerre:true,
  x:`Le dernier oppidum qui résiste, sur un roc entouré par une rivière, imprenable d’assaut. César décide de lui couper l’eau : galeries de sappe pour capter la source, tours pour interdire la descente.<br><br>Ce n’est plus de la guerre, c’est de l’hydraulique.`,
  vue:{ soldat:'Tu es au fond d’une galerie, à la chandelle, à passer des paniers de terre.',
        sousoff:'Tes hommes travaillent en trois relèves. Ils toussent tous.',
        centurion:'Tes ouvrages brûlent deux nuits sur trois.',
        superieur:'Leur source contre notre patience. Le calcul est simple.' },
  nota:`La source tarit au trentième jour. Les assiégés y virent un signe des dieux et se rendirent — César note que le tarissement fit plus que le bélier. Il fit ensuite couper les mains à tous ceux qui avaient porté les armes, et les renvoya vivants.`,
  o:[
  { t:'Pousser les galeries jour et nuit',
    res:{ r:`La source tarit d’un coup, au trentième jour. Les assiégés y voient un signe des dieux, ce qui est plus efficace qu’un bélier.`, e:{disciplina:7, scientia:7, gratia:7, valetudo:-5} } },
  { t:'Garder les ouvrages contre les sorties nocturnes',
    check:{ s:'virtus', dc:60 },
    ok:{ r:`Trois sorties repoussées en cinq nuits. Les ouvrages tiennent debout et la sappe continue sans perdre un jour.`, e:{virtus:7, disciplina:5, gratia:6, valetudo:-4} },
    ko:{ r:`Ils enflamment une tour et une galerie dans la même nuit. On repart de deux semaines en arrière.`, e:{gratia:-7, valetudo:-7} } },
  { t:'Faire épargner les plus jeunes en les déclarant non-combattants',
    p:'sousoff',
    note:'Une liste où quarante garçons deviennent porteurs d’eau. Le questeur signera sans lire.',
    res:{ r:`Il signe sans lire. Personne ne le saura jamais, sauf eux. Ce que tu vois se faire aux autres, ce jour-là, tu ne le raconteras à personne.`, e:{auctoritas:10, scientia:4, gratia:-5, valetudo:-2} } }
  ]},

{ t:'Deux cents sesterces par homme', lieu:'Quartiers d’hiver, Belgique',
  x:`Après quarante jours de raid hivernal, César fait distribuer une gratification sur sa cassette personnelle : deux cents sesterces par légionnaire, deux mille par centurion.<br><br>Il paie de sa bourse. Personne n’a l’air de trouver cela étrange.`,
  nota:`César doubla la solde légionnaire et distribua constamment des primes personnelles. Le Sénat le lui reprochait comme une captation d’armée publique ; c’était exactement cela, et l’armée n’y voyait qu’un général qui payait.`,
  o:[
  { t:'Prendre l’argent',
    res:{ r:`C’est de l’argent. Il vient d’un homme et non de la République, et personne au camp ne fait la différence — ce qui est précisément le sujet.`, e:{peculium:400, gratia:4} } },
  { t:'Redistribuer ta part à tes hommes au prorata des années de service',
    p:'sousoff',
    res:{ r:`Ils ne l’oublieront pas. Tu viens de construire quelque chose qui ne s’achète pas, en l’achetant.`, e:{auctoritas:16, gratia:3, peculium:-400} } },
  { t:'Placer la somme en terre par ton correspondant d’Italie',
    res:{ r:`Un lopin près de Capoue, acheté au bon moment. Dans dix ans, il vaudra trois fois cela.`, e:{peculium:250, scientia:4} } }
  ]},

{ t:'Deux légions rendues', lieu:'Cisalpine, quartiers de Ravenne',
  x:`Le Sénat a exigé deux légions pour la guerre parthe : une de Pompée, une de César. Pompée a réclamé celle qu’il avait prêtée en 53. César a donc rendu deux légions — et donné à chaque homme deux cent cinquante deniers avant le départ.<br><br>Les deux légions n’ont jamais vu la Parthie. Elles sont en Italie, sous Pompée.`,
  nota:`Le procédé fut décisif : ces deux légions, interrogées par Pompée, lui assurèrent que les troupes de César l’abandonneraient au premier signal. Elles se trompaient, et Pompée les crut.`,
  o:[
  { t:'Regarder partir des hommes que tu connais depuis huit ans',
    res:{ r:`On se serre le bras sans rien dire. Dans dix-huit mois, certains seront en face, à Ilerda ou en Épire.`, e:{auctoritas:5, valetudo:-2, scientia:4} } },
  { t:'Te faire une idée précise de qui, dans le camp, penche de quel côté',
    check:{ s:'scientia', dc:60 },
    ok:{ r:`Tu dresses mentalement une liste. Elle sera exacte à deux noms près, et elle te servira dans un an.`, e:{scientia:9, gratia:5} },
    ko:{ r:`Tu te trompes sur les trois quarts. Les gens ne penchent pas où ils le disent.`, e:{scientia:3, gratia:-4} } },
  { t:'Ne t’occuper que de ton unité et de rien d’autre',
    res:{ r:`Exercice, comptes, équipement. La politique est le métier des autres, et tu as le tien.`, e:{disciplina:8, auctoritas:6} } }
  ]},

{ t:'Une armée qui n’a rien à faire', lieu:'Camp de Cisalpine',
  x:`Neuf mois sans campagne. Les hommes jouent, boivent, s’endettent, se battent. La solde arrive régulièrement, ce qui n’arrange rien.`,
  nota:`L’oisiveté était tenue pour le pire danger d’une armée romaine. Les manuels recommandaient de faire construire des routes ou creuser des canaux plutôt que de laisser les légions inoccupées.`,
  o:[
  { t:'Maintenir l’exercice et la discipline coûte que coûte',
    res:{ r:`Marche hebdomadaire, inspection d’armes. On te trouve pénible. En janvier, quand il faudra faire soixante milles en trois jours, on ne te trouvera plus pénible.`, e:{disciplina:9, auctoritas:5, valetudo:-3} } },
  { t:'Tenir les comptes de tes hommes et racheter leurs dettes usuraires',
    res:{ r:`Tu casses un tripot et rachètes deux créances. Tes hommes sont mous et solidaires, ce qui n’est pas le pire des états.`, e:{auctoritas:13, peculium:-250} } },
  { t:'Dîner chez les notables des municipes du Pô',
    res:{ r:`Ils adorent recevoir un officier de César. Tu en tires des créances, une clientèle, et peut-être un mariage.`, e:{gratia:12, peculium:400, disciplina:-4} } }
  ]},

{ at:4, t:'La nuit de Ravenne', lieu:'Ravenne, janvier',
  x:`Le sept janvier, le Sénat a voté le <span class="lat">senatus consultum ultimum</span>. Les tribuns Antoine et Cassius ont fui Rome déguisés en esclaves et sont arrivés dans une charrette louée.<br><br>César n’a ici qu’une légion : la tienne. Il donne des jeux, dîne longuement, et sort de table.`,
  nota:`Suétone rapporte qu’il quitta le banquet en disant qu’il revenait, et partit en voiture louée par des chemins détournés, se perdant même dans la nuit avant de retrouver la route du Rubicon.`,
  o:[
  { t:'Préparer ton unité au départ sans poser de question',
    res:{ r:`Cinq jours de vivres, armes vérifiées, chariots chargés. Tu ne demandes rien à personne. C’est exactement ce qu’on attend de toi cette nuit-là.`, e:{disciplina:8, gratia:9} } },
  { t:'Sonder les hommes sur ce qu’ils feront s’il faut passer en Italie',
    check:{ s:'auctoritas', dc:64 },
    ok:{ r:`Tu prends le pouls, tente par tente. La réponse est unanime et n’a rien de politique : ils suivront César parce qu’ils suivent César. Tu sauras au moins sur quoi tu comptes.`, e:{auctoritas:9, scientia:5} },
    ko:{ r:`La question elle-même sème le doute. Deux hommes se mettent à parler de désertion, alors qu’ils n’y pensaient pas avant que tu poses la question.`, e:{auctoritas:-9, disciplina:-4} } },
  { t:'Refaire ton testament et le déposer chez le signifer',
    res:{ r:`Comme tout légionnaire. Tu le refais ce soir-là plus soigneusement que d’habitude, et tu y penses en le scellant.`, e:{scientia:4, valetudo:4} } }
  ]}
]},

/* ==================== VIII. RVBICO ==================== */
{
id:'rubico', n:'Rubico', sub:'La guerre civile', y0:-49, y1:-48, len:7,
events:[

{ at:0, t:'Le Rubicon', lieu:'Frontière de l’Italie', decisif:true,
  x:`Un ruisseau. On le passe à gué sans se mouiller les genoux. De l’autre côté, ce n’est plus la province : c’est l’Italie, où nul proconsul n’entre en armes.<br><br>Il est resté longtemps sur la rive à ne rien dire. Puis il s’est tourné vers vous : on pouvait encore reculer, mais une fois ce petit pont franchi, tout se réglerait par les armes.<br><br><span class="lat">Alea iacta est.</span> Et il est entré dans l’eau.`,
  nota:`Franchir en armes le <span class="lat">pomerium</span> provincial était un crime capital pour un proconsul et pour chaque homme qui le suivait. César laissa partir sans représailles ceux qui refusèrent — le geste servait sa cause dans l’opinion autant que sa clémence.`,
  o:[
  { t:'Passer le gué derrière lui',
    res:{ r:`Il n’y a pas eu de délibération : il y a eu un homme qui entre dans l’eau et une légion qui entre derrière lui. Ce que tu es devenu ce jour-là, tu mettras des années à le nommer.`, e:{gratia:14, virtus:4, auctoritas:6}, choix:'caesar' } },
  { t:'Refuser de porter les armes contre Rome et passer à Pompée',
    note:'Tu quittes tout : ta légion, tes hommes, ta faveur. Labienus partira le lendemain.',
    res:{ r:`Tu rends ton baudrier au tribun de service et tu dis pourquoi. On ne te retient pas. Tu gagnes Brindes à pied. Labienus, lui, part le lendemain avec sa maison et son trésor.`, e:{virtus:7, auctoritas:8, gratia:-40}, choix:'pompee' } },
  { t:'Demander ton congé et rentrer chez toi',
    note:'La carrière s’arrête ici. Tu es vivant et tu as ta solde.',
    res:{ r:`Tu invoques tes années de service et tes blessures. Le tribun regarde ton dossier, ne discute pas, et signe. Tu quittes le camp par la porte décumane, à pied. Personne ne te salue et personne ne t’insulte.`, e:{}, choix:'missio' } }
  ]},

{ t:'Ilerda', lieu:'Sicoris, Hispanie citérieure', guerre:true,
  x:`<em>« Je vais combattre une armée sans chef, pour aller ensuite combattre un chef sans armée. »</em><br><br>Ce n’est pas une guerre de batailles : c’est une guerre de ponts, de gués et de blé. Une crue emporte nos deux ponts et l’armée est prise entre deux rivières, sans vivres. À Rome, on annonce déjà César perdu.`,
  vue:{ soldat:'Un modius de blé se vend cinquante deniers. Il n’y en a plus à vendre.',
        sousoff:'Tes hommes mangent une racine qu’ils font bouillir.',
        centurion:'Retraverser, ou mourir de faim entre deux fleuves.',
        superieur:'Un pont à vingt-deux milles en amont, ou des barques de coracle bâties sur le modèle breton.' },
  nota:`César fit construire des barques d’osier tressé tendu de peaux, sur le modèle breton, transportables sur chariot. Il fit aussi creuser des dérivations pour abaisser le fleuve. Ilerda se termina par une capitulation sans bataille : il licencia les cinq légions pompéiennes sans exiger de serment.`,
  o:[
  { t:'Bâtir des barques d’osier et de cuir, à la mode bretonne',
    need:{ s:'scientia', min:50 },
    res:{ r:`Coques d’osier tressé tendues de peaux, portables sur chariot. On passe une brigade la nuit, on tient une tête de pont, le pont se bâtit dessus. Six ans de Bretagne servent enfin à quelque chose.`, e:{scientia:11, gratia:10, auctoritas:5} } },
  { t:'Creuser des dérivations pour abaisser le fleuve',
    res:{ r:`Trois canaux de trente pieds. Le fleuve baisse assez pour qu’un gué apparaisse. Les Pompéiens regardent une armée déplacer une rivière et commencent à comprendre à qui ils ont affaire.`, e:{disciplina:8, scientia:7, valetudo:-5} } },
  { t:'Traverser et parler à ceux d’en face',
    res:{ r:`Tu passes une soirée avec des hommes qui t’ont couvert le flanc à Alésia. Vous convenez qu’aucun de vous ne sait pourquoi il est là. Deux jours plus tard, ils se rendent sans un coup de glaive.`, e:{gratia:9, auctoritas:8, scientia:4} } },
  { t:'Renvoyer intacts les Pompéiens trouvés dans notre camp',
    p:'sousoff',
    res:{ r:`Tu les fais raccompagner avec leurs armes pendant que Petreius égorge les nôtres dans son camp. La différence circule dans les deux armées avant le soir. C’est la seule arme qui compte dans cette guerre.`, e:{gratia:12, auctoritas:10, scientia:5} } }
  ]},

{ t:'La décimation de Plaisance', lieu:'Placentia, Cisalpine',
  x:`La Neuvième refuse de marcher. César vient seul devant elle, sans escorte, et annonce qu’il appliquera la lettre du règlement : un homme sur dix, tiré au sort, battu à mort par ses camarades.<br><br>Puis il attend. La légion demande grâce. Il commue en douze exécutions choisies parmi les meneurs.`,
  nota:`L’un des douze, prouvé absent au moment des faits, fut remplacé par le centurion qui l’avait dénoncé à tort. La <span class="lat">decimatio</span> était déjà archaïque à cette date : la menacer suffisait presque toujours.`,
  o:[
  { t:'Soutenir publiquement la sanction',
    res:{ r:`Tu dis devant tes hommes qu’une armée sans discipline est une bande. C’est impopulaire et c’est exact ; ton unité serre les rangs sans t’aimer davantage.`, e:{disciplina:9, gratia:8, auctoritas:-5} } },
  { t:'Intercéder pour un homme de ta connaissance',
    check:{ s:'gratia', dc:64 },
    ok:{ r:`Tu obtiens qu’un nom sorte de la liste, en échange d’un autre que tu n’as pas choisi. C’est un marché atroce et tu l’as fait.`, e:{auctoritas:11, gratia:-4, valetudo:-3} },
    ko:{ r:`On te répond que la liste est close. Elle l’était depuis une heure et l’on t’a laissé demander.`, e:{gratia:-6} } },
  { t:'Te taire',
    res:{ r:`Tu ne dis rien, ni pour ni contre. Douze hommes meurent et l’armée marche.`, e:{disciplina:4, auctoritas:-3} } }
  ]},

{ at:3, t:'Dyrrachium', lieu:'Lignes de siège, Épire', guerre:true,
  x:`Nous assiégeons un adversaire deux fois plus nombreux, ravitaillé par mer, pendant que nous mangeons une racine broyée qu’on appelle <span class="lat">chara</span>. Les Pompéiens en ont jeté des morceaux par-dessus le rempart en riant.<br><br>Deux transfuges ont livré le plan exact de nos lignes et le point de jonction inachevé. Pompée y jette soixante cohortes sur trois faces à la fois.`,
  vue:{ soldat:'Les traits tombent des trois côtés comme de la pluie.',
        sousoff:'Le centurion du fortin a un œil crevé et continue de commander.',
        centurion:'Le fortin est intenable. L’ordre est de tenir.',
        superieur:'Si ce fortin tombe, la ligne entière est prise à revers.' },
  nota:`On ramassa cent vingt trous dans le bouclier du centurion Cassius Scaeva et trente mille traits dans le fortin. César lui donna deux cent mille sesterces et le passa primipile ; les survivants reçurent une double solde. Scaeva mourut de vieillesse.`,
  o:[
  { t:'Tenir le fortin coûte que coûte',
    note:'Il tiendra. Tu n’en sortiras pas entier.',
    res:{ r:`Tu es de ceux qui n’en sont pas sortis en courant. Ton bras gauche restera inutilisable trois mois. César donne une double solde à tous les survivants — toi compris.`, e:{virtus:13, auctoritas:12, gratia:13, peculium:900, valetudo:-14, vulnus:1} } },
  { t:'Faire décrocher la garnison et rétablir la ligne en arrière',
    p:'centurion',
    note:'Militairement juste. Dans une armée, cela porte un nom qu’on t’accolera longtemps.',
    res:{ r:`Tu sacrifies le fortin et tu sauves la garnison sur une seconde ligne improvisée. Ceux que tu as ramenés le savent. Les autres ne retiendront que le fortin perdu.`, e:{scientia:9, auctoritas:9, gratia:-8, valetudo:-4} } },
  { t:'Te mettre en travers de la fuite, enseigne en main',
    check:{ s:'auctoritas', dc:70 },
    ok:{ r:`Tu plantes l’enseigne et tu cries. Trente hommes s’arrêtent, puis cent. César fera la même chose plus loin et se fera bousculer par ses propres soldats ; toi, on t’écoute.`, e:{auctoritas:15, virtus:8, gratia:11, valetudo:-8} },
    ko:{ r:`Le flot te renverse et te piétine. On te relève avec trois côtes cassées et l’enseigne perdue.`, e:{valetudo:-13, auctoritas:-8, vulnus:1} } }
  ]},

{ t:'« S’ils avaient eu quelqu’un pour vaincre »', lieu:'Camp de Dyrrachium',
  x:`Trente-deux enseignes perdues, mille morts — dont trente-deux tribuns et centurions, la plupart écrasés dans la fuite par les leurs.<br><br>César rassemble l’armée et dit cette phrase que tout le camp répétera : <em>« Aujourd’hui la victoire était à l’ennemi, s’ils avaient eu quelqu’un pour vaincre. »</em> Les légions, humiliées, demandent d’elles-mêmes la décimation. Il refuse.`,
  nota:`Pompée ne poursuivit pas. Ses officiers le lui reprochèrent longtemps ; il craignait une embuscade et savait qu’une guerre civile gagnée trop vite se paie politiquement. César leva le camp la nuit même vers la Thessalie.`,
  o:[
  { t:'Assumer devant César pour tes hommes',
    check:{ s:'auctoritas', dc:66 },
    ok:{ r:`Tu dis que la faute est au commandement du secteur, c’est-à-dire à toi. Il te regarde, ne dit rien, et ne te retire rien. Tes hommes ne diront rien non plus, et te suivront à Pharsale comme des chiens.`, e:{auctoritas:14, gratia:6} },
    ko:{ r:`Tu t’accuses trop bien. On te prend au mot : tu descends d’un cran dans l’ordre des cohortes.`, e:{gratia:-9, auctoritas:-6} } },
  { t:'Faire jurer à ton unité de ne pas reculer devant Pompée',
    res:{ r:`Ils jurent devant l’enseigne, à voix basse, sans emphase, comme des gens qui ont l’intention de tenir parole. Ils la tiendront dans trois semaines.`, e:{auctoritas:12, disciplina:6, virtus:4} } },
  { t:'Désigner les fautifs de ton secteur, comme on te le demande',
    res:{ r:`Tu donnes trois noms exacts, sans en ajouter ni en retrancher. On les casse de leur grade et l’on te sait juste, ce qui n’est pas la même chose qu’aimé.`, e:{disciplina:7, gratia:6, auctoritas:-4} } }
  ]},

{ at:5, t:'Pharsale — la quatrième ligne', lieu:'Plaine de l’Énipeus, Thessalie', guerre:true,
  x:`Vingt-deux mille contre quarante-cinq mille, mille cavaliers contre sept mille. Labienus, qui fut neuf ans le premier légat de César et connaît chacune de nos habitudes, a juré de ne revenir au camp que vainqueur.<br><br>César a vu que toute leur cavalerie est massée face à notre droite. Il retire six cohortes de la troisième ligne, les poste en oblique, cachées, avec un ordre singulier : <strong>ne pas lancer le pilum. Le garder en main comme une pique, et pointer au visage.</strong>`,
  vue:{ soldat:'On te retire du rang et on te place en arrière, en biais, sans t’expliquer.',
        sousoff:'Ordre étrange : garder le pilum en main. Viser le visage.',
        centurion:'Ta cohorte fait partie des six. Sept mille cavaliers vont arriver dessus.',
        superieur:'Six cohortes contre sept mille chevaux. Toute la bataille tient là-dessus.' },
  nota:`Ce sont de jeunes nobles romains qui composaient cette cavalerie ; César calcula qu’ils craindraient une cicatrice au visage plus que la mort. Ils tournèrent bride et n’arrêtèrent qu’aux collines. Plutarque rapporte l’ordre presque mot pour mot.`,
  o:[
  { t:'Exécuter l’ordre à la lettre : pilum en main, pointer au visage',
    res:{ r:`Sept mille cavaliers arrivent sur six cohortes qui se lèvent d’un coup et leur portent le fer au visage. Ils tournent bride tous ensemble. La bataille est jouée en quatre minutes, sur une idée.`, e:{disciplina:10, virtus:8, gratia:13, auctoritas:6, valetudo:-5} } },
  { t:'Lancer les pila comme d’habitude et recevoir la charge',
    note:'Ce que tu as toujours fait. Contre de la cavalerie, sans pique.',
    res:{ r:`La volée abat des chevaux, la charge passe quand même, et il faut se battre contre de la cavalerie sans pique. Vous tenez, chèrement, et ce qui devait se briser ne s’est pas brisé.`, e:{virtus:5, gratia:-10, valetudo:-12, vulnus:1} } },
  { t:'Laisser tes hommes s’arrêter d’eux-mêmes à mi-charge pour reprendre haleine',
    p:'sousoff',
    note:'Pompée a ordonné à sa ligne de ne pas bouger. Dix ans de service corrigent son erreur sans qu’on leur parle.',
    res:{ r:`Tu ne dis rien parce qu’il n’y a rien à dire : ils ont raison. C’est une armée qui n’a plus besoin qu’on lui explique, et tu viens de comprendre ce que tu commandes.`, e:{disciplina:9, auctoritas:8, scientia:6} } }
  ]},

{ t:'Le camp de Pompée', lieu:'Après la ligne rompue', guerre:true,
  x:`La troisième ligne fraîche entre au moment où la cavalerie fuit. La ligne pompéienne casse.<br><br>Dans leur camp, on trouve les tentes ornées de myrte, les tables dressées, l’argenterie sortie : ils avaient préparé le banquet de la victoire. Pompée est parti à cheval par la porte arrière.`,
  vue:{ soldat:'Tu entres dans un camp où le repas est servi.',
        sousoff:'Tes hommes se jettent sur les tables plutôt que sur les fuyards.',
        centurion:'Piller le camp, ou poursuivre les légions qui refluent vers la colline.',
        superieur:'Poursuivre maintenant, c’est finir la guerre aujourd’hui.' },
  nota:`César fit crier d’épargner les citoyens. Vingt-quatre mille hommes se rendirent le lendemain sur la colline, coupés de l’eau. Il brûla publiquement la correspondance saisie de Pompée sans la lire — geste qui lui gagna plus de sénateurs que Pharsale.`,
  o:[
  { t:'Poursuivre sans t’arrêter au camp',
    res:{ r:`Tu passes devant les tables sans regarder et tu montes sur la colline. Au matin, vingt-quatre mille hommes se rendent. La guerre pouvait durer trois ans ; elle a duré une après-midi.`, e:{disciplina:10, gratia:12, auctoritas:6, valetudo:-4} } },
  { t:'Piller le camp',
    note:'Tu ne reverras jamais un butin pareil. Et César saura qui a pillé.',
    res:{ r:`La vaisselle des sénateurs de Rome, les coffres, les chevaux.`, e:{peculium:1400, gratia:-8, auctoritas:4} } },
  { t:'Faire épargner et rassembler les prisonniers romains',
    p:'sousoff',
    res:{ r:`Tu tiens tes hommes et tu ramasses les rendus par centaines, désarmés, vivants. Beaucoup serviront sous nos enseignes avant six mois. C’est ainsi que César gagne : il ne détruit pas les armées, il les absorbe.`, e:{auctoritas:12, gratia:13, scientia:5} } },
  { t:'Faire brûler la correspondance saisie sans la lire',
    p:'centurion',
    res:{ r:`Tu fais porter les coffres au feu devant témoins, sans qu’un rouleau soit ouvert. Trente sénateurs t’en seront reconnaissants sans jamais te le dire. Cela vaut mieux que trente ennemis.`, e:{gratia:14, scientia:7, auctoritas:6} } }
  ]}
]},

/* ==================== IX. VLTIMA ==================== */
{
id:'ultima', n:'Ultima', sub:'Alexandrie, l’Afrique, Munda', y0:-47, y1:-45, len:7,
events:[

{ at:0, t:'Trois mille deux cents hommes', lieu:'Alexandrie, quartier du palais',
  x:`Pompée est mort sur une plage égyptienne, la tête coupée par ses propres affranchis. On l’a apportée à César dans un linge ; il a détourné les yeux et pleuré, et personne n’a su la part de chaque chose.<br><br>Puis il s’est mêlé d’une succession dynastique avec deux légions à effectif réduit, dans une ville de trois cent mille habitants. Les Alexandrins ont coupé les aqueducs et pompent l’eau de mer dans les citernes.`,
  nota:`César fit creuser sur toute la longueur du rivage, assurant qu’un sol côtier donne toujours de l’eau douce à faible profondeur. On en trouva à sept pieds. C’est un raisonnement d’ingénieur, appliqué à une panique.`,
  o:[
  { t:'Creuser toute la nuit, secteur par secteur',
    res:{ r:`Une veine d’eau douce à sept pieds, avant l’aube. On boit à genoux dans le sable. Le siège vient de changer de nature parce que quelqu’un a continué de creuser.`, e:{disciplina:8, scientia:6, auctoritas:11, valetudo:-4} } },
  { t:'Fortifier le quartier maison par maison',
    need:{ s:'scientia', min:54 },
    res:{ r:`Carrefours murés, cloisons percées pour circuler sans sortir, terrasses garnies. Une ville se défend comme un camp, à condition de la traiter comme un camp.`, e:{scientia:11, disciplina:6, gratia:9} } },
  { t:'Mettre la main sur les entrepôts du port avant les Alexandrins',
    res:{ r:`Un siège se gagne au grenier. Tu réquisitionnes avant que quiconque y pense.`, e:{scientia:6, auctoritas:9, peculium:200} } }
  ]},

{ t:'Le môle', lieu:'Heptastade, Alexandrie', guerre:true,
  x:`Il faut prendre le môle qui relie le Phare à la ville. On l’enlève, puis les Alexandrins contre-attaquent et la panique prend nos hommes sur une chaussée de trente pas où l’on ne peut ni fuir ni manœuvrer.<br><br>César lui-même doit sauter d’un navire qui coule et gagner le sien à la nage, sur deux cents pas, en tenant ses papiers d’une main hors de l’eau.`,
  vue:{ soldat:'Il y a de l’eau des deux côtés et trente pas de largeur.',
        sousoff:'Les navires qui devaient nous recueillir sont surchargés et coulent.',
        centurion:'Quatre cents hommes vont se noyer si personne ne tient l’extrémité.',
        superieur:'Huit cents morts sur une chaussée. Le pire quart d’heure depuis Gergovie.' },
  nota:`Suétone rapporte que César nagea en tenant ses tablettes hors de l’eau et en tirant son manteau entre les dents pour ne pas le laisser en trophée. Plutarque dit qu’il perdit le manteau.`,
  o:[
  { t:'Tenir l’extrémité du môle pour couvrir le rembarquement',
    note:'Vous serez les derniers à embarquer, à l’eau jusqu’à la ceinture.',
    res:{ r:`Un bouchon de trente hommes en travers de la chaussée pendant que les autres passent. Vous êtes les derniers à embarquer.`, e:{virtus:11, auctoritas:13, gratia:7, valetudo:-10} } },
  { t:'Faire jeter les armes lourdes et nager',
    res:{ r:`Cotte de mailles à la mer, bouclier à la mer, deux cents pas de nage. On perd l’équipement de trois centuries et l’on ramène trois centuries d’hommes.`, e:{scientia:7, auctoritas:10, peculium:-200, valetudo:-5} } },
  { t:'Refuser d’engager sur une chaussée sans issue, et le dire au conseil',
    p:'centurion', need:{ s:'scientia', min:58 },
    res:{ r:`Tu expliques qu’une chaussée de trente pas est un piège quelle que soit la valeur des troupes. On t’écoute à moitié, on engage quand même, mais ta cohorte reste en réserve — et huit cents morts n’en font pas partie.`, e:{scientia:10, auctoritas:11, gratia:4} } }
  ]},

{ at:2, t:'Quirites', lieu:'Campanie, camp d’embarquement', decisif:true,
  x:`Les légions vétéranes refusent d’embarquer pour l’Afrique. Elles réclament le congé, les terres et l’argent promis. Elles ont tué deux sénateurs envoyés pour parlementer et marché sur Rome.<br><br>César arrive seul, monte à la tribune, demande ce qu’elles veulent. Elles crient : le congé. Alors il dit un seul mot : <em>« Quirites. »</em><br><br>Citoyens. Pas « camarades ». Pas « soldats ». Des civils — des gens qui ne sont plus rien pour lui.`,
  nota:`Le mot est rapporté par Suétone, Appien et Dion. La Dixième supplia d’être reprise et de subir la décimation. César refusa la décimation, feignit de céder, et emmena l’armée en Afrique. C’est le sommet documenté de son autorité sur des hommes armés.`,
  o:[
  { t:'Être de ceux qui supplient qu’on les reprenne',
    res:{ r:`Il accepte, en refusant la décimation, et en disant qu’il n’a jamais douté de la Dixième — ce qui est faux et efficace. Tu embarqueras pour l’Afrique.`, e:{auctoritas:8, gratia:12, disciplina:5} } },
  { t:'Prendre la tête de la revendication et négocier',
    note:'Tu obtiendras des garanties réelles. Tu seras désormais un homme qu’on surveille.',
    res:{ r:`Tu formules ce que quinze mille hommes ressentent sans savoir le dire : les terres, les sommes, les délais, par écrit. César traite avec toi parce qu’il vaut mieux traiter avec quelqu’un.`, e:{auctoritas:18, scientia:7, peculium:600, gratia:-14} } },
  { t:'Prendre ton congé maintenant, avec les terres promises',
    note:'Quinze ans de service. Tu sors debout, avec des biens.',
    res:{ r:`Terres en Campanie, prime de démobilisation, quitus. Ce que quatre-vingt-dix hommes sur cent ne font pas.`, e:{peculium:3000}, choix:'missio_riche' } }
  ]},

{ t:'Ruspina', lieu:'Plaine côtière d’Africa', guerre:true,
  x:`Trente cohortes en fourrage, sans cavalerie ou presque. Labienus arrive avec des Numides et des archers montés, et fait ce qu’aucune infanterie ne sait combattre : tourner autour, tirer, refuser le choc, recommencer.<br><br>Il s’avance tête nue et interpelle les nôtres : <em>« Alors, bleus de la Deuxième ? Vous êtes bien féroces ! »</em>`,
  vue:{ soldat:'Tu vois Labienus à quarante pas, sans casque, qui te parle.',
        sousoff:'Un vétéran de ta centurie sort du rang sans qu’on le lui demande.',
        centurion:'Ta cohorte est en anneau, dos à dos, et perd un homme toutes les vingt secondes.',
        superieur:'César fait former un cercle unique et alterner les cohortes face en avant, face en arrière.' },
  nota:`Le <span class="lat">Bellum Africum</span>, écrit par un officier de César, rapporte la réponse : un vétéran ôta son casque pour être reconnu et lui jeta son pilum, tuant son cheval — « pour t’apprendre que c’est un vétéran de la Dixième qui te parle ». Labienus avait formé ces hommes neuf ans durant.`,
  o:[
  { t:'Former le cercle, une file face en avant, une face en arrière',
    res:{ r:`La cohorte devient une roue hérissée des deux côtés. Les Numides ne trouvent plus de dos à tirer. C’est la seule chose qui marche contre eux, et il a fallu la trouver sous les flèches.`, e:{disciplina:11, scientia:8, gratia:9, valetudo:-6} } },
  { t:'Répondre à Labienus',
    check:{ s:'auctoritas', dc:62 },
    ok:{ r:`Toute la ligne éclate de rire, et le rire vaut trois cohortes. Des hommes qui riaient il y a une seconde se remettent à tenir.`, e:{auctoritas:14, virtus:5, gratia:5, valetudo:-4} },
    ko:{ r:`Ta réplique tombe dans le sable. Les hommes autour de toi ont l’air plus vieux qu’il y a une minute.`, e:{auctoritas:-8, valetudo:-6} } },
  { t:'Marcher en carré, blessés au centre, sans accélérer',
    p:'sousoff',
    note:'Deux milles au pas sous le harcèlement. Personne n’est laissé.',
    res:{ r:`Deux milles en carré sans qu’un rang s’ouvre. On rentre avec tous les blessés. Les vieux de Gaule disent que c’est la plus belle chose qu’ils aient faite.`, e:{disciplina:12, auctoritas:15, gratia:7, valetudo:-6} } }
  ]},

{ t:'Thapsus', lieu:'Isthme entre la mer et la lagune', guerre:true,
  x:`César a manœuvré jusqu’à les enfermer sur un isthme où leur nombre et leurs soixante éléphants ne servent à rien.<br><br>Il hésite encore quand un trompette de l’aile droite, poussé par les hommes, sonne la charge de sa propre autorité. Toute la ligne part. Les centurions se jettent devant les enseignes pour retenir les rangs et sont emportés.`,
  vue:{ soldat:'La ligne part sans ordre et tu pars avec.',
        sousoff:'Ton enseigne est déjà à vingt pas devant toi.',
        centurion:'Te jeter devant l’enseigne, ou prendre la tête du mouvement.',
        superieur:'L’armée vient de déclencher elle-même une bataille. Tu peux la conduire ou la subir.' },
  nota:`La Cinquième légion porta l’éléphant sur ses enseignes après cette bataille : un légionnaire en abattit un qui allait piétiner un valet. Le carnage qui suivit — cinq mille rendus massacrés malgré les ordres — est le premier cas où l’armée de César échappa à son général.`,
  o:[
  { t:'Prendre la tête du mouvement et le conduire',
    res:{ r:`Tu ne peux pas l’arrêter, alors tu le diriges : tu cours devant et tu leur donnes une direction. Une charge conduite vaut cent fois une ruée.`, e:{auctoritas:13, virtus:7, gratia:9, valetudo:-5} } },
  { t:'Ouvrir les rangs en couloirs pour laisser passer les éléphants',
    need:{ s:'scientia', min:46 },
    res:{ r:`Les rangs s’ouvrent, la bête passe dans le vide, et douze pointes lui ouvrent les jarrets au passage. La méthode est vieille comme Zama et elle marche encore.`, e:{scientia:9, virtus:5, auctoritas:7, valetudo:-3} } },
  { t:'Tenter d’arrêter le massacre des rendus',
    p:'sousoff',
    check:{ s:'auctoritas', dc:74 },
    ok:{ r:`Tu te mets en travers, tu nommes tes hommes un par un, tu leur rappelles Alésia. Ils s’arrêtent. Deux cents hommes vivront parce que ta voix comptait plus que leur fureur.`, e:{auctoritas:17, gratia:12, virtus:4} },
    ko:{ r:`On te bouscule, on te menace, et un homme de ta propre unité te met la pointe sous le menton avant de te reconnaître. Tu n’oublieras pas cette seconde-là.`, e:{auctoritas:-11, valetudo:-6} } }
  ]},

{ t:'Quatre triomphes', lieu:'Rome, le Champ de Mars',
  x:`Gaule, Égypte, Pont, Afrique. Quarante éléphants portant des flambeaux. Vercingétorix, gardé six ans dans une cellule, marche devant le char, puis on l’étrangle le soir même selon l’usage.<br><br>Chaque légionnaire reçoit cinq mille deniers — vingt ans de solde. Les hommes chantent derrière le char des vers si obscènes que le triomphateur les écoute en souriant, parce que c’est le droit du soldat ce jour-là.`,
  nota:`Vingt-deux mille tables de banquet furent dressées dans la ville. Les tableaux représentant la mort de Caton déplurent au peuple : on pouvait triompher d’étrangers, pas de citoyens. César dut retirer certaines images.`,
  o:[
  { t:'Défiler et prendre l’argent',
    res:{ r:`Tu défiles sur la Voie sacrée, entre des gens qui ne savent rien de la Sambre ni d’Alésia et qui t’acclament quand même. Puis tu touches plus d’argent que ton père n’en a vu dans sa vie.`, e:{peculium:5000, valetudo:8, auctoritas:3} } },
  { t:'Investir immédiatement en terres autour de Capoue',
    res:{ r:`Tu achètes de la terre pendant que les autres achètent du vin. Dans quinze ans tu seras décurion municipal et tes fils seront des gens qu’on salue.`, e:{peculium:2500, scientia:6, gratia:5} } },
  { t:'Chercher les familles de tes morts et leur porter leur part',
    note:'Onze maisons. Dans chacune on te fera asseoir et l’on voudra savoir comment il est mort.',
    res:{ r:`Tu passes ta permission à faire le tour de l’Italie avec une bourse et une liste. Tu racontes onze fois. Tu rentres vidé et entier.`, e:{peculium:-1500, auctoritas:20, gratia:4, valetudo:-3} } }
  ]},

{ at:6, t:'Munda', lieu:'Bétique, sous la colline', guerre:true,
  x:`<em>« J’ai souvent combattu pour la victoire ; aujourd’hui, j’ai combattu pour ma vie. »</em><br><br>Ce ne sont pas des recrues en face : des légions romaines de vétérans, des transfuges, des proscrits qui savent qu’il n’y a pour eux ni pardon ni exil. Ils tiennent la hauteur. Ils n’ont nulle part où aller.<br><br>Les deux armées restent face à face une heure sans qu’un homme bouge. Puis la ligne monte, et s’arrête à mi-pente sans reculer ni avancer. Cela dure des heures.`,
  vue:{ soldat:'Tu pousses depuis deux heures contre un homme qui pousse aussi.',
        sousoff:'Personne ne recule. Personne n’avance. Il n’y a plus de manœuvre.',
        centurion:'Ce n’est plus une bataille, c’est une épreuve de force.',
        superieur:'La Dixième gagne du terrain à droite. Ils y envoient une légion prise à leur droite.' },
  nota:`César mit pied à terre et entra dans le rang avec un bouclier. Trente mille morts, dont Labienus. Sur treize aigles pompéiennes, treize furent prises. Ce fut la dernière bataille de sa vie ; il fut assassiné onze mois plus tard.`,
  o:[
  { t:'Pousser, et tenir, et pousser encore',
    res:{ r:`C’est tout ce que la journée demande et c’est presque plus qu’un homme peut donner. Le rang gagne trois pas en une heure.`, e:{virtus:10, disciplina:8, valetudo:-9} } },
  { t:'Saisir une enseigne et la porter de trois pas en avant',
    note:'Trois pas. La centurie suivra son enseigne. Tu paieras les trois pas.',
    res:{ r:`La centurie suit l’enseigne parce qu’une centurie suit toujours son enseigne, et la ligne entière se décale avec elle. César, qui a mis pied à terre et est entré dans le rang, voit qui a fait cela.`, e:{virtus:12, auctoritas:16, gratia:15, valetudo:-13, vulnus:1} } },
  { t:'Faire relever la première ligne par la deuxième, section par section',
    p:'centurion', need:{ s:'scientia', min:60 },
    res:{ r:`Tu fais tourner les rangs comme une meule : les hommes de devant reculent par les intervalles, les frais prennent leur place. Sur une bataille de poussée, c’est ce qui décide, et presque personne ne sait le faire sous le contact.`, e:{scientia:13, auctoritas:11, gratia:12, valetudo:-7} } },
  { t:'Crier que l’ennemi fuit quand ils déplacent une légion',
    p:'sousoff',
    check:{ s:'auctoritas', dc:70 },
    ok:{ r:`Le cri court des deux côtés de la ligne avec des effets exactement inverses. Leur front, qui tenait depuis huit heures, se persuade en trente secondes qu’il est abandonné — et casse.`, e:{auctoritas:16, gratia:14, scientia:6, valetudo:-6} },
    ko:{ r:`Ton cri est couvert par le bruit. La manœuvre s’achève proprement de leur côté et rien ne change.`, e:{valetudo:-10, auctoritas:-5} } }
  ]}
]}

];
