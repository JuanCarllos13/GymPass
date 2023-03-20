import { InMemoryCheckInRepository } from "@/repositories/in-memory/in-memory-checkin-repository";
import { describe, it, beforeEach, expect } from "vitest";
import { FetchUserCheckInHistoryService } from "./fetch-user-check-in-history";

let checkInRepository: InMemoryCheckInRepository;
let sut: FetchUserCheckInHistoryService;

describe("Fetch user CheckIn history Service", () => {
  beforeEach(async () => {
    checkInRepository = new InMemoryCheckInRepository();
    sut = new FetchUserCheckInHistoryService(checkInRepository);
  });

  it("should be able to fetch check-in history", async () => {
    await checkInRepository.create({
      gym_id: "gym-01",
      user_id: "user-01",
    });

    await checkInRepository.create({
      gym_id: "gym-02",
      user_id: "user-01",
    });

    const { checkIns } = await sut.execute({
      userId: "user-01",
      page: 1,
    });

    expect(checkIns).toHaveLength(2);
    expect(checkIns).toEqual([
      expect.objectContaining({ gym_id: "gym-01" }),
      expect.objectContaining({ gym_id: "gym-02" }),
    ]);
  });

  it("should be able to fetch paginated check-in history", async () => {
    for (let i = 1; i <= 22; i++) {
      await checkInRepository.create({
        gym_id: `gym-${i}`,
        user_id: "user-01",
      });
    }

    const { checkIns } = await sut.execute({
      userId: "user-01",
      page: 2,
    });

    expect(checkIns).toHaveLength(2);
    expect(checkIns).toEqual([
      expect.objectContaining({ gym_id: "gym-21" }),
      expect.objectContaining({ gym_id: "gym-22" }),
    ]);
  });
});
