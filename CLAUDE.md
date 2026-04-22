# Beez — Instructions pour Claude Code

## Le projet
Beez est un réseau social français pour entrepreneurs.
URL production : https://www.joinbeez.com
Repo GitHub : https://github.com/Beezsocial/Beez

## Stack technique
- Next.js 16 (App Router)
- TypeScript
- Tailwind CSS
- Supabase (auth + database + storage)
- Vercel (hébergement)
- Resend (emails transactionnels)
- Motion for React (animations) — import depuis "motion/react"
- 21st.dev (banque de composants UI premium)

## Animations — Motion for React
TOUJOURS utiliser Motion pour :
- Apparition des sections au scroll (fadeUp, slideIn)
- Transitions entre états (hover, focus, active)
- Chargement de page (staggered reveals)
- Microinteractions sur les boutons et cards

Import systématique :
import { motion, useInView, useAnimation } from "motion/react"

Pattern standard pour apparition au scroll :
<motion.div
  initial={{ opacity: 0, y: 24 }}
  whileInView={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.5, ease: "easeOut" }}
  viewport={{ once: true }}
>

Pattern bouton hover :
<motion.button
  whileHover={{ scale: 1.02, brightness: 1.08 }}
  whileTap={{ scale: 0.98 }}
  transition={{ duration: 0.15 }}
>

## Composants UI — 21st.dev
Avant de créer un composant from scratch, vérifier si un 
composant 21st.dev existe et l'adapter à la DA Beez.
Toujours adapter les couleurs : navy #082b44, or #ebaf57.
Toujours adapter le border-radius à 10px.

## Charte graphique
- Navy principal : #082b44
- Surface navy : #0D2E4A
- Deep navy : #041625
- Or accent : #ebaf57
- Blanc : #ffffff
- Border radius : 10px partout (sauf pills : 100px)
- Hexagones : orientation flat-top UNIQUEMENT
  clip-path: polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)
- Honeycomb background sur toutes les pages (::before pseudo-element)
- Fonts : Syne (titres) + DM Sans (corps)

## Règles absolues
- JAMAIS modifier la base de données Supabase directement
- TOUJOURS créer une branche preview/ avant de coder
- JAMAIS pusher sur main sans validation préalable
- TOUJOURS tester sur mobile 375px
- JAMAIS casser l'auth existante (Google OAuth + email)
- Les apostrophes dans JSX : utiliser " pour wrapper les strings
- TOUJOURS utiliser Motion pour les animations, jamais CSS pur
- TOUJOURS vérifier 21st.dev avant de créer un composant UI

## Structure Supabase
Tables : profiles, profile_types, seeking, first_posts
Bucket storage : Avatars (capital A)
Auth : Google OAuth + email/password
Founding Members : member_number <= 150 = Pro gratuit à vie

## Founding Members
- Les 150 premiers profils créés sont Founding Members
- Badge gold "✦ Founding Member #001" (toujours 3 chiffres)
- Pro gratuit à vie
- Email Resend spécifique avec félicitations

## Pages existantes
- / → landing page
- /onboarding → création de profil
- /onboarding/success → écran de succès
- /profile → page profil utilisateur
- /signin → connexion
- /roadmap → avancement du projet
- /privacy → politique de confidentialité
- /terms → conditions d'utilisation
- /mentions-legales → mentions légales
- /contact → contact

## Workflow OBLIGATOIRE
1. git checkout -b preview/nom-feature
2. Coder la feature
3. git push origin preview/nom-feature
4. Vérifier sur Vercel preview URL
5. Si OK : git checkout main && git merge preview/nom-feature && git push
6. git branch -d preview/nom-feature && git push origin --delete preview/nom-feature