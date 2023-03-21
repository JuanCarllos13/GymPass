import { CheckInRepository } from "@/repositories/check-ins-repository";
import { CheckIn } from "@prisma/client";
import dayjs from "dayjs";
import { LateCheckInValidationError } from "../errors/late-check-in-validation-error";
import { ResourceNotFound } from "../errors/reaource-not-found-error";

interface ValidadeCheckInServiceRequest {
  checkInId: string;
}

interface ValidadeCheckInServiceResponse {
  checkIn: CheckIn;
}

export class ValidadeCheckInService {
  constructor(private checkInsRepository: CheckInRepository) {}

  async execute({
    checkInId,
  }: ValidadeCheckInServiceRequest): Promise<ValidadeCheckInServiceResponse> {
    const checkIn = await this.checkInsRepository.findById(checkInId);

    if (!checkIn) {
      throw new ResourceNotFound();
    }

    const distanceInMinutesFromCheckInCreation = dayjs(new Date()).diff(
      checkIn.created_at,
      "minute"
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
