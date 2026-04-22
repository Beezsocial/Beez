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
- Adapter couleurs navy/or et border-radius 10px
- Documenter le composant utilisé en commentaire

## Design
- Hexagones toujours flat-top
- Border-radius 10px sur toutes les cards
- Navy #082b44 dominant
- Or #ebaf57 pour les accents uniquement
- Honeycomb background sur chaque nouvelle page

## Sécurité
- Jamais de clés API dans le code
- Toujours RLS activé sur les nouvelles tables Supabase
- Jamais exposer SUPABASE_SERVICE_ROLE_KEY côté client

## Performance
- Images : toujours next/image
- Composants lourds : lazy loading avec dynamic()
- Motion : viewport={{ once: true }} pour éviter les re-animations