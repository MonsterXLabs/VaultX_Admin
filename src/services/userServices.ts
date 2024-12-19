import { getItemWithExpiry } from "@/lib/utils";
import axios from "axios";

export class UserCategoryServices {
  server_uri: string;
  token: string | null;

  constructor() {
    this.server_uri = import.meta.env.VITE_BACKEND_URL || ""; // Use NEXT_PUBLIC_ prefix for environment variables
    this.token = getItemWithExpiry("token");
  }

  async getAllUsers(data: any): Promise<any> {
    return axios.post(`${this.server_uri}user/getAllUsers`, data);
  }

  async handleCurator(data: any): Promise<any> {
    return axios.post(`${this.server_uri}user/get-handle-curator`, data, {
      headers: {
        authorization: "Bearer " + this.token,
      },
    });
  }

  async handleAdmin(data: any): Promise<any> {
    return axios.post(`${this.server_uri}user/get-handle-admin`, data, {
      headers: {
        authorization: "Bearer " + this.token,
      },
    });
  }

  async handleUser(data: any): Promise<any> {
    return axios.post(`${this.server_uri}user/get-handle-user`, data, {
      headers: {
        authorization: "Bearer " + this.token,
      },
    });
  }

  async handleDelete(userId: string): Promise<any> {
      return axios.post(`${this.server_uri}user/delete/${userId}`, null, {
        headers: {
          authorization: "Bearer " + this.token,
        },
      });
  }
}
