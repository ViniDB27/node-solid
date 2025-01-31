import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { makeSearchGymUsecase } from '@/use-cases/factories/make-search-gyms-use-case'

export async function searchGym(request: FastifyRequest, reply: FastifyReply) {
  const searchGymQueryParams = z.object({
    query: z.string(),
    page: z.coerce.number().min(1).default(1),
  })
  const { query, page } = searchGymQueryParams.parse(request.query)
  const searchGymUsecase = makeSearchGymUsecase()
  const { gyms } = await searchGymUsecase.execute({ query, page })
  return reply.status(200).send({ gyms })
}
