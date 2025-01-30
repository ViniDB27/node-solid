import { expect, describe, it, beforeEach } from 'vitest'
import { hash } from 'bcryptjs'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { UsersRepository } from '@/repositories/users-repository'
import { GetUserProfileUsecase } from './get-user-profile'
import { ResourceNotFoundError } from './errors/resource-not-found-error'

let repository: UsersRepository
let sut: GetUserProfileUsecase

describe('Get User Profile Use Case', () => {
  beforeEach(() => {
    repository = new InMemoryUsersRepository()
    sut = new GetUserProfileUsecase(repository)
  })

  it('should be able to get user profile', async () => {
    const { id: userId } = await repository.create({
      name: 'Jhon Doe',
      email: 'jhondoe@example.com',
      password_hash: await hash('123456', 6),
    })
    const { user } = await sut.execute({ userId })
    expect(user.id).toEqual(userId)
    expect(user.name).toEqual('Jhon Doe')
    expect(user.email).toEqual('jhondoe@example.com')
    expect(user.password_hash).not.toBe('123456')
    expect(user.password_hash).toEqual(expect.any(String))
  })

  it('should not be able to get user profile with wrong id', async () => {
    await expect(() =>
      sut.execute({ userId: 'non-existing-id' }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })
})
