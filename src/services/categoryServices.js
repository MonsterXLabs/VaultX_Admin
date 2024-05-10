import axios from "axios";

export class CreateCategoryServices {
  constructor() {
    this.server_uri = process.env.REACT_APP_BACKEND_URL; // Declare a class-level variable
  }

  async getToken() {
    return localStorage.getItem("token");
  }

  async createCategory(data) {
    const token = await this.getToken();
    return axios.post(`${this.server_uri}category/createCategory`, data, {
      headers: {
        authorization: "Bearer " + token,
      },
    });
  }

  async getAllCategory(data) {
    const token = await this.getToken();
    return axios.get(`${this.server_uri}category/getAllCategories/${data.skip}/${data.limit}`);
  }

  async deleteCategory(data){
    const token = await this.getToken();
    return axios.post(`${this.server_uri}category/deleteCategory`, data, {
      headers: {
        authorization: "Bearer " + token,
      },
    });
  }
  
}
