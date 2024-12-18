import React, { useEffect, useState } from 'react';
import { getFileTables, getFileWorkSheets, getTableColumns, getWorkSheetData } from './ServiceFile';
import { OverlayTrigger, Tooltip, Spinner } from 'react-bootstrap';
import WorksheetButtons from './components/WorksheetButtons';
import WorksheetTable from './components/WorksheetTable';
import Sidebar from './components/SideBar';
import './styles/HomeScreen.css'

const HomeScreen = ({ error, files, token, searcheItem,showModal }) => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [worksheets, setWorkSheets] = useState([]);
    const [columns, setColumns] = useState([]);
    const [worksheetData, setWorkSheetData] = useState([]);
    const [selectedWorksheet, setSelectedWorksheet] = useState('');
    const [currentPage, setCurrentPage] = useState(0);
    const [errorMessage, setErrorMessage] = useState('')
    const itemsPerPage = 25;

    const [loading, setLoading] = useState(false); // Handles general loading state
    const [loadingWorksheets, setLoadingWorksheets] = useState(false); // Handles worksheet-specific loading state
  
    // Handle file click
    const handleFileClick = async(file) => {
        setCurrentPage(0);
        setLoading(true); // Start the loading state for file worksheets
        setSelectedFile(file); // Set the selected file
        setSelectedWorksheet(''); // Reset selected worksheet when a new file is selected
        setWorkSheetData([]);
        setColumns([]);
        await getFileWorkSheets(file?.id, token)
            .then(async(workSheets) => 
                {
                    if(searcheItem){
                        const results = await Promise.all(workSheets.map( async(sheet) => {
                            let data = []     
                                await getFileTables(file?.id, token, sheet?.id)
                                .then(async(table) => {
                                    if(table.length > 0){
                                            try{
                                        const sheetRows = await getWorkSheetData(file?.id, sheet, token,table[0])
                                            data = sheetRows.filter(row => row?.values[0].some(num => num.toString().toLowerCase().includes(searcheItem.toLowerCase())));
                                    } catch(error){
                                        console.error(error);
                                        
                                    }
                                    }else{
                                    setColumns([]);
                                    setWorkSheetData([]);
                                    setErrorMessage('This file/sheet has no Table. Create one to load rows...')
                                    }
                                }).catch((err) => {
                                    console.error("getFileTables", err)
                                    setErrorMessage(err)
                                })
                                return { sheet,  matched: data.length > 0}
                        }
                    ))
                   const returnedWorkSheets = results.filter(result => result.matched).map(result => result.sheet);
                   setWorkSheets(returnedWorkSheets);
                   handleWorkSheetData(returnedWorkSheets[0],file);
                   setErrorMessage('')
                    }else{
                        setWorkSheets(workSheets);
                        handleWorkSheetData(workSheets[0], file)
                        setErrorMessage('')
                    }
            }
        )
            .catch((err) => console.error(err))
            .finally(() => setLoading(false)); // End the loading state after fetching worksheets
    };

    // Remove ".xlsx" from filenames for display
    const cleanFileName = (fileName) => fileName.replace('.xlsx', '');

    // Handle worksheet click and fetch its data
    const handleWorkSheetData = async(workSheet, file) => {
        setCurrentPage(0);
        setSelectedWorksheet(workSheet?.name); // Set the selected worksheet
        setLoadingWorksheets(true); // Start loading state for fetching worksheet data
        await getFileTables(file?.id, token, workSheet?.id)
        .then(async(table) => {
            if (table.length > 0) {
                await getTableColumns(file?.id, token, workSheet?.id, table[0])
                .then((columns) =>{ 
                    setColumns(columns);
                    setErrorMessage('')
                })
                .catch((err) => console.error("getColumns",err))
                await getWorkSheetData(file?.id, workSheet, token, table[0])
                .then( async(tableRows) => {                    
                    (searcheItem ? 
                    setWorkSheetData(tableRows.filter(row => row?.values[0].some(num => num.toString().toLowerCase().includes(searcheItem.toLowerCase())))) 
                    : setWorkSheetData(tableRows));
                    setErrorMessage('')
                })
                .catch((err) => console.error("getWorkSheetData",err))
            }else{
                setColumns([]);
                setWorkSheetData([]);
                setErrorMessage('This file/sheet has no Table. Create one to load rows...')
            }
        }).catch((err) =>{ 
            console.error("getTableError",err)
            setErrorMessage(err)
        })
        .finally(() => setLoadingWorksheets(false));
    };

    // Pagination handling
    const handlePageClick = ({ selected }) => {
        setCurrentPage(selected);
    };

    useEffect(() => {
        handleFileClick(files[0]?.file)
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[files])
    const convertToDateValue =(serial) => {
        if(typeof  serial === 'number' && serial < 1 && serial > 0){
            const totalHours = serial * 24; // Convert fraction of the day to hours
            const hours24 = Math.floor(totalHours); // Get the full hours
            const minutes = Math.floor((totalHours - hours24) * 60); // Get the minutes
            const seconds = Math.round((((totalHours - hours24) * 60) - minutes) * 60); // Get the seconds
        
            // Determine AM or PM
            const isPM = hours24 >= 12;
            let hours12 = hours24 % 12; // Convert to 12-hour format
            if (hours12 === 0) {
                hours12 = 12; // Handle 12:00 PM as 12:00, not 0:00
            }
        
            // Format time as HH:MM:SS AM/PM
            const period = isPM ? "PM" : "AM";
            return `${hours12}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")} ${period}`;
        }
        if(typeof serial === 'number' && serial < 2958465 && serial > 2000){ //	0.83547453703704
        const excelEpoch = new Date(1899, 11, 30); // Dec 30, 1899
        const jsDate = new Date(excelEpoch.getTime() + serial * 24 * 60 * 60 * 1000);
            return jsDate.toLocaleDateString();
        }else{
            return serial
        }
    }
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
                    {convertToDateValue(text)}
                </span>
            </OverlayTrigger>
        );
    };

    return (
        <div style={{ display: 'flex', fontFamily: 'Arial, sans-serif',marginTop:'75px'}}>
            {/* Sidebar */}
            <Sidebar
                files={files}
                selectedFile={selectedFile}
                handleFileClick={handleFileClick}
                cleanFileName={cleanFileName}
                error={error}
                loadingWorksheets={loadingWorksheets}
                loading={loading} // Pass the loading state to Sidebar
                showModal={showModal}
            />

            {/* Main Content */}
            <main className='homeScreen'>
                {/* <h2 style={{ color: '#343a40' }}>Welcome to the Home Screen</h2> */}
                {selectedFile?.name ? (
                    <div>
                        <h4>Selected File: {cleanFileName(selectedFile?.name)}</h4>

                        {/* Show loader while fetching worksheets */}
                        {loading ? (
                            <div className='loading'>
                                <span>Loading...</span>
                            </div>
                        ) : (
                            
                            <>
                                <WorksheetButtons
                                    worksheets={worksheets}
                                    handleWorkSheetData={handleWorkSheetData}
                                    selectedFile={selectedFile}
                                    isLoadingSheetData={loadingWorksheets}
                                />

                                {/* Show loader while fetching worksheet data */}
                                {loadingWorksheets ? (
                                    <div style={{  marginTop:'120px', padding:"20px", textAlign:"center" }}
                                    >
                                        <Spinner animation="border" variant="primary" />
                                    </div>
                                ) : (
                                    errorMessage ? <h5 style={{color:'red',marginTop:"2%", textAlign:'center'}}>{errorMessage}</h5> :
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
