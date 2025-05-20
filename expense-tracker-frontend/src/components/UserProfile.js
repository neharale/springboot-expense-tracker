import React, { useEffect, useState } from 'react';
import axios from 'axios';

function UserProfile() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:8080/api/user/me', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUser(res.data);
    };
    fetchUser();
  }, []);

  if (!user) return <div>Loading profile...</div>;

  return (
    <div>
      <h2>User Profile</h2>
      <p><strong>Username:</strong> {user.username}</p>
      {/* Add more fields as needed */}
    </div>
  );
}

export default UserProfile;