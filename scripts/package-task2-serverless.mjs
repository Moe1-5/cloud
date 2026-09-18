import { cp, mkdir, rm, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { execFileSync } from "node:child_process";

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(scriptDirectory, "..");
const artifactDirectory = path.join(projectRoot, "artifacts", "task2-serverless");
const backendDistDirectory = path.join(projectRoot, "apps", "backend", "dist");
const sharedPackageDirectory = path.join(projectRoot, "packages", "shared");
const artifactSharedDirectory = path.join(artifactDirectory, "shared");
const installedSharedDirectory = path.join(
  artifactDirectory,
  "node_modules",
  "@ddac",
  "shared"
);
const npmCommand = process.platform === "win32" ? "npm.cmd" : "npm";

await rm(artifactDirectory, { recursive: true, force: true });
await mkdir(artifactDirectory, { recursive: true });
await cp(backendDistDirectory, artifactDirectory, { recursive: true });
await cp(sharedPackageDirectory, artifactSharedDirectory, { recursive: true });

await writeFile(
  path.join(artifactDirectory, "package.json"),
  `${JSON.stringify(
    {
      private: true,
      type: "module",
      dependencies: {
        "@aws-sdk/client-dynamodb": "^3.864.0",
        "@aws-sdk/client-sns": "^3.864.0",
        "@aws-sdk/lib-dynamodb": "^3.864.0",
        "@ddac/shared": "file:./shared",
        dotenv: "^16.6.1",
        zod: "^3.25.76"
      }
    },
    null,
    2
  )}\n`,
  "utf8"
);

execFileSync(npmCommand, ["install", "--omit=dev", "--ignore-scripts", "--package-lock=false"], {
  cwd: artifactDirectory,
  stdio: "inherit",
  shell: process.platform === "win32"
});

// npm links local file dependencies in workspace-compatible environments. ZIP archives do not
// preserve Windows junction targets, so materialize the internal package before deployment.
await rm(installedSharedDirectory, { recursive: true, force: true });
await mkdir(path.dirname(installedSharedDirectory), { recursive: true });
await cp(artifactSharedDirectory, installedSharedDirectory, { recursive: true });

console.log(`Task 2 Lambda package prepared in ${artifactDirectory}`);
