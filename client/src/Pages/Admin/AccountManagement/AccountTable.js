import React, { useState, useEffect } from 'react';
import clientAPI from '../../../client-api/rest-client';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Typography, TablePagination, Box, TextField, MenuItem, Chip
} from '@mui/material';

const AccountTable = ({ onAccountSelect }) => {
  const [accounts, setAccounts] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchBy, setSearchBy] = useState('email');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const response = await clientAPI.service('account').find();
        setAccounts(response.data || []);
      } catch (error) {
        setError('Failed to fetch accounts.');
      } finally {
        setLoading(false);
      }
    };
    fetchAccounts();
  }, []);

  const filteredAccounts = accounts.filter(account =>
    account[searchBy]?.toString().toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden', p: 2 }}>
      <Typography variant="h5" component="h2" sx={{ fontWeight: 'bold', mb: 2, textAlign: 'center' }}>
        Bảng danh sách tài khoản
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
          <MenuItem value="email">Email</MenuItem>
          <MenuItem value="username">Username</MenuItem>
          <MenuItem value="role">Role</MenuItem>
          <MenuItem value="isActive">Is Active</MenuItem>
        </TextField>
      </Box>

      <TableContainer sx={{ maxHeight: 440, overflowY: 'auto', overflowX: 'auto' }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold', minWidth: 100 }}>ID</TableCell>
              <TableCell sx={{ fontWeight: 'bold', minWidth: 150 }}>Tên</TableCell>
              <TableCell sx={{ fontWeight: 'bold', minWidth: 200 }}>Email</TableCell>
              <TableCell sx={{ fontWeight: 'bold', minWidth: 150 }}>Quyền</TableCell>
              <TableCell sx={{ fontWeight: 'bold', minWidth: 120 }}>Trạng thái</TableCell>
              <TableCell sx={{ fontWeight: 'bold', minWidth: 120 }}>Mật khẩu</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredAccounts.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((account) => (
              <TableRow
                key={account._id}
                hover
                onClick={() => onAccountSelect(account)}
                sx={{ cursor: 'pointer', '&:hover': { backgroundColor: '#f5f5f5' } }}
              >
                <TableCell>{account._id}</TableCell>
                <TableCell>{account.username}</TableCell>
                <TableCell>{account.email}</TableCell>
                <TableCell>{account.role}</TableCell>
                <TableCell>
                  <Chip
                    label={account.isActive ? 'Active' : 'Inactive'}
                    color={account.isActive ? 'success' : 'error'}
                    size="small"
                  />
                </TableCell>
                <TableCell>{'******'}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={filteredAccounts.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={(e, newPage) => setPage(newPage)}
        onRowsPerPageChange={(e) => setRowsPerPage(parseInt(e.target.value, 10))}
      />
    </Paper>
  );
};

export default AccountTable;
