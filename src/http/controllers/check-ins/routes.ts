import { FastifyInstance } from 'fastify'
import { verifyJWT } from '@/http/middlewares/verify-jwt'
import { createCheckIn } from './create'
import { historyCheckIns } from './history'
import { metricsCheckIns } from './metrics'
import { verifyUserRole } from '@/http/middlewares/verify-user-role'
import { validateCheckIns } from './validate'

export async function checInsRoutes(app: FastifyInstance) {
  app.addHook('onRequest', verifyJWT)
  app.get('/check-ins/history', historyCheckIns)
  app.get('/check-ins/metrics', metricsCheckIns)
  app.post('/gyms/:gymId/check-ins', createCheckIn)
  app.patch(
    '/check-ins/:checkInId/validate',
    { onRequest: [verifyUserRole('ADMIN')] },
    validateCheckIns,
  )
}
