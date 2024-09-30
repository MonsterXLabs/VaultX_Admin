import { prepareContractCall, sendTransaction, readContract, resolveMethod, prepareEvent, getContractEvents, waitForReceipt, parseEventLogs } from "thirdweb";
import { address, chain, contract, maxBlocksWaitTime } from "./contract";
import { client } from "./client";

export const trimString = (trimString) => {
  if (!trimString) return "";
  return trimString.length > 30
    ? trimString.slice(0, 5) + "..." + trimString.slice(-4)
    : trimString;
};

export async function getFileFromUrl(url, name, defaultType = "image/png") {
  const response = await fetch(url);
  const data = await response.blob();
  return new File([data], name, {
    type: data.type || defaultType,
  });
}

export function getYouTubeVideoId(url) {
  const regExp =
    /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
  const match = url.match(regExp);
  return match && match[7]?.length === 11 ? match[7] : null;
}

export const handleCopyClick = async (textToCopy) => {
  console.log('hiii', textToCopy)
  try {
    await navigator.clipboard.writeText(textToCopy);
    console.log("Text copied to clipboard!");
  } catch (error) {
    console.error("Error copying text:", error);
  }
};

export const getEventArray = async (logs, eventName) => {
  const preparedEvent = prepareEvent({
    contract,
    signature: eventName
  });
  const events = await getContractEvents({
    contract,
    events: [preparedEvent]
  });
  return events;
};

export const setFeesToBlockchain = async (_fee, _account) => {
  const transaction = await prepareContractCall({
    contract,
    method: "function setFee(uint256 _protocolFee)",
    params: [_fee * 100]
  });
  const { transactionHash } = await sendTransaction({
    transaction,
    account: _account
  })
};

export const getFeesFromBlockchain = async () => {
  const data = await readContract({
    contract,
    method: 'function protocolFee() view returns (uint256)',
    params: []
  })
  return data;
};

export const releaseEscrowAdmin = async (
  _tokenId,
  _resolve,
  description,
  _account
) => {
  const transaction = await prepareContractCall({
    contract,
    method: resolveMethod("resolveDispute"),
    params: [_tokenId, _releaseEscrow, description]
  });
  const { transactionHash } = await sendTransaction({
    transaction,
    account: _account
  })
};

export const handleCurator = async (curator, _isCurator, _account) => {
  const transaction = await prepareContractCall({
    contract,
    method: resolveMethod("setCurators"),
    params: [[curator], _isCurator]
  });
  const { transactionHash } = await sendTransaction({
    transaction,
    account: _account
  })
};

export const handleAdmin = async (admin, _isAdmin, _account) => {
  const transaction = await prepareContractCall({
    contract,
    method: "function setAdmin(address[] admins, bool _isAdmin)",
    params: [[admin], _isAdmin]
  });
  const { transactionHash } = await sendTransaction({
    transaction,
    account: _account
  })
}

export const checkAdmin = async (admin, _account) => {
  const data = await readContract({
    contract,
    method: "function isAdmin(address) view returns (bool)",
    params: [admin]
  })

  return data;
}
export const handleSignData = async (curationId, tokenURI, price, royaltyWallet, royaltyPercentage, paymentWallets, paymentPercentages, _account) => {
  const NFTVoucher = {
    curationId,
    tokenURI,
    price,
    royaltyWallet,
    royaltyPercentage,
    paymentWallets,
    paymentPercentages,
  };

  // Define the domain for EIP-712 signature
  const domain = {
    name: "MonsterXNFT-Voucher",
    version: "1",
    verifyingContract: address,
    chainId: chain.id,
  };

  // Define the types for the NFTVoucher
  const types = {
    NFTVoucher: [
      { name: "curationId", type: "uint256" },
      { name: "tokenURI", type: "string" },
      { name: "price", type: "uint256" },
      { name: "royaltyWallet", type: "address" },
      { name: "royaltyPercentage", type: "uint256" },
      { name: "paymentWallets", type: "address[]" },
      { name: "paymentPercentages", type: "uint256[]" },
    ],
  };

  const signature = await _account.signTypedData({ domain, types, message: NFTVoucher, primaryType: "NFTVoucher" });
  NFTVoucher.signature = signature;
  // check signature
  const signerAddr = await readContract({
    contract,
    method: "function _verify((uint256 curationId, string tokenURI, uint256 price, address royaltyWallet, uint256 royaltyPercentage, address[] paymentWallets, uint256[] paymentPercentages, bytes signature) voucher) view returns (address)",
    params: [NFTVoucher]
  })
  if (signerAddr !== _account.address)
    throw new Error("signature is not valid.");
  return NFTVoucher;

}

export const releaseEscrow = async (tokenId, account) => {
  const transaction = await prepareContractCall({
    contract,
    method: 'function releaseEscrow(uint256 tokenId) payable',
    params: [BigInt(tokenId)],
  });
  const { transactionHash } = await sendTransaction({
    transaction,
    account,
  });

  const receipt = await waitForReceipt({
    client,
    chain,
    transactionHash,
    maxBlocksWaitTime,
  });

  const protocolFeeEvent = prepareEvent({
    signature: 'event ProtocolFee(address user, uint256 amount)',
  });

  const royaltyEvent = prepareEvent({
    signature: 'event RoyaltyPurchased(address user, uint256 amount)',
  });

  const paymentSplitEvent = prepareEvent({
    signature: 'event PaymentSplited(address user, uint256 amount)',
  });

  const escrowReleasedEvent = prepareEvent({
    signature: 'event EscrowReleased(uint256 indexed tokenId)',
  });

  const events = await parseEventLogs({
    logs: receipt.logs,
    events: [
      protocolFeeEvent,
      royaltyEvent,
      paymentSplitEvent,
      escrowReleasedEvent,
    ],
  });

  return events
    ? {
      events,
      transactionHash,
    }
    : null;
};

export const exitEscrow = async (tokenId, _account) => {
  const transaction = await prepareContractCall({
    contract,
    method: "function exitEscrow(uint256 tokenId)",
    params: [BigInt(tokenId)]
  });
  const { transactionHash } = await sendTransaction({
    transaction,
    account: _account
  });

  const receipt = await waitForReceipt({
    client,
    chain,
    transactionHash,
    maxBlocksWaitTime,
  });

  const exitEscrowEvent = prepareEvent({
    signature: "event ExitEscrow(uint256 indexed tokenId)"
  });

  const events = await parseEventLogs({
    logs: receipt.logs,
    events: [exitEscrowEvent]
  });

  return events.length > 0
    ? {
      events,
      transactionHash,
    }
    : null;
}