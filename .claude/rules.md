# Règles Claude Code — Beez

## Avant chaque modification
- Lire CLAUDE.md en premier
- Vérifier la branche actuelle (jamais travailler sur main)
- Créer branche preview/ si on est sur main
- Vérifier si un composant 21st.dev existe avant d'en créer un

## Animations
- Utiliser Motion for React pour TOUTES les animations
- Import : from "motion/react"
- Jamais CSS keyframes ou transition CSS pour les animations UI
- Exceptions : honeycomb background, float animation des mockups

## Composants UI
- Vérifier 21st.dev en premier
- Adapter couleurs navy/cyan (jetons de design/brand.md) et border-radius 10px
- Documenter le composant utilisé en commentaire

## Design
- Hexagones toujours flat-top
- Border-radius 10px sur toutes les cards
- Navy dominant : fond navy-900 #071f2f, surfaces navy-800 #082b44 / navy-700 #0d2e4a
- Accent cyan #57d9eb (survol #2fb5cc ; sur fond blanc #1597ad, jamais pour du texte courant)
- Texte sur cyan : toujours navy #082b44, jamais blanc
- Or #ebaf57 : uniquement le badge Founding Member et le futur jeton Honey
- Fonds : dégradé radial #09293f → #041421 (bg-page), ruche cyan 6–9 %, halo cyan derrière le logo
- Utiliser les classes de jetons (bg-accent, text-navy-800…), jamais de couleur en dur nouvelle
- Honeycomb background sur chaque nouvelle page

## Sécurité
- Jamais de clés API dans le code
- Toujours RLS activé sur les nouvelles tables Supabase
- Jamais exposer SUPABASE_SERVICE_ROLE_KEY côté client

## Performance
- Images : toujours next/image
- Composants lourds : lazy loading avec dynamic()
- Motion : viewport={{ once: true }} pour éviter les re-animations