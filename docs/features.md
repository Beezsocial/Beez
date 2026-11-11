# Beez — Fonctionnalités et identité visuelle

## Identité visuelle (navy profond + cyan)
Référence : la couverture Instagram — fond navy profond, ruche cyan très discrète,
halo cyan derrière le logo, texte blanc, « z » et points finaux en cyan.
Source de vérité : design/brand.md.

### Fonds et surfaces
| Jeton | Valeur | Usage |
|---|---|---|
| navy-950 | #041625 | Fond le plus profond : bas de page, footer, bords du dégradé |
| navy-900 | #071f2f | Fond principal (`bg-navy`) |
| navy-800 | #082b44 | Surfaces, cartes, header — et texte posé sur du cyan |
| navy-700 | #0d2e4a | Surfaces surélevées, champs de saisie |
| navy-500 | #1b4366 | Bordures et séparateurs sur fond sombre |
| muted | #a9b8c5 | Texte secondaire sur fond sombre |

### Accents
| Jeton | Valeur | Usage |
|---|---|---|
| accent | #57d9eb | Boutons, liens, états actifs, compteurs, puces, lueurs, le « z » de Beez, les points finaux du hero |
| accent-2 | #2fb5cc | Survol et état pressé des boutons, seconde couleur des dégradés |
| accent-deep | #1597ad | Bordures et icônes cyan sur fond blanc (page /ruche). Jamais pour du texte courant |
| gold | #ebaf57 | **Uniquement** le badge Founding Member (`FoundingMemberBadge`, et `HexBadge` en version Founding sur /onboarding/success) et, plus tard, le jeton Honey |

Les valeurs sont définies une seule fois, en canaux RGB, dans les variables `--beez-*` de `app/globals.css` ; `tailwind.config.ts` les nomme (`bg-accent`, `text-navy-800`, `border-accent-deep/40`…).

### Lisibilité
- Texte posé sur du cyan : toujours navy #082b44 (`text-navy-800`), jamais blanc (blanc sur cyan : contraste 1,7, illisible).
- Sur fond blanc, le texte reste navy #082b44.

### Boutons et focus
- Bouton principal (`.btn-accent` / `.btn-primary`) : fond cyan uni #57d9eb, texte navy. Survol / pressé : #2fb5cc + lueur `0 0 24px rgba(87, 217, 235, .35)`. Pas de reflet.
- Bouton secondaire (`.btn-secondary`) : contour cyan 1,5 px, texte cyan.
- Focus clavier : outline cyan 2 px, offset 2 px.

### Fonds décoratifs
- Pages sombres (`bg-page` + `honeycomb-bg` sur la racine) : dégradé radial #09293f au centre → #041421 sur les bords, fixé au viewport.
- Nid d'abeille : hexagones flat-top, trait fin cyan, opacité entre 6 et 9 % (7 % par défaut), aucune autre couleur.
- Logo sur fond sombre : halo cyan léger derrière (`.logo-halo` : `radial-gradient(rgba(87, 217, 235, .25), transparent)`).
- Or : réservé au badge Founding Member et au futur jeton Honey. Nulle part ailleurs.
