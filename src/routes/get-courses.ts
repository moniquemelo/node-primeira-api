import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { db } from '../database/client.ts'
import { courses } from '../database/schema.ts'
import z from 'zod'
import { ilike, asc, and, SQL } from 'drizzle-orm'


export const getCoursesRoute: FastifyPluginAsyncZod = async (server) => {
    // DICA: Sempre retornar um objeto
    server.get('/courses', {
        schema: {
            tags: ['Courses'],
            summary: 'Lista todos os cursos',
            querystring: z.object({
                search: z.string().optional(),
                orderBy: z.enum(['id', 'title']).optional().default('id'),
                page: z.coerce.number().optional().default(1),
            }),
            description: 'Essa rota lista todos os cursos cadastrados no banco de dados.',
            response: {
                200: z.object({
                    courses: z.array(
                        z.object({
                            id: z.uuid(),
                            title: z.string(),
                        })
                    ),
                    total: z.number(),
                }).describe('Lista de cursos retornada com sucesso!'),
            }
        }

    }, async (request, reply) => {

        const { search, orderBy, page } = request.query

        const conditions: SQL[] = []

        if (search) {
            conditions.push(ilike(courses.title, `%${search}%`))
        }

        const [result, total] = await Promise.all([

            db.select({
                id: courses.id,
                title: courses.title,
            })
                .from(courses)
                .orderBy(asc(courses[orderBy]))
                .offset((page - 1) * 2) // Paginação, pular 2 cursos por página
                .limit(2)  // Paginação, limitar a 2 cursos por página
                .where(and(...conditions)), // Filtro para buscar cursos pelo título

            db.$count(courses, and(...conditions))

        ])
        //const result = await db.select().from(courses)


        return reply.send({ courses: result, total })
    })

}