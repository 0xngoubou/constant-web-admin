import Base from "./base";

export default class ProfilesService {
  constructor() {
    this.axios = new Base();
  }

  async list(verifiedLevel = [], keywords = "", page = 1, size = 10) {
    try {
      let endpoint = `/system/profiles?page=${page}&size=${size}`;
      if (verifiedLevel.length > 0) {
        endpoint = `${endpoint}&verified_level=${verifiedLevel.join(",")}`;
      }
      if (keywords != "") {
        endpoint = `${endpoint}&keywords=${keywords}`;
      }
      const response = await this.axios.get(endpoint);
      const data = response.data;
      return data;
    } catch (e) {
      return { status: 0, error: e.message };
    }
  }

  async submit(id) {
    try {
      const response = await this.axios.post(`/system/profiles/${id}/submit`);
      const data = response.data;
      return data;
    } catch (e) {
      return { status: 0, error: e.message };
    }
  }

  async discard(id) {
    try {
      const response = await this.axios.post(`/system/profiles/${id}/discard`);
      const data = response.data;
      return data;
    } catch (e) {
      return { status: 0, error: e.message };
    }
  }

  async ban(id) {
    try {
      const response = await this.axios.post(`/system/profiles/${id}/banned`);
      const data = response.data;
      return data;
    } catch (e) {
      return { status: 0, error: e.message };
    }
  }
}
