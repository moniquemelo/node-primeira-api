import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { db } from '../database/client.ts'
import { courses } from '../database/schema.ts'
import z from 'zod'
import { eq } from 'drizzle-orm'


export const getCourseByIdRoute: FastifyPluginAsyncZod = async (server) => {
    server.get('/courses/:id', {
        schema: {
            tags: ['Courses'],
            summary: 'Lista cursos por ID',
            params: z.object({
                id: z.uuid(),
            }),
            description: 'Essa rota lista todos os cursos cadastrados no banco de dados.',
            response: {
                200: z.object({
                    course: z.object({
                        id: z.uuid(),
                        title: z.string(),
                        description: z.string().nullable(),
                    })
                }).describe('Curso retornado com sucesso!'),
                404: z.null().describe('Curso não encontrado'),
            }
        },

    }, async (request, reply) => {

        const courseId = request.params.id

        const result = await db
            .select()
            .from(courses)
            .where(eq(courses.id, courseId))

        if (result.length > 0) {
            return { course: result[0] }
        }

        return reply.status(404).send()
    })

}