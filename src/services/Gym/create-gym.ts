import { prisma } from "@/lib/prisma";
import { GymRepository } from "@/repositories/gym-repository";
import { Gym } from "@prisma/client";
import { hash } from "bcryptjs";
import { UserAlreadyExistsError } from "../errors/user-already-exists-error";

interface CreateGymServiceRequest {
  title: string;
  description: string | null;
  phone: string | null;
  latitude: number;
  longitude: number;
}

interface CreateGymUserServiceResponse {
  gym: Gym;
}

export class CreateGymUseService {
  constructor(private gymRepository: GymRepository) {}
  async execute({
    description,
    title,
    phone,
    latitude,
    longitude,
  }: CreateGymServiceRequest): Promise<CreateGymUserServiceResponse> {
    const gym = await this.gymRepository.create({
      latitude,
      longitude,
      description,
      title,
      phone,
    });

    return { gym };
  }
}
