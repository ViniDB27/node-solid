import { CheckIn } from '@prisma/client'
import { CheckInRepository } from '@/repositories/check-ins-repository'
import { GymsRepository } from '@/repositories/gyms-repository'
import { ResourceNotFoundError } from './errors/resource-not-found-error'
import { getDistanceBetweenCoordinates } from '@/utils/get-distance-between-coordinate'
import { MaxDistanceError } from './errors/max-distance-error'
import { MaxCheckInsError } from './errors/max-number-og-check-ins-erros'

interface CheckInUseCaseRequest {
  userId: string
  gymId: string
  userLatitude: number
  userLongitude: number
}

interface CheckInUseCaseResponse {
  checkIn: CheckIn
}

export class CheckInUseCase {
  constructor(
    private readonly checkInRepository: CheckInRepository,
    private readonly gymsRepository: GymsRepository,
  ) {}

  async execute({
    userId,
    gymId,
    userLatitude,
    userLongitude,
  }: CheckInUseCaseRequest): Promise<CheckInUseCaseResponse> {
    const gym = await this.gymsRepository.findById(gymId)
    if (!gym) throw new ResourceNotFoundError()

    const distance = getDistanceBetweenCoordinates(
      { latitude: userLatitude, longitude: userLongitude },
      {
        latitude: gym.latitude.toNumber(),
        longitude: gym.longitude.toNumber(),
      },
    )

    const MAX_DISTANCE_IN_KILOMETERS = 0.1
    if (distance > MAX_DISTANCE_IN_KILOMETERS) throw new MaxDistanceError()

    const checkInOnSameDate = await this.checkInRepository.findByUserIdOnDate(
      userId,
      new Date(),
    )

    if (checkInOnSameDate) throw new MaxCheckInsError()

    const checkIn = await this.checkInRepository.create({
      gym_id: gymId,
      user_id: userId,
    })
    return {
      checkIn,
    }
  }
}
