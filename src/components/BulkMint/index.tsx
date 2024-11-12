import Header from "../Header/Header";
import React, { useEffect, useRef, useState } from 'react';
import Papa from 'papaparse';
import JSZip, { folder } from 'jszip';
import { CreateCategoryServices } from "@/services/categoryServices";
import { CurationType, IUserArtist } from "@/types";
import { CreateCurationServices } from "@/services/curationServices";
import { getAllArtists } from "@/services/services";
import LoadingOverlay from "../LoadingOverlay";
import { basename, dashname, truncate } from "@/lib/utils";

interface ISelectType {
  _id: string;
  name: string;
}

interface Props {
  render?: React.ReactNode;
}

interface ShippingInformation {
  length: string;
  width: string;
  height: string;
  weight: string;
}

// SellerInfo Interface
interface SellerAddress {
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postalCode: string;
}

interface ISellerInfo {
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
interface IContact {
  _id: string;
  userId: string;
  name?: string;
  contactInfo?: string;
}

interface IUploadImage {
  name: string;
  data: string;
  file: File;
}

interface NFTData {
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
}

type UserProjectMap = Record<string, {
  artists: IUserArtist[],
  sellerInfo: ISellerInfo[],
  contacts: IContact[],
}>;

const sampleCSVData = [
  ["name", "price", "symbol", "artist", "properties", "address"],
  ["NFT One", "0.1 ETH", "NFT1", "Artist A", "{\"rarity\": \"rare\", \"type\": \"art\"}", "0x123abc"],
  ["NFT Two", "0.2 ETH", "NFT2", "Artist B", "{\"rarity\": \"common\", \"type\": \"collectible\"}", "0x456def"],
  ["NFT Three", "0.3 ETH", "NFT3", "Artist C", "{\"rarity\": \"epic\", \"type\": \"art\"}", "0x789ghi"]
];

export default function BulkMint(props: Props) {
  const [loading, setLoading] = useState(false);
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [zipFile, setZipFile] = useState<File | null>(null);
  const [nftData, setNftData] = useState<NFTData[]>([]);
  const csvInputRef = useRef<HTMLInputElement>(null);
  const zipInputRef = useRef<HTMLInputElement>(null);
  const [loadMore, setLoadMore] = useState<({
    description: boolean;
    attachment: boolean;
    certificate: boolean;
  })[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [curations, setCurations] = useState<CurationType[]>([]);
  const [userDetails, setUserDetails] = useState<UserProjectMap>({});
  const [propertyFields, setPropertyFields] = useState<string[]>([]);
  const categoryServices = new CreateCategoryServices();
  const curationServices = new CreateCurationServices();

  const fetchCategoryList = async () => {
    const { data: { categories = [{}], categoriesMeta = 0 } = {} } =
      await categoryServices.getAllCategory({
        skip: 0,
        limit: 10
      });
    setCategories(categories);
  }

  const fetchCurations = async () => {
    const { data: { curations = [{}], curationCount = 0 } = {} } =
      await curationServices.getAllCollections({
        searchInput: "",
        skip: 0,
        limit: 100,
        filter: null,
      });
    setCurations(curations);
  }

  const fetchArtists = async () => {
    const { data } = await getAllArtists();
    setUserDetails(data);
  }

  const fetchAll = async () => {
    setLoading(true);
    try {
      await Promise.all([fetchCategoryList(), fetchCurations(), fetchArtists()]);
      setLoading(false);
    } catch (err) {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchAll();
  }, []);
  const handleCSVFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    setCsvFile(file || null);
  };

  const handleZipFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    setZipFile(file || null);
  };

  const fillBlanks = (headers: string[]): string[] => {
    let lastValue = '';
    return headers.map(header => {
      if (header === '') {
        return lastValue; // Replace blank with last seen non-blank value
      } else {
        lastValue = header; // Update last seen non-blank value
        return header;
      }
    });
  }

  const trimStringArray = (arr: string[]): string[] => {
    return arr.map(str => str.trim());
  }

  const parseCSV = async (file: File) => {
    // Function to detect delimiter by reading a small portion of the file
    const detectDelimiter = async (file: File): Promise<string> => {
      const text = await file.text();
      const commaCount = (text.match(/,/g) || []).length;
      const tabCount = (text.match(/\t/g) || []).length;
      return commaCount > tabCount ? ',' : '\t';
    };

    // Detect the delimiter
    const delimiter = await detectDelimiter(file);

    const data = await new Promise((resolve, reject) => {
      Papa.parse(file, {
        delimiter, // Use the detected delimiter
        skipEmptyLines: true,
        complete: (results) => {
          resolve(results.data)
        },
        error: (error) => reject(error),
      });
    }) as any[];


    // Assuming the first two rows are the header rows
    let mainHeaders: string[] = fillBlanks(trimStringArray(data[0]));
    const subHeaders: string[] = trimStringArray(data[1]);

    const propertyFields = [];
    mainHeaders.forEach((header, index) => {
      if (header === 'Properties' && subHeaders[index])
        propertyFields.push(subHeaders[index]);
    });
    setPropertyFields(propertyFields);

    // Remove the first two header rows from the data
    const rows = data.slice(2);

    // Convert parsed CSV data to desired JSON format
    const formattedData: NFTData[] = await Promise.all(rows.map((row: any) => {
      const rowData: { [key: string]: string | object } = {};

      // Map combined headers to row data
      mainHeaders.forEach((header: string, index: number) => {
        if (!subHeaders[index])
          rowData[header] = row[index];
        else if (!rowData[header]) {
          rowData[header] = {
            [typeof subHeaders[index] === 'string' ? subHeaders[index].toLowerCase() : subHeaders[index]]: row[index],
          };
        } else if (typeof rowData[header] === 'object') {
          rowData[header] = {
            ...rowData[header],
            [typeof subHeaders[index] === 'string' ? subHeaders[index].toLowerCase() : subHeaders[index]]: row[index],
          }
        }
      });

      const selectedCuration = curations.filter(curation => curation.name === rowData['Curation'])?.[0];
      const curationDetail = userDetails[typeof selectedCuration?.owner === 'string' ? selectedCuration?.owner : selectedCuration?.owner?._id];
      const selectedArtist = curationDetail?.artists.filter(item => (item.name === rowData["Artist name"]))?.[0];
      const selectedShipping = curationDetail?.sellerInfo.filter(item => (item.name === rowData["Shipping info"]))?.[0];
      const selectedContact = curationDetail?.contacts.filter(item => (item.name === rowData["Contact info"]))?.[0];
      const selectedCategory = categories.filter(item => item.name === rowData["Category"])?.[0];
      // Generate structured JSON based on combined headers
      return {
        name: rowData["Artworks Title"] as string,
        description: rowData["Description"] as string,
        price: rowData["Price (USD)"] as string,
        artist: {
          name: selectedArtist?.name,
          _id: selectedArtist?._id,
        },
        logo: null,
        attachments: [],
        curation: selectedCuration,
        unlockable: rowData["Unlockable Content"] as string,
        certificates: [],
        category: {
          name: selectedCategory.name,
          _id: selectedCategory._id,
        },
        properties: rowData["Properties"],
        shipping: {
          name: selectedShipping?.name,
          _id: selectedShipping?._id,
        },
        contact: {
          name: selectedContact?.name,
          _id: selectedContact?._id,
        },
        shipmentInfo: {
          length: rowData["Shipment Information"]?.["length(cm)"],
          width: rowData["Shipment Information"]?.["width(cm)"],
          height: rowData["Shipment Information"]?.["height(cm)"],
          weight: rowData["Shipment Information"]?.["weight(kg)"],
        },
        curationDetail,
      };
    })
    );

    return formattedData
  };

  const unzipFile = async (file: File, nftList: NFTData[]) => {
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
            if (relativePath.includes('/logo.')) {
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

  const generateNFTList = async () => {
    if (!csvFile || !zipFile) {
      alert("Please upload both CSV and ZIP files.");
      return;
    }

    setLoading(true);
    try {
      let nftList = await parseCSV(csvFile);
      nftList = await unzipFile(zipFile, nftList);
      let loadList = [];
      for (var i = 0; i < nftList.length; i++) {
        loadList.push({
          description: true,
          attachment: true,
          certificate: true,
        })
      }
      setLoadMore(loadList);
      setNftData(nftList);
      setLoading(false);
    } catch (err) {
      setLoading(false);
    }

  };

  const handleChangeCuration = (index: number, curationId: string) => {
    const nftList = [...nftData];
    const curation = curations.filter(item => (item._id === curationId))?.[0];
    const curationDetail = userDetails[typeof curation?.owner === 'string' ? curation?.owner : curation?.owner?._id];

    nftList[index] = {
      ...nftList?.[index],
      curation,
      curationDetail,
    }
    setNftData(nftList);
  }

  const handleChangeArtist = (index: number, artistId: string) => {
    const nftList = [...nftData];
    const curationDetail = nftList[index]?.curationDetail;
    const selectedArtist = curationDetail?.artists.filter(artist => (artist._id === artistId))?.[0];

    nftList[index] = {
      ...nftList?.[index],
      artist: {
        name: selectedArtist?.name,
        _id: selectedArtist?._id,
      },
    };

    setNftData(nftList);
  }

  const handleChangeShipping = (index: number, shippingId: string) => {
    const nftList = [...nftData];
    const curationDetail = nftList[index]?.curationDetail;
    const selectedShipping = curationDetail?.sellerInfo.filter(shipping => shipping._id === shippingId)?.[0];

    nftList[index] = {
      ...nftList?.[index],
      shipping: {
        name: selectedShipping?.name,
        _id: selectedShipping?._id,
      }
    }

    setNftData(nftList);
  }

  const handleChangeContact = (index: number, contactId: string) => {
    const nftList = [...nftData];
    const curationDetail = nftList[index]?.curationDetail;
    const selectedContact = curationDetail?.contacts.filter(contact => contact._id === contactId)?.[0];

    nftList[index] = {
      ...nftList?.[index],
      contact: {
        name: selectedContact?.name,
        _id: selectedContact?._id,
      }
    }
    setNftData(nftList);
  }

  const handleChangeCategory = (index: number, categoryId: string) => {
    const nftList = [...nftData];
    const selectedCategory = categories.filter(contact => contact._id === categoryId)?.[0];

    nftList[index] = {
      ...nftList?.[index],
      category: {
        name: selectedCategory?.name,
        _id: selectedCategory?._id,
      }
    }
    setNftData(nftList);
  }

  const downloadSampleCSV = () => {
    const csvContent = sampleCSVData.map(e => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "sample_nft_metadata.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <section className="dashboard__area" >
      <LoadingOverlay loading={loading} />

      {props.render}
      < Header />
      <div className="text-white-50">
        <div className="dashboard__admin__area">
          <div className="admin__inner__blk">
            <div className="admin__content">
              <h4>Bulk Mint</h4>
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center mb-4 text-sm">
          <div className="upload__file__with__name">
            <input
              type="file"
              accept=".csv"
              onChange={handleCSVFileChange}
              ref={csvInputRef}
              hidden
            />
            <button
              type="button"
              onClick={() => csvInputRef.current?.click()}
              className="inline-flex w-full"
            >
              Upload CSV
              <span className="ml-2">
                <img src="assets/img/Upload_ico.svg" alt="" />
              </span>
            </button>
            <span id="custom-text">
              {csvFile ? `${csvFile.name} file selected.` : "Choose File"}
            </span>
          </div>

          <button
            onClick={generateNFTList}
            className="common__btn"
          >
            Import NFT List
          </button>
        </div>

        <div className="flex justify-between items-center mb-6 text-sm">
          <div className="upload__file__with__name">
            <input
              type="file"
              accept=".zip"
              onChange={handleZipFileChange}
              ref={zipInputRef}
              hidden
            />
            <button
              type="button"
              onClick={() => zipInputRef.current?.click()}
              className="w-full"
            >
              Upload ZIP
              <span className="ml-2">
                <img src="assets/img/Upload_ico.svg" alt="" />
              </span>
            </button>
            <span id="custom-text">
              {zipFile ? `${zipFile.name} file selected.` : "Choose File"}
            </span>
          </div>

          <button
            onClick={() => { }}
            className="common__btn"
          >
            Bulk Mint
          </button>
        </div>

        <div className="dashboard__table__wrapper">
          <div className="dashboard__table mt-10 overflow-x-auto w-full">
            {nftData.length > 0 && (
              <table className="table w-full text-center items-center">
                <thead>
                  {/* First Row */}
                  <tr className="text-gray-400 border-b border-gray-700">
                    <th rowSpan={2} className="px-4 py-2 align-middle">No</th>
                    <th rowSpan={2} className="px-4 py-2 min-w-[400px] align-middle">Logo</th>
                    <th rowSpan={2} className="px-4 py-2 align-middle">Artworks Title</th>
                    <th rowSpan={2} className="px-4 py-2 min-w-[400px] align-middle">Description</th>
                    <th rowSpan={2} className="px-4 py-2 min-w-[400px] align-middle">Attachments</th>
                    <th rowSpan={2} className="px-4 py-2 align-middle">Price (USD)</th>
                    <th rowSpan={2} className="px-4 py-2 min-w-[300px] align-middle">Artist Name</th>
                    <th rowSpan={2} className="px-4 py-2 min-w-[300px] align-middle">Curation</th>
                    <th rowSpan={2} className="px-4 py-2 align-middle">Unlockable Content</th>
                    <th rowSpan={2} className="px-4 py-2 min-w-[400px] align-middle">Unlockable Attachments</th>
                    <th rowSpan={2} className="px-4 py-2 min-w-[300px] align-middle">Category</th>
                    {/* Merged Header for Properties */}
                    <th colSpan={propertyFields.length} className="px-4 py-2">Properties</th>

                    <th rowSpan={2} className="px-4 py-2 min-w-[300px] align-middle">Shipping Info</th>
                    <th rowSpan={2} className="px-4 py-2 min-w-[300px] align-middle">Contact Info</th>

                    {/* Merged Header for Shipment Information */}
                    <th colSpan={4} className="px-4 py-2">Shipment Information</th>
                  </tr>
                  {/* Second Row */}
                  <tr className="text-gray-400 border-b border-gray-700">
                    {/* Properties Subheaders */}
                    {
                      propertyFields.map((field, index) => (
                        <th className="px-4 py-2" key={index}>{field}</th>
                      ))
                    }

                    {/* Shipping Info Subheaders */}
                    <th className="px-4 py-2">Length (cm)</th>
                    <th className="px-4 py-2">Width (cm)</th>
                    <th className="px-4 py-2">Height (cm)</th>
                    <th className="px-4 py-2">Weight (kg)</th>
                  </tr>
                </thead>
                <tbody>
                  {
                    nftData.map((nft, index) => {
                      return (
                        <tr key={index} className="border-b border-gray-700 hover:bg-gray-700">
                          <td className="px-4 py-2">{index + 1}</td>
                          <td className="px-4 py-2">
                            {nft.logo ? (
                              <img src={nft.logo.data} alt={`NFT ${nft.logo.name}`} width="400" className="rounded" loading="lazy" />
                            ) : (
                              'No image'
                            )}
                          </td>
                          <td className="px-4 py-2">{nft.name}</td>
                          <td className="px-4 py-2">
                            <p
                              className="text-sm font-normal azeret-mono-font"
                              dangerouslySetInnerHTML={{
                                __html: loadMore?.[index]?.description
                                  ? truncate(nft.description, 150)?.replace(/\r\n|\n/g, '<br />')
                                  : nft.description?.replace(/\r\n|\n/g, '<br />'),
                              }}
                            ></p>
                            {
                              nft.description?.length > 150 ? (
                                <span
                                  className="text-[#DDF247] cursor-pointer"
                                  onClick={() => {
                                    const newArr = [...loadMore];
                                    newArr[index].description = !newArr[index].description;
                                    setLoadMore(newArr);
                                  }}
                                >
                                  {loadMore?.[index]?.description ? 'View More...' : 'Less...'}
                                </span>
                              ) : null
                            }
                          </td>
                          <td className="px-4 py-2">
                            {
                              (loadMore?.[index]?.attachment ? nft.attachments?.slice(0, 1) : nft.attachments).map((attach, subIndex) => (
                                <div className="flex flex-col items-center" key={subIndex}>
                                  <img src={attach.data} alt={`Attach ${attach.name}`} width="400" className="rounded" loading="lazy" />
                                  <span
                                    className="break-words"
                                    title={attach.name ?? ''}
                                  >
                                    {attach.name
                                      ? truncate(attach.name, 100)
                                      : 'No files selected'}
                                  </span>
                                </div>
                              ))
                            }
                            {
                              nft.attachments?.length > 1 ? (
                                <span
                                  className="text-[#DDF247] cursor-pointer"
                                  onClick={() => {
                                    const newArr = [...loadMore];
                                    newArr[index].attachment = !newArr[index].attachment;
                                    setLoadMore(newArr);
                                  }}
                                >
                                  {loadMore?.[index]?.attachment ? 'View More...' : 'Less...'}
                                </span>
                              ) : null
                            }
                          </td>
                          <td className="px-4 py-2">{nft.price}</td>
                          <td className="px-4 py-2">
                            <select
                              aria-label="Select Artist"
                              className="w-full border-none bg-[#232323] h-[52px] px-[15px] py-[15px] rounded-xl placeholder:text-xs azeret-mono-font justify-start items-center gap-[30px] inline-flex text-white/[53%] text-sm focus-visible:border-0 focus-visible:outline-none focus-visible:shadow-none"
                              name="curation"
                              onChange={(e) => {
                                handleChangeArtist(index, (e.target as any).value);
                              }
                              }
                              value={nft.artist?._id ?? ''}
                            >
                              <option value="" className="text-[11px]">
                                You must choose Artist*
                              </option>
                              {nft?.curationDetail?.artists.length > 0
                                ? nft?.curationDetail?.artists?.map((item, index: number) => (
                                  <option key={index} value={item._id}>
                                    {item.name}
                                  </option>
                                ))
                                : null}
                            </select>
                          </td>
                          <td className="px-4 py-2">
                            <select
                              aria-label="Select curation"
                              className="w-full border-none bg-[#232323] h-[52px] px-[15px] py-[15px] rounded-xl placeholder:text-xs azeret-mono-font justify-start items-center gap-[30px] inline-flex text-white/[53%] text-sm focus-visible:border-0 focus-visible:outline-none focus-visible:shadow-none"
                              name="curation"
                              onChange={(e) => {
                                handleChangeCuration(index, (e.target as any).value);
                              }
                              }
                              value={nft.curation?._id ?? ''}
                            >
                              <option value="" className="text-[11px]">
                                You must choose Curation*
                              </option>
                              {curations.length > 0
                                ? curations?.map((item, index: number) => (
                                  <option key={index} value={item._id}>
                                    {item.name}
                                  </option>
                                ))
                                : null}
                            </select>
                          </td>
                          <td className="px-4 py-2">{nft.unlockable}</td>
                          <td className="px-4 py-2">
                            {
                              (loadMore?.[index]?.certificate ? nft?.certificates.slice(0, 1) : nft.certificates).map((attach, subIndex) => (
                                <div className="flex flex-col items-center" key={subIndex}>
                                  <img src={attach.data} alt={`Attach ${attach.name}`} width="400" className="rounded" loading="lazy" />
                                  <span
                                    className="break-words"
                                    title={attach.name ?? ''}
                                  >
                                    {attach.name
                                      ? truncate(attach.name, 100)
                                      : 'No files selected'}
                                  </span>
                                </div>
                              ))
                            }
                            {
                              nft.certificates?.length > 1 ? (
                                <span
                                  className="text-[#DDF247] cursor-pointer"
                                  onClick={() => {
                                    const newArr = [...loadMore];
                                    newArr[index].certificate = !newArr[index].certificate;
                                    setLoadMore(newArr);
                                  }}
                                >
                                  {loadMore?.[index]?.certificate ? 'View More...' : 'Less...'}
                                </span>
                              ) : null
                            }
                          </td>
                          <td className="px-4 py-2">
                            <select
                              aria-label="Select a category"
                              className="w-full border-none bg-[#232323] h-[52px] px-[15px] py-[15px] rounded-xl placeholder:text-xs azeret-mono-font justify-start items-center gap-[30px] inline-flex text-white/[53%] text-sm focus-visible:border-0 focus-visible:outline-none focus-visible:shadow-none"
                              name="country"
                              onChange={(e) => {
                                handleChangeCategory(index, (e.target as any).value);
                              }}
                              value={nft.category?._id ?? ""}
                            >
                              <option value="">Select</option>
                              {categories.map((item: any) => (
                                <option key={item._id} value={item._id}>
                                  {item.name}
                                </option>
                              ))}
                            </select>
                          </td>

                          {/* Properties Columns */}
                          {
                            propertyFields.map((field, index) => (
                              <td className="px-4 py-2" key={index}>{nft.properties?.[field.toLowerCase()]}</td>
                            ))
                          }
                          <td className="px-4 py-2">
                            <select
                              aria-label="Select Shipping"
                              className="w-full border-none bg-[#232323] h-[52px] px-[15px] py-[15px] rounded-xl placeholder:text-xs azeret-mono-font justify-start items-center gap-[30px] inline-flex text-white/[53%] text-sm focus-visible:border-0 focus-visible:outline-none focus-visible:shadow-none"
                              name="Shipping"
                              onChange={(e) => {
                                handleChangeShipping(index, (e.target as any).value);
                              }
                              }
                              value={nft.shipping?._id ?? ''}
                            >
                              <option value="" className="text-[11px]">
                                You must choose Shipping Info*
                              </option>
                              {nft?.curationDetail?.sellerInfo.length > 0
                                ? nft?.curationDetail?.sellerInfo?.map((item, index: number) => (
                                  <option key={index} value={item._id}>
                                    {item.name}
                                  </option>
                                ))
                                : null}
                            </select>
                          </td>
                          <td className="px-4 py-2">
                            <select
                              aria-label="Select Contact"
                              className="w-full border-none bg-[#232323] h-[52px] px-[15px] py-[15px] rounded-xl placeholder:text-xs azeret-mono-font justify-start items-center gap-[30px] inline-flex text-white/[53%] text-sm focus-visible:border-0 focus-visible:outline-none focus-visible:shadow-none"
                              name="Contact"
                              onChange={(e) => {
                                handleChangeContact(index, (e.target as any).value);
                              }
                              }
                              value={nft.contact?._id ?? ''}
                            >
                              <option value="" className="text-[11px]">
                                You must choose Contact Info*
                              </option>
                              {nft?.curationDetail?.contacts.length > 0
                                ? nft?.curationDetail?.contacts?.map((item, index: number) => (
                                  <option key={index} value={item._id}>
                                    {item.name}
                                  </option>
                                ))
                                : null}
                            </select>
                          </td>
                          {/* Shipment Info Columns */}
                          <td className="px-4 py-2">{nft.shipmentInfo?.length}</td>
                          <td className="px-4 py-2">{nft.shipmentInfo?.width}</td>
                          <td className="px-4 py-2">{nft.shipmentInfo?.height}</td>
                          <td className="px-4 py-2">{nft.shipmentInfo?.weight}</td>
                        </tr>
                      )
                    })}
                </tbody>
              </table>
            )}
          </div>
        </div>
        <div>
          <div className="table__bottom__area">
          </div>
        </div>
      </div>
    </section>
  )
}