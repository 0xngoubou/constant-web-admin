import Base from "./base";

export default class AccountsService {
  constructor() {
    this.axios = new Base();
  }

  async list(page = 1, size = 10) {
    try {
      const response = await this.axios.get(
        `/primetrust/accounts?page=${page}&size=${size}`
      );
      const data = response.data;
      return data;
    } catch (e) {
      return { status: 0, error: e.message };
    }
  }

  async detail(id) {
    try {
      const response = await this.axios.get(`/primetrust/accounts/${id}`);
      const data = response.data;
      return data;
    } catch (e) {
      return { status: 0, error: e.message };
    }
  }

  async custodialAccount() {
    try {
      const response = await this.axios.get(`/primetrust/accounts/custodial`);
      const data = response.data;
      return data;
    } catch (e) {
      return { status: 0, error: e.message };
    }
  }

  async escrowAccount() {
    try {
      const response = await this.axios.get(`/primetrust/accounts/escrow`);
      const data = response.data;
      return data;
    } catch (e) {
      return { status: 0, error: e.message };
    }
  }

  async custodialAccountBalance() {
    try {
      const response = await this.axios.get(
        `/primetrust/accounts/custodial/balance`
      );
      const data = response.data;
      return data;
    } catch (e) {
      return { status: 0, error: e.message };
    }
  }

  async escrowAccountBalance() {
    try {
      const response = await this.axios.get(
        `/primetrust/accounts/escrow/balance`
      );
      const data = response.data;
      return data;
    } catch (e) {
      return { status: 0, error: e.message };
    }
  }
}
