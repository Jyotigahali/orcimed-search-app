import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import { getSearchedHistory } from "./ServiceFile";

const SearchHistoryPopUp = ({token}) => {
  const [showModal, setShowModal] = useState(false);
  const [searchHistroy,setSearchHistroy] = useState([])

  const toggleModal = () => {
    setShowModal(!showModal);
  };

  useEffect(() => {
    getSearchedHistory(token).catch((err) => console.error(err))
    .then((res) => {setSearchHistroy(res)})
  },[token,showModal])

  return (
    <div>
      <button
        type="button"
        className="btn btn-primary"
        onClick={toggleModal}
        style={{width:'128px'}}
      >
        Search History
      </button>

      {showModal && (
        <div
          className="modal fade show modal-lg"
          style={{ display: "block" }}
          tabIndex="-1"
          aria-labelledby="exampleModalLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">Searched History</h5>
                <button
                  type="button"
                  className="close"
                  onClick={toggleModal}
                  aria-label="Close"
                >
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">
              <table className="table table-bordered table-striped">
                  <thead className="thead-dark">
                    <tr>
                      <th>Search Term</th>
                        <th>Date</th>
                        <th>Count</th>
                    </tr>
                  </thead>
                  <tbody>
                    {searchHistroy.map((row, rowIndex) => (
                        <tr key={rowIndex}>
                          <td>{row?.fields?.Title} </td>
                          <td>{row?.fields?.Created} </td>
                          <td>{row?.fields?.SearchedTermCount} </td>
                        </tr>
                    ))}
                  </tbody>
              </table>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={toggleModal}
                  style={{width:'65px'}}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
          <div
            className="modal-backdrop fade show"
            onClick={toggleModal}
            style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", zIndex: -1040 }}
          />
        </div>
      )}
    </div>
  );
};

export default SearchHistoryPopUp;
