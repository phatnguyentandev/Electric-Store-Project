import React, { useState, useEffect } from 'react';
import clientAPI from '../../../client-api/rest-client';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  TablePagination,
  Box,
  TextField,
  MenuItem,
} from '@mui/material';

const ProviderTable = ({ onProviderSelect }) => {
  const [providers, setProviders] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchBy, setSearchBy] = useState('nameOfProvider');

  useEffect(() => {
    const fetchProviders = async () => {
      try {
        const response = await clientAPI.service('provider').find();
        setProviders(response.data);
      } catch (error) {
        console.error('Error fetching providers:', error);
      }
    };
    fetchProviders();
  }, []);

  const filteredProviders = providers.filter((provider) =>
    provider[searchBy]?.toString().toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
      {/* Tiêu đề */}
      <Typography variant="h5" component="h2" sx={{ p: 2, fontWeight: 'bold' , textAlign: 'center'}}>
        Bảng danh sách nhà cung cấp
      </Typography>

      {/* Bộ lọc */}
      <Box sx={{ p: 2, display: 'flex', gap: 2 }}>
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
          sx={{ width: 180 }}
        >
          <MenuItem value="nameOfProvider">Tên nhà cung cấp</MenuItem>
          <MenuItem value="phone">Số điện thoại</MenuItem>
          <MenuItem value="address">Địa chỉ</MenuItem>
          <MenuItem value="gmail">Gmail</MenuItem>
        </TextField>
      </Box>

      {/* Bảng */}
      <TableContainer sx={{ maxHeight: 440, overflowY: 'auto', overflowX: 'auto' }}>
        <Table stickyHeader>
          {/* Tiêu đề cột */}
          <TableHead>
            <TableRow>
              <TableCell sx={{ minWidth: 100, maxWidth: 150, fontWeight: 'bold' }}>ID NCC</TableCell>
              <TableCell sx={{ minWidth: 150, maxWidth: 200, fontWeight: 'bold' }}>Tên NCC</TableCell>
              <TableCell sx={{ minWidth: 130, maxWidth: 180, fontWeight: 'bold' }}>Số điện thoại</TableCell>
              <TableCell sx={{ minWidth: 200, maxWidth: 300, fontWeight: 'bold' }}>Địa chỉ</TableCell>
              <TableCell sx={{ minWidth: 200, maxWidth: 250, fontWeight: 'bold' }}>Gmail</TableCell>
            </TableRow>
          </TableHead>

          {/* Dữ liệu */}
          <TableBody>
            {filteredProviders
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((provider) => (
                <TableRow
                  key={provider.idProvider}
                  hover
                  onClick={() => onProviderSelect(provider)}
                  sx={{
                    cursor: 'pointer',
                    '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.04)' },
                  }}
                >
                  <TableCell sx={{ minWidth: 100, maxWidth: 150 }}>{provider.idProvider}</TableCell>
                  <TableCell sx={{ minWidth: 150, maxWidth: 200 }}>{provider.nameOfProvider}</TableCell>
                  <TableCell sx={{ minWidth: 130, maxWidth: 180 }}>{provider.phone}</TableCell>
                  <TableCell
                    sx={{
                      minWidth: 200,
                      maxWidth: 300,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {provider.address}
                  </TableCell>
                  <TableCell
                    sx={{
                      minWidth: 200,
                      maxWidth: 250,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {provider.gmail}
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Phân trang */}
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={filteredProviders.length}
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

export default ProviderTable;
