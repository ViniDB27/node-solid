import { CheckInRepository } from '@/repositories/check-ins-repository'

interface GetUserMetricsUsecaseRequest {
  userId: string
}

interface GetUserMetricsUsecaseResponse {
  ckeckInsCount: number
}

export class GetUserMetricsUsecase {
  constructor(private readonly checkInRepository: CheckInRepository) {}

  async execute({
    userId,
  }: GetUserMetricsUsecaseRequest): Promise<GetUserMetricsUsecaseResponse> {
    const ckeckInsCount = await this.checkInRepository.coutnByUserId(userId)
    return {
      ckeckInsCount,
    }
  }
}
