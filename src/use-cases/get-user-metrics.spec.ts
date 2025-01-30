import { expect, describe, it, beforeEach } from 'vitest'
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-in-repository'
import { GetUserMetricsUsecase } from './get-user-metrics'

let checkInRepository: InMemoryCheckInsRepository
let sut: GetUserMetricsUsecase

describe('Get User Metrics Use Case', () => {
  beforeEach(async () => {
    checkInRepository = new InMemoryCheckInsRepository()
    sut = new GetUserMetricsUsecase(checkInRepository)
  })

  it('should be able to get check-ins count from metrics', async () => {
    await checkInRepository.create({
      user_id: 'user-01',
      gym_id: `gym-01`,
    })

    await checkInRepository.create({
      user_id: 'user-01',
      gym_id: `gym-02`,
    })

    const { ckeckInsCount } = await sut.execute({ userId: 'user-01' })
    expect(ckeckInsCount).toEqual(2)
  })
})
