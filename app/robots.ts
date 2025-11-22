import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/checkout/success', '/thank-you/'],
      },
      {
        userAgent: ['GPTBot', 'CCBot', 'Google-Extended', 'anthropic-ai', 'Claude-Web'],
        disallow: '/',
      },
    ],
    sitemap: 'https://explore.catalystwells.in/sitemap.xml',
  };
}
