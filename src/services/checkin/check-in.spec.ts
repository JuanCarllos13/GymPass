import { InMemoryCheckInRepository } from "@/repositories/in-memory/in-memory-checkin-repository";
import { InMemoryGymRepository } from "@/repositories/in-memory/in-memory-gym-repository";
import { Decimal } from "@prisma/client/runtime/library";
import { describe, it, beforeEach, expect, vi, afterEach } from "vitest";
import { MaxDistanteError } from "../errors/max-distance-error";
import { MaxNumberOffCheckInError } from "../errors/max-number-off-check-ins-error";
import { CheckInService } from "./check-in";

let checkInRepository: InMemoryCheckInRepository;
let gymRepository: InMemoryGymRepository;
let sut: CheckInService;

describe("CheckIn Service", () => {
  beforeEach(async () => {
    checkInRepository = new InMemoryCheckInRepository();
    gymRepository = new InMemoryGymRepository();
    sut = new CheckInService(checkInRepository, gymRepository);

    await gymRepository.create({
      id: "gym-01",
      title: "JavaScript",
      description: "0",
      latitude: -2.9882854,
      longitude: -60.0175282,
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
    ).rejects.toBeInstanceOf(MaxNumberOffCheckInError);
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
      id: "gym-02",
      title: "JavaScript",
      description: "",
      latitude: new Decimal(-2.8434922),
      longitude: new Decimal(-60.0217862),
      phone: "",
    });

    await expect(() =>
      sut.execute({
        gymId: "gym-02",
        userId: "user-01",
        userLatitude: -2.9882854,
        userLongitude: -60.0175282,
      })
    ).rejects.toBeInstanceOf(MaxDistanteError);
  });
});
