import { basename, countOccurrences, dashname } from "@/lib/utils";
import { IUploadImage, NFTData } from "../dto";
import JSZip from "jszip";

export const unzipFile = async (zipFile: File, nftList: NFTData[]) => {
  // Process ZIP file
  const zip = new JSZip();
  const contents = await zip.loadAsync(zipFile);

  const folderNames = new Set<string>();
  contents.forEach((relativePath, file) => {
    const rootFolder = relativePath.split('/')[0];
    if (!file.dir) folderNames.add(rootFolder);
  });

  const sortedFolderNames = Array.from(folderNames).sort((a, b) => {
    return parseInt(a, 10) - parseInt(b, 10);
  });

  let index = 0;

  for (const folderName of sortedFolderNames) {
    if (index >= nftList.length)
      break;
    const nft = nftList[index];
    nft.attachments = [];
    nft.certificates = [];

    const folder = contents.folder(folderName);

    for (const relativePath in folder.files) {
      const fileContent = folder.files[relativePath];
      if (!fileContent || fileContent.dir || !relativePath.startsWith(`${folderName}/`))
        continue;

      try {
        const fileName = basename(relativePath);
        const blob = await fileContent.async('blob');
        const urlData = URL.createObjectURL(blob);
        const file = new File([blob], fileName);
        const uploadImage: IUploadImage = {
          name: fileName,
          data: urlData,
          file,
        };

        if (/\.(jpg|jpeg|png)$/i.test(fileName)) {
          // Check if the file is in logo, unlockable, or attachments
          if (countOccurrences(relativePath, "/") == 1) {
            nft.logo = uploadImage;
          } else if (relativePath.includes('/unlockable/')) {
            nft.certificates.push(uploadImage);
          } else if (relativePath.includes('/attach/')) {
            uploadImage.name = dashname(uploadImage.name);
            nft.attachments.push(uploadImage);
          }
        }
      } catch (err) {
      }
    }
    index++;
  }
  return nftList;
}