import { PrismaGymsRepository } from '@/repositories/prisma/prisma-gyms-repository'
import { FetchNearbyGemsUsecase } from '../fetch-nearby-gyms'

export function makeFetchNearbyGemsUsecase() {
  const gymsRepository = new PrismaGymsRepository()
  const fetchNearbyGemsUsecase = new FetchNearbyGemsUsecase(gymsRepository)
  return fetchNearbyGemsUsecase
}
