import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { makeValidateCheckInUseCase } from '@/use-cases/factories/make-validate-check-in-use-case'

export async function validateCheckIns(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const validateCheckInParamSchema = z.object({
    checkInId: z.string().uuid(),
  })
  const { checkInId } = validateCheckInParamSchema.parse(request.params)
  const validateCheckInUseCase = makeValidateCheckInUseCase()
  await validateCheckInUseCase.execute({ checkInId })
  return reply.status(204).send()
}
