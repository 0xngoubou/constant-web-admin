import Base from "./base";

export default class DisbursementsService {
  constructor() {
    this.axios = new Base();
  }

  async list(page = 1, size = 10) {
    try {
      const response = await this.axios.get(
        `/primetrust/disbursements?page=${page}&size=${size}`
      );
      const data = response.data;
      return data;
    } catch (e) {
      return { status: 0, error: e.message };
    }
  }

  async detail(id) {
    try {
      const response = await this.axios.get(`/primetrust/disbursements/${id}`);
      const data = response.data;
      return data;
    } catch (e) {
      return { status: 0, error: e.message };
    }
  }
}
