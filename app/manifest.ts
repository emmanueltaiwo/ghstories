import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'ghstories',
    short_name: 'ghstories',
    description:
      'Turn your GitHub commits into ephemeral stories and share your coding journey with the dev community.',
    start_url: '/',
    display: 'standalone',
    background_color: '#faf8f5',
    theme_color: '#000000',
    icons: [
      {
        src: '/icons/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icons/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  };
}

