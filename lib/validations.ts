import { z } from 'zod'

export const emailAuthSchema = z
  .object({
    email: z
      .string()
      .min(1, 'Email requis')
      .email('Adresse email invalide')
      .max(254, 'Email trop long'),
    password: z
      .string()
      .min(8, 'Le mot de passe doit contenir au moins 8 caractères')
      .max(72, 'Le mot de passe est trop long')
      .regex(/[A-Z]/, 'Au moins une majuscule requise')
      .regex(/[0-9]/, 'Au moins un chiffre requis'),
    confirmPassword: z.string().min(1, 'Confirmation requise'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Les mots de passe ne correspondent pas',
    path: ['confirmPassword'],
  })

export type EmailAuthInput = z.infer<typeof emailAuthSchema>

export const step1Schema = z.object({
  firstName: z
    .string()
    .min(1, 'Prénom requis')
    .max(50, 'Prénom trop long')
    .regex(/^[a-zA-ZÀ-ÿ\s'\-]+$/, 'Caractères invalides'),
  lastName: z
    .string()
    .min(1, 'Nom requis')
    .max(50, 'Nom trop long')
    .regex(/^[a-zA-ZÀ-ÿ\s'\-]+$/, 'Caractères invalides'),
  city: z
    .string()
    .min(1, 'Ville requise')
    .max(100, 'Ville trop longue'),
  bio: z
    .string()
    .min(1, 'Bio requise')
    .max(120, 'Bio limitée à 120 caractères'),
})

export type Step1Input = z.infer<typeof step1Schema>

export const profileTypeValues = [
  'entrepreneur_actif',
  'futur_entrepreneur',
  'freelance',
  'investisseur',
  'mentor',
  'etudiant',
  'salarie_side_project',
] as const

export const seekingValues = [
  'associe',
  'co_fondateur',
  'investisseur',
  'clients',
  'mentor',
  'dev',
  'designer',
  'partenaires',
  'beta_testeurs',
  'conseils',
  'locaux',
] as const

export const step2Schema = z.object({
  types: z
    .array(z.enum(profileTypeValues))
    .min(1, 'Sélectionne au moins un profil'),
})

export type Step2Input = z.infer<typeof step2Schema>

export const step3Schema = z.object({
  seeking: z
    .array(z.enum(seekingValues))
    .min(1, 'Sélectionne au moins une option'),
})

export type Step3Input = z.infer<typeof step3Schema>

export const step4Schema = z.object({
  post: z
    .string()
    .max(280, 'Limité à 280 caractères')
    .optional(),
})

export type Step4Input = z.infer<typeof step4Schema>

export const profileTypeLabels: Record<typeof profileTypeValues[number], string> = {
  entrepreneur_actif: 'Entrepreneur actif',
  futur_entrepreneur: 'Futur entrepreneur',
  freelance: 'Freelance',
  investisseur: 'Investisseur',
  mentor: 'Mentor',
  etudiant: 'Étudiant',
  salarie_side_project: 'Salarié avec un side project',
}

export const seekingLabels: Record<typeof seekingValues[number], string> = {
  associe: 'Un associé',
  co_fondateur: 'Un co-fondateur',
  investisseur: 'Un investisseur',
  clients: 'Des clients',
  mentor: 'Un mentor',
  dev: 'Un dev',
  designer: 'Un designer',
  partenaires: 'Des partenaires commerciaux',
  beta_testeurs: 'Des beta testeurs',
  conseils: 'Des conseils',
  locaux: 'Des locaux',
}
