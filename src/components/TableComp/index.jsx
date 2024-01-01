import { Table,Pagination  } from 'antd';
import React, { useState } from 'react'

import "./styles.css"
const TableComponent = (props) => {
  const { selectionType = 'checkbox', data:dataSource = [], columns = [] } = props

  
  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      // setRowSelectedKeys(selectedRowKeys)
    },
    getCheckboxProps: (record) => ({
      disabled: record.name === 'Disabled User',
      name: record.name,
    }),
  };


//   const exportExcel = () => {
//     const excel = new Excel();
//     excel
//       .addSheet("test")
//       .addColumns(newColumnExport)
//       .addDataSource(dataSource, {
//         str2Percent: true
//       })
//       .saveAs("Excel.xlsx");
//   };
const [pageSize, setPageSize] = useState(7);
const handlePageSizeChange = (newPageSize) => {
  setPageSize(newPageSize);
};
  
  return (
    <div>

      {/* <button onClick={exportExcel}>Export Excel</button> */}
      <Table
        rowSelection={{
          type: selectionType,
          ...rowSelection,
        }}
        columns={columns}
        dataSource={dataSource}
        pagination={{
          pageSize: pageSize,
        }}
        {...props}
        // className={styles.customTable}
        className='custom-table'
      />
       <Pagination style={{display:"none"}}
        pageSize={pageSize}
        onChange={handlePageSizeChange}
        showSizeChanger
        showQuickJumper
        pageSizeOptions={['7', '10', '20', '50']} // Các tùy chọn kích thước trang
        defaultPageSize={7} // Kích thước trang mặc định
      />
     </div>
  )
}

export default TableComponent