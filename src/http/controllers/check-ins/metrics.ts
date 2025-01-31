import { FastifyReply, FastifyRequest } from 'fastify'
import { makeGetUserMetricsUsecase } from '@/use-cases/factories/make-get-user-metrics-use-case'

export async function metricsCheckIns(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const getUserMetricsUsecase = makeGetUserMetricsUsecase()
  const metrics = await getUserMetricsUsecase.execute({
    userId: request.user.sub,
  })
  return reply.status(201).send({ metrics })
}
