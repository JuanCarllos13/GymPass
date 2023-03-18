import { InMemoryCheckInRepository } from "@/repositories/in-memory/in-memory-checkin-repository";
import { InMemoryGymRepository } from "@/repositories/in-memory/in-memory-gym-repository";
import { Decimal } from "@prisma/client/runtime/library";
import { describe, it, beforeEach, expect, vi, afterEach } from "vitest";
import { CheckInService } from "./check-in";

let checkInRepository: InMemoryCheckInRepository;
let gymRepository: InMemoryGymRepository;
let sut: CheckInService;

describe("CheckIn Service", () => {
  beforeEach(() => {
    checkInRepository = new InMemoryCheckInRepository();
    gymRepository = new InMemoryGymRepository();
    sut = new CheckInService(checkInRepository, gymRepository);

    gymRepository.items.push({
      id: "gym-01",
      title: "JavaScript",
      description: "0",
      latitude: new Decimal(-2.9882854),
      longitude: new Decimal(-60.0175282),
      phone: "",
    });

    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("should be able to check in", async () => {
    vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0));

    const { checkIn } = await sut.execute({
      gymId: "gym-01",
      userId: "user-01",
      userLatitude: -2.9882854,
      userLongitude: -60.0175282,
    });

    expect(checkIn.id).toEqual(expect.any(String));
  });

  it("should not be able to check in twice in the same  day", async () => {
    vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0));
    await sut.execute({
      gymId: "gym-01",
      userId: "user-01",
      userLatitude: -2.9882854,
      userLongitude: -60.0175282,
    });

    await expect(() =>
      sut.execute({
        gymId: "gym-01",
        userId: "user-01",
        userLatitude: -2.9882854,
        userLongitude: -60.0175282,
      })
    ).rejects.toBeInstanceOf(Error);
  });

  it("should be able to check in twice but in different days", async () => {
    vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0));

    await sut.execute({
      gymId: "gym-01",
      userId: "user-01",
      userLatitude: -2.9882854,
      userLongitude: -60.0175282,
    });
    vi.setSystemTime(new Date(2022, 0, 21, 8, 0, 0));

    const { checkIn } = await sut.execute({
      gymId: "gym-01",
      userId: "user-01",
      userLatitude: -2.9882854,
      userLongitude: -60.0175282,
    });
    expect(checkIn.id).toEqual(expect.any(String));
  });

  it("should not be able to check in on distant gym", async () => {
    gymRepository.items.push({
      id: "gym-01",
      title: "JavaScript",
      description: "0",
      latitude: new Decimal(-2.8434922),
      longitude: new Decimal(-60.0217862),
      phone: "",
    });

    await expect(() =>
      sut.execute({
        gymId: "gym-01",
        userId: "user-01",
        userLatitude: -2.9882854,
        userLongitude: -60.0175282,
      })
    );
  });
});
