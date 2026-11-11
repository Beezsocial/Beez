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
Toujours adapter les couleurs : navy #082b44, accent cyan #57d9eb (jamais l'or).
Toujours adapter le border-radius à 10px.

## Charte graphique
Détail complet : design/brand.md. Valeurs définies une seule fois dans les
variables `--beez-*` de app/globals.css, nommées dans tailwind.config.ts.
- navy-950 #041625 : fond le plus profond (footer, bords du dégradé)
- navy-900 #071f2f : fond principal (`bg-navy`)
- navy-800 #082b44 : surfaces, cartes, header, texte sur cyan
- navy-700 #0d2e4a : surfaces surélevées, champs
- navy-500 #1b4366 : bordures et séparateurs sur fond sombre
- muted #a9b8c5 : texte secondaire sur fond sombre
- accent #57d9eb : boutons, liens, états actifs, compteurs, puces, lueurs, « z » de Beez
- accent-2 #2fb5cc : survol / pressé des boutons, seconde couleur des dégradés
- accent-deep #1597ad : bordures et icônes cyan sur fond blanc (/ruche), jamais du texte courant
- gold #ebaf57 : UNIQUEMENT le badge Founding Member (FoundingMemberBadge, HexBadge en version Founding) et le futur jeton Honey
- Blanc : #ffffff
- Texte posé sur du cyan : TOUJOURS navy #082b44, jamais blanc (contraste 1,7). Sur fond blanc : navy.
- Boutons : cyan uni + texte navy, survol #2fb5cc + lueur cyan (.btn-accent). Secondaires : contour cyan 1,5 px (.btn-secondary).
- Focus clavier : outline cyan 2 px, offset 2 px
- Fonds : dégradé radial #09293f → #041421 sur les pages sombres (bg-page), ruche cyan 6–9 %, halo cyan derrière le logo (.logo-halo)
- Border radius : 10px partout (sauf pills : 100px)
- Hexagones : orientation flat-top UNIQUEMENT
  clip-path: polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)
- Honeycomb background sur toutes les pages (::before pseudo-element, trait cyan 7 %)
- Police : Outfit UNIQUEMENT, via next/font (variable --font-outfit) — 400 texte, 500 et 600 interface, 700 titres (800 réservé aux grands titres de page et au mot « Beez » du hero)
- Emails : Outfit en premier, puis les polices système de repli

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
- Badge gold "✦ Founding Member #001" (toujours 3 chiffres) — seul usage de l'or sur le site
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

## Assets
Logo fond sombre (header, fond navy) : /public/images/logo-dark-v3.svg (.png pour le JSON-LD)
Logo fond clair (posé sur du blanc) : /public/images/logo-light-v3.svg (.png)
Cadrage carré : afficher via logoBoxStyle() de components/ui/Logo.tsx pour garder la taille du v2
logo-dark-v2.png : conservé pour les emails déjà envoyés, ne plus l'utiliser
OG Image : /public/images/og-image.jpg (1200 × 630)
Icônes : app/favicon.ico, app/icon.png, app/apple-icon.png
Masters du logo : design/logo/
TOUJOURS utiliser ces fichiers, jamais recréer le logo en SVG ou texte.