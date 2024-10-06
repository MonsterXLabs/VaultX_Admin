import {
  IAdvancedDetailFormData,
  IAdvancedDetailOption,
  IBasicDetailFormData,
  ISellerInfo,
  IUserArtist,
  PaymentSplitType,
} from '@/types'; // Ensure proper path or alias configuration
import { createContext, Provider, ReactNode, useContext, useState } from 'react';

interface NFTContextType {
  curation: any;
  setCuration: (data: any) => void;
  basicDetail: IBasicDetailFormData;
  setBasicDetail: (data: Partial<IBasicDetailFormData>) => void;
  advancedOptions: IAdvancedDetailOption;
  setAdvancedOptions: (data: Partial<IAdvancedDetailOption>) => void;
  advancedDetails: IAdvancedDetailFormData;
  setAdvancedDetails: (data: Partial<IAdvancedDetailFormData>) => void;
  paymentSplits: Array<PaymentSplitType>;
  setPaymentSplits: (data: Array<PaymentSplitType>) => void;
  sellerInfo: ISellerInfo;
  setSellerInfo: (data: Partial<ISellerInfo>) => void;
  userArtists: IUserArtist[];
  setUserArtists: (data: IUserArtist[]) => void;
  selectedArtist: string | null;
  setSelectedArtist: (data: string | null) => void;
}

interface CreateNFTProviderProps {
  children: ReactNode;
}

// Create the NFT Context
const CreateNFTContext = createContext<NFTContextType | undefined>(undefined);
const AuthContext = createContext<NFTContextType | undefined>(undefined);

// Create the context provider component
export const CreateNFTProvider = ({
  children,
}) => {
  const [basicDetail, setBasicDetail] = useState<IBasicDetailFormData>({
    productName: null,
    productDescription: null,
    artistName: null,
    price: 0,
    curation: null,
    file: null,
    imageSrc: null,
    attachments: [null],
    curations: [],
  });

  const setPartialBasicDetail = (data: Partial<IBasicDetailFormData>) => {
    setBasicDetail((prev) => ({
      ...prev,
      ...data,
    }));
  };

  const [options, setOptions] = useState<IAdvancedDetailOption>({
    freeMint: true,
    royalties: false,
    unlockable: false,
    category: false,
    split: false,
  });

  const setAdvancedOptions = (data: Partial<IAdvancedDetailOption>) => {
    setOptions((prev) => ({
      ...prev,
      ...data,
    }));
  };

  const [advancedDetails, setAdvancedDetails] =
    useState<IAdvancedDetailFormData>({
      royaltyAddress: null,
      royalty: null,
      unlockable: null,
      category: null,
      address: null,
      percentage: null,
      unlockableContent: null,
      certificates: [null],
      propertyTemplateId: null,
      attributes: [],
    });

  const setPartialAdvancedDetails = (
    data: Partial<IAdvancedDetailFormData>,
  ) => {
    setAdvancedDetails((prev) => ({
      ...prev,
      ...data,
    }));
  };

  const [paymentSplits, setPaymentSplits] = useState<Array<PaymentSplitType>>(
    [],
  );

  const [sellerInfo, setSellerInfo] = useState<ISellerInfo>({
    shipping: null,
    shippingId: null,
    contactId: null,
    contact: null,
    accepted: false,
    width: null,
    height: null,
    length: null,
    weight: null,
  });

  const setPartialSellerInfo = (data: Partial<ISellerInfo>) => {
    setSellerInfo((prev) => ({
      ...prev,
      ...data,
    }));
  };

  const [userArtists, setUserArtists] = useState<IUserArtist[]>([]);
  const [selectedArtist, setSelectedArtist] = useState<string | null>(null);

  const [curation, setCuration] = useState<any>(null);
  return (
    <CreateNFTContext.Provider value={{
      curation,
      setCuration,
      basicDetail,
      setBasicDetail: setPartialBasicDetail,
      sellerInfo,
      setSellerInfo: setPartialSellerInfo,
      advancedOptions: options,
      setAdvancedOptions,
      advancedDetails,
      setAdvancedDetails: setPartialAdvancedDetails,
      paymentSplits,
      setPaymentSplits(data) {
        setPaymentSplits(data);
      },
      userArtists,
      setUserArtists,
      selectedArtist,
      setSelectedArtist,
    }
    }>
      {children}
    </CreateNFTContext.Provider>
  );
};

// Custom hook to use the CreateNFT context
export const useCreateNFT = () => {
  const context = useContext(CreateNFTContext);
  if (!context) {
    throw new Error(
      'create NFT context must be used within Create NFT Provider',
    );
  }
  return context;
};
