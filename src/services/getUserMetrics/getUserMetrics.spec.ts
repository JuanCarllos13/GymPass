import { InMemoryCheckInRepository } from "@/repositories/in-memory/in-memory-checkin-repository";
import { describe, it, beforeEach, expect } from "vitest";
import { GetUserMetricsService } from "./get-user-metrics";

let checkInRepository: InMemoryCheckInRepository;
let sut: GetUserMetricsService;

describe("Get User Metrics Service", () => {
  beforeEach(async () => {
    checkInRepository = new InMemoryCheckInRepository();
    sut = new GetUserMetricsService(checkInRepository);
  });

  it("should be able to get check-ins count from metrics", async () => {
    await checkInRepository.create({
      gym_id: "gym-01",
      user_id: "user-01",
    });

    await checkInRepository.create({
      gym_id: "gym-02",
      user_id: "user-01",
    });

    const { checkInsCount } = await sut.execute({
      userId: "user-01",
    });

    expect(checkInsCount).toEqual(2);
  });
});
