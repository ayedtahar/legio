# Legio

Moteur de jeu de carrière dans une légion romaine — une campagne par époque.

## Campagne actuelle — *Legio X Equestris*, 58-45 av. J.-C.

Tu t'engages dans la **Legio X Equestris** en 58 av. J.-C. et tu sers sous César
jusqu'à Munda, en 45.

**Une décision par écran, cinquante-quatre en tout.** Pas de tableau de bord, pas de gestion
de tour, pas de micro-management.

## Les deux principes

**Ton grade décide de ce que tu vois.** À chaque événement, les options sont filtrées par ton
rang, et le récit change avec lui :

| Grade | Champ de vision |
|---|---|
| `Miles`, `Immunis`, `Tesserarius` | ton contubernium et vingt pas de poussière |
| `Optio` | ta centurie, les enseignes voisines |
| `Centurio`, `Pilus Prior` | ta cohorte et ses appuis |
| `Primus Pilus`, `Praefectus Fabrum` | toute la ligne, les réserves, le terrain |

Les options au-dessus de ton grade apparaissent **verrouillées** — tu vois ce que tu ne peux
pas encore ordonner.

**Le prix est annoncé, jamais la récompense.** Avant de choisir, tu vois seulement ce que
l'action va te coûter — et en termes d'homme, pas de compteurs :

*Aller chercher l'enseigne tombée* → `blessure certaine`
*Tenir le rang et frapper ce qui vient* → `rude`
*Payer une amphore au campidoctor* → `cela coûte`

Tu ne vois **jamais** ce qu'elle rapporte. Afficher `+11 Virtus` transformerait le jeu en
addition : on cesse de lire et l'on clique le plus gros chiffre. Ici il faut lire la
situation pour juger ce qu'un acte vaut. Les chiffres n'apparaissent qu'**après**, dans le
résultat — c'est ainsi qu'on apprend le système.

Les paris (19 % des options) annoncent leur chance en mots : *tu t'en crois capable*,
*c'est jouable*, *c'est incertain*, *c'est au-delà de toi*.

## Mourir

Aucun tirage caché ne te tue : seule la **valetudo** à zéro. C'est un budget que tu dépenses
en gloire, et tu vois la barre descendre. Mesuré sur 250 parties par profil :

| Manière de jouer | Morts | Santé au plus bas |
|---|---|---|
| Toujours l'option la moins risquée | 0 % | n'atteint jamais le sommet |
| Ose une fois sur trois | 0 % | 6 % |
| **Ose aux batailles seulement** | **1 %** | **48 %** |
| Toujours la plus risquée | 43 % | 16 % |

C'est le **discernement** qui gagne — oser quand cela compte, se garder le reste du temps —
et non l'audace ni la prudence. Or discerner suppose de lire.

Un grade dont les conditions sont réunies **après la dernière décision** n'est pas attribué :
on ne commande pas un poste qu'on n'a jamais tenu. Il est mentionné à la démobilisation,
sur le dossier — pas sur la pierre.

## Monter en grade

Un seul jeu de conditions par grade, vérifié en fin de chapitre. Les gains de compétence ont
des **rendements décroissants** : on ne peut pas exceller partout, donc le profil que tu
construis décide du sommet que tu peux atteindre.

## Contenu

9 chapitres, 68 événements écrits (54 joués par partie), 210 options, **68 notes historiques**
repliables. Bibracte, Arioviste, la Sambre, les Vénètes, la Bretagne, Atuatuca, Avaricum,
Gergovie, Alésia, Uxellodunum, Ilerda, Dyrrachium, Pharsale, le Phare, Ruspina, Thapsus, Munda.

Au Rubicon : suivre César, passer à Pompée, ou prendre ton congé. Les trois branches se jouent.

## Habillage

Facture inspirée des maquettes *Centurion Path* : bannière de velours pourpre, titre gravé
en dégradé d'or, cadres ornés, médaillons d'emblèmes, barre de navigation à cinq onglets.

Tout est en **CSS et SVG tracés à la main** — 19 emblèmes (aigle, laurier, casque, caducée,
denier, glaive, bouclier, balance, rouleau, temple, vexillum…) et 2 scènes gravées (camp
retranché, ligne de bataille). Aucune image externe : le fichier reste autonome.

Les cinq onglets :

| Onglet | Contenu |
|---|---|
| `Castra` | l'événement en cours et ses choix |
| `Campagne` | les 9 chapitres, faits / en cours / verrouillés |
| `Acta` | le journal de toutes tes décisions |
| `Nota` | les notes historiques recueillies |
| `Cursus` | le rail des grades, les seuils de promotion en barres, attributs, blessures |

## Acies — les batailles en temps réel

`bataille.html` : une bataille en trois dimensions, en temps réel, sans aucun choix à cocher.
Deux armées entières sur le terrain — plus de cinq mille hommes, chacun simulé — sur un relief,
sous un ciel, dans l'herbe et la poussière. Trois batailles : **Bibracte** (contre les Helvètes,
puis les Boïens qui tombent sur le flanc), **Pharsale** et **Munda** (contre les légions de Pompée).

**Ton grade décide de ta place :**

| Grade | Rôle | Ce que tu fais |
|---|---|---|
| `Miles`, `Immunis`, `Tesserarius` | au premier rang, vue subjective | glaive, bouclier, umbo, pilum ; tu tiens ton rang |
| `Optio` | dans le rang, vue subjective | idem, et tu commandes la relève et le serrement des rangs |
| `Centurio`, `Pilus Prior` | au premier rang, vue subjective | ta cohorte manœuvre à ta voix : tenir, avancer, pila, charger, reculer |
| `Primus Pilus`, `Praefectus Fabrum` | vue d'ensemble | tu disposes des dix cohortes de la légion |

**Au rang** : souris pour regarder, `ZQSD`/`WASD` pour marcher, `Maj` pour courir, clic gauche
pour l'estoc, clic droit maintenu pour lever le scutum, `Espace` pour le coup d'umbo, `F` pour
lancer le pilum. Sans touche pressée, le rang te porte : tu suis ta place dans la formation.
L'homme d'en face **arme son coup** avant de frapper — c'est le moment de lever le bouclier,
puis de frapper pendant qu'il est découvert.

**Ce qui est simulé** : formations en triplex acies, volées de pila (qui tuent ou clouent les
boucliers), mêlée homme à homme, fatigue, relève des rangs, deuxième ligne qui monte quand la
première faiblit, moral par unité, prise de flanc, déroute contagieuse et poursuite. On meurt
surtout dans la déroute.

Depuis la campagne, Bibracte, Pharsale et Munda proposent **« Combattre en temps réel »** : tu
entres dans la bataille avec ton grade et tes attributs, et ce qui t'arrive s'inscrit dans ta
carrière — y compris la mort. Depuis l'accueil, **Acies** lance une bataille isolée.

Les hommes, le relief et les sons restent construits dans le code. Le ciel et le sol, eux,
sont photographiques.

### Le rendu

Le ciel est un panorama HDRI : il sert de fond **et** de lumière d'ambiance, ce qui donne au
bronze et au cuir leur matière. Le soleil projette ses ombres par cascades (`CSM`) — carte
serrée près de l'œil, large au loin — sans quoi, à l'échelle d'un champ de bataille, l'ombre
est soit grossière de près, soit absente à trente pas. Les quatre mille hommes projettent
chacun la leur : leur pose est calculée dans le shader, donc la carte de profondeur reçoit
la même déformation, faute de quoi leurs ombres resteraient plantées en T.

Le sol tient en deux matières photographiées — herbe et terre sèche — mêlées par la pente et
par plaques, puis teintées pour que la Gaule soit verte et la Bétique jaune. La tuile se
répétant tous les six mètres, une seconde lecture pivotée brouille le damier.

Enfin ACES pour la plage dynamique, un voile léger sur les métaux, et FXAA.

### Les ressources

Toutes libres, aucun compte requis. Les modules three.js sont versionnés ici ; les trente
mégaoctets de ciels et de sols ne le sont pas.

| Quoi | D'où | Licence |
|---|---|---|
| 3 ciels HDRI 2k | [Poly Haven](https://polyhaven.com) | CC0 |
| 2 sols PBR 2k (couleur, normales, ARM) | Poly Haven | CC0 |
| squelette et animations (X Bot Mixamo) | [mrdoob/three.js](https://github.com/mrdoob/three.js) | redistribué par three.js |
| three.js r169 + modules | mrdoob/three.js | MIT |

    ./fetch-assets.sh     # ~36 Mo, à ne lancer qu'une fois

### Les hommes bougent sur du mouvement capturé

Ils ne pivotent plus autour de points posés à la main : chaque pièce est attachée à l'un des
vingt os du squelette Mixamo, et c'est un acteur qui donne la pose.

Mais quatre mille squelettes, aucun processeur ne les calcule par image. Les poses sont donc
**cuites dans une texture** : une colonne de quatre texels par os, une ligne par image de
chaque clip. Le sommet y lit la matrice de son os selon le clip et l'avancement de son
homme — un seul appel de dessin pour toute l'armée, et chacun entre dans le cycle à son heure.

    ./serve.sh &          # la cuisson lit les fichiers par le réseau
    ./outils/cuire.sh     # → assets/anim/poses.bin + squelette.json

La cuisson passe par Chromium sans fenêtre : les lecteurs FBX et glTF n'existent qu'en
JavaScript. Elle reprend tout `.fbx` déposé dans `assets/anim/`, ce qui permet d'ajouter des
clips Mixamo (`Sword And Shield Slash`, `Block Idle`, `Death`…) sans toucher au code. En
attendant, l'estoc et la garde restent des rotations calculées, posées par-dessus la pose.

## Lancer

    ./fetch-assets.sh && ./build.sh && ./serve.sh

Puis <http://localhost:8080/>. `index.html` — la carrière — reste autonome et ouvrable par
double-clic ; elle se sauvegarde en `localStorage`. `bataille.html` lit ses textures par le
réseau : ouverte en `file://`, le navigateur les lui refuse, d'où le serveur.

## Ajouter une campagne

Le moteur ne connaît rien de César. Grades, origines, chapitres et événements sont
entièrement en données : une autre légion à une autre époque — la XIII Gemina en Dacie,
par exemple — ne demande que de nouveaux `data-*.js`, sans toucher à `app.js`.

## Sources

    src2/style.css          palette, typographie, mise en page
    src2/icons.js           19 emblèmes SVG, 2 scènes gravées, noms romains
    src2/data-core.js       statistiques, grades, promotion, origines
    src2/data-phases-*.js   les 9 chapitres et leurs événements
    src2/data-communs.js    réserve d'événements de camp + branche pompéienne
    src2/app.js             moteur et interface

    src3d/noyau.js          outils, bruit, scénarios des batailles
    src3d/ressources.js     chargement du ciel HDRI et des sols photographiés
    src3d/monde.js          relief, sol, lumière, ombres, végétation, poussière
    src3d/soldats.js        modèles et rendu par instances, animés dans le shader
    src3d/sim.js            formations, pila, mêlée, moral, déroute, IA
    src3d/son.js            sons synthétisés
    src3d/jeu.js            joueur, commandement, interface, boucle
    vendor/                 three.js r169 et ses modules (MIT)
    assets/                 ciels et sols — non versionnés, voir fetch-assets.sh

    src/                    v1 — sources de la version « tableau d'état-major » (dépassée)
    archive/                v1 assemblée, jouable telle quelle

La version vivante est `src2/`, assemblée par `build.sh` en `index.html`.
`src/` et `archive/` sont conservés comme historique et ne sont plus construits.
