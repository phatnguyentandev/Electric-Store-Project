import React, { useState } from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, TextField, MenuItem, Box, TablePagination
} from '@mui/material';

const WarehouseTable = ({ warehouses, onWarehouseSelect }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchBy, setSearchBy] = useState('nameOfProduct'); // Default search by product name
  const [quantityRange, setQuantityRange] = useState({ min: '', max: '' }); // Range for quantity
  const [page, setPage] = useState(0); // Current page index
  const [rowsPerPage, setRowsPerPage] = useState(10); // Number of rows per page

  // Handle range input change
  const handleRangeChange = (field, value) => {
    setQuantityRange((prev) => ({ ...prev, [field]: value }));
  };

  // Filter the warehouse data based on search criteria
  const filteredWarehouses = warehouses.filter((warehouse) => {
    if (searchBy === 'quantity') {
      const min = parseInt(quantityRange.min, 10) || 0;
      const max = parseInt(quantityRange.max, 10) || Number.MAX_VALUE;
      return warehouse.quantity >= min && warehouse.quantity <= max;
    }
    return warehouse[searchBy]?.toString().toLowerCase().includes(searchTerm.toLowerCase());
  });

  // Handle pagination page change
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  // Handle number of rows per page change
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0); // Reset to first page when rows per page change
  };

  // Get the current page data
  const currentPageData = filteredWarehouses.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  const handleRowClick = (warehouse) => {
    onWarehouseSelect(warehouse);
  };

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden', p: 2 }}>
      <Typography variant="h5" component="h2" sx={{ mb: 2, fontWeight: 'bold', textAlign: 'center' }}>
        Bảng danh sách kho hàng
      </Typography>
      
      <Box sx={{ mb: 2, display: 'flex', gap: 2 }}>
        {searchBy === 'quantity' ? (
          <>
            <TextField
              label="Số lượng từ"
              variant="outlined"
              size="small"
              type="number"
              value={quantityRange.min}
              onChange={(e) => handleRangeChange('min', e.target.value)}
              sx={{ flex: 1 }}
            />
            <TextField
              label="Số lượng đến"
              variant="outlined"
              size="small"
              type="number"
              value={quantityRange.max}
              onChange={(e) => handleRangeChange('max', e.target.value)}
              sx={{ flex: 1 }}
            />
          </>
        ) : (
          <TextField
            label="Tìm kiếm"
            variant="outlined"
            size="small"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ flex: 1 }}
          />
        )}
        <TextField
          select
          label="Tìm kiếm theo"
          value={searchBy}
          onChange={(e) => setSearchBy(e.target.value)}
          size="small"
          sx={{ width: 200 }}
        >
          <MenuItem value="nameOfProduct">Tên sản phẩm</MenuItem>
          <MenuItem value="idProduct">Mã sản phẩm</MenuItem>
          <MenuItem value="quantity">Số lượng</MenuItem>
          <MenuItem value="idProvider">Mã nhà cung cấp</MenuItem>
          <MenuItem value="nameOfProvider">Tên nhà cung cấp</MenuItem>
        </TextField>
      </Box>

      <TableContainer sx={{ maxHeight: 440, overflowY: 'auto', overflowX: 'auto' }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold', minWidth: 150 }}>Mã sản phẩm</TableCell>
              <TableCell sx={{ fontWeight: 'bold', minWidth: 120 }}>Tên sản phẩm</TableCell>
              <TableCell sx={{ fontWeight: 'bold', minWidth: 100, textAlign: 'right' }}>Số lượng</TableCell>
              <TableCell sx={{ fontWeight: 'bold', minWidth: 150 }}>Mã nhà cung cấp</TableCell>
              <TableCell sx={{ fontWeight: 'bold', minWidth: 150 }}>Tên nhà cung cấp</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {currentPageData.length > 0 ? (
              currentPageData.map((warehouse, index) => (
                <TableRow 
                  key={index} 
                  hover 
                  onClick={() => handleRowClick(warehouse)}
                  sx={{ 
                    cursor: 'pointer', 
                    '&:hover': { backgroundColor: '#f5f5f5' }, 
                    height: 50 
                  }}
                >
                  <TableCell sx={{ whiteSpace: 'nowrap' }}>{warehouse.idProduct}</TableCell>
                  <TableCell sx={{ whiteSpace: 'nowrap' }}>{warehouse.nameOfProduct}</TableCell>
                  <TableCell sx={{ whiteSpace: 'nowrap', textAlign: 'right' }}>{warehouse.quantity}</TableCell>
                  <TableCell sx={{ whiteSpace: 'nowrap' }}>{warehouse.idProvider}</TableCell>
                  <TableCell sx={{ whiteSpace: 'nowrap' }}>{warehouse.nameOfProvider}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  Không tìm thấy kho hàng
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        rowsPerPageOptions={[5, 10, 15]}
        component="div"
        count={filteredWarehouses.length} // Total filtered items
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        labelRowsPerPage="Số hàng mỗi trang:"
      />
    </Paper>
  );
};

export default WarehouseTable;
