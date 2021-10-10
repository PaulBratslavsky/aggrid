import React, { useEffect, useRef, useState } from 'react';
import { AgGridReact } from 'ag-grid-react';

import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';

const url = 'https://communityoneapi.herokuapp.com/projects';

function parseDataFromApi(data) {
  return data.map((item) => {
    const {
      id,
      name,
      likes,
      developer: { firstName, lastName },
    } = item;
    return {
      id,
      name,
      fullName: `${firstName} ${lastName}`,
      likes: likes.length,
    };
  });
}

export default function App() {
  const [rowData, setRowData] = useState([]);
  const [isModelVisible, setIsModelVisible] = useState(true);
  const gridRef = useRef(null);

  useEffect(() => {
    async function getProjects(url) {
      const response = await fetch(url);
      const data = await response.json();
      const rowData = parseDataFromApi(data);
      setRowData(rowData);
    }

    getProjects(url);
  }, []);

  useEffect(() => {
    const columnApi = gridRef.current.columnApi;
    columnApi.setColumnVisible('id', isModelVisible);
  }, [isModelVisible]);

  const columnDefs = [
    {
      headerName: 'ID',
      field: 'id',
      sortable: true,
      filter: true,
      checkboxSelection: true,
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
    },
  ];

  function onButtonClick() {
    const selectedNodes = gridRef.current.api.getSelectedNodes();
    const selectedData = selectedNodes.map((node) => node.data);
    const selectedDataStringPresentation = selectedData
      .map((node) => `${node.name} ${node.id}`)
      .join(', ');
    alert(`Selected nodes: ${selectedDataStringPresentation}`);
  }

  function toggleColumn() {
    setIsModelVisible((prevState) => !prevState);
  }

  return (
    <div className="ag-theme-alpine" style={{ height: 400, width: 800 }}>
      <button onClick={onButtonClick}>Get selected rows</button>
      <button onClick={toggleColumn}>
        {isModelVisible ? 'Hide Id Column' : 'Show Id Column'}
      </button>

      <AgGridReact
        ref={gridRef}
        rowData={rowData}
        rowSelection="multiple"
        columnDefs={columnDefs}
      ></AgGridReact>
    </div>
  );
}
