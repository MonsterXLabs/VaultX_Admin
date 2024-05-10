import axios from "axios"

export class CreateAdministratorServices {
  constructor() {
    this.server_uri = process.env.REACT_APP_BACKEND_URL // Declare a class-level variable
  }

  async getToken() {
    return localStorage.getItem("token")
  }

  async createAdmin(data) {
    const token = await this.getToken()
    return axios.post(`${this.server_uri}administrator/create-administrator`, data, {
      headers: {
        authorization: "Bearer " + token,
      },
    })
  }

  async loginAdmin(data) {
    const token = await this.getToken()
    return axios.post(`${this.server_uri}administrator/login-administrator`, data, {
      headers: {
        authorization: "Bearer " + token,
      },
    })
  }

  async getAllAdmins(data) {
    const token = await this.getToken()
    return axios.get(`${this.server_uri}administrator/get-all-administrator/${data.skip}/${data.limit}`, {
      headers: {
        authorization: "Bearer " + token,
      },
    })
  }

  async deleteAdmin(data) {
    const token = await this.getToken()
    return axios.post(`${this.server_uri}administrator/delete-administrator`, data, {
      headers: {
        authorization: "Bearer " + token,
      },
    })
  }
}
