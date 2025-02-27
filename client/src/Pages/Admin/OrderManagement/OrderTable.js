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
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  Chip,
} from '@mui/material';

const OrderTable = ({ orders, onOrderSelect }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchBy, setSearchBy] = useState('nameOfCustomer');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSearchByChange = (e) => {
    setSearchBy(e.target.value);
  };

  const handleFromDateChange = (e) => {
    setFromDate(e.target.value);
  };

  const handleToDateChange = (e) => {
    setToDate(e.target.value);
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleRowClick = (orderId) => {
    onOrderSelect(orderId);
  };

  const handleRowDoubleClick = (order) => {
    setSelectedOrder(order);
  };

  const handleCloseModal = () => {
    setSelectedOrder(null);
  };

  const filteredOrders = orders.filter((order) => {
    const searchMatch =
      order[searchBy]?.toString().toLowerCase().includes(searchTerm.toLowerCase());

    if (searchBy === 'dateOrder') {
      const orderDate = new Date(order.dateOrder);
      const from = fromDate ? new Date(fromDate) : null;
      const to = toDate ? new Date(toDate) : null;
      const dateMatch =
        (!from || orderDate >= from) && (!to || orderDate <= to);
      return searchMatch && dateMatch;
    }

    return searchMatch;
  });

  const getOrderStatusChip = (status) => {
    let label = '';
    let color = '';
    let backgroundColor = '';

    switch (status) {
      case 'Chờ xác nhận':
        label = 'Chờ xác nhận';
        color = 'warning';
        backgroundColor = '#FFCC00';
        break;
      case 'Chờ lấy hàng':
        label = 'Chờ lấy hàng';
        color = 'info';
        backgroundColor = '#FFCC00';
        break;
      case 'Đang vận chuyển':
        label = 'Đang vận chuyển';
        color = 'primary';
        backgroundColor = '#FFCC00';
        break;
      case 'Đang giao':
        label = 'Đang giao';
        color = 'primary';
        backgroundColor = '#FFCC00';
        break;
      case 'Đã giao':
        label = 'Đã giao';
        color = 'success';
        backgroundColor = '#006600';
        break;
      case 'Đã hủy':
        label = 'Đã hủy';
        color = 'error';
        backgroundColor = '#FF0000';
        break;
      default:
        label = 'Không xác định';
        color = 'default';
        backgroundColor = 'lightgray';
    }

    return (
      <Chip
        label={label}
        color={color}
        size="small"
        sx={{
          backgroundColor: backgroundColor,
          color: color === 'default' ? 'black' : 'white',
        }}
      />
    );
  };

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden', p: 2 }}>
      <Typography
        variant="h5"
        component="h2"
        sx={{ mb: 2, fontWeight: 'bold', textAlign: 'center' }}
      >
        Bảng danh sách đơn hàng
      </Typography>

      {/* Thanh công cụ tìm kiếm */}
      <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
        <TextField
          label="Tìm kiếm"
          variant="outlined"
          size="small"
          value={searchTerm}
          onChange={handleSearch}
          sx={{ flex: 1 }}
        />
        <TextField
          select
          label="Tìm kiếm theo"
          value={searchBy}
          onChange={handleSearchByChange}
          size="small"
          sx={{ width: 200 }}
        >
          <MenuItem value="nameOfCustomer">Tên Khách Hàng</MenuItem>
          <MenuItem value="phone">Số Điện Thoại</MenuItem>
          <MenuItem value="address">Địa Chỉ</MenuItem>
          <MenuItem value="payment_method">Phương Thức Thanh Toán</MenuItem>
          <MenuItem value="isPayment">Trạng Thái Thanh Toán</MenuItem>
          <MenuItem value="dateOrder">Ngày Đặt Hàng</MenuItem>
          <MenuItem value="status">Trạng Thái</MenuItem>
        </TextField>
        {searchBy === 'dateOrder' && (
          <Box sx={{ display: 'flex', gap: 2 }}>
            <TextField
              label="Từ Ngày"
              type="date"
              value={fromDate}
              onChange={handleFromDateChange}
              size="small"
              sx={{ width: 200 }}
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              label="Đến Ngày"
              type="date"
              value={toDate}
              onChange={handleToDateChange}
              size="small"
              sx={{ width: 200 }}
              InputLabelProps={{ shrink: true }}
            />
          </Box>
        )}
      </Box>

      {/* Bảng danh sách đơn hàng */}
      <TableContainer sx={{ maxHeight: 440, overflowY: 'auto' }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold', minWidth: 150 }}>Tên Khách Hàng</TableCell>
              <TableCell sx={{ fontWeight: 'bold', minWidth: 150 }}>Số Điện Thoại</TableCell>
              <TableCell sx={{ fontWeight: 'bold', minWidth: 250 }}>Địa Chỉ</TableCell>
              <TableCell sx={{ fontWeight: 'bold', minWidth: 150 }}>Ngày Đặt Hàng</TableCell>
              <TableCell sx={{ fontWeight: 'bold', minWidth: 150 }}>Tổng Tiền</TableCell>
              <TableCell sx={{ fontWeight: 'bold', minWidth: 150 }}>Phương Thức Thanh Toán</TableCell>
              <TableCell sx={{ fontWeight: 'bold', minWidth: 180 }}>Trạng Thái Thanh Toán</TableCell>
              <TableCell sx={{ fontWeight: 'bold', minWidth: 150 }}>Trạng Thái</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredOrders
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((order) => (
                <TableRow
                  key={order._id}
                  hover
                  onClick={() => handleRowClick(order._id)}
                  onDoubleClick={() => handleRowDoubleClick(order)}
                  sx={{ cursor: 'pointer', '&:hover': { backgroundColor: '#f5f5f5' } }}
                >
                  <TableCell>{order.nameOfCustomer}</TableCell>
                  <TableCell>{order.phone}</TableCell>
                  <TableCell>{order.address}</TableCell>
                  <TableCell>
                    {new Date(order.dateOrder).toLocaleDateString('vi-VN', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric',
                    })}
                  </TableCell>
                  <TableCell>{order.totalPrice?.toLocaleString()} VNĐ</TableCell>
                  <TableCell>{order.payment_method}</TableCell>
                  <TableCell>{order.isPayment ? 'Đã thanh toán' : 'Chưa thanh toán'}</TableCell>
                  <TableCell>{getOrderStatusChip(order.status)}</TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={filteredOrders.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleRowsPerPageChange}
      />

      {/* Modal chi tiết đơn hàng */}
      {selectedOrder && (
        <Dialog open={Boolean(selectedOrder)} onClose={handleCloseModal}>
          <DialogTitle>
            Thông Tin Đơn Hàng
            <Button onClick={handleCloseModal} sx={{ position: 'absolute', right: 8, top: 8 }}>
              X
            </Button>
          </DialogTitle>
          <DialogContent>
            {selectedOrder && (
              <>
                <Typography variant="h6">Thông Tin Sản Phẩm</Typography>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Tên Sản Phẩm</TableCell>
                        <TableCell>Số Lượng</TableCell>
                        <TableCell>Đơn Giá</TableCell>
                        <TableCell>Tổng Giá</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {selectedOrder.products.map((product, index) => (
                        <TableRow key={index}>
                          <TableCell>{product.nameOfProduct}</TableCell>
                          <TableCell>{product.quantity}</TableCell>
                          <TableCell>{product.price?.toLocaleString()} VNĐ</TableCell>
                          <TableCell>{(product.quantity * product.price)?.toLocaleString()} VNĐ</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseModal} color="primary">
              Đóng
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </Paper>
  );
};

export default OrderTable;
