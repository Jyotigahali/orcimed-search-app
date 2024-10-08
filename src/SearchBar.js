import React, { useState } from 'react'
import './styles/SearchBar.css'
import SearchHistoryPopUp from './SearchHistoryPopUp';
import { getSearchedHistory, postSearchHistroy, updateSearchHistroy } from './ServiceFile';
import { msalInstance } from './SharePointFiles';
import { useMsal } from '@azure/msal-react';

const SearchBar = ({setSearcheItem, token}) => {

  const [searchedValue, setSearchedValue] = useState('');
  const {instance, accounts} = useMsal();

  const handleSearchChange = (e) => {
    setSearchedValue(e.target.value)
  }

  const handleSearch = async() => {
    setSearcheItem(searchedValue);
    const graphScope = ["Files.ReadWrite.All", "User.Read"];
    let presentData = [];
    await getSearchedHistory(token).catch((err) => console.error(err)
    ).then((res) => presentData = res?.find((item) => item?.fields?.Title?.toLowerCase() === searchedValue.toLowerCase()));
    try {           
      await msalInstance.initialize()
      const accessTokenRequest = {
          scopes:graphScope,
          account: accounts[0],
        };     
     await instance.acquireTokenSilent(accessTokenRequest)
      .then((res) => {        
        presentData ? 
        updateSearchHistroy(res.accessToken,presentData?.fields?.id, presentData?.fields?.SearchedTermCount).catch((err) => console.error(err)).then((res) => {console.log("updated",res);}):
        postSearchHistroy(res.accessToken,searchedValue).catch((err) => console.error(err)).then((res) => {console.log("posted",res);})
      }); 
    } catch (err) {
      console.error("Login error: ", err);
    }
  }

  return (
    <div className='searchDiv'>
      <input type='text' onChange={handleSearchChange} />
      <button type="button" className="btn btn-primary" onClick={handleSearch}>Search</button>
      <div>
      <SearchHistoryPopUp token={token} />
      </div>
    </div>
  )
}

export default SearchBar