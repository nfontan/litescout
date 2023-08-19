import Fastify from "fastify";
import config from "../config.js";
import { createFastifyLogger } from "@roarr/fastify";
import logger from "../logger.js";

import fastifyStatic from "@fastify/static";
import fastifyView from "@fastify/view";
import mustache from "mustache";
import path from "path";
import { fileURLToPath } from "url";
import pages from "./pages/index.js";
import api from "./api/index.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const fastify = Fastify({
  logger: createFastifyLogger(logger),
});

fastify.register(fastifyStatic, {
  root: path.join(__dirname, "pages", "public"),
  index: false,
  list: false,
});

fastify.register(fastifyView, {
  engine: {
    mustache,
  },
  root: path.join(__dirname, "pages", "views"),
  viewExt: "html",
});

fastify.register(pages);
fastify.register(api);

export const start = async () => {
  try {
    await fastify.listen({ port: config.port });
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

/**
 * Uses {@link https://github.com/gajus/roarr#roarr-api-adopt|Roarr.adopt} to create an async_context
 * that adds `reqId` to all logs produced in request handlers.
 */
fastify.addHook("preHandler", (request, reply, done) => {
  void logger.adopt(
    () => {
      done();
    },
    {
      requestId: request.id,
    }
  );
});

export const stop = () => fastify.close();

export const server = fastify;
