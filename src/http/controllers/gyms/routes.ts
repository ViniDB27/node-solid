import { FastifyInstance } from 'fastify'
import { verifyJWT } from '@/http/middlewares/verify-jwt'
import { searchGym } from './search'
import { nearbyGym } from './nearby'
import { createGym } from './create'
import { verifyUserRole } from '@/http/middlewares/verify-user-role'

export async function gymsRoutes(app: FastifyInstance) {
  app.addHook('onRequest', verifyJWT)
  app.get('/gyms/search', searchGym)
  app.get('/gyms/nearby', nearbyGym)
  app.post('/gyms', { onRequest: [verifyUserRole('ADMIN')] }, createGym)
}
