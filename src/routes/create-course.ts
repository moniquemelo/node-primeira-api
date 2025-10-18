import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { db } from '../database/client.ts'
import { courses } from '../database/schema.ts'
import z, { check } from 'zod'
import { checkRequestJwt } from './hooks/check-request-jwt.ts'
import { checkUserRole } from './hooks/check-user-role.ts'


export const createCourseRoute: FastifyPluginAsyncZod = async (server) => {
    server.post('/courses', {
        preHandler: [
            checkRequestJwt,
            checkUserRole('manager')
        ],
        schema: {
            tags: ['Courses'],
            summary: 'Cria um novo curso',
            description: 'Essa rota recebe um título de curso e cria um novo curso no banco de dados.',
            body: z.object({
                title: z.string().min(5, 'O título deve ter no mínimo 5 caracteres'),
            }),
            response: {
                201: z.object({ courseId: z.uuid() }).describe('Curso criado com sucesso!'),
            }
        },
    }, async (request, reply) => {

        const courseTitle = request.body.title

        const result = await db
            .insert(courses)
            .values({ title: courseTitle })
            .returning()

        return reply.status(201).send({ courseId: result[0].id })

    })

}