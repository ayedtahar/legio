/* ============================================================
   BATAILLES — la guerre civile, 49 à 45 av. J.-C.
   ============================================================ */

BATAILLES.ilerda = {
  nom:'Ilerda', lieu:'Sicoris, Hispanie citérieure', date:'Été 49 av. J.-C.',
  ennemi:'Afranius et Petreius — 5 légions pompéiennes', dc:56, issue:'capitulation sans bataille',
  intro:`« Je vais combattre une armée sans chef, pour aller ensuite combattre un chef sans armée. » Ce n’est pas une guerre de batailles : c’est une guerre de ponts, de gués, de collines prises la nuit et de blé. Des Romains face à des Romains, qui se connaissent, qui ont servi ensemble, et qui n’ont pas envie.`,
  phases:[
  { titre:'La crue',
    texte:`Une crue du Sicoris emporte nos deux ponts. L’armée est prise entre deux rivières, sans vivres, tandis que les convois qui viennent de Gaule s’accumulent de l’autre côté. À Rome, on annonce déjà que César est perdu.`,
    vue:{ soldat:'Un modius de blé se vend cinquante deniers. Il n’y en a plus à vendre.', sousoff:'Tes hommes mangent une racine qu’ils font bouillir.', centurion:'Il faut retraverser, ou mourir de faim entre deux fleuves.', superieur:'Un pont à vingt-deux milles en amont, ou des barques de coracle bâties sur le modèle breton.' },
    opts:[
    { id:'a', scopes:['*'], txt:'Bâtir des barques d’osier et de cuir, à la mode bretonne',
      req:{scientia:45}, test:{attr:'scientia', unit:'experientia', dc:0}, risque:'moyen',
      succes:{ txt:'Coques d’osier tressé, tendues de peaux : légères, portables sur chariot. On passe une brigade la nuit, on tient une tête de pont, et le pont se bâtit dessus en deux jours. Six ans de Bretagne servent enfin à quelque chose.', eff:{scientia:4,fama:7,favor:{caesar:8}}, perf:6 },
      echec:{ txt:'Les coques sont mal tendues, deux chavirent, on perd des hommes et une journée.', eff:{fama:-3}, pertes:5, perf:-2 } },
    { id:'b', scopes:['*'], txt:'Creuser des dérivations pour abaisser le niveau du fleuve',
      test:{attr:'disciplina', unit:'fatigatio', dc:10, inv:true}, risque:'moyen',
      succes:{ txt:'Trois canaux de trente pieds. Le fleuve baisse assez pour qu’un gué apparaisse. Les Pompéiens regardent une armée déplacer une rivière et commencent à comprendre à qui ils ont affaire.', eff:{disciplina:4,scientia:3,fama:6}, perf:5 },
      echec:{ txt:'Les canaux prennent une semaine et le fleuve baisse de deux pieds. C’est un pied de trop.', eff:{unit:{fatigatio:20,fides:-4}}, perf:-2 } },
    { id:'c', scopes:['*'], txt:'Tenir, rationner, attendre la décrue',
      test:{attr:'auctoritas', unit:'fides', dc:5}, risque:'moyen',
      succes:{ txt:'Tu rationnes, tu occupes les hommes, tu attends. La crue passe. C’était le pari le moins glorieux et il n’était pas mauvais.', eff:{auctoritas:2,disciplina:2,unit:{fides:4}}, perf:2 },
      echec:{ txt:'La faim entame la discipline. Deux hommes désertent vers Afranius et racontent tout ce qu’ils savent.', eff:{unit:{fides:-9},fama:-4}, perf:-2 } }
    ]},
  { titre:'Les deux camps se parlent',
    texte:`Le blocage rompu, les Pompéiens décrochent vers l’Èbre et nous les devançons par une marche de nuit à travers un défilé. Les deux armées campent à portée de voix. Et alors les soldats se mettent à s’appeler par leur nom d’un camp à l’autre, à se rendre visite, à demander des nouvelles des familles.`,
    vue:{ soldat:'Un homme de la Deuxième te reconnaît. Vous avez servi ensemble en Gaule.', sousoff:'La moitié de ta centurie est dans le camp d’en face à boire.', centurion:'Petreius fait tuer les nôtres qu’il trouve dans son camp. César renvoie les siens intacts.', superieur:'Cette fraternisation gagne la guerre plus sûrement qu’une bataille.' },
    opts:[
    { id:'a', scopes:['*'], txt:'Traverser et parler à ceux d’en face',
      test:{attr:'ingenium', dc:0}, risque:'moyen',
      succes:{ txt:'Tu passes une soirée avec des hommes qui t’ont couvert le flanc à Alésia. Vous convenez qu’aucun de vous ne sait pourquoi il est là. Deux jours plus tard, ils se rendent sans un coup de glaive.', eff:{ingenium:3,fama:5,favor:{caesar:6}}, perf:5 },
      echec:{ txt:'Petreius fait fouiller le camp pendant que tu y es. Tu sors par-dessus la palissade et tu laisses ton manteau.', eff:{valetudo:-10,fama:-2}, blessure:.2, perf:-1 } },
    { id:'b', scopes:['sousoff','centurion','superieur'], txt:'Renvoyer intacts les Pompéiens trouvés dans notre camp',
      test:{attr:'auctoritas', dc:-5}, risque:'faible',
      succes:{ txt:'Tu les fais raccompagner à la porte avec leurs armes, pendant que Petreius égorge les nôtres dans son camp. La différence circule dans les deux armées avant le soir. C’est la seule arme qui compte dans cette guerre.', eff:{auctoritas:3,ingenium:3,fama:7,favor:{caesar:9}}, perf:5 },
      echec:{ txt:'Deux de tes hommes en profitent pour régler un compte. Le geste est gâché et tu dois t’en expliquer.', eff:{fama:-4,favor:{caesar:-4}}, perf:-1 } },
    { id:'c', scopes:['*'], txt:'Interdire tout contact et fermer ton secteur',
      test:{attr:'disciplina', dc:5}, risque:'faible',
      succes:{ txt:'Ton secteur reste étanche. Discipline irréprochable, et tu passes à côté de la manœuvre politique la plus habile de la guerre.', eff:{disciplina:4,unit:{cohaesio:4}}, perf:2 },
      echec:{ txt:'On passe quand même, par-dessus le fossé, la nuit. Ton interdiction est un ordre non exécuté de plus.', eff:{auctoritas:-3}, perf:-1 } }
    ]},
  { titre:'La soif',
    texte:`Coupés de l’eau, entourés sans être attaqués, les Pompéiens capitulent. César ne demande rien : ni serment, ni service. Il licencie l’armée et rembourse même le blé. Cinq légions disparaissent sans qu’il y ait eu de bataille.`,
    vue:{ soldat:'On te fait garder un point d’eau contre des Romains qui ont soif.', sousoff:'Ils envoient des hommes désarmés chercher de l’eau. Il faut décider.', centurion:'Tes ordres sont d’interdire l’accès à la rivière.', superieur:'Un assaut coûterait deux mille hommes et gagnerait deux jours.' },
    opts:[
    { id:'a', scopes:['*'], txt:'Interdire l’eau strictement',
      test:{attr:'disciplina', dc:-10}, risque:'faible',
      succes:{ txt:'Rien ne passe. Ils capitulent quarante-huit heures plus tôt. Aucun mort des deux côtés — c’est la soif qui a fait le travail.', eff:{disciplina:3,favor:{caesar:5}}, perf:3 },
      echec:{ txt:'Un poste laisse passer. Le siège dure trois jours de plus et l’on te le fait remarquer.', eff:{fama:-3}, perf:-1 } },
    { id:'b', scopes:['*'], txt:'Laisser boire les non-combattants',
      test:{attr:'ingenium', dc:5}, risque:'moyen',
      succes:{ txt:'Tu laisses passer les valets et les mulets. Cela ne change rien à l’issue et cela change tout à ce que ces hommes diront de nous, dans dix ans, dans les tavernes de Tarragone.', eff:{ingenium:3,fama:4,unit:{fides:6}}, perf:3 },
      echec:{ txt:'Des combattants passent parmi les valets et le siège s’étire. Ton indulgence a un nom dans le rapport et ce n’est pas indulgence.', eff:{favor:{caesar:-5},fama:-3}, perf:-2 } },
    { id:'c', scopes:['centurion','superieur'], txt:'Proposer à César de donner l’assaut pour en finir',
      test:{attr:'virtus', dc:20}, risque:'élevé',
      succes:{ txt:'Il t’écoute, te remercie, et refuse : « Pourquoi perdrais-je des hommes, même les leurs ? » Tu comprends ce jour-là que tu sers un homme qui compte différemment.', eff:{virtus:2,scientia:3,favor:{caesar:3}}, perf:4 },
      echec:{ txt:'« Vous êtes pressé de tuer des Romains. » Il le dit sans hausser la voix, devant six officiers. Tu t’en souviendras longtemps.', eff:{favor:{caesar:-10},fama:-5}, perf:-3 } }
    ]}
  ]};

BATAILLES.dyrrachium = {
  nom:'Dyrrachium', lieu:'Lignes de siège, Épire', date:'Juillet 48 av. J.-C.',
  ennemi:'Pompée — armée double, maîtrise de la mer', dc:68, issue:'défaite',
  intro:`Nous assiégeons un adversaire deux fois plus nombreux, ravitaillé par mer, pendant que nous mangeons une racine appelée <span class="lat">chara</span>, broyée et mêlée de lait. Quinze milles de lignes tenues à un homme tous les trois pas. Pompée n’a qu’à trouver le point faible, et il a tout le temps du monde.`,
  phases:[
  { titre:'Le fortin de Scaeva',
    texte:`Deux transfuges allobroges ont livré à Pompée le plan exact de nos lignes et le point de jonction inachevé. Il y jette soixante cohortes par terre et par mer, sur trois faces à la fois. Un fortin tient : celui où commande le centurion Cassius Scaeva.`,
    vue:{ soldat:'Le fortin reçoit des traits des trois côtés. Il en tombe comme de la pluie.', sousoff:'Le centurion a un œil crevé et continue de commander.', centurion:'Le fortin est intenable. L’ordre est de tenir.', superieur:'Si ce fortin tombe, la ligne entière est prise à revers.' },
    opts:[
    { id:'a', scopes:['*'], txt:'Tenir le fortin coûte que coûte',
      test:{attr:'virtus', unit:'fides', dc:20}, risque:'très élevé',
      crit:{ txt:'On ramassera cent vingt trous dans le bouclier de Scaeva et trente mille traits dans le fortin. Tu es de ceux qui n’en sont pas sortis en courant. César donnera deux cent mille sesterces à Scaeva et une double solde à tous les survivants — toi compris.', eff:{virtus:7,fama:16,auctoritas:4,peculium:1200,favor:{caesar:14,scaeva:20}}, pertes:26, blessure:.5, mort:.05, perf:12 },
      succes:{ txt:'Le fortin tient. Tu en sors avec le bras gauche inutilisable et une réputation qui te suivra jusqu’en Espagne.', eff:{virtus:5,fama:11,peculium:600,favor:{caesar:9,scaeva:12}}, pertes:24, blessure:.6, perf:10 },
      echec:{ txt:'Le fortin tient sans toi : on t’a évacué inconscient au bout d’une heure. Personne ne te le reproche. Personne ne l’oublie non plus.', eff:{valetudo:-28,fama:-2}, blessure:.8, mort:.09, pertes:24, perf:-1 } },
    { id:'b', scopes:['centurion','superieur'], txt:'Faire décrocher la garnison et rétablir la ligne en arrière',
      test:{attr:'scientia', unit:'experientia', dc:15}, risque:'élevé',
      succes:{ txt:'Tu sacrifies le fortin et tu sauves la garnison en te repliant sur une seconde ligne improvisée. Militairement c’est juste. Dans une armée, c’est un mot qu’on t’accolera longtemps.', eff:{scientia:4,auctoritas:2,fama:-4,unit:{fides:7}}, pertes:11, perf:5 },
      echec:{ txt:'Le décrochage sous assaut se paie comptant : tu perds le fortin et la moitié de la garnison.', eff:{fama:-8,unit:{fides:-8}}, pertes:28, blessure:.4, mort:.05, perf:-3 } }
    ]},
  { titre:'La déroute',
    texte:`Trente-deux enseignes perdues, mille hommes tués — dont trente-deux tribuns et centurions, la plupart écrasés dans la fuite par les leurs plutôt que par l’ennemi. Un porte-enseigne blessé tend son aigle à des cavaliers en disant : « Rendez-la au moins à César. »`,
    vue:{ soldat:'Tu cours au milieu d’hommes qui courent.', sousoff:'Ton enseigne est encore debout. Beaucoup ne le sont plus.', centurion:'Tu peux arrêter une trentaine d’hommes si tu te mets en travers maintenant.', superieur:'Si Pompée pousse, la guerre finit ce soir. Il ne pousse pas.' },
    opts:[
    { id:'a', scopes:['*'], txt:'Te mettre en travers de la fuite, enseigne en main',
      test:{attr:'auctoritas', dc:20}, risque:'très élevé',
      succes:{ txt:'Tu plantes l’enseigne et tu cries. Une trentaine d’hommes s’arrêtent, puis cent. César fera la même chose plus loin et se fera bousculer par ses propres soldats — un porte-enseigne retournera son aigle contre lui. Toi, on t’écoute.', eff:{auctoritas:6,virtus:4,fama:12,favor:{caesar:10}}, pertes:14, blessure:.35, perf:12 },
      echec:{ txt:'Le flot te renverse et te piétine. On te relève avec trois côtes cassées et l’enseigne perdue.', eff:{valetudo:-24,fama:-6}, blessure:.6, mort:.05, pertes:18, perf:-4 } },
    { id:'b', scopes:['*'], txt:'Sauver ton unité et te replier en ordre',
      test:{attr:'disciplina', unit:'cohaesio', dc:5}, risque:'moyen',
      succes:{ txt:'Tu ramènes ton monde groupé, avec les enseignes et les blessés. Dans une déroute, une unité intacte vaut trois unités.', eff:{disciplina:4,auctoritas:3,unit:{cohaesio:6,fides:8},fama:4}, pertes:9, perf:5 },
      echec:{ txt:'La cohésion craque à deux cents pas de la ligne. Tu rentres avec les deux tiers de tes gens et sans savoir où sont les autres.', eff:{unit:{cohaesio:-14}}, pertes:20, blessure:.3, perf:-2 } },
    { id:'c', scopes:['*'], txt:'Récupérer les enseignes tombées',
      test:{attr:'virtus', dc:15}, risque:'élevé',
      succes:{ txt:'Tu en ramènes trois. Les enseignes perdues sont ce dont une légion ne se remet pas ; celles-là, elle les a encore.', eff:{virtus:4,fama:10,unit:{cohaesio:8},favor:{caesar:8}}, pertes:16, blessure:.4, perf:9 },
      echec:{ txt:'Tu en ramènes une, et il t’en a coûté quatre hommes. Le calcul n’est pas bon et tu le sais.', eff:{fama:2,unit:{fides:-4}}, pertes:20, blessure:.45, mort:.04, perf:-1 } }
    ]},
  { titre:'« Aujourd’hui la victoire était à l’ennemi »',
    texte:`César rassemble l’armée. Il casse plusieurs porte-enseignes, dégrade, et dit cette phrase que tout le camp répétera : « Aujourd’hui la victoire était à l’ennemi, s’ils avaient eu quelqu’un pour vaincre. » Les légions, humiliées, demandent d’elles-mêmes la décimation. Il refuse. On lève le camp la nuit même vers la Thessalie.`,
    vue:{ soldat:'Les hommes réclament d’être punis. Tu n’as jamais vu cela.', sousoff:'Ta centurie veut se racheter et le dit tout haut.', centurion:'On te demande de désigner les fautifs de ton secteur.', superieur:'Une armée humiliée qui veut se racheter est l’arme la plus dangereuse qui existe.' },
    opts:[
    { id:'a', scopes:['*'], txt:'Assumer devant César pour tes hommes',
      test:{attr:'auctoritas', dc:10}, risque:'moyen',
      succes:{ txt:'Tu dis que la faute est au commandement du secteur, c’est-à-dire à toi. Il te regarde, ne dit rien, et ne te retire rien. Tes hommes non plus ne diront rien, et te suivront à Pharsale comme des chiens.', eff:{auctoritas:5,fama:6,unit:{fides:14}}, perf:5 },
      echec:{ txt:'Tu t’accuses trop bien. On te prend au mot : tu descends d’un cran dans l’ordre des cohortes.', eff:{fama:-6,auctoritas:-3,favor:{caesar:-4}}, perf:-2 } },
    { id:'b', scopes:['*'], txt:'Désigner les fautifs comme demandé',
      test:{attr:'disciplina', dc:0}, risque:'faible',
      succes:{ txt:'Tu donnes trois noms exacts, sans en ajouter ni en retrancher. On les casse de leur grade et l’on te sait juste.', eff:{disciplina:3,auctoritas:2,unit:{fides:-3}}, perf:2 },
      echec:{ txt:'Tes noms sont contestés par les hommes eux-mêmes, qui en donnent d’autres. Tu passes pour un officier qui ne sait pas ce qui se passe dans son unité.', eff:{auctoritas:-4,fama:-4}, perf:-1 } },
    { id:'c', scopes:['*'], txt:'Faire jurer à ton unité de ne pas reculer devant Pompée',
      test:{attr:'auctoritas', unit:'fides', dc:5}, risque:'moyen',
      succes:{ txt:'Ils jurent devant l’enseigne, à voix basse, sans emphase, comme des gens qui ont l’intention de tenir parole. Ils la tiendront dans trois semaines, en Thessalie.', eff:{auctoritas:4,unit:{fides:12,cohaesio:8},fama:4}, perf:5 },
      echec:{ txt:'Le serment sonne creux dans une unité qui vient d’être battue. Ils le prêtent parce que tu le demandes, et c’est tout.', eff:{unit:{fides:2}}, perf:0 } }
    ]}
  ]};

BATAILLES.pharsale = {
  nom:'Pharsale', lieu:'Plaine de l’Énipeus, Thessalie', date:'9 août 48 av. J.-C.',
  ennemi:'Pompée — 45 000 fantassins, 7 000 cavaliers', dc:64, issue:'victoire décisive',
  intro:`Vingt-deux mille contre quarante-cinq mille, et sept mille cavaliers contre mille. Labienus, qui fut le premier légat de César pendant neuf ans et connaît chacune de nos habitudes, a juré au conseil pompéien de ne revenir au camp que vainqueur. Le mot d’ordre de notre côté est <span class="lat">Venus Victrix</span>. Du leur, <span class="lat">Hercules Invictus</span>.`,
  phases:[
  { titre:'La quatrième ligne',
    texte:`César a vu que toute la cavalerie ennemie est massée à leur gauche, face à notre droite : elle nous débordera et nous prendra à revers, c’est mathématique. Alors il retire six cohortes de la troisième ligne et les poste en oblique derrière la droite, cachées, avec un ordre singulier.`,
    vue:{ soldat:'On te retire du rang et on te place en arrière, en biais, sans t’expliquer.', sousoff:'Ordre étrange : ne pas lancer le pilum. Le garder en main comme une pique.', centurion:'Ta cohorte fait partie des six. L’ordre est de viser le visage.', superieur:'Six cohortes contre sept mille cavaliers. Toute la bataille tient là-dessus.' },
    opts:[
    { id:'a', scopes:['*'], txt:'Exécuter l’ordre à la lettre : pilum en main, pointer au visage', note:'Ce sont de jeunes nobles romains, beaux, qui craignent plus une cicatrice que la mort.',
      test:{attr:'disciplina', unit:'cohaesio', dc:10}, risque:'élevé',
      crit:{ txt:'Sept mille cavaliers arrivent sur six cohortes qui se lèvent d’un coup et leur portent le fer de pilum au visage. Ils tournent bride tous ensemble et n’arrêtent qu’aux collines. La bataille est jouée en quatre minutes, sur une idée.', eff:{disciplina:5,virtus:4,fama:14,favor:{caesar:14}}, pertes:9, perf:11 },
      succes:{ txt:'La ligne se lève, les fers montent aux visages, la cavalerie se disloque. Tu ne comprendras qu’après ce que vous venez de faire.', eff:{disciplina:4,virtus:3,fama:9,favor:{caesar:9}}, pertes:12, blessure:.25, perf:9 },
      echec:{ txt:'Le mouvement part trop tôt, les cohortes sont vues, et la charge se dévie sur ton flanc au lieu de se briser dessus.', eff:{unit:{cohaesio:-12}}, pertes:22, blessure:.4, perf:-3 } },
    { id:'b', scopes:['*'], txt:'Lancer les pila comme d’habitude et recevoir la charge',
      test:{attr:'virtus', dc:20}, risque:'très élevé',
      succes:{ txt:'Tu fais ce que tu as toujours fait. La volée abat des chevaux, la charge passe quand même, et il faut se battre contre de la cavalerie sans piques. Vous tenez, chèrement.', eff:{virtus:3}, pertes:24, blessure:.45, mort:.04, perf:0 },
      echec:{ txt:'La charge te passe dessus. Ce que six cohortes devaient briser, elles ne l’ont pas brisé, et l’aile droite est tournée.', eff:{fama:-8,favor:{caesar:-8},unit:{cohaesio:-16}}, pertes:32, blessure:.5, mort:.08, perf:-4 } }
    ]},
  { titre:'La ligne qui n’avance pas',
    texte:`Pompée a ordonné à son infanterie de recevoir notre charge à pied ferme, sans avancer, pour que nous arrivions essoufflés. Nos hommes, à mi-chemin, voient que l’ennemi ne bouge pas — et s’arrêtent d’eux-mêmes pour reprendre haleine, sans qu’un ordre soit donné, puis repartent.`,
    vue:{ soldat:'Le rang s’arrête tout seul. Personne n’a rien crié.', sousoff:'Dix ans de service font qu’une ligne pense sans qu’on lui parle.', centurion:'Tes hommes ont corrigé une erreur de l’ennemi tout seuls.', superieur:'Pompée vient de perdre l’élan de ses propres rangs pour rien.' },
    opts:[
    { id:'a', scopes:['*'], txt:'Laisser faire et repartir avec eux',
      test:{attr:'disciplina', unit:'experientia', dc:-10}, risque:'faible',
      succes:{ txt:'Tu ne dis rien parce qu’il n’y a rien à dire : ils ont raison. C’est une armée qui n’a plus besoin qu’on lui explique.', eff:{disciplina:3,unit:{cohaesio:6,experientia:4}}, pertes:6, perf:3 },
      echec:{ txt:'Ton unité, moins aguerrie, s’arrête et ne repart pas au même moment que les autres. Le choc se fait en désordre.', eff:{unit:{cohaesio:-6}}, pertes:12, perf:-1 } },
    { id:'b', scopes:['sousoff','centurion','superieur'], txt:'Crier de charger sans s’arrêter',
      test:{attr:'auctoritas', dc:15}, risque:'moyen',
      succes:{ txt:'Ton unité arrive la première, essoufflée mais lancée, et enfonce avant que les autres n’arrivent. C’est brillant, c’est risqué, et cela laisse tes flancs nus une minute entière.', eff:{virtus:4,fama:7}, pertes:15, blessure:.3, perf:3 },
      echec:{ txt:'Tu arrives seul, sans souffle, devant une ligne fraîche. La minute qui suit est la plus longue de ta vie.', eff:{valetudo:-18,unit:{cohaesio:-8}}, pertes:24, blessure:.45, mort:.04, perf:-2 } }
    ]},
  { titre:'Le camp de Pompée',
    texte:`La troisième ligne fraîche, encore jamais engagée, entre dans la bataille au moment où la cavalerie fuit. La ligne pompéienne casse. Dans leur camp, on trouve les tentes ornées de myrte, les tables dressées, l’argenterie sortie : ils avaient préparé le banquet de la victoire. Pompée est parti à cheval par la porte arrière.`,
    vue:{ soldat:'Tu entres dans un camp où le repas est servi.', sousoff:'Tes hommes se jettent sur les tables plutôt que sur les fuyards.', centurion:'On peut piller le camp ou poursuivre les légions qui refluent vers la colline.', superieur:'Poursuivre maintenant, c’est finir la guerre aujourd’hui.' },
    opts:[
    { id:'a', scopes:['*'], txt:'Poursuivre sans s’arrêter au camp',
      test:{attr:'disciplina', unit:'fatigatio', dc:15, inv:true}, risque:'moyen',
      succes:{ txt:'Tu passes devant les tables sans regarder et tu montes sur la colline où ils se sont réfugiés. On les coupe de l’eau ; au matin, vingt-quatre mille hommes se rendent. La guerre pouvait durer trois ans ; elle a duré une après-midi.', eff:{disciplina:5,fama:10,favor:{caesar:12}}, pertes:8, perf:7 },
      echec:{ txt:'Tes hommes ne t’écoutent pas : il y a de l’argenterie sur les tables et six mois de racines dans le ventre. Tu les regardes piller.', eff:{auctoritas:-4,peculium:500}, perf:-2 } },
    { id:'b', scopes:['*'], txt:'Piller le camp',
      test:{attr:'ingenium', dc:-10}, risque:'faible',
      succes:{ txt:'La vaisselle des sénateurs de Rome, les coffres, les chevaux. Tu ne reverras jamais un butin pareil et tu le sais.', eff:{peculium:1400,unit:{fides:5},fama:-3,favor:{caesar:-4}}, perf:1 },
      echec:{ txt:'Tu arrives après les autres. Il reste des couronnes de myrte et de la vaisselle cassée.', eff:{peculium:300,fama:-3}, perf:-1 } },
    { id:'c', scopes:['centurion','superieur'], txt:'Faire épargner et rassembler les prisonniers romains', note:'César a donné l’ordre : « Épargnez les citoyens. » Il l’a donné à des hommes qui viennent de perdre des camarades.',
      test:{attr:'auctoritas', dc:10}, risque:'moyen',
      succes:{ txt:'Tu tiens tes hommes et tu ramasses les rendus par centaines, désarmés, vivants. Beaucoup serviront sous nos enseignes avant six mois. C’est ainsi que César gagne : il ne détruit pas les armées, il les absorbe.', eff:{auctoritas:5,ingenium:3,fama:8,favor:{caesar:12}}, perf:6 },
      echec:{ txt:'On tue plus qu’il n’aurait fallu dans ton secteur. Six mille morts sur le champ, dont beaucoup après la fin. Ton nom figure dans un rapport où il n’aurait pas dû.', eff:{favor:{caesar:-8},fama:-5}, perf:-2 } }
    ]},
  { titre:'Labienus',
    texte:`Il avait juré de ne revenir au camp que vainqueur. Il ne revient pas : il passe en Afrique par la Grèce, avec ce qu’il peut sauver, et continuera la guerre trois ans encore. Sur le champ, César regarde les morts romains et dit : « Ils l’ont voulu. »`,
    vue:{ soldat:'On enterre. Six mille Romains.', sousoff:'Tu reconnais des visages dans les fossés.', centurion:'Des hommes qui ont servi sous toi en Gaule sont en face, morts ou rendus.', superieur:'Le corps de la République est là, dans la plaine, et l’on doit décider quoi en faire.' },
    opts:[
    { id:'a', scopes:['*'], txt:'Faire enterrer les morts des deux camps sans distinction',
      test:{attr:'auctoritas', dc:0}, risque:'faible',
      succes:{ txt:'Mêmes fosses, mêmes rites, même hâte. Ce sont des Romains. On ne sait plus qui était de quel côté au bout de trois heures, et c’est peut-être exactement le sujet.', eff:{auctoritas:3,fama:6,unit:{fides:8}}, perf:3 },
      echec:{ txt:'Les hommes rechignent à enterrer ceux qui les ont attaqués hier. Il faut leur ordonner deux fois.', eff:{unit:{fides:-3}}, perf:0 } },
    { id:'b', scopes:['*'], txt:'Chercher parmi les rendus ceux que tu connais',
      test:{attr:'ingenium', dc:0}, risque:'faible',
      succes:{ txt:'Tu en retrouves deux ou trois. On se serre le bras, on ne se dit rien, ils reprendront du service sous d’autres enseignes. C’est ainsi que finissent les guerres civiles : dans une gêne.', eff:{ingenium:2,fama:3}, perf:2 },
      echec:{ txt:'Ceux que tu cherches ne sont ni parmi les vivants ni identifiables parmi les morts.', eff:{valetudo:-4}, perf:0 } },
    { id:'c', scopes:['centurion','superieur'], txt:'Brûler la correspondance saisie de Pompée sans la lire', note:'Ce que César a fait, publiquement, avec les lettres qui compromettaient la moitié de Rome.',
      test:{attr:'ingenium', dc:10}, risque:'moyen',
      succes:{ txt:'Tu fais porter les coffres au feu devant témoins, sans qu’un rouleau soit ouvert. Trente sénateurs t’en seront reconnaissants sans jamais te le dire. Cela vaut mieux que trente ennemis.', eff:{ingenium:5,auctoritas:3,fama:8,favor:{caesar:8}}, perf:6 },
      echec:{ txt:'Un tribun a lu avant toi et a fait des copies. L’affaire remontera, et l’on se demandera ce que tu as gardé.', eff:{fama:-5,favor:{caesar:-5}}, perf:-2 } }
    ]}
  ]};

BATAILLES.pharos = {
  nom:'Le Phare', lieu:'Alexandrie, môle de l’Heptastade', date:'Hiver–printemps 47 av. J.-C.',
  ennemi:'20 000 Alexandrins dans leur propre ville', dc:62, issue:'victoire de justesse',
  intro:`Trois mille deux cents hommes dans une ville de trois cent mille, enfermés dans le quartier du palais. Les Alexandrins ont coupé les aqueducs et pompent l’eau de mer dans les citernes. On creuse des puits dans le sable jour et nuit. Le combat se fait de terrasse en terrasse, de rue en rue, dans une ville où l’on ne voit jamais à plus de vingt pas.`,
  phases:[
  { titre:'L’eau salée',
    texte:`L’eau des citernes devient saumâtre, puis franchement salée. La panique gagne : les hommes disent qu’il faut rembarquer tant qu’on le peut. César fait creuser sur toute la longueur du rivage, en assurant qu’un sol côtier donne toujours de l’eau douce à peu de profondeur.`,
    vue:{ soldat:'Tu creuses dans le sable depuis douze heures. L’eau est salée à trois pieds.', sousoff:'Tes hommes veulent embarquer. Ils le disent devant toi.', centurion:'Une nuit de creusement, ou une mutinerie.', superieur:'S’il n’y a pas d’eau douce demain, l’armée décide toute seule.' },
    opts:[
    { id:'a', scopes:['*'], txt:'Creuser toute la nuit, secteur par secteur',
      test:{attr:'disciplina', unit:'fides', dc:10}, risque:'moyen',
      succes:{ txt:'Une veine d’eau douce à sept pieds, avant l’aube. On boit à genoux dans le sable. Le siège vient de changer de nature parce que quelqu’un a continué de creuser.', eff:{disciplina:4,scientia:2,fama:6,unit:{fides:10}}, perf:5 },
      echec:{ txt:'Rien. On boit l’eau des tonneaux des navires, rationnée à une louche, en comptant les jours.', eff:{unit:{fides:-8,fatigatio:16}}, perf:-2 } },
    { id:'b', scopes:['sousoff','centurion','superieur'], txt:'Calmer les hommes en promettant l’embarquement pour demain', note:'Une promesse qu’on ne tiendra pas achète une nuit. Elle coûte plus tard.',
      test:{attr:'ingenium', dc:0}, risque:'moyen',
      succes:{ txt:'Tu gagnes la nuit. L’eau est trouvée avant que la promesse ne vienne à échéance, et personne ne te la rappelle.', eff:{ingenium:3,unit:{fides:3}}, perf:2 },
      echec:{ txt:'L’eau n’est pas trouvée et les hommes se souviennent très bien de ce que tu as promis.', eff:{auctoritas:-5,unit:{fides:-10}}, perf:-2 } }
    ]},
  { titre:'Le môle',
    texte:`Il faut prendre le môle qui relie le Phare à la ville pour dégager le port. On l’enlève, puis les Alexandrins contre-attaquent et la panique prend nos hommes sur une chaussée où l’on ne peut ni fuir ni manœuvrer. César lui-même doit sauter d’un navire qui coule et gagner le sien à la nage, sur deux cents pas, en tenant ses papiers d’une main hors de l’eau.`,
    vue:{ soldat:'Le môle est large de trente pas et il y a de l’eau des deux côtés.', sousoff:'Les navires qui devaient nous recueillir sont surchargés et coulent.', centurion:'Quatre cents hommes vont se noyer si personne ne tient l’extrémité.', superieur:'Huit cents morts sur une chaussée. C’est le pire quart d’heure depuis Gergovie.' },
    opts:[
    { id:'a', scopes:['*'], txt:'Tenir l’extrémité du môle pour couvrir le rembarquement',
      test:{attr:'virtus', unit:'cohaesio', dc:15}, risque:'très élevé',
      succes:{ txt:'Vous formez un bouchon de trente hommes en travers de la chaussée pendant que les autres passent. Vous êtes les derniers à embarquer, à l’eau jusqu’à la ceinture.', eff:{virtus:5,auctoritas:4,fama:11,unit:{fides:12}}, pertes:20, blessure:.4, mort:.04, perf:10 },
      echec:{ txt:'Le bouchon saute et tout le monde se retrouve à l’eau en même temps. Tu perds ton bouclier, ton casque et des hommes.', eff:{valetudo:-22}, pertes:28, blessure:.5, mort:.08, perf:-4 } },
    { id:'b', scopes:['*'], txt:'Faire jeter les armes lourdes et nager',
      test:{attr:'scientia', dc:0}, risque:'élevé',
      succes:{ txt:'Cotte de mailles à la mer, bouclier à la mer, et deux cents pas de nage. On perd l’équipement de trois centuries et l’on ramène trois centuries d’hommes.', eff:{scientia:3,unit:{fides:9},peculium:-200}, pertes:9, perf:5 },
      echec:{ txt:'Ceux qui savaient nager s’en sont tirés. Les autres non, et beaucoup ne savaient pas.', eff:{unit:{fides:-6}}, pertes:22, mort:.05, perf:-3 } },
    { id:'c', scopes:['centurion','superieur'], txt:'Refuser d’engager sur le môle et le dire au conseil',
      req:{scientia:55}, test:{attr:'scientia', dc:20}, risque:'moyen',
      succes:{ txt:'Tu expliques qu’une chaussée de trente pas sans issue est un piège quelle que soit la valeur des troupes. On t’écoute à moitié, on engage quand même, mais ta cohorte reste en réserve — et huit cents morts n’en font pas partie.', eff:{scientia:5,fama:4,unit:{fides:8}}, pertes:2, perf:5 },
      echec:{ txt:'On te répond qu’un officier qui explique pourquoi il ne peut pas est un officier qu’on remplace. Ta cohorte y va quand même.', eff:{fama:-6,favor:{caesar:-6}}, pertes:24, blessure:.4, perf:-2 } }
    ]}
  ]};

BATAILLES.ruspina = {
  nom:'Ruspina', lieu:'Plaine côtière d’Africa', date:'4 janvier 46 av. J.-C.',
  ennemi:'Labienus — cavalerie numide et archers montés', dc:66, issue:'survie',
  intro:`Trente cohortes en fourrage, sans cavalerie ou presque. Labienus arrive avec de la cavalerie numide et des archers montés, et se met à faire ce qu’aucune infanterie ne sait combattre : tourner autour, tirer, refuser le choc, recommencer. Il connaît les légions de César mieux que quiconque : il les a formées.`,
  phases:[
  { titre:'L’encerclement',
    texte:`Ils forment un anneau autour de nous et le resserrent. Quand nos hommes chargent, ils se dérobent ; quand nos hommes reviennent, ils reviennent aussi. Le rang romain n’a rien à mordre. Labienus s’avance tête nue et interpelle les nôtres : « Alors, bleus de la Deuxième ? Vous êtes bien féroces ! »`,
    vue:{ soldat:'Tu vois Labienus à quarante pas, sans casque, qui te parle.', sousoff:'Un vétéran de ta centurie sort du rang.', centurion:'Ta cohorte est en anneau, dos à dos, et perd un homme toutes les vingt secondes.', superieur:'César fait former un cercle unique et alterner les cohortes face en avant, face en arrière.' },
    opts:[
    { id:'a', scopes:['*'], txt:'Répondre à Labienus',
      test:{attr:'ingenium', dc:5}, risque:'moyen',
      succes:{ txt:'Un vieux de la Dixième ôte son casque pour qu’il le reconnaisse et lui jette son pilum, qui tue son cheval : « Voilà pour t’apprendre que c’est un vétéran de la Dixième qui te parle. » Toute la ligne éclate de rire, et le rire vaut trois cohortes.', eff:{ingenium:3,virtus:2,fama:8,unit:{fides:12,cohaesio:8}}, pertes:8, perf:6 },
      echec:{ txt:'Tu réponds mal, ou trop tard, et la réplique tombe dans le sable. Les hommes autour de toi ont l’air plus vieux qu’il y a une minute.', eff:{fama:-4,unit:{cohaesio:-5}}, pertes:12, perf:-2 } },
    { id:'b', scopes:['*'], txt:'Former le cercle, une file face en avant, une face en arrière',
      test:{attr:'disciplina', unit:'experientia', dc:10}, risque:'élevé',
      succes:{ txt:'La cohorte devient une roue hérissée des deux côtés. Les Numides ne trouvent plus de dos à tirer. C’est la seule chose qui marche contre eux et il a fallu la trouver sous les flèches.', eff:{disciplina:5,scientia:3,fama:8,favor:{caesar:9}}, pertes:11, blessure:.25, perf:9 },
      echec:{ txt:'Le cercle se forme à moitié. Les hommes qui devaient faire face en arrière regardent en avant, et les flèches entrent par-derrière.', eff:{unit:{cohaesio:-12}}, pertes:22, blessure:.45, mort:.04, perf:-3 } },
    { id:'c', scopes:['*'], txt:'Charger pour rompre l’anneau et gagner la crête',
      test:{attr:'virtus', unit:'fatigatio', dc:20, inv:true}, risque:'très élevé',
      succes:{ txt:'Une pointe brutale, courte, et vous êtes dehors avec une hauteur sous les pieds. Ils ne peuvent plus tourner autour de vous.', eff:{virtus:5,fama:9,unit:{cohaesio:5}}, pertes:17, blessure:.35, perf:10 },
      echec:{ txt:'La charge s’étire, la cohorte se disloque, et une cohorte disloquée face à de la cavalerie légère n’est plus une cohorte : c’est une file de cibles.', eff:{unit:{cohaesio:-16},fama:-6}, pertes:30, blessure:.5, mort:.09, perf:-4 } }
    ]},
  { titre:'Le décrochage',
    texte:`Le combat dure du matin au soir sans que la ligne cède. À la nuit, César fait décrocher vers le camp de Ruspina, en marchant en carré, blessés au centre. Ce n’est pas une victoire : c’est une armée qui rentre entière alors qu’elle aurait dû être détruite.`,
    vue:{ soldat:'Tu marches depuis onze heures et tu n’as pas mangé.', sousoff:'Les blessés au centre. Personne n’est laissé.', centurion:'Deux milles à faire en carré, sous les flèches.', superieur:'Un carré qui marche est la formation la plus difficile de l’art militaire.' },
    opts:[
    { id:'a', scopes:['*'], txt:'Marcher en carré, blessés au centre, sans accélérer',
      test:{attr:'disciplina', unit:'cohaesio', dc:5}, risque:'moyen',
      succes:{ txt:'Deux milles au pas, en carré, sous le harcèlement, sans qu’un rang s’ouvre. On rentre avec tous ses blessés. Les vieux de Gaule disent que c’est la plus belle chose qu’ils aient faite.', eff:{disciplina:5,auctoritas:3,fama:9,unit:{fides:14,cohaesio:8}}, pertes:7, perf:6 },
      echec:{ txt:'Le carré s’étire, l’arrière presse, l’avant accélère. On arrive au camp avec un tiers des blessés en moins qu’au départ.', eff:{unit:{fides:-10},fama:-5}, pertes:18, blessure:.3, perf:-2 } },
    { id:'b', scopes:['*'], txt:'Abandonner les blessés pour aller plus vite',
      test:{attr:'ingenium', dc:-15}, risque:'faible',
      succes:{ txt:'Vous rentrez vite et complets — moins ceux qu’on ne compte plus. La décision était militairement défendable. Aucun de tes hommes ne te reparlera de la même façon.', eff:{ingenium:1,unit:{fides:-18},fama:-8}, pertes:6, perf:0 },
      echec:{ txt:'On abandonne les blessés et l’on se fait accrocher quand même. Il n’y a même pas eu de contrepartie.', eff:{unit:{fides:-22},fama:-10,auctoritas:-4}, pertes:14, perf:-1 } }
    ]},
  { titre:'Apprendre les Numides',
    texte:`Après Ruspina, César fait reprendre l’instruction comme s’il s’agissait de recrues : comment reculer, à quelle distance lancer, comment charger court et revenir. Une armée de vétérans de Gaule réapprend son métier contre un ennemi qui n’a rien de gaulois.`,
    vue:{ soldat:'On te fait manœuvrer six heures par jour, comme un bleu.', sousoff:'Tes vétérans grognent. Tu ferais pareil.', centurion:'Tu peux exiger, expliquer, ou laisser filer.', superieur:'Il faut réoutiller mentalement une armée en trois mois.' },
    opts:[
    { id:'a', scopes:['*'], txt:'Expliquer le pourquoi avant d’exiger le comment',
      test:{attr:'scientia', dc:5}, risque:'faible',
      succes:{ txt:'Tu leur expliques pourquoi la charge longue tue en Afrique alors qu’elle gagnait en Gaule. Des hommes de dix ans de service écoutent parce qu’on leur parle comme à des professionnels.', eff:{scientia:4,auctoritas:4,unit:{experientia:9,fides:8}}, perf:4 },
      echec:{ txt:'Tu expliques mal quelque chose que tu comprends mal. Ils te laissent finir poliment.', eff:{auctoritas:-2}, perf:-1 } },
    { id:'b', scopes:['*'], txt:'Exercer jusqu’à ce que ce soit un réflexe',
      test:{attr:'disciplina', unit:'fatigatio', dc:10, inv:true}, risque:'moyen',
      succes:{ txt:'Six heures par jour, trois semaines. À Thapsus, ils le feront sans y penser, et c’est tout ce qui compte.', eff:{disciplina:4,unit:{experientia:12,fatigatio:18}}, perf:5 },
      echec:{ txt:'À force, tu casses le ressort. Les hommes exécutent sans conviction et deux se blessent bêtement à l’exercice.', eff:{unit:{fides:-7,fatigatio:22}}, perf:-2 } }
    ]}
  ]};

BATAILLES.thapsus = {
  nom:'Thapsus', lieu:'Isthme entre la mer et une lagune, Africa', date:'6 avril 46 av. J.-C.',
  ennemi:'Metellus Scipion, Juba — 10 légions, 60 éléphants', dc:58, issue:'victoire, et massacre',
  intro:`César a manœuvré jusqu’à les enfermer sur un isthme, entre la mer et un lagon, où leur nombre et leurs éléphants ne servent à rien. Nos frondeurs et nos archers sont postés face aux bêtes. Les légions attendent l’ordre.`,
  phases:[
  { titre:'La trompette qu’on n’a pas sonnée',
    texte:`César hésite encore quand un trompette de l’aile droite, poussé par les hommes, sonne la charge de sa propre autorité. Toute la ligne part. Les centurions se jettent devant les enseignes pour retenir les rangs et sont emportés. César, voyant qu’il ne peut plus rien arrêter, donne le mot <span class="lat">Felicitas</span> et éperonne son cheval.`,
    vue:{ soldat:'La ligne part sans ordre et tu pars avec.', sousoff:'Ton enseigne est déjà à vingt pas devant.', centurion:'Tu peux te jeter devant l’enseigne, ou prendre la tête du mouvement.', superieur:'L’armée vient de déclencher elle-même une bataille. Tu peux la conduire ou la subir.' },
    opts:[
    { id:'a', scopes:['*'], txt:'Prendre la tête du mouvement et le conduire',
      test:{attr:'auctoritas', unit:'fides', dc:5}, risque:'moyen',
      succes:{ txt:'Tu ne peux pas l’arrêter, alors tu le diriges : tu cours devant et tu leur donnes une direction. Une charge conduite vaut cent fois une ruée.', eff:{auctoritas:5,virtus:3,fama:9,favor:{caesar:8}}, pertes:9, perf:6 },
      echec:{ txt:'Tu cours devant et personne ne te suit dans la direction que tu montres. Tu te retrouves en pointe, seul, devant des éléphants.', eff:{valetudo:-16}, pertes:16, blessure:.35, perf:-2 } },
    { id:'b', scopes:['sousoff','centurion','superieur'], txt:'Te jeter devant l’enseigne pour retenir le rang',
      test:{attr:'auctoritas', dc:20}, risque:'élevé',
      succes:{ txt:'Tu bloques ton enseigne à bout de bras et ta centurie s’arrête. Trente secondes plus tard, l’ordre arrive et confirme la charge — mais tes hommes partent en ordre, et pas en troupeau.', eff:{auctoritas:6,disciplina:4,fama:7}, pertes:6, perf:9 },
      echec:{ txt:'Un centurion qui se met devant une charge de vétérans se fait renverser. C’est ce qui arrive, littéralement, et l’on te ramasse.', eff:{valetudo:-14,auctoritas:-3}, blessure:.3, pertes:10, perf:-2 } }
    ]},
  { titre:'Les éléphants',
    texte:`Soixante bêtes chargent l’aile gauche. Les frondeurs et les archers leur tirent aux yeux et aux oreilles ; les cornets sonnent tous ensemble pour les affoler. Elles tournent, se retournent contre leurs propres lignes et écrasent leur infanterie. Un légionnaire de la Cinquième en abat une qui allait piétiner un valet ; depuis, la Cinquième porte l’éléphant sur ses enseignes.`,
    vue:{ soldat:'Une bête de dix pieds arrive sur ton rang.', sousoff:'Ouvrir les rangs pour la laisser passer, ou la recevoir.', centurion:'On peut les faire tourner. Il faut du bruit et des traits.', superieur:'Une charge d’éléphants retournée détruit celui qui l’a lancée.' },
    opts:[
    { id:'a', scopes:['*'], txt:'Ouvrir les rangs et la laisser passer, puis la frapper aux jarrets',
      req:{scientia:40}, test:{attr:'scientia', unit:'experientia', dc:0}, risque:'moyen',
      succes:{ txt:'Les rangs s’ouvrent en couloirs, la bête passe dans le vide, et douze pointes lui ouvrent les jarrets au passage. La méthode est vieille comme Zama et elle marche encore.', eff:{scientia:4,virtus:2,fama:6}, pertes:6, perf:5 },
      echec:{ txt:'Le couloir s’ouvre trop tard. Elle entre dans le rang et fait ce qu’une bête de quatre tonnes fait dans un rang d’hommes.', eff:{unit:{cohaesio:-10}}, pertes:18, blessure:.4, mort:.04, perf:-2 } },
    { id:'b', scopes:['*'], txt:'Tout le bruit possible : cornets, cris, boucliers frappés',
      test:{attr:'auctoritas', dc:0}, risque:'moyen',
      succes:{ txt:'Le vacarme les retourne. Elles rentrent dans leurs propres lignes et l’aile pompéienne se défait sous ses propres bêtes. Rien n’est plus efficace, et rien n’est moins glorieux à raconter.', eff:{auctoritas:3,scientia:3,fama:7}, pertes:4, perf:5 },
      echec:{ txt:'Le bruit les affole sans les retourner. Elles chargent droit, et il faut les recevoir.', eff:{}, pertes:15, blessure:.35, perf:-2 } },
    { id:'c', scopes:['*'], txt:'Recevoir la charge à pied ferme',
      test:{attr:'virtus', unit:'cohaesio', dc:20}, risque:'très élevé',
      succes:{ txt:'Vous tenez. On ne sait pas comment on tient devant cela, mais on tient, et la bête s’effondre à trois pas.', eff:{virtus:6,fama:10,unit:{cohaesio:6}}, pertes:16, blessure:.4, perf:10 },
      echec:{ txt:'Personne ne tient devant cela. Le rang s’ouvre au dernier moment, dans le mauvais sens.', eff:{unit:{cohaesio:-14}}, pertes:24, blessure:.45, mort:.07, perf:-4 } }
    ]},
  { titre:'Le carnage',
    texte:`La ligne ennemie casse. Les Pompéiens jettent leurs armes et demandent quartier — et l’armée de César, pour la première fois, refuse d’obéir à ses officiers. Cinq mille rendus sont massacrés. Des vétérans tuent des tribuns de leur propre camp qui tentaient de les arrêter. César ne peut rien.`,
    vue:{ soldat:'Ceux qui sont à genoux devant toi ont jeté leurs armes.', sousoff:'Tes hommes n’écoutent plus rien.', centurion:'Un tribun qui a voulu arrêter cela vient d’être tué par nos propres soldats.', superieur:'L’armée a échappé à son général. C’est arrivé aujourd’hui, et cela arrivera encore.' },
    opts:[
    { id:'a', scopes:['*'], txt:'Tenter d’arrêter le massacre',
      test:{attr:'auctoritas', unit:'fides', dc:25}, risque:'très élevé',
      crit:{ txt:'Tu te mets en travers, tu nommes tes hommes un par un, tu leur rappelles Alésia et Pharsale. Ils s’arrêtent. Deux cents hommes vivront parce que ta voix comptait plus que leur fureur. César le saura.', eff:{auctoritas:7,fama:14,unit:{fides:10},favor:{caesar:14}}, perf:12 },
      succes:{ txt:'Tu sauves ton secteur, pas le champ. Une trentaine d’hommes sortent vivants de derrière ta ligne.', eff:{auctoritas:4,fama:7,favor:{caesar:7}}, perf:9 },
      echec:{ txt:'On te bouscule, on te menace, et un homme de ta propre unité te met la pointe sous le menton avant de te reconnaître. Tu n’oublieras pas cette seconde-là.', eff:{auctoritas:-6,unit:{fides:-10},valetudo:-8}, perf:-4 } },
    { id:'b', scopes:['*'], txt:'Ne pas t’en mêler',
      test:{attr:'disciplina', dc:-20}, risque:'faible',
      succes:{ txt:'Tu retires tes hommes du secteur et tu attends que cela passe. Cela passe. Cinq mille personnes plus tard.', eff:{}, perf:1 },
      echec:{ txt:'Tes hommes y vont sans toi. Tu es un officier dont l’unité agit sans lui, et le camp le remarque.', eff:{auctoritas:-4,fama:-4}, perf:-1 } },
    { id:'c', scopes:['*'], txt:'Y participer',
      test:{attr:'virtus', dc:-25}, risque:'faible',
      succes:{ txt:'C’est fait. Cato se donnera la mort à Utique en apprenant la nouvelle, en lisant du Platon. Le butin africain est considérable.', eff:{peculium:900,unit:{fides:3},fama:-5,favor:{caesar:-8}}, perf:0 },
      echec:{ txt:'Même tes hommes te regardent autrement, ce qui est une performance ce jour-là.', eff:{peculium:600,fama:-9,unit:{fides:-6},favor:{caesar:-10}}, perf:-1 } }
    ]}
  ]};

BATAILLES.munda = {
  nom:'Munda', lieu:'Plaine sous la colline de Munda, Bétique', date:'17 mars 45 av. J.-C.',
  ennemi:'Cn. Pompée le Jeune, Labienus — 13 légions', dc:72, issue:'victoire, la plus dure',
  intro:`« J’ai souvent combattu pour la victoire ; aujourd’hui, j’ai combattu pour ma vie. » Ce ne sont pas des recrues en face : ce sont des légions romaines de vétérans, des transfuges, des proscrits qui savent qu’il n’y a pour eux ni pardon ni exil. Ils tiennent une hauteur. Ils n’ont nulle part où aller.`,
  phases:[
  { titre:'La pente',
    texte:`Ils sont en haut, nous en bas. Personne ne descend, personne ne monte : les deux armées restent face à face une heure, à cent pas, sans qu’un homme bouge. Puis nos vétérans montent, et la ligne s’arrête à mi-pente sans reculer ni avancer. Cela dure des heures.`,
    vue:{ soldat:'Tu pousses depuis deux heures contre un homme qui pousse aussi.', sousoff:'Personne ne recule. Personne n’avance. Il n’y a plus de manœuvre.', centurion:'Ce n’est plus une bataille, c’est une épreuve de force.', superieur:'La Dixième gagne du terrain à droite. Ils y envoient une légion de leur droite.' },
    opts:[
    { id:'a', scopes:['*'], txt:'Pousser, et tenir, et pousser encore',
      test:{attr:'virtus', unit:'fides', dc:15}, risque:'très élevé',
      succes:{ txt:'Tu pousses. C’est tout ce que la journée demande et c’est presque plus qu’un homme peut donner. Le rang gagne trois pas en une heure.', eff:{virtus:5,disciplina:4,unit:{fides:8}}, pertes:18, blessure:.35, perf:10 },
      echec:{ txt:'Le rang glisse en arrière d’un pas, puis de deux. Sur une pente, deux pas en arrière deviennent vite dix.', eff:{unit:{cohaesio:-12}}, pertes:26, blessure:.45, mort:.05, perf:-4 } },
    { id:'b', scopes:['*'], txt:'Saisir une enseigne et la porter de trois pas en avant',
      test:{attr:'auctoritas', dc:20}, risque:'très élevé',
      crit:{ txt:'Trois pas. La centurie suit l’enseigne parce qu’une centurie suit toujours son enseigne, et la ligne entière se décale avec elle. César, qui a mis pied à terre et est entré dans le rang bouclier au bras, voit qui a fait cela.', eff:{auctoritas:6,virtus:5,fama:16,favor:{caesar:15}}, pertes:20, blessure:.45, mort:.05, perf:12 },
      succes:{ txt:'Tu portes l’enseigne en avant et le rang suit. Tu ne te souviendras pas des dix minutes suivantes.', eff:{auctoritas:4,virtus:4,fama:10,favor:{caesar:9}}, pertes:22, blessure:.5, perf:10 },
      echec:{ txt:'Tu prends l’enseigne, tu avances de deux pas, et personne ne vient. Tu reviens seul, ce qui est pire que de ne pas être parti.', eff:{fama:-6,auctoritas:-4,valetudo:-20}, blessure:.55, mort:.07, pertes:24, perf:-4 } },
    { id:'c', scopes:['centurion','superieur'], txt:'Faire relever la première ligne par la deuxième, section par section',
      req:{scientia:60}, test:{attr:'scientia', unit:'experientia', dc:10}, risque:'élevé',
      succes:{ txt:'Tu fais tourner les rangs comme une meule : les hommes de devant reculent par les intervalles, les frais prennent leur place. Sur une bataille de poussée, c’est ce qui décide, et presque personne ne sait le faire sous le contact.', eff:{scientia:6,auctoritas:4,fama:11,favor:{caesar:10}}, pertes:12, blessure:.25, perf:10 },
      echec:{ txt:'La relève sous contact est l’exercice le plus difficile qui soit. Elle se fait mal, et pendant deux minutes il y a un trou dans la ligne.', eff:{unit:{cohaesio:-14}}, pertes:28, blessure:.45, mort:.06, perf:-3 } }
    ]},
  { titre:'La légion déplacée',
    texte:`Pour soutenir leur gauche, ils retirent une légion de leur droite. Le mouvement est vu de notre côté : notre cavalerie maure, sous Bogud, contourne aussitôt et attaque leur camp à revers. Labienus quitte la ligne avec cinq cohortes pour aller y parer.`,
    vue:{ soldat:'Un cri court le rang : ils reculent. Ils ne reculent pas, ils se déplacent.', sousoff:'Cinq cohortes ennemies quittent la ligne et partent en arrière.', centurion:'Leurs hommes vont croire à une fuite. C’est le moment.', superieur:'Labienus vient de commettre la seule erreur de sa vie, et elle va tout décider.' },
    opts:[
    { id:'a', scopes:['*'], txt:'Crier que l’ennemi fuit, et pousser',
      test:{attr:'auctoritas', unit:'cohaesio', dc:10}, risque:'élevé',
      succes:{ txt:'Le cri court des deux côtés de la ligne avec des effets exactement inverses. Leur front, qui tenait depuis huit heures, se persuade en trente secondes qu’il est abandonné — et casse.', eff:{auctoritas:5,ingenium:4,fama:12,favor:{caesar:12}}, pertes:11, blessure:.25, perf:10 },
      echec:{ txt:'Ton cri est couvert par le bruit. La manœuvre s’achève proprement de leur côté et rien ne change.', eff:{}, pertes:19, blessure:.35, perf:-2 } },
    { id:'b', scopes:['*'], txt:'Attaquer le point que la légion vient de quitter',
      test:{attr:'scientia', unit:'fatigatio', dc:15, inv:true}, risque:'élevé',
      succes:{ txt:'Tu vas dans le trou avant qu’il soit comblé. Le front ennemi se déchire là et ne se recoud plus.', eff:{scientia:5,virtus:3,fama:10,favor:{caesar:10}}, pertes:14, blessure:.3, perf:10 },
      echec:{ txt:'Le trou se referme sous ton nez et tu te retrouves en pointe, entouré sur trois côtés.', eff:{unit:{cohaesio:-10}}, pertes:26, blessure:.45, mort:.06, perf:-3 } },
    { id:'c', scopes:['*'], txt:'Tenir sans rien tenter, garder tes forces',
      test:{attr:'disciplina', dc:-5}, risque:'moyen',
      succes:{ txt:'Tu tiens ta place pendant que d’autres décident de la bataille. Tes hommes sont vivants et la victoire est aux autres.', eff:{disciplina:3}, pertes:12, perf:1 },
      echec:{ txt:'Rester immobile pendant que la ligne bascule te laisse en saillie, et c’est sur toi que refluent ceux qui cèdent.', eff:{unit:{cohaesio:-8}}, pertes:20, blessure:.35, perf:-2 } }
    ]},
  { titre:'Le mur de cadavres',
    texte:`Ils refluent sur Munda et se retranchent derrière un rempart improvisé de corps et de boucliers, empilés et fichés de pila. Trente mille morts sur le champ, dont Labienus et Attius Varus. Sur treize aigles pompéiennes, treize sont prises.`,
    vue:{ soldat:'Le rempart devant toi est fait de gens.', sousoff:'On te demande de monter dessus.', centurion:'Il n’y a plus d’enjeu militaire. Il y a une place forte et des désespérés.', superieur:'On peut investir et attendre, ou finir aujourd’hui.' },
    opts:[
    { id:'a', scopes:['*'], txt:'Donner l’assaut',
      test:{attr:'virtus', unit:'fatigatio', dc:20, inv:true}, risque:'très élevé',
      succes:{ txt:'On monte sur le rempart et l’on fait ce qu’il y a à faire. La ville est prise le soir même. Personne ne raconte cette partie-là au retour.', eff:{virtus:4,peculium:700,fama:5}, pertes:18, blessure:.4, mort:.04, perf:7 },
      echec:{ txt:'On glisse, on tombe, on remonte, et des hommes qui n’ont plus rien à perdre te font payer chaque pied.', eff:{valetudo:-20}, pertes:28, blessure:.5, mort:.09, perf:-3 } },
    { id:'b', scopes:['*'], txt:'Investir et attendre la reddition',
      test:{attr:'disciplina', dc:-10}, risque:'faible',
      succes:{ txt:'Tu poses un cordon et tu attends. Munda tombera de toute façon, et tes hommes verront l’Italie.', eff:{disciplina:3,unit:{fides:9}}, pertes:3, perf:3 },
      echec:{ txt:'Une partie de la garnison force ton cordon dans la nuit et gagne les collines. On te le reprochera modérément.', eff:{fama:-3}, pertes:5, perf:-1 } },
    { id:'c', scopes:['centurion','superieur'], txt:'Chercher le corps de Labienus pour le faire enterrer', note:'Neuf ans son subordonné en Gaule. Il n’y a aucun avantage à cela.',
      test:{attr:'ingenium', dc:5}, risque:'faible',
      succes:{ txt:'Tu le retrouves parmi trente mille. On l’enterre correctement, avec son nom sur une planche. César fera de même pour Varus. Ce sont des choses qu’on fait à la fin d’une guerre civile, pour pouvoir rentrer chez soi.', eff:{ingenium:3,auctoritas:3,fama:6,favor:{caesar:8}}, perf:4 },
      echec:{ txt:'On ne retrouve rien d’identifiable. Tu passes trois heures à retourner des morts.', eff:{valetudo:-6}, perf:0 } }
    ]}
  ]};

/* ---- Pharsale vue du camp pompéien (branche minoritaire) ---- */
BATAILLES.pharsale_pomp = {
  nom:'Pharsale (aile pompéienne)', lieu:'Plaine de l’Énipeus, Thessalie', date:'9 août 48 av. J.-C.',
  ennemi:'C. Iulius Caesar — 22 000 vétérans de Gaule', dc:74, issue:'défaite',
  intro:`Tu es du côté du Sénat, des consulaires et des sept mille cavaliers. En face, il y a les hommes avec qui tu as pris Alésia. Labienus a juré que ces légions-là ne sont plus celles de Gaule, qu’elles ont fondu en Espagne et en Grèce. Tu sais qu’il se trompe.`,
  phases:[
  { titre:'La charge de cavalerie',
    texte:`Toute votre cavalerie doit tourner leur droite et rouler la ligne à revers. Elle part, superbe, sept mille chevaux — et se heurte à six cohortes surgies de nulle part qui, au lieu de lancer leurs pila, les pointent au visage.`,
    vue:{ soldat:'Tu vois la cavalerie revenir. Pas se replier : revenir en désordre.', sousoff:'Vos archers sont découverts. Ils vont être massacrés.', centurion:'La droite ennemie n’a pas été tournée. Tout le plan reposait là-dessus.', superieur:'Pompée quitte la ligne et rentre à sa tente. Devant tout le monde.' },
    opts:[
    { id:'a', scopes:['*'], txt:'Tenir le flanc découvert avec ce que tu as',
      test:{attr:'virtus', unit:'cohaesio', dc:20}, risque:'très élevé',
      succes:{ txt:'Tu refuses le flanc et tu tiens assez pour que l’aile ne soit pas roulée d’un coup. Cela ne sauvera pas la bataille ; cela sauve ta cohorte.', eff:{virtus:5,auctoritas:4,fama:8}, pertes:20, blessure:.4, perf:10 },
      echec:{ txt:'Le flanc est tourné et la ligne se replie sur elle-même comme un tapis qu’on roule.', eff:{unit:{cohaesio:-16}}, pertes:30, blessure:.5, mort:.08, perf:-4 } },
    { id:'b', scopes:['*'], txt:'Décrocher tout de suite vers le camp',
      test:{attr:'ingenium', dc:0}, risque:'moyen',
      succes:{ txt:'Tu sors du piège avant qu’il se referme. Tu es de ceux qui rentreront au camp en ordre, et le camp tombera quand même.', eff:{ingenium:3}, pertes:9, perf:2 },
      echec:{ txt:'Décrocher au milieu d’une ligne engagée, c’est ouvrir un trou et être le dernier à s’en sortir.', eff:{fama:-6}, pertes:22, blessure:.4, perf:-2 } }
    ]},
  { titre:'Le choix du vaincu',
    texte:`Le camp est pris avec ses tables dressées. Vingt-quatre mille hommes se rendent sur la colline. César a fait crier qu’il épargne tous les citoyens et qu’il ne veut aucune vengeance. Certains le croient. D’autres passent en Afrique pour continuer trois ans encore.`,
    vue:{ soldat:'Un centurion en face crie ton nom. Vous avez servi ensemble.', sousoff:'Tes hommes ont jeté les armes sans t’attendre.', centurion:'Il y a une route vers la côte, et une file d’hommes qui déposent leurs armes.', superieur:'Caton et Labienus embarquent pour l’Afrique. La place est encore ouverte.' },
    opts:[
    { id:'a', scopes:['*'], txt:'Te rendre et accepter la clémence de César', decide:'venia',
      test:{attr:'ingenium', dc:-10}, risque:'faible',
      succes:{ txt:'Tu déposes les armes. On ne t’insulte pas, on ne te fouille même pas. César t’accueille, te rend ton grade — un cran plus bas — et ne mentionnera plus jamais l’affaire. C’est cela qui est difficile à supporter.', eff:{fama:-6,ingenium:3}, perf:2 },
      echec:{ txt:'Tu te rends et l’on t’oublie trois semaines dans un enclos avant qu’un tribun ne retrouve ton nom sur une liste.', eff:{fama:-9,valetudo:-10}, perf:0 } },
    { id:'b', scopes:['*'], txt:'Passer en Afrique et continuer la guerre', decide:'afrique',
      test:{attr:'virtus', dc:5}, risque:'très élevé',
      succes:{ txt:'Tu embarques à Corcyre avec Labienus. Il reste trois ans de guerre, l’Afrique puis l’Espagne, et à la fin de ces trois ans il n’y aura plus de Labienus, plus de Caton, plus de camp.', eff:{virtus:4,fama:4}, perf:7 },
      echec:{ txt:'Tu embarques sur un navire qui prend l’eau et l’on te dépose sur une côte que tu ne connais pas, avec neuf hommes.', eff:{valetudo:-16,fama:1}, blessure:.3, perf:0 } },
    { id:'c', scopes:['*'], txt:'Te retirer de la guerre et rentrer en Italie', decide:'missio',
      test:{attr:'ingenium', dc:0}, risque:'faible',
      succes:{ txt:'Tu jettes ton baudrier dans un fossé de Thessalie et tu rentres par les routes, à pied, comme un homme quelconque. Personne ne te cherchera. Personne ne t’écrira non plus.', eff:{}, perf:1 },
      echec:{ txt:'Tu rentres, mais il faut six mois, et deux fois on te prend pour un déserteur.', eff:{valetudo:-14,peculium:-200}, perf:0 } }
    ]}
  ]};
