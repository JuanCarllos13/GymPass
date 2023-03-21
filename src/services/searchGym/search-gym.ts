import { GymRepository } from "@/repositories/gym-repository";
import { Gym } from "@prisma/client";
import { hash } from "bcryptjs";

interface SearchGymsServiceRequest {
  query: string;
  page: number;
}

interface SearchGymsUserServiceResponse {
  gyms: Gym[];
}

export class SearchGymsUseService {
  constructor(private gymRepository: GymRepository) {}
  async execute({
    page,
    query,
  }: SearchGymsServiceRequest): Promise<SearchGymsUserServiceResponse> {
    const gyms = await this.gymRepository.searchMany(query, page);

    return { gyms };
  }
}
