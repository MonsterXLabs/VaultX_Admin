import { prepareContractCall, sendTransaction, readContract, resolveMethod, prepareEvent, getContractEvents } from "thirdweb";
import { contract } from "./contract";

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
  console.log('hiii',textToCopy)
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
    method: resolveMethod("setFee"), 
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
    method: resolveMethod("fee"), 
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
    method: resolveMethod("setAdmin"), 
    params: [[admin], _isAdmin] 
  });
  const { transactionHash } = await sendTransaction({ 
    transaction, 
    account: _account 
  })
}