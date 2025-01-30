import { UsersRepository } from '@/repositories/users-repository'
import { User } from '@prisma/client'
import { ResourceNotFoundError } from './errors/resource-not-found-error'

interface GetUserProfileUsecaseRequest {
  userId: string
}

interface GetUserProfileUsecaseResponse {
  user: User
}

export class GetUserProfileUsecase {
  constructor(private readonly userRepository: UsersRepository) {}

  async execute({
    userId,
  }: GetUserProfileUsecaseRequest): Promise<GetUserProfileUsecaseResponse> {
    const user = await this.userRepository.findById(userId)
    if (!user) throw new ResourceNotFoundError()
    return {
      user,
    }
  }
}
