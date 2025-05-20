import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Box,
  TextField,
  MenuItem,
  Grid,
  Typography
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import FilterListIcon from '@mui/icons-material/FilterList';
import axios from 'axios';
import ExpenseChart from './ExpenseChart';

function ExpenseList({ onEdit, onExpenseChanged }) {
  const [expenses, setExpenses] = useState([]);
  const [filteredExpenses, setFilteredExpenses] = useState([]);
  const [filters, setFilters] = useState({
    category: '',
    dateFrom: '',
    dateTo: '',
    minAmount: '',
    maxAmount: ''
  });

  useEffect(() => {
    fetchExpenses();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [expenses, filters]);

  const fetchExpenses = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:8080/api/expenses', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setExpenses(response.data);
      setFilteredExpenses(response.data);
    } catch (error) {
      console.error('Error fetching expenses:', error);
    }
  };

  const applyFilters = () => {
    let filtered = [...expenses];

    if (filters.category) {
      filtered = filtered.filter(exp => exp.category === filters.category);
    }

    if (filters.dateFrom) {
      filtered = filtered.filter(exp => new Date(exp.date) >= new Date(filters.dateFrom));
    }

    if (filters.dateTo) {
      filtered = filtered.filter(exp => new Date(exp.date) <= new Date(filters.dateTo));
    }

    if (filters.minAmount) {
      filtered = filtered.filter(exp => Number(exp.amount) >= Number(filters.minAmount));
    }

    if (filters.maxAmount) {
      filtered = filtered.filter(exp => Number(exp.amount) <= Number(filters.maxAmount));
    }

    setFilteredExpenses(filtered);
  };

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value
    });
  };

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:8080/api/expenses/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (onExpenseChanged) onExpenseChanged();
      fetchExpenses();
    } catch (error) {
      console.error('Error deleting expense:', error);
    }
  };

  // Get unique categories for filter dropdown
  const categories = [...new Set(expenses.map(exp => exp.category))];

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h6" gutterBottom>
        <FilterListIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
        Filter Expenses
      </Typography>

      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <TextField
            select
            fullWidth
            label="Category"
            name="category"
            value={filters.category}
            onChange={handleFilterChange}
          >
            <MenuItem value="">All Categories</MenuItem>
            {categories.map(category => (
              <MenuItem key={category} value={category}>{category}</MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <TextField
            type="date"
            fullWidth
            label="From Date"
            name="dateFrom"
            value={filters.dateFrom}
            onChange={handleFilterChange}
            InputLabelProps={{ shrink: true }}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <TextField
            type="date"
            fullWidth
            label="To Date"
            name="dateTo"
            value={filters.dateTo}
            onChange={handleFilterChange}
            InputLabelProps={{ shrink: true }}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <TextField
            type="number"
            fullWidth
            label="Min Amount"
            name="minAmount"
            value={filters.minAmount}
            onChange={handleFilterChange}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <TextField
            type="number"
            fullWidth
            label="Max Amount"
            name="maxAmount"
            value={filters.maxAmount}
            onChange={handleFilterChange}
          />
        </Grid>
      </Grid>

      <Box sx={{ mb: 4 }}>
        <ExpenseChart expenses={filteredExpenses} />
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredExpenses.map((expense) => (
              <TableRow key={expense.id}>
                <TableCell>{expense.title}</TableCell>
                <TableCell>${expense.amount}</TableCell>
                <TableCell>{new Date(expense.date).toLocaleDateString()}</TableCell>
                <TableCell>{expense.category}</TableCell>
                <TableCell>{expense.description}</TableCell>
                <TableCell>
                  <IconButton onClick={() => onEdit(expense)} color="primary">
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(expense.id)} color="error">
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

export default ExpenseList;