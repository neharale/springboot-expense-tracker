import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { TextField, Button, Box, Typography, Alert } from '@mui/material';

function ExpenseForm({ onExpenseAdded, editingExpense, onCancelEdit }) {
  const [form, setForm] = useState({
    title: '',
    amount: '',
    date: '',
    category: '',
    description: ''
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (editingExpense) {
      setForm({
        title: editingExpense.title || '',
        amount: editingExpense.amount || '',
        date: editingExpense.date || '',
        category: editingExpense.category || '',
        description: editingExpense.description || ''
      });
    } else {
      setForm({
        title: '',
        amount: '',
        date: '',
        category: '',
        description: ''
      });
    }
  }, [editingExpense]);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError(''); // Clear error when user makes changes
  };

  const validateForm = () => {
    if (!form.title) {
      setError('Title is required');
      return false;
    }
    if (!form.amount || form.amount <= 0) {
      setError('Amount must be greater than 0');
      return false;
    }
    if (!form.date) {
      setError('Date is required');
      return false;
    }
    if (!form.category) {
      setError('Category is required');
      return false;
    }
    return true;
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (!validateForm()) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('You must be logged in to create an expense');
        return;
      }

      const headers = { 
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      };

      // Format the data properly
      const expenseData = {
        ...form,
        amount: parseFloat(form.amount),
        date: form.date
      };

      console.log('Sending expense data:', expenseData); // Debug log

      if (editingExpense) {
        const response = await axios.put(
          `http://localhost:8080/api/expenses/${editingExpense.id}`,
          expenseData,
          { headers }
        );
        console.log('Update response:', response.data); // Debug log
        setMessage('Expense updated successfully!');
      } else {
        const response = await axios.post(
          'http://localhost:8080/api/expenses',
          expenseData,
          { headers }
        );
        console.log('Create response:', response.data); // Debug log
        setMessage('Expense added successfully!');
      }

      // Reset form
      setForm({
        title: '',
        amount: '',
        date: '',
        category: '',
        description: ''
      });

      if (onExpenseAdded) onExpenseAdded();
      if (onCancelEdit) onCancelEdit();
    } catch (err) {
      console.error('Error saving expense:', err);
      console.error('Error response:', err.response); // Debug log
      
      if (err.response) {
        setError(err.response.data || 'Failed to save expense. Please try again.');
      } else if (err.request) {
        setError('No response from server. Please check your connection.');
      } else {
        setError('Error setting up the request: ' + err.message);
      }
    }
  };

  return (
    <Box sx={{ maxWidth: 500, mx: 'auto', mt: 4 }}>
      <Typography variant="h5" gutterBottom>
        {editingExpense ? 'Edit Expense' : 'Add Expense'}
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Title"
          name="title"
          value={form.title}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
        />
        <TextField
          label="Amount"
          name="amount"
          type="number"
          value={form.amount}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
        />
        <TextField
          label="Date"
          name="date"
          type="date"
          value={form.date}
          onChange={handleChange}
          fullWidth
          margin="normal"
          InputLabelProps={{ shrink: true }}
          required
        />
        <TextField
          label="Category"
          name="category"
          value={form.category}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
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
            {editingExpense ? 'Update' : 'Add'}
          </Button>
          {editingExpense && (
            <Button type="button" variant="outlined" color="secondary" onClick={onCancelEdit}>
              Cancel
            </Button>
          )}
        </Box>
      </form>
      {message && <Alert severity={message.includes('added') || message.includes('updated') ? 'success' : 'error'} sx={{ mt: 2 }}>{message}</Alert>}
      {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
    </Box>
  );
}

export default ExpenseForm;