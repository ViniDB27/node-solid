import { PrismaGymsRepository } from '@/repositories/prisma/prisma-gyms-repository'
import { CreateGymUsecase } from '../create-gym'

export function makeCreateGymUseCase() {
  const gymsRepository = new PrismaGymsRepository()
  const createGymUsecase = new CreateGymUsecase(gymsRepository)
  return createGymUsecase
}
