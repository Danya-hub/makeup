const path = require("path");
const ROOT = path.resolve(__dirname, "../");

module.exports = {
	root: ROOT,
	build: path.join(ROOT, "build"),
	public: path.join(ROOT, "public"),
	src: path.join(ROOT, "src"),
};
