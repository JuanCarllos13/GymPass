import { InMemoryCheckInRepository } from "@/repositories/in-memory/in-memory-checkin-repository";
import { describe, it, beforeEach, expect } from "vitest";
import { CheckInService } from "./check-in";

let checkInRepository: InMemoryCheckInRepository;
let sut: CheckInService;

describe("CheckIn Service", () => {
  beforeEach(() => {
    checkInRepository = new InMemoryCheckInRepository();
    sut = new CheckInService(checkInRepository);
  });

  it("should be able to check in", async () => {
    const { checkIn } = await sut.execute({
      gymId: "gym-01",
      userId: "user-01",
    });

    expect(checkIn.id).toEqual(expect.any(String));
  });
});
