import type { APIRoute } from 'astro';
import { publishedPosts, postUrl } from '../../lib/insights';

const escape = (text: string) => text.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');

export const GET: APIRoute = async ({ site }) => {
  const items = (await publishedPosts()).map(post => {
    const url = new URL(postUrl(post), site).href;
    return `<item><title>${escape(post.data.title)}</title><description>${escape(post.data.description)}</description><link>${url}</link><guid>${url}</guid><pubDate>${post.data.published.toUTCString()}</pubDate></item>`;
  });
  const link = new URL('/insights/', site).href;
  return new Response(`<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"><channel><title>P10X Insights</title><link>${link}</link><description>Automotive care and protection articles from P10X.</description><language>en</language>${items.join('\n')}</channel></rss>`);
};
