import { FastifyRequest, FastifyReply } from "fastify";

export async function verifyJWT(
  request: FastifyRequest,
  response: FastifyReply
) {
 try {
  await request.jwtVerify(); // Verify token
 } catch (error) {
  return response.status(401).send({message: 'Unauthorized'})
  
 }
}
