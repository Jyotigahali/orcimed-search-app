import React, { useState } from 'react';

const WorksheetButtons = ({ worksheets, handleWorkSheetData,selectedFile }) => {
    const [selectedSheet, setSelectedSheet] = useState(worksheets[0]?.name);
    // console.log(selectedSheet);    
    return (
        <div style={{ marginBottom: '20px' }}>
            <h5>Worksheets:</h5>
            {worksheets.length  > 0 ? (
                worksheets.map((worksheet, index) => (
                   
                    <button
                        key={index}
                        onClick={() => {
                            setSelectedSheet(worksheet?.name);
                             handleWorkSheetData(worksheet, selectedFile)}
                            }
                        className={worksheet?.name === selectedSheet ? "btn btn-primary m-2" : "btn btn-light m-2"}
                    >
                        {worksheet?.name}
                    </button>
                ))
            ) : (
                <p>No worksheets found.</p>
            )}
        </div>
    );
};

export default WorksheetButtons;
