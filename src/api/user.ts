import http from './axios'

export interface UserInfo {
  id: number
  name: string
  email: string
}

export function getUserInfo(id: number) {
  return http.get<UserInfo>(`/user/${id}`)
}

export function login(data: { username: string; password: string }) {
  return http.post<{ token: string }>('/auth/login', data)
}