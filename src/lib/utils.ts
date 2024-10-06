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