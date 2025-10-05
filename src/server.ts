import fastify from 'fastify'
import crypto from 'node:crypto'

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
})

const courses = [
    { id: '1', title: 'Curso de Node.js' },
    { id: '2', title: 'Curso de React.js' },
    { id: '3', title: 'Curso de React Native' },
]


// DICA: Sempre retornar um objeto
server.get('/courses', () => {
    return { courses }
})

server.get('/courses/:id', (request, reply) => {
    type Params = {
        id: string
    }

    const params = request.params as Params
    const courseId = params.id
    const course = courses.find(course => course.id === courseId)

    if (course) {
        return { course }
    }
    return reply.status(404)
})

server.post('/courses', (request, reply) => {
    type Body = {
        title: string
    }

    const courseId = crypto.randomUUID()

    const body = request.body as Body
    const courseTitle = body.title

    if (!courseTitle) {
        return reply.status(422).send({ message: 'Titulo obrigatório.' })
    }

    courses.push({ id: courseId, title: courseTitle })
    return reply.status(201).send({ courseId })
})


server.listen({ port: 3333 }).then(() => {
    console.log('HTTP is running!')
})


// Para eu enviar uma imagem como JSON, eu teria que enviar um base64,
// porém acaba ficando muito grande, logo não é uma boa pratica, o ideal
// é mandar como multipart/form-data