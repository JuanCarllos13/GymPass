import { CheckInRepository } from "@/repositories/check-ins-repository";
import { GymRepository } from "@/repositories/gym-repository";
import { getDistanceBetweenCoordinates } from "@/utils/get-distance-between-coordinate";
import { CheckIn } from "@prisma/client";
import { MaxDistanteError } from "../errors/max-distance-error";
import { MaxNumberOffCheckInError } from "../errors/max-number-off-check-ins-error";
import { ResourceNotFound } from "../errors/reaource-not-found-error";

interface CheckInServiceRequest {
  userId: string;
  gymId: string;
  userLatitude: number;
  userLongitude: number;
}

interface CheckInServiceResponse {
  checkIn: CheckIn;
}

export class CheckInService {
  constructor(
    private checkInsRepository: CheckInRepository,
    private gymRepository: GymRepository
  ) {}

  async execute({
    gymId,
    userId,
    userLatitude,
    userLongitude,
  }: CheckInServiceRequest): Promise<CheckInServiceResponse> {
    const gym = await this.gymRepository.findById(gymId);

    if (!gym) {
      throw new ResourceNotFound();
    }

    // calculate distance between user and gym

    const distance = getDistanceBetweenCoordinates(
      { latitude: userLatitude, longitude: userLongitude },
      { latitude: gym.latitude.toNumber(), longitude: gym.longitude.toNumber() }
    );

    const MAX_DISTANCE_KILOMETERS = 0.1;

    if (distance > MAX_DISTANCE_KILOMETERS) {
      throw new MaxDistanteError();
    }

    const checkInOnSameDay = await this.checkInsRepository.findByIdDate(
      userId,
      new Date()
    );

    if (checkInOnSameDay) {
      throw new MaxNumberOffCheckInError();
    }

    const checkIn = await this.checkInsRepository.create({
      gym_id: gymId,
      user_id: userId,
    });

    return {
      checkIn,
    };
  }
}
