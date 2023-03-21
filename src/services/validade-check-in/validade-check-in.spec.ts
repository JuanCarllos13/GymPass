import { InMemoryCheckInRepository } from "@/repositories/in-memory/in-memory-checkin-repository";
import { describe, it, beforeEach, expect, vi, afterEach } from "vitest";
import { ResourceNotFound } from "../errors/reaource-not-found-error";
import { ValidadeCheckInService } from "./validade-check-in";

let checkInRepository: InMemoryCheckInRepository;
let sut: ValidadeCheckInService;

describe("Validade check-in Service", () => {
  beforeEach(async () => {
    checkInRepository = new InMemoryCheckInRepository();
    sut = new ValidadeCheckInService(checkInRepository);

    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("should be able to validade the check-in", async () => {
    const createCheckIn = await checkInRepository.create({
      gym_id: "gym-01",
      user_id: "user-01",
    });

    const { checkIn } = await sut.execute({
      checkInId: createCheckIn.id,
    });

    expect(checkIn.validated_at).toEqual(expect.any(Date));
    expect(checkInRepository.items[0].validated_at).toEqual(expect.any(Date));
  });

  it("should not be able to validade an inexistent check-in", async () => {
    await expect(() =>
      sut.execute({
        checkInId: "inexistent-check-in-id",
      })
    ).rejects.toBeInstanceOf(ResourceNotFound);
  });

  it("should not be able to validate the check-in after 20 minutes of is creation", async () => {
    vi.setSystemTime(new Date(2023, 0, 1, 13, 40));

    const createCheckIn = await checkInRepository.create({
      gym_id: "gym-01",
      user_id: "user-01",
    });

    const twentyOneMinutesInMs = 1000 * 60 * 21;

    vi.advanceTimersByTime(twentyOneMinutesInMs);

    await expect(() =>
      sut.execute({
        checkInId: createCheckIn.id,
      })
    ).rejects.toBeInstanceOf(Error);
  });
});
