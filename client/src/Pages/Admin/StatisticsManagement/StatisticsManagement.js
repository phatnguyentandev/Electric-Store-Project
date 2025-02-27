import React, { useState, useEffect } from 'react';
import SideNav from '../SideNav';
import clientAPI from '../../../client-api/rest-client';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Box, TextField, TablePagination, TableFooter } from '@mui/material';

const StatisticsManagement = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(true);
  const [orders, setOrders] = useState([]);
  const [warehouseData, setWarehouseData] = useState([]);
  const [importData, setImportData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [activeView, setActiveView] = useState('table');
  const [tableStartDate, setTableStartDate] = useState('');
  const [tableEndDate, setTableEndDate] = useState('');
  const [importStartDate, setImportStartDate] = useState('');
  const [importEndDate, setImportEndDate] = useState('');
  const [revenueStartDate, setRevenueStartDate] = useState('');
  const [revenueEndDate, setRevenueEndDate] = useState('');
  const [topProductsStartDate, setTopProductsStartDate] = useState('');
  const [topProductsEndDate, setTopProductsEndDate] = useState('');
  const [lowStockStartDate, setLowStockStartDate] = useState('');
  const [lowStockEndDate, setLowStockEndDate] = useState('');

  const toggleMenu = () => setIsMenuOpen(prev => !prev);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [orderResponse, warehouseResponse, importResponse] = await Promise.all([
        clientAPI.service('order').find(),
        clientAPI.service('warehouse').find(),
        clientAPI.service('import').find()
      ]);

      setOrders(orderResponse.data);
      setWarehouseData(warehouseResponse.data);

      const importDataWithTotal = importResponse.data.map(entry => ({
        ...entry,
        totalPrice: entry.quantity * entry.priceImport
      }));

      setImportData(importDataWithTotal);

    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Unable to load data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [tableStartDate, tableEndDate, importStartDate, importEndDate, revenueStartDate, revenueEndDate, topProductsStartDate, topProductsEndDate, lowStockStartDate, lowStockEndDate]);

  const handleSearch = e => setSearchTerm(e.target.value);
  const handlePageChange = (e, newPage) => setPage(newPage);
  const handleRowsPerPageChange = e => setRowsPerPage(parseInt(e.target.value, 10));

  const groupAndSummarizeProducts = (orders, warehouseData) => {
    const productSummary = {};

    orders.forEach(({ products }) => {
      products.forEach(({ nameOfProduct, quantity, price }) => {
        if (!productSummary[nameOfProduct]) {
          productSummary[nameOfProduct] = { nameOfProduct, quantity: 0, totalPrice: 0 };
        }
        productSummary[nameOfProduct].quantity += quantity;
        productSummary[nameOfProduct].totalPrice += quantity * price;
      });
    });

    warehouseData.forEach(({ nameOfProduct, quantity }) => {
      if (!productSummary[nameOfProduct]) {
        productSummary[nameOfProduct] = { nameOfProduct, quantity: 0, totalPrice: 0, warehouseQuantity: quantity };
      } else {
        productSummary[nameOfProduct].warehouseQuantity = quantity;
      }
    });

    return Object.values(productSummary);
  };

  const filterDataByDateRange = (data, startDate, endDate, dateKey) => {
    const start = startDate ? new Date(startDate).setHours(0, 0, 0, 0) : null;
    const end = endDate ? new Date(endDate).setHours(23, 59, 59, 999) : null;

    return data.filter(item => {
      const date = new Date(item[dateKey]);
      return (!start || date >= start) && (!end || date <= end);
    });
  };

  const calculateTotalPrice = (data, priceKey) => {
    return data.reduce((acc, item) => acc + item[priceKey], 0);
  };

  const calculateTotalSales = (orders) => {
    return orders.reduce((acc, order) => {
      return acc + order.products.reduce((acc, product) => {
        return acc + (product.quantity * product.price);
      }, 0);
    }, 0);
  };

  const calculateRevenue = () => {
    const filteredSales = filterDataByDateRange(orders, revenueStartDate, revenueEndDate, 'dateOrder');
    const filteredSalesTotal = calculateTotalSales(filteredSales);

    const filteredImports = filterDataByDateRange(importData, revenueStartDate, revenueEndDate, 'dateImport');
    const filteredImportsTotal = calculateTotalPrice(filteredImports, 'totalPrice');

    return filteredSalesTotal - filteredImportsTotal;
  };

  const filteredOrders = groupAndSummarizeProducts(filterDataByDateRange(orders, tableStartDate, tableEndDate, 'dateOrder'), warehouseData)
    .filter(product => product.nameOfProduct.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => b.quantity - a.quantity);

  const topSellingProducts = groupAndSummarizeProducts(filterDataByDateRange(orders, topProductsStartDate, topProductsEndDate, 'dateOrder'), warehouseData)
    .filter(product => product.quantity === filteredOrders[0]?.quantity);

  const lowStockProducts = groupAndSummarizeProducts(filterDataByDateRange(orders, lowStockStartDate, lowStockEndDate, 'dateOrder'), warehouseData)
    .filter(product => {
      const totalQuantity = product.quantity + (product.warehouseQuantity || 0);
      return totalQuantity > 0 && product.quantity / totalQuantity < 0.1;
    });

  const filteredImportData = filterDataByDateRange(importData, importStartDate, importEndDate, 'dateImport');

  return (
    <div className="flex h-screen">
      <SideNav isOpen={isMenuOpen} toggleSidebar={toggleMenu} />
      <div className={`bg-white border-r shadow-md h-screen ${isMenuOpen ? 'w-80' : 'w-10'} relative`}>
        <button
          onClick={toggleMenu}
          className="absolute top-266 -right-0 transform -translate-y-1/2 bg-gray-200 p-1 rounded-full"
        >
          {isMenuOpen ? '<' : '>'}
        </button>
        {isMenuOpen && (
          <div className="p-4">
            <button
              onClick={() => setActiveView('table')}
              className={`w-full text-left ${activeView === 'table' ? 'bg-pink-500 text-white' : 'bg-white text-black'} p-2 rounded-md`}
            >
              Thống kê sản phẩm đã bán
            </button>
            <button
              onClick={() => setActiveView('topProducts')}
              className={`w-full text-left ${activeView === 'topProducts' ? 'bg-pink-500 text-white' : 'bg-white text-black'} p-2 rounded-md mt-2`}
            >
              Sản phẩm bán chạy nhất
            </button>
            <button
              onClick={() => setActiveView('lowStock')}
              className={`w-full text-left ${activeView === 'lowStock' ? 'bg-pink-500 text-white' : 'bg-white text-black'} p-2 rounded-md mt-2`}
            >
              Sản phẩm bán được ít
            </button>
            <button
              onClick={() => setActiveView('importTotal')}
              className={`w-full text-left ${activeView === 'importTotal' ? 'bg-pink-500 text-white' : 'bg-white text-black'} p-2 rounded-md mt-2`}
            >
              Tổng đơn nhập
            </button>
            <button
              onClick={() => setActiveView('revenue')}
              className={`w-full text-left ${activeView === 'revenue' ? 'bg-pink-500 text-white' : 'bg-white text-black'} p-2 rounded-md mt-2`}
            >
              Doanh thu
            </button>
          </div>
        )}
      </div>
      <div className={`flex-1 h-full px-4 transition-all ${isMenuOpen ? 'ml-180' : 'ml-1'} ${isMenuOpen ? 'pl-10' : 'pl-4'}`}>
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : activeView === 'revenue' ? (
          <Paper sx={{ width: '100%', overflow: 'hidden' }}>
            <Typography variant="h5" component="h2"             sx={{ p: 2, fontWeight: 'bold' }}>
              Doanh thu
            </Typography>
            <Box sx={{ p: 2 }} display="flex" justifyContent="space-between">
              <Box>
                <TextField
                  label="Từ ngày"
                  variant="outlined"
                  type="date"
                  value={revenueStartDate}
                  onChange={(e) => setRevenueStartDate(e.target.value)}
                  sx={{ marginRight: 2 }}
                  InputLabelProps={{ shrink: true }}
                />
                <TextField
                  label="Đến ngày"
                  variant="outlined"
                  type="date"
                  value={revenueEndDate}
                  onChange={(e) => setRevenueEndDate(e.target.value)}
                  sx={{ marginRight: 2 }}
                  InputLabelProps={{ shrink: true }}
                />
              </Box>
            </Box>
            <Typography variant="h6" component="h3" sx={{ p: 2, fontWeight: 'bold' }}>
              Tổng doanh thu: {calculateRevenue().toLocaleString()} VND
            </Typography>
          </Paper>
        ) : activeView === 'importTotal' ? (
          <Paper sx={{ width: '100%', overflow: 'hidden' }}>
            <Typography variant="h5" component="h2" sx={{ p: 2, fontWeight: 'bold' }}>
              Tổng đơn nhập
            </Typography>
            <Box sx={{ p: 2 }} display="flex" justifyContent="space-between">
              <Box>
                <TextField
                  label="Từ ngày"
                  variant="outlined"
                  type="date"
                  value={importStartDate}
                  onChange={(e) => setImportStartDate(e.target.value)}
                  sx={{ marginRight: 2 }}
                  InputLabelProps={{ shrink: true }}
                />
                <TextField
                  label="Đến ngày"
                  variant="outlined"
                  type="date"
                  value={importEndDate}
                  onChange={(e) => setImportEndDate(e.target.value)}
                  sx={{ marginRight: 2 }}
                  InputLabelProps={{ shrink: true }}
                />
              </Box>
            </Box>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Tên Sản Phẩm</TableCell>
                    <TableCell>Số Lượng</TableCell>
                    <TableCell>Giá Nhập</TableCell>
                    <TableCell>Tổng Giá</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredImportData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(({ nameOfProduct, quantity, priceImport, totalPrice }) => (
                    <TableRow key={nameOfProduct}>
                      <TableCell>{nameOfProduct}</TableCell>
                      <TableCell>{quantity}</TableCell>
                      <TableCell>{priceImport.toLocaleString()} VND</TableCell>
                      <TableCell>{totalPrice.toLocaleString()} VND</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
                <TableFooter>
                  <TableRow>
                    <TableCell colSpan={3} style={{ fontSize: '1rem', textAlign: 'left' }}>
                      <strong>Tổng giá toàn bộ sản phẩm nhập</strong>
                    </TableCell>
                    <TableCell style={{ fontSize: '1rem', textAlign: 'left' }}>
                      <strong>{filteredImportData.reduce((acc, item) => acc + item.totalPrice, 0).toLocaleString()} VND</strong>
                    </TableCell>
                  </TableRow>
                </TableFooter>
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={filteredImportData.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handlePageChange}
              onRowsPerPageChange={handleRowsPerPageChange}
            />
          </Paper>
        ) : activeView === 'topProducts' ? (
          <Paper sx={{ width: '100%', overflow: 'hidden' }}>
            <Typography variant="h5" component="h2" sx={{ p: 2, fontWeight: 'bold' }}>
              Sản phẩm bán chạy nhất
            </Typography>
            <Box sx={{ p: 2 }} display="flex" justifyContent="space-between">
              <Box>
                <TextField
                  label="Từ ngày"
                  variant="outlined"
                  type="date"
                  value={topProductsStartDate}
                  onChange={(e) => setTopProductsStartDate(e.target.value)}
                  sx={{ marginRight: 2 }}
                  InputLabelProps={{ shrink: true }}
                />
                <TextField
                  label="Đến ngày"
                  variant="outlined"
                  type="date"
                  value={topProductsEndDate}
                  onChange={(e) => setTopProductsEndDate(e.target.value)}
                  sx={{ marginRight: 2 }}
                  InputLabelProps={{ shrink: true }}
                />
              </Box>
            </Box>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Tên Sản Phẩm</TableCell>
                    <TableCell>Số Lượng</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {topSellingProducts.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(({ nameOfProduct, quantity }) => (
                    <TableRow key={nameOfProduct}>
                      <TableCell>{nameOfProduct}</TableCell>
                      <TableCell>{quantity}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={topSellingProducts.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handlePageChange}
              onRowsPerPageChange={handleRowsPerPageChange}
            />
          </Paper>
        ) : activeView === 'lowStock' ? (
          <Paper sx={{ width: '100%', overflow: 'hidden' }}>
            <Typography variant="h5" component="h2" sx={{ p: 2, fontWeight: 'bold' }}>
              Sản phẩm bán được ít
            </Typography>
            <Box sx={{ p: 2 }} display="flex" justifyContent="space-between">
              <Box>
                <TextField
                  label="Từ ngày"
                  variant="outlined"
                  type="date"
                  value={lowStockStartDate}
                  onChange={(e) => setLowStockStartDate(e.target.value)}
                  sx={{ marginRight: 2 }}
                  InputLabelProps={{ shrink: true }}
                />
                <TextField
                  label="Đến ngày"
                  variant="outlined"
                  type="date"
                  value={lowStockEndDate}
                  onChange={(e) => setLowStockEndDate(e.target.value)}
                  sx={{ marginRight: 2 }}
                  InputLabelProps={{ shrink: true }}
                />
              </Box>
            </Box>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Tên Sản Phẩm</TableCell>
                    <TableCell>Số Lượng</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {lowStockProducts.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(({ nameOfProduct, quantity }) => (
                    <TableRow key={nameOfProduct}>
                      <TableCell>{nameOfProduct}</TableCell>
                      <TableCell>{quantity}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={lowStockProducts.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handlePageChange}
              onRowsPerPageChange={handleRowsPerPageChange}
            />
          </Paper>
        ) : activeView === 'table' ? (
          <Paper sx={{ width: '100%', overflow: 'hidden' }}>
            <Typography variant="h5" component="h2" sx={{ p: 2, fontWeight: 'bold' }}>
              Danh sách lượt bán sản phẩm
            </Typography>
            <Box sx={{ p: 2 }} display="flex" justifyContent="space-between">
              <Box>
                <TextField
                  label="Từ ngày"
                  variant="outlined"
                  type="date"
                  value={tableStartDate}
                  onChange={(e) => setTableStartDate(e.target.value)}
                  sx={{ marginRight: 2 }}
                  InputLabelProps={{ shrink: true }}
                />
                <TextField
                  label="Đến ngày"
                  variant="outlined"
                  type="date"
                  value={tableEndDate}
                  onChange={(e) => setTableEndDate(e.target.value)}
                  sx={{ marginRight: 2 }}
                  InputLabelProps={{ shrink: true }}
                />
              </Box>
              <TextField
                label="Tìm kiếm sản phẩm"
                variant="outlined"
                size="small"
                value={searchTerm}
                onChange={handleSearch}
                sx={{ flex: 1 }}
              />
            </Box>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Tên Sản Phẩm</TableCell>
                    <TableCell>Số Lượng</TableCell>
                    <TableCell>Tổng giá</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredOrders.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(({ nameOfProduct, quantity, totalPrice }) => (
                    <TableRow key={nameOfProduct}>
                      <TableCell>{nameOfProduct}</TableCell>
                      <TableCell>{quantity}</TableCell>
                      <TableCell>{totalPrice.toLocaleString()} VND</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
                <TableFooter>
                  <TableRow>
                    <TableCell colSpan={2} style={{ fontSize: '1rem', textAlign: 'left' }}>
                      <strong>Tổng giá toàn bộ sản phẩm đã bán</strong>
                    </TableCell>
                    <TableCell style={{ fontSize: '1rem', textAlign: 'left' }}>
                      <strong>{filteredOrders.reduce((acc, product) => acc + product.totalPrice, 0).toLocaleString()} VND</strong>
                    </TableCell>
                  </TableRow>
                </TableFooter>
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={filteredOrders.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handlePageChange}
              onRowsPerPageChange={handleRowsPerPageChange}
            />
          </Paper>
        ) : null}
      </div>
    </div>
  );
};

export default StatisticsManagement;

