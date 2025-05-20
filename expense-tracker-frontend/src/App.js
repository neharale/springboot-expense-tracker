import React, { useState } from 'react';
import { Typography, Box, Button, Container } from '@mui/material';
import Register from './components/Register';
import Login from './components/Login';
import UserProfile from './components/UserProfile';
import ExpenseForm from './components/ExpenseForm';
import ExpenseList from './components/ExpenseList';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [refresh, setRefresh] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  const [showProfile, setShowProfile] = useState(false);

  const handleExpenseChanged = () => setRefresh(!refresh);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setShowProfile(false);
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #e0eafc 0%, #cfdef3 100%)',
        py: 6,
      }}
    >
      <Container maxWidth="md">
        <Typography
          variant="h2"
          align="center"
          sx={{
            fontWeight: 'bold',
            color: '#1976d2',
            letterSpacing: 2,
            mb: 4,
            textShadow: '2px 2px 8px #b0c4de',
          }}
        >
          Expense Tracker
        </Typography>
        {!token ? (
          <>
            <Register />
            <Login onLogin={setToken} />
          </>
        ) : (
          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2, gap: 2 }}>
              <Button
                variant="contained"
                color={showProfile ? 'secondary' : 'primary'}
                onClick={() => setShowProfile(!showProfile)}
              >
                {showProfile ? 'Hide Profile' : 'Show Profile'}
              </Button>
              <Button variant="outlined" color="error" onClick={handleLogout}>
                Logout
              </Button>
            </Box>
            {showProfile && <UserProfile />}
            <ExpenseForm
              onExpenseAdded={handleExpenseChanged}
              editingExpense={editingExpense}
              onCancelEdit={() => setEditingExpense(null)}
            />
            <ExpenseList
              onEdit={setEditingExpense}
              onExpenseChanged={handleExpenseChanged}
              key={refresh}
            />
          </Box>
        )}
      </Container>
    </Box>
  );
}

export default App;