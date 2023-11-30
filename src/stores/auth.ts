import { defineStore } from 'pinia'
// import UserInfoApi from '@/api/user/user-info.api'
// import { reactive } from 'vue'

export const useAuthStore = defineStore('auth', {
  state: (): {
    userInfo: object | undefined
    token: string | undefined
  } => ({
    userInfo: undefined,
    token: undefined
  }),
  getters: {
    hasLogin(): boolean {
      return !!this.token
    },
    getUserInfo(): object | undefined {
      return this.userInfo
    },
    getToken(): string | undefined {
      return this.token
    }
  },
  actions: {
    setLogin(userinfo: object, token?: string) {
      localStorage.setItem('userinfo', JSON.stringify(userinfo))
      if (token) {
        localStorage.setItem('token', token)
        this.token = token
      }
      this.userInfo = userinfo
    },
    logout() {
      localStorage.removeItem('userinfo')
      this.token = undefined
      this.userInfo = undefined
    }
  }
})
