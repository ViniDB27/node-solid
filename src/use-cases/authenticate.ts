import { UsersRepository } from '@/repositories/users-repository'
import { InvalidCredentialsError } from './errors/invalid-credentials-error'
import { compare } from 'bcryptjs'
import { User } from '@prisma/client'

interface AuthenticateUsecaseRequest {
  email: string
  password: string
}

interface AuthenticateUsecaseResponse {
  user: User
}

export class AuthenticateUsecase {
  constructor(private readonly userRepository: UsersRepository) {}

  async execute({
    email,
    password,
  }: AuthenticateUsecaseRequest): Promise<AuthenticateUsecaseResponse> {
    const user = await this.userRepository.findByEmail(email)
    if (!user) throw new InvalidCredentialsError()
    const doesPasswordMatch = await compare(password, user.password_hash)
    if (!doesPasswordMatch) throw new InvalidCredentialsError()
    return {
      user,
    }
  }
}
