import { z } from "zod";
import { FastifyRequest, FastifyReply } from "fastify";
import { makeCreateGymService } from "@/services/factories/make-create-gym-service";
import { makeSearchGymsService } from "@/services/factories/make-search-gyms-service";

export async function search(request: FastifyRequest, response: FastifyReply) {
  const searchGymsQuerySchema = z.object({
    query: z.string(),
    page: z.coerce.number().min(1).default(1),
  });

  const { page, query } = searchGymsQuerySchema.parse(request.query);

  const searchGyms = makeSearchGymsService();

  const { gyms } = await searchGyms.execute({ page, query });

  return response.status(200).send({
    gyms,
  });
}
