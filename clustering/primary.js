const cluster = require("cluster");
const { os } = require("os");
const { dirname } = require("path");
const { fileURLToPath } = require("url");

const __dirname = dirname(fileURLToPath(import.meta.url));

const cpuCount = os.cups().length;

console.log("The total number of cpus is ", cpuCount);
console.log("The primary process id is ", process.pid);

cluster.setupPrimary({
  exec: __dirname + "/clustering/index.js",
});

for (let i = 0; i < cpuCount; i++) {
  cluster.fork();
}
