import fs from 'node:fs/promises';

const dimensions = JSON.parse(
  await fs.readFile('docs/image-dimensions.json', 'utf8')
);

export function attribute(tag, name) {
  return tag.match(new RegExp('(?:^|\\s)' + name + '=["\\\']([^"\\\']*)'))?.[1];
}

export function addImageDimensions(html) {
  return html.replace(/<img\b[^>]*>/g, (tag) => {
    const size = dimensions[attribute(tag, 'src')];
    if (!size) return tag;
    let attrs = '';
    if (!attribute(tag, 'width')) attrs += ' width="' + size[0] + '"';
    if (!attribute(tag, 'height')) attrs += ' height="' + size[1] + '"';
    return attrs ? tag.replace(/\/?>(?=$)/, (m) => attrs + m) : tag;
  });
}
