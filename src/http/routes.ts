import { FastifyInstance } from 'fastify'
import { registerUser } from './controllers/register'
import { autehnticate } from './controllers/authenticate'
import { profile } from './controllers/profile'
import { verifyJWT } from './middlewares/verify-jwt'

export async function appRoutes(app: FastifyInstance) {
  app.post('/users', registerUser)
  app.post('/sessions', autehnticate)

  // Authenticate Routes
  app.get(
    '/me',
    {
      onRequest: [verifyJWT],
    },
    profile,
  )
}
