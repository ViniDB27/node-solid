import { verifyJWT } from '@/http/middlewares/verify-jwt'
import { autehnticate } from './authenticate'
import { registerUser } from './register'
import { profile } from './profile'
import { FastifyInstance } from 'fastify'
import { refresh } from './refresh'

export async function usersRoutes(app: FastifyInstance) {
  app.post('/users', registerUser)
  app.post('/sessions', autehnticate)
  app.patch('/token/refresh', refresh)
  app.get('/me', { onRequest: [verifyJWT] }, profile)
}
