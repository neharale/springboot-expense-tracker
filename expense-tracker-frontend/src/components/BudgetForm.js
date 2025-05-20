import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import axios from 'axios';

function BudgetForm({ onBudgetAdded, editingBudget, onCancelEdit }) {
  const [form, setForm] = useState({
    category: '',
    amount: '',
    startDate: '',
    endDate: '',
    description: ''
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  React.useEffect(() => {
    if (editingBudget) {
      setForm({
        category: editingBudget.category || '',
        amount: editingBudget.amount || '',
        startDate: editingBudget.startDate || '',
        endDate: editingBudget.endDate || '',
        description: editingBudget.description || ''
      });
    } else {
      setForm({
        category: '',
        amount: '',
        startDate: '',
        endDate: '',
        description: ''
      });
    }
  }, [editingBudget]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError(''); // Clear error when user makes changes
  };

  const validateForm = () => {
    if (!form.category) {
      setError('Category is required');
      return false;
    }
    if (!form.amount || form.amount <= 0) {
      setError('Amount must be greater than 0');
      return false;
    }
    if (!form.startDate) {
      setError('Start date is required');
      return false;
    }
    if (!form.endDate) {
      setError('End date is required');
      return false;
    }
    if (new Date(form.startDate) > new Date(form.endDate)) {
      setError('Start date must be before end date');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (!validateForm()) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('You must be logged in to create a budget');
        return;
      }

      const headers = { 
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      };

      // Format the data properly
      const budgetData = {
        ...form,
        amount: parseFloat(form.amount),
        startDate: form.startDate,
        endDate: form.endDate
      };

      console.log('Sending budget data:', budgetData); // Debug log

      if (editingBudget) {
        const response = await axios.put(
          `http://localhost:8080/api/budgets/${editingBudget.id}`,
          budgetData,
          { headers }
        );
        console.log('Update response:', response.data); // Debug log
        setMessage('Budget updated successfully!');
      } else {
        const response = await axios.post(
          'http://localhost:8080/api/budgets',
          budgetData,
          { headers }
        );
        console.log('Create response:', response.data); // Debug log
        setMessage('Budget added successfully!');
      }

      // Reset form
      setForm({
        category: '',
        amount: '',
        startDate: '',
        endDate: '',
        description: ''
      });

      if (onBudgetAdded) onBudgetAdded();
      if (onCancelEdit) onCancelEdit();
    } catch (err) {
      console.error('Error saving budget:', err);
      console.error('Error response:', err.response); // Debug log
      
      if (err.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        setError(err.response.data || 'Failed to save budget. Please try again.');
      } else if (err.request) {
        // The request was made but no response was received
        setError('No response from server. Please check your connection.');
      } else {
        // Something happened in setting up the request that triggered an Error
        setError('Error setting up the request: ' + err.message);
      }
    }
  };

  return (
    <Box sx={{ maxWidth: 500, mx: 'auto', mt: 4 }}>
      <Typography variant="h5" gutterBottom>
        {editingBudget ? 'Edit Budget' : 'Add Budget'}
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          select
          label="Category"
          name="category"
          value={form.category}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
          error={!!error && !form.category}
        >
          <MenuItem value="Food">Food</MenuItem>
          <MenuItem value="Transportation">Transportation</MenuItem>
          <MenuItem value="Entertainment">Entertainment</MenuItem>
          <MenuItem value="Shopping">Shopping</MenuItem>
          <MenuItem value="Bills">Bills</MenuItem>
          <MenuItem value="Other">Other</MenuItem>
        </TextField>
        <TextField
          label="Amount"
          name="amount"
          type="number"
          value={form.amount}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
          error={!!error && (!form.amount || form.amount <= 0)}
          inputProps={{ min: "0", step: "0.01" }}
        />
        <TextField
          label="Start Date"
          name="startDate"
          type="date"
          value={form.startDate}
          onChange={handleChange}
          fullWidth
          margin="normal"
          InputLabelProps={{ shrink: true }}
          required
          error={!!error && !form.startDate}
        />
        <TextField
          label="End Date"
          name="endDate"
          type="date"
          value={form.endDate}
          onChange={handleChange}
          fullWidth
          margin="normal"
          InputLabelProps={{ shrink: true }}
          required
          error={!!error && !form.endDate}
        />
        <TextField
          label="Description"
          name="description"
          value={form.description}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
          <Button type="submit" variant="contained" color="primary">
            {editingBudget ? 'Update' : 'Add'}
          </Button>
          {editingBudget && (
            <Button type="button" variant="outlined" color="secondary" onClick={onCancelEdit}>
              Cancel
            </Button>
          )}
        </Box>
      </form>
      {error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      )}
      {message && (
        <Alert severity="success" sx={{ mt: 2 }}>
          {message}
        </Alert>
      )}
    </Box>
  );
}

export default BudgetForm;