import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository'
import { RegisterUsecase } from '../register'

export function makeRegisterUsecase() {
  const userRepository = new PrismaUsersRepository()
  const registerUsecase = new RegisterUsecase(userRepository)
  return registerUsecase
}
