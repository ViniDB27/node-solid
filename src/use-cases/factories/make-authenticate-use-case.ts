import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository'
import { AuthenticateUsecase } from '../authenticate'

export function makeAuthenticateUsecase() {
  const userRepository = new PrismaUsersRepository()
  const authenticateUsecase = new AuthenticateUsecase(userRepository)
  return authenticateUsecase
}
