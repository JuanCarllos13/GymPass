import { z } from "zod";
import { FastifyRequest, FastifyReply } from "fastify";
import { makeCreateGymService } from "@/services/factories/make-create-gym-service";

export async function create(request: FastifyRequest, response: FastifyReply) {
  const createGymBodySchema = z.object({
    title: z.string(),
    description: z.string().nullable(),
    phone: z.string().nullable(),
    latitude: z.number().refine((value) => {
      return Math.abs(value) <= 90;
    }),
    longitude: z.number().refine((value) => {
      return Math.abs(value) <= 180;
    }),
  });

  const { description, latitude, longitude, phone, title } =
    createGymBodySchema.parse(request.body);

  try {
    const createGym = makeCreateGymService();

    await createGym.execute({ description, latitude, longitude, phone, title });
  } catch (error) {
    throw error;
  }

  return response.status(201).send();
}
