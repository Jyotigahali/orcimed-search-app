import axios from "axios";
//drove id -  b!sEjLbDorlkayHmlSx3RV_ZHK6J5Rk-xGj3X1rIxMz-132kCpdg3AT5GTR9F73t7l - file id -- 01KAEGLNOIK7KTMEUW7VCLFIWWAXKPQALN -- file name -"name": "Commercialization Status EU_UK_10-07-24.xlsb",
//sheet id - 00000000-0001-0000-0000-000000000000 // sheet name - Europe Cipla MA , 
const siteId = process.env.REACT_APP_IT_SITE_ID 
const driveId = process.env.REACT_APP_IT_DRIVE_ID 
const apiEndPoint = `https://graph.microsoft.com/v1.0/sites/${siteId}/drives/${driveId}`;
const listId = process.env.REACT_APP_IT_HISTORY_LIST_ID
const operationsSiteid = process.env.REACT_APP_SO_SITE_ID;
const soDriveId = process.env.REACT_APP_SO_DRIVE_ID // --saftey operations drive id 
const trackerForReferenceID = process.env.REACT_APP_TRACKER_FOR_REFERENCE_ID
// const siteUrl = 'https://orcimedlifesciences.sharepoint.com/sites/MedTrackProject';
const operationsApiEndPoint = `https://graph.microsoft.com/v1.0/sites/${operationsSiteid}/drives/${soDriveId}` // /root:/Cipla/Trackers for reference/children`
const searchHistoryListApi = `https://graph.microsoft.com/v1.0/sites/${siteId}/lists/${listId}/items`

export const getFiles = async (token) => {
  let mappedResponse = []
  // const url =`${operationsApiEndPoint}/root:/Cipla/Trackers for reference:/children` //
  const url = `${apiEndPoint}/root:/Product Lists:/children`
  const listVersions =`${apiEndPoint}/items` //`https://graph.microsoft.com/v1.0/sites/${siteId}/lists/${driveId}/items`  
  await axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
      },
    }).catch(err => console.error(err))
    .then( async(res) => {
      mappedResponse = await Promise.all(
        res.data.value.map(async (file) => {
          let version = 0;
          try {
            const response = await axios.get(`${listVersions}/${file.id}/versions`, {
              headers: {
                Authorization: `Bearer ${token}`,
                Accept: 'application/json',
              },
            });
            version = response.data.value.length;
          } catch (err) {
            console.error(err);
          }
          return { file: file, version: version };
        })
      );
    });
    return mappedResponse;
};

export const getFileWorkSheets = async (fileId,token) => {
 let response = [];
//  const url = `${operationsApiEndPoint}/items/${fileId}/workbook/worksheets`
 const url = `${apiEndPoint}/items/${fileId}/workbook/worksheets`
 await axios.get(url, {
  headers: {
    Authorization: `Bearer ${token}`,
  },
}).then((res) => response = res?.data?.value)
.catch((err) => console.error(err))
return response
}

export const getFileTables = async (fileId,token,worksheetId) => {
  //${table.id}/columns
  let response = [];
  // const url = `${operationsApiEndPoint}/items/${fileId}/workbook/worksheets/${worksheetId}/tables`
  const url = `${apiEndPoint}/items/${fileId}/workbook/worksheets/${worksheetId}/tables`

  await axios.get(url, {
   headers: {
     Authorization: `Bearer ${token}`,
   },
 }).then((res) =>{ response = res?.data?.value })
 .catch((err) => console.error(err))
 return response
 }

 export const getTableColumns = async (fileId,token,worksheetId,table) => {
  let response = [];
  // const url = `${operationsApiEndPoint}/items/${fileId}/workbook/worksheets/${worksheetId}/tables/${table.id}/columns`
  const url = `${apiEndPoint}/items/${fileId}/workbook/worksheets/${worksheetId}/tables/${table.id}/columns`
  await axios.get(url, {
   headers: {
     Authorization: `Bearer ${token}`,
   },
 }).then((res) => response = res?.data?.value)
 .catch((err) => console.error(err))
 return response
 }

export const getWorkSheetData = async (fileId,workSheet,token,table) => {
  //CH34626
  // const url = `${operationsApiEndPoint}/items/${fileId}/workbook/tables/${table?.name}/rows`
 const url = `https://graph.microsoft.com/v1.0/sites/${siteId}/drive/items/${fileId}/workbook/tables/${table?.name}/rows`
  // const sheetUrl = `${apiEndPoint}/items/${fileId}/workbook/worksheets('${workSheet.name}')/range(address='A1:D10')`
  let response = [];
  await axios.get(url, {
   headers: {
     Authorization: `Bearer ${token}`,
   },
 }).then((res) => response = res?.data?.value)
 .catch((err) => console.error(err)) 
 return response
 }

 export const getSearchedFiles = async (token,searchQuery) => {
  // const url =`${operationsApiEndPoint}/items/${trackerForReferenceID}/search(q='${encodeURIComponent(searchQuery)}')`
  const url =`${apiEndPoint}/root/children/Product Lists/search(q='${encodeURIComponent(searchQuery)}')`
  const listVersions =`${apiEndPoint}/items`
  let mappedResponse = []
  await axios.get(url,{
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
  })
  .catch((err) => console.error(err))
  .then(async(res) => {
    mappedResponse = await Promise.all(
      res.data.value.map(async (file) => {
        let version = 0;
        try {
          const response = await axios.get(`${listVersions}/${file.id}/versions`, {
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: 'application/json',
            },
          });
          version = response.data.value.length;
        } catch (err) {
          console.error(err);
        }
        return { file: file, version: version };
      })
    );
  })
  return mappedResponse
 }

 export const getSearchedHistory = async(token) =>{
  let response = [];
  await axios.get(
    `${searchHistoryListApi}?expand=fields`,
    {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }
  ).catch((err) => console.error(err))
  .then((res) => response = res?.data?.value);
  return response;
 }

 export const postSearchHistroy = async(token, searchTerm) =>{
  let response = [];
  const itemData = {
    fields: {
      Title : searchTerm,
      SearchedTermCount: 1
    }
  }
  const url = searchHistoryListApi;
  await axios.post(url, itemData,
    {
        headers: {
           Authorization: `Bearer ${token}`
        }
    }
  ).catch((err) => console.error(err))
  .then((res) => console.log(res));
  return response;
 }

 export const updateSearchHistroy = async(token, itemId, count) =>{
  let response = [];  
  const updatedData = { 
      SearchedTermCount: count + 1 
  }
  const url = `${searchHistoryListApi}/${itemId}/fields`;
  await axios.patch(url, updatedData,
    {
        headers: {
            Authorization: `Bearer ${token}`, 
        }
    }
  ).catch((err) => console.error(err))
  .then((res) => console.log(res));
  return response;
 }