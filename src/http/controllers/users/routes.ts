import { verifyJWT } from '@/http/middlewares/verify-jwt'
import { autehnticate } from './authenticate'
import { registerUser } from './register'
import { profile } from './profile'
import { FastifyInstance } from 'fastify'

export async function usersRoutes(app: FastifyInstance) {
  app.post('/users', registerUser)
  app.post('/sessions', autehnticate)
  app.get('/me', { onRequest: [verifyJWT] }, profile)
}
