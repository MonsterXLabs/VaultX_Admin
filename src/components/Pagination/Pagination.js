import { useState } from "react";
import Dropdown from "../Dropdown/Dropdown";
import PageChanger from "../PageChanger/PageChanger";
/*
this will return queryPagination,
which  will have to parameter 1) recordsToSkip 2)recordsToGet
*/
const Pagination = ({ totalRecords, queryPagination }) => {
  const [pageSize, setPageSize] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const count = [5, 10, 15, 20, 50, 100];

  const totalPages = totalRecords;

  const handlePageChange = async ({ page }) => {
    setCurrentPage(page);
  };

  queryPagination({
    recordsToSkip: pageSize * (currentPage - 1),
    recordsToGet: pageSize,
  });

  return (
    <div>
      <div className="table__bottom__area">
        <div className="table__bottom__select">
          <p>Showing</p>
          <div className="categorie__select select_black_bg">
            <Dropdown data={count} value={pageSize} setValue={setPageSize} />
          </div>
          <p>of {totalRecords}</p>
        </div>
        <div className="table__pagination">
          <PageChanger
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      </div>
    </div>
  );
};

export default Pagination;
