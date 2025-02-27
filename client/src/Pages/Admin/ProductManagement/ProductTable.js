import React, { useState, useEffect } from 'react';
import clientAPI from '../../../client-api/rest-client';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Typography, TablePagination, Box, Chip, TextField, MenuItem
} from '@mui/material';

const ProductTable = ({ onProductSelect }) => {
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchBy, setSearchBy] = useState('nameOfProduct');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [selectedRow, setSelectedRow] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await clientAPI.service('product').find();
        setProducts(response.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    fetchProducts();
  }, []);

  const filteredProducts = products.filter(product => {
    const matchesSearchTerm = product[searchBy]?.toString().toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPriceRange =
      (!minPrice || product.price >= minPrice) &&
      (!maxPrice || product.price <= maxPrice);
    return matchesSearchTerm && matchesPriceRange;
  });

  const formatPrice = (price) => new Intl.NumberFormat('vi-VN', {
    style: 'currency', currency: 'VND'
  }).format(price);

  const getStatusLabel = (status) => {
    return status === 'Available' ? 'Còn hàng' : 'Hết hàng';
  };

  const getQuantityChipColor = (quantity) => {
    if (quantity < 10) return 'error';
    if (quantity < 50) return 'warning';
    return 'success';
  };

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden', p: 2 }}>
      <Typography variant="h5" component="h2" sx={{ mb: 2, fontWeight: 'bold', textAlign: 'center' }}>
        Bảng danh sách sản phẩm
      </Typography>

      {/* Search and Filter */}
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
          <MenuItem value="nameOfProduct">Tên sản phẩm</MenuItem>
          <MenuItem value="typeProduct">Loại sản phẩm</MenuItem>
          <MenuItem value="price">Giá</MenuItem>
          <MenuItem value="idProduct">Mã sản phẩm</MenuItem>
          <MenuItem value="status">Trạng thái</MenuItem>
        </TextField>

        {searchBy === 'price' && (
          <Box sx={{ display: 'flex', gap: 1 }}>
            <TextField
              label="Giá tối thiểu"
              variant="outlined"
              size="small"
              type="number"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              sx={{ width: 180 }}
            />
            <TextField
              label="Giá tối đa"
              variant="outlined"
              size="small"
              type="number"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              sx={{ width: 180 }}
            />
          </Box>
        )}
      </Box>

      {/* Table */}
      <TableContainer sx={{ maxHeight: 440, overflowY: 'auto', overflowX: 'auto' }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold', minWidth: 80 }}>Mã SP</TableCell>
              <TableCell sx={{ fontWeight: 'bold', minWidth: 150 }}>Tên sản phẩm</TableCell>
              <TableCell sx={{ fontWeight: 'bold', minWidth: 100 }}>Loại</TableCell>
              <TableCell sx={{ fontWeight: 'bold', minWidth: 80, textAlign:"right"}}>Số lượng</TableCell>
              <TableCell sx={{ fontWeight: 'bold', minWidth: 80, textAlign:"right"}}>Giá</TableCell>
              <TableCell sx={{ fontWeight: 'bold', minWidth: 150}}>Trạng thái</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredProducts.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(product => (
              <TableRow
                key={product.idProduct}
                hover
                selected={selectedRow === product.idProduct}
                onClick={() => {
                  setSelectedRow(product.idProduct);
                  onProductSelect(product);
                }}
                sx={{ cursor: 'pointer', '&:hover': { backgroundColor: '#f5f5f5' } }}
              >
                <TableCell>{product.idProduct}</TableCell>
                <TableCell>
                  <Typography
                    variant="body1"
                    sx={{ fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.1em' }}
                  >
                    {product.nameOfProduct}
                  </Typography>
                </TableCell>
                <TableCell>{product.typeProduct}</TableCell>
                <TableCell align="right">
                  <Chip
                    label={product.quantity}
                    color={getQuantityChipColor(product.quantity)}
                    size="small"
                  />
                </TableCell>
                <TableCell align="right">{formatPrice(product.price)}</TableCell>
                <TableCell align="left">
                  <Chip
                    label={getStatusLabel(product.status)}
                    color={product.status === 'Available' ? 'success' : 'error'}
                    size="small"
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={filteredProducts.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={(event, newPage) => setPage(newPage)}
        onRowsPerPageChange={(event) => { setRowsPerPage(parseInt(event.target.value, 10)); setPage(0); }}
        labelRowsPerPage="Số hàng mỗi trang:"
      />
    </Paper>
  );
};

export default ProductTable;
