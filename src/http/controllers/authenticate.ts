import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { InvalidCredentialsError } from '@/use-cases/errors/invalid-credentials-error'
import { makeAuthenticateUsecase } from '@/use-cases/factories/make-authenticate-use-case'

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
    const authenticateUsecase = makeAuthenticateUsecase()
    await authenticateUsecase.execute({ email, password })
  } catch (error) {
    if (error instanceof InvalidCredentialsError) {
      return reply.status(400).send({ message: error.message })
    }

    throw error
  }
  return reply.status(200).send()
}
