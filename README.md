# Beez — La ruche des entrepreneurs

Landing page + inscription pour Beez, réseau social français pour entrepreneurs.

**Stack :** Next.js 14 (App Router) · TypeScript · Tailwind CSS · Supabase

---

## Prérequis

- Node.js ≥ 18 ([nodejs.org](https://nodejs.org))
- Un compte [Supabase](https://supabase.com) (gratuit)
- Un compte [Vercel](https://vercel.com) (gratuit) pour le déploiement

---

## 1. Créer le projet Supabase

1. Va sur [supabase.com/dashboard](https://supabase.com/dashboard) → **New project**
2. Choisis un nom (ex : `beez-prod`), une région (Europe West) et un mot de passe DB fort
3. Attends ~2 min que le projet démarre

### Récupérer les clés

Dans ton projet Supabase → **Settings → API** :

- **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
- **anon / public key** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

⚠️ N'utilise **jamais** la `service_role` key côté client.

### Lancer la migration SQL

1. Dashboard Supabase → **SQL Editor → New query**
2. Colle le contenu de [`supabase/migrations/001_initial.sql`](supabase/migrations/001_initial.sql)
3. Clique **Run**

---

## 2. Configurer Google OAuth

1. Va sur [console.cloud.google.com](https://console.cloud.google.com)
2. **APIs & Services → Credentials → Create credentials → OAuth 2.0 Client ID**
3. Type : **Web application**
4. Authorized redirect URIs :
   ```
   https://<ton-projet>.supabase.co/auth/v1/callback
   ```
5. Copie le **Client ID** et **Client Secret**
6. Dans Supabase → **Authentication → Providers → Google** :
   - Enable Google
   - Colle le Client ID et Client Secret
   - Save

---

## 3. Configurer Resend (emails de bienvenue)

1. Crée un compte sur [resend.com](https://resend.com)
2. Ajoute et vérifie ton domaine (`joinbeez.com`) dans **Domains**
3. Crée une **API Key** dans **API Keys → Create API Key**
4. Ajoute la clé en variable d'environnement : `RESEND_API_KEY`

> Les emails sont envoyés depuis `onboarding@joinbeez.com`. Si tu n'as pas encore de domaine vérifié, tu peux utiliser le domaine sandbox Resend pour les tests.

---

## 4. Installation locale

```bash
# Clone
git clone <repo-url> beez
cd beez

# Installe les dépendances
npm install

# Configure l'environnement
cp .env.example .env.local
# Édite .env.local avec tes clés Supabase

# Lance le serveur de dev
npm run dev
```

Ouvre [http://localhost:3000](http://localhost:3000)

---

## 5. Déploiement sur Vercel

### Via CLI

```bash
npm i -g vercel
vercel
```

### Via Dashboard

1. [vercel.com/new](https://vercel.com/new) → Import depuis GitHub
2. Framework preset : **Next.js** (détecté automatiquement)
3. Ajoute les variables d'environnement :
   | Variable | Valeur |
   |---|---|
   | `NEXT_PUBLIC_SUPABASE_URL` | `https://xxx.supabase.co` |
   | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `eyJ...` |
   | `NEXT_PUBLIC_SITE_URL` | `https://joinbeez.com` |
   | `SUPABASE_SERVICE_ROLE_KEY` | clé `service_role` depuis Supabase → Settings → API |
   | `RESEND_API_KEY` | clé API depuis [resend.com](https://resend.com) → API Keys |
4. Deploy

---

## 6. Domaine personnalisé (joinbeez.com)

### Sur Vercel

1. Ton projet Vercel → **Settings → Domains → Add**
2. Saisis `joinbeez.com` et `www.joinbeez.com`
3. Vercel affiche les records DNS à configurer

### Chez ton registrar DNS

| Type | Nom | Valeur |
|---|---|---|
| `A` | `@` | `76.76.21.21` |
| `CNAME` | `www` | `cname.vercel-dns.com` |

La propagation DNS prend 5 min à 48h.

### Dans Supabase — mettre à jour les URLs

Supabase → **Authentication → URL Configuration** :
- **Site URL** : `https://joinbeez.com`
- **Redirect URLs** : ajoute `https://joinbeez.com/auth/callback`

Puis dans Google Cloud Console et Apple Developer, ajoute `https://joinbeez.com/auth/callback` comme redirect URI autorisé.

---

## Structure des fichiers

```
beez/
├── app/
│   ├── layout.tsx              # Root layout (fonts, metadata)
│   ├── page.tsx                # Landing page
│   ├── globals.css             # Tailwind + custom CSS
│   ├── auth/callback/route.ts  # OAuth callback handler
│   └── onboarding/
│       ├── page.tsx            # Auth + 4-step onboarding
│       └── success/
│           ├── page.tsx        # Success screen (Server Component)
│           └── ShareButton.tsx # Share CTA (Client Component)
├── components/ui/
│   ├── Button.tsx
│   ├── Input.tsx               # Input + Textarea
│   ├── PillTag.tsx
│   └── HexBadge.tsx
├── lib/
│   ├── validations.ts          # Zod schemas
│   └── supabase/
│       ├── client.ts           # Browser client
│       ├── server.ts           # Server client (SSR)
│       └── types.ts            # Generated DB types
├── supabase/migrations/
│   └── 001_initial.sql         # Full schema + RLS
├── middleware.ts               # Route protection
├── .env.example
└── README.md
```

---

## Variables d'environnement

| Variable | Requis | Description |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | ✅ | URL de ton projet Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | ✅ | Clé anon publique Supabase |
| `NEXT_PUBLIC_SITE_URL` | ✅ | URL de l'app (localhost ou domaine prod) |
| `SUPABASE_SERVICE_ROLE_KEY` | ✅ | Clé service role Supabase (server-side uniquement) |
| `RESEND_API_KEY` | ✅ | Clé API Resend — emails de bienvenue |
