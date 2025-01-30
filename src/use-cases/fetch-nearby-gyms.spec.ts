import { expect, describe, it, beforeEach } from 'vitest'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { FetchNearbyGemsUsecase } from './fetch-nearby-gyms'

let gymsRepository: InMemoryGymsRepository
let sut: FetchNearbyGemsUsecase

describe('Fetch Nearby Gems Use Case', () => {
  beforeEach(() => {
    gymsRepository = new InMemoryGymsRepository()
    sut = new FetchNearbyGemsUsecase(gymsRepository)
  })

  it('should be able to find many nearby gyms', async () => {
    await gymsRepository.create({
      title: 'Near Gym',
      description: 'Near Gym',
      phone: 'phone',
      latitude: -27.202978,
      longitude: -49.6205824,
    })
    await gymsRepository.create({
      title: 'Far Gym',
      description: 'Far Gym',
      phone: 'phone',
      latitude: -26.202978,
      longitude: -48.6205824,
    })
    const { gyms } = await sut.execute({
      userLatitude: -27.202978,
      userLongitude: -49.6205824,
    })
    expect(gyms).toHaveLength(1)
    expect(gyms).toEqual([expect.objectContaining({ title: 'Near Gym' })])
  })
})
