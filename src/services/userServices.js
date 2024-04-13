import axios from "axios";

export class UserCategoryServices {
  token;
  constructor() {
    this.server_uri = process.env.REACT_APP_BACKEND_URL; // Declare a class-level variable
    this.token = localStorage.getItem("token");
  }

  async getAllUsers(data) {
    return axios.post(`${this.server_uri}user/getAllUsers`, data);
  }

  async handleCurator(data) {
    return axios.post(`${this.server_uri}user/get-handle-curator`, data, {
      headers: {
        authorization: "Bearer " + this.token,
      },
    });
  }

  async handleUser(data) {
    return axios.post(`${this.server_uri}user/get-handle-user`, data, {
      headers: {
        authorization: "Bearer " + this.token,
      },
    });
  }
}
