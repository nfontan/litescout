import { Roarr } from "roarr";
import p from "./package.json" assert { type: "json" };

const logger = Roarr.child({
  package: p.name,
});

export default logger;
