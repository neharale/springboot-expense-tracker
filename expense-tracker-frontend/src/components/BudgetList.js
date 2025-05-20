import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  LinearProgress,
  IconButton,
  Grid
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';

function BudgetList({ onEdit, onBudgetChanged }) {
  const [budgets, setBudgets] = useState([]);
  const [budgetStatuses, setBudgetStatuses] = useState({});

  useEffect(() => {
    fetchBudgets();
  }, []);

  const fetchBudgets = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:8080/api/budgets', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setBudgets(response.data);
      
      // Fetch status for each budget
      response.data.forEach(budget => {
        fetchBudgetStatus(budget.category);
      });
    } catch (error) {
      console.error('Error fetching budgets:', error);
    }
  };

  const fetchBudgetStatus = async (category) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`http://localhost:8080/api/budgets/${category}/status`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setBudgetStatuses(prev => ({
        ...prev,
        [category]: response.data
      }));
    } catch (error) {
      console.error('Error fetching budget status:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:8080/api/budgets/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (onBudgetChanged) onBudgetChanged();
      fetchBudgets();
    } catch (error) {
      console.error('Error deleting budget:', error);
    }
  };

  return (
    <Box sx={{ mt: 4 }}>
      <Grid container spacing={3}>
        {budgets.map((budget) => {
          const status = budgetStatuses[budget.category];
          const percentageUsed = status ? status.percentageUsed : 0;
          
          return (
            <Grid item xs={12} sm={6} md={4} key={budget.id}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {budget.category}
                  </Typography>
                  <Typography color="textSecondary" gutterBottom>
                    Budget: ${budget.amount}
                  </Typography>
                  {status && (
                    <>
                      <Typography color="textSecondary">
                        Spent: ${status.totalSpent}
                      </Typography>
                      <Typography color="textSecondary">
                        Remaining: ${status.remaining}
                      </Typography>
                      <Box sx={{ mt: 2 }}>
                        <LinearProgress
                          variant="determinate"
                          value={Math.min(percentageUsed, 100)}
                          color={percentageUsed > 100 ? 'error' : 'primary'}
                        />
                        <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                          {percentageUsed.toFixed(1)}% used
                        </Typography>
                      </Box>
                    </>
                  )}
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                    <IconButton onClick={() => onEdit(budget)} color="primary">
                      <EditIcon />
                    </IconButton>
                    <IconButton onClick={() => handleDelete(budget.id)} color="error">
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
}

export default BudgetList; 