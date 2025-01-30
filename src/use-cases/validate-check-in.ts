import { CheckIn } from '@prisma/client'
import { CheckInRepository } from '@/repositories/check-ins-repository'
import { ResourceNotFoundError } from './errors/resource-not-found-error'
import dayjs from 'dayjs'
import { LateCheckInValidationError } from './errors/late-check-in-validation-error'

interface ValidateCheckInUseCaseRequest {
  checkInId: string
}

interface ValidateCheckInUseCaseResponse {
  checkIn: CheckIn
}

export class ValidateCheckInUseCase {
  constructor(private readonly checkInRepository: CheckInRepository) {}

  async execute({
    checkInId,
  }: ValidateCheckInUseCaseRequest): Promise<ValidateCheckInUseCaseResponse> {
    const checkIn = await this.checkInRepository.findById(checkInId)
    if (!checkIn) throw new ResourceNotFoundError()
    const distanceInMinutesFromCheckInCreation = dayjs(new Date()).diff(
      checkIn.created_at,
      'minutes',
    )
    const MAX_MINUTE_VALIDATE = 20
    if (distanceInMinutesFromCheckInCreation > MAX_MINUTE_VALIDATE)
      throw new LateCheckInValidationError()
    checkIn.validated_at = new Date()
    await this.checkInRepository.save(checkIn)
    return {
      checkIn,
    }
  }
}
