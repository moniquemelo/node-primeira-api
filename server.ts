import fastify from 'fastify'
import { validatorCompiler, serializerCompiler, type ZodTypeProvider, jsonSchemaTransform } from 'fastify-type-provider-zod'
import { fastifySwagger } from '@fastify/swagger'
import scalarAPIReference from '@scalar/fastify-api-reference'
import { createCourseRoute } from './src/routes/create-course.ts'
import { getCoursesRoute } from './src/routes/get-courses.ts'
import { getCourseByIdRoute } from './src/routes/get-course-by-id.ts'

const server = fastify({
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



server.listen({ port: 3333 }).then(() => {
    console.log('HTTP is running!')
})


// Para eu enviar uma imagem como JSON, eu teria que enviar um base64, porém acaba ficando muito grande, logo não é uma boa pratica,
// o ideal é mandar como multipart/form-data

