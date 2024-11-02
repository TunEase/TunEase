import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography
} from '@mui/material';
import { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { supabase } from '../../services/supabaseClient';

const UsersTable = () => {
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [open, setOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const usersPerPage = 5;

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

  useEffect(() => {
    fetchUsers();
  }, [page, searchTerm]);

  const handleNextPage = () => {
    setPage((prevPage) => prevPage + 1);
  };

  const handlePreviousPage = () => {
    setPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  const handleOpenDialog = (user = null) => {
    setCurrentUser(user);
    setOpen(true);
  };

  const handleCloseDialog = () => {
    setOpen(false);
    setCurrentUser(null);
  };

  const handleSaveUser = async () => {
    try {
      if (currentUser && currentUser.id) {
        // Update existing user
        const { error } = await supabase
          .from('user_profile')
          .update({ name: currentUser.name, email: currentUser.email })
          .eq('id', currentUser.id);

        if (error) throw error;
      } else {
        // Create new user with a generated UUID
        const newUser = {
          id: uuidv4(), // Generate a new UUID
          name: currentUser.name,
          email: currentUser.email
        };

        const { error } = await supabase.from('user_profile').insert([newUser]);

        if (error) throw error;
      }

      // Refresh the user list
      fetchUsers(currentUser.id);
      handleCloseDialog();
    } catch (error) {
      console.error('Error saving user:', error);
    }
  };

  const handleDeleteUser = async (userId) => {
    try {
      // Delete related complaints
      const { error: complaintsError } = await supabase.from('complaints').delete().eq('assigned_to', userId);

      if (complaintsError) throw complaintsError;

      // Delete the user
      const { error: userError } = await supabase.from('user_profile').delete().eq('id', userId);

      if (userError) throw userError;

      // Refresh the user list
      fetchUsers();
    } catch (error) {
      console.error('Error deleting user:', error);
    }
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
        <Button
          variant="contained"
          onClick={() => handleOpenDialog()}
          style={{ marginLeft: '16px', backgroundColor: '#00796B', color: '#FFFFFF' }}
        >
          Add User
        </Button>
      </div>
      <TableContainer component={Paper} style={{ marginTop: '20px' }}>
        <Table>
          <TableHead>
            <TableRow style={{ backgroundColor: '#00796B' }}>
              <TableCell style={{ color: '#FFFFFF' }}>ID</TableCell>
              <TableCell style={{ color: '#FFFFFF' }}>Name</TableCell>
              <TableCell style={{ color: '#FFFFFF' }}>Email</TableCell>
              <TableCell style={{ color: '#FFFFFF' }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.id}</TableCell>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    onClick={() => handleOpenDialog(user)}
                    style={{ marginRight: '8px', backgroundColor: '#00796B', color: '#FFFFFF' }}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="contained"
                    onClick={() => handleDeleteUser(user.id)}
                    style={{ backgroundColor: '#d32f2f', color: '#FFFFFF' }}
                  >
                    Delete
                  </Button>
                </TableCell>
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

      <Dialog open={open} onClose={handleCloseDialog}>
        <DialogTitle>{currentUser ? 'Edit User' : 'Add User'}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Name"
            type="text"
            fullWidth
            value={currentUser?.name || ''}
            onChange={(e) => setCurrentUser({ ...currentUser, name: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Email"
            type="email"
            fullWidth
            value={currentUser?.email || ''}
            onChange={(e) => setCurrentUser({ ...currentUser, email: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={handleSaveUser} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default UsersTable;
