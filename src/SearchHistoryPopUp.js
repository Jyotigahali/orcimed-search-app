import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import { getSearchedHistory } from "./ServiceFile";
import { useMsal } from "@azure/msal-react";
import ReactPaginate from "react-paginate";

const SearchHistoryPopUp = ({token, setShowModalH}) => {
  const [showModal, setShowModal] = useState(false);
  const [searchHistroy,setSearchHistroy] = useState([]);
  const [currentPage, setCurrentPage] = useState(0); // Pagination state
  const itemsPerPage = 10; // Items per page for pagination
  const {accounts} = useMsal(); 

  const toggleModal = () => {
    setCurrentPage(0);
    setShowModal(!showModal);
    setShowModalH(!showModal)
  };

  const handlePageClick = ({ selected }) => {
    setCurrentPage(selected);
};

  useEffect(() => {    
    getSearchedHistory(token).catch((err) => console.error(err))
    .then((res) => {
      const mySearchedData = res?.filter(item => 
        item?.createdBy?.user?.email === accounts[0]?.username)
        .sort((a,b) => b?.fields?.id -a?.fields?.id)
      setSearchHistroy(mySearchedData);
    })

    const handleOutsideClick = (event) => {
      const modal = document.querySelector(".sideBar");
      if (modal && modal.contains(event.target)) {
        setShowModal(false);
        setShowModalH(false)
      }
    };

    document.addEventListener("click", handleOutsideClick);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[token, showModal, accounts]);

  const compareDates = (date) => {
    const searchedDate = new Date(date);
    const currentDate = new Date();

    // Normalize both dates to just date (no time)
    const searchedDay = new Date(searchedDate.getFullYear(), searchedDate.getMonth(), searchedDate.getDate());
    const today = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate());

    const differenceInTime = today - searchedDay;
    const differenceInDays = differenceInTime / (1000 * 3600 * 24);

    if (differenceInDays === 0) {
      return "Today"
    } else if (differenceInDays === 1) {
     return "Yesterday"
    } else {
      return searchedDate.toDateString()
    }
  };

  const paginatedData = searchHistroy?.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
);

  return (
    <div className="historyPopUp">
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
          className="modal fade show modal-m"
          style={{ display: "block" }}
          tabIndex="-1"
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
                >
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">
                {
                  searchHistroy?.length > 0 ?
              <table className="table table-bordered table-striped">
                  <thead className="thead-dark">
                    <tr>
                      <th>Search Term</th>
                        <th>Date</th>
                        <th>Count</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedData?.map((row, rowIndex) => (
                        <tr key={rowIndex}>
                          <td>{row?.fields?.Title} </td>
                          <td>{compareDates(row?.fields?.Created)} </td>
                          <td>{row?.fields?.SearchedTermCount} </td>
                        </tr>
                    ))}
                  </tbody>
              </table> : <h5>Your Search History is empty!</h5>}
              {searchHistroy?.length > itemsPerPage ?
               <ReactPaginate
                        previousLabel={"<"}
                        nextLabel={">"}
                        breakLabel={"..."}
                        pageCount={Math.ceil(searchHistroy.length / itemsPerPage)}
                        marginPagesDisplayed={2}
                        pageRangeDisplayed={5}
                        onPageChange={handlePageClick}
                        containerClassName={"pagination"}
                        activeClassName={"active"}
                        pageClassName={"page-item"}
                        pageLinkClassName={"page-link"}
                        previousClassName={"page-item"}
                        previousLinkClassName={"page-link"}
                        nextClassName={"page-item"}
                        nextLinkClassName={"page-link"}
                        breakClassName={"page-item"}
                        breakLinkClassName={"page-link"}
                    /> : null
              }
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
            style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", zIndex: -1 }}
          />
        </div>
      )}
    </div>
  );
};

export default SearchHistoryPopUp;
