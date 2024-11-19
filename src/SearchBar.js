import React, { useState } from 'react'
import './styles/SearchBar.css'
import SearchHistoryPopUp from './SearchHistoryPopUp';
import { getSearchedHistory, postSearchHistroy, updateSearchHistroy } from './ServiceFile';
import { msalInstance } from './Dashboard';
import { useMsal } from '@azure/msal-react';
import Ocmlslogo from './images/ocmlsLogo.png'

const SearchBar = ({setSearcheItem, token}) => {

  const [searchedValue, setSearchedValue] = useState('');
  const {instance, accounts} = useMsal();

  const handleSearchChange = (e) => {
    setSearchedValue(e.target.value)
  }

  const handleSearch = async() => {
    setSearcheItem(searchedValue);
    const today = new Date().toDateString()
    const graphScope = ["Files.ReadWrite.All", "User.Read"];
    let presentData = [];
    await getSearchedHistory(token)
    .catch((err) => console.error(err))
    .then((res) => 
      presentData = res?.find((item) => {
        const createdDate = new Date(item?.fields?.Created);
        return (
          item?.fields?.Title?.toLowerCase() === searchedValue.toLowerCase() && 
          item?.createdBy?.user?.email === accounts[0]?.username && createdDate.toDateString() === today
        )})
    );
    try {           
      await msalInstance.initialize()
      const accessTokenRequest = {
          scopes:graphScope,
          account: accounts[0],
        };
     await instance.acquireTokenSilent(accessTokenRequest)
      .then((res) => {        
        presentData ? 
        updateSearchHistroy(res.accessToken,presentData?.fields?.id, presentData?.fields?.SearchedTermCount)
        .catch((err) => console.error(err))
        .then((res) => {console.log("updated",res);}): searchedValue &&
        postSearchHistroy(res.accessToken,searchedValue)
        .catch((err) => console.error(err))
        .then((res) => {console.log("posted",res);})
      }); 
    } catch (err) {
      console.error("Login error: ", err);
    }
  }

  return (
    <div className='searchDiv'>
      <img src={Ocmlslogo} alt='ocmlsLogo' />
      <div className='searchSec'>
      <input type='text' onChange={handleSearchChange} />
      <button type="button" className="btn btn-primary" onClick={handleSearch}>Search</button>
      <div className='popUp'>
      <SearchHistoryPopUp token={token} />
      </div>
      </div>
      <div className='profileSec bg-primary'>
        {/* <img src={accounts[0]} alt='profilePic' /> */}
        {/* <i className="bi bi-person-circle"></i> */}
        <h6>
          {accounts[0].name}
        </h6>
        <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="#e9a719" className="bi bi-person-circle" viewBox="0 0 16 16">
          <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0"/>
          <path fill-rule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1"/>
        </svg>
       
      </div>
    </div>
  )
}

export default SearchBar