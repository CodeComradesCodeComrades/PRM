const spec = require("./openapi-specs.json");
const pkg = require("../server/package.json");
const path = require("path");
const fs = require("fs");
spec.info.version = pkg.version;
fs.writeFileSync(
  path.join(__dirname, "./openapi-specs.json"),
  JSON.stringify(spec, null, 2)
);
