import axios from "axios";

export class CreateCurationServices {
  server_uri: string;

  constructor() {
    this.server_uri = import.meta.env.VITE_BACKEND_URL || ""; // Use NEXT_PUBLIC_ prefix for environment variables
  }

  async getToken(): Promise<string | null> {
    return localStorage.getItem("token");
  }

  async getAllCollectionByID(collectionId: string): Promise<any> {
    return axios.get(`${this.server_uri}collection/getCollectionById/${collectionId}`);
  }

  async getAllCollections(data: any): Promise<any> {
    const token = await this.getToken();
    return axios.post(`${this.server_uri}collection/getAllCollections`, data, {
      headers: {
        authorization: "Bearer " + token,
      },
    });
  }

  async getAllCategory(data: any): Promise<any> {
    const token = await this.getToken();
    return axios.get(`${this.server_uri}category/getAllCategories`, {
      params: data,
      headers: {
        authorization: "Bearer " + token,
      },
    });
  }

  async handleCuration(data: any): Promise<any> {
    const token = await this.getToken();
    return axios.post(`${this.server_uri}collection/handleCuration`, data, {
      headers: {
        authorization: "Bearer " + token,
      },
    });
  }
}
