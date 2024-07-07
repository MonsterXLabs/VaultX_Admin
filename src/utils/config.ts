import process from "process";

export const chain = process.env.REACT_APP_NODE_ENV === "DEV" ? "80002" : "137";

export const contractAddress =
  process.env.REACT_APP_NODE_ENV === "DEV"
    ? "0xAAdcdEC98CE6C560C6e4b1C2B1b31258D5C1AF9A"
    : "0xC7a4088E192b4dfe1ED382e5458c3388149D64B8";

export const explorer =
  process.env.REACT_APP_NODE_ENV === "DEV"
    ? "https://amoy.polygonscan.com/"
    : "https://polygonscan.com";

export const network =
  process.env.REACT_APP_NODE_ENV === "DEV" ? "Amoy" : "Polygon";
