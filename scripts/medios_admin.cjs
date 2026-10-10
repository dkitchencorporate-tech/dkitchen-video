// Lee admin/medios.json, aplica la sustitución opcional (slug run_id) y lista "slug run_id" por línea.
const fs = require('fs');
const m = JSON.parse(fs.readFileSync('admin/medios.json', 'utf8'));
const [slug, run] = process.argv.slice(2);
if (slug && /^[a-z0-9-]+$/.test(slug) && /^[0-9]+$/.test(run || '')) m[slug] = run;
for (const [k, v] of Object.entries(m)) console.log(k + ' ' + v);
