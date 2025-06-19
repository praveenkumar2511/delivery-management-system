// import TableactionPage from "./tableactionpage"

const getGridData = (
    data: any,
    // onView: (id: string) => void,
    // onEdit: (id: string, assignement_id: string) => void,
    // onDelete: (id: string) => void,
    // onTransfer: (assignement_id: string) => void
  ) => {
    if (data?.length === 0) {
      return { columnDefs: [], rowData: [] }
    }
  console.log(data,"uuuuuuuuuuuuuuuuuuuuuuuu");
  
    // const role = sessionStorage.getItem('role')
  
    const columnDefs = [
      {
        headerName: 'S.No',
        valueGetter: (params: any) => params.node.rowIndex + 1,
        sortable: true, // No need to sort serial numbers
        width: 70 // Adjust the width as needed
      },
      {
        headerName: 'Purity',
        field: 'frontend_label',
        width: 500,
        Flex: 0
      },
      {
        headerName: 'Cost %',
        field: 'cost_percentage',
        width: 500,
        Flex: 0,
        cellRenderer: (params: any) => {
          const content =
            params.value !== null || params.value === '' ? params.value : '-'
          return content
        }
      },
      { headerName: 'Web %', field: 'web_percentage', width: 130, Flex: 0 },
  
      {
        headerName: 'Rate',
        field: 'rate',
        width: 500,
        Flex: 0,
        cellRenderer: (params: any) => {
          const content =
            params.value !== null || params.value === '' ? params.value : '-'
          return content
        }
      },
  
    ]
  
    const rowData = data
  
    return { columnDefs, rowData }
  }

  export default getGridData