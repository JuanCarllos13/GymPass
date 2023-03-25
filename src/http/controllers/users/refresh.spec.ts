import request from "supertest";
import { app } from "@/app";
import { afterAll, beforeAll, expect, it } from "vitest";
import { describe } from "vitest";

describe("Refresh (e2e", () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it("Should be able to refresh token", async () => {
    await request(app.server).post("/users").send({
      name: "John Doe",
      email: "john@gmail.com",
      password: "123456",
    });

    const authResponse = await request(app.server).post("/session").send({
      email: "john@gmail.com",
      password: "123456",
    });

    const cookies = authResponse.get("Set-Cookie");

    const response = await request(app.server)
      .patch("/token/refresh")
      .set("Cookie", cookies)
      .send();

    expect(response.statusCode).toEqual(200);

    expect(response.body).toEqual({ token: expect.any(String) });
    expect(response.body).toEqual({ token: expect.any(String) });
    expect(response.get('Set-Cookie')).toEqual([
      expect.stringContaining('refreshToken=')
    ])
  });
});
