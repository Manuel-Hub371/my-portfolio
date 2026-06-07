const { execSync } = require("child_process");

const ports = [3000, 3001, 3002];

for (const port of ports) {
  try {
    if (process.platform === "win32") {
      const out = execSync(
        `netstat -ano | findstr :${port}`,
        { encoding: "utf8", stdio: ["pipe", "pipe", "ignore"] }
      );
      const pids = new Set();
      for (const line of out.split("\n")) {
        const parts = line.trim().split(/\s+/);
        const pid = parts[parts.length - 1];
        if (pid && /^\d+$/.test(pid) && pid !== "0") pids.add(pid);
      }
      for (const pid of pids) {
        try {
          execSync(`taskkill /F /PID ${pid}`, { stdio: "ignore" });
          console.log(`Freed port ${port} (PID ${pid})`);
        } catch {
          /* ignore */
        }
      }
    }
  } catch {
    /* port not in use */
  }
}
