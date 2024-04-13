import axios from "axios";

export class dashboardServices {
  constructor() {
    this.server_uri = process.env.REACT_APP_BACKEND_URL; // Declare a class-level variable
  }



  async getAllDashboardData(data) {
    return axios.get(`${this.server_uri}dashboard/getDashboardMeta`, data, {
      headers: {
      },
    });
  }


  
}
