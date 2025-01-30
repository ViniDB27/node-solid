import { Gym } from '@prisma/client'
import { GymsRepository } from '@/repositories/gyms-repository'

interface SearchGymUsecaseRequest {
  query: string
  page: number
}

interface SearchGymUsecaseResponse {
  gyms: Gym[]
}

export class SearchGymUsecase {
  constructor(private readonly gymsRepository: GymsRepository) {}

  async execute({
    query,
    page,
  }: SearchGymUsecaseRequest): Promise<SearchGymUsecaseResponse> {
    const gyms = await this.gymsRepository.searchMany(query, page)
    return { gyms }
  }
}
