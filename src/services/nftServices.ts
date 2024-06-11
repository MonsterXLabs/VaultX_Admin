import axios from "axios";

export class NftCategoryServices {
  server_uri: string;
  token: string | null;

  constructor() {
    this.server_uri = import.meta.env.VITE_BACKEND_URL || ""; // Use NEXT_PUBLIC_ prefix for environment variables
    this.token = localStorage.getItem("token");
  }

  async getNftById(id: string): Promise<any> {
    return axios.get(`${this.server_uri}nft/getNftById/${id}`);
  }

  async getAllNft(data: any): Promise<any> {
    return axios.post(`${this.server_uri}nft/getAll`, data, {
      headers: {
        authorization: "Bearer " + this.token,
      },
    });
  }

  async getAllOrders(data: any): Promise<any> {
    return axios.post(`${this.server_uri}sale/get-all-orders`, data, {
      headers: {
        authorization: "Bearer " + this.token,
      },
    });
  }

  async getFee(data: any): Promise<any> {
    return axios.post(`${this.server_uri}sale/getFee`, data, {
      headers: {
        authorization: "Bearer " + this.token,
      },
    });
  }

  async releaseOrder(data: any): Promise<any> {
    return axios.post(`${this.server_uri}sale/releaseOrder`, data, {
      headers: {
        authorization: "Bearer " + this.token,
      },
    });
  }

  async cancelOrder(data: any): Promise<any> {
    return axios.post(`${this.server_uri}sale/cancelOrder`, data, {
      headers: {
        authorization: "Bearer " + this.token,
      },
    });
  }

  async handleNft(data: any): Promise<any> {
    return axios.post(`${this.server_uri}nft/handle-nft`, data, {
      headers: {
        authorization: "Bearer " + this.token,
      },
    });
  }
}
