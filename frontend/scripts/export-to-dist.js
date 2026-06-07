const { spawn } = require('child_process');
const http = require('http');
const net = require('net');
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const DIST = path.join(ROOT, 'dist');
const NEXT_STATIC = path.join(ROOT, '.next', 'static');
const ROUTES_MANIFEST = path.join(ROOT, '.next', 'routes-manifest.json');

function waitForServer(url, timeout = 30000) {
    const start = Date.now();
    return new Promise((resolve, reject) => {
        (function probe() {
            http.get(url, (res) => {
                resolve();
            }).on('error', (err) => {
                if (Date.now() - start > timeout) return reject(new Error('Server did not start'));
                setTimeout(probe, 500);
            });
        })();
    });
}

function findFreePort(start = 3000, end = 3100) {
    return new Promise((resolve, reject) => {
        const tryPort = (port) => {
            if (port > end) return reject(new Error('No available port found'));
            const server = net.createServer();
            server.unref();
            server.on('error', (err) => {
                if (err.code === 'EADDRINUSE' || err.code === 'EACCES') {
                    tryPort(port + 1);
                } else {
                    reject(err);
                }
            });
            server.listen(port, () => {
                server.close(() => resolve(port));
            });
        };
        tryPort(start);
    });
}

async function fetchHtml(route) {
    const url = `http://localhost:${PORT}${route}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Failed to fetch ${url}: ${res.status}`);
    return await res.text();
}

function saveHtml(route, html) {
    // map '/' -> dist/index.html, '/about' -> dist/about/index.html
    const outPath = route === '/' ? path.join(DIST, 'index.html') : path.join(DIST, route.replace(/^\//, ''), 'index.html');
    const dir = path.dirname(outPath);
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(outPath, html, 'utf8');
}

function copyStatic() {
    if (fs.existsSync(NEXT_STATIC)) {
        const target = path.join(DIST, '_next', 'static');
        fs.rmSync(target, { recursive: true, force: true });
        fs.cpSync(NEXT_STATIC, target, { recursive: true });
    }
}

async function main() {
    if (!fs.existsSync(ROUTES_MANIFEST)) {
        console.error('.next/routes-manifest.json not found — run `next build` first');
        process.exit(1);
    }

    const PORT = process.env.PORT ? Number(process.env.PORT) : await findFreePort(3000, 3100);
    const server = spawn('npx', ['next', 'start', '-p', String(PORT)], {
        cwd: ROOT,
        stdio: ['ignore', 'inherit', 'inherit'],
        shell: true,
    });

    try {
        const url = `http://localhost:${PORT}`;
        await waitForServer(url);
        const manifest = JSON.parse(fs.readFileSync(ROUTES_MANIFEST, 'utf8'));
        const routes = (manifest.staticRoutes || []).map((r) => r.page).filter(Boolean);

        for (const route of routes) {
            try {
                const html = await fetchHtml(route);
                saveHtml(route, html);
                console.log('Exported', route);
            } catch (err) {
                console.warn('Skipping', route, err.message);
            }
        }

        // Also export root if not present
        if (!routes.includes('/')) {
            try {
                const html = await fetchHtml('/');
                saveHtml('/', html);
            } catch (err) {
                console.warn('Skipping /', err.message);
            }
        }

        copyStatic();
        console.log('Static export complete. Output:', DIST);
    } catch (err) {
        console.error('Export failed:', err.message);
        process.exitCode = 1;
    } finally {
        server.kill();
    }
}

main();
