import { PrismaCheckInsRepository } from "@/repositories/prisma/prisma-check-in-repository";
import { FetchUserCheckInHistoryService } from "../fetchMember/fetch-user-check-in-history";

export function makeFetchUserCheckInsHistoryService() {
  const checkInsRepository = new PrismaCheckInsRepository()
  const service = new FetchUserCheckInHistoryService(checkInsRepository);
  return service;
}
