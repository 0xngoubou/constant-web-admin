import Base from "./base";

export default class AuthService {
  constructor() {
    this.axios = new Base();
  }

  async logIn(email, password) {
    try {
      const body = {
        email,
        password
      };
      const response = await this.axios.post(`/auth/login`, body);
      const data = response.data;
      return data;
    } catch (e) {
      return { status: 0, error: e.message };
    }
  }

  async logOut() {
    try {
      const response = await this.axios.post(`/auth/logout`);
      const data = response.data;
      return data;
    } catch (e) {
      return { status: 0, error: e.message };
    }
  }

  async profile() {
    try {
      const response = await this.axios.get("/auth/me");
      const data = response.data;
      return data.data;
    } catch (e) {
      return { status: 0, error: e.message };
    }
  }
}
