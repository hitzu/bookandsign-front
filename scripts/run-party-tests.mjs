import { readdir, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { spawnSync } from "node:child_process";

const outDir = join(tmpdir(), "bookandsign-party-tests");
const compiledTestsDir = join(outDir, "__tests__");

const run = (command, args) => {
  const result = spawnSync(command, args, {
    cwd: process.cwd(),
    encoding: "utf8",
    stdio: "pipe",
  });

  if (result.stdout) process.stdout.write(result.stdout);
  if (result.stderr) process.stderr.write(result.stderr);

  if (result.status !== 0) {
    process.exitCode = result.status ?? 1;
    throw new Error(`${command} ${args.join(" ")} failed`);
  }
};

try {
  await rm(outDir, { force: true, recursive: true });

  run("node_modules/.bin/tsc", [
    "--target",
    "es2020",
    "--module",
    "commonjs",
    "--moduleResolution",
    "node",
    "--lib",
    "es2020,dom",
    "--types",
    "node",
    "--skipLibCheck",
    "--esModuleInterop",
    "--strict",
    "--noEmit",
    "false",
    "--outDir",
    outDir,
    "src/features/party/utils/mediaActions.ts",
    "src/features/party/utils/sessionShare.ts",
    "src/features/party/utils/sourceTracking.ts",
    "src/features/party/utils/__tests__/mediaActions.test.ts",
    "src/features/party/utils/__tests__/sessionShare.test.ts",
    "src/features/party/utils/__tests__/sourceTracking.test.ts",
  ]);

  const testFiles = (await readdir(compiledTestsDir))
    .filter((file) => file.endsWith(".test.js"))
    .map((file) => join(compiledTestsDir, file));

  run("node", ["--test", ...testFiles]);
} finally {
  await rm(outDir, { force: true, recursive: true });
}
