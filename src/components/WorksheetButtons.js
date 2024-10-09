import React from 'react';

const WorksheetButtons = ({ worksheets, handleWorkSheetData }) => {
    return (
        <div style={{ marginBottom: '20px' }}>
            <h5>Worksheets:</h5>
            {worksheets.length  > 0 ? (
                worksheets.map((worksheet, index) => (
                   
                    <button
                        key={index}
                        onClick={() => handleWorkSheetData(worksheet.name)}
                        className="btn btn-primary m-2"
                    >
                        {worksheet.name}
                    </button>
                ))
            ) : (
                <p>No worksheets found.</p>
            )}
        </div>
    );
};

export default WorksheetButtons;
