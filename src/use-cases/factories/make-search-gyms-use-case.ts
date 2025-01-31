import { SearchGymUsecase } from '../search-gyms'
import { PrismaGymsRepository } from '@/repositories/prisma/prisma-gyms-repository'

export function makeSearchGymUsecase() {
  const gymsRepository = new PrismaGymsRepository()
  const searchGymUsecase = new SearchGymUsecase(gymsRepository)
  return searchGymUsecase
}
