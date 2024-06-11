import axios from "axios";

export class CreateCategoryServices {
  server_uri: string;

  constructor() {
    this.server_uri = import.meta.env.VITE_BACKEND_URL || ""; // Use NEXT_PUBLIC_ prefix for environment variables
  }

  async getToken(): Promise<string | null> {
    return localStorage.getItem("token");
  }

  async createCategory(data: any): Promise<any> {
    const token = await this.getToken();
    return axios.post(`${this.server_uri}category/createCategory`, data, {
      headers: {
        authorization: "Bearer " + token,
      },
    });
  }

  async getAllCategory(data: { skip: number; limit: number }): Promise<any> {
    const token = await this.getToken();
    return axios.get(`${this.server_uri}category/getAllCategories/${data.skip}/${data.limit}`);
  }

  async deleteCategory(data: any): Promise<any> {
    const token = await this.getToken();
    return axios.post(`${this.server_uri}category/deleteCategory`, data, {
      headers: {
        authorization: "Bearer " + token,
      },
    });
  }
}
