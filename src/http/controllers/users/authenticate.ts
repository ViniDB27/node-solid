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
    const { user } = await authenticateUsecase.execute({ email, password })
    const token = await reply.jwtSign(
      {
        role: user.role,
      },
      {
        sign: {
          sub: user.id,
        },
      },
    )

    const refreshToken = await reply.jwtSign(
      {
        role: user.role,
      },
      {
        sign: {
          sub: user.id,
          expiresIn: '7d',
        },
      },
    )

    return reply
      .setCookie('refreshToken', refreshToken, {
        path: '/',
        secure: true,
        sameSite: true,
        httpOnly: true,
      })
      .status(200)
      .send({ token })
  } catch (error) {
    if (error instanceof InvalidCredentialsError) {
      return reply.status(400).send({ message: error.message })
    }

    throw error
  }
}
