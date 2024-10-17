import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import '../styles/RowDetails.css'

const RowDetails = () => {
  const location = useLocation();
  const navigate = useNavigate()
  const {rows,columns} = location.state
  
  return (
    <div>
      <button 
      type="button"
      className="btn btn-primary" 
      onClick={() => navigate('/')} >
        Back</button>
      <div style={{display:'flex', justifyContent:'stretch',}} className='rowDeatilsTable'>
      <div className="table-responsive">
          <table className="table table-bordered table-striped">
              <thead className="thead-dark">
                  <tr>
                      <th>Column Name</th>
                      <th>Value</th>
                  </tr>
              </thead>
              <tbody>
                  {columns.columns.map((col, rowIndex) => (
                      <tr key={rowIndex} >
                        <td>{col.name}</td>
                        <td>{rows.data[rowIndex] }</td>
                      </tr>
                  ))}
              </tbody>
          </table>
      </div>
      </div>
    </div>
  )
}

export default RowDetails