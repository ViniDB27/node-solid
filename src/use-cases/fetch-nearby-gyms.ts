import { Gym } from '@prisma/client'
import { GymsRepository } from '@/repositories/gyms-repository'

interface FetchNearbyGemsUsecaseRequest {
  userLatitude: number
  userLongitude: number
}

interface FetchNearbyGemsUsecaseResponse {
  gyms: Gym[]
}

export class FetchNearbyGemsUsecase {
  constructor(private readonly gymsRepository: GymsRepository) {}

  async execute({
    userLatitude,
    userLongitude,
  }: FetchNearbyGemsUsecaseRequest): Promise<FetchNearbyGemsUsecaseResponse> {
    const gyms = await this.gymsRepository.findManyNearby({
      latitude: userLatitude,
      longitude: userLongitude,
    })
    return { gyms }
  }
}
