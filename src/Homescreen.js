import React, { useEffect, useState } from 'react';
import { getFileWorkSheets, getWorkSheetData } from './ServiceFile';
import { OverlayTrigger, Tooltip } from 'react-bootstrap'; // For Tooltip
import WorksheetButtons from './components/WorksheetButtons';
import WorksheetTable from './components/WorksheetTable';
import Sidebar from './components/SideBar';

const HomeScreen = ({ error, files, token, searcheItem }) => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [worksheets, setWorkSheets] = useState([]);
    const [worksheetData, setWorkSheetData] = useState([]);
    const [selectedWorksheet, setSelectedWorksheet] = useState(''); // New state for the selected worksheet name
    const [currentPage, setCurrentPage] = useState(0); // Pagination state
    const itemsPerPage = 25; // Items per page for pagination

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
            .then((res) => setWorkSheetData(res.filter(row => row.some(num => num.toString().includes(searcheItem)))))
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
                    maxWidth: '150px',
                    cursor: 'pointer'
                }}>
                    {text}
                </span>
            </OverlayTrigger>
        );
    };

    return (
        <div style={{ display: 'flex', height: '100vh', fontFamily: 'Arial, sans-serif' }}>
            {/* Sidebar */}
            <Sidebar 
                files={files} 
                selectedFile={selectedFile} 
                handleFileClick={handleFileClick} 
                cleanFileName={cleanFileName} 
                error={error}
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

                        {/* Display worksheet buttons */}
                        <WorksheetButtons 
                            worksheets={worksheets} 
                            handleWorkSheetData={handleWorkSheetData}
                        />

                        {/* Display worksheet table */}
                        <WorksheetTable 
                            worksheetData={worksheetData} 
                            selectedWorksheet={selectedWorksheet} 
                            itemsPerPage={itemsPerPage}
                            currentPage={currentPage}
                            handlePageClick={handlePageClick}
                            renderCell={renderCell}
                        />
                    </div>
                ) : (
                    <p>Please select a file from the sidebar to view its worksheets.</p>
                )}
            </main>
        </div>
    );
};

export default HomeScreen;

