// Adresse et clé publique du projet Supabase. Toutes deux sont publiques par
// nature : ce fichier peut être importé côté navigateur comme côté serveur.
//
// Rotation des clés : la nouvelle clé « publishable » est lue en priorité,
// l'ancienne clé anon sert de repli pour basculer sans coupure. Une fois la
// bascule faite partout, retirer le repli et NEXT_PUBLIC_SUPABASE_ANON_KEY.
//
// Les noms process.env.NEXT_PUBLIC_… doivent rester écrits en entier : Next.js
// ne les inscrit dans le code du navigateur que sous cette forme exacte.
export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!

export const SUPABASE_PUBLISHABLE_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
