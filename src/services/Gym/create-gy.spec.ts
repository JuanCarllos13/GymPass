import { InMemoryGymRepository } from "@/repositories/in-memory/in-memory-gym-repository";
import { expect, describe, it, beforeEach } from "vitest";
import { CreateGymUseService } from "./create-gym";

let gymRepository: InMemoryGymRepository;
let sut: CreateGymUseService;

describe("Create Gym", () => {
  beforeEach(() => {
    gymRepository = new InMemoryGymRepository();
    sut = new CreateGymUseService(gymRepository);
  });

  it("should be able to create gym", async () => {
    const { gym } = await sut.execute({
      title: "JavaScript Gym",
      description: null,
      latitude: -2.9882854,
      longitude: -60.0175282,
      phone: null,
    });

    expect(gym.id).toEqual(expect.any(String));
  });
});
