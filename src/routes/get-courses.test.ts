import { test, expect } from 'vitest'
import { server } from '../app.ts'
import request from 'supertest'
import { makeCourse } from '../tests/factories/make-course.ts'
import { randomUUID  } from 'node:crypto'

test('Lista cursos', async () => {
  await server.ready()

  const titleId = randomUUID()

  const course = await makeCourse(titleId)

  const response = await request(server.server)
    .get(`/courses?search=${titleId}`)

  expect(response.status).toEqual(200)
  expect(response.body).toEqual({
    total: 1,
    courses: [
      {
        id: expect.any(String),
        title: titleId,
      }
    ],
  })
})
