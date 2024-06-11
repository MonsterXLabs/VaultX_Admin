import axios from "axios";

export class DashboardServices {
  server_uri: string;

  constructor() {
    this.server_uri = import.meta.env.VITE_BACKEND_URL || ""; // Use NEXT_PUBLIC_ prefix for environment variables
  }

  async getAllDashboardData(data: any): Promise<any> {
    return axios.get(`${this.server_uri}dashboard/getDashboardMeta`, {
      params: data,
      headers: {},
    });
  }
}
