import axios from "axios";

export class CreateAdministratorServices {
  server_uri: string;

  constructor() {
    this.server_uri = import.meta.env.VITE_BACKEND_URL || ""; // Use NEXT_PUBLIC_ prefix for environment variables
  }

  async getToken(): Promise<string | null> {
    return localStorage.getItem("token");
  }

  async createAdmin(data: any): Promise<any> {
    const token = await this.getToken();
    return axios.post(`${this.server_uri}administrator/create-administrator`, data, {
      headers: {
        authorization: "Bearer " + token,
      },
    });
  }

  async loginAdmin(data: any): Promise<any> {
    const token = await this.getToken();
    return axios.post(`${this.server_uri}administrator/login-administrator`, data, {
      headers: {
        authorization: "Bearer " + token,
      },
    });
  }

  async getAllAdmins(data: { skip: number; limit: number }): Promise<any> {
    const token = await this.getToken();
    return axios.get(`${this.server_uri}administrator/get-all-administrator/${data.skip}/${data.limit}`, {
      headers: {
        authorization: "Bearer " + token,
      },
    });
  }

  async deleteAdmin(data: any): Promise<any> {
    const token = await this.getToken();
    return axios.post(`${this.server_uri}administrator/delete-administrator`, data, {
      headers: {
        authorization: "Bearer " + token,
      },
    });
  }
}
