import { PrismaGymsRepository } from "@/repositories/prisma/prisma.gyms.repository";
import { CreateGymUseService } from "../Gym/create-gym";

export function makeCreateGymService() {
  const gymsRepository = new PrismaGymsRepository()
  const service = new CreateGymUseService(gymsRepository);
  return service;
}
