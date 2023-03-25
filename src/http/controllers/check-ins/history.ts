import { z } from "zod";
import { FastifyRequest, FastifyReply } from "fastify";
import { makeFetchUserCheckInsHistoryService } from "@/services/factories/make-fetch-user-check-ins-history-service";

export async function history(request: FastifyRequest, response: FastifyReply) {
  const checkInHistoryQuerySchema = z.object({
    page: z.coerce.number().min(1).default(1),
  });

  const { page } = checkInHistoryQuerySchema.parse(request.query);

  const fetchUserCheckInsHistoryService = makeFetchUserCheckInsHistoryService();

  const { checkIns } = await fetchUserCheckInsHistoryService.execute({
    page,
    userId: request.user.sub,
  });

  return response.status(200).send({
    checkIns,
  });
}
