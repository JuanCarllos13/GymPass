import { UsersRepository } from "@/repositories/users-repository";
import { User } from "@prisma/client";
import { compare } from "bcryptjs";
import { InvalidCredentialsError } from "../errors/invalid-credentials-error";
import { ResourceNotFound } from "../errors/reaource-not-found-error";

interface GetUserProfileServiceRequest {
  userId: string;
}

interface GetUserProfileServiceResponse {
  user: User;
}

export class GetUserProfileService {
  constructor(private usersRepository: UsersRepository) {}

  async execute({
    userId,
  }: GetUserProfileServiceRequest): Promise<GetUserProfileServiceResponse> {
    // Autenticação
    const user = await this.usersRepository.findById(userId);

    if (!user) {
      throw new ResourceNotFound();
    }
    return {
      user,
    };
  }
}
