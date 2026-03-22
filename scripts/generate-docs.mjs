// scripts/docs-with-name.mjs
import { spawn } from "child_process";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const pkg = JSON.parse(
  fs.readFileSync(path.join(__dirname, "..", "package.json"), "utf8")
);

const name = `${pkg.name}@${pkg.version}`;
const typedocConfig = path.join(__dirname, "..", "typedoc.json");

// Resolve typedoc from background-geolocation-types so that the custom plugins
// (gitlink, mediaplayer, site) are loaded by the same TypeDoc version they were
// built against, avoiding the "TypeDoc loaded multiple times" warning.
const typedocBin = path.resolve(
  __dirname, "..", "../../background-geolocation-types/node_modules/.bin/typedoc"
);

const child = spawn(
  typedocBin,
  ["--options", typedocConfig, "--name", name],
  { stdio: "inherit" }
);

child.on("exit", (code) => {
  process.exit(code ?? 0);
});