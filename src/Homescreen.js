import React, { useState } from 'react';
import { getFileWorkSheets, getSheetTables, getTableColumns, getWorkSheetData } from './ServiceFile';
import { OverlayTrigger, Tooltip, Spinner } from 'react-bootstrap';
import WorksheetButtons from './components/WorksheetButtons';
import WorksheetTable from './components/WorksheetTable';
import Sidebar from './components/SideBar';

const HomeScreen = ({ error, files, token, searcheItem }) => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [worksheets, setWorkSheets] = useState([]);
    const [columns, setColumns] = useState([]);
    const [worksheetData, setWorkSheetData] = useState([]);
    const [selectedWorksheet, setSelectedWorksheet] = useState('');
    const [currentPage, setCurrentPage] = useState(0);
    const itemsPerPage = 25;

    const [loading, setLoading] = useState(false); // Handles general loading state
    const [loadingWorksheets, setLoadingWorksheets] = useState(false); // Handles worksheet-specific loading state

    // Handle file click
    const handleFileClick = (file) => {
        setSelectedFile(file); // Set the selected file
        setSelectedWorksheet(''); // Reset selected worksheet when a new file is selected
        setLoading(true); // Start the loading state for file worksheets
        getFileWorkSheets(file?.id, token)
            .then((res) => {
                setWorkSheets(res);
            })
            .catch((err) => console.error(err))
            .finally(() => setLoading(false)); // End the loading state after fetching worksheets
    };

    // Remove ".xlsx" from filenames for display
    const cleanFileName = (fileName) => fileName.replace('.xlsx', '');

    // Handle worksheet click and fetch its data
    const handleWorkSheetData = (workSheet) => {
        setSelectedWorksheet(workSheet?.name); // Set the selected worksheet
        setLoadingWorksheets(true); // Start loading state for fetching worksheet data

        getSheetTables(selectedFile?.id, token, workSheet?.id)
            .then((res) => {
                res.length > 0
                    ? getTableColumns(selectedFile?.id, token, workSheet?.id, res[0])
                        .then((res) => setColumns(res))
                        .catch((err) => console.error(err))
                    : setColumns([]);
            })
            .catch((err) => console.error(err));

        getWorkSheetData(selectedFile?.id, workSheet?.name, token)
            .then((res) => setWorkSheetData(res.filter(row => row.some(num => num.toString().includes(searcheItem)))))
            .catch((err) => console.error(err))
            .finally(() => setLoadingWorksheets(false)); // End loading state after data is fetched
            
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
                    maxWidth: '150px',
                    cursor: 'pointer'
                }}>
                    {text}
                </span>
            </OverlayTrigger>
        );
    };

    return (
        <div style={{ display: 'flex', fontFamily: 'Arial, sans-serif' }}>
            {/* Sidebar */}
            <Sidebar
                files={files}
                selectedFile={selectedFile}
                handleFileClick={handleFileClick}
                cleanFileName={cleanFileName}
                error={error}
                loading={loading} // Pass the loading state to Sidebar
            />

            {/* Main Content */}
            <main style={{
                flexGrow: 1,
                padding: '20px',
                marginLeft: '350px',
                overflowY: 'auto'
            }}>
                <h2 style={{ color: '#343a40' }}>Welcome to the Home Screen</h2>
                {selectedFile?.name ? (
                    <div>
                        <h4 style={{ color: '#343a40', margin: "10px" }}>Selected File: {cleanFileName(selectedFile?.name)}</h4>

                        {/* Show loader while fetching worksheets */}
                        {loading ? (
                            <div style={{ fontSize:"20px", paddingLeft:"10px", fontWeight:'bold', paddingTop:"20px" }}
                            >
                                <span>Loading...</span>
                            </div>
                        ) : (
                            <>
                                <WorksheetButtons
                                    worksheets={worksheets}
                                    handleWorkSheetData={handleWorkSheetData}
                                />

                                {/* Show loader while fetching worksheet data */}
                                {loadingWorksheets ? (
                                    <div style={{  marginTop:'120px', padding:"20px", textAlign:"center" }}
                                    >
                                        <Spinner animation="border" variant="primary" />
                                    </div>
                                ) : (
                                    <WorksheetTable
                                        worksheetData={worksheetData}
                                        selectedWorksheet={selectedWorksheet}
                                        itemsPerPage={itemsPerPage}
                                        currentPage={currentPage}
                                        columnNames={columns}
                                        handlePageClick={handlePageClick}
                                        renderCell={renderCell}
                                    />
                                )}
                            </>
                        )}
                    </div>
                ) : (
                    <p>Please select a file from the sidebar to view its worksheets.</p>
                )}
            </main>
        </div>
    );
};

export default HomeScreen;
