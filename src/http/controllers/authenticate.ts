import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository'
import { AuthenticateUsecase } from '@/use-cases/authenticate'
import { InvalidCredentialsError } from '@/use-cases/errors/invalid-credentials-error'

export async function autehnticate(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const registerBody = z.object({
    email: z.string().email(),
    password: z.string().min(6),
  })
  const { email, password } = registerBody.parse(request.body)
  try {
    const userRepository = new PrismaUsersRepository()
    const authenticateUsecase = new AuthenticateUsecase(userRepository)
    await authenticateUsecase.execute({ email, password })
  } catch (error) {
    if (error instanceof InvalidCredentialsError) {
      return reply.status(400).send({ message: error.message })
    }

    throw error
  }
  return reply.status(200).send()
}
