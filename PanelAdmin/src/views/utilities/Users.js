import { Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { supabase } from '../../services/supabaseClient';

const UsersTable = () => {
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const usersPerPage = 5;

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        let query = supabase.from('user_profile').select('*');

        if (searchTerm) {
          query = query.ilike('name', `%${searchTerm}%`);
        }

        const { data, error } = await query.range((page - 1) * usersPerPage, page * usersPerPage - 1);
        if (error) throw error;
        setUsers(data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, [page, searchTerm]);

  const handleNextPage = () => {
    setPage((prevPage) => prevPage + 1);
  };

  const handlePreviousPage = () => {
    setPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  return (
    <div style={{ padding: '20px' }}>
      <Typography variant="h4" gutterBottom style={{ textAlign: 'center', color: '#00796B' }}>
        User Management
      </Typography>
      <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'center' }}>
        <TextField
          label="Search by Name"
          variant="outlined"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ width: '300px' }}
        />
      </div>
      <TableContainer component={Paper} style={{ marginTop: '20px' }}>
        <Table>
          <TableHead>
            <TableRow style={{ backgroundColor: '#00796B' }}>
              <TableCell style={{ color: '#FFFFFF' }}>ID</TableCell>
              <TableCell style={{ color: '#FFFFFF' }}>Name</TableCell>
              <TableCell style={{ color: '#FFFFFF' }}>Email</TableCell>
              {/* Add more columns as needed */}
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.id}</TableCell>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                {/* Add more cells as needed */}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'space-between' }}>
        <Button
          variant="contained"
          onClick={handlePreviousPage}
          disabled={page === 1}
          style={{ backgroundColor: '#00796B', color: '#FFFFFF' }}
        >
          Previous
        </Button>
        <Button variant="contained" onClick={handleNextPage} style={{ backgroundColor: '#00796B', color: '#FFFFFF' }}>
          Next
        </Button>
      </div>
    </div>
  );
};

export default UsersTable;
