import { PrismaCheckInRepository } from '@/repositories/prisma/prisma-check-ins-repository'
import { GetUserMetricsUsecase } from '../get-user-metrics'

export function makeGetUserMetricsUsecase() {
  const checkInRepository = new PrismaCheckInRepository()
  const getUserMetricsUsecase = new GetUserMetricsUsecase(checkInRepository)
  return getUserMetricsUsecase
}
