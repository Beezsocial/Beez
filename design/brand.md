# Beez — Guide de Design

## Couleurs
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

## Typographie
Police unique : Outfit, chargée par next/font (`--font-outfit`, classes `font-sans` et `font-heading`)
Texte courant : Outfit 400
Interface (boutons, liens, libellés, puces) : Outfit 500 et 600
Titres : Outfit 700, tracking-tight (800 pour les grands titres de page, le mot « Beez » du hero et le compteur de membres)
Emails : `Outfit, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif` (repli système si Outfit absent)
Taille hero : clamp(48px, 8vw, 96px)
Taille section : clamp(32px, 5vw, 52px)

## Hexagones
Orientation : flat-top UNIQUEMENT
clip-path : polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)
Double hexagone : personne (devant, gauche) + startup (derrière, droite)
Glow cyan sur les avatars importants

## Animations — Motion for React
Apparition scroll : fadeUp (opacity 0→1, y 24→0, duration 0.5s)
Stagger enfants : delayChildren 0.1s, staggerChildren 0.08s
Hover cards : scale 1.02, duration 0.2s
Hover boutons : scale 1.02 + fond accent-2 #2fb5cc et lueur cyan
Tap boutons : scale 0.98
Transition pages : opacity 0→1, duration 0.3s

## Composants
Border-radius : 10px (cards, inputs, boutons)
Border-radius pills : 100px
Card background : #0d2e4a (navy-700)
Card border : 1px solid rgba(255,255,255,0.08)
Card shadow : 0 4px 24px rgba(0,0,0,0.2)
Glow accent : 0 0 24px rgba(87,217,235,0.12)

## Honeycomb
Orientation flat-top
Opacité : 0.07 (fourchette 6–9 %), portée par le SVG
Couleur stroke : #57d9eb (accent)
Position : fixed, ::before pseudo-element