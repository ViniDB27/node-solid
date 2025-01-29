import { UsersRepository } from '@/repositories/users-repository'
import { hash } from 'bcryptjs'
import { UserAlreadyExistError } from './errors/user.already-exist-error'
import { User } from '@prisma/client'

interface RegisterUsecaseRequest {
  name: string
  email: string
  password: string
}

interface RegisterUsecaseResponse {
  user: User
}

export class RegisterUsecase {
  constructor(private readonly usersRepository: UsersRepository) {}

  async execute({
    name,
    email,
    password,
  }: RegisterUsecaseRequest): Promise<RegisterUsecaseResponse> {
    const password_hash = await hash(password, 6)
    const userWihtSameEmail = await this.usersRepository.findByEmail(email)
    if (userWihtSameEmail) throw new UserAlreadyExistError()
    const user = await this.usersRepository.create({
      name,
      email,
      password_hash,
    })
    return { user }
  }
}
