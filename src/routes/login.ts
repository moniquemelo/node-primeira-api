import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { db } from '../database/client.ts'
import { users } from '../database/schema.ts'
import { eq } from 'drizzle-orm'
import z from 'zod'
import { verify } from 'argon2'
import jwt from 'jsonwebtoken'


export const loginRoute: FastifyPluginAsyncZod = async (server) => {
    server.post('/sessions', {
        schema: {
            tags: ['auth'],
            summary: 'Login',
            body: z.object({
                email: z.email(),
                password: z.string().min(6, 'A senha deve ter no mínimo 6 caracteres'),
            }),
            response: {
                200: z.object({ token: z.string() }),
                400: z.object({ message: z.string() }),
            }
        },
    }, async (request, reply) => {

        const { email, password} = request.body

        const result = await db
          .select()
          .from(users)
          .where(eq(users.email, email))

        if(result.length === 0) {
          return reply.status(400).send({ message: 'Credenciais inválidas' })
        }

        const user = result[0]
        const doesPasswordMatch = await verify(user.password, password)

        if (!doesPasswordMatch) {
          return reply.status(400).send({ message: 'Credenciais inválidas' })
        }

        if (!process.env.JWT_SECRET) {
          throw new Error('JWT_SECRET não está definido nas variáveis de ambiente.')
        }

        // Subject => quem é o usuário
        const token = jwt.sign({ sub: user.id, role: user.role }, process.env.JWT_SECRET!)

        return reply.status(200).send({ token })
    })

}