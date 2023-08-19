import { FastifyInstance } from "fastify";
import { getEntries, getDeviceStatus } from "../../db/index.js";
import { minutesAgo } from "../../utils.js";

export interface DashboardData {
  currentSgv: string;
  diff: string;
  time: string;
  lastEntryAgo: string;
  battery: string;
  storage: string;
  svg?: {
    points: [{ x: number; y: number; date: Date }];
  };
}

async function getDashboardData(): Promise<DashboardData> {
  const [lastSgv, prevSgv] = await getEntries({ limit: 2 });
  const [deviceStatus] = await getDeviceStatus({ limit: 1 });
  const diffNbr = lastSgv.sgv && prevSgv.sgv ? lastSgv.sgv - prevSgv.sgv : null;
  return {
    currentSgv: lastSgv.sgv?.toString() || "",
    diff: diffNbr ? `${diffNbr > 0 ? "+" : ""}${diffNbr}` : "n/a",
    time: new Date().toLocaleTimeString("es-AR"),
    lastEntryAgo: minutesAgo(lastSgv.date),
    battery: deviceStatus.uploaderBattery?.toString() || "n/a",
    storage: "?",
  };
}

export default async function pages(fastify: FastifyInstance) {
  fastify.get("/", async (req, reply) => {
    const data = await getDashboardData();
    data.svg = {
      points: [{ x: 100, y: 100, date: new Date() }],
    };
    return reply.view("dashboard", data);
  });
  fastify.get("/chart.svg", async (req, reply) => {
    const data = await getDashboardData();

    return reply.view("chart", data);
  });
}
