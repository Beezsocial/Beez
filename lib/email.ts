// Outils pour les emails envoyés par Resend.

// À appliquer à toute donnée venant d'un membre (prénom, nom, ville, contenu
// de message, motif et détails de signalement…) avant de l'insérer dans le
// HTML d'un email : le texte s'affiche tel quel au lieu d'être interprété.
// Inutile dans la version texte de l'email, qui n'est jamais lue comme du HTML.
export function escapeHtml(input: string): string {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

// À appliquer à toute donnée de membre placée dans l'objet d'un email : les
// retours à la ligne sont remplacés par une espace.
export function stripLineBreaks(input: string): string {
  return input.replace(/[\r\n\u0085\u2028\u2029]+/g, ' ')
}
