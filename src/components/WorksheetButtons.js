import React, { useEffect, useState } from 'react';

const WorksheetButtons = ({ worksheets, handleWorkSheetData,selectedFile,isLoadingSheetData }) => {
    const [selectedSheet, setSelectedSheet] = useState("");
    useEffect(() => {
        setSelectedSheet(worksheets[0]?.name)
    },[worksheets])
    return (
        <div className='workSheetButtons'>
            <h5>Worksheets:</h5>
            {worksheets.length  > 0 ? (
                worksheets.map((worksheet, index) => (
                <button
                    disabled = {isLoadingSheetData }
                    key={index}
                    onClick={() => {
                        setSelectedSheet(worksheet?.name);
                        worksheet?.name !== selectedSheet && handleWorkSheetData(worksheet, selectedFile)
                        }
                    }
                    className={worksheet?.name === selectedSheet ? "btn btn-primary m-1" : "btn btn-light m-1"}
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
