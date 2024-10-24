import React from 'react';

const SideBar = ({ files, selectedFile, handleFileClick, cleanFileName, error }) => {
    return (
        <nav style={{
            width: '350px',
            backgroundColor: 'rgba(50, 145, 156, 1)',
            padding: '20px',
            color: '#ffffff',
            borderRight: '1px solid #e9ecef',
            overflowY: 'auto',
            position: 'fixed',
            height: '95vh'
        }}>
            <h2 style={{ color: '#ffc107' }}>Orcimed</h2>
            <h4 style={{ borderBottom: '2px solid #ffc107', paddingBottom: '10px' }}>Files Count: {files?.filter((file) => !file.name.endsWith("pdf")).length} </h4>
            {files?.length > 0 ? (
                <ul style={{ listStyleType: 'none', padding: 0 }}>
                    {files.filter((file) => !file.name.endsWith("pdf")).map((file, index) => (
                        <li key={index} onClick={() => handleFileClick(file)}
                            style={{
                                padding: '10px 0',
                                borderBottom: '1px solid #e9ecef',
                                cursor: 'pointer',
                                color: selectedFile?.id === file.id ? '#ffffff' : '#ffffff',
                                backgroundColor: selectedFile?.id === file.id ? 'rgba(3, 102, 116, 1)' : 'transparent'
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
    );
};

export default SideBar;
