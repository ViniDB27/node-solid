import { FastifyInstance } from 'fastify'
import { registerUser } from './controllers/register'
import { autehnticate } from './controllers/authenticate'
import { profile } from './controllers/profile'

export async function appRoutes(app: FastifyInstance) {
  app.post('/users', registerUser)
  app.post('/sessions', autehnticate)

  // Authenticate Routes
  app.get('/me', profile)
}
