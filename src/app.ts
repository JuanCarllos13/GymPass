import fastifyJwt from "@fastify/jwt";
import fastify from "fastify";
import { ZodError } from "zod";
import { env } from "./env";
import { gymsRoutes } from "./http/controllers/gyms/route";
import { usersRoutes } from "./http/controllers/users/routes";

export const app = fastify();

app.register(fastifyJwt, {
  secret: env.JWT_SECRET,
});

app.register(usersRoutes);
app.register(gymsRoutes);

app.setErrorHandler((error, _request, response) => {
  if (error instanceof ZodError) {
    return response
      .status(400)
      .send({ message: "Validation error.", issues: error.format() });
  }

  if (env.NODE_ENV !== "production") {
    console.log(error);
  } else {
    // TODO
  }

  return response.status(500).send({ message: "Internal server error" });
});
