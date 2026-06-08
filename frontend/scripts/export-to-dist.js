const { spawn } = require('child_process');
const http = require('http');
const net = require('net');
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const DIST = path.join(ROOT, 'dist');
const PUBLIC_DIR = path.join(ROOT, 'public');
const NEXT_STATIC = path.join(ROOT, '.next', 'static');
const ROUTES_MANIFEST = path.join(ROOT, '.next', 'routes-manifest.json');
let PORT;

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

async function fetchHtml(route, timeout = 30000) {
    const url = `http://localhost:${PORT}${route}`;
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeout);

    try {
        const res = await fetch(url, { signal: controller.signal });
        if (!res.ok) throw new Error(`Failed to fetch ${url}: ${res.status}`);
        return await res.text();
    } catch (err) {
        if (err instanceof Error && err.name === 'AbortError') {
            throw new Error(`Request timed out for ${url}`);
        }
        throw err;
    } finally {
        clearTimeout(timer);
    }
}

function saveHtml(route, html) {
    // map '/' -> dist/index.html, '/about' -> dist/about/index.html
    const outPath = route === '/' ? path.join(DIST, 'index.html') : path.join(DIST, route.replace(/^\//, ''), 'index.html');
    const dir = path.dirname(outPath);
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(outPath, html, 'utf8');
}

function isExportableRoute(route) {
    if (!route || route === '/_not-found') return false;
    if (route.startsWith('/_next')) return false;
    if (path.extname(route)) return false;
    return true;
}

function copyPublicAssets() {
    if (fs.existsSync(PUBLIC_DIR)) {
        fs.cpSync(PUBLIC_DIR, DIST, { recursive: true });
    }
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

    const requestedPort = process.env.PORT ? Number(process.env.PORT) : 3000;
    PORT = await findFreePort(requestedPort, 3100);
    const nextBin = path.join(ROOT, 'node_modules', 'next', 'dist', 'bin', 'next');
    if (!fs.existsSync(nextBin)) {
        console.error('Next binary not found:', nextBin);
        process.exit(1);
    }
    const server = spawn(process.execPath, [nextBin, 'start', '-p', String(PORT)], {
        cwd: ROOT,
        env: { ...process.env, PORT: String(PORT) },
        stdio: ['ignore', 'inherit', 'inherit'],
    });

    server.on('error', (error) => {
        console.error('Failed to start Next server:', error.message);
    });

    server.on('exit', (code, signal) => {
        console.log('Next server exited', { code, signal });
    });

    try {
        const url = `http://localhost:${PORT}`;
        console.log('Waiting for server at', url);
        await waitForServer(url);
        console.log('Server is reachable:', url);

        fs.rmSync(DIST, { recursive: true, force: true });
        fs.mkdirSync(DIST, { recursive: true });

        const manifest = JSON.parse(fs.readFileSync(ROUTES_MANIFEST, 'utf8'));
        const routes = (manifest.staticRoutes || [])
            .map((r) => r.page)
            .filter(Boolean)
            .filter(isExportableRoute);

        console.log('Exporting routes:', routes);

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

        copyPublicAssets();
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
