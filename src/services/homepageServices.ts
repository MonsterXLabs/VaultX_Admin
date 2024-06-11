import axios from "axios";

export class HomepageServices {
  server_uri: string;

  constructor() {
    this.server_uri = import.meta.env.VITE_BACKEND_URL || ""; // Use NEXT_PUBLIC_ prefix for environment variables
  }

  async getToken(): Promise<string | null> {
    return localStorage.getItem("token");
  }

  async addMediaBanner(data: any): Promise<any> {
    const token = await this.getToken();
    return axios.post(`${this.server_uri}homepage/add-media-banners`, data, {
      headers: {
        authorization: "Bearer " + token,
      },
    });
  }

  async getMedia(): Promise<any> {
    const res = await axios.get(`${this.server_uri}homepage/get-media`);
    return res.data.media;
  }

  async addMediaLimits(data: any): Promise<any> {
    const token = await this.getToken();
    return axios.post(`${this.server_uri}homepage/add-media-limits`, data, {
      headers: {
        authorization: "Bearer " + token,
      },
    });
  }

  async addSection1(data: any): Promise<any> {
    const token = await this.getToken();
    return axios.post(`${this.server_uri}homepage/add-section1`, data, {
      headers: {
        authorization: "Bearer " + token,
      },
    });
  }

  async addSection2(data: any): Promise<any> {
    const token = await this.getToken();
    return axios.post(`${this.server_uri}homepage/add-section2`, data, {
      headers: {
        authorization: "Bearer " + token,
      },
    });
  }

  async addSection3(data: any): Promise<any> {
    const token = await this.getToken();
    return axios.post(`${this.server_uri}homepage/add-section3`, data, {
      headers: {
        authorization: "Bearer " + token,
      },
    });
  }

  async addSection4(data: any): Promise<any> {
    const token = await this.getToken();
    return axios.post(`${this.server_uri}homepage/add-section4`, data, {
      headers: {
        authorization: "Bearer " + token,
      },
    });
  }

  async getSections(): Promise<any> {
    const token = await this.getToken();
    return axios.get(`${this.server_uri}homepage/get-sections`, {
      headers: {
        authorization: "Bearer " + token,
      },
    });
  }
}
