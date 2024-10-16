import React, { useEffect, useState } from 'react';
import { getFileTables, getFileWorkSheets, getTableColumns, getWorkSheetData } from './ServiceFile';
import { OverlayTrigger, Tooltip } from 'react-bootstrap'; // For Tooltip
import WorksheetButtons from './components/WorksheetButtons';
import WorksheetTable from './components/WorksheetTable';
import Sidebar from './components/SideBar';

const HomeScreen = ({ error, files, token, searcheItem }) => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [worksheets, setWorkSheets] = useState([]);
    const [columns, setColumns] = useState([]);
    const [worksheetData, setWorkSheetData] = useState([]);
    const [selectedWorksheet, setSelectedWorksheet] = useState(''); // New state for the selected worksheet name
    const [currentPage, setCurrentPage] = useState(0); // Pagination state
    const itemsPerPage = 25; // Items per page for pagination
   
    // Handle file click
    const handleFileClick = (file) => {
        setSelectedFile(file); // Set the selected file
        setSelectedWorksheet(''); // Reset selected worksheet when a new file is selected
        getFileWorkSheets(file?.id, token)
            .then(async(res1) => {
                if(searcheItem){
                    const results = await Promise.all(res1.map( async(sheet) => {
                        let data = []
                        try{
                           const res = await getWorkSheetData(file?.id, sheet?.name, token)
                            data = res.filter(row => row.some(num => num.toString().toLowerCase().includes(searcheItem.toLowerCase())))
                        } catch(err){
                            console.error(sheet.name, err);
                        }
                        return { sheet, matched: data.length > 0 }                 
                    }
                )
            )
            setWorkSheets(results.filter(result => result.matched).map(result => result.sheet))
                }else{                    
                    setWorkSheets(res1)
                }               
            })
            .catch((err) => console.error(err));
    };

    // Remove ".xlsx" from filenames for display
    const cleanFileName = (fileName) => fileName.replace('.xlsx', '');

    // Handle worksheet click and fetch its data
    const handleWorkSheetData = (workSheet) => {        
        setSelectedWorksheet(workSheet?.name); // Set the selected worksheet
        getFileTables(selectedFile?.id,token,workSheet?.id)
        .then((res) => {
            res.length > 0 ?
            getTableColumns(selectedFile?.id,token,workSheet?.id, res[0])
            .then((res) => {setColumns(res);
            })
            .catch((err) => console.error(err)) :setColumns([])
        })
        .catch((err) => console.error(err));

        getWorkSheetData(selectedFile?.id, workSheet, token)
        .then((res) => setWorkSheetData(res.filter(row => row.some(num => num.toString().toLowerCase().includes(searcheItem.toLowerCase())))))
        .catch((err) => console.error(err));
    };

    // Pagination handling
    const handlePageClick = ({ selected }) => {
        setCurrentPage(selected);
    };

    // useEffect(() => {
    //     console.log("worksheets",worksheets);
        
    // },[worksheets])

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
                            columnNames ={columns}
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

