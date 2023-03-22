import { PrismaGymsRepository } from "@/repositories/prisma/prisma.gyms.repository";
import { SearchGymsUseService } from "../searchGym/search-gym";

export function makeSearchGymsService() {
  const gymsRepository = new PrismaGymsRepository()
  const service = new SearchGymsUseService(gymsRepository);
  return service;
}
