import { expect, describe, it, beforeEach } from 'vitest'
import { hash } from 'bcryptjs'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { AuthenticateUsecase } from './authenticate'
import { InvalidCredentialsError } from './errors/invalid-credentials-error'
import { UsersRepository } from '@/repositories/users-repository'

let repository: UsersRepository
let sut: AuthenticateUsecase

describe('Authenticate Use Case', () => {
  beforeEach(() => {
    repository = new InMemoryUsersRepository()
    sut = new AuthenticateUsecase(repository)
  })

  it('should be able to authenticate', async () => {
    await repository.create({
      name: 'Jhon Doe',
      email: 'jhondoe@example.com',
      password_hash: await hash('123456', 6),
    })
    const { user } = await sut.execute({
      email: 'jhondoe@example.com',
      password: '123456',
    })
    expect(user.id).toEqual(expect.any(String))
    expect(user.name).toEqual('Jhon Doe')
    expect(user.email).toEqual('jhondoe@example.com')
    expect(user.password_hash).not.toBe('123456')
    expect(user.password_hash).toEqual(expect.any(String))
  })

  it('should not be able to authenticate with wrong email', async () => {
    expect(() =>
      sut.execute({
        email: 'jhondoe@example.com',
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError)
  })

  it('should not be able to authenticate with wrong password', async () => {
    await repository.create({
      name: 'Jhon Doe',
      email: 'jhondoe@example.com',
      password_hash: await hash('123456', 6),
    })
    await expect(() =>
      sut.execute({
        email: 'jhondoe@example.com',
        password: '1234567',
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError)
  })
})
