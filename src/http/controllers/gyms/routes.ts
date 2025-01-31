import { FastifyInstance } from 'fastify'
import { verifyJWT } from '@/http/middlewares/verify-jwt'
import { searchGym } from './search'
import { nearbyGym } from './nearby'
import { createGym } from './create'

export async function gymsRoutes(app: FastifyInstance) {
  app.addHook('onRequest', verifyJWT)
  app.get('/gyms/search', searchGym)
  app.get('/gyms/nearby', nearbyGym)
  app.post('/gyms', createGym)
}
