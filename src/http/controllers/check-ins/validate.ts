import { z } from "zod";
import { FastifyRequest, FastifyReply } from "fastify";
import { makeValidateCheckInService } from "@/services/factories/make-validate-check-in-service";

export async function validate(
  request: FastifyRequest,
  response: FastifyReply
) {
  const validateCheckInParamsSchema = z.object({
    checkInId: z.string().uuid(),
  });

  const { checkInId } = validateCheckInParamsSchema.parse(request.params);

  try {
    const validadeCheckService = makeValidateCheckInService();

    await validadeCheckService.execute({
      checkInId,
    });
  } catch (error) {
    throw error;
  }

  return response.status(204).send();
}
