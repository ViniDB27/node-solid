import { FastifyReply, FastifyRequest } from 'fastify'

export function verifyUserRole(roleToVerify: 'ADMIN' | 'MEMBER') {
  return async (request: FastifyRequest, reqply: FastifyReply) => {
    if ((await request.user.role) !== roleToVerify)
      reqply.status(401).send({ message: 'Unauthorized.' })
  }
}
