import { getItemWithExpiry, setItemWithExpiry } from "@/lib/utils";
import axios from "axios";

const baseURL = `${import.meta.env.VITE_BACKEND_URL}mint`;

const getCurations = async (json) => {
    const token = getItemWithExpiry("token");

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
    const token = getItemWithExpiry("token");

    const response = await axios.get(`${baseURL}/getUserToken`, {
        params: {
            userId: json.userId,
        },
        headers: {
            authorization: "Bearer " + token,
        },
    });

    if (response && response.data) {
        setItemWithExpiry("userToken", response.data.token);
        return true
    }

    return false
}

export {
    getCurations,
    saveUserToken
}