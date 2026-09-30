import { instruments } from './data/instruments';

const SITE_URL = 'https://www.allaricercadeisuoniperduti.com';

export default function sitemap() {
  const staticRoutes = [
    {
      url: SITE_URL,
      changeFrequency: 'monthly',
      priority: 1,
      alternates: {
        languages: {
          it: SITE_URL,
          en: `${SITE_URL}/en`,
        },
      },
    },
  ];

  const instrumentRoutes = instruments.map((instrument) => ({
    url: `${SITE_URL}/strumenti/${instrument.id}`,
    changeFrequency: 'yearly',
    priority: 0.7,
    alternates: {
      languages: {
        it: `${SITE_URL}/strumenti/${instrument.id}`,
        en: `${SITE_URL}/en/strumenti/${instrument.id}`,
      },
    },
  }));

  return [...staticRoutes, ...instrumentRoutes];
}
