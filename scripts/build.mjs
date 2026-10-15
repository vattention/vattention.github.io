import { cp, mkdir, readdir, rm, stat } from 'node:fs/promises';
import { extname, join } from 'node:path';

// Publish only website assets, never repository metadata or deployment files.
const root = new URL('../', import.meta.url);
const output = new URL('../dist/', import.meta.url);
const extensions = new Set(['.html', '.css', '.js', '.jpg', '.jpeg', '.png', '.svg', '.ico', '.webp', '.gif', '.woff', '.woff2']);
const directories = new Set(['assets', 'pets-photos', 'team-photos']);
await rm(output, { recursive: true, force: true });
await mkdir(output, { recursive: true });
let count = 0;
async function copy(relative = '') {
  for (const entry of await readdir(new URL(relative || '.', root), { withFileTypes: true })) {
    if (entry.name.startsWith('.')) continue;
    const path = join(relative, entry.name);
    if (entry.isDirectory()) {
      if (relative || directories.has(entry.name)) await copy(path + '/');
    } else if (entry.isFile() && (extensions.has(extname(entry.name).toLowerCase()) || entry.name === '_redirects')) {
      const source = new URL(path, root);
      if ((await stat(source)).size > 25 * 1024 * 1024) throw new Error(`Asset exceeds Workers' 25 MiB limit: ${path}`);
      const destination = new URL(path, output);
      await mkdir(new URL('.', destination), { recursive: true });
      await cp(source, destination);
      count++;
    }
  }
}
await copy();
console.log(`Built ${count} static assets in dist/; background3.mp4 is served from R2.`);
