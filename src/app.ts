import fastify from 'fastify'
import { validatorCompiler, serializerCompiler, type ZodTypeProvider, jsonSchemaTransform } from 'fastify-type-provider-zod'
import { fastifySwagger } from '@fastify/swagger'
import scalarAPIReference from '@scalar/fastify-api-reference'
import { createCourseRoute } from './routes/create-course.ts'
import { getCoursesRoute } from './routes/get-courses.ts'
import { getCourseByIdRoute } from './routes/get-course-by-id.ts'

export const server = fastify({
    logger: {
        transport: {
            target: 'pino-pretty',
            options: {
                translateTime: 'HH:MM:ss Z',
                ignore: 'pid,hostname',
            },
        },
    },
}).withTypeProvider<ZodTypeProvider>()


if (process.env.NODE_ENV === 'development') {
    server.register(fastifySwagger, {
        openapi: {
            info: {
                title: 'Desafio Node.js',
                version: '1.0',
            }
        },
        transform: jsonSchemaTransform
    })

    server.register(scalarAPIReference, {
        routePrefix: '/docs',
    })
}

// Transformar os dados de saída em outro formato, por exemplo, transformar a propriedade "id" de uuid para string
server.setSerializerCompiler(serializerCompiler)
// Checagem dos dados de entrada, validar por exemplo se o titulo do curso é obrigatório
server.setValidatorCompiler(validatorCompiler)


server.register(createCourseRoute)
server.register(getCoursesRoute)
server.register(getCourseByIdRoute)

