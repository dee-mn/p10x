import { getCollection, type CollectionEntry } from 'astro:content';

export async function publishedPosts() {
  const posts = await getCollection('insights', ({ data, slug }) => !data.draft && !slug.startsWith('_'));
  for (const { slug } of posts) {
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) throw new Error('Use a lowercase, hyphenated article slug: ' + slug);
  }
  return posts.sort((a, b) => b.data.published.getTime() - a.data.published.getTime() || a.slug.localeCompare(b.slug));
}

export function postUrl(post: CollectionEntry<'insights'>) {
  return '/insights/' + post.slug + '/';
}

export function dateLabel(date: Date) {
  return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' });
}
