import request from "supertest";
import { app } from "@/app";
import { afterAll, beforeAll, expect, it } from "vitest";
import { describe } from "vitest";
import { createAndAuthenticateUser } from "@/utils/test/create-and-authenticate-user";

describe("Search Gyms (e2e)", () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it("Should be able to search gyms by title", async () => {
    const { token } = await createAndAuthenticateUser(app);

    await request(app.server)
      .post("/gyms")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Javascript gym",
        description: "Some Description",
        phone: "1238934",
        latitude: -2.9882854,
        longitude: -60.0175282,
      });

    await request(app.server)
      .post("/gyms")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "TypeScript gym",
        description: "Some Description",
        phone: "1238934",
        latitude: -2.9882854,
        longitude: -60.0175282,
      });

    const response = await request(app.server)
      .get("/gyms/search")
      .query({ query: "Javascript" })
      .set("Authorization", `Bearer ${token}`)
      .send();

    expect(response.statusCode).toEqual(200);
    expect(response.body.gyms).toHaveLength(1);
    expect(response.body.gyms).toEqual([
      expect.objectContaining({
        title: "Javascript gym",
      }),
    ]);
  });
});
