
import React, { useState } from 'react';

const HomeScreen = ({ fileNames, error }) => {
    const [selectedFile, setSelectedFile] = useState(null);

    // Sample table data to be shown on click of file
    const sampleTableData = [
        { name: 'John Doe', age: 30, job: 'Engineer' },
        { name: 'Jane Smith', age: 25, job: 'Designer' },
        { name: 'Sam Brown', age: 28, job: 'Manager' }
    ];

    // Handle file click and prevent sidebar from resizing
    const handleFileClick = (fileName) => {
        setSelectedFile(fileName); // Set the selected file when clicked
    };

    // Remove ".xlsx" from filenames for display
    const cleanFileName = (fileName) => {
        return fileName.replace('.xlsx', '');
    };

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
                {fileNames.length > 0 ? (
                    <ul style={{ listStyleType: 'none', padding: 0 }}>
                        {fileNames.map((fileName, index) => (
                            <li key={index} onClick={() => handleFileClick(fileName)} 
                                style={{
                                    padding: '10px 0',
                                    borderBottom: '1px solid #e9ecef',
                                    cursor: 'pointer',
                                    color: '#ffc107'
                                }}
                            >
                                {index + 1}. {cleanFileName(fileName)} {/* Removed .xlsx */}
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
                {selectedFile ? (
                    <div>
                        <h4 style={{ color: '#343a40', margin:"10px" }}>Selected File: {cleanFileName(selectedFile)}</h4> 
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
        </div>
    );
};

export default HomeScreen;
