import { PrismaCheckInsRepository } from "@/repositories/prisma/prisma-check-in-repository";
import { ValidateCheckInUseCase } from "../validade-check-in/validade-check-in";

export function makeValidateCheckInService() {
  const checkInsRepository = new PrismaCheckInsRepository()
  const service = new ValidateCheckInUseCase(checkInsRepository);
  return service;
}
