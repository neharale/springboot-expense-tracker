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

  useEffect(() => {
    if (editingExpense) {
      setForm(editingExpense);
    } else {
      setForm({ title: '', amount: '', date: '', category: '', description: '' });
    }
  }, [editingExpense]);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      if (editingExpense) {
        await axios.put(`http://localhost:8080/api/expenses/${editingExpense.id}`, form, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setMessage('Expense updated!');
      } else {
        await axios.post('http://localhost:8080/api/expenses', form, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setMessage('Expense added!');
      }
      setForm({ title: '', amount: '', date: '', category: '', description: '' });
      if (onExpenseAdded) onExpenseAdded();
      if (onCancelEdit) onCancelEdit();
    } catch (err) {
      setMessage('Failed to save expense');
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
    </Box>
  );
}

export default ExpenseForm;