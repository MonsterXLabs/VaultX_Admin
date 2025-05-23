import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { isAddress } from "thirdweb";
import { z } from "zod";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const isZodAddress = z.string().refine(isAddress, { message: "Invalid address" });

export const acceptedFormats = [
  '.jpg',
  '.jpeg',
  '.png',
  '.gif',
  '.webp',
  '.mp4',
  '.mp3',
];

// 1GB file size
export const maxFileSize = 1 * 1024 * 1024 * 1024; // 1GB in bytes

export function setItemWithExpiry(key: string, value: any, ttl = 30 * 60 * 1000) {
  const now = new Date();

  // `item` is an object which contains the value and the expiration time
  const item = {
    value: value,
    expiry: now.getTime() + ttl,  // Set expiry time in milliseconds
  };

  localStorage.setItem(key, JSON.stringify(item));
}

export function getItemWithExpiry(key: string) {
  const itemStr = localStorage.getItem(key);

  // If the item doesn't exist, return null
  if (!itemStr) {
    return null;
  }

  try {
    const item = JSON.parse(itemStr);
    const now = new Date();

    // Compare the expiry time with the current time
    if (now.getTime() > item.expiry) {
      // If the item has expired, remove it from storage and return null
      localStorage.removeItem(key);
      return null;
    }

    return item.value;
  } catch (err) {
    return null;
  }
}

export const truncate = (str: string, n: number = 100) => {
  if (!str) return '';
  return str.length > n ? str.substr(0, n - 1) + '...' : str;
};

export const basename = (path: string) => {
  return path.split('/').reverse()[0];
}

export const dashname = (name: string) => {
  return name.split("_").reverse()[0];
}

export const countOccurrences = (str, chat) => {
  const matches = str.match(new RegExp(chat, 'g'));
  return matches ? matches.length : 0; // Return 0 if no match found
};

export const filterJsonObject = (obj) => {
  return Object.fromEntries(
    Object.entries(obj).filter(([key, value]) => value !== null && value !== "")
  );
};