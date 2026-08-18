const fs = require("fs");
const path = require("path");

const outDir = path.join(__dirname, "..", "out");

if (!fs.existsSync(outDir)) {
  process.exit(0);
}

for (const name of fs.readdirSync(outDir)) {
  if (!name.endsWith(".html") || name === "index.html" || name === "404.html") {
    continue;
  }

  const base = name.slice(0, -5);
  const htmlPath = path.join(outDir, name);
  const folder = path.join(outDir, base);

  if (!fs.existsSync(folder) || !fs.statSync(folder).isDirectory()) {
    continue;
  }

  const dest = path.join(folder, "index.html");
  fs.copyFileSync(htmlPath, dest);
  console.log("Wrote", path.relative(outDir, dest));
}
