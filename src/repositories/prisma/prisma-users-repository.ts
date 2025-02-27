import { prisma } from '@/lib/prisma'
import { Prisma } from '@prisma/client'
import { UsersRepository } from '../users-repository'

export class PrismaUsersRepository implements UsersRepository {
  async create(data: Prisma.UserCreateInput) {
    return prisma.user.create({ data })
  }

  async findById(userId: string) {
    return await prisma.user.findUnique({ where: { id: userId } })
  }

  async findByEmail(email: string) {
    return await prisma.user.findUnique({ where: { email } })
  }
}
