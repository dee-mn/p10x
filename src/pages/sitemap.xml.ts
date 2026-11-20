import type { APIRoute } from 'astro';
import routes from '../../docs/routes.json';
import { publishedPosts, postUrl } from '../lib/insights';

export const GET: APIRoute = async ({ site }) => {
  const paths = [...routes.map(page => page.route), ...(await publishedPosts()).map(postUrl)];
  const urls = paths.map(path => '<url><loc>' + new URL(path, site).href + '</loc></url>');
  return new Response('<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' + urls.join('') + '</urlset>');
};
