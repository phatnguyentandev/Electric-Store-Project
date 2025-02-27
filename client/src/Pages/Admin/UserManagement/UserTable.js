import React, { useState, useEffect } from 'react';
import clientAPI from '../../../client-api/rest-client';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Typography, TablePagination, Box, TextField, MenuItem
} from '@mui/material';

const UserTable = ({ onUserSelect }) => {
  const [users, setUsers] = useState([]);
  const [accounts, setAccounts] = useState({});
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchBy, setSearchBy] = useState('name');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        // Fetch users and staff data
        const [response, response2] = await Promise.all([
          clientAPI.service('user').find(),
          clientAPI.service('staff').find(),
        ]);
  
        // Merge the data from both responses
        const allUsers = [...response.data, ...response2.data];
        setUsers(allUsers);
  
        // Fetch accounts for each user by idAccount
        const accountsData = {};
        for (let user of allUsers) {
          const accountResponse = await clientAPI.service('account').get(user.idAccount);
          accountsData[user.idAccount] = accountResponse.data;
        }
        setAccounts(accountsData);
      } catch (error) {
        console.error('Error fetching users or accounts:', error);
        setError('Failed to load users. Please try again later.');
      }
    };
  
    fetchUsers();
  }, []);

  const filteredUsers = users.filter((user) => {
    const account = accounts[user.idAccount];
    const role = account ? account.role : '';

    switch (searchBy) {
      case 'name':
        return user.name?.toLowerCase().includes(searchTerm.toLowerCase());
      case 'phone':
        return user.phone?.toLowerCase().includes(searchTerm.toLowerCase());
      case 'email':
        return user.email?.toLowerCase().includes(searchTerm.toLowerCase());
      case 'role':
        return role?.toLowerCase().includes(searchTerm.toLowerCase());
      default:
        return false;
    }
  });

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden', p: 2 }}>
      <Typography variant="h5" component="h2" sx={{ mb: 2, fontWeight: 'bold', textAlign: 'center' }}>
          Bảng danh sách thông tin người dùng
      </Typography>
      
      {error && (
        <Typography variant="body2" color="error" sx={{ p: 2 }}>
          {error}
        </Typography>
      )}
      
      <Box sx={{ p: 2, display: 'flex', gap: 2 }}>
        <TextField
          label="Search"
          variant="outlined"
          size="small"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ flex: 1 }}
        />
        <TextField
          select
          label="Search by"
          value={searchBy}
          onChange={(e) => setSearchBy(e.target.value)}
          size="small"
          sx={{ width: 180 }}
        >
          <MenuItem value="name">Tên</MenuItem>
          <MenuItem value="phone">Số điện thoại</MenuItem>
          <MenuItem value="email">Email</MenuItem>
          <MenuItem value="role">Quyền</MenuItem> {/* Option to search by Role */}
        </TextField>
      </Box>
      
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold', minWidth: 150 }}>ID Account</TableCell>
              <TableCell sx={{ fontWeight: 'bold', minWidth: 150 }}>Tên</TableCell>
              <TableCell sx={{ fontWeight: 'bold', minWidth: 150 }}>Số điện thoại</TableCell>
              <TableCell sx={{ fontWeight: 'bold', minWidth: 150 }}>Email</TableCell>
              <TableCell sx={{ fontWeight: 'bold', minWidth: 150 }}>Địa chỉ</TableCell>
              <TableCell sx={{ fontWeight: 'bold', minWidth: 150 }}>Role</TableCell> {/* Add Role column */}
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((user) => {
              const account = accounts[user.idAccount];
              const role = account ? account.role : 'No Role'; // Fallback if account doesn't have a role
              const userWithRole = { ...user, role }; // Combine user data with role

              return (
                <TableRow hover key={user.idAccount} onClick={() => onUserSelect(userWithRole)}>
                  <TableCell>{user.idAccount}</TableCell>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.phone}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.address}</TableCell>
                  <TableCell>{role}</TableCell> {/* Display role */}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
      
      <TablePagination
        rowsPerPageOptions={[5, 10, 15]}
        component="div"
        count={filteredUsers.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={(e, newPage) => setPage(newPage)}
        onRowsPerPageChange={(e) => setRowsPerPage(parseInt(e.target.value, 10))}
      />
    </Paper>
  );
};

export default UserTable;
