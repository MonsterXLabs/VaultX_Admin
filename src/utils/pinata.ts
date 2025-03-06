import { PinataSDK } from "pinata";

const PINATA_JWT_SECRET = import.meta.env.VITE_PINATA_JWT_SECRET as string;
const pinataGateway = import.meta.env.VITE_PINATA_GATEWAY as string;

const pinata = new PinataSDK({
  pinataJwt: PINATA_JWT_SECRET,
  pinataGateway: pinataGateway,
});

export const uploadMetaData = async (data: any) => {
  let response = await pinata.upload.json(data);
  return pinataGateway + "/ipfs/" + response.IpfsHash;
};

export const uploadFile = async (file: any) => {
  console.log("upload file");
  const newFile = new File([file], file.name, {
    type: file.type,
    lastModified: file.lastModified,
  });
  let response = await pinata.upload.file(newFile);

  return pinataGateway + "/ipfs/" + response.IpfsHash;
};

export const getData = async (uri: string) => {
  const data = await pinata.gateways.get(uri);
  return data.data;
};
