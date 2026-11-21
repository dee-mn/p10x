// A local background film and its cover are released together, even when a clip is replaced in place.
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { attribute } from './image-dimensions.mjs';
import { publishedRoutes } from './published-routes.mjs';

const generated = new Map();
const directory = '/assets/video/posters/';
await mkdir(path.join('dist', directory), { recursive: true });

for (const { route } of publishedRoutes('dist')) {
  const page = path.join('dist', route, 'index.html');
  const html = await readFile(page, 'utf8');
  let output = html;
  for (const [tag] of html.matchAll(/<video\b[^>]*>[\s\S]*?<\/video>/gi)) {
    const poster = attribute(tag, 'poster') || attribute(tag, 'data-poster');
    if (!poster?.startsWith(directory) || !poster.endsWith('.webp')) continue;
    const source = (attribute(tag, 'src') || attribute(tag, 'data-src') || '').split('#')[0];
    const time = Number(attribute(tag, 'data-poster-time') || 0);
    if (!/^\/assets\/video\/[\w.-]+\.mp4$/.test(source) || !Number.isFinite(time) || time < 0)
      throw new Error('Invalid video cover source on ' + route);
    const key = source + '#' + time;
    let url = generated.get(key);
    if (!url) {
      const bytes = execFileSync('ffmpeg', [
        '-nostdin', '-v', 'error', '-ss', String(time), '-i', path.join('dist', source),
        '-map', '0:v:0', '-frames:v', '1', '-vf', "scale=w='min(iw,1600)':h=-2:flags=lanczos",
        '-threads', '2', '-pix_fmt', 'bgra', '-c:v', 'libwebp', '-lossless', '1',
        '-compression_level', '6', '-f', 'webp', 'pipe:1'
      ], { maxBuffer: 16 * 1024 * 1024 });
      if (!bytes.length) throw new Error('No video frame for ' + source);
      const hash = createHash('sha256').update(bytes).digest('hex').slice(0, 12);
      url = poster.replace(/\.webp$/, '-' + hash + '.webp');
      await writeFile(path.join('dist', url), bytes);
      generated.set(key, url);
    }
    const fallback = attribute(tag, 'data-poster')
      ? `<noscript><img class="deferred-film-cover" src="${url}" alt="" loading="lazy" decoding="async"></noscript>`
      : '';
    output = output.replace(tag, tag.replace(poster, url) + fallback);
  }
  if (output !== html) await writeFile(page, output);
}
console.log('Prepared ' + generated.size + ' background video covers.');
