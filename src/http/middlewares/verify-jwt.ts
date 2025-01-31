import { FastifyReply, FastifyRequest } from 'fastify'

export async function verifyJWT(request: FastifyRequest, reqply: FastifyReply) {
  try {
    await request.jwtVerify()
  } catch {
    reqply.status(401).send({ message: 'Unauthorized.' })
  }
}
