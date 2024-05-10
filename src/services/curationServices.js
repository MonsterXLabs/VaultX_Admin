import axios from "axios";

export class CreateCurationServices {
  constructor() {
    this.server_uri = process.env.REACT_APP_BACKEND_URL; // Declare a class-level variable
  }

  async getToken() {
    return localStorage.getItem("token");
  }

  async getAllCollectionByID(collectionId) {
    return axios.get(`${this.server_uri}collection/getCollectionById/${collectionId}`);
  }

  async getAllCollections(data) {
    const token = await this.getToken();
    return axios.post(`${this.server_uri}collection/getAllCollections`, data, {
      headers: {
        authorization: "Bearer " + token,
      },
    });
  }

  async getAllCategory(data) {
    const token = await this.getToken();
    return axios.get(`${this.server_uri}category/getAllCategories`, data, {
      headers: {
        authorization: "Bearer " + token,
      },
    });
  }

  async handleCuration(data) {
    const token = await this.getToken();
    return axios.post(`${this.server_uri}collection/handleCuration`, data, {
      headers: {
        authorization: "Bearer " + token,
      },
    });
  }
}
