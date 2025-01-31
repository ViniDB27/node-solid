import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { makeFetchNearbyGemsUsecase } from '@/use-cases/factories/make-fetch-nearby-gyms-use-case'

export async function nearbyGym(request: FastifyRequest, reply: FastifyReply) {
  const getchNearbyGymQueryParams = z.object({
    latitude: z.coerce.number().refine((value) => {
      return Math.abs(value) <= 90
    }),
    longitude: z.coerce.number().refine((value) => {
      return Math.abs(value) <= 180
    }),
  })
  const { latitude, longitude } = getchNearbyGymQueryParams.parse(request.query)
  const fetchetchNearbyGemsUsecase = makeFetchNearbyGemsUsecase()
  const { gyms } = await fetchetchNearbyGemsUsecase.execute({
    userLatitude: latitude,
    userLongitude: longitude,
  })
  return reply.status(200).send({ gyms })
}
