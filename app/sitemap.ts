import type { MetadataRoute } from 'next';

const baseUrl = 'https://ghstories.xyz';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date().toISOString();

  return [
    {
      url: `${baseUrl}/`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/llms.txt`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.4,
    },
    {
      url: `${baseUrl}/llms-full.txt`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.4,
    },
  ];
}
