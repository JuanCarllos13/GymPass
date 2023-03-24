import request from "supertest";
import { app } from "@/app";
import { afterAll, beforeAll, expect, it } from "vitest";
import { describe } from "vitest";

describe("Register (e2e", () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it("Should be able to register", async () => {
    const response = await request(app.server).post("/users").send({
      name: "John Doe",
      email: "john@gmail.com",
      password: "123456",
    });

    expect(response.statusCode).toEqual(201);
  });
});
