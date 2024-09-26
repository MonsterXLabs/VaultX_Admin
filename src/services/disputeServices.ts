import axios from "axios";

export class DisputeServices {
  server_uri: string;
  token: string | null;

  constructor() {
    this.server_uri = import.meta.env.VITE_BACKEND_URL || ""; // Use NEXT_PUBLIC_ prefix for environment variables
    this.token = localStorage.getItem("token");
  }

  async getAllDisputes(data: any): Promise<any> {
    return axios.post(`${this.server_uri}dispute/getAll`, data, {
      headers: {
        authorization: "Bearer " + this.token,
      },
    });
  }

  async getDisputeById(id: string): Promise<any> {
    return axios.get(`${this.server_uri}dispute/getDisputeById/${id}`);
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

  async rejectDispute(data: any): Promise<any> {
    return axios.post(`${this.server_uri}dispute/reject`, data, {
      headers: {
        authorization: "Bearer " + this.token,
      },
    });
  }

}
