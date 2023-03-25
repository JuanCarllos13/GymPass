import { z } from "zod";
import { FastifyRequest, FastifyReply } from "fastify";
import { makeCreateGymService } from "@/services/factories/make-create-gym-service";
import { makeSearchGymsService } from "@/services/factories/make-search-gyms-service";
import { makeFetchNearbyGymsService } from "@/services/factories/make-fetch-nearby-gyms-service";

export async function nearby(request: FastifyRequest, response: FastifyReply) {
  const nearbyGymsQuerySchema = z.object({
    latitude: z.number().refine((value) => {
      return Math.abs(value) <= 90;
    }),
    longitude: z.number().refine((value) => {
      return Math.abs(value) <= 180;
    }),
  });

  const { latitude, longitude } = nearbyGymsQuerySchema.parse(request.query);

  const fetchNearbyGyms = makeFetchNearbyGymsService();

  const { gyms } = await fetchNearbyGyms.execute({
    userLatitude: latitude,
    userLongitude: longitude,
  });

  return response.status(201).send({
    gyms,
  });
}
