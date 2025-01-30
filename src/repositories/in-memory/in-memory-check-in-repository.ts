import { Prisma, CheckIn } from '@prisma/client'
import { CheckInRepository } from '../check-ins-repository'
import { randomUUID } from 'node:crypto'
import dayjs from 'dayjs'

export class InMemoryCheckInsRepository implements CheckInRepository {
  public checkins: CheckIn[] = []

  async findByUserIdOnDate(userId: string, date: Date) {
    const startOfTheDay = dayjs(date).startOf('date')
    const endOfTheDay = dayjs(date).endOf('date')

    const checkOnSameDate = this.checkins.find((checkIn) => {
      const checkInDate = dayjs(checkIn.created_at)
      const isOnSameDate =
        checkInDate.isAfter(startOfTheDay) && checkInDate.isBefore(endOfTheDay)
      return checkIn.user_id === userId && isOnSameDate
    })

    if (!checkOnSameDate) return null

    return checkOnSameDate
  }

  async create(data: Prisma.CheckInUncheckedCreateInput) {
    const checkIn = {
      id: randomUUID(),
      user_id: data.user_id,
      gym_id: data.gym_id,
      validated_at: data.validated_at ? new Date(data.validated_at) : null,
      created_at: new Date(),
    }
    this.checkins.push(checkIn)
    return checkIn
  }

  async save(data: CheckIn) {
    const checkInIndex = this.checkins.findIndex(
      (checkIn) => checkIn.id === data.id,
    )
    if (checkInIndex >= 0) this.checkins[checkInIndex] = data
    return data
  }

  async findManyByUserId(userId: string, page: number) {
    return this.checkins
      .filter((checkIn) => checkIn.user_id === userId)
      .slice((page - 1) * 20, page * 20)
  }

  async findById(checkInId: string) {
    return this.checkins.find((checkIn) => checkIn.id === checkInId) ?? null
  }

  async coutnByUserId(userId: string) {
    return this.checkins.filter((checkIn) => checkIn.user_id === userId).length
  }
}
