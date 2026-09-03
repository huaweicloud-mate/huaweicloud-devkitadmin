import http from './axios'

export function login(data: { username: string; password: string }) {
  return http.post('/rest/developer/server/auth/login', data)
}
