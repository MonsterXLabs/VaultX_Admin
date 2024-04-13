import React, { useState } from "react";

const PageChanger = ({ totalPages, onPageChange }) => {
  const [currentPage, setCurrentPage] = useState(1);

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      // Pass an object with page number and event to the parent component
      onPageChange({ page });
    }
  };

  const goToNextPage = () => {
    goToPage(currentPage + 1);
  };

  const goToPrevPage = () => {
    goToPage(currentPage - 1);
  };

  const goToFirstPage = () => {
    goToPage(1);
  };

  const goToLastPage = () => {
    goToPage(totalPages);
  };

  return (
    <div>
      <ul>
        <li>
          <a href="#" onClick={goToFirstPage}>
            <img src="assets/img/double_angle_left.svg" alt="" />
          </a>
        </li>
        <li>
          <a href="#" onClick={goToPrevPage}>
            <img src="assets/img/angle_left.svg" alt="" />
          </a>
        </li>
        <li className="active">
          <a href="#">{currentPage}</a>
        </li>
        {/* <li>
              <a href="#">2</a>
            </li>
            <li>
              <a href="#">3</a>
            </li>
            <li className="border-none">
              <a href="#">...</a>
            </li> */}
        {/* <li>
              <a href="#"onClick={goToNextPage}></a>
            </li> */}
        <li>
          <a href="#" onClick={goToNextPage}>
            <img src="assets/img/angle_right.svg" alt="" />
          </a>
        </li>
        <li>
          <a href="#" onClick={goToLastPage}>
            <img src="assets/img/double_angle_right.svg" alt="" />
          </a>
        </li>
      </ul>
    </div>
  );
};

export default PageChanger;
