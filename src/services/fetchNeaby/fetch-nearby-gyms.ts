import { GymRepository } from "@/repositories/gym-repository";
import { Gym } from "@prisma/client";

interface FetchNearbyGymsServiceRequest {
  userLatitude: number;
  userLongitude: number;
}

interface FetchNearbyGymsUserServiceResponse {
  gyms: Gym[];
}

export class FetchNearbyGymsUseService {
  constructor(private gymRepository: GymRepository) {}
  async execute({
    userLongitude,
    userLatitude,
  }: FetchNearbyGymsServiceRequest): Promise<FetchNearbyGymsUserServiceResponse> {
    const gyms = await this.gymRepository.findManyNearby({
      latitude: userLatitude,
      longitude: userLongitude,
    });

    return { gyms };
  }
}
