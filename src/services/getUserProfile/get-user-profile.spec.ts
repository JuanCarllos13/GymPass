import { InMemoryUsersRepository } from "@/repositories/in-memory/in-memory-users-repository";
import { hash } from "bcryptjs";
import { expect, describe, it, beforeEach } from "vitest";
import { ResourceNotFound } from "../errors/reaource-not-found-error";
import { GetUserProfileService } from "./get-user-profile";

let usersRepository: InMemoryUsersRepository;
let sut: GetUserProfileService;

describe("Get User Profile Service", () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    sut = new GetUserProfileService(usersRepository);
  });

  it("should be able to get user profuile", async () => {
    const createUser = await usersRepository.create({
      email: "johndoe@example.com",
      name: "johndoe",
      password_hash: await hash("123456", 6),
    });

    const { user } = await sut.execute({
      userId: createUser.id,
    });

    expect(user.id).toEqual(expect.any(String));
    expect(user.name).toEqual("johndoe");
  });

  it("should not be able to Get user Profile with wrong id", async () => {
    await expect(() =>
      sut.execute({
        userId: "non-existing-id",
      })
    ).rejects.toBeInstanceOf(ResourceNotFound);
  });
});
