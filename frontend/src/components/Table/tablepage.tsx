import { AgGridReact } from 'ag-grid-react'
import 'ag-grid-community/styles/ag-grid.css' // Base styles
import 'ag-grid-community/styles/ag-theme-alpine.css'
import './table.css'
import Loader from "../../components/loader/loader"
const LeadscontrolTable = (props: any) => {
  const { rowData, columnDefs, isloading } = props

  const gridOptions = {
    overlayNoRowsTemplate: `
      <div style="text-align: center; font-size: 16px; padding: 20px; color: #a0a0a0;">
        <div style="font-size: 50px; margin-bottom: 10px;">
          🗑️
        </div>
        No data 
      </div>
    `
  }

  const CustomLoadingOverlay = () => (
    <div className="custom-loading-overlay">
      <Loader  />;
    </div>
  )

  return (
    <div
      className="ag-theme-alpine ag-theme-custom"
      style={{
        height: '80%',
        width: '100%',
        marginTop: '1rem'
      }}
    >
      <AgGridReact
        rowData={rowData}
        columnDefs={columnDefs}
        animateRows={true}
        loadingOverlayComponent={CustomLoadingOverlay}
        loading={isloading}
        rowSelection="multiple"
        gridOptions={gridOptions}
      />
    </div>
  )
}

export default LeadscontrolTable
