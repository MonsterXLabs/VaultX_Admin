import { handleSignData } from "@/utils/helpers";
import { NFTData, UserProjectMap } from "../dto";
import { parseEther } from "viem";
import { imageUploadAwsS3 } from "@/utils/aws";
import { uploadMetaData } from "@/utils/pinata";
import { UserType } from "@/types";
import { adminAccount } from "@/utils/contract";
import { Certificate } from "crypto";


const generateSignatureOne = async (nftInfo: NFTData, userDetails: UserProjectMap, categories: any[]) => {
  try {
    const price = parseEther(nftInfo.price);
    const selectedCuration = nftInfo.curation;
    const nftOwner = typeof selectedCuration?.owner === 'string' ? selectedCuration?.owner : selectedCuration?.owner?._id;
    const curationDetail = userDetails[nftOwner];
    if (!curationDetail)
      throw new Error("Curation detail not exist.");
    const selectedArtist = curationDetail?.artists.filter(item => (item._id === nftInfo.artist._id))?.[0];
    const selectedShipping = curationDetail?.sellerInfo.filter(item => (item.name === nftInfo.shipping._id))?.[0];
    const selectedContact = curationDetail?.contacts.filter(item => (item.name === nftInfo.contact._id))?.[0];
    const selectedCategory = categories.filter(item => item.name === nftInfo.category._id)?.[0];

    const [myCloud, attachmentsUrls,] = await Promise.all([
      imageUploadAwsS3(nftInfo.logo.file), // Upload logo
      Promise.all( // Upload attachments in parallel
        nftInfo.attachments.map(async (attachment) => {
          const awsUpload = await imageUploadAwsS3(attachment.file);
          return awsUpload.Location; // Extract the location URL
        })
      ),
      Promise.all(
        nftInfo.certificates.map(async (certificate) => {
          const awsUPload = await imageUploadAwsS3(certificate.file);
          return awsUPload.Location;
        })
      ),
    ]);

    nftInfo.logo.url = myCloud.Location; // Logo URL
    nftInfo.attachments.forEach((attachment, index) => {
      attachment.url = attachmentsUrls[index]; // Attachments URLs
    });

    nftInfo.certificates.forEach((certificate, index) => {
      certificate.url = certificate[index];
    });

    // upload to pinata
    const walletAddress = (selectedCuration?.owner as UserType).wallet;
    const pinataUri = await uploadMetaData({
      wallet: walletAddress,
      productName: nftInfo.name,
      image: nftInfo.logo?.url,
      price: nftInfo?.price,
      artist: nftInfo?.artist.name,
      curation: selectedCuration.name,
      properties: nftInfo.properties,
      category: selectedCategory.name,
      unlockable: nftInfo?.unlockable,
      royalty: selectedArtist?.royalty,
      royaltyAddress: selectedArtist?.royaltyAddress,
      paymentSplits: selectedArtist?.paymentSplits,
    });

    nftInfo.pinataUri = pinataUri;
    // check decimals
    let royaltyPercentage = 0;
    if (selectedArtist.royaltyAddress) {
      royaltyPercentage = selectedArtist.royalty * 100;
    }

    let paymentWallets = [];
    let paymentPercentages = [];
    let sum = 0;
    for (var i = 0; i < selectedArtist.paymentSplits.length; i++) {
      sum += selectedArtist.paymentSplits[i].paymentPercentage;
      paymentWallets.push(selectedArtist.paymentSplits[i].paymentWallet);
      paymentPercentages.push(selectedArtist.paymentSplits[i].paymentPercentage * 100);
    }

    if (sum !== 100)
      throw new Error("Payment split error");
    const nftVoucher = await handleSignData(nftInfo.curation.tokenId, pinataUri, price, selectedArtist.royaltyAddress, royaltyPercentage, paymentWallets, paymentPercentages, adminAccount);

    const voucherString = JSON.stringify(nftVoucher, (key, value) =>
      typeof value === 'bigint' ? Number(value) : value
    );

    nftInfo.voucher = voucherString;
    nftInfo.mintedBy = nftOwner;
    return {
      ...nftInfo,
      logo: nftInfo?.logo?.url,
      attachments: nftInfo.attachments.map(attach => attach?.url),
      certificates: nftInfo.certificates.map(attach => attach?.url),
      certificateNames: nftInfo.certificates.map(attach => attach.name),
      curation: nftInfo.curation?._id,
      artist: nftInfo.artist.name,
      shipping: selectedShipping,
      contact: selectedContact,
      freeMinting: true,
      royalty: selectedArtist.royalty,
      royaltyAddress: selectedArtist.royaltyAddress,
      paymentSplits: selectedArtist.paymentSplits,
      category: nftInfo.category._id,
    };
  } catch (err) {
    console.log(err);
    return null;
  }
}

export const bulkAction = async (nftData: NFTData[], userDetails: UserProjectMap, categories: any[]) => {
  if (nftData.length <= 0)
    return;
  const nftTest = await generateSignatureOne(nftData[0], userDetails, categories);
  debugger;
  return;
}