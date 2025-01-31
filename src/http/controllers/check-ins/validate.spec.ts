import request from 'supertest'
import { app } from '@/app'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user'
import { prisma } from '@/lib/prisma'

describe('Validate Check In (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it.skip('should be able to get metrics of check in', async () => {
    const { token } = await createAndAuthenticateUser(app)
    const user = await prisma.user.findFirstOrThrow()
    const gym = await prisma.gym.create({
      data: {
        title: 'JavaScript Gym',
        latitude: -27.202978,
        longitude: -49.6205824,
      },
    })

    let chekcIn = await prisma.checkIn.create({
      data: {
        gym_id: gym.id,
        user_id: user.id,
      },
    })

    console.log(gym, `/gyms/${gym.id}/check-ins`)

    const response = await request(app.server)
      .patch(`/check-ins/${chekcIn}/validate`)
      .set('Authorization', `Bearer ${token}`)
      .send()

    expect(response.statusCode).toEqual(204)

    chekcIn = await prisma.checkIn.findUniqueOrThrow({
      where: { id: chekcIn.id },
    })

    expect(chekcIn.validated_at).toEqual(expect.any(Date))
  })
})
