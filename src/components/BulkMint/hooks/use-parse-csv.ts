import { useState } from "react";
import Papa from 'papaparse';
import { NFTData, UserProjectMap } from "../dto";
import { CurationType } from "@/types";
import { filterJsonObject } from "@/lib/utils";

export interface useParseCSVProps {
  curations: CurationType[],
  categories: any[],
  userDetails: UserProjectMap,
}

export const useParseCSV = ({ curations, userDetails, categories }: useParseCSVProps) => {
  const [propertyFields, setPropertyFields] = useState<string[]>([]);

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
    let subHeaders: string[] = trimStringArray(data[1]);

    // Remove empty columns
    const nonEmptyColumns = mainHeaders.map((_, colIndex) => {
      return data.some((row, rowIndex) => rowIndex > 1 && row[colIndex]?.trim() !== "");
    });

    mainHeaders = mainHeaders.filter((_, colIndex) => nonEmptyColumns[colIndex]);
    subHeaders = subHeaders.filter((_, colIndex) => nonEmptyColumns[colIndex]);
    // Remove the first two header rows from the data
    const rows = data.slice(2).map(row => row.filter((_, colIndex) => nonEmptyColumns[colIndex]));


    const propertyFields = [];
    mainHeaders.forEach((header, index) => {
      if (header === 'Properties' && subHeaders[index])
        propertyFields.push(subHeaders[index]);
    });
    setPropertyFields(propertyFields);

    const filteredRows = rows.filter((row) =>
      row.some((field: string) => field.trim() !== "")
    );

    // Convert parsed CSV data to desired JSON format
    const formattedData: NFTData[] = await Promise.all(filteredRows.map((row: any) => {
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
            ...(rowData[header] as object),
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
        price: (rowData["Price (USD)"] as string).replace(",", "").trim(),
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
          name: selectedCategory?.name,
          _id: selectedCategory?._id,
        },
        properties: filterJsonObject(rowData["Properties"]),
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

  return {
    propertyFields, parseCSV,
  };
}