var fse = require("fs-extra");
var path = require("path");

try {
  fse.copySync(path.join(process.cwd(), "./node_modules/phaser/dist/"), path.join(process.cwd(), "./www/lib/phaser/"));
} catch(e) {
  throw e;
}
