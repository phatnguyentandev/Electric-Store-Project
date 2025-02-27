import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Box,
  TextField,
  MenuItem,
  TablePagination,
} from '@mui/material';

const ImportTable = ({ imports, onImportSelect }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchBy, setSearchBy] = useState('nameOfProduct');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const filteredImports = imports.filter((importItem) => {
    let isMatch = importItem[searchBy]?.toString().toLowerCase().includes(searchTerm.toLowerCase());
    if (searchBy === 'priceImport') {
      const price = parseFloat(importItem.priceImport);
      const min = minPrice ? parseFloat(minPrice) : 0;
      const max = maxPrice ? parseFloat(maxPrice) : Infinity;
      isMatch = isMatch && price >= min && price <= max;
    }
    return isMatch;
  });

  const handleRowClick = (importItem) => {
    onImportSelect(importItem);
  };

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden', p: 2 }}>
      <Typography variant="h5" component="h2" sx={{ mb: 2, fontWeight: 'bold', textAlign: 'center' }}>
        Bảng danh sách nhập hàng
      </Typography>

      <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
        <TextField
          label="Tìm kiếm"
          variant="outlined"
          size="small"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ flex: 1 }}
        />
        <TextField
          select
          label="Tìm kiếm theo"
          value={searchBy}
          onChange={(e) => setSearchBy(e.target.value)}
          size="small"
          sx={{ width: 200 }}
        >
          <MenuItem value="idProduct">Mã sản phẩm</MenuItem>
          <MenuItem value="nameOfProduct">Tên sản phẩm</MenuItem>
          <MenuItem value="priceImport">Giá nhập</MenuItem>
          <MenuItem value="idProvider">Mã nhà cung cấp</MenuItem>
          <MenuItem value="nameOfProvider">Tên nhà cung cấp</MenuItem>
        </TextField>
        {searchBy === 'priceImport' && (
          <Box sx={{ display: 'flex', gap: 1 }}>
            <TextField
              label="Giá tối thiểu"
              variant="outlined"
              size="small"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              type="number"
              sx={{ width: 140 }}
            />
            <TextField
              label="Giá tối đa"
              variant="outlined"
              size="small"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              type="number"
              sx={{ width: 140 }}
            />
          </Box>
        )}
      </Box>

      {filteredImports.length === 0 && (
        <Typography variant="body2" color="error" sx={{ textAlign: 'center' }}>
          Không tìm thấy kết quả
        </Typography>
      )}

      <TableContainer sx={{ maxHeight: 440, overflowY: 'auto', overflowX: 'auto' }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold', minWidth: 150 }}>ID nhập</TableCell>
              <TableCell sx={{ fontWeight: 'bold', minWidth: 150 }}>Mã sản phẩm</TableCell>
              <TableCell sx={{ fontWeight: 'bold', minWidth: 200 }}>Tên sản phẩm</TableCell>
              <TableCell sx={{ fontWeight: 'bold', textAlign: 'right', minWidth: 120 }}>Số lượng</TableCell>
              <TableCell sx={{ fontWeight: 'bold', textAlign: 'right', minWidth: 150 }}>Giá nhập</TableCell>
              <TableCell sx={{ fontWeight: 'bold', minWidth: 200 }}>Mã nhà cung cấp</TableCell>
              <TableCell sx={{ fontWeight: 'bold', minWidth: 200 }}>Tên nhà cung cấp</TableCell>
              <TableCell sx={{ fontWeight: 'bold', minWidth: 200 }}>Ngày nhập</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredImports.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((importItem, index) => (
              <TableRow
                key={index}
                hover
                onClick={() => handleRowClick(importItem)}
                sx={{ cursor: 'pointer', '&:hover': { backgroundColor: '#f5f5f5' } }}
              >
                <TableCell>{importItem._id}</TableCell>
                <TableCell>{importItem.idProduct}</TableCell>
                <TableCell>{importItem.nameOfProduct}</TableCell>
                <TableCell align="right">{importItem.quantity}</TableCell>
                <TableCell align="right">{importItem.priceImport}</TableCell>
                <TableCell>{importItem.idProvider}</TableCell>
                <TableCell>{importItem.nameOfProvider || 'N/A'}</TableCell>
                <TableCell>
                  {importItem.dateImport ? new Date(importItem.dateImport).toLocaleDateString() : 'N/A'}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={filteredImports.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={(event, newPage) => setPage(newPage)}
        onRowsPerPageChange={(event) => {
          setRowsPerPage(parseInt(event.target.value, 10));
          setPage(0);
        }}
        labelRowsPerPage="Số hàng mỗi trang:"
      />
    </Paper>
  );
};

export default ImportTable;
