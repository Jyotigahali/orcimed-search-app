import React, { useState } from 'react';
import { getFileWorkSheets, getWorkSheetData } from './ServiceFile';
import 'bootstrap/dist/css/bootstrap.min.css'; // Bootstrap import
import ReactPaginate from 'react-paginate'; // Pagination library
import { OverlayTrigger, Tooltip } from 'react-bootstrap'; // For Tooltip

const HomeScreen = ({ error, files, token }) => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [worksheets, setWorkSheets] = useState([]);
    const [worksheetData, setWorkSheetData] = useState([]);
    const [selectedWorksheet, setSelectedWorksheet] = useState(''); // New state for the selected worksheet name
    const [currentPage, setCurrentPage] = useState(0); // Pagination state
    const itemsPerPage = 5; // Items per page for pagination

    // Handle file click
    const handleFileClick = (file) => {
        setSelectedFile(file); // Set the selected file
        setSelectedWorksheet(''); // Reset selected worksheet when a new file is selected
        getFileWorkSheets(file.id, token)
            .then((res) => setWorkSheets(res))
            .catch((err) => console.error(err));
    };

    // Remove ".xlsx" from filenames for display
    const cleanFileName = (fileName) => fileName.replace('.xlsx', '');

    // Handle worksheet click and fetch its data
    const handleWorkSheetData = (workSheet) => {
        setSelectedWorksheet(workSheet); // Set the selected worksheet
        getWorkSheetData(selectedFile?.id, workSheet, token)
            .then((res) => setWorkSheetData(res))
            .catch((err) => console.error(err));
    };

    // Pagination handling
    const handlePageClick = ({ selected }) => {
        setCurrentPage(selected);
    };

    // Truncate long text and show full on hover
    const renderCell = (text) => {
        return (
            <OverlayTrigger
                placement="top"
                overlay={<Tooltip>{text}</Tooltip>}
            >
                <span style={{
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    display: 'block',
                    maxWidth: '150px', // Fixed cell width
                    cursor: 'pointer'
                }}>
                    {text}
                </span>
            </OverlayTrigger>
        );
    };

    // Calculate paginated data
    const paginatedData = worksheetData.slice(
        currentPage * itemsPerPage,
        (currentPage + 1) * itemsPerPage
    );

    return (
        <div style={{ display: 'flex', height: '100vh', fontFamily: 'Arial, sans-serif' }}>
            {/* Sidebar */}
            <nav style={{
                width: '350px',
                backgroundColor: 'rgba(50, 145, 156, 1)', // Updated sidebar background color
                padding: '20px',
                color: '#ffffff', // Text color for sidebar
                borderRight: '1px solid #e9ecef',
                overflowY: 'auto',  // Sidebar scrolling
                position: 'fixed',  // Fixed position to allow independent scrolling
                height: '100vh'  // Full height for scrolling
            }}>
                <h2 style={{ color: '#ffc107' }}>Orcimed</h2> {/* Company name */}
                <h4 style={{ borderBottom: '2px solid #ffc107', paddingBottom: '10px' }}>Files List</h4>
                {files?.length > 0 ? (
                    <ul style={{ listStyleType: 'none', padding: 0 }}>
                        {files.map((file, index) => (
                            <li key={index} onClick={() => handleFileClick(file)}
                                style={{
                                    padding: '10px 0',
                                    borderBottom: '1px solid #e9ecef',
                                    cursor: 'pointer',
                                    color: selectedFile?.id === file.id ? '#ffffff' : '#ffffff', // White text color for both states
                                    backgroundColor: selectedFile?.id === file.id ? 'rgba(3, 102, 116, 1)' : 'transparent' // Highlighted background color
                                }}
                            >
                                {index + 1}. {cleanFileName(file.name)}
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No files found.</p>
                )}
                {error && <p style={{ color: 'red' }}>Error: {error}</p>}
            </nav>

            {/* Main Content */}
            <main style={{
                flexGrow: 1,
                padding: '20px',
                marginLeft: '350px', // Leave space for the fixed sidebar
                overflowY: 'auto'  // Enable vertical scrolling for main content
            }}>
                <h2 style={{ color: '#343a40' }}>Welcome to the Home Screen</h2>
                {selectedFile?.name ? (
                    <div>
                        <h4 style={{ color: '#343a40', margin: "10px" }}>Selected File: {cleanFileName(selectedFile?.name)}</h4>

                        {/* Display worksheet buttons */}
                        <div style={{ marginBottom: '20px' }}>
                            <h5>Worksheets:</h5>
                            {worksheets.length > 0 ? (
                                worksheets.map((worksheet, index) => (
                                    <button
                                        key={index}
                                        onClick={() => handleWorkSheetData(worksheet.name)}
                                        className="btn btn-primary m-2"
                                    >
                                        {worksheet.name}
                                    </button>
                                ))
                            ) : (
                                <p>No worksheets found.</p>
                            )}
                        </div>

                        {/* Show the selected worksheet name above the table */}
                        {worksheetData.length > 0 && selectedWorksheet && (
                            <h5 style={{
                                fontWeight: 'bold',
                                color: 'rgba(3, 102, 116, 1)',
                                marginBottom: '10px'
                            }}>
                                Selected Worksheet: {selectedWorksheet}
                            </h5>
                        )}

                        {/* Display worksheet data in Bootstrap table */}
                        {worksheetData.length > 0 ? (
                            <div className="table-responsive" style={{
                                overflowX: 'auto',  // Horizontal scroll for the table
                                maxHeight: '400px',  // Vertical scroll for table height
                                overflowY: 'auto',
                                display: 'block'
                            }}>
                                <table className="table table-bordered table-striped">
                                    <thead className="thead-dark">
                                        <tr>
                                            <th>Updated</th>
                                            <th>Date of Addition</th>
                                            <th>Type of SDEA (Cip...)</th>
                                            <th>Name of Partner</th>
                                            <th>Generic Name</th>
                                            <th>Brand Name</th>
                                            <th>Approval</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {paginatedData.map((row, rowIndex) => (
                                            <tr key={rowIndex}>
                                                {Object.values(row).map((value, colIndex) => (
                                                    <td key={colIndex}>
                                                        {renderCell(value)} {/* Truncate and show tooltip */}
                                                    </td>
                                                ))}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>

                                {/* Pagination */}
                                <ReactPaginate
                                    previousLabel={"Previous"}
                                    nextLabel={"Next"}
                                    breakLabel={"..."}
                                    pageCount={Math.ceil(worksheetData.length / itemsPerPage)}
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
                                />
                            </div>
                        ) : (
                            <p>Select a worksheet to view its data.</p>
                        )}
                    </div>
                ) : (
                    <p>Select a file from the sidebar to view more details.</p>
                )}
            </main>
        </div>
    );
};

export default HomeScreen;
