import { expect, describe, it, beforeEach, vi, afterEach } from 'vitest'
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-in-repository'
import { ValidateCheckInUseCase } from './validate-check-in'
import { ResourceNotFoundError } from './errors/resource-not-found-error'
import { LateCheckInValidationError } from './errors/late-check-in-validation-error'

let checkInRepository: InMemoryCheckInsRepository
let sut: ValidateCheckInUseCase

describe('Validate Check In Use Case', () => {
  beforeEach(async () => {
    checkInRepository = new InMemoryCheckInsRepository()
    sut = new ValidateCheckInUseCase(checkInRepository)

    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should be able to vailidate the check-in', async () => {
    const checkInCreated = await checkInRepository.create({
      id: 'check-in-01',
      user_id: 'user-01',
      gym_id: 'gym-01',
    })
    expect(checkInCreated.validated_at).toBeNull()
    const { checkIn } = await sut.execute({ checkInId: checkInCreated.id })
    expect(checkIn.validated_at).toEqual(expect.any(Date))
    expect(checkInRepository.checkins[0].validated_at).toEqual(expect.any(Date))
  })

  it('should not be able to validate an inexistent check-in', async () => {
    await expect(() =>
      sut.execute({ checkInId: 'inexistent-check-in-id' }),
    ).rejects.instanceOf(ResourceNotFoundError)
  })

  it('should not be able to validate the check-in after 20 minutes of its creation', async () => {
    vi.setSystemTime(new Date(2023, 0, 1, 13, 40))

    const checkInCreated = await checkInRepository.create({
      id: 'check-in-01',
      user_id: 'user-01',
      gym_id: 'gym-01',
    })

    const twentyOneMinutesInMs = 1000 * 60 * 21
    vi.advanceTimersByTime(twentyOneMinutesInMs)

    await expect(() =>
      sut.execute({ checkInId: checkInCreated.id }),
    ).rejects.instanceOf(LateCheckInValidationError)
  })
})
