import type { MetadataRoute } from 'next'

const BASE_URL = 'https://www.joinbeez.com'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/profile', '/ruche', '/messages', '/onboarding/success', '/api/*'],
    },
    sitemap: `${BASE_URL}/sitemap.xml`,
  }
}
