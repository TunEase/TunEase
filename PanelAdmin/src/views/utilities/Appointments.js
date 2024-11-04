// src/components/AppointmentsTable.js
import { Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { supabase } from '../../services/supabaseClient';

function AppointmentsTable() {
  const [appointments, setAppointments] = useState([]);
  const [page, setPage] = useState(1);
  const [searchDate, setSearchDate] = useState('');
  const appointmentsPerPage = 5;

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        let query = supabase.from('appointments').select('*');

        if (searchDate) {
          query = query.eq('date', searchDate);
        }

        const { data, error } = await query.range((page - 1) * appointmentsPerPage, page * appointmentsPerPage - 1);
        if (error) throw error;
        setAppointments(data);
      } catch (error) {
        console.error('Error fetching appointments:', error);
      }
    };

    fetchAppointments();
  }, [page, searchDate]);

  const handleNextPage = () => {
    setPage((prevPage) => prevPage + 1);
  };

  const handlePreviousPage = () => {
    setPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  return (
    <div style={{ padding: '20px' }}>
      <Typography variant="h4" gutterBottom style={{ textAlign: 'center', color: '#00796B' }}>
        Appointments Management
      </Typography>
      <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'center' }}>
        <TextField
          label="Search by Date"
          type="date"
          InputLabelProps={{ shrink: true }}
          variant="outlined"
          value={searchDate}
          onChange={(e) => setSearchDate(e.target.value)}
          style={{ width: '300px' }}
        />
      </div>
      <TableContainer component={Paper} style={{ marginTop: '20px' }}>
        <Table>
          <TableHead>
            <TableRow style={{ backgroundColor: '#00796B' }}>
              <TableCell style={{ color: '#FFFFFF' }}>Service ID</TableCell>
              <TableCell style={{ color: '#FFFFFF' }}>Client ID</TableCell>
              <TableCell style={{ color: '#FFFFFF' }}>Date</TableCell>
              <TableCell style={{ color: '#FFFFFF' }}>Start Time</TableCell>
              <TableCell style={{ color: '#FFFFFF' }}>End Time</TableCell>
              <TableCell style={{ color: '#FFFFFF' }}>Status</TableCell>
              <TableCell style={{ color: '#FFFFFF' }}>Created At</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {appointments.map((appointment) => (
              <TableRow key={appointment.id}>
                <TableCell>{appointment.service_id}</TableCell>
                <TableCell>{appointment.client_id}</TableCell>
                <TableCell>{appointment.date}</TableCell>
                <TableCell>{appointment.start_time}</TableCell>
                <TableCell>{appointment.end_time}</TableCell>
                <TableCell>{appointment.status}</TableCell>
                <TableCell>{new Date(appointment.created_at).toLocaleString()}</TableCell>
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

export default AppointmentsTable;
