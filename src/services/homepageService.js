import axios from "axios";

export class HomepageServices {
  constructor() {
    this.server_uri = process.env.REACT_APP_BACKEND_URL; // Declare a class-level variable
  }

  async getToken() {
    return localStorage.getItem("token");
  }

  async addMediaBanner(data) {
    const token = await this.getToken();
    return axios.post(`${this.server_uri}homepage/add-media-banners`, data, {
      headers: {
        authorization: "Bearer " + token,
      },
    });
  }

  async getMedia() {
    const res = await axios.get(`${this.server_uri}homepage/get-media`)
    return res.data.media
  }

  async addMediaLimits(data) {
    const token = await this.getToken();
    return axios.post(`${this.server_uri}homepage/add-media-limits`, data, {
      headers: {
        authorization: "Bearer " + token,
      },
    });
  }

  async addSection1(data) {
    const token = await this.getToken();
    return axios.post(`${this.server_uri}homepage/add-section1`, data, {
      headers: {
        authorization: "Bearer " + token,
      },
    });
  }

  async addSection2(data) {
    const token = await this.getToken();
    return axios.post(`${this.server_uri}homepage/add-section2`, data, {
      headers: {
        authorization: "Bearer " + token,
      },
    });
  }

  async addSection3(data) {
    const token = await this.getToken();
    return axios.post(`${this.server_uri}homepage/add-section3`, data, {
      headers: {
        authorization: "Bearer " + token,
      },
    });
  }

  async addSection4(data) {
    const token = await this.getToken();
    return axios.post(`${this.server_uri}homepage/add-section4`, data, {
      headers: {
        authorization: "Bearer " + token,
      },
    });
  }

  async getSections(){
    const token = await this.getToken();
    return axios.get(this.server_uri+'homepage/get-sections',{
      headers: {
        authorization: "Bearer " + token,
      },
    })
  }
}
