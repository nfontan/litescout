import "dotenv/config";
import * as server from "./server/index.js";
import fetcher from "./fetch.js";

server.start();
fetcher.start();
