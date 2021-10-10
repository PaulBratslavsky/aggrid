import React, { useEffect, useState } from 'react';
import { AgGridReact } from 'ag-grid-react';

import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';

const url = "https://communityoneapi.herokuapp.com/projects";

export default function App() {
  const [rowData, setRowData] = useState([]);

  useEffect(() => {
    async function getProjects(url, callback) {
      const response = await fetch(url);
      const data = await response.json();
      console.log(data)
      const rowData = data.map(item => {
        const { id, name, likes, developer: { firstName, lastName } } = item;
        console.log(likes.length)
        return {
          id,
          name,
          fullName: `${firstName} ${lastName}`,
          likes: likes.length,
        }
      })

      setRowData(rowData)
    }

    getProjects(url)
    
  },[]);

  const columnDefs = [
    {
      headerName: 'ID',
      field: 'id',
      sortable: true,
      filter: true,
    },
    {
      headerName: 'Project',
      field: 'name',
      sortable: true,
      filter: true,
    },
    {
      headerName: 'Developer',
      field: 'fullName',
      sortable: true,
      filter: true,
    },
    {
      headerName: 'Likes',
      field: 'likes',
      sortable: true,
      filter: true,
    }
  ];

  return (
    <div className="ag-theme-alpine" style={{ height: 400, width: 750 }}>
      <AgGridReact rowData={rowData} columnDefs={columnDefs}></AgGridReact>
    </div>
  );
}
