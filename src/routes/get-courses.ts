import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { db } from '../database/client.ts'
import { courses } from '../database/schema.ts'
import z from 'zod'


export const getCoursesRoute: FastifyPluginAsyncZod = async (server) => {
    // DICA: Sempre retornar um objeto
    server.get('/courses', {
        schema: {
            tags: ['Courses'],
            summary: 'Lista todos os cursos',
            description: 'Essa rota lista todos os cursos cadastrados no banco de dados.',
            response: {
                200: z.object({
                    courses: z.array(
                        z.object({
                            id: z.uuid(),
                            title: z.string(),
                        })
                    )
                }).describe('Lista de cursos retornada com sucesso!'),
            }
        }

    }, async (request, reply) => {
        //const result = await db.select().from(courses)

        // Caso eu quisesse selecionar apenas alguns campos
        const result = await db.select({
            id: courses.id,
            title: courses.title,
        }).from(courses)

        return reply.send({ courses: result })
    })

}