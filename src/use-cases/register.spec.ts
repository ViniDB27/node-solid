import { expect, describe, it } from 'vitest'
import { RegisterUsecase } from './register'
import { compare } from 'bcryptjs'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { UserAlreadyExistError } from './errors/user.already-exist-error'

describe('Register Use Case', () => {
  it('should hash user password upon registration', async () => {
    const repository = new InMemoryUsersRepository()
    const registerUsecase = new RegisterUsecase(repository)
    const { user } = await registerUsecase.execute({
      name: 'John Doe',
      email: 'jhondoe2@example.com',
      password: '123456',
    })
    const isPasswordCorrectlyHashed = await compare(
      '123456',
      user.password_hash,
    )
    expect(isPasswordCorrectlyHashed).toBeTruthy()
  })

  it('should not be able to register with same email twice', async () => {
    const repository = new InMemoryUsersRepository()
    const registerUsecase = new RegisterUsecase(repository)
    const email = 'jhondoe@exmaple.com'
    await registerUsecase.execute({
      name: 'John Doe',
      email,
      password: '123456',
    })
    await expect(() =>
      registerUsecase.execute({
        name: 'John Doe',
        email,
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(UserAlreadyExistError)
  })

  it('should be able to register', async () => {
    const repository = new InMemoryUsersRepository()
    const registerUsecase = new RegisterUsecase(repository)
    const { user } = await registerUsecase.execute({
      name: 'John Doe',
      email: 'jhondoe2@example.com',
      password: '123456',
    })
    expect(user.id).toEqual(expect.any(String))
    expect(user.name).toEqual('John Doe')
    expect(user.email).toEqual('jhondoe2@example.com')
    expect(user.password_hash).not.toBe('123456')
    expect(user.password_hash).toEqual(expect.any(String))
  })
})
