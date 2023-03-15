import { z } from "zod";
import { FastifyRequest, FastifyReply } from "fastify";
import { RegisterUseService } from "@/services/register/registerService";
import { PrismaUsersRepository } from "@/repositories/prisma/prisma-users-repository";
import { UserAlreadyExistsError } from "@/services/errors/user-already-exists-error";

export async function register(
  request: FastifyRequest,
  response: FastifyReply
) {
  const registerBodySchema = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string().min(6),
  });

  const { name, email, password } = registerBodySchema.parse(request.body);

  try {
    const prismaUsersRepository = new PrismaUsersRepository();
    const registerService = new RegisterUseService(prismaUsersRepository);

    await registerService.execute({ email, password, name });
  } catch (error) {
    if (error instanceof UserAlreadyExistsError) {
      return response.status(409).send({ message: error.message });
    }
    throw error;
  }

  return response.status(201).send();
}
