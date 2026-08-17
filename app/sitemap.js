import { instruments } from './data/instruments';

const SITE_URL = 'https://www.allaricercadeisuoniperduti.com';

export default function sitemap() {
  const staticRoutes = [
    {
      url: SITE_URL,
      changeFrequency: 'monthly',
      priority: 1,
    },
  ];

  const instrumentRoutes = instruments.map((instrument) => ({
    url: `${SITE_URL}/strumenti/${instrument.id}`,
    changeFrequency: 'yearly',
    priority: 0.7,
  }));

  return [...staticRoutes, ...instrumentRoutes];
}
