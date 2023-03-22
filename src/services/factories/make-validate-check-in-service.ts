import { PrismaCheckInsRepository } from "@/repositories/prisma/prisma-check-in-repository";
import { ValidadeCheckInService } from "../validade-check-in/validade-check-in";

export function makeValidateCheckInService() {
  const checkInsRepository = new PrismaCheckInsRepository()
  const service = new ValidadeCheckInService(checkInsRepository);
  return service;
}
