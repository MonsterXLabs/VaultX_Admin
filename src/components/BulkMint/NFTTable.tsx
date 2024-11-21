import React, { useEffect, useState } from "react";
import { NFTData, NFTSchema, UserProjectMap } from "./dto";
import { truncate } from "@/lib/utils";
import { CurationType } from "@/types";
import { z } from "zod";

const tableSchema = NFTSchema.array();

type Row = z.infer<typeof NFTSchema>;
type RowErrorType = Partial<Record<keyof Row, string>>;

interface NFTTableProps {
  propertyFields: string[];
  nftData: NFTData[];
  setNftData: (data: NFTData[]) => void;
  categories: any[];
  curations: CurationType[];
  nftLength: number;
  userDetails: UserProjectMap;
}

export const NFTTable: React.FC<NFTTableProps> = ({
  propertyFields,
  nftData,
  setNftData,
  categories,
  curations,
  nftLength,
  userDetails,
}: NFTTableProps) => {
  const [loadMore, setLoadMore] = useState<({
    description: boolean;
    attachment: boolean;
    certificate: boolean;
  })[]>([]);

  const [errors, setErrors] = useState<Record<number, RowErrorType>>([]);

  useEffect(() => {
    let loadList = [...loadMore];
    for (var i = 0; i < nftLength; i++) {
      validateRow(i, nftData[i]);
      if (i >= loadMore.length) {
        loadList.push({
          description: true,
          attachment: true,
          certificate: true,
        })

      } else {
        continue;
      }
    }
    setLoadMore(loadList);
  }, [nftLength]);

  const validateRow = (index: number, row: NFTData) => {
    const validation = NFTSchema.safeParse(row);
    if (!validation.success) {
      const fieldErrors: RowErrorType = {};
      validation.error.errors.forEach((err) => {
        if (err.path[0]) {
          fieldErrors[err.path[0] as keyof Row] = err.message;
        }
      })
      setErrors((prev) => ({ ...prev, [index]: fieldErrors }));
    } else {
      setErrors((prev) => ({ ...prev, [index]: {} }));
    }
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

    validateRow(index, nftList[index]);
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

    validateRow(index, nftList[index]);
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
    validateRow(index, nftList[index]);
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
    validateRow(index, nftList[index]);
    setNftData(nftList);
  }

  const handleChangeCuration = (index: number, curationId: string) => {
    const nftList = [...nftData];
    const curation = curations.filter(item => (item._id === curationId))?.[0];
    const curationDetail = userDetails[typeof curation?.owner === 'string' ? curation?.owner : curation?.owner?._id];

    nftList[index] = {
      ...nftList?.[index],
      curation,
      curationDetail,
    }
    validateRow(index, nftList[index]);
    setNftData(nftList);
  }

  return (
    <table className="table w-full text-center items-center">
      <thead>
        {/* First Row */}
        <tr className="text-gray-400 border-b border-gray-700">
          <th rowSpan={2} className="px-4 py-2 align-middle">No</th>
          <th rowSpan={2} className="px-4 py-2 align-middle">Minted</th>
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
                <td className="px-4 py-2">{nft?.minted ? "Yes" : "No"}</td>
                <td className="px-4 py-2">
                  {nft.logo ? (
                    <img src={nft.logo.data} alt={`NFT ${nft.logo.name}`} width="400" className="rounded" loading="lazy" />
                  ) : (
                    'No image'
                  )}
                  {errors[index]?.logo && <div className="text-[#DDF247] text-sm">{errors[index].logo}</div>}
                </td>
                <td className="px-4 py-2">
                  {nft.name}
                  {errors[index]?.name && <div className="text-[#DDF247] text-sm">{errors[index].name}</div>}
                </td>
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
                  {errors[index]?.description && <div className="text-[#DDF247] text-sm">{errors[index].description}</div>}
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
                <td className="px-4 py-2">
                  {nft.price}
                  {errors[index]?.price && <div className="text-[#DDF247] text-sm">{errors[index].price}</div>}
                </td>
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
                  {errors[index]?.artist && <div className="text-[#DDF247] text-sm">{errors[index].artist}</div>}
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
                  {errors[index]?.curation && <div className="text-[#DDF247] text-sm">{errors[index].curation}</div>}
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
                  {errors[index]?.category && <div className="text-[#DDF247] text-sm">{errors[index].category}</div>}
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
                  {errors[index]?.shipping && <div className="text-[#DDF247] text-sm">{errors[index].shipping}</div>}
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
                  {errors[index]?.contact && <div className="text-[#DDF247] text-sm">{errors[index].contact}</div>}
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
  );
}