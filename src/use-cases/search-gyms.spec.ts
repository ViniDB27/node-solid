import { expect, describe, it, beforeEach } from 'vitest'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { SearchGymUsecase } from './search-gyms'

let gymsRepository: InMemoryGymsRepository
let sut: SearchGymUsecase

describe('Search Gym Usecase', () => {
  beforeEach(() => {
    gymsRepository = new InMemoryGymsRepository()
    sut = new SearchGymUsecase(gymsRepository)
  })

  it('should be able to search for gyms', async () => {
    await gymsRepository.create({
      id: 'gym-01',
      title: 'gym-01',
      description: 'gym-01',
      phone: 'phone',
      latitude: -27.202978,
      longitude: -49.6205824,
    })
    await gymsRepository.create({
      id: 'gym-02',
      title: 'gym-02',
      description: 'gym-02',
      latitude: -27.202978,
      longitude: -49.6205824,
    })
    await gymsRepository.create({
      id: 'gym-03',
      title: 'JavaScrip Gym',
      description: 'JavaScrip Gym',
      phone: 'phone',
      latitude: -27.202978,
      longitude: -49.6205824,
    })
    const { gyms } = await sut.execute({
      query: 'gym',
      page: 1,
    })
    expect(gyms).toHaveLength(2)
    expect(gyms).toEqual([
      expect.objectContaining({ id: 'gym-01' }),
      expect.objectContaining({ id: 'gym-02' }),
    ])
  })

  it('should be able to to search gyms paginated', async () => {
    for (let i = 1; i <= 22; i++) {
      await gymsRepository.create({
        id: `gym-${i}`,
        title: `gym-${i}`,
        description: `gym-${i}`,
        phone: 'phone',
        latitude: -27.202978,
        longitude: -49.6205824,
      })
    }
    const { gyms } = await sut.execute({
      query: 'gym',
      page: 2,
    })
    expect(gyms).toHaveLength(2)
    expect(gyms).toEqual([
      expect.objectContaining({ id: 'gym-21' }),
      expect.objectContaining({ id: 'gym-22' }),
    ])
  })
})
