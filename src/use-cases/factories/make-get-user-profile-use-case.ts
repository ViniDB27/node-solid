import { GetUserProfileUsecase } from '../get-user-profile'
import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository'

export function makeGetUserProfileUsecase() {
  const userRepository = new PrismaUsersRepository()
  const getUserProfileUsecase = new GetUserProfileUsecase(userRepository)
  return getUserProfileUsecase
}
