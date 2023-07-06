import path from "path";
import {
	fileURLToPath,
} from "url";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);
const ROOT = path.resolve(dirname, "../../");

const commonPaths = {
	root: ROOT,
	build: path.join(ROOT, "build"),
	publicPath: path.join(ROOT, "public"),
	src: path.join(ROOT, "src"),
	filename,
	dirname,
};

export default commonPaths;