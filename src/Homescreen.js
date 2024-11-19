import React, { useEffect, useState } from 'react';
import { getFileTables, getFileWorkSheets, getTableColumns, getWorkSheetData } from './ServiceFile';
import { OverlayTrigger, Tooltip, Spinner } from 'react-bootstrap';
import WorksheetButtons from './components/WorksheetButtons';
import WorksheetTable from './components/WorksheetTable';
import Sidebar from './components/SideBar';
import './styles/HomeScreen.css'

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
                                    }
                                }).catch((err) => console.error("getFileTables", err))
                                return { sheet,  matched: data.length > 0}
                        }
                    ))
                   const returnedWorkSheets = results.filter(result => result.matched).map(result => result.sheet);
                   setWorkSheets(returnedWorkSheets);
                   handleWorkSheetData(returnedWorkSheets[0],file)
                    }else{
                        setWorkSheets(workSheets);
                        handleWorkSheetData(workSheets[0], file)
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
        
        // const reader = new FileReader();
        // const fileResponse = await fetch(file["@microsoft.graph.downloadUrl"]);
        // const arrayBuffer = await fileResponse.blob();
        // const workbook = XLSX.read(new Uint8Array(arrayBuffer),{type:'array'});
        // const sheetName = workbook.SheetNames[0];
        // const rowss = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
        // console.log(rowss);
        
        // const blob =  workSheet?.blob()
        // console.log(arrayBuffer);
        
        // reader.onload = (file) => {
        //     console.log(file, file.target.result);
            
        //     const data = new Uint8Array(file.target.result);
        //     const workbook = XLSX.read(data,{type:'array'});
        // const sheetName = workbook.SheetNames[0];
        // const rowss = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
        // console.log(rowss);
        //     rowss.map((item) => {
        //         Object.entries(item).map((value) => console.log(item?.strikeThrough, value))
        //     })

        // }
        // reader.readAsArrayBuffer(arrayBuffer);
        setCurrentPage(0);
        setSelectedWorksheet(workSheet?.name); // Set the selected worksheet
        setLoadingWorksheets(true); // Start loading state for fetching worksheet data
        await getFileTables(file?.id, token, workSheet?.id)
        .then(async(table) => {
            if (table.length > 0) {
                await getTableColumns(file?.id, token, workSheet?.id, table[0])
                .then((columns) => setColumns(columns))
                .catch((err) => console.error("getColumns",err))
                await getWorkSheetData(file?.id, workSheet, token, table[0])
                .then( async(tableRows) => {
                    // const blob = await tableRows?.blob()
                //     const dataR = new Uint8Array(tableRows[0].values[0]);
                //    console.log(dataR);
                   
                    
                //     const workbook = XLSX.read(dataR,{type:'array'});
                    
                //     const sheetName = workbook.SheetNames[0];
                //     const rowss = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
                    
                //     console.log(rowss);
                    // console.log(tableRows[0].values[0]);
                    
                    (searcheItem ? 
                    setWorkSheetData(tableRows.filter(row => row?.values[0].some(num => num.toString().toLowerCase().includes(searcheItem.toLowerCase())))) 
                    : setWorkSheetData(tableRows));
                })
                .catch((err) => console.error("getWorkSheetData",err))
            }else{
                setColumns([]);
                setWorkSheetData([])
            }
        }).catch((err) => console.error("getTableError",err))
        .finally(() => setLoadingWorksheets(false));
    };

    // Pagination handling
    const handlePageClick = ({ selected }) => {
        setCurrentPage(selected);
    };

    useEffect(() => {
        handleFileClick(files[0]?.file)
    },[files])

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
