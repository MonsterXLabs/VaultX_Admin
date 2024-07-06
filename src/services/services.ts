import axios from "axios";

export class CreateAdministratorServices {
  server_uri: string;

  constructor() {
    this.server_uri = import.meta.env.VITE_BACKEND_URL || ""; // Use NEXT_PUBLIC_ prefix for environment variables
  }

  async getToken(): Promise<string | null> {
    return localStorage.getItem("token");
  }

  async createAdmin(data: any): Promise<any> {
    const token = await this.getToken();
    return axios.post(`${this.server_uri}administrator/create-administrator`, data, {
      headers: {
        authorization: "Bearer " + token,
      },
    });
  }

  async loginAdmin(data: any): Promise<any> {
    const token = await this.getToken();
    return axios.post(`${this.server_uri}administrator/login-administrator`, data, {
      headers: {
        authorization: "Bearer " + token,
      },
    });
  }

  async getAllAdmins(data: { skip: number; limit: number }): Promise<any> {
    const token = await this.getToken();
    return axios.get(`${this.server_uri}administrator/get-all-administrator/${data.skip}/${data.limit}`, {
      headers: {
        authorization: "Bearer " + token,
      },
    });
  }

  async deleteAdmin(data: any): Promise<any> {
    const token = await this.getToken();
    return axios.post(`${this.server_uri}administrator/delete-administrator`, data, {
      headers: {
        authorization: "Bearer " + token,
      },
    });
  }
}


const server_uri = import.meta.env.VITE_BACKEND_URL

export const getContactsInfo = async() => {
  const token = localStorage.getItem("userToken")
  const contacts = await axios.get(`${server_uri}/info/get-contacts`, {
    headers: {
      authorization: "Bearer " + token,
    }
  })
  return contacts.data
}

export const getSellerInfo = async() => {
  const token = localStorage.getItem("userToken")
  const seller = await axios.get(`${server_uri}/info/get-sellers`, {
    headers: {
      authorization: "Bearer " + token,
    }
  })
  return seller.data
}

export const upsertContactInfo = async(payload) => {
  const token = localStorage.getItem("userToken")
  const contact = await axios.post(`${server_uri}/info/upsertContact`, payload, {
    headers: {
      authorization: "Bearer " + token,
    }
  })
  return contact
}

export const upsertSellerInfo = async(payload) => {
  const token = localStorage.getItem("userToken")
  const seller = await axios.post(`${server_uri}/info/upsertSeller`, payload, {
    headers: {
      authorization: "Bearer " + token,
    }
  })
  return seller
}

export const getProperties = async() => {
  const token = localStorage.getItem("userToken")
  const properties = await axios.get(`${server_uri}/info/get-properties`, {
    headers: {
      authorization: "Bearer " + token,
    }
  })

  return properties.data
}

export const upsertProperty = async(payload) => {
  const token = localStorage.getItem("userToken")
  const property = await axios.post(`${server_uri}/info/upsertProperty`, payload, {
    headers: {
      authorization: "Bearer " + token,
    }
  })

  return property
}
