# Beez — Guide de Design

## Couleurs
Primary navy : #082b44
Surface navy : #0D2E4A
Deep navy : #041625
Gold : #ebaf57
Gold dim : rgba(235,175,87,0.15)
Gold border : rgba(235,175,87,0.3)
White : #ffffff
Muted : rgba(255,255,255,0.5)

## Typographie
Titres : Syne 700/800, tracking-tight
Corps : DM Sans 400/500
Taille hero : clamp(48px, 8vw, 96px)
Taille section : clamp(32px, 5vw, 52px)

## Hexagones
Orientation : flat-top UNIQUEMENT
clip-path : polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)
Double hexagone : personne (devant, gauche) + startup (derrière, droite)
Glow or sur les avatars importants

## Animations — Motion for React
Apparition scroll : fadeUp (opacity 0→1, y 24→0, duration 0.5s)
Stagger enfants : delayChildren 0.1s, staggerChildren 0.08s
Hover cards : scale 1.02, duration 0.2s
Hover boutons : scale 1.02 + brightness 1.08
Tap boutons : scale 0.98
Transition pages : opacity 0→1, duration 0.3s

## Composants
Border-radius : 10px (cards, inputs, boutons)
Border-radius pills : 100px
Card background : #0D2E4A
Card border : 1px solid rgba(255,255,255,0.08)
Card shadow : 0 4px 24px rgba(0,0,0,0.2)
Gold glow : 0 0 24px rgba(235,175,87,0.12)

## Honeycomb
Orientation flat-top
Opacité : 0.07
Couleur stroke : #ebaf57
Position : fixed, ::before pseudo-element