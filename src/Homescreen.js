
import React, { useEffect, useState } from 'react';
import { getFileWorkSheets, getWorkSheetData } from './ServiceFile';

const HomeScreen = ({ fileNames, error, files, token }) => {
    var item = "rohith"
    const [selectedFile, setSelectedFile] = useState(null);
    const [worksheets, setWorkSheets] = useState([]);
    const [worksheetData, setWorkSheetData] = useState([]);
    // Sample table data to be shown on click of file
    const sampleTableData = [
        { name: 'John Doe', age: 30, job: 'Engineer' },
        { name: 'Jane Smith', age: 25, job: 'Designer' },
        { name: 'Sam Brown', age: 28, job: 'Manager' }
    ];

    // Handle file click and prevent sidebar from resizing
    const handleFileClick = (file) => {
        setSelectedFile(file); // Set the selected file when clicked
        getFileWorkSheets(file.id, token).catch((err) => console.error(err)
        ).then((res) => setWorkSheets(res)
        )
    };

        
    // Remove ".xlsx" from filenames for display   016BREBXLP5IIL4B5E3NH2LSR3Q2NTBAEA
    const cleanFileName = (fileName) => {
        return fileName.replace('.xlsx', '');
    };

    const handleWorkSheetData = (workSheet) => {
        getWorkSheetData(selectedFile?.id, workSheet, token).catch((err) => console.error(err)
    ).then((res) =>setWorkSheetData(res))
    }

    return (
        <div style={{ display: 'flex', height: '100vh', fontFamily: 'Arial, sans-serif' }}>
            {/* Sidebar */}
            <nav style={{
                width: '350px', // Fixed width, no resizing
                backgroundColor: '#343a40',
                padding: '20px',
                color: '#fff',
                borderRight: '1px solid #e9ecef',
                overflowY: 'auto'
            }}>
                <h2 style={{ color: '#ffc107' }}>Orcimed</h2> {/* Company name */}
                <h4 style={{ borderBottom: '2px solid #ffc107', paddingBottom: '10px' }}>Files List</h4>
                {files.length > 0 ? (
                    <ul style={{ listStyleType: 'none', padding: 0 }}>
                        {files.map((file, index) => (
                            <li key={index} onClick={() => handleFileClick(file)} 
                                style={{
                                    padding: '10px 0',
                                    borderBottom: '1px solid #e9ecef',
                                    cursor: 'pointer',
                                    color: '#ffc107'
                                }}
                            >
                                {index + 1}. {cleanFileName(file.name)} {/* Removed .xlsx */}
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No files found.</p>
                )}
                {error && <p style={{ color: 'red' }}>Error: {error}</p>}
            </nav>

            {/* Main Content */}
            <main style={{ flexGrow: 1, padding: '20px' }}>
                <h2 style={{ color: '#343a40' }}>Welcome to the Home Screen</h2>
                {selectedFile?.name ? (
                    <div>
                        <h4 style={{ color: '#343a40', margin:"10px" }}>Selected File: {cleanFileName(selectedFile?.name)}</h4> 
                        {/* Sample table for demonstration */}
                        <table style={{
                            width: '100%',
                            borderCollapse: 'collapse',
                            marginTop: '20px',
                            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                        }}>
                            <thead>
                                <tr>
                                    <th style={{
                                        padding: '10px',
                                        backgroundColor: '#ffc107',
                                        color: '#fff',
                                        border: '1px solid #e9ecef'
                                    }}>Name</th>
                                    <th style={{
                                        padding: '10px',
                                        backgroundColor: '#ffc107',
                                        color: '#fff',
                                        border: '1px solid #e9ecef'
                                    }}>Age</th>
                                    <th style={{
                                        padding: '10px',
                                        backgroundColor: '#ffc107',
                                        color: '#fff',
                                        border: '1px solid #e9ecef'
                                    }}>Job</th>
                                </tr>
                            </thead>
                            <tbody>
                                {sampleTableData.map((row, idx) => (
                                    <tr key={idx}>
                                        <td style={{
                                            padding: '10px',
                                            border: '1px solid #e9ecef'
                                        }}>{row.name}</td>
                                        <td style={{
                                            padding: '10px',
                                            border: '1px solid #e9ecef'
                                        }}>{row.age}</td>
                                        <td style={{
                                            padding: '10px',
                                            border: '1px solid #e9ecef'
                                        }}>{row.job}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <p>Select a file from the sidebar to view more details.</p>
                )}
            </main>
            <ul dir='horizontal'>
                {worksheets.length > 0 ? worksheets.map((worksheet, index) =>(
                    <li key={index} onClick={() => handleWorkSheetData(worksheet.name)}>
                        {worksheet.name}
                    </li>
                )) : null}
            </ul>
        </div>
    );
};

export default HomeScreen;
