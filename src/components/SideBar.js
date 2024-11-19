import React from 'react';
import '../styles/Sidebar.css'

const SideBar = ({ files, selectedFile, handleFileClick, cleanFileName, error, loadingWorksheets, loading }) => {
    return (
        <nav className='sideBar'>
            <h4>Files Count: {files?.filter((file) => !file.file.name.endsWith("pdf")).length} </h4>
            {files?.length > 0 ? (
                <ul style={{ listStyleType: 'none', padding: 0 }}>
                    {files.filter((file) => !file.file.name.endsWith("pdf")).map((file, index) => (
                        <li key={index} onClick={() => !loadingWorksheets && !loading && handleFileClick(file.file)}
                           id='fileLists'
                           style={{
                            cursor: !loadingWorksheets && !loading ? 'pointer' : 'default',
                            backgroundColor: selectedFile?.id === file?.file.id ? 'rgba(3, 102, 116, 1)' : 'transparent'
                        }} 
                        >
                            {index + 1}. {cleanFileName(file.file.name)} - v{file.version}
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
