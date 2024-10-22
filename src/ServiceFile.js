import axios from "axios";

const siteId = 'e2198835-654d-418c-830f-97303ae5b25e';
const driveId = 'b!NYgZ4k1ljEGDD5cwOuWyXqagOUfN8KBLhXC8Fj-LnbOYys0eNiKwSYPqabU3psXn'
const operationsSiteid = "7dca5ef6-2a5c-40b1-84da-d9a058b9e3be";
const apiEndPoint = `https://graph.microsoft.com/v1.0/sites/${siteId}/drives/${driveId}`;
const listId = '561aa2d2-ede2-4b77-8d22-2664661ec3bf'
const soDriveId = "b!9l7KfVwqsUCE2tmgWLnjvv-4fSVEQ11BvVZ-50CAnLW4c1-xvA_9QIHaZXs1xNuL" // --saftey operations drive id 
// const apiEndPoint = `${apiUrl}/root/children/Product Lists/children`;
// const fileWorkSheetsApi = `${apiUrl}/items/016BREBXLP5IIL4B5E3NH2LSR3Q2NTBAEA/workbook/worksheets`
// const siteUrl = 'https://orcimedlifesciences.sharepoint.com/sites/MedTrackProject';
// const WorkSheetDataApi = `${apiUrl}/items/016BREBXLP5IIL4B5E3NH2LSR3Q2NTBAEA/workbook/worksheets('SheetName')/usedRange`;
const operationsApiEndPoint = `https://graph.microsoft.com/v1.0/sites/${operationsSiteid}/drives/${soDriveId}` // /root:/Cipla/Trackers for reference/children`

export const getFiles = async (token) => {
  let response = []
  // const url =`https://graph.microsoft.com/v1.0/sites/${operationsSiteid}/drives/${soDriveId}/root:/Cipla/Trackers for reference:/children` //
  await axios.get(`${apiEndPoint}/root:/Product Lists:/children`, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
      },
    }).catch(err => console.error(err))
    .then((res) => response = res);
    return response;
};

export const getFileWorkSheets = async (fileId,token) => {
 let response = [];
 await axios.get(`${apiEndPoint}/items/${fileId}/workbook/worksheets`, {
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
  await axios.get(`${apiEndPoint}/items/${fileId}/workbook/worksheets/${worksheetId}/tables`, {
   headers: {
     Authorization: `Bearer ${token}`,
   },
 }).then((res) => response = res?.data?.value)
 .catch((err) => console.error(err))
 return response
 }

 export const getTableColumns = async (fileId,token,worksheetId,table) => {
  let response = [];  
  await axios.get(`${apiEndPoint}/items/${fileId}/workbook/worksheets/${worksheetId}/tables/${table.id}/columns`, {
   headers: {
     Authorization: `Bearer ${token}`,
   },
 }).then((res) => response = res?.data?.value)
 .catch((err) => console.error(err))
 return response
 }

export const getWorkSheetData = async (fileId,workSheet,token,table) => {
  // console.log(table);
  //CH34626
  //https://graph.microsoft.com/v1.0/sites/e2198835-654d-418c-830f-97303ae5b25e/drives/b!NYgZ4k1ljEGDD5cwOuWyXqagOUfN8KBLhXC8Fj-LnbOYys0eNiKwSYPqabU3psXn/items/016BREBXKRU6QMJKZMZFDJK5VICCA7NOXO/workbook/worksheets/Sheet1
  //https://graph.microsoft.com/v1.0/sites/e2198835-654d-418c-830f-97303ae5b25e/drive/items/016BREBXKRU6QMJKZMZFDJK5VICCA7NOXO/workbook/tables/Table3/rows
 const tableUrl = `https://graph.microsoft.com/v1.0/sites/${siteId}/drive/items/${fileId}/workbook/tables/${table?.name}/rows`
  const sheetUrl = `${apiEndPoint}/items/${fileId}/workbook/worksheets('${workSheet.name}')/usedRange`  
  let response = [];
  await axios.get(tableUrl, {
   headers: {
     Authorization: `Bearer ${token}`,
   },
 }).then((res) => response = res?.data?.value)
 .catch((err) => console.error(err))
 return response
 }

 export const getSearchedFiles = async (token,searchQuery) => {
      const uri =`https://graph.microsoft.com/v1.0/sites/${siteId}/drives/${driveId}/root/children/Product Lists/search(q='${encodeURIComponent(searchQuery)}')`
      let response = []
  await axios.get(uri,{
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
  })
  .catch((err) => console.error(err))
  .then((res) => response = res)
  return response
 }

 export const getSearchedHistory = async(token) =>{
  let response = [];
  await axios.get(
    `https://graph.microsoft.com/v1.0/sites/${siteId}/lists/${listId}/items?expand=fields`,
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
  const url = `https://graph.microsoft.com/v1.0/sites/${siteId}/lists/${listId}/items`;
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
  const url = `https://graph.microsoft.com/v1.0/sites/${siteId}/lists/${listId}/items/${itemId}/fields`;
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