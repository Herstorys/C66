// Utilities
import { defineStore } from 'pinia';

export const useUserStore = defineStore('user', {
  state: () => ({
    username: '',
    token: null,
    isAdmin: false
  }),
  getters: {
    isLoggedIn: (state) => state.token
  },
  actions: {
    //action
    setUserInfo(username, token, isAdmin) {
      this.username = username;
      this.token = token;
      this.isAdmin = isAdmin;
    },
    //同步action
    logout() {
      this.username = '';
      this.token = '';
      this.isAdmin = false;
    }
  },
  persist: {
    storage: localStorage
  }
});
