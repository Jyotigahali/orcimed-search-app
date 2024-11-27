import React, { useState } from 'react';
import ReactPaginate from 'react-paginate';
import { useNavigate } from 'react-router-dom';

const WorksheetTable = ({ worksheetData, selectedWorksheet, itemsPerPage, currentPage,columnNames, handlePageClick, renderCell }) => {

    const navigate = useNavigate();

    // Initialize filters for each column (excluding SlNo)
    const [filters, setFilters] = useState(() => {
        const initialFilters = {};
        columnNames.forEach((colName, colIndex) => {
            initialFilters[`column${colIndex}`] = ''; // Use dynamic filter keys for each column
        });
        return initialFilters;
    });

    // Function to handle filter change for each column
    const handleFilterChange = (e, columnIndex) => {
        const value = e.target.value;
        setFilters((prevFilters) => ({
            ...prevFilters,
            [`column${columnIndex}`]: value,
        }));
    };

    // Apply the filters only to the specific column data (excluding SlNo column)
    const filteredData = worksheetData.filter((row) => {
        return row?.values[0].every((cell, colIndex) => {
            const filterValue = filters[`column${colIndex}`] || '';
            if (filterValue !== '') {
                return String(row?.values[0][colIndex] || '').toLowerCase().includes(filterValue.toLowerCase());
            }
            return true; // If no filter applied to the column, include the row
        });
    });

    // Paginate the filtered data
    const paginatedData = filteredData.slice(
        currentPage * itemsPerPage,
        (currentPage + 1) * itemsPerPage
    );
    

    const handleRowClick = (data,columns) => {
        navigate("/detailedView",{state: {rows : {data}, columns :{columns}}})
    }
    const from = currentPage * itemsPerPage + 1;
    const to = Math.min((currentPage + 1) * itemsPerPage, filteredData?.length);
    const paginationTotal = `Showing records ${from} to ${to} of ${filteredData?.length}`
    return (
        <div className='workSheetTable'>
            {worksheetData.length > 0 && selectedWorksheet && (
                <h6>
                    Selected Worksheet: {selectedWorksheet}
                </h6>
            )}

            <div className="table-responsive" style={{ overflowX: 'auto', overflowY: 'auto', display: 'block' }}>
                <table className="table table-bordered table-striped">
                    <thead className="thead-dark">
                        <tr>
                            {/* <th>SlNo</th> */}
                            {columnNames?.map((col,colIndex) => (
                                <th key={col?.id} hidden = {col?.name.toLowerCase() === 'strike row'}>
                                    {col?.name}
                                    <input
                                        type="text"
                                        value={filters[`column${colIndex}`]}
                                        onChange={(e) => handleFilterChange(e, colIndex)}
                                        placeholder={col?.name}
                                        // className="w-100 fs-6"
                                        style={{ width: '100%',fontSize:'12px' }}
                                    />
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {paginatedData.length > 0 ? (
                            paginatedData.map((row, rowIndex) => (
                                <tr key={rowIndex}
                                onClick={() => handleRowClick(row?.values, columnNames)}
                                >
                                    {row?.values[0].map((value, colIndex) => 
                                                <td key={colIndex}
                                        style={{
                                            textDecoration: row.values[0].includes('s')
                                              ? 'line-through'
                                              : 'none',
                                              color : row.values[0].map(item => item.toString().toLowerCase()).includes('s') ? 'red' : 'black'
                                          }}
                                          hidden = {colIndex === 0 && columnNames[0]?.name.toLowerCase() === 'strike row'}
                                          >
                                           {renderCell(value)}
                                        </td>
                                    )}
                                </tr>
                            ))
                        ) : (
                            // Show a message if no matching rows are found
                            <tr>
                                <td colSpan={columnNames.length} >
                                    No matching rows found
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
                
            </div>
            <div className='d-flex align-items-center justify-content-between mt-2'>
            {filteredData.length > 0 ? <p>{paginationTotal} </p> : null}
            {/* Pagination */}
            {filteredData.length > itemsPerPage && (
                <ReactPaginate
                    previousLabel={"<"}
                    nextLabel={">"}
                    breakLabel={"..."}
                    pageCount={Math.ceil(filteredData.length / itemsPerPage)}
                    marginPagesDisplayed={2}
                    pageRangeDisplayed={5}
                    onPageChange={handlePageClick}
                    containerClassName={"pagination"}
                    activeClassName={"active"}
                    pageClassName={"page-item"}
                    pageLinkClassName={"page-link"}
                    previousClassName={"page-item"}
                    previousLinkClassName={"page-link"}
                    nextClassName={"page-item"}
                    nextLinkClassName={"page-link"}
                    breakClassName={"page-item"}
                    breakLinkClassName={"page-link"}
                    // className='paginaten'
                />
            )}
            
            </div>
        </div>
    );
};

export default WorksheetTable;


