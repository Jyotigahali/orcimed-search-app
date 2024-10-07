import React, { useState } from 'react'

const SearchBar = ({setSearcheItem, apiCall}) => {

  const [searchedValue, setSearchedValue] = useState('');

  const handleSearchChange = (e) => {
    setSearchedValue(e.target.value)
  }
  const handleSearch = () => {
    setSearcheItem(searchedValue);
  }
  return (
    <div>
      <input type='text' onChange={handleSearchChange} />
      <button type="button" className="btn btn-primary" onClick={handleSearch}>Search</button>
    </div>
  )
}

export default SearchBar