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

const ExpressCompanyTable = ({ companies, onCompanySelect }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchBy, setSearchBy] = useState('nameOfCompany');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const filteredCompanies = companies.filter((company) =>
    company[searchBy]?.toString().toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleRowClick = (company) => {
    onCompanySelect(company);
  };

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden', p: 2 }}>
      <Typography variant="h5" component="h2" sx={{ mb: 2, fontWeight: 'bold', textAlign: 'center' }}>
        Bảng danh sách công ty vận chuyển
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
          <MenuItem value="id">Mã công ty</MenuItem>
          <MenuItem value="companyName">Tên công ty</MenuItem>
          <MenuItem value="phone">Số điện thoại</MenuItem>
          <MenuItem value="email">Email</MenuItem>
        </TextField>
      </Box>

      {filteredCompanies.length === 0 && (
        <Typography variant="body2" color="error" sx={{ textAlign: 'center' }}>
          Không tìm thấy kết quả
        </Typography>
      )}

      <TableContainer sx={{ maxHeight: 440, overflowY: 'auto', overflowX: 'auto' }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold', minWidth: 150 }}>Mã công ty</TableCell>
              <TableCell sx={{ fontWeight: 'bold', minWidth: 250 }}>Tên công ty</TableCell>
              <TableCell sx={{ fontWeight: 'bold', minWidth: 200 }}>Số điện thoại</TableCell>
              <TableCell sx={{ fontWeight: 'bold', minWidth: 250 }}>Email</TableCell>
              <TableCell sx={{ fontWeight: 'bold', minWidth: 300 }}>Địa chỉ</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredCompanies.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((company, index) => (
              <TableRow
                key={index}
                hover
                onClick={() => handleRowClick(company)}
                sx={{ cursor: 'pointer', '&:hover': { backgroundColor: '#f5f5f5' } }}
              >
                <TableCell>{company.idCompany}</TableCell>
                <TableCell>{company.nameOfCompany}</TableCell>
                <TableCell>{company.phone}</TableCell>
                <TableCell>{company.email}</TableCell>
                <TableCell>{company.address || 'N/A'}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={filteredCompanies.length}
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

export default ExpressCompanyTable;
