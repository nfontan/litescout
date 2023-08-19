import { FastifyInstance } from "fastify";
import { getDeviceStatus, getEntries } from "../../db/index.js";
import { toNightscoutDevicestatus, toNightscoutEntry } from "./../dtos.js";

export default async function api(fastify: FastifyInstance) {
  fastify.get("/api/v1/entries.json", async () => {
    const entries = await getEntries();
    return entries.map((entry) => toNightscoutEntry(entry));
  });

  fastify.get("/api/v1/devicestatus.json", async () => {
    const deviceStatuses = await getDeviceStatus();
    return deviceStatuses.map((ds) => toNightscoutDevicestatus(ds));
  });

  fastify.get("/api/v1/treatments.json", async () => {
    return [];
  });

  fastify.get("/api/v1/treatments", async () => {
    return [];
  });

  fastify.get("/api/v2/properties.json", async () => {
    const [lastSgv, prevSgv] = await await getEntries({ limit: 2 });
    return {
      bgnow: {
        mean: lastSgv.sgv,
        last: lastSgv.sgv,
        mills: lastSgv.date.getTime(),
        sgvs: [lastSgv],
      },
      delta: {
        absolute: (lastSgv.sgv || 0) - (prevSgv.sgv || 0),
        elapsedMins: 5,
        interpolated: false,
        mean5MinsAgo: prevSgv.sgv,
        times: {
          recent: lastSgv.date.getTime(),
          previous: prevSgv.date.getTime(),
        },
        mgdl: 2,
        scaled: 2,
        display: "+2",
        previous: {
          mean: prevSgv.sgv,
          last: prevSgv.sgv,
          mills: prevSgv.date.getTime(),
          sgvs: [prevSgv],
        },
      },
    };
  });
  fastify.get("/api/v2/properties", async () => {
    const [lastSgv, prevSgv] = await await getEntries({ limit: 2 });
    return {
      bgnow: {
        mean: lastSgv.sgv,
        last: lastSgv.sgv,
        mills: lastSgv.date.getTime(),
        sgvs: [lastSgv],
      },
      delta: {
        absolute: (lastSgv.sgv || 0) - (prevSgv.sgv || 0),
        elapsedMins: 5,
        interpolated: false,
        mean5MinsAgo: prevSgv.sgv,
        times: {
          recent: lastSgv.date.getTime(),
          previous: prevSgv.date.getTime(),
        },
        mgdl: 2,
        scaled: 2,
        display: "+2",
        previous: {
          mean: prevSgv.sgv,
          last: prevSgv.sgv,
          mills: prevSgv.date.getTime(),
          sgvs: [prevSgv],
        },
      },
    };
  });
}
