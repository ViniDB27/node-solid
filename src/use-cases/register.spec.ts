import { expect, describe, it, beforeEach } from 'vitest'
import { RegisterUsecase } from './register'
import { compare } from 'bcryptjs'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { UserAlreadyExistError } from './errors/user-already-exist-error'
import { UsersRepository } from '@/repositories/users-repository'

let repository: UsersRepository
let sut: RegisterUsecase

describe('Register Use Case', () => {
  beforeEach(() => {
    repository = new InMemoryUsersRepository()
    sut = new RegisterUsecase(repository)
  })

  it('should hash user password upon registration', async () => {
    const { user } = await sut.execute({
      name: 'Jhon Doe',
      email: 'jhondoe@example.com',
      password: '123456',
    })
    const isPasswordCorrectlyHashed = await compare(
      '123456',
      user.password_hash,
    )
    expect(isPasswordCorrectlyHashed).toBeTruthy()
  })

  it('should not be able to register with same email twice', async () => {
    const email = 'jhondoe@exmaple.com'
    await sut.execute({
      name: 'Jhon Doe',
      email,
      password: '123456',
    })
    await expect(() =>
      sut.execute({
        name: 'Jhon Doe',
        email,
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(UserAlreadyExistError)
  })

  it('should be able to register', async () => {
    const { user } = await sut.execute({
      name: 'Jhon Doe',
      email: 'jhondoe@example.com',
      password: '123456',
    })
    expect(user.id).toEqual(expect.any(String))
    expect(user.name).toEqual('Jhon Doe')
    expect(user.email).toEqual('jhondoe@example.com')
    expect(user.password_hash).not.toBe('123456')
    expect(user.password_hash).toEqual(expect.any(String))
  })
})
