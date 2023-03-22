import { PrismaCheckInsRepository } from "@/repositories/prisma/prisma-check-in-repository";
import { GetUserMetricsService } from "../getUserMetrics/get-user-metrics";

export function makeGetUserMetricsService() {
  const checkInsRepository = new PrismaCheckInsRepository()
  const service = new GetUserMetricsService(checkInsRepository);
  return service;
}
