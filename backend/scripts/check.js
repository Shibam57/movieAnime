const fs = require('node:fs');
const path = require('node:path');
const { spawnSync } = require('node:child_process');
const root = path.resolve(__dirname, '..');
let count = 0;
function walk(dir) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        const file = path.join(dir, entry.name);
        if (entry.isDirectory()) walk(file);
        else if (file.endsWith('.js')) {
            const result = spawnSync(process.execPath, ['--check', file], { stdio: 'inherit' });
            if (result.status !== 0) process.exit(1);
            for (const match of fs.readFileSync(file,'utf8').matchAll(/require\(['"](\.[^'"]+)['"]\)/g)) {
                try { require.resolve(path.resolve(path.dirname(file), match[1])); } catch { throw new Error(`Missing local import in ${file}: ${match[1]}`); }
            }
            count++;
        }
    }
}
walk(path.join(root, 'src'));
console.log(`Checked ${count} source files: syntax and local imports passed.`);
