import axios from "axios"

const server_uri = import.meta.env.VITE_BACKEND_URL

export class CreateNftServices {
  async createBasicDetails(data) {
    const token = localStorage.getItem("userToken")
    return await axios.post(`${server_uri}nft/create-basic-details`, data, {
      headers: {
        authorization: "Bearer " + token,
        "Content-Type": "application/x-www-form-urlencoded",
      },
    })
  }

  async createAdvancedDetails(data) {
    const token = localStorage.getItem("userToken")
    return await axios.post(`${server_uri}nft/add-advanced-details`, data, {
      headers: {
        authorization: "Bearer " + token,
        "Content-Type": "application/x-www-form-urlencoded",
      },
    })
  }

  async createSellerDetails(data) {
    const token = localStorage.getItem("userToken")
    return await axios.post(`${server_uri}nft/add-shipment-details`, data, {
      headers: {
        authorization: "Bearer " + token,
      },
    })
  }

  async createVoucher(data) {
    const token = localStorage.getItem("userToken")
    return await axios.post(`${server_uri}nft/add-voucher`, data, {
      headers: {
        authorization: "Bearer " + token,
      },
    })
  }

  async mintAndSale(data) {
    const token = localStorage.getItem("userToken")
    return await axios.post(`${server_uri}nft/mint-and-sale`, data, {
      headers: {
        authorization: "Bearer " + token,
      },
    })
  }

  /**
   *
   * @param {Object} data
   * @param {string} data.nftId
   * @returns
   */
  async removeFromDb(data) {
    const token = localStorage.getItem("userToken")
    return await axios.post(`${server_uri}nft/delete`, data, {
      headers: {
        authorization: "Bearer " + token,
      },
    })
  }

  async editNft(data) {
    const token = localStorage.getItem("userToken")
    return await axios.post(`${server_uri}nft/editNft`, data, {
      headers: {
        authorization: "Bearer " + token,
        "Content-Type": "application/x-www-form-urlencoded",
      },
    })
  }
}