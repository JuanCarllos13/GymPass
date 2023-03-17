import { PrismaUsersRepository } from "@/repositories/prisma/prisma-users-repository";
import { RegisterUseService } from "../register/registerService";

export function makeRegisterService() {
  const prismaUsersRepository = new PrismaUsersRepository();
  const registerService = new RegisterUseService(prismaUsersRepository);
  return registerService;
}
