import { z } from "zod";
import { FastifyRequest, FastifyReply } from "fastify";
import { makeFetchUserCheckInsHistoryService } from "@/services/factories/make-fetch-user-check-ins-history-service";
import { makeGetUserMetricsService } from "@/services/factories/make-get-user-metrics-service";

export async function metrics(request: FastifyRequest, response: FastifyReply) {
  const getUserMetricsService = makeGetUserMetricsService();

  const { checkInsCount } = await getUserMetricsService.execute({
    userId: request.user.sub,
  });

  return response.status(201).send({
    checkInsCount,
  });
}
