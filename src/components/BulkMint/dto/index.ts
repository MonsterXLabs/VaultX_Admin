import { CurationType, IUserArtist } from "@/types";
import { Address } from "thirdweb";
import { z } from "zod";

export interface ISelectType {
  _id: string;
  name: string;
}

export interface INFTVoucher {
  curationId: bigint;
  tokenURI: string;
  price: bigint;
  royaltyWallet: Address;
  royaltyPercentage: bigint;
  paymentWallets: Address[];
  paymentPercentages: bigint[];
  signature?: `0x${string}`;
}

export interface ShippingInformation {
  length: string;
  width: string;
  height: string;
  weight: string;
}

// SellerInfo Interface
export interface SellerAddress {
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postalCode: string;
}

export interface ISellerInfo {
  _id: string;
  userId: string;
  type?: string;
  name?: string;
  shippingAddr?: string;
  email?: string;
  country?: string;
  address?: SellerAddress;
  phoneNumber?: string;
}

// Contact Interface
export interface IContact {
  _id: string;
  userId: string;
  name?: string;
  contactInfo?: string;
}

export interface IUploadImage {
  name: string;
  data: string;
  file: File;
  url?: string;
}

export interface NFTData {
  name: string;
  description: string;
  curation: CurationType;
  unlockable: string;
  category: ISelectType;
  price: string;
  artist: ISelectType;
  properties: any;
  shipping: ISelectType;
  contact: ISelectType;
  shipmentInfo: ShippingInformation;
  logo: IUploadImage | null;
  attachments: IUploadImage[];
  certificates: IUploadImage[];
  curationDetail: {
    artists: IUserArtist[],
    sellerInfo: ISellerInfo[],
    contacts: IContact[],
  };
  voucher?: string;
  minted?: boolean;
  pinataUri?: string;
  mintedBy?: string;
  nftURL?: string;
}

export const NFTSchema = z.object({
  name: z.string({
    required_error: "Please enter NFT name",
    invalid_type_error: "Please enter NFT name",
  }).nonempty("Please enter NFT name"),
  description: z.string({
    required_error: "Please select a template",
    invalid_type_error: "Please select a template",
  }).nonempty("Please select a template"),
  curation: z.object({
    _id: z.string({
      required_error: "Please select a curation",
      invalid_type_error: "Please select a curation",
    }),
  }),
  category: z.object({
    _id: z.string({
      required_error: "Please select a category",
      invalid_type_error: "Please select a category",
    }),
  }),
  price: z.string(({
    required_error: "please enter price.",
    invalid_type_error: "Please enter price.",
  })),
  artist: z.object({
    _id: z.string({
      required_error: "Please select an artist",
      invalid_type_error: "Please select an artist",
    }),
  }),
  shipping: z.object({
    _id: z.string({
      required_error: "Please select Shipping information",
      invalid_type_error: "Please select shipping information"
    }),
  }),
  contact: z.object({
    _id: z.string({
      required_error: "Please select contact information",
      invalid_type_error: "Please select contact information",
    }),
  }),
  logo: z.object({
    url: z.string({
      required_error: "AWS not uploaded",
      invalid_type_error: "AWS not uploaded",
    }),
  }),
  attachments: z.array(z.object({
    url: z.string(),
  })).optional(),
  certificates: z.array(z.object({
    url: z.string(),
  })).optional(),
});

export const ExtendedNFTSchema = NFTSchema.extend({
  logo: z.object({
    file: z.instanceof(File),
  }),
  attachments: z.array(z.object({
    file: z.instanceof(File),
  })).optional(),
  certificates: z.array(z.object({
    file: z.instanceof(File),
  })).optional(),
});

export type UserProjectMap = Record<string, {
  artists: IUserArtist[],
  sellerInfo: ISellerInfo[],
  contacts: IContact[],
}>;