import { z } from "zod";
import { FastifyRequest, FastifyReply } from "fastify";
import { makeCheckInService } from "@/services/factories/make-check-in-service";

export async function create(request: FastifyRequest, response: FastifyReply) {
  const createCheckInParamsSchema = z.object({
    gymId: z.string().uuid(),
  });
  const createCheckinBodySchema = z.object({
    latitude: z.number().refine((value) => {
      return Math.abs(value) <= 90;
    }),
    longitude: z.number().refine((value) => {
      return Math.abs(value) <= 180;
    }),
  });

  const { gymId } = createCheckInParamsSchema.parse(request.params);
  const { latitude, longitude } = createCheckinBodySchema.parse(request.body);

  try {
    const checkInService = makeCheckInService();

    await checkInService.execute({
      gymId,
      userId: request.user.sub,
      userLatitude: latitude,
      userLongitude: longitude,
    });
  } catch (error) {
    throw error;
  }

  return response.status(201).send();
}
