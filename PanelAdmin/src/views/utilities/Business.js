// src/components/BusinessTable.js
import { Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { supabase } from '../../services/supabaseClient';

function BusinessTable() {
  const [businesses, setBusinesses] = useState([]);
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const businessesPerPage = 5;

  useEffect(() => {
    const fetchBusinesses = async () => {
      try {
        let query = supabase.from('business').select('*');

        if (searchTerm) {
          query = query.ilike('name', `%${searchTerm}%`);
        }

        const { data, error } = await query.range((page - 1) * businessesPerPage, page * businessesPerPage - 1);
        if (error) throw error;
        setBusinesses(data);
      } catch (error) {
        console.error('Error fetching businesses:', error);
      }
    };

    fetchBusinesses();
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
        Business Management
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
              <TableCell style={{ color: '#FFFFFF' }}>Name</TableCell>
              <TableCell style={{ color: '#FFFFFF' }}>Description</TableCell>
              <TableCell style={{ color: '#FFFFFF' }}>Address</TableCell>
              <TableCell style={{ color: '#FFFFFF' }}>Business Type</TableCell>
              <TableCell style={{ color: '#FFFFFF' }}>Manager ID</TableCell>
              <TableCell style={{ color: '#FFFFFF' }}>Phone</TableCell>
              <TableCell style={{ color: '#FFFFFF' }}>Email</TableCell>
              <TableCell style={{ color: '#FFFFFF' }}>Created At</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {businesses.map((business) => (
              <TableRow key={business.id}>
                <TableCell>{business.name}</TableCell>
                <TableCell>{business.description}</TableCell>
                <TableCell>{business.address}</TableCell>
                <TableCell>{business.business_type}</TableCell>
                <TableCell>{business.manager_id}</TableCell>
                <TableCell>{business.phone}</TableCell>
                <TableCell>{business.email}</TableCell>
                <TableCell>{new Date(business.created_at).toLocaleString()}</TableCell>
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
}

export default BusinessTable;
