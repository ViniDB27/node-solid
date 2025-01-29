import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { RegisterUsecase } from '@/use-cases/register'
import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository'
import { UserAlreadyExistError } from '@/use-cases/errors/user.already-exist-error'

export async function registerUser(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const registerBody = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string().min(6),
  })
  const { name, email, password } = registerBody.parse(request.body)
  try {
    const userRepository = new PrismaUsersRepository()
    const registerUsecase = new RegisterUsecase(userRepository)
    await registerUsecase.execute({ name, email, password })
  } catch (error) {
    if (error instanceof UserAlreadyExistError) {
      return reply.status(409).send({ message: error.message })
    }

    throw error
  }
  return reply.status(201).send()
}
