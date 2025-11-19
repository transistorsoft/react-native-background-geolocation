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

const child = spawn(
  "typedoc",
  ["--options", typedocConfig, "--name", name],
  { stdio: "inherit" }
);

child.on("exit", (code) => {
  process.exit(code ?? 0);
});