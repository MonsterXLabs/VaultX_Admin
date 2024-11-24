import Header from "../Header/Header";
import React, { useEffect, useState } from 'react';
import LoadingOverlay from "../LoadingOverlay";
import { useBulkFetch } from "./hooks/use-bulk-fetch";
import { UploadFile } from "./UploadFile";
import { NFTData } from "./dto";
import { useParseCSV } from "./hooks/use-parse-csv";
import { unzipFile } from "./hooks/unzip-file";
import { NFTTable } from "./NFTTable";
import { bulkAction } from "./hooks/use-bulk-mint";
import { v4 as uuidv4 } from "uuid";
import AWS from "aws-sdk";

interface Props {
  render?: React.ReactNode;
}

export default function BulkMint(props: Props) {
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [zipFile, setZipFile] = useState<File | null>(null);
  const [nftData, setNftData] = useState<NFTData[]>([]);

  const { loading, setLoading, categories, curations, userDetails, fetchAll } = useBulkFetch();
  const { propertyFields, parseCSV } = useParseCSV({ categories, curations, userDetails });

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

  const generateNFTList = async () => {
    if (!csvFile || !zipFile) {
      alert("Please upload both CSV and ZIP files.");
      return;
    }

    setLoading(true);
    try {
      let nftList = await parseCSV(csvFile);
      nftList = await unzipFile(zipFile, nftList);
      setNftData(nftList);
      setLoading(false);
    } catch (err) {
      setLoading(false);
    }

  };

  const handleBulkMint = async () => {
    bulkAction(nftData, setNftData, userDetails, categories);
  }

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
          <UploadFile title="Upload CSV" accept=".csv" file={csvFile} handleChange={handleCSVFileChange} />
          <button
            onClick={generateNFTList}
            className="common__btn"
          >
            Import NFT List
          </button>
        </div>

        <div className="flex justify-between items-center mb-6 text-sm">
          <UploadFile title="Upload ZIP" accept=".zip" file={zipFile} handleChange={handleZipFileChange} />
          <button
            onClick={() => { handleBulkMint() }}
            className="common__btn"
          >
            Bulk Mint
          </button>
        </div>

        <div className="dashboard__table__wrapper">
          <div className="dashboard__table mt-10 overflow-x-auto w-full">
            {nftData.length > 0 && (
              <NFTTable propertyFields={propertyFields} nftData={nftData} setNftData={setNftData} categories={categories} curations={curations} nftLength={nftData.length} userDetails={userDetails} />
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