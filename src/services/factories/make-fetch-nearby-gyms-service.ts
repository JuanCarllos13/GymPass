import { PrismaGymsRepository } from "@/repositories/prisma/prisma.gyms.repository";
import { FetchNearbyGymsUseService } from "../fetchNeaby/fetch-nearby-gyms";

export function makeFetchNearbyGymsService() {
  const gymsRepository = new PrismaGymsRepository()
  const service = new FetchNearbyGymsUseService(gymsRepository);
  return service;
}
