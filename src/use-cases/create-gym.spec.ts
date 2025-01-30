import { expect, describe, it, beforeEach } from 'vitest'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { CreateGymUsecase } from './create-gym'

let gymsRepository: InMemoryGymsRepository
let sut: CreateGymUsecase

describe('Create Gym Use Case', () => {
  beforeEach(() => {
    gymsRepository = new InMemoryGymsRepository()
    sut = new CreateGymUsecase(gymsRepository)
  })

  it('should be able to create a gym', async () => {
    const { gym } = await sut.execute({
      title: 'gym-01',
      description: 'gym-01',
      phone: 'phone',
      latitude: -27.202978,
      longitude: -49.6205824,
    })
    expect(gym.id).toEqual(expect.any(String))
    expect(gym.title).toEqual('gym-01')
    expect(gym.description).toEqual('gym-01')
    expect(gym.phone).toBe('phone')
    expect(gym.latitude.toNumber()).toEqual(-27.202978)
    expect(gym.longitude.toNumber()).toEqual(-49.6205824)
  })
})
