import { CheckInRepository } from "@/repositories/check-ins-repository";
import { PrismaCheckInsRepository } from "@/repositories/prisma/prisma-check-in-repository";
import { CheckIn } from "@prisma/client";
import dayjs from "dayjs";
import { LateCheckInValidationError } from "../errors/late-check-in-validation-error";
import { ResourceNotFound } from "../errors/reaource-not-found-error";

interface ValidateCheckInUseCaseRequest {
  checkInId: string;
}

interface ValidateCheckInUseCaseResponse {
  checkIn: CheckIn;
}

export class ValidateCheckInUseCase {
  constructor(private checkInsRepository: PrismaCheckInsRepository) {}

  async execute({
    checkInId,
  }: ValidateCheckInUseCaseRequest): Promise<ValidateCheckInUseCaseResponse> {
    const checkIn = await this.checkInsRepository.findById(checkInId);

    if (!checkIn) {
      throw new ResourceNotFound();
    }

    const distanceInMinutesFromCheckInCreation = dayjs(new Date()).diff(
      checkIn.created_at,
      "minutes"
    );

    if (distanceInMinutesFromCheckInCreation > 20) {
      throw new LateCheckInValidationError();
    }

    checkIn.validated_at = new Date();

    await this.checkInsRepository.save(checkIn);

    return {
      checkIn,
    };
  }
}
