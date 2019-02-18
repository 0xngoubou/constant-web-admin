import * as axios from "axios";

export default class Base {
  constructor() {
    this.instance = axios.create({
      baseURL: `/api`,
      timeout: 10000
    });
  }

  async get(url, config = {}) {
    return this.instance.get(url, config);
  }

  async post(url, data, config = {}) {
    return this.instance.post(url, data, config);
  }

  async put(url, data, config = {}) {
    return this.instance.put(url, data, config);
  }

  async delete(url, config = {}) {
    return this.instance.delete(url, config);
  }
}
