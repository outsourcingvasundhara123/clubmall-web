import React from 'react';
import { Pagination } from 'react-bootstrap';

const DynamicPagination = ({ currentPage, totalPages, onPageChange }) => {
  // Create an array of page numbers
  let pages = [];
  for (let i = 1; i <= totalPages; i++) {
    pages.push(i);
  }

  // Function to handle click on a page
  const handleClick = (page) => {
    if (onPageChange) onPageChange(page);
  };

  return (
    <Pagination>
  <Pagination.Prev 
    onClick={() => handleClick(currentPage - 1)} 
    disabled={currentPage === 1} 
  />

  {/* Always render the first page */}
  <Pagination.Item 
    onClick={() => handleClick(1)} 
    active={currentPage === 1}
  >
    1
  </Pagination.Item>

  {/* Render ellipsis if currentPage is more than 2 steps away from first page */}
  {currentPage > 3 && <Pagination.Ellipsis />}

  {/* Render the two pages before the current page if they exist */}
  {currentPage - 2 > 1 && <Pagination.Item onClick={() => handleClick(currentPage - 2)}>{currentPage - 2}</Pagination.Item>}
  {currentPage - 1 > 1 && <Pagination.Item onClick={() => handleClick(currentPage - 1)}>{currentPage - 1}</Pagination.Item>}

  {/* Current page (not first or last) */}
  {currentPage !== 1 && currentPage !== totalPages && <Pagination.Item active>{currentPage}</Pagination.Item>}

  {/* Render the two pages after the current page if they exist */}
  {currentPage + 1 < totalPages && <Pagination.Item onClick={() => handleClick(currentPage + 1)}>{currentPage + 1}</Pagination.Item>}
  {currentPage + 2 < totalPages && <Pagination.Item onClick={() => handleClick(currentPage + 2)}>{currentPage + 2}</Pagination.Item>}

  {/* Render ellipsis if currentPage is more than 2 steps away from last page */}
  {currentPage < totalPages - 2 && <Pagination.Ellipsis />}

  {/* Always render the last page if it's not the first page */}
  {totalPages !== 1 && <Pagination.Item onClick={() => handleClick(totalPages)} active={currentPage === totalPages}>{totalPages}</Pagination.Item>}

  <Pagination.Next 
    onClick={() => handleClick(currentPage + 1)} 
    disabled={currentPage === totalPages} 
  />
</Pagination>

  );
};

export default DynamicPagination;
