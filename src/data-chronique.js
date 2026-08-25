/* ============================================================
   CHRONIQUE — la colonne vertébrale historique, 58 → 45 av. J.-C.
   Une entrée par (année, saison). 42 tours.
   ============================================================ */

const CHRONIQUE = [
/* ---------------- 58 : les Helvètes et Arioviste ---------------- */
{ an:-58, sa:'ver', lieu:'Genava, sur le Rhône', titre:'Le pont de Genève',
  recit:`Le proconsul est arrivé de Rome en huit jours — on dit qu’il a crevé des chevaux. Il n’avait qu’une légion : la tienne, la <span class="lat">Legio X</span>. Il a fait couper le pont sur le Rhône et bâtir dix-neuf milles de rempart contre les Helvètes, qui sont trois cent mille et veulent traverser.<br><br>Tu portes le pieu, la meule, la palissade et deux semaines de blé. On appelle cela être un <span class="lat">mulus Marianus</span>, une mule de Marius. Le rempart monte.` },
{ an:-58, sa:'aestas', lieu:'Bibracte, chez les Éduens', titre:'Bibracte', bataille:'bibracte',
  recit:`Ils ont contourné le rempart par le pays des Séquanes. Nous les avons suivis quinze jours, mangeant le grain que les Éduens promettaient et ne livraient pas. Ce matin, César a fait retirer tous les chevaux du champ, à commencer par le sien.<br><br>« <em>Que nul n’ait d’espoir dans la fuite</em> », a-t-il dit. La colline est derrière nous. Les Helvètes montent.` },
{ an:-58, sa:'hiberna', lieu:'Plaine d’Alsace, contre les Germains', titre:'Arioviste', bataille:'arioviste',
  recit:`À Besançon, la panique a pris l’armée : les marchands racontaient la taille des Germains, leur regard qu’on ne peut soutenir. Des tribuns ont demandé des congés en pleurant, des testaments circulaient sous les tentes.<br><br>César a convoqué le conseil et dit qu’il partirait avec la Dixième seule, s’il le fallait, et qu’elle lui servirait de garde prétorienne. Ta légion en est encore ivre d’orgueil. On marche sur Arioviste.` },

/* ---------------- 57 : les Belges ---------------- */
{ an:-57, sa:'ver', lieu:'Sur l’Axona, chez les Rèmes', titre:'Le pays des Belges',
  recit:`Deux légions neuves sont arrivées de Cisalpine, la XI et la XII. Les vétérans les regardent comme on regarde du blé vert. Nous marchons vers le nord : les Belges se sont ligués, on parle de trois cent mille hommes en armes.<br><br>Le camp sur l’Aisne est un ouvrage de manuel : fossé de dix-huit pieds, deux redoutes, un pont gardé. César ne livre bataille que sur un terrain qu’il a fabriqué lui-même.`,
  evenement:'axona' },
{ an:-57, sa:'aestas', lieu:'La Sambre, chez les Nerviens', titre:'La Sambre', bataille:'sabis',
  recit:`Nous bâtissions le camp au-dessus de la rivière, sacs à terre, quand les Nerviens sont sortis du bois d’un seul coup. Soixante mille hommes. Pas de ligne, pas de trompettes, pas d’ordre reçu — chacun se range à l’enseigne la plus proche.<br><br>Sur l’aile gauche, la XII est en train de mourir : tous ses centurions sont tombés, le porte-enseigne de la quatrième cohorte est mort avec son aigle.` },
{ an:-57, sa:'hiberna', lieu:'Chez les Aduatuques', titre:'Le prix de la parole donnée',
  recit:`Les Aduatuques se sont enfermés dans leur oppidum et ont ri de nos tours de siège, jusqu’à ce qu’ils voient une tour de bois marcher vers eux. Alors ils ont demandé la paix, rendu leurs armes par-dessus le mur — et, la nuit venue, ont tenté une sortie avec les armes cachées.<br><br>Au matin, César a vendu la ville entière : cinquante-trois mille têtes, adjugées d’un seul lot au marchand qui suivait l’armée. Chaque homme a touché sa part.`,
  evenement:'aduatuques' },

/* ---------------- 56 : les Vénètes ---------------- */
{ an:-56, sa:'ver', lieu:'Sur l’Océan, chez les Vénètes', titre:'Une guerre sur l’eau',
  recit:`Les Vénètes ont saisi nos officiers envoyés chercher du blé. Leurs oppida sont sur des pointes que la marée isole deux fois par jour : on prend la ville, la marée monte, la flotte les emporte, et tout est à recommencer.<br><br>César a fait bâtir des galères sur la Loire. Des légionnaires qui n’ont jamais vu la mer arment des vaisseaux contre des marins.`,
  evenement:'venetes' },
{ an:-56, sa:'aestas', lieu:'Golfe du Morbihan', titre:'Les faux de marine', bataille:'venetes' },
{ an:-56, sa:'hiberna', lieu:'Quartiers d’hiver, vallée de la Loire', titre:'Le partage du monde',
  recit:`À Lucques, ce printemps, César, Pompée et Crassus se sont partagé le monde comme trois hommes partagent une succession : l’Espagne à l’un, la Syrie à l’autre, et cinq années de plus en Gaule pour le nôtre.<br><br>Cinq ans. Le camp fait ses comptes : cinq ans de solde, de butin, de marches — et, pour beaucoup, cinq ans de vie.`,
  evenement:'hiberna_gen' },

/* ---------------- 55 : le Rhin et la Bretagne ---------------- */
{ an:-55, sa:'ver', lieu:'Confluent de la Meuse et du Rhin', titre:'Les Usipètes',
  recit:`Quatre cent mille Germains ont passé le Rhin. Leurs chefs sont venus au camp sous couvert de trêve. César les a fait arrêter, puis a lancé l’armée sur le camp resté sans chefs.<br><br>Il n’y a pas eu de bataille. Il y a eu ce qui suit une bataille, mais sans la bataille : les femmes et les enfants dans le confluent, la cavalerie derrière. À Rome, Caton demandera qu’on livre César aux Germains pour crime contre la parole donnée.`,
  evenement:'usipetes' },
{ an:-55, sa:'aestas', lieu:'Rive du Rhin, puis Portus Itius', titre:'Dix jours de pont',
  recit:`Il aurait pu passer sur les barques des Ubiens. Il a jugé cela indigne du peuple romain. Le génie a planté des pieux jumelés en biais dans le courant, entretoisés, lestés par la poussée du fleuve lui-même : plus l’eau pousse, plus le pont serre.<br><br>Dix jours de la coupe du bois au passage des légions. Dix-huit jours en Germanie, personne à combattre, et le pont détruit derrière nous. Le message est passé.<br><br>Puis on a mis à la voile pour la Bretagne, avec deux légions et pas assez de navires.`,
  evenement:'britannia1' },
{ an:-55, sa:'hiberna', lieu:'Quartiers d’hiver, Belgique', titre:'La flotte brisée',
  recit:`Une marée de pleine lune, que personne n’avait prévue, a jeté les navires de transport les uns sur les autres. Nous sommes rentrés à l’étroit, en deux voyages, sans un otage de plus qu’au départ.<br><br>Rome a décrété vingt jours d’actions de grâces. Le camp, lui, sait exactement ce qui s’est passé.`,
  evenement:'hiberna_gen' },

/* ---------------- 54 : la Bretagne, puis le désastre ---------------- */
{ an:-54, sa:'ver', lieu:'Portus Itius', titre:'Huit cents navires',
  recit:`Cette fois, huit cents navires bâtis sur un modèle dessiné par César lui-même : plus bas, plus larges, tirés à sec facilement. Cinq légions et deux mille cavaliers.<br><br>Dumnorix l’Éduen a refusé d’embarquer et a fui avec sa cavalerie en criant qu’il était un homme libre d’un peuple libre. La cavalerie l’a rattrapé et tué.`,
  evenement:'dumnorix' },
{ an:-54, sa:'aestas', lieu:'Au-delà de la Tamise, chez les Trinovantes', titre:'Cassivellaunos', bataille:'britannia' },
{ an:-54, sa:'hiberna', lieu:'Atuatuca, chez les Éburons', titre:'Atuatuca', bataille:'atuatuca',
  recit:`La récolte a manqué : les huit légions sont dispersées en huit camps d’hiver, à cent milles les uns des autres. C’est là qu’Ambiorix a frappé.<br><br>Sabinus a cru à sa parole et fait sortir quinze cohortes du camp d’Atuatuca. Elles sont mortes dans un défilé, jusqu’au dernier ou presque. Cotta est tombé le visage fracassé, en refusant de parlementer. Le lendemain, les Nerviens étaient devant le camp de Quintus Cicéron.` },

/* ---------------- 53 : la vengeance ---------------- */
{ an:-53, sa:'ver', lieu:'Camp d’hiver, Samarobriva', titre:'Reconstruire',
  recit:`César a juré de ne pas se raser ni se couper les cheveux avant d’avoir vengé les quinze cohortes. Trois légions ont été levées en une saison — dont une empruntée à Pompée, qui la prêta de bonne grâce. Alors.<br><br>Il y a maintenant dix légions en Gaule. Le camp est plein d’hommes qui ne savent pas encore tenir un rang.`,
  evenement:'levee53' },
{ an:-53, sa:'aestas', lieu:'Forêt des Ardennes, chez les Éburons', titre:'La chasse à Ambiorix',
  recit:`Ce n’est pas une guerre, c’est une battue. César a fait proclamer que le pays des Éburons était offert au pillage à quiconque voudrait venir : Gaulois, Germains, marchands. On brûle les fermes, on coupe le blé sur pied, on comble les puits.<br><br>Ambiorix s’échappe toujours, avec quatre cavaliers. Le camp commence à trouver cela drôle, puis ne le trouve plus.`,
  evenement:'eburons' },
{ an:-53, sa:'hiberna', lieu:'Quartiers d’hiver, Gaule du Nord', titre:'Carrhes',
  recit:`La nouvelle est arrivée de Syrie avec deux mois de retard. Crassus, sept légions, anéanties par les archers parthes à Carrhes. Trente mille Romains. On dit qu’ils ont coulé de l’or fondu dans la bouche du triumvir.<br><br>Ils étaient trois à se partager le monde. Ils ne sont plus que deux, et il n’y a plus rien entre eux.`,
  evenement:'carrhes' },

/* ---------------- 52 : Vercingétorix ---------------- */
{ an:-52, sa:'ver', lieu:'Avaricum, chez les Bituriges', titre:'Avaricum', bataille:'avaricum',
  recit:`Toute la Gaule s’est levée derrière un jeune Arverne. Il a compris ce qu’aucun n’avait compris : ne pas nous livrer bataille, brûler devant nous. Vingt villes des Bituriges ont brûlé en un jour, par la main de leurs habitants.<br><br>Ils ont supplié d’épargner Avaricum, la plus belle ville de Gaule. Vercingétorix a cédé. Nous sommes devant, dans la boue, à la ration de vingt jours qui en dure quarante. La terrasse monte : vingt-cinq pieds de haut, trois cents de large.` },
{ an:-52, sa:'aestas', lieu:'Gergovie, chez les Arvernes', titre:'Gergovie', bataille:'gergovie' },
{ an:-52, sa:'hiberna', lieu:'Alésia, chez les Mandubiens', titre:'Alésia', bataille:'alesia',
  recit:`Onze milles de contrevallation vers l’intérieur, quatorze de circonvallation vers l’extérieur. Deux fossés, l’un rempli d’eau détournée. Des <span class="lat">cippi</span>, des <span class="lat">lilia</span>, des <span class="lat">stimuli</span> — des pieux ferrés cachés sous la terre battue. Vingt-trois redoutes.<br><br>Quatre-vingt mille hommes enfermés dedans. Une armée de secours gauloise qu’on annonce à un quart de million derrière nous. Et nous entre les deux, sur une bande de terre de nos propres mains.` },

/* ---------------- 51 : la fin de la Gaule ---------------- */
{ an:-51, sa:'ver', lieu:'Chez les Bituriges, puis les Carnutes', titre:'Éteindre les braises',
  recit:`Il n’y a plus d’armée gauloise. Il reste des peuples qui n’ont pas encore compris. César marche en plein hiver, deux légions, quarante jours de raid, puis rentre et distribue une prime de deux cents sesterces par homme et deux mille par centurion, pour la peine d’avoir marché hors saison.<br><br>Il paie de sa bourse. Personne n’a l’air de trouver cela étrange.`,
  evenement:'pacification' },
{ an:-51, sa:'aestas', lieu:'Uxellodunum, chez les Cadurques', titre:'Uxellodunum', bataille:'uxellodunum' },
{ an:-51, sa:'hiberna', lieu:'Quartiers d’hiver, Belgique', titre:'Le compte des années',
  recit:`La Gaule est prise. Un million de morts, dit-on, autant d’esclaves. César passe l’hiver à parcourir les cités, à couvrir les chefs d’honneurs et à ne rien exiger de plus : il lui faut la Gaule tranquille derrière lui.<br><br>Car à Rome, ses ennemis comptent les jours qui le séparent de la fin de son commandement, et du procès qui suivra. Un proconsul est inviolable. Un particulier ne l’est pas.`,
  evenement:'hiberna_gen' },

/* ---------------- 50 : l’année suspendue ---------------- */
{ an:-50, sa:'ver', lieu:'Cisalpine, quartiers de Ravenne', titre:'Deux légions rendues',
  recit:`Le Sénat a exigé deux légions pour la guerre parthe : une de Pompée, une de César. Pompée a réclamé celle qu’il avait prêtée en 53. César a donc rendu deux légions — et donné à chaque homme deux cent cinquante deniers avant le départ.<br><br>Les deux légions n’ont jamais vu la Parthie. Elles sont en Italie, sous Pompée. À qui appartiennent des hommes qu’on a payés d’une main et transférés de l’autre ? La question traîne dans le camp comme une odeur.`,
  evenement:'legions_rendues' },
{ an:-50, sa:'aestas', lieu:'Cisalpine', titre:'L’attente',
  recit:`Rien à assiéger, rien à marcher. L’armée s’engourdit dans les villes du Pô, et César fait le tour des colonies en candidat plus qu’en proconsul : il paie les dettes, dote les municipes, se fait acclamer.<br><br>À Rome, le tribun Curion propose que les deux hommes déposent leurs armées en même temps. La motion passe par trois cent soixante-dix voix contre vingt-deux. Le consul lève la séance et fait comme si de rien n’était.`,
  evenement:'attente50' },
{ an:-50, sa:'hiberna', lieu:'Ravenne', titre:'Le décret ultime',
  recit:`Le sept janvier, le Sénat a voté le <span class="lat">senatus consultum ultimum</span> : que les magistrats veillent à ce que la République ne subisse aucun dommage. Les tribuns Antoine et Cassius ont fui Rome déguisés en esclaves et sont arrivés à Ravenne dans une charrette louée.<br><br>César n’a ici qu’une légion : la tienne. Les autres sont encore en Gaule, à des semaines de marche. Il fait donner des jeux, dîne longuement, et sort de table.`,
  evenement:'veille_rubicon' },

/* ---------------- 49 : le Rubicon ---------------- */
{ an:-49, sa:'ver', lieu:'Le Rubicon, frontière de l’Italie', titre:'Le Rubicon', evenement:'rubicon',
  recit:`Un ruisseau. On le passe à gué sans se mouiller les genoux. De l’autre côté, ce n’est plus la province : c’est l’Italie, où nul proconsul n’entre en armes.<br><br>Il est resté longtemps sur la rive à ne rien dire. Puis il s’est tourné vers nous.` },
{ an:-49, sa:'aestas', lieu:'Ilerda, Hispanie citérieure', titre:'Ilerda', bataille:'ilerda' },
{ an:-49, sa:'hiberna', lieu:'Placentia, Cisalpine', titre:'La mutinerie de Plaisance', evenement:'placentia',
  recit:`L’Espagne prise sans grande bataille, Massilia tombée, la Sardaigne et la Sicile acquises. Et pourtant l’armée gronde : en Afrique, Curion et deux légions ont été anéantis par les Numides. Le butin promis n’arrive pas. La Neuvième refuse de marcher.<br><br>César est venu seul devant elle et a prononcé le mot de <span class="lat">decimatio</span>.` },

/* ---------------- 48 : Dyrrachium et Pharsale ---------------- */
{ an:-48, sa:'ver', lieu:'Dyrrachium, Épire', titre:'Dyrrachium', bataille:'dyrrachium',
  recit:`Nous avons passé l’Adriatique en hiver, en deux voyages, sous le nez d’une flotte cinq fois supérieure. La moitié de l’armée est restée bloquée trois mois de l’autre côté.<br><br>Ici, l’assiégeant est le plus affamé : Pompée tient la mer et le port, nous tenons quinze milles de lignes autour de lui et nous mangeons une racine broyée qu’on appelle du pain. Les Pompéiens en ont jeté des morceaux par-dessus le rempart en riant.` },
{ an:-48, sa:'aestas', lieu:'Plaine de Pharsale, Thessalie', titre:'Pharsale', bataille:'pharsale' },
{ an:-48, sa:'hiberna', lieu:'Alexandrie, quartier du palais', titre:'Le piège d’Alexandrie',
  recit:`Pompée est mort sur une plage égyptienne, la tête coupée par ses propres affranchis. On l’a apportée à César dans un linge ; il a détourné les yeux et pleuré, et personne n’a su la part de chaque chose.<br><br>Puis il s’est mêlé de la succession d’Égypte avec trois mille deux cents hommes, dans une ville de trois cent mille. Nous sommes enfermés dans le quartier du palais, à boire l’eau des puits que les Alexandrins salent depuis la mer.`,
  evenement:'alexandrie' },

/* ---------------- 47 : Alexandrie, Zela, la mutinerie ---------------- */
{ an:-47, sa:'ver', lieu:'Le Phare, Alexandrie', titre:'Le combat du Phare', bataille:'pharos' },
{ an:-47, sa:'aestas', lieu:'Zela, Pont — puis Campanie', titre:'Veni, vidi, vici',
  recit:`Pharnace, fils de Mithridate, a cru le moment venu et a lancé ses chars à faux en montée contre notre camp en construction. Quatre heures, et le royaume de Pont était rendu. César a écrit trois mots à un ami de Rome.<br><br>Mais en Campanie, les légions vétérannes qui attendent d’embarquer pour l’Afrique refusent de bouger. Elles réclament leur congé, leurs terres et l’argent promis. La Dixième est en tête.`,
  evenement:'mutinerie_x' },
{ an:-47, sa:'hiberna', lieu:'Lilybée, Sicile — embarquement pour l’Afrique', titre:'Vers l’Afrique',
  recit:`César a fait dresser sa tente sur la plage même, à portée de vague, pour que nul ne doute qu’on embarque. Il part sans savoir où sont ses navires ni combien le suivent, en plein hiver, contre une armée pompéienne de dix légions et cent vingt éléphants.<br><br>À terre, en Afrique, il a trébuché en sautant du navire. Il a saisi le sable à deux mains et crié : « <em>Je te tiens, Afrique !</em> » On a ri. C’était le but.`,
  evenement:'hiberna_gen' },

/* ---------------- 46 : Ruspina, Thapsus, les triomphes ---------------- */
{ an:-46, sa:'ver', lieu:'Ruspina, Africa', titre:'Ruspina', bataille:'ruspina' },
{ an:-46, sa:'aestas', lieu:'Thapsus, Africa', titre:'Thapsus', bataille:'thapsus' },
{ an:-46, sa:'hiberna', lieu:'Rome — le Champ de Mars', titre:'Quatre triomphes',
  recit:`Quatre triomphes en un mois : Gaule, Égypte, Pont, Afrique. Vercingétorix, gardé six ans dans une cellule du Tullianum, a marché devant le char, puis on l’a étranglé le soir même selon l’usage.<br><br>Vingt-deux mille tables dressées dans la ville. Chaque légionnaire touche cinq mille deniers — vingt ans de solde — et chaque centurion le double. Les hommes chantent derrière le char des vers si obscènes sur l’imperator qu’aucun n’oserait les dire à jeun.`,
  evenement:'triomphes' },

/* ---------------- 45 : Munda, et après ---------------- */
{ an:-45, sa:'ver', lieu:'Munda, Hispanie ultérieure', titre:'Munda', bataille:'munda' },
{ an:-45, sa:'aestas', lieu:'Retour d’Espagne', titre:'Le compte final', evenement:'fin',
  recit:`L’Espagne est soumise. Il n’y a plus d’armée pompéienne, plus de guerre, plus de province à conquérir. Pour la première fois depuis treize ans, le camp n’a pas de destination.<br><br>Les vétérans sont convoqués un par un devant les tables des questeurs, où l’on tient les registres du congé, des terres, des primes. On appelle ton nom.` }
];

function chroniqueAt(an, sa){ return CHRONIQUE.find(c => c.an===an && c.sa===sa) || null; }
