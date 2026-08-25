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

## Lancer

    ./build.sh && xdg-open index.html

`index.html` est autonome et se sauvegarde en `localStorage`.

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

    src/                    v1 — sources de la version « tableau d'état-major » (dépassée)
    archive/                v1 assemblée, jouable telle quelle

La version vivante est `src2/`, assemblée par `build.sh` en `index.html`.
`src/` et `archive/` sont conservés comme historique et ne sont plus construits.
