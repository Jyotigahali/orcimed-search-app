import axios from "axios";

const siteId = 'e2198835-654d-418c-830f-97303ae5b25e';
const driveId = 'b!NYgZ4k1ljEGDD5cwOuWyXqagOUfN8KBLhXC8Fj-LnbOYys0eNiKwSYPqabU3psXn'
const apiEndPoint = `https://graph.microsoft.com/v1.0/sites/${siteId}/drives/${driveId}`;
// const apiEndPoint = `${apiUrl}/root/children/Product Lists/children`;
// const fileWorkSheetsApi = `${apiUrl}/items/016BREBXLP5IIL4B5E3NH2LSR3Q2NTBAEA/workbook/worksheets`
// const siteUrl = 'https://orcimedlifesciences.sharepoint.com/sites/MedTrackProject';
// const WorkSheetDataApi = `${apiUrl}/items/016BREBXLP5IIL4B5E3NH2LSR3Q2NTBAEA/workbook/worksheets('SheetName')/usedRange`;

export const getFiles = async (token) => {
  let respone = []
 await axios.get(`${apiEndPoint}/root/children/Product Lists/children`, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
      },
    }).catch(err => console.error(err)).then((res) =>{
      respone = res
  }      
    );
    return respone;
};

export const getFileWorkSheets = async (fileId,token) => {
 let response = [];
 await axios.get(`${apiEndPoint}/items/${fileId}/workbook/worksheets`, {
  headers: {
    Authorization: `Bearer ${token}`,
  },
}).then((res) => response = res?.data?.value
).catch((err) => console.error(err)
)
return response
}

export const getWorkSheetData = async (fileId,workSheet,token) => {
  let response = [];
  await axios.get(`${apiEndPoint}/items/${fileId}/workbook/worksheets('${workSheet}')/usedRange`, {
   headers: {
     Authorization: `Bearer ${token}`,
   },
 }).then((res) => response = res?.data?.values
 ).catch((err) => console.error(err)
 )
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
  }).catch((err) => console.error(err)
  ).then((res) => response = res
  )
  return response
 }