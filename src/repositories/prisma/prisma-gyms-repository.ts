import { Gym, Prisma } from '@prisma/client'
import { FindManyNearby, GymsRepository } from '../gyms-repository'
import { prisma } from '@/lib/prisma'

export class PrismaGymsRepository implements GymsRepository {
  async findById(gymId: string) {
    return prisma.gym.findUnique({
      where: {
        id: gymId,
      },
    })
  }

  async findManyNearby({ latitude, longitude }: FindManyNearby) {
    return prisma.$queryRaw<Gym[]>`
      SELECT * from gyms
      WHERE ( 6371 * acos( 
        cos( radians(${latitude}) ) * 
        cos( radians( latitude ) ) * 
        cos( radians( longitude ) - 
        radians(${longitude}) ) + 
        sin( radians(${latitude}) ) * 
        sin( radians( latitude ) ) ) 
      ) <= 10
    `
  }

  async searchMany(query: string, page: number) {
    return prisma.gym.findMany({
      where: {
        title: {
          contains: query,
        },
      },
      take: 20,
      skip: (page - 1) * 20,
    })
  }

  async create(data: Prisma.GymCreateInput) {
    return prisma.gym.create({ data })
  }
}
