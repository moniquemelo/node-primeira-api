import type { FastifyRequest } from "fastify";

export function getAuthenticatedUserFromRequest(request: FastifyRequest) {
  const user = request.user;
  
  if (!user) {
    throw new Error('Usuário não autenticado.')
  }

  return user

}