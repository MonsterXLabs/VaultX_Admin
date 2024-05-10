import axios from "axios";

export class NftCategoryServices {
  token;
  constructor() {
    this.server_uri = process.env.REACT_APP_BACKEND_URL; // Declare a class-level variable
    this.token = localStorage.getItem("token");
  }

  async getNftById(id) {
    return axios.get(`${this.server_uri}nft/getNftById/${id}`);
  }

  async getAllNft(data) {
    return axios.post(`${this.server_uri}nft/getAll`, data, {
      headers: {
        authorization: "Bearer " + this.token,
      },
    });
  }

  async getAllOrders(data) {
    return axios.post(`${this.server_uri}sale/get-all-orders`, data, {
      headers: {
        authorization: "Bearer " + this.token,
      },
    });
  }

  async getFee(data) {
    return axios.post(`${this.server_uri}sale/getFee`, data, {
      headers: {
        authorization: "Bearer " + this.token,
      },
    });
  }

  async releaseOrder(data) {
    return axios.post(`${this.server_uri}sale/releaseOrder`, data, {
      headers: {
        authorization: "Bearer " + this.token,
      },
    });
  }

  async cancleOrder(data) {
    return axios.post(`${this.server_uri}sale/cancelOrder`, data, {
      headers: {
        authorization: "Bearer " + this.token,
      },
    });
  }

  async handleNft(data) {
    return axios.post(`${this.server_uri}nft/handle-nft`, data, {
      headers: {
        authorization: "Bearer " + this.token,
      },
    });
  }
}
