import axios from "axios";

const baseURL =`${import.meta.env.VITE_BACKEND_URL}mint`;

const getCurations = async (json) => {
    const token = localStorage.getItem("token");

    return (await axios.get(`${baseURL}/curations`, {
        params: {
            search: json.search,
            page: json.page,
            limit: json.limit,
        },
        headers: {
            authorization: "Bearer " + token,
        },
    })).data
}

const saveUserToken = async (json) => {
    const response = await axios.get(`${baseURL}/getUserToken`, {
        params: {
            userId: json.userId,
        }
    });

    if (response && response.data) {
        localStorage.setItem("userToken", response.data.token);
        return true
    }

    return false
}

export {
    getCurations,
    saveUserToken
}