import request from "supertest";
import { app } from "@/app";
import { afterAll, beforeAll, expect, it } from "vitest";
import { describe } from "vitest";
import { createAndAuthenticateUser } from "@/utils/test/create-and-authenticate-user";

describe("Create (e2e)", () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it("Should be able to create a gym", async () => {
    const { token } = await createAndAuthenticateUser(app, true);

    const response = await request(app.server)
      .post("/gyms")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Javascript gym",
        description: "Some Description",
        phone: "1238934",
        latitude: -2.9882854,
        longitude: -60.0175282,
      });

    expect(response.statusCode).toEqual(201);
  });
});
